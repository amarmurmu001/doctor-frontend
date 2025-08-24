import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminRoute = () => {
  const { user, token } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Check if user is authenticated and has admin role
  const isAdmin = user && token && user.role === 'admin';
  
  // If not authenticated or not admin, redirect to login
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminRoute;