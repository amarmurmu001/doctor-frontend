const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Helper function for API calls with better error handling
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

// OTP Functions
export async function sendOtp({ email }) {
  return apiCall(`${API_BASE_URL}/api/otp/request`, {
    method: "POST",
    body: JSON.stringify({ channel: "email", destination: email }),
  });
}

export async function verifyOtp({ email, otp }) {
  return apiCall(`${API_BASE_URL}/api/otp/verify`, {
    method: "POST",
    body: JSON.stringify({ channel: "email", destination: email, code: otp }),
  });
}

export async function resendOtp({ email }) {
  return apiCall(`${API_BASE_URL}/api/otp/request`, {
    method: "POST",
    body: JSON.stringify({ channel: "email", destination: email }),
  });
}

// Authentication Functions
export async function loginUser({ email, password }) {
  console.log("Attempting login to:", `${API_BASE_URL}/api/auth/login`);

  const response = await apiCall(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  console.log("Login response:", response);
  return response;
}

export async function registerUser(payload) {
  const body = {
    name: payload.name || payload.fullName,
    email: payload.email,
    password: payload.password,
    role: payload.role || payload.persona, // Support both 'role' and 'persona'
    phone: payload.phone,
    location: payload.city,
    appLanguage: payload.language,
    sex: payload.gender,
    dateOfBirth: payload.dob ? new Date(payload.dob) : undefined,
  };

  // Remove undefined values
  Object.keys(body).forEach((key) => {
    if (body[key] === undefined) {
      delete body[key];
    }
  });

  return apiCall(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Profile Functions
export async function updateUserProfile(profileData, token) {
  console.log(profileData);
  return apiCall(`${API_BASE_URL}/api/auth/update`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json", // Make sure this is set
    },
    body: JSON.stringify(profileData),
  });
}

export async function uploadProfileImage(imageFile, token) {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile-image`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `Upload failed: ${response.status}`;
      } catch {
        errorMessage = `Upload failed: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}

export async function getCurrentUser(token) {
  return apiCall(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Doctor Functions
export async function registerDoctor(payload, token) {
  console.log('📤 Sending doctor registration:', payload);
  return apiCall(`${API_BASE_URL}/api/doctors/me`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
  });
}

// Complete patient profile (updates role and profile data)
export async function completePatientProfile(profileData, email, password) {
  try {
    // First login to get token
    const loginResponse = await loginUser({ email, password });
    
    if (!loginResponse.token) {
      throw new Error('Failed to authenticate user');
    }
    
    // Then update profile
    const updatedUser = await updateUserProfile({
      ...profileData,
      role: 'patient'
    }, loginResponse.token);
    
    return {
      user: updatedUser.user || loginResponse.user,
      token: loginResponse.token
    };
  } catch (error) {
    console.error('Error completing patient profile:', error);
    throw error;
  }
}

// Submit doctor application for verification
export async function submitDoctorApplication(doctorData, email, password) {
  try {
    // First login to get token
    const loginResponse = await loginUser({ email, password });
    
    if (!loginResponse.token) {
      throw new Error('Failed to authenticate user');
    }
    
    // Update basic profile with doctor role
    const basicProfile = {
      role: 'doctor',
      name: doctorData.fullName,
      sex: doctorData.gender,
      dateOfBirth: doctorData.dateOfBirth,
      location: doctorData.city
    };
    
    await updateUserProfile(basicProfile, loginResponse.token);
    
    // Create doctor profile with detailed information
    const doctorProfile = {
      specialty: doctorData.specialty,
      yearsOfExperience: doctorData.yearsOfExperience,
      clinicName: doctorData.clinicName,
      city: doctorData.city,
      about: doctorData.about,
      education: (doctorData.education || []).filter(e => e && e.trim()),
      experience: (doctorData.experience || []).filter(e => e && e.trim()),
      services: (doctorData.services || []).filter(s => s && s.trim()),
      languages: doctorData.languages || [],
      contactPhones: (doctorData.contactPhones || []).filter(p => p && p.trim()),
      contactEmails: (doctorData.contactEmails || []).filter(e => e && e.trim()),
      address: {
        line1: doctorData.addressLine1,
        line2: doctorData.addressLine2,
        city: doctorData.addressCity,
        state: doctorData.addressState,
        postalCode: doctorData.postalCode,
        country: doctorData.country
      },
      consultationFee: doctorData.consultationFee,
      keySpecialization: (doctorData.keySpecialization || []).filter(k => k && k.trim()),
      status: 'pending'
    };
    
    // Submit doctor profile for creation/verification
    await registerDoctor(doctorProfile, loginResponse.token);
    
    return {
      user: loginResponse.user,
      token: loginResponse.token,
      applicationSubmitted: true
    };
  } catch (error) {
    console.error('Error submitting doctor application:', error);
    throw error;
  }
}

// Search Functions
export async function searchDoctors(query, filters = {}) {
  const params = new URLSearchParams({
    search: query,
    ...filters,
  });

  return apiCall(`${API_BASE_URL}/api/doctors/search?${params}`, {
    method: "GET",
  });
}

export async function getDoctorById(doctorId) {
  return apiCall(`${API_BASE_URL}/api/doctors/${doctorId}`, {
    method: "GET",
  });
}

export async function addDoctorAward(doctorId, awardData, imageFile, token) {
  const formData = new FormData();
  formData.append('title', awardData.title);
  formData.append('year', awardData.year.toString());
  formData.append('institute', awardData.institute);
  
  if (imageFile) {
    formData.append('awardImage', imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}/awards`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to add award');
  }

  return response.json();
}

// Upload doctor gallery images
export async function uploadDoctorGallery(doctorId, imageFiles, token) {
  const formData = new FormData();
  Array.from(imageFiles).forEach(file => formData.append('images', file));

  const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}/gallery`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to upload gallery images');
  }

  return response.json();
}

// Appointment Functions
export async function bookAppointment(appointmentData, token) {
  return apiCall(`${API_BASE_URL}/api/appointments/book`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(appointmentData),
  });
}

export async function getMyAppointments(token) {
  return apiCall(`${API_BASE_URL}/api/appointments/mine`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateAppointmentStatus(appointmentId, status, token) {
  return apiCall(`${API_BASE_URL}/api/appointments/${appointmentId}/status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
}

// Content Functions
export async function getAllNews(params = {}) {
  const searchParams = new URLSearchParams(params);
  return apiCall(`${API_BASE_URL}/api/news?${searchParams}`, {
    method: "GET",
  });
}

export async function getNewsById(newsId) {
  return apiCall(`${API_BASE_URL}/api/news/${newsId}`, {
    method: "GET",
  });
}

export async function getAllBlogs(params = {}) {
  const searchParams = new URLSearchParams(params);
  return apiCall(`${API_BASE_URL}/api/blogs?${searchParams}`, {
    method: "GET",
  });
}

export async function getBlogById(blogId) {
  return apiCall(`${API_BASE_URL}/api/blogs/${blogId}`, {
    method: "GET",
  });
}

export async function searchNews(query, params = {}) {
  const searchParams = new URLSearchParams({ q: query, ...params });
  return apiCall(`${API_BASE_URL}/api/news/search?${searchParams}`, {
    method: "GET",
  });
}

export async function searchBlogs(query, params = {}) {
  const searchParams = new URLSearchParams({ q: query, ...params });
  return apiCall(`${API_BASE_URL}/api/blogs/search?${searchParams}`, {
    method: "GET",
  });
}
