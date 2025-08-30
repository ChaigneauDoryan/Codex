import { cookies } from "next/headers";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getUserBooks } from "@/lib/book-utils";
import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CurrentlyReadingSkeleton } from "@/components/dashboard/CurrentlyReading";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description: "Votre espace personnel. Suivez vos lectures en cours, consultez vos livres terminés et gérez votre activité sur Codex.",
};

// Fonction pour récupérer les données initiales côté serveur
async function getInitialDashboardData() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      username: 'lecteur',
      currentlyReading: [],
      recentlyFinished: [],
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const currentlyReadingBooks = await getUserBooks(supabase, user.id, 2, false);
  const finishedBooks = await getUserBooks(supabase, user.id, 3, false);
  const recentlyFinishedBooks = (finishedBooks || []).sort((a: any, b: any) => 
      new Date(b.finished_at).getTime() - new Date(a.finished_at).getTime()
    ).slice(0, 4);

  return {
    username: profile?.username || 'lecteur',
    currentlyReading: currentlyReadingBooks || [],
    recentlyFinished: recentlyFinishedBooks || [],
  };
}

export default async function DashboardPage() {
  // On récupère les données sur le serveur au premier chargement
  const initialData = await getInitialDashboardData();

  return (
    // Suspense permet d'afficher un fallback pendant que le composant serveur initial charge.
    // Le client prendra ensuite le relais.
    <Suspense fallback={<DashboardFallback />}>
      <DashboardClient initialData={initialData} />
    </Suspense>
  );
}

// Fallback pour le chargement initial
function DashboardFallback() {
  return (
    <div className="space-y-8">
      <DashboardHeader username="..." />
      <CurrentlyReadingSkeleton />
    </div>
  );
}