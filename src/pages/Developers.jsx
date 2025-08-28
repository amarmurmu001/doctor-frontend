import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';

const Developers = () => {
  return (
    <>
      <PageSeo
        title="Developers | DOCTAR API and Integration"
        description="Developer resources for DOCTAR platform. API documentation, integration guides, and technical resources for healthcare application development."
        keywords="doctar api, healthcare api, developer documentation, medical api, health tech integration"
        canonicalUrl="https://www.doctar.in/developers"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Developer Resources</h1>
        
        <p className="mb-8 text-lg">
          Welcome to DOCTAR Developer Center. Here you'll find technical documentation, 
          API references, and integration guides to help you build healthcare applications 
          using our platform.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <p className="mb-6">
          DOCTAR provides robust APIs and developer tools to integrate healthcare functionality 
          into your applications. Our platform is designed to support various integration scenarios 
          while maintaining the highest standards of data security and privacy.
        </p>

        <h2 className="text-2xl font-semibold mb-4">API Overview</h2>
        <p className="mb-4">
          Our APIs are currently in development and will provide access to:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>Doctor search and discovery</li>
          <li>Hospital and clinic information</li>
          <li>Appointment booking capabilities</li>
          <li>Healthcare provider profiles</li>
          <li>Specialty and service listings</li>
          <li>Location-based healthcare services</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <p className="mb-4">
          We're working on comprehensive developer resources including:
        </p>

        <h3 className="text-xl font-semibold mb-3">API Documentation</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>RESTful API endpoints and methods</li>
          <li>Request and response formats</li>
          <li>Authentication and authorization guides</li>
          <li>Rate limiting and usage policies</li>
          <li>Error handling and status codes</li>
          <li>API versioning information</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">SDKs and Libraries</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>JavaScript/Node.js SDK</li>
          <li>Python SDK</li>
          <li>React/React Native components</li>
          <li>Mobile app integration libraries</li>
          <li>PHP integration package</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Developer Tools</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>API testing console</li>
          <li>Code examples and tutorials</li>
          <li>Postman collection</li>
          <li>Webhook configuration guides</li>
          <li>Sandbox environment for testing</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Integration Use Cases</h2>
        
        <h3 className="text-xl font-semibold mb-3">Healthcare Applications</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Patient management systems</li>
          <li>Telemedicine platforms</li>
          <li>Hospital management software</li>
          <li>Health monitoring applications</li>
          <li>Medical record systems</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Enterprise Solutions</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Corporate health platforms</li>
          <li>Insurance provider integrations</li>
          <li>Pharmacy management systems</li>
          <li>Healthcare marketplace applications</li>
          <li>Wellness program platforms</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Security & Compliance</h2>
        <p className="mb-4">
          Our APIs are designed with healthcare data security in mind:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>HTTPS encryption for all API communications</li>
          <li>OAuth 2.0 authentication</li>
          <li>Data privacy compliance (GDPR, healthcare regulations)</li>
          <li>Regular security audits and updates</li>
          <li>Role-based access controls</li>
          <li>Audit logging for all API calls</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Developer Support</h2>
        <p className="mb-4">
          We provide comprehensive support for developers:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>Technical documentation and guides</li>
          <li>Community forums and discussions</li>
          <li>Direct technical support channels</li>
          <li>Regular webinars and training sessions</li>
          <li>Sample applications and code repositories</li>
          <li>Integration assistance and consulting</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Partnership Opportunities</h2>
        <p className="mb-4">
          We're interested in partnerships with:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>Healthcare technology companies</li>
          <li>Hospital management system providers</li>
          <li>Electronic health record vendors</li>
          <li>Telemedicine platform developers</li>
          <li>Health insurance companies</li>
          <li>Government healthcare initiatives</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Technical Requirements</h2>
        <p className="mb-4">
          Minimum requirements for API integration:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>HTTPS support for secure communications</li>
          <li>JSON data format handling</li>
          <li>OAuth 2.0 authentication implementation</li>
          <li>Error handling and retry logic</li>
          <li>Rate limiting compliance</li>
          <li>Data validation and sanitization</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Getting API Access</h2>
        <p className="mb-6">
          To request API access and developer resources:
        </p>
        <ol className="list-decimal pl-6 mb-8">
          <li className="mb-2">Contact our developer relations team</li>
          <li className="mb-2">Provide details about your intended use case</li>
          <li className="mb-2">Complete the developer agreement</li>
          <li className="mb-2">Receive API credentials and documentation</li>
          <li className="mb-2">Start building with sandbox access</li>
          <li className="mb-2">Move to production after testing</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">Terms of Use</h2>
        <p className="mb-6">
          All API usage is subject to our developer terms of service, which include 
          guidelines on data usage, privacy protection, and service level expectations. 
          Detailed terms will be provided upon API access approval.
        </p>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-600">
          Interested in integrating with DOCTAR? Contact our developer team to discuss 
          your requirements and get early access to our API documentation.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Developers;
