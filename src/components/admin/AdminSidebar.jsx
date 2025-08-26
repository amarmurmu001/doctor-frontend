import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAdminStore from '../../stores/adminStore';
import useAuthStore from '../../stores/useAuthStore';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Get sidebar state from store
  const sidebarCollapsed = useAdminStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = useAdminStore((state) => state.setSidebarCollapsed);
  
  // Use the store value for collapsed state
  useEffect(() => {
    setCollapsed(sidebarCollapsed);
  }, [sidebarCollapsed]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobileOpen]);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'tachometer-alt' },
    { name: 'Users', path: '/admin/users', icon: 'users' },
    { name: 'Doctors', path: '/admin/doctors', icon: 'user-md' },
    { name: 'Appointments', path: '/admin/appointments', icon: 'calendar-alt' },
    { name: 'News', path: '/admin/news', icon: 'newspaper' },
    { name: 'Blogs', path: '/admin/blogs', icon: 'blog' },
  ];

  const toggleCollapse = () => {
    setSidebarCollapsed(!collapsed);
  };
  
  // Determine sidebar classes based on state
  const sidebarClasses = `
    fixed lg:static h-full z-30 bg-[#7551b3] text-white transition-all duration-300
    ${collapsed ? 'w-16' : 'w-64'}
    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;
  
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && windowWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <aside className={sidebarClasses}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-purple-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-[#7551b3] text-xs font-bold">D</span>
            </div>
            <span className="text-white font-semibold text-lg">octar Admin</span>
          </div>
        )}
        <button 
          onClick={toggleCollapse}
          className="p-1 rounded-full hover:bg-purple-700 transition-colors"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-purple-700' : 'hover:bg-purple-800'}`
                }
              >
                <span className="flex items-center justify-center w-5 h-5">
                  <i className={`fas fa-${item.icon}`}></i>
                </span>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 w-full p-4 border-t border-purple-700">
        <button 
          onClick={() => {
            useAuthStore.getState().logout();
            navigate('/admin/login');
          }}
          className={`flex items-center p-2 rounded-lg hover:bg-purple-800 transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="flex items-center justify-center w-5 h-5">
            <i className="fas fa-sign-out-alt"></i>
          </span>
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
    </>
  );
};

export default AdminSidebar;