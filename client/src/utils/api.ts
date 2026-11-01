import type { CurrentUser } from "../types";

const BASE_URL = "/api";

export type KnowledgeDoc = {
  _id: string;
  title: string;
  fileName: string;
  userId: string;
  createdAt: string;
};

export type Chat = {
  _id: string;
  title: string;
  userId: string;
  createdAt: string;
};

export type Message = {
  _id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: { message: string } | null;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("auth-token") ?? "";
  const isAuthFormRequest = path === `${BASE_URL}/auth/login` || path === `${BASE_URL}/auth/register`;
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(!isAuthFormRequest && token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message || "Invalid credentials";
    if (!isAuthFormRequest && token) {
      localStorage.removeItem("auth-token");
      window.location.href = "/login";
    }
    throw new Error(message);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Request failed");
  }

  return res.json() as Promise<ApiResponse<T>>;
}

export function getCurrentUser() {
  return request<CurrentUser>(`${BASE_URL}/users/me`);
}

export function registerUser(name: string, email: string, password: string) {
  return request<CurrentUser>(`${BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginUser(email: string, password: string) {
  return request<{ token: string; user: CurrentUser }>(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export const getDocuments = (): Promise<ApiResponse<KnowledgeDoc[]>> => {
  return request<KnowledgeDoc[]>(`${BASE_URL}/documents`);
};

export const uploadDocument = async (file: File): Promise<ApiResponse<KnowledgeDoc>> => {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("auth-token") ?? "";
  const res = await fetch(`${BASE_URL}/documents`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message || "Session expired";
    if (token) {
      localStorage.removeItem("auth-token");
      window.location.href = "/login";
    }
    throw new Error(message);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Document upload failed");
  }

  return res.json() as Promise<ApiResponse<KnowledgeDoc>>;
};

export const getChats = (): Promise<ApiResponse<Chat[]>> =>
  request<Chat[]>(`${BASE_URL}/chats`);

export const getChat = (
  id: string,
): Promise<ApiResponse<{ chat: Chat; messages: Message[] }>> =>
  request<{ chat: Chat; messages: Message[] }>(`${BASE_URL}/chats/${encodeURIComponent(id)}`);

export const createChat = (title: string): Promise<ApiResponse<Chat>> =>
  request<Chat>(`${BASE_URL}/chats`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });

export const sendMessage = (
  chatId: string,
  question: string,
): Promise<ApiResponse<Message[]>> =>
  request<Message[]>(`${BASE_URL}/chats/${encodeURIComponent(chatId)}/messages`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
