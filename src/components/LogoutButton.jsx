import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../stores/authSlice';

const LogoutButton = ({ user, doctorId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!user || user.role !== 'doctor' || doctorId) {
    return null;
  }

  return (
    <div className="p-4">
      <button
        onClick={() => { dispatch(logout()); navigate('/login'); }}
        className="w-full bg-black text-white py-2 rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
