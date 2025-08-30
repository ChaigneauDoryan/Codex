'use client';

import { useDashboard, DashboardData } from '@/hooks/use-dashboard';
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CurrentlyReading } from "@/components/dashboard/CurrentlyReading";
import { RecentlyFinished } from "@/components/dashboard/RecentlyFinished";

interface DashboardClientProps {
  initialData: DashboardData;
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  // Le hook TanStack Query prend le relais côté client
  const { data, error } = useDashboard(initialData);

  if (error) {
    return <div>Erreur lors du chargement des données. Veuillez rafraîchir la page.</div>;
  }

  // On utilise les données du hook si elles sont prêtes, sinon on se rabat sur les données initiales du serveur.
  // Cela évite le crash si `data` est momentanément `undefined`.
  const displayData = data || initialData;

  return (
    <div className="space-y-8">
      <DashboardHeader username={displayData.username} />
      <CurrentlyReading books={displayData.currentlyReading} />
      <RecentlyFinished books={displayData.recentlyFinished} />
    </div>
  );
}
