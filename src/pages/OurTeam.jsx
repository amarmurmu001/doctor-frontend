import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageSeo from '../components/seo/PageSeo';
import Footer from '../components/layout/Footer';
import TeamMemberCard from '../components/team/TeamMemberCard';
import TeamMemberDetail from '../components/team/TeamMemberDetail';

// Sample team data - you can replace this with data from your API
const teamMembers = [
  {
    id: 1,
    name: "Aditya Rajput",
    title: "Chief Executive Officer (CEO)",
    initials: "AR",
    color: "#f97316", // Orange
    description: "Aditya drives the company's vision, strategy, and growth. With strong leadership and business acumen, he inspires the team to achieve excellence and innovation. Aditya ensures that every decision aligns with our mission, creating long-term value for clients, partners, and the community while guiding the company toward sustainable success.",
    image: null,
    email: "aditya@doctar.in",
    linkedin: "https://linkedin.com/in/aditya-rajput",
    phone: "+91 98765 43210"
  },
  {
    id: 2,
    name: "Dolly J",
    title: "Chief Marketing Officer",
    initials: "DJ",
    color: "#f97316", // Orange
    description: "Dolly leads our marketing initiatives with expertise in digital strategy and brand development. Her expert communication and engagement strategies help us reach our target market effectively, ensuring our offerings stand out in the competitive marketplace.",
    image: null,
    email: "dolly@doctar.in",
    linkedin: "https://linkedin.com/in/dolly-j",
    phone: "+91 98765 43211"
  },
  {
    id: 3,
    name: "Dr. Sarah Ahmed",
    title: "Chief Medical Officer",
    initials: "SA",
    color: "#ef4444", // Red
    description: "Dr. Sarah brings extensive medical expertise to our team, ensuring that our platform maintains the highest standards of healthcare quality. She oversees medical protocols and ensures patient safety across all our services.",
    image: null,
    email: "sarah@doctar.in",
    linkedin: "https://linkedin.com/in/sarah-ahmed",
    phone: "+91 98765 43212"
  },
  {
    id: 4,
    name: "Michael Foster",
    title: "Chief Technology Officer",
    initials: "MF",
    color: "#60a5fa", // Light Blue
    description: "Michael leads our technology initiatives, driving innovation in healthcare technology. His expertise in software development and system architecture ensures our platform remains cutting-edge and reliable.",
    image: null,
    email: "michael@doctar.in",
    linkedin: "https://linkedin.com/in/michael-foster",
    phone: "+91 98765 43213"
  },
  {
    id: 5,
    name: "Maria Anderson",
    title: "Head of Operations",
    initials: "MA",
    color: "#a855f7", // Purple
    description: "Maria oversees our day-to-day operations, ensuring smooth functioning across all departments. Her organizational skills and attention to detail help maintain operational excellence throughout the company.",
    image: null,
    email: "maria@doctar.in",
    linkedin: "https://linkedin.com/in/maria-anderson",
    phone: "+91 98765 43214"
  },
  {
    id: 6,
    name: "Alex Kumar",
    title: "Head of Product",
    initials: "AK",
    color: "#ec4899", // Pink
    description: "Alex drives product development and user experience initiatives. His focus on user-centric design ensures our platform meets the needs of both patients and healthcare providers effectively.",
    image: null,
    email: "alex@doctar.in",
    linkedin: "https://linkedin.com/in/alex-kumar",
    phone: "+91 98765 43215"
  },
  {
    id: 7,
    name: "Priya Joshi",
    title: "Head of Customer Success",
    initials: "PJ",
    color: "#ef4444", // Red
    description: "Priya leads our customer success team, ensuring that both patients and healthcare providers have exceptional experiences on our platform. Her dedication to customer satisfaction drives our growth and retention.",
    image: null,
    email: "priya@doctar.in",
    linkedin: "https://linkedin.com/in/priya-joshi",
    phone: "+91 98765 43216"
  },
  {
    id: 8,
    name: "Amit Jain",
    title: "Head of Finance",
    initials: "AJ",
    color: "#eab308", // Yellow
    description: "Amit manages our financial operations and strategic planning. His expertise in financial management ensures sustainable growth and operational efficiency across all business functions.",
    image: null,
    email: "amit@doctar.in",
    linkedin: "https://linkedin.com/in/amit-jain",
    phone: "+91 98765 43217"
  },
  {
    id: 9,
    name: "Jennifer Adams",
    title: "Head of Human Resources",
    initials: "JA",
    color: "#3b82f6", // Blue
    description: "Jennifer leads our human resources initiatives, fostering a positive work culture and ensuring we attract and retain top talent. Her focus on employee development drives team success.",
    image: null,
    email: "jennifer@doctar.in",
    linkedin: "https://linkedin.com/in/jennifer-adams",
    phone: "+91 98765 43218"
  }
];

const OurTeam = () => {
  const [selectedMember, setSelectedMember] = useState(teamMembers[0]); // Default to first member
  const navigate = useNavigate();

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  const handleBackToGrid = () => {
    setSelectedMember(null);
  };

  return (
    <>
      <PageSeo
        title="Our Team | DOCTAR - Meet Our Healthcare Experts"
        description="Meet the dedicated team behind DOCTAR, working to revolutionize healthcare access across India. Learn about our leadership and experts driving innovation in digital healthcare."
        keywords="our team, doctar team, healthcare team, medical experts, leadership, about us"
        canonicalUrl="https://www.doctar.in/our-team"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet the passionate individuals behind DOCTAR, working together to make healthcare accessible, transparent, and affordable for everyone across India.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Detailed Profile View */}
            <div className="order-2 lg:order-1">
              <TeamMemberDetail 
                member={selectedMember} 
                onBack={null}
                showBackButton={false}
              />
            </div>
            
            {/* Right Side - Team Grid */}
            <div className="order-1 lg:order-2">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Team</h2>
                  <p className="text-gray-600">Click on any team member to view their details</p>
                </div>
                
                {/* 3x3 Grid - 3D Buttons */}
                <div className="grid grid-cols-3 gap-4 max-w-xs">
                  {teamMembers.map((member) => (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      onClick={() => handleMemberClick(member)}
                      isSelected={selectedMember && selectedMember.id === member.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default OurTeam;
