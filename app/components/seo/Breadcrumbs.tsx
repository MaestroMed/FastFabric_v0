/**
 * SEO Breadcrumbs Component with Schema.org BreadcrumbList
 * Provides navigation and structured data for search engines
 */

import { Link, useLocation } from 'react-router';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const baseUrl = 'https://fastfabric.fr';

  // Generate Schema.org BreadcrumbList
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": baseUrl
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        ...(item.href ? { "item": `${baseUrl}${item.href}` } : {})
      }))
    ]
  };

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      {/* Visual breadcrumbs */}
      <nav 
        aria-label="Fil d'Ariane" 
        className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}
      >
        <Link 
          to="/" 
          className="flex items-center gap-1 hover:text-gray-900 transition-colors"
          aria-label="Accueil"
        >
          <Home className="w-4 h-4" />
          <span className="sr-only">Accueil</span>
        </Link>

        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-300" aria-hidden="true" />
            {item.href ? (
              <Link 
                to={item.href} 
                className="hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}

/**
 * Helper to generate breadcrumbs for common page types
 */
export function generateBreadcrumbs(type: string, data?: Record<string, string>): BreadcrumbItem[] {
  switch (type) {
    case 'service':
      return [
        { label: data?.serviceName || 'Service' }
      ];
    
    case 'service-ville':
      return [
        { label: data?.serviceName || 'Service', href: `/${data?.serviceSlug}` },
        { label: data?.villeName || 'Ville' }
      ];
    
    case 'secteur':
      return [
        { label: 'Secteurs', href: '/secteur' },
        { label: data?.secteurName || 'Secteur' }
      ];
    
    case 'secteur-service':
      return [
        { label: 'Secteurs', href: '/secteur' },
        { label: data?.secteurName || 'Secteur', href: `/secteur/${data?.secteurSlug}` },
        { label: data?.serviceName || 'Service' }
      ];
    
    case 'blog':
      return [
        { label: 'Blog', href: '/blog' },
        { label: data?.articleTitle || 'Article' }
      ];
    
    case 'legal':
      return [
        { label: data?.pageName || 'Page légale' }
      ];
    
    default:
      return [];
  }
}

export default Breadcrumbs;


