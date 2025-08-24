import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAdminStore = create(
  persist(
    (set, get) => ({      
      // UI state
      sidebarCollapsed: false,
      
      // Data
      news: [],
      selectedNews: null,
      newsLoaded: false,
      
      // Set sidebar collapsed state
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      // Dashboard statistics
      stats: {
        totalUsers: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        pendingApprovals: 0,
        recentActivity: [],
      },
      
      // Filters and pagination state for different sections
      filters: {
        users: {
          search: '',
          role: '',
          status: '',  // 'verified' or 'unverified'
          page: 1,
          limit: 10,
        },
        doctors: {
          search: '',
          specialty: '',
          status: '',
          page: 1,
          limit: 10,
        },
        appointments: {
          search: '',
          status: '',
          date: '',
          page: 1,
          limit: 10,
        },
        news: {
          search: '',
          category: '',
          status: '',
          page: 1,
          limit: 10,
        },
        blogs: {
          search: '',
          category: '',
          status: '',
          page: 1,
          limit: 10,
        },
      },
      
      // Set dashboard statistics
      setStats: (stats) => set({ stats }),
      
      // Set user filters
      setUserFilters: (filters) => set(state => ({
        filters: {
          ...state.filters,
          users: {
            ...state.filters.users,
            ...filters
          }
        }
      })),
      
      // Set doctor filters
      setDoctorFilters: (filters) => set(state => ({
        filters: {
          ...state.filters,
          doctors: {
            ...state.filters.doctors,
            ...filters
          }
        }
      })),
      
      // Set appointment filters
      setAppointmentFilters: (filters) => set(state => ({
        filters: {
          ...state.filters,
          appointments: {
            ...state.filters.appointments,
            ...filters
          }
        }
      })),
      
      // Set news filters
      setNewsFilters: (filters) => set(state => ({
        filters: {
          ...state.filters,
          news: {
            ...state.filters.news,
            ...filters
          }
        }
      })),

      // Set blog filters
      setBlogFilters: (filters) => set(state => ({
        filters: {
          ...state.filters,
          blogs: {
            ...state.filters.blogs,
            ...filters
          }
        }
      })),
      
      // Update filters for a specific section
      updateFilters: (section, newFilters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [section]: {
              ...state.filters[section],
              ...newFilters,
            },
          },
        })),
      
      // Reset filters for a specific section
      resetFilters: (section) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [section]: {
              search: '',
              role: '',
              status: '',
              specialty: '',
              category: '',
              date: '',
              page: 1,
              limit: 10,
            },
          },
        })),
      
      // News Management
      setNews: (news) => set({ news }),
      updateNews: (updatedNews) => set(state => ({
        news: state.news.map(item => 
          item._id === updatedNews._id ? updatedNews : item
        )
      })),
      removeNews: (newsId) => set(state => ({
        news: state.news.filter(item => item._id !== newsId)
      })),
      setSelectedNews: (news) => set({ selectedNews: news }),
      
      // Reset all filters
      resetAllFilters: () =>
        set({
          filters: {
            users: {
              search: '',
              role: '',
              emailVerified: null,
              page: 1,
              limit: 10,
            },
            doctors: {
              search: '',
              specialty: '',
              status: '',
              page: 1,
              limit: 10,
            },
            appointments: {
              search: '',
              status: '',
              date: '',
              page: 1,
              limit: 10,
            },
            news: {
              search: '',
              category: '',
              status: '',
              page: 1,
              limit: 10,
            },
            blogs: {
              search: '',
              category: '',
              status: '',
              page: 1,
              limit: 10,
            },
          },
        }),
    }),
    {
      name: 'admin-store',
    }
  )
);

export default useAdminStore;