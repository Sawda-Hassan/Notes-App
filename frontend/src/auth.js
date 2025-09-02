import { api } from "./api";

const TOKEN_KEY = "token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => { localStorage.setItem(TOKEN_KEY, t); api.defaults.headers.common.Authorization = `Bearer ${t}`; };
export const clearToken = () => { localStorage.removeItem(TOKEN_KEY); delete api.defaults.headers.common.Authorization; };

// hydrate axios on load
const existing = getToken();
if (existing) api.defaults.headers.common.Authorization = `Bearer ${existing}`;
