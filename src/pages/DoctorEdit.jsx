import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { addDoctorAward, uploadProfileImage } from '../services/authAPI';

const initialForm = {
  specialty: '',
  yearsOfExperience: 0,
  clinicName: '',
  city: '',
  about: '',
  education: [''],
  experience: [''],
  services: [''],
  languages: [''],
  contactPhones: [''],
  contactEmails: [''],
  receptionPhone: '',
  receptionWhatsapp: '',
  receptionEmail: '',
  address: { line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India' },
  gallery: [],
  consultationFee: 0,
  slots: [],
  keySpecialization: [''],
  awards: []
};

function DoctorEdit() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [doctorId, setDoctorId] = useState(null);
  
  // Gallery image management
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  
  // Award management
  const [newAward, setNewAward] = useState({ title: '', year: '', institute: '', image: null });
  const [showAwardForm, setShowAwardForm] = useState(false);

  // Fetch initial data
  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      navigate('/login');
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
        
        // Fetch doctor profile by user ID
        const res = await fetch(`${API_BASE_URL}/api/doctors/me/doctor-profile`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        if (res.status === 404) {
          // No existing profile, keep defaults for new profile creation
          console.log('No existing profile found, creating new');
          setLoading(false);
          return;
        }
        
        if (!res.ok) throw new Error('Failed to load profile');
        
        const response = await res.json();
        const doctorData = response.success ? response.data : response;
        
        console.log('Fetched doctor data:', doctorData);
        setDoctorId(doctorData._id);
        
        if (doctorData) {
          setForm({
            specialty: doctorData.specialty || '',
            yearsOfExperience: doctorData.yearsOfExperience || 0,
            clinicName: doctorData.clinicName || '',
            city: doctorData.city || '',
            about: doctorData.about || '',
            education: (doctorData.education && doctorData.education.length > 0) ? doctorData.education : [''],
            experience: (doctorData.experience && doctorData.experience.length > 0) ? doctorData.experience : [''],
            services: (doctorData.services && doctorData.services.length > 0) ? doctorData.services : [''],
            languages: (doctorData.languages && doctorData.languages.length > 0) ? doctorData.languages : [''],
            contactPhones: (doctorData.contactPhones && doctorData.contactPhones.length > 0) ? doctorData.contactPhones : [''],
            contactEmails: (doctorData.contactEmails && doctorData.contactEmails.length > 0) ? doctorData.contactEmails : [''],
            receptionPhone: doctorData.receptionPhone || '',
            receptionWhatsapp: doctorData.receptionWhatsapp || '',
            receptionEmail: doctorData.receptionEmail || '',
            address: doctorData.address || { line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India' },
            gallery: doctorData.gallery || [],
            consultationFee: doctorData.consultationFee || 0,
            slots: doctorData.slots || [],
            keySpecialization: (doctorData.keySpecialization && doctorData.keySpecialization.length > 0) ? doctorData.keySpecialization : [''],
            awards: doctorData.awards || []
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, navigate, token]);

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (error) setError('');
  }

  function updateArrayField(key, index, value) {
    setForm(prev => {
      const arr = Array.isArray(prev[key]) ? [...prev[key]] : [];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });
  }

  function addArrayItem(key) {
    setForm(prev => ({ ...prev, [key]: [...(prev[key] || []), ''] }));
  }

  function removeArrayItem(key, index) {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  }

  // Handle gallery image upload
  async function handleGalleryUpload(files) {
    if (!files.length) return;
    
    setUploadingGallery(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => formData.append('images', file));
      
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to upload images');
      
      const result = await response.json();
      setForm(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...result.data]
      }));
      
      setSuccess('Gallery images uploaded successfully!');
    } catch (err) {
      setError('Failed to upload gallery images: ' + err.message);
    } finally {
      setUploadingGallery(false);
    }
  }

  // Handle award submission
// In your DoctorEdit component
async function handleAddAward() {
  try {
    const formData = new FormData();
    formData.append('title', newAward.title);
    formData.append('year', newAward.year.toString());
    formData.append('institute', newAward.institute);
    
    if (newAward.image) {
      formData.append('awardImage', newAward.image);
    }

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}/awards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData - let browser set it
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to add award');
    }

    const result = await response.json();
    console.log('Award added successfully:', result);

    // Update local state
    setForm(prev => ({
      ...prev,
      awards: result.data
    }));

    // Reset form
    setNewAward({ title: '', year: '', institute: '', image: null });
    setShowAwardForm(false);
    setSuccess('Award added successfully!');
  } catch (err) {
    setError('Failed to add award: ' + err.message);
    console.error('Add award error:', err);
  }
}


  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Filter out empty array items
      const cleanForm = {
        ...form,
        education: form.education.filter(item => item.trim()),
        experience: form.experience.filter(item => item.trim()),
        services: form.services.filter(item => item.trim()),
        languages: form.languages.filter(item => item.trim()),
        contactPhones: form.contactPhones.filter(item => item.trim()),
        contactEmails: form.contactEmails.filter(item => item.trim()),
        receptionPhone: form.receptionPhone.trim(),
        receptionWhatsapp: form.receptionWhatsapp.trim(),
        receptionEmail: form.receptionEmail.trim(),
        keySpecialization: form.keySpecialization.filter(item => item.trim())
      };

      console.log('Submitting form:', cleanForm);

      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
      
      const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}`, {
        method: doctorId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cleanForm),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to save profile');
      }
      
      const result = await response.json();
      console.log('Profile saved successfully:', result);
      
      setSuccess('Profile saved successfully!');
      setTimeout(() => {
        navigate('/doctor-profile');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4ff] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7551B2] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4ff] py-4 md:py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#7551B2] text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/doctor-profile')} 
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Profile
            </button>
            <h1 className="text-xl md:text-2xl font-bold">
              {doctorId ? 'Edit Doctor Profile' : 'Create Doctor Profile'}
            </h1>
            <div className="w-20"></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          {/* Alert Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.specialty}
                    onChange={e => updateField('specialty', e.target.value)}
                    placeholder="e.g., Cardiologist, Dermatologist"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="60"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.yearsOfExperience}
                    onChange={e => updateField('yearsOfExperience', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.clinicName}
                    onChange={e => updateField('clinicName', e.target.value)}
                    placeholder="Your clinic or hospital name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.city}
                    onChange={e => updateField('city', e.target.value)}
                    placeholder="Your practice city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.consultationFee}
                    onChange={e => updateField('consultationFee', Number(e.target.value))}
                    placeholder="500"
                  />
                </div>
              </div>
            </section>

            {/* Key Specializations */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Key Specializations</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Areas of Expertise</label>
                {form.keySpecialization.map((val, i) => (
                  <div key={i} className="flex gap-2 mb-3">
                    <input
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                      value={val}
                      onChange={e => updateArrayField('keySpecialization', i, e.target.value)}
                      placeholder="e.g., Interventional Cardiology, Heart Surgery"
                    />
                    {form.keySpecialization.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('keySpecialization', i)}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('keySpecialization')}
                  className="text-sm text-[#7551B2] hover:text-[#5a3d8a] font-medium"
                >
                  + Add Specialization
                </button>
              </div>
            </section>

            {/* About Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">About</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Yourself</label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all resize-none"
                  value={form.about}
                  onChange={e => updateField('about', e.target.value)}
                  placeholder="Tell patients about yourself, your approach to medicine, and your experience..."
                />
              </div>
            </section>

            {/* Professional Details - Keep your existing section as is */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Professional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Education */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Education</label>
                  {form.education.map((val, i) => (
                    <div key={i} className="flex gap-2 mb-3">
                      <input
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                        value={val}
                        onChange={e => updateArrayField('education', i, e.target.value)}
                        placeholder="e.g., MBBS from XYZ Medical College"
                      />
                      {form.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('education', i)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('education')}
                    className="text-sm text-[#7551B2] hover:text-[#5a3d8a] font-medium"
                  >
                    + Add Education
                  </button>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Experience</label>
                  {form.experience.map((val, i) => (
                    <div key={i} className="flex gap-2 mb-3">
                      <input
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                        value={val}
                        onChange={e => updateArrayField('experience', i, e.target.value)}
                        placeholder="e.g., Senior Doctor at ABC Hospital (2018-2023)"
                      />
                      {form.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('experience', i)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('experience')}
                    className="text-sm text-[#7551B2] hover:text-[#5a3d8a] font-medium"
                  >
                    + Add Experience
                  </button>
                </div>

                {/* Services */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Services Offered</label>
                  {form.services.map((val, i) => (
                    <div key={i} className="flex gap-2 mb-3">
                      <input
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                        value={val}
                        onChange={e => updateArrayField('services', i, e.target.value)}
                        placeholder="e.g., General Consultation, Health Checkup"
                      />
                      {form.services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('services', i)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('services')}
                    className="text-sm text-[#7551B2] hover:text-[#5a3d8a] font-medium"
                  >
                    + Add Service
                  </button>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Languages Spoken</label>
                  {form.languages.map((val, i) => (
                    <div key={i} className="flex gap-2 mb-3">
                      <input
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                        value={val}
                        onChange={e => updateArrayField('languages', i, e.target.value)}
                        placeholder="e.g., English, Hindi, Bengali"
                      />
                      {form.languages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('languages', i)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('languages')}
                    className="text-sm text-[#7551B2] hover:text-[#5a3d8a] font-medium"
                  >
                    + Add Language
                  </button>
                </div>
              </div>
            </section>

            {/* Reception Contact Information */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Reception Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reception Phone</label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.receptionPhone}
                    onChange={e => updateField('receptionPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reception WhatsApp</label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.receptionWhatsapp}
                    onChange={e => updateField('receptionWhatsapp', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reception Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.receptionEmail}
                    onChange={e => updateField('receptionEmail', e.target.value)}
                    placeholder="reception@clinic.com"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                These contact details will be displayed on your profile for patients to reach your clinic reception.
              </p>
            </section>

            {/* Gallery Section */}
            {doctorId && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Gallery</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Gallery Images</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleGalleryUpload(e.target.files)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2]"
                    />
                    {uploadingGallery && <p className="text-sm text-gray-500 mt-2">Uploading images...</p>}
                  </div>
                  
                  {form.gallery.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {form.gallery.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image.url} 
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Awards Section */}
            {doctorId && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Awards & Recognition</h2>
                
                {/* Existing Awards */}
                {form.awards.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {form.awards.map((award, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {award.image?.url && (
                            <img src={award.image.url} alt="Award" className="w-16 h-16 object-cover rounded-lg" />
                          )}
                          <div>
                            <h4 className="font-medium">{award.title}</h4>
                            <p className="text-sm text-gray-600">{award.institute} - {award.year}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Award */}
                {!showAwardForm ? (
                  <button
                    type="button"
                    onClick={() => setShowAwardForm(true)}
                    className="text-sm text-[#7551B2] hover:text-[#5a3d8a] font-medium"
                  >
                    + Add Award
                  </button>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        placeholder="Award Title"
                        className="border border-gray-300 rounded px-3 py-2"
                        value={newAward.title}
                        onChange={(e) => setNewAward({...newAward, title: e.target.value})}
                      />
                      <input
                        type="number"
                        placeholder="Year"
                        className="border border-gray-300 rounded px-3 py-2"
                        value={newAward.year}
                        onChange={(e) => setNewAward({...newAward, year: e.target.value})}
                      />
                      <input
                        placeholder="Institute"
                        className="border border-gray-300 rounded px-3 py-2"
                        value={newAward.institute}
                        onChange={(e) => setNewAward({...newAward, institute: e.target.value})}
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewAward({...newAward, image: e.target.files[0]})}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddAward}
                        className="px-4 py-2 bg-[#7551B2] text-white rounded hover:bg-[#5a3d8a]"
                      >
                        Add Award
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAwardForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Keep your existing Contact Information and Address sections */}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/doctor-profile')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#7551B2] text-white rounded-lg hover:bg-[#5a3d8a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {doctorId ? 'Update Profile' : 'Create Profile'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorEdit;
