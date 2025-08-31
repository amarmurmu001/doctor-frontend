import React from 'react';
import { Helmet } from 'react-helmet';

const SeoDoctorProfile = ({
  fullName,
  specialization,
  location,
  yearsExperience,
  diseaseKeywords,
  doctorImage,
  doctorSlug,
  ratingValue = "4.8",
  ratingCount = "120",
  consultationFee,
  clinicName,
  languages = [],
  canonicalUrl
}) => {
  // Generate SEO-optimized title
  const title = `Dr. ${fullName} - Best ${specialization} in ${location} | Book Appointment Online | Doctar`;
  
  // Generate meta description
  const description = `Consult Dr. ${fullName}, top-rated ${specialization} in ${location} with ${yearsExperience}+ years of experience. Specializes in ${diseaseKeywords}. Book appointments online, check consultation fees, clinic timings, contact details & read verified patient reviews. 100% Free booking on Doctar.`;
  
  // Generate keywords
  const keywords = `Dr ${fullName} ${specialization} in ${location}, Best ${specialization} in ${location}, Top ${specialization} near me, Experienced ${specialization} ${location}, ${specialization} doctor online booking, Trusted ${specialization} in ${location}, Affordable ${specialization} consultation ${location}, Verified ${specialization} reviews ${location}, Doctar ${specialization} appointment booking`;
  
  // Use provided canonical URL or generate default
  const url = canonicalUrl || `https://www.doctar.in/${location.toLowerCase().replace(/\s+/g, '-')}/doctor/${doctorSlug}`;
  
  // Image URL
  const imageUrl = doctorImage ? `https://www.doctar.in/images/doctors/${doctorImage}.jpg` : 'https://www.doctar.in/images/default-doctor.jpg';
  
  // JSON-LD Schema markup for Google Rich Snippets
  const schema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": `Dr. ${fullName}`,
    "alternateName": `${fullName}`,
    "medicalSpecialty": specialization,
    "description": `Dr. ${fullName} is a ${specialization} in ${location} with ${yearsExperience}+ years of experience. Book appointments online for consultation.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location,
      "addressCountry": "India"
    },
    "image": imageUrl,
    "url": url,
    "priceRange": consultationFee ? `₹${consultationFee}` : "₹200-₹2000",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": parseFloat(ratingValue),
      "reviewCount": parseInt(ratingCount),
      "bestRating": 5,
      "worstRating": 1
    },
    "availableService": [
      {
        "@type": "MedicalProcedure",
        "name": "Online Consultation",
        "description": "Virtual consultation with Dr. " + fullName
      },
      {
        "@type": "MedicalProcedure", 
        "name": "Clinic Visit",
        "description": "In-person consultation at clinic"
      },
      {
        "@type": "Service",
        "name": "Appointment Booking",
        "description": "Online appointment scheduling"
      }
    ],
    "knowsLanguage": languages.length > 0 ? languages : ["English", "Hindi"],
    "worksFor": clinicName ? {
      "@type": "Organization",
      "name": clinicName,
      "url": url
    } : undefined,
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Medical Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": specialization + " Consultation"
          },
          "price": consultationFee ? consultationFee : "200-2000",
          "priceCurrency": "INR"
        }
      ]
    },
    "sameAs": [
      url
    ]
  };

  return (
    <Helmet defer={false}>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Doctar" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={`Dr. ${fullName}`} />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content={location} />
      <meta name="geo.position" content="20.5937;78.9629" />
      <meta name="ICBM" content="20.5937, 78.9629" />
      
      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default SeoDoctorProfile;
