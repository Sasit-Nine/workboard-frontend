import axios from "axios";

export const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_AUTH,
});

export const coreClient = axios.create({
  baseURL: import.meta.env.VITE_API_CORE,
});

coreClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});