import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';

const Directory = () => {
  return (
    <>
      <PageSeo
        title="Healthcare Directory | DOCTAR Medical Professional Listing"
        description="Browse DOCTAR's comprehensive healthcare directory. Find doctors, clinics, and hospitals across India organized by specialty and location."
        keywords="healthcare directory, medical directory, doctor listing, hospital directory, clinic directory, medical professionals"
        canonicalUrl="https://www.doctar.in/directory"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Healthcare Directory</h1>
        
        <p className="mb-8 text-lg">
          Welcome to DOCTAR's comprehensive healthcare directory - your complete guide to 
          medical professionals, healthcare facilities, and medical services across India.
        </p>

        <h2 className="text-2xl font-semibold mb-4">About Our Directory</h2>
        <p className="mb-6">
          The DOCTAR Healthcare Directory is a comprehensive listing of verified doctors, 
          clinics, hospitals, and medical specialists across India. Our directory helps 
          patients find the right healthcare provider based on their specific needs, 
          location, and preferences.
        </p>

        <h2 className="text-2xl font-semibold mb-4">What's Included</h2>
        
        <h3 className="text-xl font-semibold mb-3">Medical Professionals</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>General Practitioners and Family Doctors</li>
          <li>Specialist Doctors across all medical fields</li>
          <li>Surgeons and Surgical Specialists</li>
          <li>Alternative Medicine Practitioners</li>
          <li>Mental Health Professionals</li>
          <li>Allied Healthcare Professionals</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Healthcare Facilities</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Multi-specialty Hospitals</li>
          <li>Super-specialty Medical Centers</li>
          <li>Primary Care Clinics</li>
          <li>Diagnostic Centers</li>
          <li>Rehabilitation Centers</li>
          <li>Emergency Care Facilities</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Medical Specialties Covered</h2>
        
        <h3 className="text-xl font-semibold mb-3">Primary Care</h3>
        <ul className="list-disc pl-6 mb-4 grid grid-cols-2 gap-1">
          <li>General Medicine</li>
          <li>Family Medicine</li>
          <li>Internal Medicine</li>
          <li>Preventive Care</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Surgical Specialties</h3>
        <ul className="list-disc pl-6 mb-4 grid grid-cols-2 gap-1">
          <li>General Surgery</li>
          <li>Orthopedic Surgery</li>
          <li>Cardiac Surgery</li>
          <li>Neurosurgery</li>
          <li>Plastic Surgery</li>
          <li>Oncological Surgery</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Medical Specialties</h3>
        <ul className="list-disc pl-6 mb-4 grid grid-cols-2 gap-1">
          <li>Cardiology</li>
          <li>Neurology</li>
          <li>Oncology</li>
          <li>Endocrinology</li>
          <li>Gastroenterology</li>
          <li>Pulmonology</li>
          <li>Rheumatology</li>
          <li>Nephrology</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Diagnostic Specialties</h3>
        <ul className="list-disc pl-6 mb-6 grid grid-cols-2 gap-1">
          <li>Radiology</li>
          <li>Pathology</li>
          <li>Clinical Laboratory</li>
          <li>Nuclear Medicine</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Geographic Coverage</h2>
        
        <h3 className="text-xl font-semibold mb-3">Major Cities</h3>
        <ul className="list-disc pl-6 mb-4 grid grid-cols-3 gap-1">
          <li>Mumbai</li>
          <li>Delhi</li>
          <li>Bangalore</li>
          <li>Kolkata</li>
          <li>Chennai</li>
          <li>Hyderabad</li>
          <li>Pune</li>
          <li>Ahmedabad</li>
          <li>Jaipur</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Regional Centers</h3>
        <ul className="list-disc pl-6 mb-6 grid grid-cols-3 gap-1">
          <li>Dhanbad</li>
          <li>Deoghar</li>
          <li>Patna</li>
          <li>Lucknow</li>
          <li>Bhubaneswar</li>
          <li>Guwahati</li>
          <li>Chandigarh</li>
          <li>Indore</li>
          <li>Kochi</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">How to Use the Directory</h2>
        <ol className="list-decimal pl-6 mb-8">
          <li className="mb-2">Browse by medical specialty or condition</li>
          <li className="mb-2">Filter by location and proximity</li>
          <li className="mb-2">Read detailed provider profiles</li>
          <li className="mb-2">Check availability and services offered</li>
          <li className="mb-2">View contact information and booking options</li>
          <li className="mb-2">Connect directly with healthcare providers</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">Provider Information</h2>
        <p className="mb-4">
          Each directory listing includes:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>Professional qualifications and certifications</li>
          <li>Areas of specialization and expertise</li>
          <li>Years of experience and background</li>
          <li>Hospital affiliations and practice locations</li>
          <li>Services offered and treatment approaches</li>
          <li>Consultation fees and insurance acceptance</li>
          <li>Contact information and appointment booking</li>
          <li>Patient reviews and ratings (where available)</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Quality Assurance</h2>
        <p className="mb-4">
          Our directory maintains high standards through:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>Verification of medical licenses and credentials</li>
          <li>Regular updates of provider information</li>
          <li>Quality checks on listed services and facilities</li>
          <li>Patient feedback and review systems</li>
          <li>Ongoing monitoring of provider status</li>
          <li>Compliance with medical practice standards</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">For Healthcare Providers</h2>
        <p className="mb-4">
          Benefits of being listed in our directory:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>Increased visibility to potential patients</li>
          <li>Professional profile showcase</li>
          <li>Direct patient communication channels</li>
          <li>Appointment booking facilitation</li>
          <li>Practice management support</li>
          <li>Digital presence enhancement</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Emergency Services</h2>
        <p className="mb-4">
          Our directory also includes:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>24/7 emergency care facilities</li>
          <li>Trauma centers and emergency departments</li>
          <li>Urgent care clinics</li>
          <li>Ambulance services</li>
          <li>Emergency contact information</li>
          <li>Crisis intervention services</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Accessibility Features</h2>
        <p className="mb-6">
          Our directory is designed to be accessible and includes information about:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>Wheelchair accessibility</li>
          <li>Language support and interpretation services</li>
          <li>Special needs accommodations</li>
          <li>Transportation and parking facilities</li>
          <li>Extended hours and weekend availability</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Directory Updates</h2>
        <p className="mb-6">
          We continuously update our directory to ensure accuracy and completeness. 
          Healthcare providers are encouraged to keep their profiles current, and 
          patients can report any outdated information they encounter.
        </p>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-600">
          To search our healthcare directory or to inquire about listing your practice, 
          please use our search function or contact our directory team for assistance.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Directory;
