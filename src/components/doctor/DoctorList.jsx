import React, { useState, useEffect } from "react";
import DoctorCard from "./DoctorCard";
import useLocationStore from "../../stores/locationStore";

export default function DoctorsList() {
  const { selectedLocation, coordinates } = useLocationStore();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      let url = "";
      if (!selectedLocation) {
        setDoctors([]);
        setLoading(false);
        return;
      }
      // New backend supports filtering via query on /api/doctors
      const params = new URLSearchParams({ city: selectedLocation.toLowerCase() });
      url = `${import.meta.env.VITE_BACKEND_URL}/api/doctors?${params}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setDoctors(Array.isArray(data) ? data : []);
      } catch {
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, [selectedLocation, coordinates]);

  function mapDoctorToCardProps(doctor) {
    return {
      name: doctor.user && doctor.user.name ? doctor.user.name : 'Doctor',
      specialty: doctor.specialty || 'General',
      price: typeof doctor.consultationFee === 'number' ? `₹${doctor.consultationFee}/Consultation` : 'N/A',
      image: '/icons/doctor.png',
      doctorId: doctor._id || doctor.id,
    };
  }

  if (loading) {
    return (
      <div className="px-4">
        <h2 className="text-lg font-bold mb-4">Finding doctors near you...</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[300px] h-24 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center"
            >
              <div className="text-gray-400">Loading...</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">
          Doctors near {selectedLocation}
          {doctors.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({doctors.length} found)
            </span>
          )}
        </h2>
      </div>
      {doctors.length === 0 ? (
        <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-2xl mb-2">🏥</p>
          <p>No doctors found in {selectedLocation}</p>
          <p className="text-sm mt-2">Try selecting a different location</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor._id || doctor.id}
              {...mapDoctorToCardProps(doctor)}
            />
          ))}
        </div>
      )}
    </div>
  );
}


