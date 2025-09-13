import React, { useState } from 'react';
import PageSeo from '../components/seo/PageSeo';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  // Extended FAQ data for the full page
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
      helpfulNo: 21,
      category: "General"
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
      helpfulNo: 3,
      category: "Appointments"
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
      helpfulNo: 7,
      category: "Fees"
    },
    {
      id: 4,
      question: "How do I cancel my appointment?",
      answer: "You can cancel your appointment by going to your profile, selecting the appointment, and clicking the cancel button. Please note that cancellation policies may vary by doctor.",
      questioner: "Sneha",
      questionDate: "Dec, 2024",
      answerer: "Dr. Patel",
      answerDate: "Dec, 2024",
      helpfulYes: 42,
      helpfulNo: 5,
      category: "Appointments"
    },
    {
      id: 5,
      question: "Are online consultations available?",
      answer: "Yes, many doctors offer online consultations through video calls. You can filter doctors by consultation type when searching to find those who offer online appointments.",
      questioner: "Vikram",
      questionDate: "Dec, 2024",
      answerer: "Dr. Kumar",
      answerDate: "Dec, 2024",
      helpfulYes: 55,
      helpfulNo: 2,
      category: "Consultations"
    },
    {
      id: 6,
      question: "What if I need to reschedule my appointment?",
      answer: "You can reschedule your appointment by contacting the doctor directly or using the reschedule option in your appointment details. Most doctors allow rescheduling up to 24 hours before the appointment.",
      questioner: "Anita",
      questionDate: "Dec, 2024",
      answerer: "Dr. Sharma",
      answerDate: "Dec, 2024",
      helpfulYes: 33,
      helpfulNo: 8,
      category: "Appointments"
    },
    {
      id: 7,
      question: "How do I find doctors near me?",
      answer: "You can find doctors near you by using our location-based search. Simply enter your city or area in the search bar, and we'll show you all available doctors in that location.",
      questioner: "Rajesh",
      questionDate: "Dec, 2024",
      answerer: "Dr. Gupta",
      answerDate: "Dec, 2024",
      helpfulYes: 67,
      helpfulNo: 4,
      category: "Search"
    },
    {
      id: 8,
      question: "What specialties are available?",
      answer: "We have doctors across various specialties including Cardiology, Dermatology, Pediatrics, Gynecology, Neurology, Orthopedics, Psychiatry, and many more. You can browse by specialty on our departments page.",
      questioner: "Meera",
      questionDate: "Dec, 2024",
      answerer: "Dr. Singh",
      answerDate: "Dec, 2024",
      helpfulYes: 52,
      helpfulNo: 6,
      category: "Specialties"
    },
    {
      id: 9,
      question: "How do I contact customer support?",
      answer: "You can contact our customer support team through the contact form on our website, or by emailing us directly. We typically respond within 24 hours.",
      questioner: "Kavita",
      questionDate: "Dec, 2024",
      answerer: "Support Team",
      answerDate: "Dec, 2024",
      helpfulYes: 28,
      helpfulNo: 12,
      category: "Support"
    },
    {
      id: 10,
      question: "Is my personal information secure?",
      answer: "Yes, we take your privacy and security seriously. All personal information is encrypted and stored securely. We comply with all relevant data protection regulations.",
      questioner: "Amit",
      questionDate: "Dec, 2024",
      answerer: "Security Team",
      answerDate: "Dec, 2024",
      helpfulYes: 89,
      helpfulNo: 3,
      category: "Privacy"
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
        item.answer.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredQuestions(filtered);
    }
  };

  // Display questions (filtered if search is active, otherwise show all)
  const displayQuestions = searchQuery.trim() === '' ? faqData : filteredQuestions;

  return (
    <>
      <PageSeo 
        title="Frequently Asked Questions | Clear Your Doubts | Doctar"
        description="Find answers to common questions about booking appointments, consultation fees, doctor search, and more. Clear your doubts with our comprehensive FAQ section."
        keywords="FAQ, frequently asked questions, doctor appointments, consultation fees, medical help, Doctar"
        canonicalUrl="https://www.doctar.in/faq"
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Clear your Doubts
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our platform, doctor appointments, and medical services.
            </p>
          </div>

          {/* Search Input */}
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                placeholder="Search for questions or topics..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Questions and Answers */}
          <div className="space-y-8">
            {displayQuestions.length === 0 && searchQuery.trim() !== '' ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-500 mb-6">
                  No questions match your search criteria. Try different keywords or browse all questions.
                </p>
                <button
                  onClick={() => handleSearch('')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View All Questions
                </button>
              </div>
            ) : (
              displayQuestions.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* Question */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Q{item.id}. {item.question}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Asked by {item.questioner} • {item.questionDate}
                    </p>
                  </div>

                  {/* Answer */}
                  <div className="mb-8">
                    <p className="text-gray-700 leading-relaxed text-lg mb-3">
                      {item.answer}
                    </p>
                    <p className="text-sm text-gray-500">
                      Answered by {item.answerer} • {item.answerDate}
                    </p>
                  </div>

                  {/* Action and Feedback Section */}
                  <div className="flex justify-between items-center">
                    <button className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                      Add Answer
                    </button>
                    
                    <div className="flex items-center space-x-6">
                      <span className="text-sm text-gray-600 font-medium">Was it Helpful?</span>
                      <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          <span className="text-sm font-medium">Yes ({item.helpfulYes})</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v-2M7 4H5a2 2 0 00-2 2v6a2 2 0 002 2h2.5" />
                          </svg>
                          <span className="text-sm font-medium">No ({item.helpfulNo})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ask Questions Button */}
          <div className="text-center mt-12">
            <button className="bg-gray-900 text-white px-10 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg">
              Ask a New Question
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
