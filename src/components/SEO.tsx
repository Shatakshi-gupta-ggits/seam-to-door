import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'service';
  structuredData?: object;
}

const defaultMeta = {
  siteName: 'Mr Finisher',
  title: 'Mr Finisher – Doorstep Tailoring & Alteration Service in Jabalpur',
  description: 'Book professional tailoring & alteration service at home. Pickup & delivery available. Perfect fitting guaranteed. Trusted doorstep tailor near you in Jabalpur.',
  keywords: 'doorstep tailoring service, alteration service near me, online tailor pickup delivery, tailoring pickup and delivery, clothing alteration service, tailor at home, tailoring service in Jabalpur, tailor pickup service in Jabalpur, alteration service in Jabalpur, online tailor in Jabalpur, pant alteration near me, shirt fitting service, blouse alteration service, kurta pajama tailoring, dress alteration at home',
  baseUrl: 'https://mrfinisher.in',
  ogImage: '/og-image.jpg',
};

export const SEO = ({
  title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  canonicalUrl,
  ogImage = defaultMeta.ogImage,
  ogType = 'website',
  structuredData,
}: SEOProps) => {
  const fullTitle = title 
    ? `${title} | ${defaultMeta.siteName}`
    : defaultMeta.title;
  
  const fullCanonicalUrl = canonicalUrl 
    ? `${defaultMeta.baseUrl}${canonicalUrl}`
    : defaultMeta.baseUrl;

  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Mr Finisher',
    description: 'Mr Finisher is a professional doorstep tailoring & alteration service. We provide pickup and delivery tailoring service for men, women & kids. Our expert tailors ensure perfect fitting at affordable prices.',
    url: defaultMeta.baseUrl,
    telephone: '+91-9407826370',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jabalpur',
      addressRegion: 'Madhya Pradesh',
      postalCode: '482001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '23.1815',
      longitude: '79.9864',
    },
    areaServed: {
      '@type': 'City',
      name: 'Jabalpur',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '21:00',
    },
    priceRange: '₹₹',
    image: `${defaultMeta.baseUrl}${ogImage}`,
    sameAs: [],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Tailoring & Alteration Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pant Alteration Service', description: 'Professional pant alteration at home with pickup & delivery' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Shirt Fitting Service', description: 'Expert shirt fitting and alteration service' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Blouse Alteration Service', description: 'Professional blouse alteration and stitching' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Kurta Pajama Tailoring', description: 'Traditional kurta pajama tailoring and alterations' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dress Alteration at Home', description: 'Dress alteration for women with doorstep pickup' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Tailoring Service', description: 'Custom tailoring for all garments' } },
      ],
    },
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Mr Finisher" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${defaultMeta.baseUrl}${ogImage}`} />
      <meta property="og:site_name" content={defaultMeta.siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${defaultMeta.baseUrl}${ogImage}`} />

      {/* Additional SEO */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="geo.region" content="IN-MP" />
      <meta name="geo.placename" content="Jabalpur" />
      <meta name="geo.position" content="23.1815;79.9864" />
      <meta name="ICBM" content="23.1815, 79.9864" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
