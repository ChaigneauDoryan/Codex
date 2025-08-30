import { useQuery } from '@tanstack/react-query';

// Interface pour typer les données du dashboard
export interface DashboardData {
  username: string;
  currentlyReading: any[]; // Remplacez any par le type de vos livres
  recentlyFinished: any[]; // Remplacez any par le type de vos livres
}

// Fonction de fetch qui appelle notre nouvelle API route
async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch('/api/dashboard');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
}

// Hook personnalisé pour le dashboard
export function useDashboard(initialData: DashboardData) {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
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
