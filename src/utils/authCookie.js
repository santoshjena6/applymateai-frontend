// Auth cookie helpers — used alongside localStorage tokens.
// Middleware reads this cookie to protect routes server-side.
// The actual JWT stays in localStorage; this is just a presence flag.

export function setAuthCookie() {
    // 7 days, same as refresh token
    document.cookie = "applync_auth=1; path=/; max-age=604800; SameSite=Lax";
}

export function clearAuthCookie() {
    document.cookie = "applync_auth=; path=/; max-age=0; SameSite=Lax";
}
