// components/DoctorsList.js
import React, { useState, useEffect } from 'react';
import DoctorCard from './DoctorCard';
import useLocationStore from '../stores/locationStore';

export default function DoctorsList() {
  const { selectedLocation, coordinates } = useLocationStore();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock doctors data based on location
  const mockDoctorsData = {
    'deoghar': [
      {
        name: "Dr. Rajesh Kumar",
        specialty: "General Physician (Deoghar)",
        price: "₹500/Consultation",
        image: "/doctor1.png",
        id: 1,
        coordinates: { lat: 24.4844, lng: 86.6947 }
      },
      {
        name: "Dr. Priya Sharma",
        specialty: "Cardiologist (Deoghar)",
        price: "₹800/Consultation",
        image: "/doctor2.png",
        id: 2,
        coordinates: { lat: 24.4850, lng: 86.6950 }
      }
    ],
    'delhi': [
      {
        name: "Dr. Ethan Reynolds",
        specialty: "Neurologist (Delhi)",
        price: "₹1200/Consultation",
        image: "/doctor1.png",
        id: 3,
        coordinates: { lat: 28.6139, lng: 77.2090 }
      },
      {
        name: "Dr. Sarah White",
        specialty: "Cardiologist (Delhi)",
        price: "₹1000/Consultation",
        image: "/doctor2.png",
        id: 4,
        coordinates: { lat: 28.6145, lng: 77.2095 }
      }
    ],
    'mumbai': [
      {
        name: "Dr. James Miller",
        specialty: "Orthopedic (Mumbai)",
        price: "₹1500/Consultation",
        image: "/doctor3.png",
        id: 5,
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      {
        name: "Dr. Anita Desai",
        specialty: "Dermatologist (Mumbai)",
        price: "₹900/Consultation",
        image: "/doctor2.png",
        id: 6,
        coordinates: { lat: 19.0765, lng: 72.8780 }
      }
    ],
    'bangalore': [
      {
        name: "Dr. Suresh Reddy",
        specialty: "Pediatrician (Bangalore)",
        price: "₹700/Consultation",
        image: "/doctor1.png",
        id: 7,
        coordinates: { lat: 12.9716, lng: 77.5946 }
      }
    ],
    'kolkata': [
      {
        name: "Dr. Amit Chatterjee",
        specialty: "ENT Specialist (Kolkata)",
        price: "₹600/Consultation",
        image: "/doctor3.png",
        id: 8,
        coordinates: { lat: 22.5726, lng: 88.3639 }
      }
    ]
  };

  // Function to calculate distance between two coordinates
  const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  useEffect(() => {
    if (!selectedLocation) return;

    console.log('Loading doctors for:', selectedLocation);
    setLoading(true);

    // Simulate API loading delay
    setTimeout(() => {
      const locationKey = selectedLocation.toLowerCase();
      let locationDoctors = mockDoctorsData[locationKey] || [];
      
      // If no exact match, get doctors from nearby regions or all doctors
      if (locationDoctors.length === 0) {
        console.log('No exact match, getting general doctors');
        locationDoctors = [
          {
            name: "Dr. Generic Practitioner",
            specialty: `General Physician (${selectedLocation})`,
            price: "₹500/Consultation",
            image: "/doctor1.png",
            id: 999,
            coordinates: coordinates
          }
        ];
      }

      // Calculate distances if we have user coordinates
      if (coordinates.lat && coordinates.lng) {
        locationDoctors = locationDoctors.map(doctor => ({
          ...doctor,
          distance: doctor.coordinates 
            ? calculateDistance(coordinates, doctor.coordinates)
            : null
        }));

        // Sort by distance
        locationDoctors.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      }

      console.log('Found doctors:', locationDoctors.length);
      setDoctors(locationDoctors);
      setLoading(false);
    }, 1000); // 1 second delay to simulate API call

  }, [selectedLocation, coordinates]);

  if (loading) {
    return (
      <div className="px-4">
        <h2 className="text-lg font-bold mb-4">Finding doctors near you...</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[300px] h-24 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
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
          {doctors.map((doc) => (
            <div key={doc.id} className="relative">
              <DoctorCard {...doc} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
