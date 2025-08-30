import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// --- Query: Récupération des données ---

async function fetchProfileData() {
  const response = await fetch('/api/profile');
  if (!response.ok) {
    throw new Error('Impossible de récupérer les données du profil.');
  }
  return response.json();
}

export function useProfileData() {
  return useQuery({
    queryKey: ['profile-data'],
    queryFn: fetchProfileData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refresh toutes les 30s
    gcTime: 30 * 60 * 1000, // 30 minutes en cache
    refetchOnWindowFocus: true, // ✅ Refresh au changement d'onglet
    refetchOnMount: true, // Refresh au montage du composant
    refetchOnReconnect: true, // Refresh à la reconnexion
    retry: 3, // 3 tentatives en cas d'erreur
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Délai progressif
  });
}

// --- Mutation: Mise à jour du profil ---

async function updateProfile(values: { username: string; bio?: string; avatar_url: string }) {
  const response = await fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    throw new Error('La mise à jour du profil a échoué.');
  }
  return response.json();
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast({ title: 'Succès', description: 'Votre profil a été mis à jour.' });
      // Invalide la query pour la rafraîchir automatiquement avec les nouvelles données
      queryClient.invalidateQueries({ queryKey: ['profile-data'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });
}
