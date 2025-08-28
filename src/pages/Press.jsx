import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';

const Press = () => {
  return (
    <>
      <PageSeo
        title="Press & Media | DOCTAR News & Updates"
        description="Latest press releases, media coverage, and news about DOCTAR's digital healthcare platform. Contact our media team for press inquiries."
        keywords="doctar press, media coverage, press releases, healthcare news, digital health media"
        canonicalUrl="https://www.doctar.in/press"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Press & Media</h1>
        
        <h2 className="text-2xl font-semibold mb-4">About DOCTAR</h2>
        <p className="mb-6">
          DOCTAR is a pioneering digital healthcare platform that connects patients directly 
          with verified doctors, clinics, and hospitals across India. By eliminating middlemen 
          and providing transparent, accessible healthcare solutions, DOCTAR is transforming 
          how patients access medical care and how healthcare providers reach their patients.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Our Mission Statement</h2>
        <p className="mb-6">
          "To make quality healthcare accessible, transparent, and affordable for every Indian 
          by creating direct connections between patients and healthcare providers, powered by 
          technology and driven by trust."
        </p>

        <h2 className="text-2xl font-semibold mb-4">Key Features & Services</h2>
        <ul className="list-disc pl-6 mb-8">
          <li>Direct doctor-patient connectivity without intermediaries</li>
          <li>Free appointment booking system</li>
          <li>Comprehensive doctor, clinic, and hospital profiles</li>
          <li>Multiple communication channels (phone, WhatsApp, email)</li>
          <li>Pan-India healthcare provider network</li>
          <li>Transparent pricing and service information</li>
          <li>Verified healthcare professional credentials</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Company Facts & Figures</h2>
        <ul className="list-disc pl-6 mb-8">
          <li><strong>Founded:</strong> 2024</li>
          <li><strong>Headquarters:</strong> India</li>
          <li><strong>Industry:</strong> Digital Healthcare, HealthTech</li>
          <li><strong>Services:</strong> Doctor discovery, appointment booking, healthcare connectivity</li>
          <li><strong>Target Market:</strong> Patients and healthcare providers across India</li>
          <li><strong>Business Model:</strong> Direct connectivity platform with free booking</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Press Releases</h2>
        <p className="mb-6">
          Official press releases and announcements will be published here as we reach 
          significant milestones and launch new features.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Media Coverage</h2>
        <p className="mb-6">
          As DOCTAR grows and gains recognition in the healthcare technology space, 
          media coverage and mentions will be featured in this section.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Press Kit</h2>
        <p className="mb-4">
          Our press kit includes:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>High-resolution DOCTAR logos and brand assets</li>
          <li>Company fact sheet and background information</li>
          <li>Leadership team photos and biographies</li>
          <li>Product screenshots and platform images</li>
          <li>Key statistics and growth metrics</li>
          <li>Official company messaging and positioning</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Leadership Team</h2>
        <p className="mb-6">
          Our leadership team brings together expertise in healthcare, technology, 
          and business development to drive DOCTAR's mission forward.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Awards & Recognition</h2>
        <p className="mb-6">
          As DOCTAR continues to innovate in the healthcare space, awards and recognition 
          from industry organizations will be highlighted here.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Media Contact Information</h2>
        <p className="mb-4">
          For press inquiries, interviews, or additional information, please contact:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li><strong>Media Relations:</strong> Available through our contact page</li>
          <li><strong>Response Time:</strong> We typically respond to media inquiries within 24 hours</li>
          <li><strong>Available For:</strong> Interviews, product demonstrations, expert commentary</li>
          <li><strong>Languages:</strong> English, Hindi, and other regional Indian languages</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Speaking Opportunities</h2>
        <p className="mb-6">
          DOCTAR leadership is available for speaking engagements at healthcare conferences, 
          technology events, and industry panels focusing on digital health transformation, 
          healthcare accessibility, and health technology innovation.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Industry Expertise</h2>
        <p className="mb-4">
          Our team can provide expert commentary on:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>Digital healthcare transformation in India</li>
          <li>Patient-doctor connectivity solutions</li>
          <li>Healthcare accessibility and affordability</li>
          <li>Health technology adoption trends</li>
          <li>Telemedicine and remote healthcare</li>
          <li>Healthcare platform development</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Image and Video Guidelines</h2>
        <p className="mb-6">
          When featuring DOCTAR in media coverage, please ensure proper usage of our 
          brand assets according to our brand guidelines. High-quality images and 
          videos are available upon request.
        </p>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-600">
          For all media inquiries, partnership opportunities, or additional information 
          about DOCTAR, please contact us through our official contact channels.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Press;
