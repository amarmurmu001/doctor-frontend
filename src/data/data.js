// ✅ Doctor Directory (Search Results)
export const doctorList = [
    {
      id: 1,
      name: "Dr. Sanchita Mukharjee",
      specialization: "Cardiologist",
      languages: ["Hindi", "English", "Bengali"],
      experience: "8 years",
      image: "/images/doctors/sanchita.jpg",
      location: "Deoghar",
      rating: 4.8,
      available: true,
    },
    {
      id: 2,
      name: "Dr. Sandeep Suman",
      specialization: "Cardiologist",
      languages: ["Hindi", "English", "Bhojpuri"],
      experience: "10 years",
      image: "/images/doctors/sandeep.jpg",
      location: "Deoghar",
      rating: 4.7,
      available: true,
    },
    {
      id: 3,
      name: "Dr. Riya Jaiswal",
      specialization: "Cardiologist",
      languages: ["Hindi", "English", "Bengali"],
      experience: "6 years",
      image: "/images/doctors/riya.jpg",
      location: "Deoghar",
      rating: 4.6,
      available: false,
    },
  ];
  
  // ✅ Doctor Profile Details
  export const doctorProfile = {
    id: 101,
    name: "Dr. Sanjana Mehta",
    specialization: "General Physician",
    languages: ["English", "Hindi", "Bhojpuri", "Bengali"],
    experience: "15 years",
    description:
      "Dr. Sanjana Mehta is a highly skilled cardiologist with over 15 years of experience in treating complex cardiac conditions.",
    image: "/images/doctors/sanjana.jpg",
    education: [
      { degree: "MD in Cardiology", institution: "ABC Medical School", year: 2008 },
      { degree: "Residency in Internal Medicine", institution: "ABC Hospital", year: 2011 },
    ],
    keySpecialization: [
      "Interventional Cardiology",
      "Preventive Cardiology",
      "Heart Failure Management",
      "Cardiac Rehabilitation",
    ],
    awards: [
      {
        title: "Gaischner Foundation International Award",
        year: 2017,
        institute: "Gaischner Institute",
      },
    ],
    gallery: [
      "/images/hospital/h1.jpg",
      "/images/hospital/h2.jpg",
      "/images/hospital/h3.jpg",
      "/images/hospital/h4.jpg",
    ],
  };
  
  // ✅ Doctor Reviews
  export const doctorReviews = [
    {
      id: 1,
      reviewer: "Sunita Jain",
      rating: 5,
      comment:
        "Dr. Sanjana was very caring and took her time to explain everything. Highly recommended!",
      images: ["/images/reviews/r1.jpg", "/images/reviews/r2.jpg"],
    },
    {
      id: 2,
      reviewer: "Aryan",
      rating: 4,
      comment: "Good doctor, very polite and professional.",
      images: [],
    },
    {
      id: 3,
      reviewer: "Abhishek Sharma",
      rating: 5,
      comment:
        "Excellent consultation experience. The doctor listened patiently and guided very well.",
      images: [],
    },
  ];
  
  // ✅ Doctor Location & Contact
  export const doctorLocation = {
    address:
      "2nd Floor, No.1, Neeladri Rd, above Samsung Showroom, Koruna Nagar, Electronic City Phase 1, Bengaluru, Karnataka 560100",
    distance: "1.5 km",
    travelTime: "15 mins",
    mapEmbed:
      "https://maps.google.com/?q=Electronic+City+Bengaluru", // demo Google Maps link
    receptionContacts: [
      { type: "phone", value: "+91 68753 4234" },
      { type: "email", value: "support@doctor.com" },
    ],
    doctorContacts: [
      { type: "phone", value: "+91 68753 4234" },
      { type: "email", value: "support@doctor.com" },
    ],
  };
  
  // ✅ Appointment Slots
  export const appointmentSlots = [
    {
      date: "Thursday, 14",
      slots: ["7:00 AM - 01:30 PM", "4:00 PM - 08:30 PM"],
    },
    {
      date: "Friday, 15",
      slots: ["7:00 AM - 9:30 PM"],
    },
    {
      date: "Saturday, 16",
      slots: ["7:00 AM - 9:30 PM"],
    },
    {
      date: "Sunday, 17",
      slots: ["7:00 AM - 9:30 PM"],
    },
    {
      date: "Monday, 18",
      slots: ["7:00 AM - 9:30 PM"],
    },
    {
      date: "Tuesday, 19",
      slots: ["7:00 AM - 9:30 PM"],
    },
    {
      date: "Wednesday, 20",
      slots: ["7:00 AM - 9:30 PM"],
    },
  ];
  