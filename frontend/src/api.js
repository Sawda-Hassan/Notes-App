import axios from "axios";

// Use Vite env if set, else localhost
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const api = axios.create({ baseURL: BASE });
