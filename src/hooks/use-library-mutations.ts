import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// --- Fonctions de Mutation (logique d'appel API) ---

const deleteBook = async (bookId: string) => {
  const response = await fetch(`/api/library/${bookId}`, { method: 'DELETE' });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Impossible de supprimer le livre.');
  }
  return response.json();
};

const archiveBook = async ({ bookId, is_archived }: { bookId: string; is_archived: boolean }) => {
  const response = await fetch(`/api/library/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_archived }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Impossible de mettre à jour le statut d\'archivage.');
  }
  return response.json();
};

const updateBookStatus = async ({ bookId, status }: { bookId: string; status: string }) => {
  const response = await fetch(`/api/library/${bookId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Impossible de mettre à jour le statut.');
  }
  return response.json();
};

// --- Hooks de Mutation (utilisent la logique ci-dessus avec TanStack Query) ---

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      toast({ title: 'Succès', description: 'Livre supprimé avec succès.' });
      queryClient.invalidateQueries({ queryKey: ['user-library'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });
};

export const useArchiveBook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: archiveBook,
    onSuccess: (_data, { is_archived }) => {
      toast({ title: 'Succès', description: `Livre ${is_archived ? 'archivé' : 'désarchivé'} avec succès.` });
      queryClient.invalidateQueries({ queryKey: ['user-library'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateBookStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateBookStatus,
    onSuccess: (data) => {
      // Affiche un toast pour chaque nouveau badge obtenu
      if (data.awardedBadges && data.awardedBadges.length > 0) {
        data.awardedBadges.forEach((badge: any) => {
          toast({
            title: 'Nouveau badge débloqué !',
            description: `Vous avez obtenu le badge : ${badge.name}`,
          });
        });
      }
      queryClient.invalidateQueries({ queryKey: ['user-library'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });
};