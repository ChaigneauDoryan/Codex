import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// --- Query Hooks ---

// Pour les détails du livre
async function fetchUserBook(id: string) {
  const response = await fetch(`/api/library/${id}`);
  if (!response.ok) throw new Error('Impossible de récupérer les détails du livre.');
  return response.json();
}

export function useUserBook(id: string, initialData: any) {
  return useQuery({
    queryKey: ['user-book', id],
    queryFn: () => fetchUserBook(id),
    initialData: initialData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refresh toutes les 30s
    gcTime: 30 * 60 * 1000, // 30 minutes en cache
    refetchOnWindowFocus: true, // ✅ Refresh au changement d\'onglet
    refetchOnMount: true, // Refresh au montage du composant
    refetchOnReconnect: true, // Refresh à la reconnexion
    retry: 3, // 3 tentatives en cas d\'erreur
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Délai progressif
  });
}

// Pour les commentaires du livre
async function fetchBookComments(id: string) {
  const response = await fetch(`/api/user-books/${id}/comments`);
  if (!response.ok) throw new Error('Impossible de récupérer les commentaires.');
  return response.json();
}

export function useUserBookComments(id: string) {
  return useQuery({
    queryKey: ['user-book-comments', id],
    queryFn: () => fetchBookComments(id),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// --- Mutation Hooks ---

// Pour mettre à jour le statut
async function updateBookStatus({ id, status }: { id: string, status: string }) {
  const response = await fetch(`/api/library/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('La mise à jour du statut a échoué.');
  return response.json();
}

export function useUpdateBookStatus(id: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: updateBookStatus,
    onSuccess: (data) => {
      // Mettre à jour manuellement le cache avec les données retournées pour une UI instantanée
      queryClient.setQueryData(['user-book', id], data.updatedBook);
      if (data.awardedBadges && data.awardedBadges.length > 0) {
        data.awardedBadges.forEach((badge: any) => {
          toast({ title: 'Nouveau badge débloqué !', description: `Vous avez obtenu le badge : ${badge.name}` });
        });
      }
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });
}

// Pour ajouter un commentaire
async function addComment({ id, values }: { id: string, values: any }) {
  const response = await fetch(`/api/user-books/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  if (!response.ok) throw new Error('L\'ajout du commentaire a échoué.');
  return response.json();
}

export function useAddComment(id: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      toast({ title: 'Succès', description: 'Commentaire ajouté.' });
      // Invalider les commentaires pour déclencher un rafraîchissement
      queryClient.invalidateQueries({ queryKey: ['user-book-comments', id] });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });
}
