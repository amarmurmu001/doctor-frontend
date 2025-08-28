import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';

const SearchDoctors = () => {
  return (
    <>
      <PageSeo
        title="Search Doctors | Find Medical Professionals | Doctar"
        description="Find doctors based on your medical needs. Browse verified doctor profiles by specialization, experience, and location."
        keywords="search doctors, find doctors, medical professionals, doctor appointment, healthcare"
        canonicalUrl="https://www.doctar.in/search-doctors"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Search Doctors</h1>
        
        <h2 className="text-2xl font-semibold mb-4">About DOCTAR</h2>
        <p className="mb-6">
          With DOCTAR, patients can easily find the right doctor based on their medical needs. 
          Our platform allows users to browse verified doctor profiles by specialization, experience, and location.
        </p>
        
        <p className="mb-8">
          By removing middlemen and making healthcare more transparent, DOCTAR ensures that patients 
          get faster access to trusted medical professionals anytime, anywhere.
        </p>

        <h2 className="text-2xl font-semibold mb-4">How to Connect with Doctors</h2>
        <p className="mb-4">Patients can connect directly with doctors through:</p>
        
        <ul className="list-disc pl-6 mb-8">
          <li className="mb-2">
            <strong>Phone Call:</strong> Direct phone consultation with verified doctors for immediate medical advice.
          </li>
          <li className="mb-2">
            <strong>WhatsApp:</strong> Connect instantly via WhatsApp for quick consultations and follow-ups.
          </li>
          <li className="mb-2">
            <strong>Email:</strong> Send detailed queries and receive comprehensive medical advice via email.
          </li>
          <li className="mb-2">
            <strong>Direct Clinic Visit:</strong> Book appointments for direct clinic visits with appointment booking.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Free Booking System</h2>
        <p className="mb-4">
          We provide a free booking slot system, enabling patients to schedule consultations 
          without any booking cost. Please contact directly at clinic, doctor chamber, or hospital.
        </p>
        
        <h3 className="text-xl font-semibold mb-3">Key Benefits:</h3>
        <ul className="list-disc pl-6 mb-8">
          <li>No Hidden Charges</li>
          <li>No Middlemen</li>
          <li>Direct Access to Doctors</li>
          <li>Transparent Healthcare</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Available Medical Specialties</h2>
        <p className="mb-4">Find specialized doctors for your specific medical needs:</p>
        
        <ul className="list-disc pl-6 mb-8 grid grid-cols-2 gap-1">
          <li>Cardiologist</li>
          <li>Oncologist</li>
          <li>Neurologist</li>
          <li>Gynaecologist</li>
          <li>General Physician</li>
          <li>ENT Specialist</li>
          <li>Pediatrician</li>
          <li>Dentist</li>
          <li>Dermatologist</li>
          <li>Orthopedic</li>
          <li>Psychiatrist</li>
          <li>Diabetologist</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <ol className="list-decimal pl-6 mb-8">
          <li className="mb-2">Browse verified doctor profiles by location and specialty</li>
          <li className="mb-2">Check doctor's experience, qualifications, and patient reviews</li>
          <li className="mb-2">Choose your preferred communication method</li>
          <li className="mb-2">Contact the doctor directly through phone, WhatsApp, email, or book a clinic visit</li>
          <li className="mb-2">Schedule your consultation without any booking fees</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">Why Choose DOCTAR?</h2>
        <p className="mb-4">
          DOCTAR is committed to making healthcare more accessible and transparent for everyone. 
          Our platform connects you directly with trusted medical professionals, eliminating 
          unnecessary intermediaries and reducing costs.
        </p>
        
        <p className="mb-6">
          Whether you need immediate medical advice, want to schedule a routine check-up, 
          or require specialized treatment, DOCTAR helps you find the right healthcare provider 
          for your needs.
        </p>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-600">
          For more information about our services or to start searching for doctors, 
          please visit our homepage or contact our support team.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default SearchDoctors;
