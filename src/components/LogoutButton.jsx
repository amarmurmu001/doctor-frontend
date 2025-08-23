import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const LogoutButton = ({ user, doctorId }) => {
  const navigate = useNavigate();
  const logout = useAuthStore(s => s.logout);

  if (!user || user.role !== 'doctor' || doctorId) {
    return null;
  }

  return (
    <div className="p-4">
      <button
        onClick={() => { logout(); navigate('/login'); }}
        className="w-full bg-black text-white py-2 rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
