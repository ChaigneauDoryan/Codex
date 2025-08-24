import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// Define types for your database objects
type UserBook = {
  id: string;
  updated_at: string;
};

type Group = {
  id: string;
  updated_at: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

  const cookieStore = cookies();
  const supabase = await createClient(cookieStore); // Add await here

  const staticRoutes = [
    '',
    '/dashboard',
    '/discover',
    '/groups',
    '/library',
    '/library/add-book',
    '/profile',
    '/auth/login',
    '/auth/signup',
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // --- Routes dynamiques pour les livres (user_books) ---
  let bookUrls: MetadataRoute.Sitemap = [];
  try {
    const { data: userBooks, error: booksError } = await supabase
      .from('user_books')
      .select('id, updated_at');

    if (booksError) {
      console.error('Error fetching user books for sitemap:', booksError);
    } else {
      bookUrls = userBooks?.map((book: UserBook) => ({
        url: `${siteUrl}/library/${book.id}`,
        lastModified: new Date(book.updated_at || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })) || [];
    }
  } catch (error) {
    console.error('Error in sitemap generation for books:', error);
  }

  // --- Routes dynamiques pour les groupes ---
  let groupUrls: MetadataRoute.Sitemap = [];
  try {
    const { data: groups, error: groupsError } = await supabase
      .from('groups')
      .select('id, updated_at');

    if (groupsError) {
      console.error('Error fetching groups for sitemap:', groupsError);
    } else {
      groupUrls = groups?.map((group: Group) => ({
        url: `${siteUrl}/groups/${group.id}`,
        lastModified: new Date(group.updated_at || Date.now()),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      })) || [];
    }
  } catch (error) {
    console.error('Error in sitemap generation for groups:', error);
  }

  return [...staticUrls, ...bookUrls, ...groupUrls];
}