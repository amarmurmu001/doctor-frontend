import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const footerSections = [
    {
      title: "For patients",
      links: [
        { text: "Search Doctors", path: "/search-doctors" },
        { text: "Search Hospitals", path: "/search-hospitals" },
        { text: "Search Clinics", path: "/search-clinics" },
       
      ]
    },
    {
      title: "Doctar",
      links: [
        { text: "About", path: "/about" },
        { text: "Our Team", path: "/our-team" },
        { text: "Blog", path: "/blog" },
        { text: "Careers", path: "/careers" },
        { text: "Press", path: "/press" },
        { text: "Contact Us", path: "/contact" }
       
      ]
    },
    {
      title: "More",
      links: [
        { text: "Help", path: "/help" },
        { text: "Developers", path: "/developers" },
        { text: "Privacy Policy", path: "/privacy" },
        { text: "Terms & Conditions", path: "/terms" },
        { text: "PCI T&C", path: "/pci-terms" },
         { text: "Healthcare Directory", path: "/directory" }
      ]
    },
    {
      title: "Social",
      links: [
        { text: "Facebook", path: "https://facebook.com", external: true },
        { text: "Twitter", path: "https://twitter.com", external: true },
        { text: "LinkedIn", path: "https://linkedin.com", external: true },
        { text: "Youtube", path: "https://youtube.com", external: true }
       
      ]
    }
  ];

  const handleLinkClick = (link) => {
    if (link.external) {
      window.open(link.path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link.path);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#2c2548] to-[#1a1a2e] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-lg text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-left text-sm leading-relaxed"
                    >
                      {link.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-600">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            
            
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p>&copy; 2025 Doctar. All rights reserved.</p>
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
