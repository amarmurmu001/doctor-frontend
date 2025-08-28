import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';

const Careers = () => {
  return (
    <>
      <PageSeo
        title="Careers at DOCTAR | Join Our Healthcare Revolution"
        description="Join DOCTAR's mission to transform healthcare in India. Explore career opportunities in technology, healthcare, marketing, and operations."
        keywords="doctar careers, healthcare jobs, tech jobs, digital health careers, medical technology jobs"
        canonicalUrl="https://www.doctar.in/careers"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Careers at DOCTAR</h1>
        
        <h2 className="text-2xl font-semibold mb-4">Join Our Mission</h2>
        <p className="mb-6">
          At DOCTAR, we're revolutionizing healthcare delivery in India by connecting patients 
          directly with qualified healthcare professionals. Join our team and be part of the 
          digital healthcare transformation that's making quality medical care accessible to millions.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Why Work at DOCTAR?</h2>
        <ul className="list-disc pl-6 mb-8">
          <li><strong>Meaningful Impact:</strong> Your work directly improves healthcare access for patients across India</li>
          <li><strong>Innovation Focus:</strong> Work with cutting-edge technology in the healthcare sector</li>
          <li><strong>Growth Opportunities:</strong> Be part of a rapidly growing startup with expansion opportunities</li>
          <li><strong>Collaborative Environment:</strong> Work with passionate professionals from diverse backgrounds</li>
          <li><strong>Learning Culture:</strong> Continuous learning and skill development opportunities</li>
          <li><strong>Work-Life Balance:</strong> Flexible working arrangements and comprehensive benefits</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Open Positions</h2>
        <p className="mb-6">
          We are currently building our team and will be posting open positions soon. 
          Career opportunities will be available in the following areas:
        </p>

        <h3 className="text-xl font-semibold mb-3">Technology & Development</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Full Stack Developers</li>
          <li>Frontend Developers (React/React Native)</li>
          <li>Backend Developers (Node.js/Python)</li>
          <li>Mobile App Developers</li>
          <li>DevOps Engineers</li>
          <li>Quality Assurance Engineers</li>
          <li>Data Scientists</li>
          <li>UI/UX Designers</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Healthcare & Operations</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Healthcare Partnership Managers</li>
          <li>Medical Content Reviewers</li>
          <li>Doctor Onboarding Specialists</li>
          <li>Patient Support Associates</li>
          <li>Operations Managers</li>
          <li>Quality Assurance Specialists</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Business & Marketing</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Digital Marketing Specialists</li>
          <li>Business Development Managers</li>
          <li>Product Managers</li>
          <li>Content Writers</li>
          <li>Social Media Managers</li>
          <li>Performance Marketing Experts</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Support Functions</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Human Resources Specialists</li>
          <li>Finance & Accounting Professionals</li>
          <li>Legal & Compliance Officers</li>
          <li>Customer Success Managers</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">What We Look For</h2>
        <ul className="list-disc pl-6 mb-8">
          <li>Passion for healthcare and technology</li>
          <li>Strong problem-solving abilities</li>
          <li>Collaborative mindset and team spirit</li>
          <li>Adaptability in a fast-paced startup environment</li>
          <li>Commitment to quality and excellence</li>
          <li>Relevant educational background and experience</li>
          <li>Strong communication skills</li>
          <li>Interest in making a positive social impact</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Our Culture</h2>
        <p className="mb-4">
          DOCTAR fosters a culture of:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li><strong>Innovation:</strong> Encouraging creative solutions and new ideas</li>
          <li><strong>Transparency:</strong> Open communication and honest feedback</li>
          <li><strong>Collaboration:</strong> Working together towards common goals</li>
          <li><strong>Excellence:</strong> Striving for high-quality outcomes</li>
          <li><strong>Empathy:</strong> Understanding and caring for our users' needs</li>
          <li><strong>Continuous Learning:</strong> Growing personally and professionally</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Benefits & Perks</h2>
        <ul className="list-disc pl-6 mb-8">
          <li>Competitive salary and equity participation</li>
          <li>Comprehensive health insurance coverage</li>
          <li>Flexible working hours and remote work options</li>
          <li>Professional development and training opportunities</li>
          <li>Modern office space with latest technology</li>
          <li>Team outings and cultural events</li>
          <li>Performance-based bonuses and incentives</li>
          <li>Employee wellness programs</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Application Process</h2>
        <p className="mb-6">
          Our hiring process is designed to be thorough yet efficient:
        </p>
        <ol className="list-decimal pl-6 mb-8">
          <li className="mb-2">Submit your application with resume and cover letter</li>
          <li className="mb-2">Initial screening call with our HR team</li>
          <li className="mb-2">Technical/functional assessment (if applicable)</li>
          <li className="mb-2">Interview with hiring manager and team members</li>
          <li className="mb-2">Final interview with leadership team</li>
          <li className="mb-2">Reference checks and offer discussion</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">Ready to Join Us?</h2>
        <p className="mb-6">
          We're always looking for talented individuals who share our vision of transforming 
          healthcare in India. Even if we don't have an open position that matches your 
          background right now, we encourage you to reach out to us.
        </p>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-600">
          To express your interest in working with DOCTAR or to inquire about upcoming opportunities, 
          please contact us through our contact page or send your resume to our careers email.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Careers;
