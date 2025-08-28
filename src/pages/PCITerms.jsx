import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';

const PCITerms = () => {
  return (
    <>
      <PageSeo
        title="PCI Terms & Conditions | Payment Security | DOCTAR"
        description="PCI DSS compliance terms and conditions for DOCTAR platform. Payment security standards and financial data protection policies."
        keywords="PCI DSS, payment security, financial data protection, payment terms, security compliance"
        canonicalUrl="https://www.doctar.in/pci-terms"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">PCI Terms & Conditions</h1>
        
        <p className="mb-8">
          These PCI (Payment Card Industry) Terms & Conditions outline DOCTAR's commitment 
          to maintaining the highest standards of payment security and financial data protection 
          in accordance with PCI DSS (Payment Card Industry Data Security Standard) requirements.
        </p>

        <h2 className="text-2xl font-semibold mb-4">1. PCI DSS Compliance</h2>
        <p className="mb-4">
          DOCTAR is committed to maintaining PCI DSS compliance to ensure the secure handling 
          of payment card information. Our compliance includes:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>Regular security assessments and vulnerability scans</li>
          <li>Secure network architecture and firewall protection</li>
          <li>Encryption of cardholder data transmission</li>
          <li>Access control measures for cardholder data</li>
          <li>Regular monitoring and testing of security systems</li>
          <li>Maintenance of information security policies</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">2. Payment Processing</h2>
        
        <h3 className="text-xl font-semibold mb-3">Direct Payment Model</h3>
        <p className="mb-4">
          DOCTAR operates on a direct payment model where:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Consultation fees are paid directly to healthcare providers</li>
          <li>DOCTAR does not process or store payment card information</li>
          <li>Appointment booking through DOCTAR is free of charge</li>
          <li>Payment security is maintained through provider payment systems</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Third-Party Payment Processors</h3>
        <p className="mb-6">
          When payment processing is required, we use PCI DSS compliant third-party 
          payment processors who maintain their own security certifications and 
          compliance standards.
        </p>

        <h2 className="text-2xl font-semibold mb-4">3. Data Security Standards</h2>
        
        <h3 className="text-xl font-semibold mb-3">Cardholder Data Protection</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>No storage of sensitive authentication data</li>
          <li>Encryption of cardholder data in transit and at rest</li>
          <li>Secure deletion of cardholder data when no longer needed</li>
          <li>Regular testing of security systems and processes</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Access Controls</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Role-based access to payment systems</li>
          <li>Multi-factor authentication for administrative access</li>
          <li>Regular access reviews and updates</li>
          <li>Audit logging of all payment-related activities</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">4. Security Monitoring</h2>
        <p className="mb-4">
          Our security monitoring includes:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>24/7 network monitoring and intrusion detection</li>
          <li>Regular vulnerability assessments</li>
          <li>Automated security alerts and incident response</li>
          <li>Quarterly external security scans</li>
          <li>Annual penetration testing</li>
          <li>Continuous compliance monitoring</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">5. Incident Response</h2>
        
        <h3 className="text-xl font-semibold mb-3">Security Incident Protocol</h3>
        <p className="mb-4">
          In the event of a security incident:
        </p>
        <ol className="list-decimal pl-6 mb-6">
          <li className="mb-2">Immediate containment and assessment</li>
          <li className="mb-2">Notification to relevant authorities and card brands</li>
          <li className="mb-2">Forensic investigation and root cause analysis</li>
          <li className="mb-2">Remediation and security enhancement</li>
          <li className="mb-2">Communication with affected parties</li>
          <li className="mb-2">Post-incident review and improvement</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">6. Vendor Management</h2>
        <p className="mb-4">
          All third-party vendors handling payment data must:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>Maintain current PCI DSS compliance certification</li>
          <li>Provide evidence of security controls and processes</li>
          <li>Undergo regular security assessments</li>
          <li>Comply with our security requirements and standards</li>
          <li>Report security incidents promptly</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">7. User Responsibilities</h2>
        
        <h3 className="text-xl font-semibold mb-3">For Patients</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Protect your account credentials and personal information</li>
          <li>Use secure networks when accessing payment features</li>
          <li>Report suspicious activities immediately</li>
          <li>Follow secure payment practices when paying providers</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">For Healthcare Providers</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Maintain PCI compliance for your own payment systems</li>
          <li>Protect patient payment information</li>
          <li>Use secure communication channels for payment discussions</li>
          <li>Report any security concerns to DOCTAR immediately</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">8. Compliance Certification</h2>
        <p className="mb-6">
          DOCTAR maintains appropriate PCI DSS compliance certification based on 
          our transaction volume and business model. We undergo regular compliance 
          assessments and maintain current certification status.
        </p>

        <h2 className="text-2xl font-semibold mb-4">9. Data Retention and Disposal</h2>
        <p className="mb-4">
          When payment data is handled:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>Data is retained only as long as necessary for business purposes</li>
          <li>Secure disposal methods are used for data destruction</li>
          <li>Regular purging of unnecessary payment data</li>
          <li>Documentation of data disposal activities</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">10. Updates and Modifications</h2>
        <p className="mb-6">
          These PCI Terms & Conditions may be updated to reflect changes in:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>PCI DSS requirements and standards</li>
          <li>Our payment processing methods</li>
          <li>Regulatory requirements</li>
          <li>Security best practices</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
        <p className="mb-4">
          For PCI-related inquiries or to report security concerns:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Contact our Security Team through official channels</li>
          <li>Report incidents immediately for rapid response</li>
          <li>Request compliance documentation if you're a business partner</li>
          <li>Submit security questions through our support system</li>
        </ul>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-600">
          <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        
        <p className="text-sm text-gray-600 mt-4">
          These PCI Terms & Conditions are part of our overall commitment to security 
          and data protection. For questions about payment security or compliance, 
          please contact our security team.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default PCITerms;
