import DoctorCard from "./DoctorCard";

export default function DoctorsList() {
  const doctors = [
    {
      name: "Dr. Ethan Reynolds",
      specialty: "Neurologist (USA)",
      price: "$XX/Min",
      image: "/doctor1.png",
    },
    {
      name: "Dr. Sarah White",
      specialty: "Cardiologist (USA)",
      price: "$XX/Min",
      image: "/doctor2.png",
    },
    {
      name: "Dr. James Miller",
      specialty: "Orthopedic (USA)",
      price: "$XX/Min",
      image: "/doctor3.png",
    },
  ];

  return (
    <div className="px-4">
      <h2 className="text-lg font-bold mb-4">Doctors in Deoghar</h2>

      {/* Horizontal scroll container */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {doctors.map((doc, index) => (
          <DoctorCard key={index} {...doc} />
        ))}
      </div>
    </div>
  );
}
