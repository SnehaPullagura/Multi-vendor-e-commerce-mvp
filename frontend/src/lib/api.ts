import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach Auth Token and Guest Session ID
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Guest Cart session tracking
      let sessionId = localStorage.getItem("cart_session_id");
      if (!sessionId) {
        sessionId = "sess_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        localStorage.setItem("cart_session_id", sessionId);
      }
      config.headers["X-Cart-Session-ID"] = sessionId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        // Optional token expiry redirect
      }
    }
    return Promise.reject(error);
  }
);
