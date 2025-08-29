import React, { useState, useMemo } from 'react';
import { faqCategories, generateLocationFAQ, generateSpecialtyFAQ } from '../../data/faqData';

const DynamicFAQ = ({ 
  categories = ['general', 'patients'], 
  location = null, 
  specialty = null,
  maxItems = 10,
  title = "Frequently Asked Questions",
  className = "",
  searchable = true 
}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Generate dynamic FAQs based on location and specialty
  const dynamicFAQs = useMemo(() => {
    let faqs = [];
    
    // Add category-based FAQs
    categories.forEach(category => {
      if (faqCategories[category]) {
        faqs.push(...faqCategories[category].faqs);
      }
    });

    // Add location-specific FAQs
    if (location) {
      const locationFAQs = generateLocationFAQ(location);
      faqs.push(...locationFAQs.map((faq, index) => ({
        id: `location_${index}`,
        ...faq
      })));
    }

    // Add specialty-specific FAQs
    if (specialty) {
      const specialtyFAQs = generateSpecialtyFAQ(specialty);
      faqs.push(...specialtyFAQs.map((faq, index) => ({
        id: `specialty_${index}`,
        ...faq
      })));
    }

    return faqs;
  }, [categories, location, specialty]);

  // Filter FAQs based on search term
  const filteredFAQs = useMemo(() => {
    if (!searchTerm) return dynamicFAQs.slice(0, maxItems);
    
    return dynamicFAQs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, maxItems);
  }, [dynamicFAQs, searchTerm, maxItems]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setActiveIndex(null); // Close any open FAQ when searching
  };

  if (filteredFAQs.length === 0) return null;

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
            {/* FAQ List */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div 
              key={faq.id || index} 
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <svg
                    className={`flex-shrink-0 w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      activeIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {activeIndex === index && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                  {faq.keywords && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {faq.keywords.slice(0, 3).map((keyword, keyIndex) => (
                        <span 
                          key={keyIndex}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show more message if there are more FAQs */}
        {dynamicFAQs.length > maxItems && !searchTerm && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Showing {Math.min(maxItems, filteredFAQs.length)} of {dynamicFAQs.length} FAQs
            </p>
          </div>
        )}

        {/* No results message */}
        {searchTerm && filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No FAQs found for "{searchTerm}". Try a different search term.
            </p>
          </div>
        )}
      </div>

      {/* Schema.org structured data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": filteredFAQs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </div>
  );
};

export default DynamicFAQ;
