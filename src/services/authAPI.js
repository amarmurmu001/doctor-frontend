const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function sendOtp({ email }) {
	const response = await fetch(`${API_BASE_URL}/api/otp/request`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ channel: 'email', destination: email })
	});
	if (!response.ok) throw new Error('Failed to send verification OTP');
	return response.json();
}

export async function updateUserProfile({ name, email, phone }, token) {
	const response = await fetch(`${API_BASE_URL}/api/auth/update`, {
		method: 'PUT',
		headers: { 
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ name, email, phone })
	});
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || 'Failed to update profile');
	}
	return response.json();
}

export async function verifyOtp({ email, otp }) {
	const response = await fetch(`${API_BASE_URL}/api/otp/verify`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ channel: 'email', destination: email, code: otp })
	});
	if (!response.ok) throw new Error('Invalid OTP');
	return response.json();
}

export async function resendOtp({ email }) {
	const response = await fetch(`${API_BASE_URL}/api/otp/request`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ channel: 'email', destination: email })
	});
	if (!response.ok) throw new Error('Please wait before requesting a new OTP');
	return response.json();
}

export async function registerUser(payload) {
	const body = {
		name: payload.name || payload.fullName,
		email: payload.email,
		password: payload.password,
		role: payload.role,
		phone: payload.phone,
	};
	const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!response.ok) throw new Error('Registration failed');
	return response.json();
}

export async function registerDoctor(payload) {
	const response = await fetch(`${API_BASE_URL}/api/doctors/me`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	if (!response.ok) throw new Error('Doctor registration failed');
	return response.json();
}

export async function loginUser({ email, password }) {
	const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});
	if (!response.ok) throw new Error('Login failed');
	return response.json();
}


