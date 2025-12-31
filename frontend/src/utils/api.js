import axios from "axios";

// Use relative URL in production (works with Nginx proxy), absolute URL in development
const API_BASE_URL =
  process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api');

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// attach token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("cc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper to get the base origin (without /api) for WebSocket
export const getSocketBaseUrl = () => {
  // If using relative URL (/api), use window.location.origin for WebSocket
  if (API_BASE_URL.startsWith('/')) {
    return window.location.origin;
  }
  // e.g. "http://localhost:4000/api" -> "http://localhost:4000"
  return API_BASE_URL.replace(/\/api\/?$/, "");
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Get the base URL for uploads (use API instance to include auth token)
  const uploadBaseUrl = API_BASE_URL.startsWith('/') 
    ? window.location.origin 
    : API_BASE_URL.replace(/\/api\/?$/, "");
  
  const token = localStorage.getItem("cc_token");
  const headers = { "Content-Type": "multipart/form-data" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await axios.post(
    `${uploadBaseUrl}/api/uploads`,
    formData,
    { headers }
  );

  return res.data; // { url, filename }
};

export default API;
