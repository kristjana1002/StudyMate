const API_BASE = "http://localhost:3000/api";

type SignupData = { username: string; email: string; password: string };
type LoginData = { email: string; password: string };

const buildHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
});

export const signupUser = async (data: SignupData) => {
  const res = await fetch(`${API_BASE}/users/signup`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || json?.message || "Signup failed");
  return json;
};

export const loginUser = async (data: LoginData) => {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || json?.message || "Login failed");
  return json as { token: string; user: { id: string; username: string; email: string } };
};

export const setToken = (token: string) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const clearToken = () => localStorage.removeItem("token");

export const authedGet = async <T,>(path: string): Promise<T> => {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || json?.message || "Request failed");
  return json as T;
};

