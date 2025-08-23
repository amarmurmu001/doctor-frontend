import React, { useState } from 'react';

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(1);

  const faqData = [
    {
      id: 1,
      question: "FAQ question will be here ?",
      answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"
    },
    {
      id: 2,
      question: "FAQ question will be here ?",
      answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"
    },
    {
      id: 3,
      question: "FAQ question will be here ?",
      answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"
    },
    {
      id: 4,
      question: "FAQ question will be here ?",
      answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"
    },
    {
      id: 5,
      question: "FAQ question will be here ?",
      answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"
    },
    {
      id: 6,
      question: "FAQ question will be here ?",
      answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"
    }
  ];

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <div className="bg-[#3a3a3a] min-h-screen">
      {/* Blue Line */}
      <div className="w-full h-1 bg-blue-500"></div>
      
      {/* FAQ Title */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-white">FAQ's</h1>
      </div>
      
      {/* FAQ List */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {faqData.map((faq) => (
          <div key={faq.id} className="mb-4">
            {/* Question */}
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => toggleQuestion(faq.id)}
            >
              <span className="text-white text-xl">
                Q{faq.id}. {faq.question}
              </span>
              <div className="text-white">
                {openQuestion === faq.id ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
            
            {/* Answer */}
            {openQuestion === faq.id && (
              <div className="mt-2 ml-4 p-4">
                <p className="text-white text-xl leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
