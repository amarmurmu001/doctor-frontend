import React from 'react';
import DynamicFAQ from './FAQ/DynamicFAQ';

const FAQ = ({ 
  categories = ['general', 'patients'], 
  location = null, 
  specialty = null,
  maxItems = 8,
  title = "Frequently Asked Questions"
}) => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <DynamicFAQ 
          categories={categories}
          location={location}
          specialty={specialty}
          maxItems={maxItems}
          title={title}
          searchable={true}
          className="shadow-lg"
        />
      </div>
    </div>
  );
};

export default FAQ;
