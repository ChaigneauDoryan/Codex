
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  // IMPORTANT: Remplacez cette URL par l'URL de votre site en production
  const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Exemple: si vous avez des pages privées
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
