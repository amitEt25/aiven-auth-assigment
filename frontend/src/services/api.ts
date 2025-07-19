import axios from "axios";
import { LoginData, RegisterData, AuthResponse, UsersResponse } from "../types";

const API_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if we're not already on login page
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  getProfile: async (): Promise<{ user: any }> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};

export const usersAPI = {
  getAllUsers: async (): Promise<UsersResponse> => {
    const response = await api.get("/users");
    return response.data;
  },
};

export default api;
