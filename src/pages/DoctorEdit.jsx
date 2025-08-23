import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

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
  address: { line1: '', line2: '', city: '', state: '', postalCode: '', country: '' },
  gallery: [],
  consultationFee: 0,
  slots: [],
};

function DoctorEdit() {
  const navigate = useNavigate();
  const token = useAuthStore(s => s.token);
  const user = useAuthStore(s => s.user);
  
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch initial data using the same pattern as DoctorProfile
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
        
        // Use the same API pattern as DoctorProfile - fetch all doctors first
        const res = await fetch(`${API_BASE_URL}/api/doctors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) throw new Error('Failed to load doctors');
        
        const list = await res.json();
        const mine = Array.isArray(list) ? list.find(d => (d.user && (d.user._id === user?.id || d.user === user?.id))) : null;
        
        if (!mine) {
          // No existing profile, keep defaults and allow creation
          console.log('No existing profile found, creating new');
          setLoading(false);
          return;
        }

        // Fetch detailed doctor profile using the found doctor ID
        const det = await fetch(`${API_BASE_URL}/api/doctors/${mine._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const doctorData = det.ok ? await det.json() : mine;
        console.log('Fetched doctor data:', doctorData);
        
        if (doctorData) {
          // Map all fields from the database response
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
            address: doctorData.address || { line1: '', line2: '', city: '', state: '', postalCode: '', country: '' },
            gallery: doctorData.gallery || [],
            consultationFee: doctorData.consultationFee || 0,
            slots: doctorData.slots || [],
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

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      // Filter out empty array items before submission
      const cleanForm = {
        ...form,
        education: form.education.filter(item => item.trim()),
        experience: form.experience.filter(item => item.trim()),
        services: form.services.filter(item => item.trim()),
        languages: form.languages.filter(item => item.trim()),
        contactPhones: form.contactPhones.filter(item => item.trim()),
        contactEmails: form.contactEmails.filter(item => item.trim()),
      };

      console.log('Submitting form:', cleanForm);

      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
      
      // For saving, you can still use the /me endpoint or update to match your backend
      const response = await fetch(`${API_BASE_URL}/api/doctors/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanForm),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to save profile');
      }
      
      const result = await response.json();
      console.log('Profile saved successfully:', result);
      navigate('/Doctor-profile');
    } catch (err) {
      setError(err.message || 'Failed to save');
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
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-xl md:text-2xl font-bold">Edit Doctor Profile</h1>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty *</label>
                  <input
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.specialty}
                    onChange={e => updateField('specialty', e.target.value)}
                    placeholder="e.g., Cardiologist, Dermatologist"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
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

            {/* Professional Details */}
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

            {/* Contact Information */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Phones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Contact Phones</label>
                  {form.contactPhones.map((val, i) => (
                    <div key={i} className="flex gap-2 mb-3">
                      <input
                        type="tel"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                        value={val}
                        onChange={e => updateArrayField('contactPhones', i, e.target.value)}
                        placeholder="e.g., +91 98765 43210"
                      />
                      {form.contactPhones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('contactPhones', i)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('contactPhones')}
                    className="text-sm text-[#7551B2] hover:text-[#5a3d8a] font-medium"
                  >
                    + Add Phone
                  </button>
                </div>

                {/* Contact Emails */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Contact Emails</label>
                  {form.contactEmails.map((val, i) => (
                    <div key={i} className="flex gap-2 mb-3">
                      <input
                        type="email"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                        value={val}
                        onChange={e => updateArrayField('contactEmails', i, e.target.value)}
                        placeholder="e.g., doctor@example.com"
                      />
                      {form.contactEmails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('contactEmails', i)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('contactEmails')}
                    className="text-sm text-[#7551B2] hover:text-[#5a3d8a] font-medium"
                  >
                    + Add Email
                  </button>
                </div>
              </div>
            </section>

            {/* Address */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                  <input
                    placeholder="Street address, building number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.address.line1}
                    onChange={e => setForm(p => ({ ...p, address: { ...p.address, line1: e.target.value } }))}
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                  <input
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.address.line2}
                    onChange={e => setForm(p => ({ ...p, address: { ...p.address, line2: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    placeholder="City"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.address.city}
                    onChange={e => setForm(p => ({ ...p, address: { ...p.address, city: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    placeholder="State"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.address.state}
                    onChange={e => setForm(p => ({ ...p, address: { ...p.address, state: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  <input
                    placeholder="PIN Code"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7551B2] focus:border-transparent transition-all"
                    value={form.address.postalCode}
                    onChange={e => setForm(p => ({ ...p, address: { ...p.address, postalCode: e.target.value } }))}
                  />
                </div>
              </div>
            </section>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
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
                    Save Profile
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
