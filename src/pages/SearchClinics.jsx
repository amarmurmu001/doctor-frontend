import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';

const SearchClinics = () => {
  return (
    <>
      <PageSeo
        title="Search Clinics | Find Medical Clinics | Doctar"
        description="Search for clinics based on your healthcare needs and location. Browse clinic profiles with details of facilities, specializations, and available doctors."
        keywords="search clinics, find clinics, medical clinics, clinic profiles, healthcare centers, medical facilities"
        canonicalUrl="https://www.doctar.in/search-clinics"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Search Clinics</h1>
        
        <h2 className="text-2xl font-semibold mb-4">About Clinic Search</h2>
        <p className="mb-6">
          With DOCTAR, patients can not only connect with individual doctors but also search for clinics 
          based on their healthcare needs and location.
        </p>

        <h2 className="text-2xl font-semibold mb-4">What Patients Can Do</h2>
        <ul className="list-disc pl-6 mb-8">
          <li className="mb-2">
            <strong>Browse clinic profiles</strong> with details of facilities, specializations, and available doctors.
          </li>
          <li className="mb-2">
            <strong>Check operating hours</strong> and available services.
          </li>
          <li className="mb-2">
            <strong>Book an appointment slot online</strong> without any additional cost.
          </li>
          <li className="mb-2">
            <strong>Directly connect with the clinic</strong> through call, WhatsApp, or email.
          </li>
        </ul>

        <p className="mb-8">
          This feature makes it easier for patients to choose the right clinic with the right services, 
          ensuring timely and reliable healthcare access.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Types of Clinics Available</h2>
        <ul className="list-disc pl-6 mb-8">
          <li><strong>General Practice Clinics:</strong> Primary healthcare and routine check-ups</li>
          <li><strong>Specialty Clinics:</strong> Focused care for specific medical conditions</li>
          <li><strong>Diagnostic Centers:</strong> Medical testing and imaging services</li>
          <li><strong>Dental Clinics:</strong> Oral health and dental care services</li>
          <li><strong>Eye Clinics:</strong> Vision care and ophthalmology services</li>
          <li><strong>Skin Clinics:</strong> Dermatology and cosmetic treatments</li>
          <li><strong>Physiotherapy Clinics:</strong> Rehabilitation and physical therapy</li>
          <li><strong>Mental Health Clinics:</strong> Psychological and psychiatric care</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Clinic Specializations</h2>
        <ul className="list-disc pl-6 mb-8 grid grid-cols-2 gap-1">
          <li>Family Medicine</li>
          <li>Pediatrics</li>
          <li>Gynecology</li>
          <li>Cardiology</li>
          <li>Dermatology</li>
          <li>Orthopedics</li>
          <li>ENT (Ear, Nose, Throat)</li>
          <li>Ophthalmology</li>
          <li>Dentistry</li>
          <li>Psychiatry</li>
          <li>Physiotherapy</li>
          <li>Nutrition & Dietetics</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Clinic Services to Look For</h2>
        <ul className="list-disc pl-6 mb-8">
          <li>Consultation and examination rooms</li>
          <li>Basic diagnostic facilities</li>
          <li>Minor procedure capabilities</li>
          <li>Vaccination services</li>
          <li>Health screening programs</li>
          <li>Preventive care services</li>
          <li>Follow-up care and monitoring</li>
          <li>Patient counseling services</li>
          <li>Prescription and medication guidance</li>
          <li>Referral services to specialists</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">How to Choose the Right Clinic</h2>
        <ol className="list-decimal pl-6 mb-8">
          <li className="mb-2">Determine your specific healthcare needs</li>
          <li className="mb-2">Check clinic location and accessibility</li>
          <li className="mb-2">Verify operating hours and appointment availability</li>
          <li className="mb-2">Review available doctors and their qualifications</li>
          <li className="mb-2">Check available services and facilities</li>
          <li className="mb-2">Consider cost and insurance acceptance</li>
          <li className="mb-2">Read patient reviews and testimonials</li>
          <li className="mb-2">Confirm booking and contact methods</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">Benefits of Clinic-Based Care</h2>
        <ul className="list-disc pl-6 mb-8">
          <li>More personalized and focused healthcare</li>
          <li>Shorter waiting times for appointments</li>
          <li>Direct doctor-patient relationships</li>
          <li>Cost-effective healthcare solutions</li>
          <li>Convenient location-based access</li>
          <li>Specialized care for specific conditions</li>
          <li>Continuity of care with the same provider</li>
          <li>Easier scheduling and appointment management</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Free Appointment Booking</h2>
        <p className="mb-4">
          Just like with doctors and hospitals, DOCTAR provides a free booking system for clinic appointments. 
          Patients can schedule consultations without any booking charges.
        </p>
        
        <h3 className="text-xl font-semibold mb-3">Key Benefits:</h3>
        <ul className="list-disc pl-6 mb-8">
          <li>No hidden charges for booking</li>
          <li>Direct contact with clinics</li>
          <li>Easy online slot selection</li>
          <li>Flexible appointment management</li>
          <li>Multiple contact options (call, WhatsApp, email)</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Why Choose DOCTAR for Clinic Search?</h2>
        <p className="mb-4">
          DOCTAR simplifies the process of finding and connecting with healthcare clinics. Our platform 
          provides comprehensive information about clinics, their services, and available doctors, 
          making it easier for patients to make informed healthcare decisions.
        </p>
        
        <p className="mb-6">
          Whether you need routine check-ups, specialized consultations, or ongoing healthcare management, 
          DOCTAR helps you find the right clinic that meets your specific needs and location preferences.
        </p>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-600">
          For more information about clinic search or to browse available healthcare clinics, 
          please visit our homepage or contact our support team.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default SearchClinics;
