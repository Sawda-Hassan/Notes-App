// src/api.js
import axios from "axios";

// Make sure the environment variable name matches your .env
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Optional: test which backend is being used
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api");
