import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

// La fonction qui récupère les données
async function fetchUserGroups() {
  const supabase = createClient();
  
  // 1. Obtenir l'utilisateur actuel
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Utilisateur non authentifié.');
  }

  // 2. Récupérer les groupes de l'utilisateur
  const { data, error } = await supabase
    .from('group_members')
    .select(
      `
        role,
        groups (*,
          group_members(count),
          invitation_code
        )
      `
    )
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching user groups:', error);
    throw new Error('Impossible de récupérer les groupes.');
  }

  // 3. Transformer les données pour inclure le rôle et le nombre de membres
  return data.map((item: any) => ({
    ...item.groups,
    members_count: item.groups.group_members[0]?.count || 0,
    user_role: item.role,
  }));
}

// Le hook personnalisé
export function useGroups() {
  return useQuery({
    queryKey: ['user-groups'], // Clé de requête unique pour les groupes de l'utilisateur
    queryFn: fetchUserGroups,
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
