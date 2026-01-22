// Functions to call backend APIs
export const fetchData = async () => {
  // Example API call
  return await fetch('/api/data').then(res => res.json());
};

const API_URL = 'http://localhost:3000/api/users';

export const signupUser = async (data: { username: string; email: string; password: string }) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
