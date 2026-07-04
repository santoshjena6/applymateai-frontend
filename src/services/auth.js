/**
 * src/services/auth.js
 * Lightweight helpers used by useAuth.js context provider.
 * Kept separate from api.js to avoid circular-import issues.
 */

"use client";

const USER_KEY          = "applync_user";
const TOKEN_KEY         = "applync_token";
const REFRESH_TOKEN_KEY = "applync_refresh_token";
const BASE_URL          = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

/**
 * Returns the current user object from localStorage, or null if not logged in.
 */
export const getCurrentUser = () => {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

/**
 * Calls the login API, stores tokens + user data, returns user object.
 * (The login page also calls authService.login() directly — this is
 *  used by the AuthProvider context for context-driven login flows.)
 */
export const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    const { token, refreshToken, email: userEmail, name, role, jobCategory } = data;
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    // jobCategory is null for new users; populated once they've uploaded a resume
    const user = { email: userEmail, name, role, jobCategory: jobCategory || null };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
};

/**
 * Clears all auth tokens and user data from localStorage.
 */
export const logout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};
