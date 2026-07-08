/**
 * src/services/api.js
 * Central Axios instance + all domain service objects.
 * Calls Spring Boot backend at http://localhost:8080/api
 * Token keys: "applync_token" (access) | "applync_refresh_token" (refresh) | "applync_user"
 */

import axios from "axios";

const TOKEN_KEY         = "applync_token";
const REFRESH_TOKEN_KEY = "applync_refresh_token";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
    headers: { "Content-Type": "application/json" },
    withCredentials: false,
});

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log(`API ${config.method?.toUpperCase()} -> ${config.baseURL}${config.url}`);
    return config;
});

// Queue for requests that come in while a token refresh is in progress
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
    failedQueue = [];
};

const clearAuthAndRedirect = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem("applync_user");
    // Clear the middleware auth cookie so protected routes block immediately
    if (typeof document !== "undefined") {
        document.cookie = "applync_auth=; path=/; max-age=0; SameSite=Lax";
    }
    if (typeof window !== "undefined") window.location.href = "/login";
};

// 401 -> try refresh token -> retry original request -> else redirect to login
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        // Only attempt refresh on 401, and only once per request
        if (err.response?.status === 401 && !originalRequest._retry && typeof window !== "undefined") {
            // If a refresh is already in progress, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((e) => Promise.reject(e));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
            if (!refreshToken) {
                isRefreshing = false;
                clearAuthAndRedirect();
                return Promise.reject(err);
            }

            try {
                // Call refresh endpoint directly (bypass the interceptor to avoid loop)
                const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
                const response = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken });
                const { token: newToken, refreshToken: newRefreshToken } = response.data;

                localStorage.setItem(TOKEN_KEY, newToken);
                localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
                api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                clearAuthAndRedirect();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        console.warn(`API Error ${err.response?.status || "NETWORK"} <- ${err.config?.url}`, err.response?.data || err.message);
        return Promise.reject(err);
    }
);

// Auth - POST /api/auth/*
export const authService = {
    login:      (email, password)                      => api.post("/auth/login",      { email, password }),
    register:   (name, email, password, jobType)       => api.post("/auth/register",   { name, email, password, jobType }),
    verifyOtp:  (email, otp)                           => api.post("/auth/verify-otp", { email, otp }),
    resendOtp:  (email)                                => api.post("/auth/resend-otp", { email }),
    getMe:      ()                                     => api.get("/user/profile"),
};

// Resume - /api/resume/*
export const resumeService = {
    uploadResume: (file) => {
        const form = new FormData();
        form.append("file", file);
        return api.post("/resume/upload", form, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 60000,
        });
    },
    getLatestResume: () => api.get("/resume/all").then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
            return { data: res.data[0] };
        }
        return res;
    }),
};

// Jobs - /api/jobs/*
export const jobService = {
    searchJobs:     (query, location, category, experience, page = 0) =>
        api.get("/jobs/search", { params: { query, location, category, experience, page } }),
    getMatchedJobs: () => api.get("/jobs/matched"),
};

// Applications - /api/v1/applications/*
export const applicationService = {
    getAll:       ()           => api.get("/applications"),
    create:       (data)       => api.post("/applications", data),
    updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
    getStats:     ()           => api.get("/applications/stats"),
    delete:       (id)         => api.delete(`/applications/${id}`),
};

// User profile - /api/v1/user/profile
export const userService = {
    getProfile:    ()     => api.get("/user/profile"),
    updateProfile: (data) => api.put("/user/profile", data),
};

export default api;
