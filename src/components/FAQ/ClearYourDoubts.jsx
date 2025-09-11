import React, { useState } from 'react';

const ClearYourDoubts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  // Sample FAQ data - you can replace this with actual data from your API
  const faqData = [
    {
      id: 1,
      question: "What is Lorem Ipsum?",
      answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      questioner: "Arnav",
      questionDate: "Nov, 2024",
      answerer: "Arya",
      answerDate: "Nov, 2024",
      helpfulYes: 21,
      helpfulNo: 21
    },
    {
      id: 2,
      question: "How do I book an appointment with a doctor?",
      answer: "You can book an appointment by searching for doctors on our platform, selecting your preferred doctor, and choosing an available time slot. You'll receive a confirmation email with all the details.",
      questioner: "Priya",
      questionDate: "Dec, 2024",
      answerer: "Dr. Smith",
      answerDate: "Dec, 2024",
      helpfulYes: 45,
      helpfulNo: 3
    },
    {
      id: 3,
      question: "What are the consultation fees?",
      answer: "Consultation fees vary depending on the doctor's specialty and experience. You can see the fees displayed on each doctor's profile before booking an appointment.",
      questioner: "Rahul",
      questionDate: "Dec, 2024",
      answerer: "Dr. Johnson",
      answerDate: "Dec, 2024",
      helpfulYes: 38,
      helpfulNo: 7
    }
  ];

  // Filter questions based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredQuestions([]);
    } else {
      const filtered = faqData.filter(item =>
        item.question.toLowerCase().includes(query.toLowerCase()) ||
        item.answer.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredQuestions(filtered);
    }
  };

  // Display questions (filtered if search is active, otherwise show all)
  const displayQuestions = searchQuery.trim() === '' ? faqData : filteredQuestions;

  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Clear your Doubts
          </h2>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Have any Question"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Questions and Answers */}
        <div className="space-y-6 mb-8">
          {displayQuestions.length === 0 && searchQuery.trim() !== '' ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No questions found matching your search.</p>
            </div>
          ) : (
            displayQuestions.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Question */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Q{item.id}. {item.question}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.questioner} • {item.questionDate}
                  </p>
                </div>

                {/* Answer */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed mb-2">
                    {item.answer}
                  </p>
                  <p className="text-sm text-gray-500">
                    By {item.answerer} • {item.answerDate}
                  </p>
                </div>

                {/* Action and Feedback Section */}
                <div className="flex justify-between items-center">
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Add Answer
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Was it Helpful</span>
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span className="text-xs">Yes ({item.helpfulYes})</span>
                      </button>
                      <button className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v-2M7 4H5a2 2 0 00-2 2v6a2 2 0 002 2h2.5" />
                        </svg>
                        <span className="text-xs">No ({item.helpfulNo})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ask Questions Button */}
        <div className="text-center">
          <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
            Ask Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearYourDoubts;
