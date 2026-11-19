// Shared axios setup: sends the login token with every request and
// sends the user back to the login page when the token is no longer valid.
import axios from "axios";

axios.defaults.timeout = 15000;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = /\/api\/(login|register)/.test(error.config?.url || "");
    if (error.response?.status === 401 && !isAuthCall) {
      ["token", "userId", "phoneNumber", "role"].forEach((k) => localStorage.removeItem(k));
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const API_BASE = process.env.REACT_APP_BACKENDURL || "";
