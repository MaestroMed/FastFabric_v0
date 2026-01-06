import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";

import "./app.css";

// Conversion components
import { FloatingCTA, MobileFloatingBar, ExitIntentPopup, WhatsAppButton, LiveNotifications } from '~/components/conversion';

// Global meta tags
export function meta({}: Route.MetaArgs) {
  return [
    { title: "FastFabric — Sites web sur mesure en 2 heures" },
    { name: "description", content: "Création de sites web professionnels sur mesure, livrés en 2 heures. Design premium, prix accessible. One Page à partir de 299€." },
    { name: "keywords", content: "création site web, site vitrine, landing page, web design, site professionnel, livraison rapide" },
    { name: "author", content: "FastFabric" },
    { name: "robots", content: "index, follow" },
    { name: "googlebot", content: "index, follow" },
    
    // Open Graph
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "FastFabric" },
    { property: "og:title", content: "FastFabric — Sites web sur mesure en 2 heures" },
    { property: "og:description", content: "Création de sites web professionnels sur mesure, livrés en 2 heures. Design premium, prix accessible." },
    { property: "og:locale", content: "fr_FR" },
    
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "FastFabric — Sites web sur mesure en 2 heures" },
    { name: "twitter:description", content: "Création de sites web professionnels sur mesure, livrés en 2 heures." },
    
    // Theme
    { name: "theme-color", content: "#0071e3" },
    { name: "msapplication-TileColor", content: "#0071e3" },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" },
  { rel: "icon", type: "image/svg+xml", href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E⚡%3C/text%3E%3C/svg%3E" },
  { rel: "canonical", href: "https://fastfabric.fr" },
];

// Schema.org structured data - Enriched for SEO
const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    // Organization
    {
      "@type": "Organization",
      "@id": "https://fastfabric.fr/#organization",
      "name": "FastFabric",
      "url": "https://fastfabric.fr",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fastfabric.fr/logo.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://www.linkedin.com/company/fastfabric",
        "https://twitter.com/fastfabric"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "contact@fastfabric.fr",
        "contactType": "customer service",
        "availableLanguage": "French"
      },
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Val-d'Oise",
        "addressCountry": "FR"
      }
    },
    // LocalBusiness for local SEO
    {
      "@type": "LocalBusiness",
      "@id": "https://fastfabric.fr/#localbusiness",
      "name": "FastFabric - Création de sites web",
      "url": "https://fastfabric.fr",
      "priceRange": "€€",
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Val-d'Oise (95)",
        "containedIn": {
          "@type": "AdministrativeArea",
          "name": "Île-de-France"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "127",
        "bestRating": "5"
      }
    },
    // WebSite with search action
    {
      "@type": "WebSite",
      "@id": "https://fastfabric.fr/#website",
      "url": "https://fastfabric.fr",
      "name": "FastFabric",
      "publisher": { "@id": "https://fastfabric.fr/#organization" },
      "inLanguage": "fr-FR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://fastfabric.fr/blog?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    // Service with detailed offers
    {
      "@type": "Service",
      "@id": "https://fastfabric.fr/#service",
      "name": "Création de sites web sur mesure",
      "provider": { "@id": "https://fastfabric.fr/#organization" },
      "description": "Sites web professionnels livrés en 2 heures. Design sur mesure, code source fourni, optimisé SEO.",
      "serviceType": "Web Design",
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Val-d'Oise (95)"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Offres FastFabric",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Landing Page",
            "price": "299",
            "priceCurrency": "EUR",
            "description": "Page unique haute conversion, livrée en 2h",
            "availability": "https://schema.org/InStock"
          },
          {
            "@type": "Offer", 
            "name": "Site Vitrine",
            "price": "599",
            "priceCurrency": "EUR",
            "description": "Site professionnel multi-pages, livré en 4h",
            "availability": "https://schema.org/InStock"
          },
          {
            "@type": "Offer",
            "name": "Site Sur Mesure",
            "description": "Projet web personnalisé sur devis",
            "availability": "https://schema.org/InStock"
          }
        ]
      }
    },
    // HowTo for the ordering process
    {
      "@type": "HowTo",
      "@id": "https://fastfabric.fr/#howto",
      "name": "Comment commander un site web FastFabric",
      "description": "Processus simple en 4 étapes pour obtenir votre site web professionnel",
      "totalTime": "PT2H",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Choisissez votre offre",
          "text": "Sélectionnez entre Landing Page, Site Vitrine ou Sur Mesure"
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Décrivez votre projet",
          "text": "Renseignez vos besoins : pages, couleurs, style, contenu"
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Validez et payez",
          "text": "Paiement sécurisé par carte bancaire"
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Recevez votre site",
          "text": "Livraison express en 2-4 heures avec code source"
        }
      ]
    },
    // FAQPage for common questions
    {
      "@type": "FAQPage",
      "@id": "https://fastfabric.fr/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Combien de temps pour recevoir mon site ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Votre site est livré en 2 heures pour une Landing Page, 4 heures pour un Site Vitrine, dès réception de toutes les informations et validation du paiement."
          }
        },
        {
          "@type": "Question",
          "name": "Que comprend le prix affiché ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le prix inclut le design sur mesure, le développement, l'optimisation SEO de base, le code source complet et 2 révisions. Hébergement et nom de domaine non inclus."
          }
        },
        {
          "@type": "Question",
          "name": "Puis-je modifier mon site après livraison ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Oui, vous recevez le code source complet. Vous pouvez le modifier vous-même ou nous demander des modifications supplémentaires."
          }
        },
        {
          "@type": "Question",
          "name": "Proposez-vous une garantie ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Oui, satisfait ou remboursé sous 14 jours si le site ne correspond pas à votre demande initiale."
          }
        }
      ]
    }
  ]
};

// Analytics configuration
// Replace with your actual IDs before deployment
const ANALYTICS_CONFIG = {
  gtmId: 'GTM-XXXXXXX', // Replace with your Google Tag Manager ID
  ga4Id: 'G-XXXXXXXXXX', // Replace with your GA4 Measurement ID
  hotjarId: '0000000', // Replace with your Hotjar Site ID
  hotjarVersion: 6,
};

// Google Tag Manager script
const gtmScript = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${ANALYTICS_CONFIG.gtmId}');
`;

// Hotjar script
const hotjarScript = `
(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:${ANALYTICS_CONFIG.hotjarId},hjsv:${ANALYTICS_CONFIG.hotjarVersion}};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
`;

// GA4 gtag script (backup if not using GTM)
const gtagScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ANALYTICS_CONFIG.ga4Id}', {
  page_title: document.title,
  page_location: window.location.href,
});
`;

export function Layout({ children }: { children: React.ReactNode }) {
  // Only load analytics in production
  const isProduction = typeof window !== 'undefined' && 
    !window.location.hostname.includes('localhost') && 
    !window.location.hostname.includes('127.0.0.1');

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />

        {/* Google Tag Manager - Only in production */}
        {isProduction && ANALYTICS_CONFIG.gtmId !== 'GTM-XXXXXXX' && (
          <script dangerouslySetInnerHTML={{ __html: gtmScript }} />
        )}

        {/* Google Analytics 4 (gtag.js) - Backup if GTM not configured */}
        {isProduction && ANALYTICS_CONFIG.ga4Id !== 'G-XXXXXXXXXX' && ANALYTICS_CONFIG.gtmId === 'GTM-XXXXXXX' && (
          <>
            <script 
              async 
              src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.ga4Id}`}
            />
            <script dangerouslySetInnerHTML={{ __html: gtagScript }} />
          </>
        )}

        {/* Hotjar - Only in production */}
        {isProduction && ANALYTICS_CONFIG.hotjarId !== '0000000' && (
          <script dangerouslySetInnerHTML={{ __html: hotjarScript }} />
        )}
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) - Only in production */}
        {isProduction && ANALYTICS_CONFIG.gtmId !== 'GTM-XXXXXXX' && (
          <noscript>
            <iframe 
              src={`https://www.googletagmanager.com/ns.html?id=${ANALYTICS_CONFIG.gtmId}`}
              height="0" 
              width="0" 
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Outlet />
      
      {/* Global conversion elements - visible on all pages */}
      <FloatingCTA />
      <MobileFloatingBar />
      <ExitIntentPopup />
      <LiveNotifications />
      <WhatsAppButton phoneNumber="33757847424" />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "Une erreur inattendue s'est produite.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Erreur";
    details =
      error.status === 404
        ? "La page demandée n'existe pas."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6">
          <span className="text-4xl">⚡</span>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">{message}</h1>
        <p className="text-gray-600 mb-8 text-lg">{details}</p>
        {stack && (
          <pre className="text-left text-sm bg-white border border-gray-200 p-4 rounded-xl overflow-auto max-w-2xl mx-auto mb-8">
            {stack}
          </pre>
        )}
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
        >
          ← Retour à l'accueil
        </a>
      </div>
    </main>
  );
}
