import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';
import DynamicFAQ from '../components/FAQ/DynamicFAQ';

const Help = () => {
  return (
    <>
      <PageSeo
        title="Help & Support | DOCTAR FAQ and Guides"
        description="Get help with using DOCTAR. Find answers to frequently asked questions, user guides, and troubleshooting tips for our healthcare platform."
        keywords="doctar help, customer support, FAQ, user guide, healthcare platform help, troubleshooting"
        canonicalUrl="https://www.doctar.in/help"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Help & Support</h1>
        
        <p className="mb-8 text-lg">
          Welcome to DOCTAR Help Center. Here you'll find answers to frequently asked questions, 
          step-by-step guides, and troubleshooting tips to help you make the most of our platform.
        </p>

        {/* Dynamic FAQ Section */}
        <div className="mb-12">
          <DynamicFAQ
            categories={['general', 'patients', 'doctors', 'appointments', 'support']}
            location={null}
            specialty={null}
            searchContext={null}
            maxItems={20}
            title="Frequently Asked Questions"
            searchable={true}
            className="bg-white rounded-lg shadow-sm border"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4">Technical Support</h2>
        
        <h3 className="text-xl font-semibold mb-3">Common Issues</h3>
        
        <h4 className="text-lg font-medium mb-2">I can't find doctors in my area</h4>
        <ul className="list-disc pl-6 mb-4">
          <li>Try expanding your search radius</li>
          <li>Check if you've entered the correct location</li>
          <li>Search by specialty instead of specific doctor names</li>
          <li>Contact our support team if the issue persists</li>
        </ul>

        <h4 className="text-lg font-medium mb-2">The website is loading slowly</h4>
        <ul className="list-disc pl-6 mb-4">
          <li>Check your internet connection</li>
          <li>Clear your browser cache and cookies</li>
          <li>Try refreshing the page</li>
          <li>Use a different browser if the issue continues</li>
        </ul>

        <h4 className="text-lg font-medium mb-2">I'm having trouble with the search function</h4>
        <ul className="list-disc pl-6 mb-6">
          <li>Make sure you're using correct spelling</li>
          <li>Try using general terms instead of specific names</li>
          <li>Use location-based search if available</li>
          <li>Contact support for advanced search assistance</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">User Guides</h2>
        
        <h3 className="text-xl font-semibold mb-3">Patient Guide</h3>
        <ol className="list-decimal pl-6 mb-6">
          <li className="mb-2">Visit the DOCTAR website or app</li>
          <li className="mb-2">Use the search function to find healthcare providers</li>
          <li className="mb-2">Filter results by location, specialty, or other preferences</li>
          <li className="mb-2">Review doctor profiles, ratings, and available services</li>
          <li className="mb-2">Contact your chosen provider using their preferred method</li>
          <li className="mb-2">Book your appointment and confirm details</li>
          <li className="mb-2">Attend your consultation at the scheduled time</li>
        </ol>

        <h3 className="text-xl font-semibold mb-3">Healthcare Provider Guide</h3>
        <ol className="list-decimal pl-6 mb-6">
          <li className="mb-2">Register your practice on the DOCTAR platform</li>
          <li className="mb-2">Complete the verification process</li>
          <li className="mb-2">Set up your detailed profile with services and timings</li>
          <li className="mb-2">Add high-quality photos and detailed descriptions</li>
          <li className="mb-2">Configure your preferred contact methods</li>
          <li className="mb-2">Start receiving patient inquiries and bookings</li>
          <li className="mb-2">Manage appointments and patient communications</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">Safety & Privacy</h2>
        
        <h4 className="text-lg font-medium mb-2">Is my personal information safe?</h4>
        <p className="mb-4">
          Yes, we take privacy seriously and follow strict data protection protocols. 
          Your personal information is encrypted and secure.
        </p>

        <h4 className="text-lg font-medium mb-2">How are doctors verified?</h4>
        <p className="mb-6">
          All healthcare providers on DOCTAR go through a comprehensive verification process 
          including license verification, credential checks, and practice validation.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
        <p className="mb-4">
          If you can't find the answer to your question here, our support team is ready to help:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Response time: Within 24 hours for general inquiries</li>
          <li>Technical issues: Within 12 hours</li>
          <li>Available: Monday to Saturday, 9 AM to 7 PM IST</li>
          <li>Languages: English, Hindi, and major regional languages</li>
        </ul>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-600">
          Still need help? Contact our support team through the contact page for personalized assistance.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Help;
