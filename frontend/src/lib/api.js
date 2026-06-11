import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dr_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Separate client for the Brand Portal (own token, never mixed with admin)
export const brandApi = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

brandApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("dr_brand_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function formatApiError(detail) {
  if (detail == null) return "Bir hata oluştu. Lütfen tekrar deneyin.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}
