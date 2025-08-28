import PageHeader from "../components/layout/PageHeader";
import ResultCount from "../components/doctor/ResultCount";
import DoctorTypeGrid from "../components/doctor/DoctorTypeGrid";
import PageSeo from "../components/seo/PageSeo";

const arr = [
  { category: "heart", number: 25 },
  { category: "liver", number: 25 },
  { category: "lungs", number: 20 },
  { category: "heart", number: 25 },
  { category: "liver", number: 25 },
  { category: "lungs", number: 20 },
  { category: "heart", number: 25 },
  { category: "liver", number: 25 },
  { category: "lungs", number: 20 },
  { category: "heart", number: 25 },
  { category: "liver", number: 25 },
  { category: "lungs", number: 20 }
];

export default function DoctorType() {
  return (
    <>
      <PageSeo 
        title="Doctor Types & Specialties | Browse Medical Experts | Doctar"
        description="Find doctors by medical specialties and types. Browse through heart specialists, liver specialists, lung specialists and more medical experts near you."
        keywords="doctor types, medical specialties, heart doctor, liver specialist, lung specialist, medical experts"
        canonicalUrl="https://www.doctar.in/x"
      />
      
      <div className="w-full">
      {/* Header with search */}
      <PageHeader />

      {/* Result count */}
      <ResultCount count={443} location="Deoghar" />

      {/* Two rows with 3 cards each */}
      <DoctorTypeGrid 
        categories={arr} 
        showTopRow={true}
      />

      {/* Grid of categories */}
      <DoctorTypeGrid 
        categories={arr} 
        title="All Categories"
      />
      </div>
    </>
  );
}


