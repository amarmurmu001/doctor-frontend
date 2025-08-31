import React from 'react';
import { Helmet } from 'react-helmet';

const DefaultSeo = ({
  title = "Doctar | Direct Consultation with Doctors in India, Book Doctor Appointments",
  description = "Connect to India's Top Doctors for consultation. Get direct connect with Doctors & Clinics, book doctor appointments, and find premier multispecialty doctors near you.",
  keywords = "Doctar, Cardiologist Doctors, Oncologist Doctors, Obstetrician Doctors, Neurologist Doctors, Gynaecologist Doctors, Orthopaedist Doctors, Endocrinologist Doctors, Diabetologist Doctors, Psychiatrist Doctors, General Physician Doctors, ENT Specialist Doctors, Ophthalmologist Doctors, Dermatologist Doctors, Gastroenterologist Doctors, Pediatrician Doctors, Urologist Doctors, General Surgeons Doctors, General Medicine Doctors, Allopathic Doctors, Ayurveda Doctors, Homeopathic Doctors, Dentist Doctors",
  canonicalUrl = "https://www.doctar.in",
  imageUrl = "https://www.doctar.in/banner.png",
  pageType = "website"
}) => {
  return (
    <Helmet defer={true}>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={pageType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Doctar" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Doctar" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="geo.position" content="20.5937;78.9629" />
      <meta name="ICBM" content="20.5937, 78.9629" />
      
      {/* Clear any doctor-specific schema markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Doctar",
          "url": "https://www.doctar.in",
          "description": "Direct consultation with top doctors in India. Book appointments with verified doctors and clinics.",
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

export default DefaultSeo;
