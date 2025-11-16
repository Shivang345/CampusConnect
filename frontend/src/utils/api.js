import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000/api";

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
  // e.g. "http://localhost:4000/api" -> "http://localhost:4000"
  return API_BASE_URL.replace(/\/api\/?$/, "");
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${API_BASE_URL.replace(/\/api\/?$/, "")}/api/uploads`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data; // { url, filename }
};

export default API;
