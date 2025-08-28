import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';

const Contact = () => {
  return (
    <>
      <PageSeo
        title="Contact DOCTAR | Get in Touch with Our Team"
        description="Contact DOCTAR for support, partnerships, or general inquiries. Reach our team through multiple channels for healthcare platform assistance."
        keywords="contact doctar, customer support, healthcare support, contact us, help desk"
        canonicalUrl="https://www.doctar.in/contact"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
        
        <p className="mb-8 text-lg">
          We're here to help! Whether you're a patient looking for healthcare providers, 
          a doctor wanting to join our platform, or have general inquiries about DOCTAR, 
          we'd love to hear from you.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
        <p className="mb-6">
          Our team is available to assist you with any questions or concerns about 
          using the DOCTAR platform. We strive to respond to all inquiries promptly.
        </p>

        <h2 className="text-2xl font-semibold mb-4">For Patients</h2>
        <p className="mb-4">
          If you need help with:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Finding doctors, clinics, or hospitals</li>
          <li>Booking appointments</li>
          <li>Understanding platform features</li>
          <li>Technical support with the website or app</li>
          <li>Account-related issues</li>
          <li>General platform questions</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">For Healthcare Providers</h2>
        <p className="mb-4">
          If you're a doctor, clinic, or hospital interested in:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Joining the DOCTAR platform</li>
          <li>Profile verification and setup</li>
          <li>Managing your online presence</li>
          <li>Understanding platform benefits</li>
          <li>Partnership opportunities</li>
          <li>Technical support for provider features</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">For Business Partners</h2>
        <p className="mb-4">
          For inquiries about:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Business partnerships and collaborations</li>
          <li>Integration opportunities</li>
          <li>Corporate health programs</li>
          <li>Bulk healthcare solutions</li>
          <li>API access and technical partnerships</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Media & Press</h2>
        <p className="mb-4">
          For media inquiries:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Press releases and announcements</li>
          <li>Interview requests</li>
          <li>Media kits and brand assets</li>
          <li>Speaking opportunities</li>
          <li>Industry expert commentary</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Technical Support</h2>
        <p className="mb-4">
          For technical issues with:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Website functionality</li>
          <li>Mobile app problems</li>
          <li>Login and account access</li>
          <li>Search and booking features</li>
          <li>Profile management</li>
          <li>Browser compatibility issues</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Office Hours</h2>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Customer Support:</strong> Monday to Saturday, 9:00 AM to 7:00 PM IST</li>
          <li><strong>Technical Support:</strong> Monday to Friday, 10:00 AM to 6:00 PM IST</li>
          <li><strong>Business Inquiries:</strong> Monday to Friday, 9:00 AM to 6:00 PM IST</li>
          <li><strong>Emergency Support:</strong> Available for critical platform issues</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Response Times</h2>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>General Inquiries:</strong> Within 24 hours</li>
          <li><strong>Technical Issues:</strong> Within 12 hours</li>
          <li><strong>Healthcare Provider Onboarding:</strong> Within 48 hours</li>
          <li><strong>Media Requests:</strong> Within 24 hours</li>
          <li><strong>Business Partnerships:</strong> Within 3-5 business days</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Feedback & Suggestions</h2>
        <p className="mb-6">
          We value your feedback and continuously work to improve our platform. 
          If you have suggestions for new features, improvements, or general feedback 
          about your experience with DOCTAR, please don't hesitate to share them with us.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Quality Concerns</h2>
        <p className="mb-6">
          If you have concerns about the quality of care received from any healthcare 
          provider on our platform, please contact us immediately. We take all quality 
          issues seriously and will investigate promptly.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Regional Support</h2>
        <p className="mb-6">
          DOCTAR provides support in multiple Indian languages to better serve our 
          diverse user base. Our support team can assist you in English, Hindi, 
          and other major regional languages.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
        <p className="mb-6">
          Stay updated with the latest news, features, and health tips by following 
          DOCTAR on our social media channels. Links to our social media profiles 
          can be found in the footer section of our website.
        </p>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-600">
          We appreciate your interest in DOCTAR and look forward to assisting you. 
          Our team is committed to providing excellent support and ensuring you have 
          the best possible experience with our healthcare platform.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
