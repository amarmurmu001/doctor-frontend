const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function sendOtp({ email }) {
	const response = await fetch(`${API_BASE_URL}/auth/send-verification-otp`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email })
	});
	if (!response.ok) throw new Error('Failed to send verification OTP');
	return response.json();
}

export async function verifyOtp({ email, otp }) {
	const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, otp })
	});
	if (!response.ok) throw new Error('Invalid OTP');
	return response.json();
}

export async function resendOtp({ email }) {
	const response = await fetch(`${API_BASE_URL}/auth/resend-verification-otp`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email })
	});
	if (!response.ok) throw new Error('Please wait before requesting a new OTP');
	return response.json();
}

export async function registerUser(payload) {
	const response = await fetch(`${API_BASE_URL}/auth/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	if (!response.ok) throw new Error('Registration failed');
	return response.json();
}

export async function registerDoctor(payload) {
	const response = await fetch(`${API_BASE_URL}/doctor/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	if (!response.ok) throw new Error('Doctor registration failed');
	return response.json();
}

export async function loginUser({ email, password }) {
	const response = await fetch(`${API_BASE_URL}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});
	if (!response.ok) throw new Error('Login failed');
	return response.json();
}


