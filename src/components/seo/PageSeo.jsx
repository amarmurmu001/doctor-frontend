import React from 'react';
import { Helmet } from 'react-helmet';

const PageSeo = ({
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl = "https://www.doctar.in/banner.png",
  pageType = "website",
  noIndex = false
}) => {
  // Fallback to default values if not provided
  const defaultTitle = "Doctar | Direct Consultation with Doctors in India";
  const defaultDescription = "Connect to India's Top Doctors for consultation. Get direct connect with Doctors & Clinics, book doctor appointments, and find premier multispecialty doctors near you.";
  
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalCanonicalUrl = canonicalUrl || "https://www.doctar.in";

  return (
    <Helmet defer={false}>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={finalCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={pageType} />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Doctar" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalCanonicalUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={imageUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="author" content="Doctar" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="geo.position" content="20.5937;78.9629" />
      <meta name="ICBM" content="20.5937, 78.9629" />
      
      {/* Clear any doctor-specific schema markup with generic website schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Doctar",
          "url": "https://www.doctar.in",
          "description": finalDescription,
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.doctar.in/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

export default PageSeo;
