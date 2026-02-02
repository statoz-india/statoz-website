// SEO Utility Functions for Statoz Platform

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

const DEFAULT_SEO: SEOConfig = {
  title: 'Statoz - Skill-Based Sports Prediction Gaming Platform',
  description: 'Join Statoz, the free-to-play sports prediction platform. Make predictions on IPL 2026, T20 World Cup, FIFA World Cup and more. Compete with fans worldwide.',
  keywords: [
    'sports prediction',
    'fantasy sports',
    'IPL 2026',
    'T20 World Cup 2026',
    'FIFA World Cup 2026',
    'cricket predictions',
    'football predictions',
    'skill-based gaming',
    'sports gaming platform',
    'Statoz'
  ],
  ogImage: 'https://statoz.com/og-image.jpg'
};

export function updatePageSEO(config: Partial<SEOConfig> = {}) {
  const seoConfig = { ...DEFAULT_SEO, ...config };

  // Update title
  document.title = seoConfig.title;

  // Update or create meta description
  updateMetaTag('name', 'description', seoConfig.description);

  // Update or create keywords
  if (seoConfig.keywords && seoConfig.keywords.length > 0) {
    updateMetaTag('name', 'keywords', seoConfig.keywords.join(', '));
  }

  // Open Graph tags
  updateMetaTag('property', 'og:title', seoConfig.title);
  updateMetaTag('property', 'og:description', seoConfig.description);
  updateMetaTag('property', 'og:type', 'website');
  
  if (seoConfig.ogImage) {
    updateMetaTag('property', 'og:image', seoConfig.ogImage);
  }

  // Twitter Card tags
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', seoConfig.title);
  updateMetaTag('name', 'twitter:description', seoConfig.description);
  
  if (seoConfig.ogImage) {
    updateMetaTag('name', 'twitter:image', seoConfig.ogImage);
  }

  // Canonical URL
  if (seoConfig.canonical) {
    updateLinkTag('canonical', seoConfig.canonical);
  }
}

function updateMetaTag(attribute: 'name' | 'property', value: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
}

// Structured Data for SEO
export function addStructuredData(type: 'WebSite' | 'Article', data: Record<string, unknown>) {
  const scriptId = `structured-data-${type.toLowerCase()}`;
  
  // Remove existing script if present
  const existingScript = document.getElementById(scriptId);
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.id = scriptId;
  script.type = 'application/ld+json';
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  });
  
  document.head.appendChild(script);
}

// Add website structured data on app load
export function addWebsiteStructuredData() {
  addStructuredData('WebSite', {
    name: 'Statoz',
    description: 'Skill-Based Sports Prediction Gaming Platform',
    url: 'https://statoz.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://statoz.com/blog?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  });
}

// Initialize default SEO
export function initializeSEO() {
  updatePageSEO();
  addWebsiteStructuredData();
}
