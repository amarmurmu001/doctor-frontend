import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorProfileHeader = ({ doctor, doctorId, user }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#7551b3] relative h-96">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-xl font-bold"
          title="Back"
        >
          ←
        </button>
        <h1 className="text-white text-lg font-semibold">Doctor Profile</h1>
        {user && user.role === 'doctor' && !doctorId ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/doctor/edit')}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-sm font-semibold"
              title="Edit Profile"
            >
              ✎
            </button>
          </div>
        ) : (
          <span className="w-10 h-10" />
        )}
      </div>

      {/* Profile Information */}
      <div className="flex flex-col items-center pt-8">
        <div className="w-[182px] h-[182px] rounded-3xl bg-white overflow-hidden mb-6 shadow-[0_13.2px_13.2px_0_rgba(0,0,0,0.25)]">
          <img 
            src="/icons/doctor.png" 
            alt="Doctor Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-white text-xl font-semibold mb-1">{doctor?.user?.name || 'Doctor'}</h2>
        <p className="text-white text-lg">{doctor?.specialty || 'General'}</p>
      </div>
    </div>
  );
};

export default DoctorProfileHeader;
