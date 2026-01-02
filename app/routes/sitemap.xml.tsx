/**
 * Dynamic Sitemap for SEO
 * Includes all pages: static, services, local, sectors, blog
 */

import type { Route } from "./+types/sitemap.xml";
import { villes95, services, getVillesPrioritaires } from '~/data/villes-95';
import { secteurs } from '~/data/secteurs';

// Sample blog articles (would come from database in production)
const blogArticles = [
  { slug: 'comment-creer-site-vitrine-efficace', lastmod: '2025-12-15' },
  { slug: 'site-vitrine-vs-landing-page-que-choisir', lastmod: '2025-12-10' },
  { slug: 'pourquoi-entreprises-cergy-ont-besoin-site-web', lastmod: '2025-12-05' },
  { slug: 'site-web-ideal-restaurant', lastmod: '2025-11-28' },
  { slug: 'tendances-webdesign-2026', lastmod: '2025-11-20' },
];

interface SitemapPage {
  url: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

export async function loader({}: Route.LoaderArgs) {
  const baseUrl = 'https://fastfabric.fr';
  const today = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages: SitemapPage[] = [
    { url: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
    { url: '/commander', priority: '0.9', changefreq: 'monthly', lastmod: today },
    { url: '/blog', priority: '0.8', changefreq: 'daily', lastmod: today },
    { url: '/mentions-legales', priority: '0.3', changefreq: 'yearly', lastmod: '2025-01-01' },
    { url: '/cgv', priority: '0.3', changefreq: 'yearly', lastmod: '2025-01-01' },
    { url: '/confidentialite', priority: '0.3', changefreq: 'yearly', lastmod: '2025-01-01' },
  ];

  // Service index pages
  const servicePages: SitemapPage[] = services.map(service => ({
    url: `/${service.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: today,
  }));

  // Sector index pages (12 pages)
  const sectorIndexPages: SitemapPage[] = secteurs.map(secteur => ({
    url: `/secteur/${secteur.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: today,
  }));

  // Sector + Service pages (12 × 3 = 36 pages)
  const sectorServicePages: SitemapPage[] = secteurs.flatMap(secteur =>
    services.map(service => ({
      url: `/secteur/${secteur.slug}/${service.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: today,
    }))
  );

  // Blog articles
  const blogPages: SitemapPage[] = blogArticles.map(article => ({
    url: `/blog/${article.slug}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: article.lastmod,
  }));

  // Sector + Ville pages for priority cities (12 secteurs × 10 villes = 120 pages)
  const priorityVilles = getVillesPrioritaires();
  const sectorVillePages: SitemapPage[] = secteurs.flatMap(secteur =>
    priorityVilles.map(ville => ({
      url: `/secteur/${secteur.slug}/${ville.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: today,
    }))
  );

  // Local SEO pages (city × service = 552 pages)
  const localPages: SitemapPage[] = services.flatMap(service =>
    villes95.map(ville => ({
      url: `/${service.slug}/${ville.slug}`,
      priority: ville.isPrioritaire ? '0.7' : '0.5',
      changefreq: 'monthly',
      lastmod: today,
    }))
  );

  // Combine all pages
  const allPages: SitemapPage[] = [
    ...staticPages,
    ...servicePages,
    ...sectorIndexPages,
    ...sectorServicePages,
    ...sectorVillePages,
    ...blogPages,
    ...localPages,
  ];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Log sitemap stats
  console.log(`[Sitemap] Generated with ${allPages.length} URLs`);
  console.log(`  - Static: ${staticPages.length}`);
  console.log(`  - Services: ${servicePages.length}`);
  console.log(`  - Sectors Index: ${sectorIndexPages.length}`);
  console.log(`  - Sectors × Services: ${sectorServicePages.length}`);
  console.log(`  - Sectors × Villes: ${sectorVillePages.length}`);
  console.log(`  - Blog: ${blogPages.length}`);
  console.log(`  - Local (Service × Ville): ${localPages.length}`);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache 1h
      'X-Robots-Tag': 'noindex', // Don't index sitemap itself
    },
  });
}
