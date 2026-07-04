/**
 * getErrorMessage — converts raw Axios errors into user-friendly messages.
 * Use this everywhere instead of err.message or err.response?.data?.message directly.
 */

// Map HTTP status codes to friendly messages
const STATUS_MESSAGES = {
    400: "Invalid details. Please check your inputs and try again.",
    401: "Your session has expired. Please sign in again.",
    403: "You don't have permission to do this. Please sign in again.",
    404: "We couldn't find what you're looking for. Please try again.",
    409: "This account already exists. Try logging in instead.",
    413: "File is too large. Please upload a file under 5 MB.",
    422: "Some details are invalid. Please review and try again.",
    429: "Too many attempts. Please wait a moment and try again.",
    500: "Something went wrong on our end. Please try again shortly.",
    502: "Service is temporarily unavailable. Please try again later.",
    503: "Service is temporarily unavailable. Please try again later.",
    504: "The server took too long to respond. Please try again.",
};

// Context-specific overrides — pass a context string for better messages
const CONTEXT_MESSAGES = {
    login: {
        401: "Incorrect email or password. Please try again.",
        403: "Your account has been disabled. Please contact support.",
    },
    register: {
        409: "An account with this email already exists. Try logging in.",
        400: "Please fill in all fields correctly.",
    },
    upload: {
        400: "Invalid file. Please upload a PDF or DOCX file.",
        403: "Your session has expired. Please sign in and try again.",
        413: "File is too large. Please upload a file under 5 MB.",
        500: "Resume processing failed. Please try a different file.",
    },
    profile: {
        400: "Invalid name. Please enter a valid name.",
        403: "Session expired. Please sign in again.",
    },
    delete: {
        404: "Application not found — it may have already been deleted.",
        403: "You don't have permission to delete this application.",
    },
};

export function getErrorMessage(err, context = "") {
    // Network error — no response at all (backend not running / no internet)
    if (!err.response) {
        if (err.message === "Network Error" || err.code === "ERR_NETWORK") {
            return "Unable to connect. Please check your internet connection or try again later.";
        }
        if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
            return "Request timed out. Please check your connection and try again.";
        }
        return "Something went wrong. Please try again.";
    }

    const status = err.response?.status;

    // Check context-specific overrides first
    if (context && CONTEXT_MESSAGES[context]?.[status]) {
        return CONTEXT_MESSAGES[context][status];
    }

    // Map known raw Spring Security / backend messages to friendly ones
    const backendMsg = err.response?.data?.message || err.response?.data?.error || "";
    const lowerMsg = backendMsg.toLowerCase();
    if (lowerMsg.includes("bad credentials"))        return "Incorrect email or password. Please try again.";
    if (lowerMsg.includes("user not found"))         return "No account found with this email. Please register first.";
    if (lowerMsg.includes("account disabled"))       return "Your account has been disabled. Please contact support.";
    if (lowerMsg.includes("account locked"))         return "Your account is locked. Please contact support.";
    if (lowerMsg.includes("token expired"))          return "Your session has expired. Please sign in again.";
    if (lowerMsg.includes("already exists"))         return "An account with this email already exists. Try logging in.";

    // Use backend message if it's clean and readable (not a Java stack trace)
    if (backendMsg && typeof backendMsg === "string" && backendMsg.length < 120 && !backendMsg.includes("Exception")) {
        return backendMsg;
    }

    // Fall back to status code map
    return STATUS_MESSAGES[status] || "Something went wrong. Please try again.";
}
