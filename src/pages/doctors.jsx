import PageHeader from "../components/layout/PageHeader";
import DoctorList from "../components/doctor/DoctorList";


const doctors = [
  {
    id: 1,
    name: "Dr. Sanchita Mukharjee",
    specialty: "Cardiologist",
    languages: ["Hindi", "English", "Bengali"],
    experienceYears: 7,
    rating: 4.4,
    image: "/icons/doctor.png"
  },
  {
    id: 2,
    name: "Dr. Sandeep Suman",
    specialty: "Cardiologist",
    languages: ["Hindi", "English", "Bhojpuri"],
    experienceYears: 7,
    rating: 4.5,
    image: "/icons/doctor.png"
  },
  {
    id: 3,
    name: "Dr. Riya Jaiswal",
    specialty: "Cardiologist",
    languages: ["Hindi", "English", "Bengali"],
    experienceYears: 6,
    rating: 4.3,
    image: "/icons/doctor.png"
  },
  {
    id: 4,
    name: "Dr. Sanchita Mukharjee",
    specialty: "Cardiologist",
    languages: ["Hindi", "English", "Bengali"],
    experienceYears: 8,
    rating: 4.4,
    image: "/icons/doctor.png"
  }, 
  {
    id: 5,
    name: "Dr. Riya Jaiswal",
    specialty: "Cardiologist",
    languages: ["Hindi", "English", "Bengali"],
    experienceYears: 6,
    rating: 4.3,
    image: "/icons/doctor.png"
  }, 
  {
    id: 6,
    name: "Dr. Riya Jaiswal",
    specialty: "Cardiologist",
    languages: ["Hindi", "English", "Bengali"],
    experienceYears: 6,
    rating: 4.3,
    image: "/icons/doctor.png"
  }
];

export default function Doctors() {
  return (
    <div className="w-full bg-[#f4f4ff]">
      {/* Header with search */}
      <PageHeader />

    

      {/* Doctors list with title */}
      <DoctorList 
        doctors={doctors} 
        
      />
    </div>
  );
}


