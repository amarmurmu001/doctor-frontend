import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';

const TermsAndConditions = () => {
  return (
    <>
      <PageSeo
        title="Terms & Conditions | Doctar"
        description="Read DOCTAR's Terms & Conditions. Understand your rights and responsibilities when using our digital healthcare platform to connect with doctors, clinics, and hospitals."
        keywords="terms and conditions, terms of service, user agreement, legal terms, healthcare platform terms"
        canonicalUrl="https://www.doctar.in/terms"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>
        
        <p className="mb-8">
          Welcome to DOCTAR. By accessing or using our website, mobile application, or services, you agree to comply with and be bound by the following Terms & Conditions. Please read them carefully before using our platform.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-8">
          By registering, accessing, or using DOCTAR, you confirm that you have read, understood, and agree to these Terms & Conditions. If you do not agree, you must not use the platform.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">2. Nature of Services</h2>
        <ul className="list-disc pl-6 mb-8">
          <li className="mb-2">
            DOCTAR is a digital healthcare platform that connects patients directly with doctors, clinics, and hospitals.
          </li>
          <li className="mb-2">
            We do not provide medical treatment ourselves; all medical advice, treatment, and consultations are the responsibility of the respective healthcare provider.
          </li>
          <li className="mb-2">
            DOCTAR acts as a facilitator for communication and appointment booking.
          </li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
        <ul className="list-disc pl-6 mb-8">
          <li className="mb-2">
            Patients must provide accurate personal and medical information when booking consultations.
          </li>
          <li className="mb-2">
            Users are responsible for maintaining the confidentiality of their login credentials.
          </li>
          <li className="mb-2">
            Any misuse of the platform for fraudulent or illegal purposes is strictly prohibited.
          </li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">4. Doctor / Clinic / Hospital Responsibilities</h2>
        <ul className="list-disc pl-6 mb-8">
          <li className="mb-2">
            Healthcare providers must ensure that all information posted on DOCTAR (specialization, qualifications, timings, fees, etc.) is accurate and updated.
          </li>
          <li className="mb-2">
            Doctors, clinics, and hospitals are solely responsible for the quality of care and services provided.
          </li>
          <li className="mb-2">
            DOCTAR is not liable for any disputes arising between patients and healthcare providers.
          </li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">5. Booking & Payments</h2>
        <ul className="list-disc pl-6 mb-8">
          <li className="mb-2">
            Appointment booking through DOCTAR is free of cost unless otherwise specified.
          </li>
          <li className="mb-2">
            Any consultation fees are to be paid directly to the healthcare provider.
          </li>
          <li className="mb-2">
            DOCTAR is not responsible for refunds or disputes related to payments made outside the platform.
          </li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">6. Privacy & Data Protection</h2>
        <ul className="list-disc pl-6 mb-8">
          <li className="mb-2">
            DOCTAR values your privacy. Patient and doctor information will be handled in accordance with our Privacy Policy.
          </li>
          <li className="mb-2">
            Data will not be shared with third parties without consent, except as required by law.
          </li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">7. Limitations of Liability</h2>
        <ul className="list-disc pl-6 mb-8">
          <li className="mb-2">
            DOCTAR is not responsible for the accuracy of medical advice, treatment outcomes, or services provided by doctors, clinics, or hospitals.
          </li>
          <li className="mb-2">
            The platform is provided on an "as is" basis, and we make no guarantees regarding availability, accuracy, or suitability for a particular purpose.
          </li>
        </ul>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">8. Termination of Access</h2>
        <p className="mb-8">
          DOCTAR reserves the right to suspend or terminate user access if there is a violation of these Terms & Conditions, misuse of services, or fraudulent activity.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">9. Modifications to Terms</h2>
        <p className="mb-8">
          We may update or modify these Terms & Conditions at any time. Continued use of the platform after changes are posted implies acceptance of the revised terms.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
        <p className="mb-8">
          These Terms & Conditions are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of courts located in Bangalore, India.
        </p>

        <hr className="my-8" />

        <p className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
