import axios from "axios";

// Axios instance for API calls
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Optional: check which backend is being used
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api");
