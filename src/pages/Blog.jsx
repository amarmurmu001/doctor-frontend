import React from 'react';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';

const Blog = () => {
  return (
    <>
      <PageSeo
        title="DOCTAR Blog | Healthcare News & Articles"
        description="Read the latest healthcare news, medical tips, and articles from DOCTAR. Stay informed about health trends, medical innovations, and wellness advice."
        keywords="health blog, medical articles, healthcare news, wellness tips, medical advice, health information"
        canonicalUrl="https://www.doctar.in/blog"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">DOCTAR Blog</h1>
        
        <p className="mb-8 text-lg">
          Welcome to the DOCTAR Blog - your source for reliable healthcare information, 
          medical insights, and wellness tips from verified healthcare professionals.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Latest Articles</h2>
        <p className="mb-6">
          Our blog is currently under development. We are working on bringing you high-quality, 
          medically-reviewed content from our network of verified healthcare professionals.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <p className="mb-4">
          Once launched, our blog will feature:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>Expert medical advice and health tips</li>
          <li>Disease prevention and wellness guides</li>
          <li>Latest healthcare news and medical research</li>
          <li>Doctor interviews and professional insights</li>
          <li>Patient success stories and testimonials</li>
          <li>Health awareness articles for various conditions</li>
          <li>Seasonal health tips and preventive care advice</li>
          <li>Mental health and lifestyle wellness content</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Health Categories We'll Cover</h2>
        <ul className="list-disc pl-6 mb-8 grid grid-cols-2 gap-1">
          <li>Cardiology</li>
          <li>Diabetes Management</li>
          <li>Mental Health</li>
          <li>Women's Health</li>
          <li>Pediatric Care</li>
          <li>Elderly Care</li>
          <li>Nutrition & Diet</li>
          <li>Fitness & Exercise</li>
          <li>Preventive Care</li>
          <li>Chronic Disease Management</li>
          <li>Emergency Care</li>
          <li>Seasonal Health</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Expert Contributors</h2>
        <p className="mb-6">
          All our blog content will be created and reviewed by qualified healthcare professionals 
          from our verified network of doctors, ensuring accurate and reliable medical information.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
        <p className="mb-6">
          While we prepare our blog content, stay connected with DOCTAR for the latest updates. 
          You can continue to use our platform to find and connect with healthcare professionals 
          for your immediate medical needs.
        </p>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-600">
          For immediate medical consultation, please use our doctor search feature to connect 
          with qualified healthcare professionals in your area.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
