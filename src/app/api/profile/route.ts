import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// --- GET: Récupérer toutes les données du profil ---
export async function GET() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    // Exécuter toutes les requêtes en parallèle pour plus d'efficacité
    const [profileRes, statsRes, badgesRes, userBooksRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.rpc('get_user_stats', { p_user_id: user.id }),
      supabase.from('user_badges').select('unlocked_at, badges (*)').eq('user_id', user.id),
      supabase.from('user_books').select('finished_at, books(genre, author)').eq('user_id', user.id).eq('is_archived', false)
    ]);

    // Gestion des erreurs pour chaque requête
    if (profileRes.error) throw profileRes.error;
    if (statsRes.error) throw statsRes.error;
    if (badgesRes.error) throw badgesRes.error;
    if (userBooksRes.error) throw userBooksRes.error;

    // --- Traitement des données ---
    const profile = profileRes.data;
    const stats = statsRes.data[0];
    const badges = badgesRes.data.map((item: any) => ({ ...item.badges, unlocked_at: item.unlocked_at }));

    // Calcul du rythme de lecture
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentBooksCount = userBooksRes.data.filter(b => b.finished_at && new Date(b.finished_at) > thirtyDaysAgo).length;
    let readingPace = null;
    if (recentBooksCount >= 4) readingPace = 'passionate';
    else if (recentBooksCount >= 2) readingPace = 'regular';
    else if (recentBooksCount >= 1) readingPace = 'occasional';

    // Calcul des genres et auteurs favoris
    const genreCounts: { [key: string]: number } = {};
    const authorCounts: { [key: string]: number } = {};
    userBooksRes.data.forEach((item: any) => {
      if (item.books?.genre) item.books.genre.split(',').forEach((g: string) => { genreCounts[g.trim()] = (genreCounts[g.trim()] || 0) + 1; });
      if (item.books?.author) item.books.author.split(',').forEach((a: string) => { authorCounts[a.trim()] = (authorCounts[a.trim()] || 0) + 1; });
    });
    const topGenres = Object.keys(genreCounts).map(name => ({ name, count: genreCounts[name] })).sort((a, b) => b.count - a.count);
    const topAuthors = Object.keys(authorCounts).map(name => ({ name, count: authorCounts[name] })).sort((a, b) => b.count - a.count);

    return NextResponse.json({ profile, stats, badges, readingPace, topGenres, topAuthors });

  } catch (error: any) {
    console.error('Error fetching profile data:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// --- PATCH: Mettre à jour le profil ---
export async function PATCH(request: Request) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { username, bio, avatar_url } = await request.json();

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ username, bio, avatar_url, updated_at: new Date() })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
