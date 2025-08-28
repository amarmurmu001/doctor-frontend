import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';

const Privacy = () => {
  return (
    <>
      <PageSeo
        title="Privacy Policy | DOCTAR Data Protection"
        description="DOCTAR's Privacy Policy. Learn how we collect, use, and protect your personal and medical information on our healthcare platform."
        keywords="privacy policy, data protection, medical privacy, healthcare data, user privacy"
        canonicalUrl="https://www.doctar.in/privacy"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <p className="mb-8">
          At DOCTAR, we are committed to protecting your privacy and ensuring the security 
          of your personal and medical information. This Privacy Policy explains how we collect, 
          use, store, and protect your data when you use our platform.
        </p>

        <p className="mb-8">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        
        <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Name, age, gender, and contact information</li>
          <li>Email address and phone number</li>
          <li>Location and address details</li>
          <li>Profile pictures (if provided)</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Medical Information</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Health conditions and symptoms (when provided)</li>
          <li>Medical history (as shared during consultations)</li>
          <li>Appointment and consultation records</li>
          <li>Preferred doctors and specialties</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Technical Information</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Device information and browser type</li>
          <li>IP address and location data</li>
          <li>Usage patterns and platform interactions</li>
          <li>Cookies and tracking data</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        
        <h3 className="text-xl font-semibold mb-3">Service Provision</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Connecting you with appropriate healthcare providers</li>
          <li>Facilitating appointment booking and communication</li>
          <li>Personalizing your healthcare experience</li>
          <li>Providing customer support and assistance</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Platform Improvement</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Analyzing usage patterns to improve our services</li>
          <li>Developing new features and functionality</li>
          <li>Ensuring platform security and preventing fraud</li>
          <li>Conducting research for healthcare insights</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Communication</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Sending appointment confirmations and reminders</li>
          <li>Providing important service updates</li>
          <li>Sharing relevant health information and tips</li>
          <li>Responding to your inquiries and support requests</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
        
        <h3 className="text-xl font-semibold mb-3">With Healthcare Providers</h3>
        <p className="mb-4">
          We share necessary information with healthcare providers to facilitate your 
          appointments and consultations. This includes contact information and relevant 
          medical details you choose to share.
        </p>

        <h3 className="text-xl font-semibold mb-3">Legal Requirements</h3>
        <p className="mb-4">
          We may disclose information when required by law, court orders, or government 
          regulations, or to protect the rights and safety of our users and the public.
        </p>

        <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
        <p className="mb-6">
          We work with trusted third-party service providers for technical support, 
          analytics, and communication services. These providers are bound by strict 
          confidentiality agreements.
        </p>

        <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
        
        <h3 className="text-xl font-semibold mb-3">Protection Measures</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>End-to-end encryption for sensitive data transmission</li>
          <li>Secure servers with regular security updates</li>
          <li>Access controls and authentication systems</li>
          <li>Regular security audits and monitoring</li>
          <li>Employee training on data protection</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Data Storage</h3>
        <p className="mb-6">
          Your data is stored on secure servers located in India, ensuring compliance 
          with local data protection laws. We use industry-standard encryption and 
          backup systems to protect your information.
        </p>

        <h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
        
        <h3 className="text-xl font-semibold mb-3">Access and Control</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>View and update your personal information</li>
          <li>Download your data in a portable format</li>
          <li>Delete your account and associated data</li>
          <li>Control communication preferences</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Consent Management</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Withdraw consent for data processing</li>
          <li>Opt-out of marketing communications</li>
          <li>Control cookie and tracking preferences</li>
          <li>Manage data sharing settings</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
        <p className="mb-4">
          We use cookies and similar technologies to:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Remember your preferences and settings</li>
          <li>Analyze website usage and performance</li>
          <li>Provide personalized content and recommendations</li>
          <li>Ensure platform security and prevent fraud</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
        <p className="mb-6">
          DOCTAR is intended for users aged 18 and above. We do not knowingly collect 
          personal information from children under 18. If you believe we have collected 
          information from a minor, please contact us immediately.
        </p>

        <h2 className="text-2xl font-semibold mb-4">8. International Users</h2>
        <p className="mb-6">
          While DOCTAR primarily serves users in India, we may have users from other 
          countries. All data processing is conducted in accordance with Indian privacy 
          laws and international data protection standards.
        </p>

        <h2 className="text-2xl font-semibold mb-4">9. Data Retention</h2>
        <p className="mb-6">
          We retain your personal information for as long as necessary to provide our 
          services and comply with legal obligations. You can request deletion of your 
          data at any time, subject to legal and regulatory requirements.
        </p>

        <h2 className="text-2xl font-semibold mb-4">10. Updates to This Policy</h2>
        <p className="mb-6">
          We may update this Privacy Policy from time to time to reflect changes in 
          our practices or legal requirements. We will notify you of significant changes 
          through our platform or via email.
        </p>

        <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
        <p className="mb-4">
          If you have questions about this Privacy Policy or how we handle your data:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Contact our Privacy Officer through our contact page</li>
          <li>Email us with specific privacy concerns</li>
          <li>Write to us at our registered office address</li>
          <li>Call our customer support for immediate assistance</li>
        </ul>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-600">
          Your privacy is important to us. If you have any concerns about how your data 
          is handled, please don't hesitate to contact us. We're committed to addressing 
          your privacy concerns promptly and transparently.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
