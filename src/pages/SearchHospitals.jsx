import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';

const SearchHospitals = () => {
  return (
    <>
      <PageSeo
        title="Search Hospitals | Find Healthcare Facilities | Doctar"
        description="Find hospitals across India for routine check-ups, specialized treatments, or emergency care. Browse comprehensive hospital profiles with detailed information."
        keywords="search hospitals, find hospitals, healthcare facilities, hospital profiles, medical centers, emergency care"
        canonicalUrl="https://www.doctar.in/search-hospitals"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Search Hospitals</h1>
        
        <h2 className="text-2xl font-semibold mb-4">About Hospital Search</h2>
        <p className="mb-6">
          DOCTAR helps patients make informed healthcare decisions by providing direct access to hospitals across India. 
          Whether for routine check-ups, specialized treatments, or emergency care, our platform ensures patients can 
          find the right hospital quickly and easily.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Key Features for Patients</h2>
        
        <h3 className="text-xl font-semibold mb-3">Comprehensive Hospital Profiles</h3>
        <p className="mb-4">
          View detailed information about hospitals, including infrastructure, departments, accreditation, and specialties.
        </p>

        <h3 className="text-xl font-semibold mb-3">Specialized Departments & Treatments</h3>
        <p className="mb-4">
          Search hospitals by specialty—cardiology, oncology, orthopedics, neurology, gynecology, pediatrics, and more.
        </p>

        <h3 className="text-xl font-semibold mb-3">Doctor Availability</h3>
        <p className="mb-4">
          Check which doctors are associated with the hospital, along with their visiting hours and consultation slots.
        </p>

        <h3 className="text-xl font-semibold mb-3">Facilities & Services</h3>
        <p className="mb-4">
          Access details on available facilities such as emergency services, operation theaters, ICUs, diagnostic labs, 
          pharmacies, and wellness programs.
        </p>

        <h3 className="text-xl font-semibold mb-3">Seamless Connectivity</h3>
        <p className="mb-4">
          Patients can contact hospitals directly through call, WhatsApp, email, or online booking.
        </p>

        <h3 className="text-xl font-semibold mb-3">Free Appointment Booking</h3>
        <p className="mb-8">
          Book a consultation or hospital visit without any extra charges using our easy slot-booking system.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Hospital Specialties Available</h2>
        <ul className="list-disc pl-6 mb-8 grid grid-cols-2 gap-1">
          <li>Cardiology</li>
          <li>Oncology</li>
          <li>Orthopedics</li>
          <li>Neurology</li>
          <li>Gynecology</li>
          <li>Pediatrics</li>
          <li>Emergency Medicine</li>
          <li>General Surgery</li>
          <li>Internal Medicine</li>
          <li>Radiology</li>
          <li>Pathology</li>
          <li>Anesthesiology</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Hospital Facilities to Look For</h2>
        <ul className="list-disc pl-6 mb-8">
          <li>Emergency Services (24/7 availability)</li>
          <li>Operation Theaters (modern surgical facilities)</li>
          <li>Intensive Care Units (ICU/NICU/PICU)</li>
          <li>Diagnostic Labs (pathology, radiology, imaging)</li>
          <li>Pharmacies (in-house medication services)</li>
          <li>Wellness Programs (preventive healthcare)</li>
          <li>Blood Bank Services</li>
          <li>Ambulance Services</li>
          <li>Parking Facilities</li>
          <li>Patient Accommodation</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Benefits for Hospitals</h2>
        <ul className="list-disc pl-6 mb-8">
          <li>Increased online visibility and patient reach</li>
          <li>Direct engagement with patients—no third-party involvement</li>
          <li>Enhanced lead generation and appointment management</li>
          <li>Opportunity to showcase facilities, services, and achievements</li>
          <li>Better patient communication and feedback</li>
          <li>Digital growth and modern healthcare presence</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">How to Choose the Right Hospital</h2>
        <ol className="list-decimal pl-6 mb-8">
          <li className="mb-2">Identify your medical needs and required specialties</li>
          <li className="mb-2">Check hospital accreditation and certifications</li>
          <li className="mb-2">Review available facilities and infrastructure</li>
          <li className="mb-2">Verify doctor availability and consultation hours</li>
          <li className="mb-2">Consider location and accessibility</li>
          <li className="mb-2">Check emergency services availability</li>
          <li className="mb-2">Compare costs and insurance acceptance</li>
          <li className="mb-2">Read patient reviews and ratings</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">Types of Healthcare Facilities</h2>
        <ul className="list-disc pl-6 mb-8">
          <li><strong>Multi-specialty Hospitals:</strong> Comprehensive care across multiple departments</li>
          <li><strong>Super-specialty Hospitals:</strong> Advanced care for specific conditions</li>
          <li><strong>General Hospitals:</strong> Basic healthcare services and emergency care</li>
          <li><strong>Teaching Hospitals:</strong> Academic medical centers with research facilities</li>
          <li><strong>Government Hospitals:</strong> Public healthcare institutions</li>
          <li><strong>Private Hospitals:</strong> Corporate healthcare providers</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Why Choose DOCTAR for Hospital Search?</h2>
        <p className="mb-4">
          With DOCTAR, patients gain trusted access to healthcare while hospitals benefit from stronger patient 
          connections and digital growth. Our platform eliminates middlemen, ensuring direct communication 
          between patients and healthcare providers.
        </p>
        
        <p className="mb-6">
          Whether you need emergency care, planned surgery, or specialized treatment, DOCTAR helps you find 
          the most suitable hospital for your healthcare needs with transparent information and easy booking options.
        </p>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-600">
          For more information about hospital search or to browse available healthcare facilities, 
          please visit our homepage or contact our support team.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default SearchHospitals;
