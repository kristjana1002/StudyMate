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
  if (!res.ok) {
    throw new Error(json?.error || json?.message || "Signup failed");
  }

  return json;
};

export const loginUser = async (data: LoginData) => {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || json?.message || "Login failed");
  }

  return json as {
    token: string;
    user: { id: string; username: string; email: string };
  };
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
  if (!res.ok) {
    throw new Error(json?.error || json?.message || "Request failed");
  }

  return json as T;
};

export async function uploadNote(file: File, title: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);

  const token = getToken();

  const res = await fetch(`${API_BASE}/notes/upload`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || json?.message || "Upload failed");
  }

  return json as {
    noteId: string;
    title: string;
    summary?: string;
  };
}

export const getNoteById = async (id: string) => {
  return authedGet<{
    id: string;
    title: string;
    summary: string;
    created_at: string;
  }>(`/notes/${id}`);
};

export async function getQuiz(quizId: string) {
  return authedGet<{
    id: string;
    topic: string;
    quizType: string;
    questions: any[];
  }>(`/quizzes/${quizId}`);
}

export async function generateQuiz(payload: {
  noteId?: string;
  subjectId?: string;
  topic: string;
  quizType: "mcq" | "short";
  count?: number;
}) {
  const token = getToken();

  const res = await fetch(`${API_BASE}/quizzes/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || json?.message || "Generate quiz failed");
  }

  return json as {
    quizId: string;
    topic: string;
    quizType: string;
    questions: any[];
  };
}

export async function submitQuiz(
  quizId: string,
  answers: { id: string; answerIndex?: number; text?: string }[]
) {
  const token = getToken();

  const res = await fetch(`${API_BASE}/quizzes/${quizId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ answers }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || json?.message || "Submit quiz failed");
  }

  return json as {
    attemptId: string;
    score: number;
    total: number;
    feedback: any[];
  };
}

export async function sendChatMessage(message: string, topic?: string) {
  const token = getToken();

  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, topic }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || json?.message || "Chat failed");
  }

  return json as { reply: string };
}

export async function generateFlashcards(payload: {
  topic: string;
  noteId?: string;
  count?: number;
}) {
  const token = getToken();

  const res = await fetch(`${API_BASE}/flashcards/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || json?.message || "Generate flashcards failed");
  }

  return json as {
    topic: string;
    cards: { id: string; question: string; answer: string }[];
  };
}