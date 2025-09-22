import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

// attach token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("cc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post("http://localhost:4000/api/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // { filename: 'uploaded-file.jpg' }
};

export default API;
