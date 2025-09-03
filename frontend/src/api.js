import axios from "axios";

const isProd = import.meta.env.MODE === "production";
const BASE =
  import.meta.env.VITE_API_BASE ??
  (isProd
    ? "https://notes-app-1-a5nb.onrender.com/api"  // ✅ Render backend
    : "http://localhost:5000/api");                // ✅ local dev

export const api = axios.create({
  baseURL: BASE,
  timeout: 20000,
});
