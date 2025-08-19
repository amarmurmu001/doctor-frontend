import DoctorCard from "./DoctorCard";

export default function DoctorList({ doctors, specialty, location }) {
  return (
    <>
      {/* Title */}
      <div className="px-4 py-3">
        <h2 className="text-xl font-extrabold">
          Total {doctors.length} {specialty} found in {location}
        </h2>
      </div>

      {/* Doctors list */}
      <div className="px-4 pb-6 space-y-4">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </>
  );
}
