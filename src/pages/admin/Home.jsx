import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/adminAPI';
import useAuthStore from '../../stores/useAuthStore';
import useAdminStore from '../../stores/adminStore';

const AdminHome = () => {
  const { token } = useAuthStore();
  const { stats, setStats } = useAdminStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardStats(token);
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setError(error.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token, setStats]);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{isLoading ? '-' : value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          <i className={`fas fa-${icon} text-white text-xl`}></i>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats.users} 
          icon="users" 
          color="bg-blue-500"
        />
        <StatCard 
          title="Total Doctors" 
          value={stats.doctors} 
          icon="user-md" 
          color="bg-green-500"
        />
        <StatCard 
          title="Appointments" 
          value={stats.appointments} 
          icon="calendar-check" 
          color="bg-purple-500"
        />
        <StatCard 
          title="News Articles" 
          value={stats.news} 
          icon="newspaper" 
          color="bg-indigo-500"
        />
        <StatCard 
          title="Blog Posts" 
          value={stats.blogs} 
          icon="blog" 
          color="bg-pink-500"
        />
        <StatCard 
          title="Pending Approvals" 
          value={stats.pendingApprovals} 
          icon="clock" 
          color="bg-yellow-500"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : stats.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => {
                const getActivityIcon = (type) => {
                  switch (type) {
                    case 'user_registration':
                      return { icon: 'user-plus', bgColor: 'bg-blue-100', textColor: 'text-blue-500' };
                    case 'doctor_update':
                      return { icon: 'user-md', bgColor: 'bg-green-100', textColor: 'text-green-500' };
                    case 'appointment':
                      return { icon: 'calendar-plus', bgColor: 'bg-purple-100', textColor: 'text-purple-500' };
                    case 'news':
                      return { icon: 'newspaper', bgColor: 'bg-indigo-100', textColor: 'text-indigo-500' };
                    case 'blog':
                      return { icon: 'blog', bgColor: 'bg-pink-100', textColor: 'text-pink-500' };
                    case 'review':
                      return { icon: 'star', bgColor: 'bg-yellow-100', textColor: 'text-yellow-500' };
                    default:
                      return { icon: 'info-circle', bgColor: 'bg-gray-100', textColor: 'text-gray-500' };
                  }
                };

                const { icon, bgColor, textColor } = getActivityIcon(activity.type);

                return (
                  <div key={index} className="flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${bgColor} flex items-center justify-center mr-3`}>
                      <i className={`fas fa-${icon} ${textColor} text-sm`}></i>
                    </div>
                    <div>
                      <p className="text-sm" dangerouslySetInnerHTML={{ __html: activity.message }} />
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;