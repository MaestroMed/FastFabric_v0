/**
 * Dynamic robots.txt for SEO
 * Blocks admin/api routes, allows crawling of all public pages
 */

import type { Route } from "./+types/robots[.]txt";

export async function loader({}: Route.LoaderArgs) {
  const baseUrl = 'https://fastfabric.fr';

  const robotsTxt = `# FastFabric Robots.txt
# Generated dynamically for optimal SEO

User-agent: *
Allow: /

# Block admin and API routes
Disallow: /admin
Disallow: /admin/*
Disallow: /api/
Disallow: /api/*

# Block order confirmation pages (private)
Disallow: /commander/confirmation/*
Disallow: /suivi/*

# Allow important crawlers full access
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Host directive for search engines
Host: ${baseUrl}
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache 24h
    },
  });
}


