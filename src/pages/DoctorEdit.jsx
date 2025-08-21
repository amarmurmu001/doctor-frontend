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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      navigate('/login');
    }
  }, [user, navigate]);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${API_BASE_URL}/api/doctors/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Failed to save profile');
      await response.json();
      navigate('/Doctor-profile');
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f4ff] py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Edit Doctor Profile</h1>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-600">Back</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Specialty</label>
              <input className="w-full border rounded px-3 py-2" value={form.specialty} onChange={e=>updateField('specialty', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-600">Years of Experience</label>
              <input type="number" className="w-full border rounded px-3 py-2" value={form.yearsOfExperience} onChange={e=>updateField('yearsOfExperience', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-gray-600">Clinic Name</label>
              <input className="w-full border rounded px-3 py-2" value={form.clinicName} onChange={e=>updateField('clinicName', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-600">City</label>
              <input className="w-full border rounded px-3 py-2" value={form.city} onChange={e=>updateField('city', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">About</label>
            <textarea className="w-full border rounded px-3 py-2" rows={4} value={form.about} onChange={e=>updateField('about', e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Education</label>
              {form.education.map((val, i) => (
                <input key={i} className="w-full border rounded px-3 py-2 mb-2" value={val} onChange={e=>updateArrayField('education', i, e.target.value)} />
              ))}
              <button type="button" onClick={()=>addArrayItem('education')} className="text-xs text-[#7551B2]">+ Add</button>
            </div>
            <div>
              <label className="text-sm text-gray-600">Experience</label>
              {form.experience.map((val, i) => (
                <input key={i} className="w-full border rounded px-3 py-2 mb-2" value={val} onChange={e=>updateArrayField('experience', i, e.target.value)} />
              ))}
              <button type="button" onClick={()=>addArrayItem('experience')} className="text-xs text-[#7551B2]">+ Add</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Services</label>
              {form.services.map((val, i) => (
                <input key={i} className="w-full border rounded px-3 py-2 mb-2" value={val} onChange={e=>updateArrayField('services', i, e.target.value)} />
              ))}
              <button type="button" onClick={()=>addArrayItem('services')} className="text-xs text-[#7551B2]">+ Add</button>
            </div>
            <div>
              <label className="text-sm text-gray-600">Languages</label>
              {form.languages.map((val, i) => (
                <input key={i} className="w-full border rounded px-3 py-2 mb-2" value={val} onChange={e=>updateArrayField('languages', i, e.target.value)} />
              ))}
              <button type="button" onClick={()=>addArrayItem('languages')} className="text-xs text-[#7551B2]">+ Add</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Contact Phones</label>
              {form.contactPhones.map((val, i) => (
                <input key={i} className="w-full border rounded px-3 py-2 mb-2" value={val} onChange={e=>updateArrayField('contactPhones', i, e.target.value)} />
              ))}
              <button type="button" onClick={()=>addArrayItem('contactPhones')} className="text-xs text-[#7551B2]">+ Add</button>
            </div>
            <div>
              <label className="text-sm text-gray-600">Contact Emails</label>
              {form.contactEmails.map((val, i) => (
                <input key={i} className="w-full border rounded px-3 py-2 mb-2" value={val} onChange={e=>updateArrayField('contactEmails', i, e.target.value)} />
              ))}
              <button type="button" onClick={()=>addArrayItem('contactEmails')} className="text-xs text-[#7551B2]">+ Add</button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Address</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input placeholder="Line 1" className="w-full border rounded px-3 py-2" value={form.address.line1} onChange={e=>setForm(p=>({ ...p, address: { ...p.address, line1: e.target.value } }))} />
              <input placeholder="Line 2" className="w-full border rounded px-3 py-2" value={form.address.line2} onChange={e=>setForm(p=>({ ...p, address: { ...p.address, line2: e.target.value } }))} />
              <input placeholder="City" className="w-full border rounded px-3 py-2" value={form.address.city} onChange={e=>setForm(p=>({ ...p, address: { ...p.address, city: e.target.value } }))} />
              <input placeholder="State" className="w-full border rounded px-3 py-2" value={form.address.state} onChange={e=>setForm(p=>({ ...p, address: { ...p.address, state: e.target.value } }))} />
              <input placeholder="Postal Code" className="w-full border rounded px-3 py-2" value={form.address.postalCode} onChange={e=>setForm(p=>({ ...p, address: { ...p.address, postalCode: e.target.value } }))} />
              <input placeholder="Country" className="w-full border rounded px-3 py-2" value={form.address.country} onChange={e=>setForm(p=>({ ...p, address: { ...p.address, country: e.target.value } }))} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Consultation Fee</label>
              <input type="number" className="w-full border rounded px-3 py-2" value={form.consultationFee} onChange={e=>updateField('consultationFee', Number(e.target.value))} />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={()=>navigate(-1)} className="px-4 py-2 rounded-md border">Cancel</button>
            <button disabled={saving} className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorEdit;


