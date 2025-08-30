import { createClient } from '@/lib/supabase/server';
import { getUserBooks } from '@/lib/book-utils';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    // Récupérer le profil
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    // Récupérer les livres en cours de lecture (statusId = 2)
    const currentlyReadingBooks = await getUserBooks(supabase, user.id, 2, false);

    // Récupérer les livres terminés (statusId = 3)
    const finishedBooks = await getUserBooks(supabase, user.id, 3, false);
    const recentlyFinishedBooks = (finishedBooks || []).sort((a: any, b: any) => 
        new Date(b.finished_at).getTime() - new Date(a.finished_at).getTime()
      ).slice(0, 4);

    const dashboardData = {
      username: profile?.username || 'lecteur',
      currentlyReading: currentlyReadingBooks || [],
      recentlyFinished: recentlyFinishedBooks || [],
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch dashboard data' }), { status: 500 });
  }
}
