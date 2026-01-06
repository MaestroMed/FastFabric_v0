import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // Public routes
  index("routes/home.tsx"),
  
  // Order flow
  route("commander", "routes/commander/index.tsx"),
  route("commander/projet", "routes/commander/projet.tsx"),
  route("commander/contenu", "routes/commander/contenu.tsx"),
  route("commander/paiement", "routes/commander/paiement.tsx"),
  route("commander/confirmation/:id", "routes/commander/confirmation.tsx"),
  
  // Order tracking (public)
  route("suivi/:orderNumber", "routes/suivi.tsx"),
  
  // Legal pages
  route("mentions-legales", "routes/mentions-legales.tsx"),
  route("cgv", "routes/cgv.tsx"),
  route("confidentialite", "routes/confidentialite.tsx"),
  
  // Ads landing pages (optimized for Google Ads campaigns)
  route("ads/site-vitrine", "routes/ads.site-vitrine.tsx"),
  route("ads/landing-page", "routes/ads.landing-page.tsx"),
  
  // Blog
  route("blog", "routes/blog._index.tsx"),
  route("blog/:slug", "routes/blog.$slug.tsx"),
  
  // SEO Secteurs - Index pages
  route("secteur/:secteur", "routes/secteur.$secteur.tsx"),
  
  // SEO Secteurs + (Service OR Ville) - Smart handler
  route("secteur/:secteur/:segment", "routes/secteur.$secteur.$segment.tsx"),
  
  // SEO Local - Service index pages (specific patterns before dynamic)
  route("site-vitrine", "routes/service.site-vitrine.tsx"),
  route("landing-page", "routes/service.landing-page.tsx"),
  route("site-sur-mesure", "routes/service.site-sur-mesure.tsx"),
  
  // SEO Local - City + Service pages (552 pages generated dynamically)
  route(":service/:ville", "routes/$service.$ville.tsx"),
  
  // Admin login (outside protected layout)
  route("admin/login", "routes/admin/login.tsx"),
  
  // Admin protected routes
  layout("routes/admin/layout.tsx", [
    route("admin", "routes/admin/index.tsx"),
    route("admin/commandes", "routes/admin/commandes/index.tsx"),
    route("admin/commandes/:id", "routes/admin/commandes/detail.tsx"),
    route("admin/offres", "routes/admin/offres/index.tsx"),
    route("admin/offres/:id", "routes/admin/offres/edit.tsx"),
    route("admin/projets", "routes/admin/projets/index.tsx"),
    route("admin/projets/:id", "routes/admin/projets/edit.tsx"),
    route("admin/tags", "routes/admin/tags.tsx"),
    route("admin/faq", "routes/admin/faq.tsx"),
    route("admin/temoignages", "routes/admin/temoignages.tsx"),
    route("admin/blog", "routes/admin/blog.tsx"),
    route("admin/settings", "routes/admin/settings.tsx"),
  ]),
  
  // API routes
  route("api/stripe/create-checkout", "routes/api/stripe.create-checkout.tsx"),
  route("api/stripe/webhook", "routes/api/stripe.webhook.tsx"),
  route("api/revision", "routes/api/revision.tsx"),
  
  // SEO
  route("robots.txt", "routes/robots[.]txt.tsx"),
  route("sitemap.xml", "routes/sitemap.xml.tsx"),
] satisfies RouteConfig;
