const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function sendOtp({ phone, email }) {
	const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ phone, email })
	});
	if (!response.ok) throw new Error('Failed to send OTP');
	return response.json();
}

export async function verifyOtp({ phone, email, code }) {
	const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ phone, email, code })
	});
	if (!response.ok) throw new Error('Invalid OTP');
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

export async function loginUser({ identifier, password }) {
	const response = await fetch(`${API_BASE_URL}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identifier, password })
	});
	if (!response.ok) throw new Error('Login failed');
	return response.json();
}


