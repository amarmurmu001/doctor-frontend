import { create } from 'zustand';

const useAdminStore = create((set, get) => ({
  // Sidebar state
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Dashboard stats
  stats: {
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0
  },

  // Notifications
  notifications: [],
  
  // Dashboard data
  dashboardData: null,
  loading: false,
  error: null,

  // Actions
  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      const data = await response.json();
      set({ 
        dashboardData: data.data,
        stats: data.data.stats,
        notifications: data.data.notifications,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  markNotificationAsRead: (id) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    set({ notifications: updatedNotifications });
  },

  updateStats: (newStats) => {
    set({ stats: { ...get().stats, ...newStats } });
  }
}));

export default useAdminStore;
