import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import DynamicInputList from '../../components/DynamicInputList';
import GeolocationPicker from '../../components/GeolocationPicker';
import TimeSlotPicker from '../../components/TimeSlotPicker';

const AdminDoctors = () => {
  const { token, user } = useSelector((state) => state.auth);
  
  // ✅ State Management - Initialize as empty arrays
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    // User fields
    name: '',
    email: '',
    phone: '',
    sex: '',
    dateOfBirth: '',
    location: '',
    appLanguage: 'English',
    
    // Doctor fields
    specialty: '',
    yearsOfExperience: 0,
    clinicName: '',
    city: '',
    about: '',
    education: [],
    experience: [],
    services: [],
    languages: [],
    contactPhones: [],
    contactEmails: [],
    keySpecialization: [],
    consultationFee: 0,
    
    // Address fields
    addressLine1: '',
    addressLine2: '',
    addressCity: '',
    addressState: '',
    postalCode: '',
    country: '',
    coordinates: null,
    
    // Additional fields
    slots: [],
    clinicImages: []
  });

  // ✅ API Functions
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: filterStatus !== 'all' ? filterStatus : '',
        search: searchTerm || ''
      });

      const response = await fetch(`${API_BASE_URL}/api/admin/doctors?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please login again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          throw new Error(`HTTP ${response.status}: Failed to fetch doctors`);
        }
      }
      
      const data = await response.json();
      console.log('Doctors API Response:', data);
      
      // ✅ Handle different response structures safely
      let doctorsArray = [];
      let totalPagesCount = 1;
      
      if (data && data.success) {
        if (data.data && Array.isArray(data.data.doctors)) {
          doctorsArray = data.data.doctors;
          totalPagesCount = data.data.totalPages || 1;
        } else if (Array.isArray(data.data)) {
          doctorsArray = data.data;
        }
      } else if (Array.isArray(data)) {
        doctorsArray = data;
      } else if (data && Array.isArray(data.data)) {
        doctorsArray = data.data;
      }
      
      // ✅ Validate each doctor object
      const validDoctors = doctorsArray.filter(doctor => 
        doctor && typeof doctor === 'object' && doctor._id
      );
      
      setDoctors(validDoctors);
      setTotalPages(totalPagesCount);
      
    } catch (err) {
      console.error('Fetch doctors error:', err);
      setError(err.message || 'Failed to load doctors');
      setDoctors([]); // ✅ Always set empty array on error
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, filterStatus, searchTerm]);

  // ✅ Effects
  useEffect(() => {
    if (!token || !user) {
      setError('Authentication required');
      setLoading(false);
      return;
    }
    fetchDoctors();
  }, [token, user, currentPage, filterStatus, fetchDoctors]);

  useEffect(() => {
    // Debounced search
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== undefined) {
        setCurrentPage(1);
        fetchDoctors();
      }
    }, 500);
    
    return () => clearTimeout(delayedSearch);
  }, [searchTerm, fetchDoctors]);

  const handleDoctorAction = async (doctorId, action) => {
    const actionText = action === 'approve' ? 'approve' : action === 'reject' ? 'reject' : action;
    
    if (!confirm(`Are you sure you want to ${actionText} this doctor?`)) return;
    
    try {
      setActionLoading(doctorId);
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';
      
      const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: action === 'approve' ? 'approved' : 'rejected' })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to ${actionText} doctor`);
      }
      
      // Refresh the list
      await fetchDoctors();
      setShowModal(false);
      
      // Success feedback
      setError('');
      setTimeout(() => {
        alert(`Doctor ${actionText}ed successfully!`);
      }, 100);
      
    } catch (err) {
      console.error(`Action ${actionText} error:`, err);
      setError(err.message || `Failed to ${actionText} doctor`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) return;
    
    try {
      setActionLoading(doctorId);
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';
      
      const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete doctor');
      }
      
      await fetchDoctors();
      setShowModal(false);
      alert('Doctor deleted successfully!');
      
    } catch (err) {
      console.error('Delete doctor error:', err);
      setError(err.message || 'Failed to delete doctor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();

    try {
      setActionLoading('add');
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';

      // Create FormData to handle both text data and file uploads
      const formData = new FormData();

      // Add all text data
      const doctorData = {
        name: newDoctor.name,
        email: newDoctor.email,
        phone: newDoctor.phone || '',
        sex: newDoctor.sex || '',
        dateOfBirth: newDoctor.dateOfBirth || '',
        location: newDoctor.location || '',
        appLanguage: newDoctor.appLanguage,
        specialty: newDoctor.specialty,
        yearsOfExperience: newDoctor.yearsOfExperience || 0,
        clinicName: newDoctor.clinicName || '',
        city: newDoctor.city,
        about: newDoctor.about || '',
        education: JSON.stringify(newDoctor.education || []),
        experience: JSON.stringify(newDoctor.experience || []),
        services: JSON.stringify(newDoctor.services || []),
        languages: JSON.stringify(newDoctor.languages || []),
        contactPhones: JSON.stringify(newDoctor.contactPhones || []),
        contactEmails: JSON.stringify(newDoctor.contactEmails || []),
        keySpecialization: JSON.stringify(newDoctor.keySpecialization || []),
        consultationFee: newDoctor.consultationFee || 0,
        slots: JSON.stringify(newDoctor.slots || []),
        addressLine1: newDoctor.addressLine1 || '',
        addressLine2: newDoctor.addressLine2 || '',
        addressCity: newDoctor.addressCity || '',
        addressState: newDoctor.addressState || '',
        postalCode: newDoctor.postalCode || '',
        country: newDoctor.country || '',
        coordinates: newDoctor.coordinates ? JSON.stringify(newDoctor.coordinates) : null
      };

      // Add all text fields to FormData
      Object.entries(doctorData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });

      // Add clinic images to FormData
      if (newDoctor.clinicImages && newDoctor.clinicImages.length > 0) {
        newDoctor.clinicImages.forEach((file) => {
          formData.append('clinicImages', file);
        });
      }

      // Create the doctor profile with FormData
      const response = await fetch(`${API_BASE_URL}/api/admin/doctors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type header - let browser set it with boundary for FormData
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData || 'Failed to add doctor');
      }

      await response.json();

      // Clinic images are now handled directly in the doctor creation API
      // No separate image upload step needed

      await fetchDoctors();
      setShowAddModal(false);
      setNewDoctor({
        // User fields
        name: '',
        email: '',
        phone: '',
        sex: '',
        dateOfBirth: '',
        location: '',
        appLanguage: 'English',

        // Doctor fields
        specialty: '',
        yearsOfExperience: 0,
        clinicName: '',
        city: '',
        about: '',
        education: [],
        experience: [],
        services: [],
        languages: [],
        contactPhones: [],
        contactEmails: [],
        keySpecialization: [],
        consultationFee: 0,

        // Address fields
        addressLine1: '',
        addressLine2: '',
        addressCity: '',
        addressState: '',
        postalCode: '',
        country: '',
        coordinates: null,

        // Additional fields
        slots: [],
        clinicImages: []
      });

      alert('Doctor added successfully!');

    } catch (err) {
      console.error('❌ Add doctor error:', err);
      console.error('❌ Error details:', err.message);
      setError(err.message || 'Failed to add doctor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditDoctor = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(editDoctor._id);
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';

      // Prepare FormData for file uploads (same as add doctor)
      const formData = new FormData();

      // User fields
      formData.append('name', editDoctor.user?.name || editDoctor.name || '');
      formData.append('email', editDoctor.user?.email || editDoctor.email || '');
      formData.append('phone', editDoctor.user?.phone || editDoctor.phone || '');
      formData.append('sex', editDoctor.sex || '');
      formData.append('dateOfBirth', editDoctor.dateOfBirth || '');
      formData.append('location', editDoctor.location || '');
      formData.append('appLanguage', editDoctor.appLanguage || 'English');

      // Doctor fields
      formData.append('specialty', editDoctor.specialty || '');
      formData.append('yearsOfExperience', editDoctor.yearsOfExperience || 0);
      formData.append('clinicName', editDoctor.clinicName || '');
      formData.append('city', editDoctor.city || '');
      formData.append('about', editDoctor.about || '');
      formData.append('consultationFee', editDoctor.consultationFee || 0);

      // Arrays need to be JSON stringified
      formData.append('education', JSON.stringify(editDoctor.education || []));
      formData.append('experience', JSON.stringify(editDoctor.experience || []));
      formData.append('services', JSON.stringify(editDoctor.services || []));
      formData.append('languages', JSON.stringify(editDoctor.languages || []));
      formData.append('contactPhones', JSON.stringify(editDoctor.contactPhones || []));
      formData.append('contactEmails', JSON.stringify(editDoctor.contactEmails || []));
      formData.append('keySpecialization', JSON.stringify(editDoctor.keySpecialization || []));
      formData.append('slots', JSON.stringify(editDoctor.slots || []));

      // Address fields
      formData.append('addressLine1', editDoctor.addressLine1 || '');
      formData.append('addressLine2', editDoctor.addressLine2 || '');
      formData.append('addressState', editDoctor.addressState || '');
      formData.append('postalCode', editDoctor.postalCode || '');
      formData.append('country', editDoctor.country || '');

      // Coordinates
      if (editDoctor.coordinates) {
        formData.append('coordinates', JSON.stringify(editDoctor.coordinates));
      }

      // Add clinic images to FormData (only new File objects, not existing URLs)
      if (editDoctor.clinicImages && editDoctor.clinicImages.length > 0) {
        editDoctor.clinicImages.forEach((image) => {
          // Only append File objects (new uploads), not URL strings (existing images)
          if (image instanceof File) {
            formData.append('clinicImages', image);
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${editDoctor._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type header - let browser set it with boundary for FormData
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to update doctor');
      }

      await fetchDoctors();
      setShowEditModal(false);
      setEditDoctor(null);
      setError('');
      alert('Doctor updated successfully!');

    } catch (err) {
      console.error('Edit doctor error:', err);
      setError(err.message || 'Failed to update doctor');
    } finally {
      setActionLoading(editDoctor._id);
    }
  };

  // ✅ Safe filtering with comprehensive checks
  const filteredDoctors = Array.isArray(doctors) ? doctors.filter(doctor => {
    if (!doctor || typeof doctor !== 'object') return false;
    
    const doctorName = doctor.user?.name || doctor.name || '';
    const doctorSpecialty = doctor.specialty || '';
    const doctorEmail = doctor.user?.email || doctor.email || '';
    const doctorCity = doctor.city || '';
    
    const matchesSearch = !searchTerm || 
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorCity.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || doctor.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) : [];

  // ✅ Safe stats calculation with validation
  const getStats = () => {
    if (!Array.isArray(doctors) || doctors.length === 0) {
      return { approved: 0, pending: 0, rejected: 0, total: 0 };
    }
    
    return {
      approved: doctors.filter(d => d && d.status === 'approved').length,
      pending: doctors.filter(d => d && d.status === 'pending').length,
      rejected: doctors.filter(d => d && d.status === 'rejected').length,
      total: doctors.length
    };
  };

  const stats = getStats();

  // ✅ Event Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Memoized callback for TimeSlotPicker to prevent unnecessary re-renders
  const handleSlotsChange = useCallback((slots) => {
    setNewDoctor(prev => ({
      ...prev,
      slots: slots
    }));
  }, []);

  // Memoized callback for edit TimeSlotPicker
  const handleEditSlotsChange = useCallback((slots) => {
    setEditDoctor(prev => ({
      ...prev,
      slots: slots
    }));
  }, []);

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    try {
      if (!Array.isArray(doctors) || doctors.length === 0) {
        alert('No data to export');
        return;
      }

      const csvContent = "data:text/csv;charset=utf-8," + 
        "Name,Email,Specialty,Experience,Status,City,Phone,Clinic,Fee,Joined\n" +
        doctors.map(d => {
          const name = (d.user?.name || d.name || '').replace(/"/g, '""');
          const email = (d.user?.email || d.email || '').replace(/"/g, '""');
          const specialty = (d.specialty || '').replace(/"/g, '""');
          const experience = d.yearsOfExperience || 0;
          const status = (d.status || '').replace(/"/g, '""');
          const city = (d.city || '').replace(/"/g, '""');
          const phone = (d.user?.phone || d.phone || '').replace(/"/g, '""');
          const clinic = (d.clinicName || '').replace(/"/g, '""');
          const fee = d.consultationFee || 0;
          const joined = d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '';
          
          return `"${name}","${email}","${specialty}","${experience}","${status}","${city}","${phone}","${clinic}","${fee}","${joined}"`;
        }).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `doctors_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export data');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setCurrentPage(1);
  };

  // ✅ Loading State
  if (loading && doctors.length === 0) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="animate-pulse p-4">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-gray-600">Manage doctor profiles and verifications</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Doctor
          </button>
          <button 
            onClick={handleExportCSV}
            disabled={doctors.length === 0}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </button>
          <button 
            onClick={fetchDoctors}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            title="Refresh Data"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Error loading doctors</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
              <div className="mt-3">
                <button 
                  onClick={() => {
                    setError('');
                    fetchDoctors();
                  }}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              <p className="text-xs text-green-600 mt-1">Active doctors</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-yellow-600 mt-1">Awaiting review</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              <p className="text-xs text-red-600 mt-1">Not approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-blue-600 mt-1">All registered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search doctors by name, specialty, email, or city..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status ({stats.total})</option>
              <option value="pending">Pending ({stats.pending})</option>
              <option value="approved">Approved ({stats.approved})</option>
              <option value="rejected">Rejected ({stats.rejected})</option>
            </select>
            
            {(searchTerm || filterStatus !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                title="Clear all filters"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredDoctors.length === 0 && !loading ? (
          <div className="text-center py-16">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || filterStatus !== 'all' 
                ? 'No doctors match your current search criteria. Try adjusting your filters.'
                : 'No doctors have registered yet. Add the first doctor to get started.'
              }
            </p>
            <div className="flex justify-center space-x-4">
              {(searchTerm || filterStatus !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear filters
                </button>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Doctor
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialty & Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                            {(doctor.user?.name || doctor.name || 'D').charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              Dr. {doctor.user?.name || doctor.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">{doctor.user?.email || doctor.email}</div>
                            {(doctor.user?.phone || doctor.phone) && (
                              <div className="text-xs text-gray-400">{doctor.user?.phone || doctor.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{doctor.specialty || 'Not specified'}</div>
                        <div className="text-sm text-gray-500">{doctor.city || 'Location not specified'}</div>
                        {doctor.clinicName && (
                          <div className="text-xs text-gray-400 truncate max-w-32" title={doctor.clinicName}>
                            {doctor.clinicName}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {doctor.yearsOfExperience || 0} years
                        </div>
                        {doctor.yearsOfExperience > 10 && (
                          <div className="text-xs text-blue-600 font-medium">Experienced</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          doctor.status === 'approved' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' :
                          doctor.status === 'pending' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' :
                          doctor.status === 'rejected' ? 'bg-red-100 text-red-800 ring-1 ring-red-200' :
                          'bg-gray-100 text-gray-800 ring-1 ring-gray-200'
                        }`}>
                          {doctor.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {doctor.consultationFee ? `₹${doctor.consultationFee.toLocaleString()}` : 'Not set'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setShowModal(true);
                            }}
                            className="text-purple-600 hover:text-purple-900 font-medium transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setEditDoctor({...doctor});
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                          >
                            Edit
                          </button>
                          {doctor.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleDoctorAction(doctor._id, 'approve')}
                                disabled={actionLoading === doctor._id}
                                className="text-green-600 hover:text-green-900 font-medium disabled:opacity-50 transition-colors"
                              >
                                {actionLoading === doctor._id ? 'Processing...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleDoctorAction(doctor._id, 'reject')}
                                disabled={actionLoading === doctor._id}
                                className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50 transition-colors"
                              >
                                {actionLoading === doctor._id ? 'Processing...' : 'Reject'}
                              </button>
                            </>
                          )}
                          {doctor.status === 'approved' && (
                            <button
                              onClick={() => handleDoctorAction(doctor._id, 'reject')}
                              disabled={actionLoading === doctor._id}
                              className="text-orange-600 hover:text-orange-900 font-medium disabled:opacity-50 transition-colors"
                            >
                              {actionLoading === doctor._id ? 'Processing...' : 'Suspend'}
                            </button>
                          )}
                          {doctor.status === 'rejected' && (
                            <button
                              onClick={() => handleDoctorAction(doctor._id, 'approve')}
                              disabled={actionLoading === doctor._id}
                              className="text-green-600 hover:text-green-900 font-medium disabled:opacity-50 transition-colors"
                            >
                              {actionLoading === doctor._id ? 'Processing...' : 'Re-approve'}
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteDoctor(doctor._id)}
                            disabled={actionLoading === doctor._id}
                            className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50 transition-colors"
                            title="Delete Doctor"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                    {filteredDoctors.length > 0 && (
                      <span className="ml-2">
                        ({filteredDoctors.length} doctors)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Add New Doctor</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddDoctor} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="john.doe@example.com"
                  />
                </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={newDoctor.phone}
                        onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={newDoctor.sex}
                        onChange={(e) => setNewDoctor({...newDoctor, sex: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={newDoctor.dateOfBirth}
                        onChange={(e) => setNewDoctor({...newDoctor, dateOfBirth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Language
                      </label>
                      <select
                        value={newDoctor.appLanguage}
                        onChange={(e) => setNewDoctor({...newDoctor, appLanguage: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Telugu">Telugu</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Kannada">Kannada</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  Professional Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({...newDoctor, specialty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Specialty</option>
                    <option value="General Physician">General Physician</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="ENT Specialist">ENT Specialist</option>
                        <option value="Ophthalmologist">Ophthalmologist</option>
                        <option value="Urologist">Urologist</option>
                        <option value="Oncologist">Oncologist</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                        value={newDoctor.yearsOfExperience}
                        onChange={(e) => setNewDoctor({...newDoctor, yearsOfExperience: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="5"
                  />
                </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Clinic Name
                      </label>
                      <input
                        type="text"
                        value={newDoctor.clinicName}
                        onChange={(e) => setNewDoctor({...newDoctor, clinicName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Apollo Hospital"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Consultation Fee (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newDoctor.consultationFee}
                        onChange={(e) => setNewDoctor({...newDoctor, consultationFee: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      About Doctor
                    </label>
                    <textarea
                      value={newDoctor.about}
                      onChange={(e) => setNewDoctor({...newDoctor, about: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Brief description about the doctor's expertise and approach..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <DynamicInputList
                        label="Key Specializations"
                        values={newDoctor.keySpecialization}
                        onChange={(values) => setNewDoctor({...newDoctor, keySpecialization: values})}
                        placeholder="e.g., Heart Surgery, Cardiac Interventions"
                        maxItems={10}
                      />
                    </div>
                    <div>
                      <DynamicInputList
                        label="Languages Spoken"
                        values={newDoctor.languages}
                        onChange={(values) => setNewDoctor({...newDoctor, languages: values})}
                        placeholder="e.g., English, Hindi, Telugu"
                        maxItems={10}
                      />
                    </div>
                    <div>
                      <DynamicInputList
                        label="Services Offered"
                        values={newDoctor.services}
                        onChange={(values) => setNewDoctor({...newDoctor, services: values})}
                        placeholder="e.g., Consultation, Surgery, Emergency Care"
                        maxItems={15}
                      />
                    </div>
                    <div>
                      <DynamicInputList
                        label="Contact Phones"
                        values={newDoctor.contactPhones}
                        onChange={(values) => setNewDoctor({...newDoctor, contactPhones: values})}
                        placeholder="+91 9876543210"
                        maxItems={5}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Education & Experience */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  Education & Experience
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <DynamicInputList
                        label="Education"
                        values={newDoctor.education}
                        onChange={(values) => setNewDoctor({...newDoctor, education: values})}
                        inputType="textarea"
                        rows={2}
                        placeholder="e.g., MBBS from AIIMS Delhi (2010-2015)"
                        maxItems={10}
                      />
                    </div>
                    <div>
                      <DynamicInputList
                        label="Professional Experience"
                        values={newDoctor.experience}
                        onChange={(values) => setNewDoctor({...newDoctor, experience: values})}
                        inputType="textarea"
                        rows={2}
                        placeholder="e.g., Senior Consultant at Apollo Hospital (2018-Present)"
                        maxItems={10}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Address */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location & Address
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newDoctor.city}
                    onChange={(e) => setNewDoctor({...newDoctor, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                  </label>
                  <input
                        type="text"
                        value={newDoctor.location}
                        onChange={(e) => setNewDoctor({...newDoctor, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Bandra West, Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={newDoctor.addressLine1}
                        onChange={(e) => setNewDoctor({...newDoctor, addressLine1: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Building/Street"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={newDoctor.addressLine2}
                        onChange={(e) => setNewDoctor({...newDoctor, addressLine2: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Area/Landmark"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={newDoctor.addressState}
                        onChange={(e) => setNewDoctor({...newDoctor, addressState: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={newDoctor.postalCode}
                        onChange={(e) => setNewDoctor({...newDoctor, postalCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="400050"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={newDoctor.country}
                        onChange={(e) => setNewDoctor({...newDoctor, country: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="India"
                      />
                    </div>
                    <div>
                      <DynamicInputList
                        label="Contact Emails"
                        values={newDoctor.contactEmails}
                        onChange={(values) => setNewDoctor({...newDoctor, contactEmails: values})}
                        placeholder="doctor@clinic.com"
                        maxItems={5}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Location Picker */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Precise Location (Map)
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                 
                  <GeolocationPicker
                    onLocationSelect={(coords) => {
                      setNewDoctor({
                        ...newDoctor,
                        coordinates: coords ? [coords.lng, coords.lat] : null
                      });
                    }}
                    initialLocation={newDoctor.coordinates ? {
                      lat: newDoctor.coordinates[1],
                      lng: newDoctor.coordinates[0]
                    } : null}
                    address={{
                      line1: newDoctor.addressLine1,
                      line2: newDoctor.addressLine2,
                      city: newDoctor.addressCity || newDoctor.city,
                      state: newDoctor.addressState,
                      postalCode: newDoctor.postalCode,
                      country: newDoctor.country
                    }}
                    className="h-64 mb-4"
                  />
                  {newDoctor.coordinates && (
                    <div className="mt-2 text-xs text-green-600">
                      ✓ Location set: {newDoctor.coordinates[1].toFixed(4)}, {newDoctor.coordinates[0].toFixed(4)}
                    </div>
                  )}
                </div>
              </div>

              {/* Spacer between sections */}
              <div className="h-6"></div>

              {/* Time Slots */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Availability Schedule
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Set the doctor's availability schedule for the next 7 days.
                  </p>
                  <TimeSlotPicker
                    onSlotsChange={handleSlotsChange}
                    initialSlots={newDoctor.slots}
                    className="mb-4"
                  />
                  {newDoctor.slots && newDoctor.slots.length > 0 && (
                    <div className="mt-2 text-xs text-green-600">
                      ✓ {newDoctor.slots.length} day(s) scheduled
                    </div>
                  )}
                </div>
              </div>

              {/* Clinic Images */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Clinic Gallery Images
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Upload photos of the clinic, facilities, equipment, and interior to help patients get familiar with the environment.
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setNewDoctor({
                          ...newDoctor,
                          clinicImages: [...(newDoctor.clinicImages || []), ...files]
                        });
                      }}
                      className="hidden"
                      id="clinicImages"
                    />
                    <label
                      htmlFor="clinicImages"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        Click to upload clinic images or drag and drop
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG, JPEG up to 5MB each
                      </span>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {newDoctor.clinicImages && newDoctor.clinicImages.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Selected Images ({newDoctor.clinicImages.length})
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {newDoctor.clinicImages.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Clinic ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedImages = newDoctor.clinicImages.filter((_, i) => i !== index);
                                setNewDoctor({
                                  ...newDoctor,
                                  clinicImages: updatedImages
                                });
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                            <div className="text-xs text-gray-500 mt-1 truncate">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'add'}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {actionLoading === 'add' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    'Add Doctor'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        </>
      )}

      {/* Doctor Details Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xl">
                  {(selectedDoctor.user?.name || selectedDoctor.name || 'D').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Dr. {selectedDoctor.user?.name || selectedDoctor.name}
                  </h3>
                  <p className="text-gray-600">{selectedDoctor.specialty}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Basic Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Basic Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <p className="text-sm text-gray-900">Dr. {selectedDoctor.user?.name || selectedDoctor.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-900">{selectedDoctor.user?.email || selectedDoctor.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-sm text-gray-900">{selectedDoctor.user?.phone || selectedDoctor.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                      <p className="text-sm text-gray-900">{selectedDoctor.specialty}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      <p className="text-sm text-gray-900">{selectedDoctor.yearsOfExperience || 0} years</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <p className="text-sm text-gray-900">{selectedDoctor.city}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Clinic</label>
                      <p className="text-sm text-gray-900">{selectedDoctor.clinicName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                      <p className="text-sm text-gray-900 font-semibold">
                        {selectedDoctor.consultationFee ? `₹${selectedDoctor.consultationFee.toLocaleString()}` : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        selectedDoctor.status === 'approved' ? 'bg-green-100 text-green-800' :
                        selectedDoctor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedDoctor.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedDoctor.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              {selectedDoctor.about && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-sm text-gray-900 leading-relaxed">{selectedDoctor.about}</p>
                  </div>
                </div>
              )}

              {/* Professional Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Education */}
                {selectedDoctor.education && selectedDoctor.education.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      Education
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ul className="space-y-3">
                        {selectedDoctor.education.map((edu, index) => (
                          <li key={index} className="text-sm text-gray-900 flex items-start">
                            <span className="text-green-600 mr-3 mt-1 flex-shrink-0">•</span>
                            <span>{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Experience */}
                {selectedDoctor.experience && selectedDoctor.experience.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                      Professional Experience
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ul className="space-y-3">
                        {selectedDoctor.experience.map((exp, index) => (
                          <li key={index} className="text-sm text-gray-900 flex items-start">
                            <span className="text-orange-600 mr-3 mt-1 flex-shrink-0">•</span>
                            <span>{exp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Services & Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Services */}
                {selectedDoctor.services && selectedDoctor.services.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Services Offered
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedDoctor.services.map((service, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Languages */}
                {selectedDoctor.languages && selectedDoctor.languages.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      Languages Spoken
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedDoctor.languages.map((language, index) => (
                          <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact & Address */}
              {selectedDoctor.address && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Contact Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <p className="text-sm text-gray-900">
                          {[
                            selectedDoctor.address.line1,
                            selectedDoctor.address.line2,
                            selectedDoctor.address.city,
                            selectedDoctor.address.state,
                            selectedDoctor.address.postalCode,
                            selectedDoctor.address.country
                          ].filter(Boolean).join(', ') || 'Not provided'}
                        </p>
                      </div>
                      {(selectedDoctor.contactPhones && selectedDoctor.contactPhones.length > 0) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phones</label>
                          <div className="space-y-1">
                            {selectedDoctor.contactPhones.map((phone, index) => (
                              <p key={index} className="text-sm text-gray-900">{phone}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-500">
                <p>Profile created: {selectedDoctor.createdAt ? new Date(selectedDoctor.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                }) : 'Unknown'}</p>
                {selectedDoctor.updatedAt && selectedDoctor.updatedAt !== selectedDoctor.createdAt && (
                  <p>Last updated: {new Date(selectedDoctor.updatedAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                {selectedDoctor.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleDoctorAction(selectedDoctor._id, 'approve')}
                      disabled={actionLoading === selectedDoctor._id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {actionLoading === selectedDoctor._id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Approve Doctor'
                      )}
                    </button>
                    <button
                      onClick={() => handleDoctorAction(selectedDoctor._id, 'reject')}
                      disabled={actionLoading === selectedDoctor._id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {actionLoading === selectedDoctor._id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Reject Doctor'
                      )}
                    </button>
                  </>
                )}
                {selectedDoctor.status === 'approved' && (
                  <button
                    onClick={() => handleDoctorAction(selectedDoctor._id, 'reject')}
                    disabled={actionLoading === selectedDoctor._id}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {actionLoading === selectedDoctor._id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Suspend Doctor'
                    )}
                  </button>
                )}
                {selectedDoctor.status === 'rejected' && (
                  <button
                    onClick={() => handleDoctorAction(selectedDoctor._id, 'approve')}
                    disabled={actionLoading === selectedDoctor._id}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {actionLoading === selectedDoctor._id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Re-approve Doctor'
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteDoctor(selectedDoctor._id)}
                  disabled={actionLoading === selectedDoctor._id}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Delete Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {showEditModal && editDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Edit Doctor</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditDoctor} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editDoctor.user?.name || editDoctor.name || ''}
                        onChange={(e) => setEditDoctor({
                          ...editDoctor,
                          user: { ...editDoctor.user, name: e.target.value },
                          name: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Dr. John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={editDoctor.user?.email || editDoctor.email || ''}
                        onChange={(e) => setEditDoctor({
                          ...editDoctor,
                          user: { ...editDoctor.user, email: e.target.value },
                          email: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editDoctor.user?.phone || editDoctor.phone || ''}
                        onChange={(e) => setEditDoctor({
                          ...editDoctor,
                          user: { ...editDoctor.user, phone: e.target.value },
                          phone: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={editDoctor.sex || ''}
                        onChange={(e) => setEditDoctor({...editDoctor, sex: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={editDoctor.dateOfBirth || ''}
                        onChange={(e) => setEditDoctor({...editDoctor, dateOfBirth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Language
                      </label>
                      <select
                        value={editDoctor.appLanguage || 'English'}
                        onChange={(e) => setEditDoctor({...editDoctor, appLanguage: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Telugu">Telugu</option>
                        <option value="Kannada">Kannada</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Punjabi">Punjabi</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4" />
                  </svg>
                  Professional Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialty <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={editDoctor.specialty || ''}
                        onChange={(e) => setEditDoctor({...editDoctor, specialty: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select Specialty</option>
                        <option value="General Physician">General Physician</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Orthopedic">Orthopedic</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Psychiatrist">Psychiatrist</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="ENT Specialist">ENT Specialist</option>
                        <option value="Ophthalmologist">Ophthalmologist</option>
                        <option value="Urologist">Urologist</option>
                        <option value="Oncologist">Oncologist</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={editDoctor.yearsOfExperience || 0}
                        onChange={(e) => setEditDoctor({...editDoctor, yearsOfExperience: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Clinic Name
                      </label>
                      <input
                        type="text"
                        value={editDoctor.clinicName || ''}
                        onChange={(e) => setEditDoctor({...editDoctor, clinicName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Apollo Hospital"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editDoctor.city || ''}
                        onChange={(e) => setEditDoctor({...editDoctor, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Consultation Fee (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editDoctor.consultationFee || 0}
                        onChange={(e) => setEditDoctor({...editDoctor, consultationFee: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editDoctor.location || ''}
                        onChange={(e) => setEditDoctor({...editDoctor, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Andheri West, Mumbai"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About Doctor
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <textarea
                    value={editDoctor.about || ''}
                    onChange={(e) => setEditDoctor({...editDoctor, about: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief description about the doctor's expertise and approach..."
                  />
                </div>
              </div>

              {/* Education & Experience */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Education & Experience
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <DynamicInputList
                      label="Education"
                      values={editDoctor.education || []}
                      onChange={(values) => setEditDoctor({...editDoctor, education: values})}
                      placeholder="MBBS from AIIMS Delhi (2010)"
                      maxItems={5}
                      inputType="textarea"
                      rows={2}
                    />
                  </div>
                  <div>
                    <DynamicInputList
                      label="Professional Experience"
                      values={editDoctor.experience || []}
                      onChange={(values) => setEditDoctor({...editDoctor, experience: values})}
                      placeholder="Senior Consultant at Apollo Hospital (2015-Present)"
                      maxItems={10}
                      inputType="textarea"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Services & Specializations */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Services & Specializations
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <DynamicInputList
                      label="Key Specializations"
                      values={editDoctor.keySpecialization || []}
                      onChange={(values) => setEditDoctor({...editDoctor, keySpecialization: values})}
                      placeholder="Cardiac Surgery"
                      maxItems={5}
                    />
                  </div>
                  <div>
                    <DynamicInputList
                      label="Services Offered"
                      values={editDoctor.services || []}
                      onChange={(values) => setEditDoctor({...editDoctor, services: values})}
                      placeholder="Heart Surgery"
                      maxItems={10}
                    />
                  </div>
                  <div>
                    <DynamicInputList
                      label="Languages Spoken"
                      values={editDoctor.languages || []}
                      onChange={(values) => setEditDoctor({...editDoctor, languages: values})}
                      placeholder="English"
                      maxItems={5}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <DynamicInputList
                      label="Additional Phone Numbers"
                      values={editDoctor.contactPhones || []}
                      onChange={(values) => setEditDoctor({...editDoctor, contactPhones: values})}
                      placeholder="+91 9876543210"
                      maxItems={3}
                      inputType="tel"
                    />
                  </div>
                  <div>
                    <DynamicInputList
                      label="Additional Email Addresses"
                      values={editDoctor.contactEmails || []}
                      onChange={(values) => setEditDoctor({...editDoctor, contactEmails: values})}
                      placeholder="clinic@example.com"
                      maxItems={3}
                      inputType="email"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Address Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={editDoctor.addressLine1 || ''}
                        onChange={(e) => setEditDoctor({...editDoctor, addressLine1: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={editDoctor.addressLine2 || ''}
                        onChange={(e) => setEditDoctor({...editDoctor, addressLine2: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Near City Center"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={editDoctor.addressState || ''}
                        onChange={(e) => setEditDoctor({...editDoctor, addressState: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={editDoctor.postalCode || ''}
                        onChange={(e) => setEditDoctor({...editDoctor, postalCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="400001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={editDoctor.country || ''}
                        onChange={(e) => setEditDoctor({...editDoctor, country: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="India"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Location Picker */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Precise Location (Map)
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <GeolocationPicker
                    onLocationSelect={(coords) => {
                      setEditDoctor({
                        ...editDoctor,
                        coordinates: coords ? [coords.lng, coords.lat] : null
                      });
                    }}
                    initialLocation={editDoctor.coordinates ? {
                      lat: editDoctor.coordinates[1],
                      lng: editDoctor.coordinates[0]
                    } : null}
                    address={{
                      line1: editDoctor.addressLine1,
                      line2: editDoctor.addressLine2,
                      city: editDoctor.addressCity || editDoctor.city,
                      state: editDoctor.addressState,
                      postalCode: editDoctor.postalCode,
                      country: editDoctor.country
                    }}
                    className="h-64 mb-4"
                  />
                  {editDoctor.coordinates && (
                    <div className="mt-2 text-xs text-green-600">
                      ✓ Location set: {editDoctor.coordinates[1].toFixed(4)}, {editDoctor.coordinates[0].toFixed(4)}
                    </div>
                  )}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Availability Schedule
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Set the doctor's availability schedule for the next 7 days.
                  </p>
                  <TimeSlotPicker
                    onSlotsChange={handleEditSlotsChange}
                    initialSlots={editDoctor.slots}
                    className="mb-4"
                  />
                  {editDoctor.slots && editDoctor.slots.length > 0 && (
                    <div className="mt-2 text-xs text-green-600">
                      ✓ {editDoctor.slots.length} day(s) scheduled
                    </div>
                  )}
                </div>
              </div>

              {/* Clinic Images */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Clinic Gallery Images
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Upload photos of the clinic, facilities, equipment, and interior to help patients get familiar with the environment.
                  </p>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setEditDoctor({
                          ...editDoctor,
                          clinicImages: [...(editDoctor.clinicImages || []), ...files]
                        });
                      }}
                      className="hidden"
                      id="editClinicImages"
                    />
                    <label
                      htmlFor="editClinicImages"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        Click to upload clinic images or drag and drop
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG, JPEG up to 5MB each
                      </span>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {editDoctor.clinicImages && editDoctor.clinicImages.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Selected Images ({editDoctor.clinicImages.length})
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {editDoctor.clinicImages.map((image, index) => {
                          // Handle both File objects (new uploads) and URL strings (existing images)
                          const isFile = image instanceof File;
                          const imageSrc = isFile ? URL.createObjectURL(image) : image;
                          const imageName = isFile ? image.name : `Image ${index + 1}`;

                          return (
                            <div key={index} className="relative">
                              <img
                                src={imageSrc}
                                alt={`Clinic ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  // Fallback for broken images
                                  e.target.src = 'https://via.placeholder.com/80x60?text=Image';
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedImages = editDoctor.clinicImages.filter((_, i) => i !== index);
                                  setEditDoctor({
                                    ...editDoctor,
                                    clinicImages: updatedImages
                                  });
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                              <div className="text-xs text-gray-500 mt-1 truncate">
                                {imageName}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === editDoctor._id}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {actionLoading === editDoctor._id ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update Doctor'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
