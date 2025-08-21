import PageHeader from "../components/PageHeader";
import ResultCount from "../components/ResultCount";
import DoctorTypeGrid from "../components/DoctorTypeGrid";

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
  );
}


