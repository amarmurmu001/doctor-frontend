import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import useAuthStore from '../../stores/useAuthStore';
import ProgressBar from '../../components/auth/ProgressBar';
import DynamicInputList from '../../components/DynamicInputList';
import GeolocationPicker from '../../components/GeolocationPicker';
import TimeRangePicker from '../../components/TimeRangePicker';
import Captcha from '../../components/Captcha';
import { submitDoctorApplication } from '../../services/authAPI';

const DoctorOnboarding = () => {
  const navigate = useNavigate();
  const setOnboarding = useAuthStore(s => s.setOnboarding);
  const setAuth = useAuthStore(s => s.setAuth);
  const onboarding = useAuthStore(s => s.onboarding);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [clinicImages, setClinicImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Details (for User model)
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    
    // Professional Details (for Doctor model)
    specialty: '', // Maps to Doctor.specialty
    yearsOfExperience: 0, // Maps to Doctor.yearsOfExperience
    clinicName: '', // Maps to Doctor.clinicName
    city: '', // Maps to Doctor.city
    about: '', // Maps to Doctor.about
    education: [], // Maps to Doctor.education
    experience: [], // Maps to Doctor.experience
    services: [], // Maps to Doctor.services
    languages: [], // Maps to Doctor.languages
    contactPhones: [], // Maps to Doctor.contactPhones
    contactEmails: [], // Maps to Doctor.contactEmails
    
    // Address (for Doctor.address)
    addressLine1: '',
    addressLine2: '',
    addressCity: '',
    addressState: '',
    postalCode: '',
    country: 'India',
    
    // Location coordinates
    coordinates: null, // {lat, lng}
    
    // Consultation Details
    consultationFee: 0, // Maps to Doctor.consultationFee
    keySpecialization: [], // Maps to Doctor.keySpecialization
    
    // Time Slots
    slots: [], // Maps to Doctor.slots
    
    // Terms
    acceptTerms: false,
    acceptPrivacy: false,
    captchaValid: false
  });

  const progressSteps = ['Sign Up', 'Verify OTP', 'Role Selection', 'Complete Profile'];
  const doctorSteps = ['Personal', 'Professional', 'Consultation', 'Schedule', 'Images', 'Terms'];
  const totalSteps = doctorSteps.length;

  // Pre-populate form with basic info from signup
  useEffect(() => {
    if (onboarding?.basicInfo) {
      setFormData(prev => ({
        ...prev,
        fullName: onboarding.basicInfo.fullName || '',
        email: onboarding.basicInfo.email || '',
        phone: onboarding.basicInfo.phone || '',
        // Initialize arrays if empty
        education: prev.education.length === 0 ? [] : prev.education,
        experience: prev.experience.length === 0 ? [] : prev.experience,
        services: prev.services.length === 0 ? [] : prev.services,
        languages: prev.languages.length === 0 ? [] : prev.languages,
        contactPhones: prev.contactPhones.length === 0 ? [onboarding.basicInfo.phone || ''] : prev.contactPhones,
        contactEmails: prev.contactEmails.length === 0 ? [onboarding.basicInfo.email || ''] : prev.contactEmails,
        keySpecialization: prev.keySpecialization.length === 0 ? [] : prev.keySpecialization,
        slots: prev.slots.length === 0 ? [] : prev.slots
      }));
    }
  }, [onboarding?.basicInfo]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCaptchaValidation = useCallback((isValid) => {
    setFormData(prev => ({ ...prev, captchaValid: isValid }));
  }, []);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Check if total images would exceed 5
    if (clinicImages.length + files.length > 5) {
      setError('You can upload maximum 5 images');
      return;
    }

    // Check file sizes and types
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setError(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not a valid image file.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview URLs
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setClinicImages(prev => [...prev, ...newImages]);
    setError(''); // Clear any previous errors
  };

  const removeImage = (index) => {
    setClinicImages(prev => {
      const newImages = [...prev];
      // Revoke the object URL to free memory
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };



  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      console.log('Submitting doctor application...');
      
      // Submit doctor application (login + update profile + store details)
      const result = await submitDoctorApplication(
        formData,
        onboarding.email,
        onboarding.basicInfo.password
      );
      
      // Upload clinic images if any are selected
      if (clinicImages.length > 0) {
        setUploadingImages(true);
        try {
          console.log('Uploading clinic images...');
          
          // Get doctor profile to get doctor ID
          const doctorResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/doctors/me/doctor-profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${result.token}`
            }
          });
          
          if (doctorResponse.ok) {
            const doctorData = await doctorResponse.json();
            const doctorId = doctorData.data._id;
            
            // Upload images
            const imageFormData = new FormData();
            clinicImages.forEach(imageObj => {
              imageFormData.append('images', imageObj.file);
            });
            
            const uploadResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/doctors/${doctorId}/images`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${result.token}`
              },
              body: imageFormData
            });
            
            if (uploadResponse.ok) {
              const uploadResult = await uploadResponse.json();
              console.log('Clinic images uploaded successfully:', uploadResult);
            } else {
              const errorText = await uploadResponse.text();
              console.error('Failed to upload clinic images:', uploadResponse.status, errorText);
              setError(`Failed to upload clinic images: ${uploadResponse.status}`);
            }
          }
        } catch (imageError) {
          console.error('Error uploading clinic images:', imageError);
          // Don't fail the entire process if image upload fails
        } finally {
          setUploadingImages(false);
        }
      }
      
      // Store detailed doctor information for verification process
      setOnboarding({ 
        ...onboarding,
        doctorDetails: formData,
        persona: 'doctor',
        token: result.token
      });
      
      // Set authentication state
      setAuth(result.user, result.token);
      
      console.log('Doctor application submitted for verification');
      
      // Navigate to verification status page
      navigate('/auth/doctor-verification');
    } catch (error) {
      console.error('Error submitting doctor application:', error);
      setError('Failed to submit application: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700">
          <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Your basic information from registration is shown below. This information cannot be changed here.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Full Name*</label>
        <input 
          type="text"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-700" 
          value={formData.fullName}
          readOnly
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Email*</label>
        <input 
          type="email"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-700" 
          value={formData.email}
          readOnly
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number*</label>
        <input 
          type="tel"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-700" 
          value={formData.phone}
          readOnly
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-4">Gender*</label>
        <div className="flex gap-4">
          {['male', 'female', 'other'].map(gender => (
            <button
              key={gender}
              type="button"
              onClick={() => handleInputChange('gender', gender)}
              className={`flex-1 p-3 rounded-lg border-2 transition-colors capitalize ${
                formData.gender === gender
                  ? 'border-[#7551B2] bg-[#7551B2]/10 text-[#7551B2]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Date of Birth*</label>
        <input 
          type="date"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none" 
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          required
        />
      </div>
    </div>
  );

  const renderProfessionalDetails = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Specialty*</label>
        <select 
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none"
          value={formData.specialty}
          onChange={(e) => handleInputChange('specialty', e.target.value)}
          required
        >
          <option value="">Select Specialty</option>
          <option value="General Medicine">General Medicine</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Gynecology">Gynecology</option>
          <option value="Psychiatry">Psychiatry</option>
          <option value="Ayurveda">Ayurveda</option>
          <option value="Homeopathy">Homeopathy</option>
          <option value="Dentistry">Dentistry</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Years of Experience*</label>
        <input 
          type="number"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none" 
          placeholder="5" 
          min="0"
          value={formData.yearsOfExperience}
          onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Clinic/Hospital Name*</label>
        <input 
          type="text"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none" 
          placeholder="City Hospital" 
          value={formData.clinicName}
          onChange={(e) => handleInputChange('clinicName', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">City*</label>
        <input 
          type="text"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none" 
          placeholder="Dhanbad" 
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">About Yourself</label>
        <textarea 
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none" 
          placeholder="Brief description about your practice and experience..." 
          rows="3"
          value={formData.about}
          onChange={(e) => handleInputChange('about', e.target.value)}
        />
      </div>

      {/* Address Section */}
      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Clinic Address</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Address Line 1*</label>
            <input 
              type="text"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none" 
              placeholder="Street address" 
              value={formData.addressLine1}
              onChange={(e) => handleInputChange('addressLine1', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Address Line 2</label>
            <input 
              type="text"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none" 
              placeholder="Apartment, suite, etc." 
              value={formData.addressLine2}
              onChange={(e) => handleInputChange('addressLine2', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">City*</label>
              <input 
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none" 
                placeholder="Dhanbad" 
                value={formData.addressCity}
                onChange={(e) => handleInputChange('addressCity', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">State*</label>
              <input 
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none" 
                placeholder="Jharkhand" 
                value={formData.addressState}
                onChange={(e) => handleInputChange('addressState', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Postal Code*</label>
              <input 
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none" 
                placeholder="826001" 
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Country*</label>
              <input 
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none bg-gray-50" 
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                required
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Geolocation Picker */}
        <div className="border-t pt-6">
          <GeolocationPicker
            onLocationSelect={(coords) => handleInputChange('coordinates', coords)}
            initialLocation={formData.coordinates}
            address={`${formData.addressLine1}, ${formData.addressCity}, ${formData.addressState}`}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );



  const renderConsultationDetails = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Consultation Fee (₹)*</label>
        <input 
          type="number"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-[#7551B2] focus:ring-1 focus:ring-[#7551B2] focus:outline-none" 
          placeholder="500" 
          min="0"
          value={formData.consultationFee}
          onChange={(e) => handleInputChange('consultationFee', parseInt(e.target.value) || 0)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-4">Languages Spoken*</label>
        <div className="grid grid-cols-2 gap-3">
          {['Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada'].map(language => (
            <label key={language} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-[#7551B2] focus:ring-[#7551B2]"
                checked={formData.languages.includes(language)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleInputChange('languages', [...formData.languages, language]);
                  } else {
                    handleInputChange('languages', formData.languages.filter(l => l !== language));
                  }
                }}
              />
              <span className="ml-2 text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
      </div>

      <DynamicInputList
        label="Key Specializations"
        values={formData.keySpecialization}
        onChange={(values) => handleInputChange('keySpecialization', values)}
        placeholder="Enter key specialization (e.g., Heart Surgery, Cardiac Care)"
        maxItems={5}
      />

      <DynamicInputList
        label="Education"
        values={formData.education}
        onChange={(values) => handleInputChange('education', values)}
        placeholder="Enter educational qualification (e.g., MBBS - AIIMS Delhi)"
        inputType="textarea"
        rows={2}
        maxItems={8}
      />

      <DynamicInputList
        label="Experience"
        values={formData.experience}
        onChange={(values) => handleInputChange('experience', values)}
        placeholder="Enter work experience (e.g., Senior Cardiologist at AIIMS)"
        inputType="textarea"
        rows={2}
        maxItems={8}
      />

      <DynamicInputList
        label="Services Offered"
        values={formData.services}
        onChange={(values) => handleInputChange('services', values)}
        placeholder="Enter service offered (e.g., General Consultation)"
        maxItems={10}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DynamicInputList
          label="Contact Phone Numbers"
          values={formData.contactPhones}
          onChange={(values) => handleInputChange('contactPhones', values)}
          placeholder="Enter phone number"
          inputType="tel"
          maxItems={3}
        />

        <DynamicInputList
          label="Contact Email Addresses"
          values={formData.contactEmails}
          onChange={(values) => handleInputChange('contactEmails', values)}
          placeholder="Enter email address"
          inputType="email"
          maxItems={3}
        />
      </div>
    </div>
  );

  const renderScheduleDetails = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Available Time Ranges</h3>
        <p className="text-sm text-gray-600 mb-6">
          Set your consultation time ranges for the next 7 days. Each day can have one time range (e.g., 9:00 AM to 5:00 PM).
        </p>
      </div>

      <TimeRangePicker
        onSlotsChange={(slots) => handleInputChange('slots', slots)}
        initialSlots={formData.slots}
      />
    </div>
  );

  const renderClinicImages = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Clinic Photos</h3>
        <p className="text-sm text-gray-600 mb-6">Upload photos of your clinic to help patients get familiar with your facility</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-4">
            <label htmlFor="clinic-images" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Upload clinic photos
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB each (max 5 images)
              </span>
            </label>
            <input
              id="clinic-images"
              name="clinic-images"
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              onChange={handleImageUpload}
              disabled={uploadingImages}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="text-orange-600">Optional:</span> You can skip this step and add photos later from your profile
          </p>
        </div>
      </div>

      {clinicImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Images ({clinicImages.length}/5)</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {clinicImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.preview}
                  alt={`Clinic image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadingImages && (
        <div className="text-center py-4">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#7551B2] border-t-transparent mr-2"></div>
            <span className="text-sm text-gray-600">Uploading images...</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderTermsAndConditions = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
        <p className="text-sm text-gray-600">Please review and accept our terms to complete your registration</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
        <h4 className="font-semibold text-gray-900 mb-3">Doctor Registration Terms & Conditions</h4>
        <div className="text-sm text-gray-700 space-y-2">
          <p>1. <strong>Verification Process:</strong> All submitted documents will be verified by our medical board within 3-5 business days.</p>
          <p>2. <strong>License Validity:</strong> Your medical license must be valid and in good standing with relevant medical authorities.</p>
          <p>3. <strong>Professional Conduct:</strong> You agree to maintain the highest standards of medical ethics and professional conduct.</p>
          <p>4. <strong>Patient Privacy:</strong> You will strictly maintain patient confidentiality and comply with all privacy regulations.</p>
          <p>5. <strong>Platform Guidelines:</strong> You agree to follow all platform guidelines for consultations and interactions.</p>
          <p>6. <strong>Fee Structure:</strong> Platform fees will be deducted as per the agreed commission structure.</p>
          <p>7. <strong>Account Suspension:</strong> Doctar reserves the right to suspend accounts for policy violations.</p>
          <p>8. <strong>Data Accuracy:</strong> You certify that all provided information is accurate and up-to-date.</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-start">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-[#7551B2] focus:ring-[#7551B2] mt-1"
            checked={formData.acceptTerms}
            onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
          />
          <span className="ml-3 text-sm text-gray-700">
            I have read and agree to the <span className="text-[#7551B2] underline cursor-pointer">Terms and Conditions</span> for doctor registration on Doctar platform.
          </span>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-[#7551B2] focus:ring-[#7551B2] mt-1"
            checked={formData.acceptPrivacy}
            onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
          />
          <span className="ml-3 text-sm text-gray-700">
            I agree to the <span className="text-[#7551B2] underline cursor-pointer">Privacy Policy</span> and consent to the processing of my personal and professional data.
          </span>
        </label>
      </div>

      {/* CAPTCHA Verification */}
      <div className="space-y-4">
        <Captcha onValidationChange={handleCaptchaValidation} />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Verification Process</h4>
            <p className="text-sm text-blue-700 mt-1">
              After submission, your application will be reviewed by our medical verification team. You will receive an email notification once the review is complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderPersonalDetails();
      case 2: return renderProfessionalDetails();
      case 3: return renderConsultationDetails();
      case 4: return renderScheduleDetails();
      case 5: return renderClinicImages();
      case 6: return renderTermsAndConditions();
      default: return renderPersonalDetails();
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.gender && formData.dateOfBirth;
      case 2:
        return formData.specialty && formData.yearsOfExperience >= 0 && formData.clinicName && 
               formData.city && formData.addressLine1 && formData.addressCity && 
               formData.addressState && formData.postalCode;
      case 3:
        return formData.consultationFee >= 0 && formData.languages.length > 0 && 
               formData.keySpecialization.some(k => k.trim()) && 
               formData.education.some(e => e.trim()) && 
               formData.experience.some(exp => exp.trim()) && 
               formData.services.some(s => s.trim());
      case 4: // Schedule - optional, always valid
        return true;
      case 5: // Clinic Images - optional, always valid
        return true;
      case 6:
        return formData.acceptTerms && formData.acceptPrivacy && formData.captchaValid;
      default:
        return false;
    }
  };

  return (
    <>
      <Helmet defer={false}>
        <title>Doctor Registration | Join Doctar Platform</title>
        <meta name="description" content="Register as a doctor on Doctar to connect with patients, manage appointments, and grow your online presence. Join our trusted healthcare platform to provide expert consultations." />
        <meta name="keywords" content="doctor registration, join doctar, doctor sign up, register as a doctor, online consultation doctor registration, healthcare platform registration, doctor profile create, doctar doctor portal, doctor account signup" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.doctar.in/auth/doctor-onboarding" />
        <meta property="og:title" content="Doctor Registration | Join Doctar Platform" />
        <meta property="og:description" content="Register as a doctor on Doctar to connect with patients, manage appointments, and grow your online presence. Join our trusted healthcare platform to provide expert consultations." />
        <meta property="og:url" content="https://www.doctar.in/auth/doctor-onboarding" />
        <meta name="twitter:title" content="Doctor Registration | Join Doctar Platform" />
        <meta name="twitter:description" content="Register as a doctor on Doctar to connect with patients, manage appointments, and grow your online presence. Join our trusted healthcare platform to provide expert consultations." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <ProgressBar 
        currentStep={4} 
        totalSteps={4} 
        steps={progressSteps} 
      />
      
      {/* Doctor-specific progress */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="text-sm text-gray-600 mb-2">
            Doctor Registration - Step {currentStep} of {totalSteps}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#7551B2] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-center">
          <img 
            src="/icons/logo.png" 
            alt="Doctar" 
            className="h-8 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Doctor Registration - {doctorSteps[currentStep - 1]} Details
            </h1>
            <p className="text-sm text-gray-600">
              Complete all steps to submit your application for verification
            </p>
          </div>

          {renderStepContent()}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || submitting}
                className="px-8 py-3 bg-[#7551B2] text-white rounded-lg font-medium hover:bg-[#6441a0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </div>
                ) : 'Submit for Verification'}
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="px-6 py-3 bg-[#7551B2] text-white rounded-lg font-medium hover:bg-[#6441a0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DoctorOnboarding;
