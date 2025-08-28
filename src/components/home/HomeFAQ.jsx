import React, { useState } from 'react';

const HomeFAQ = () => {
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
    <div className="bg-gradient-to-b from-[#7551B2] to-[#5a3d8a] w-full">
      {/* FAQ Title */}
      <div className="text-center pt-12 pb-8">
        <h1 className="text-4xl font-bold text-white">FAQ's</h1>
      </div>
      
      {/* FAQ List */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {faqData.map((faq) => (
          <div key={faq.id} className="mb-3">
            {/* Question */}
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-white/10 transition-colors rounded-lg"
              onClick={() => toggleQuestion(faq.id)}
            >
              <span className="text-white text-lg font-medium">
                Q{faq.id}. {faq.question}
              </span>
              <div className="text-white ml-4">
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
              <div className="mt-2 ml-4 p-4 bg-white/5 rounded-lg">
                <p className="text-white text-base leading-relaxed opacity-90">
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

export default HomeFAQ;
