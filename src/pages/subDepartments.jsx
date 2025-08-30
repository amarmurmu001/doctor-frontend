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

export default function SubDepartments() {
  return (
    <>
      <PageSeo
        title="Sub Departments | Browse Medical Experts | Doctar"
        description="Find doctors by medical specialties and types. Browse through heart specialists, liver specialists, lung specialists and more medical experts near you."
        keywords="doctor types, medical specialties, heart doctor, liver specialist, lung specialist, medical experts"
        canonicalUrl="https://www.doctar.in/sub-departments"
      />

      <div className="w-full min-h-screen bg-[#f4f4ff]">
        {/* Header with search */}
        <PageHeader />

        {/* Result count */}
        <div className="px-4 pt-4">
          <ResultCount count={443} location="Deoghar" />
        </div>

        {/* Two rows with 3 cards each */}
        <div className="pt-4">
          <DoctorTypeGrid
            categories={arr}
            showTopRow={true}
          />
        </div>

        {/* Grid of categories */}
        <div className="pt-4">
          <DoctorTypeGrid
            categories={arr}
            title="All Categories"
          />
        </div>
      </div>
    </>
  );
}


