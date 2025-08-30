import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

async function fetchUserLibrary({ queryKey }: { queryKey: any }) {
  const [_key, status, archived] = queryKey;
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error("Utilisateur non authentifié.");
  }

  const params = new URLSearchParams();
  if (status && status !== 'all') {
    params.append('status', status);
  }
  if (archived !== undefined) {
    params.append('archived', String(archived));
  }
  
  const response = await fetch(`/api/library?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Une erreur est survenue: ${response.status}`);
  }
  
  return response.json();
}

export function useLibrary(status: string, archived?: boolean) {
  return useQuery({
    queryKey: ['user-library', status, archived],
    queryFn: fetchUserLibrary,
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