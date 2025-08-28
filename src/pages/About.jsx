import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';

const About = () => {
  return (
    <>
      <PageSeo
        title="About DOCTAR | Digital Healthcare Platform"
        description="Learn about DOCTAR's mission to connect patients directly with doctors, clinics, and hospitals across India. Transparent healthcare without middlemen."
        keywords="about doctar, healthcare platform, digital health, medical consultation, doctor booking"
        canonicalUrl="https://www.doctar.in/about"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">About DOCTAR</h1>
        
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-6">
          DOCTAR is a revolutionary digital healthcare platform designed to bridge the gap between patients 
          and healthcare providers across India. Our mission is to make quality healthcare accessible, 
          transparent, and affordable for everyone by connecting patients directly with verified doctors, 
          clinics, and hospitals.
        </p>

        <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
        <p className="mb-4">
          We provide a comprehensive platform where patients can:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Search and find qualified healthcare professionals by specialty and location</li>
          <li>View detailed profiles of doctors, clinics, and hospitals</li>
          <li>Book appointments directly without any booking fees</li>
          <li>Connect with healthcare providers through multiple channels (phone, WhatsApp, email)</li>
          <li>Access verified information about medical facilities and services</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
        <p className="mb-6">
          To create a healthcare ecosystem where every patient in India has easy access to quality medical 
          care, and every healthcare provider can reach patients efficiently without unnecessary intermediaries.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Why Choose DOCTAR?</h2>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Direct Connection:</strong> No middlemen between patients and healthcare providers</li>
          <li><strong>Free Booking:</strong> Zero charges for appointment booking</li>
          <li><strong>Verified Profiles:</strong> All healthcare providers are thoroughly verified</li>
          <li><strong>Transparent Information:</strong> Complete details about services, fees, and facilities</li>
          <li><strong>Multiple Contact Options:</strong> Reach doctors via phone, WhatsApp, email, or clinic visits</li>
          <li><strong>Pan-India Coverage:</strong> Healthcare access across all major cities and towns</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Transparency:</strong> Clear, honest information about all healthcare services</li>
          <li><strong>Accessibility:</strong> Making healthcare reachable for everyone</li>
          <li><strong>Quality:</strong> Connecting patients with verified, qualified healthcare professionals</li>
          <li><strong>Innovation:</strong> Using technology to improve healthcare delivery</li>
          <li><strong>Trust:</strong> Building reliable relationships between patients and providers</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">How We Help Patients</h2>
        <p className="mb-4">
          DOCTAR simplifies the healthcare journey by providing:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Easy search and discovery of healthcare providers</li>
          <li>Detailed information to make informed decisions</li>
          <li>Direct communication channels with doctors</li>
          <li>Free appointment booking system</li>
          <li>Access to multiple specialties and treatment options</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">How We Support Healthcare Providers</h2>
        <p className="mb-4">
          We help doctors, clinics, and hospitals by offering:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Increased online visibility and patient reach</li>
          <li>Direct patient engagement without third-party interference</li>
          <li>Enhanced appointment management capabilities</li>
          <li>Platform to showcase facilities, services, and achievements</li>
          <li>Digital growth opportunities in healthcare</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
        <p className="mb-6">
          At DOCTAR, we are committed to revolutionizing healthcare delivery in India. We believe that 
          everyone deserves access to quality medical care, and we work tirelessly to remove barriers 
          between patients and healthcare providers. Our platform ensures that medical consultation is 
          just a click away, making healthcare more accessible than ever before.
        </p>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-600">
          For more information about our services or to connect with our team, 
          please visit our contact page or reach out to our support team.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default About;
