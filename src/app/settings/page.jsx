"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import {
    KeyIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    ArrowRightOnRectangleIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    EyeSlashIcon,
} from "@heroicons/react/24/outline";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState({ name: "", email: "", role: "" });
    const [isOAuth, setIsOAuth] = useState(false);

    // Change password state
    const [currentPw, setCurrentPw]   = useState("");
    const [newPw, setNewPw]           = useState("");
    const [confirmPw, setConfirmPw]   = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew]       = useState(false);
    const [pwLoading, setPwLoading]   = useState(false);
    const [pwSuccess, setPwSuccess]   = useState("");
    const [pwError, setPwError]       = useState("");

    useEffect(() => {
        const token = localStorage.getItem("applync_token");
        if (!token) { router.replace("/login"); return; }

        try {
            const stored = JSON.parse(localStorage.getItem("applync_user") || "{}");
            setUser(stored);
            // Google OAuth2 users have OAUTH2_NO_PASSWORD — detect via profile API
        } catch {}

        // Fetch profile to check if OAuth2 user
        fetch(`${BASE_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                setUser(data);
                // If no password field or password is the OAuth2 sentinel, mark as OAuth2
                setIsOAuth(!!data.oauthUser);
            })
            .catch(() => {});
    }, [router]);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwError("");
        setPwSuccess("");

        if (newPw !== confirmPw) { setPwError("New passwords do not match."); return; }
        if (newPw.length < 6)    { setPwError("New password must be at least 6 characters."); return; }

        setPwLoading(true);
        try {
            const token = localStorage.getItem("applync_token");
            const res = await fetch(`${BASE_URL}/user/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to change password.");
            setPwSuccess("Password changed successfully!");
            setCurrentPw(""); setNewPw(""); setConfirmPw("");
        } catch (err) {
            setPwError(err.message || "Something went wrong.");
        } finally {
            setPwLoading(false);
            setTimeout(() => { setPwSuccess(""); setPwError(""); }, 4000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("applync_token");
        localStorage.removeItem("applync_refresh_token");
        localStorage.removeItem("applync_user");
        router.replace("/login");
    };

    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-6 lg:p-10 max-w-3xl mx-auto w-full">

                {/* Header */}
                <div className="mb-8 mt-4">
                    <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
                    <p className="text-text-secondary mt-1">Manage your account security and preferences.</p>
                </div>

                {/* ── Account Info ── */}
                <section className="bg-surface rounded-2xl border border-border-color p-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <UserCircleIcon className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-text-primary">Account</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-background rounded-xl p-4 border border-border-color">
                            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Name</p>
                            <p className="font-semibold text-text-primary">{user.name || "—"}</p>
                        </div>
                        <div className="bg-background rounded-xl p-4 border border-border-color">
                            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Email</p>
                            <p className="font-semibold text-text-primary truncate">{user.email || "—"}</p>
                        </div>
                        <div className="bg-background rounded-xl p-4 border border-border-color">
                            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Role</p>
                            <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg">
                                {user.role || "USER"}
                            </span>
                        </div>
                        <div className="bg-background rounded-xl p-4 border border-border-color">
                            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Sign-in method</p>
                            <p className="font-semibold text-text-primary">{isOAuth ? "Google OAuth2" : "Email & Password"}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push("/profile")}
                        className="mt-4 text-sm text-primary hover:underline font-medium"
                    >
                        Edit profile →
                    </button>
                </section>

                {/* ── Change Password ── */}
                <section className="bg-surface rounded-2xl border border-border-color p-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <KeyIcon className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-text-primary">Change Password</h2>
                    </div>

                    {isOAuth ? (
                        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-amber-700">
                                Your account uses Google Sign-In. Password change is not available — you sign in through Google.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            {/* Current password */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        value={currentPw}
                                        onChange={e => setCurrentPw(e.target.value)}
                                        required
                                        placeholder="Enter current password"
                                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border-color bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                    <button type="button" onClick={() => setShowCurrent(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                                        {showCurrent ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* New password */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={newPw}
                                        onChange={e => setNewPw(e.target.value)}
                                        required
                                        minLength={6}
                                        placeholder="Min. 6 characters"
                                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border-color bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                    <button type="button" onClick={() => setShowNew(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                                        {showNew ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPw}
                                    onChange={e => setConfirmPw(e.target.value)}
                                    required
                                    placeholder="Re-enter new password"
                                    className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>

                            {/* Feedback */}
                            {pwSuccess && (
                                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                    <CheckCircleIcon className="w-4 h-4 shrink-0" /> {pwSuccess}
                                </div>
                            )}
                            {pwError && (
                                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                    <ExclamationTriangleIcon className="w-4 h-4 shrink-0" /> {pwError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={pwLoading}
                                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
                            >
                                {pwLoading ? "Updating…" : "Update Password"}
                            </button>
                        </form>
                    )}
                </section>

                {/* ── Security ── */}
                <section className="bg-surface rounded-2xl border border-border-color p-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ShieldCheckIcon className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-text-primary">Security</h2>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border-color">
                        <div>
                            <p className="text-sm font-medium text-text-primary">Active session</p>
                            <p className="text-xs text-text-secondary mt-0.5">You are currently logged in on this device.</p>
                        </div>
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                            Active
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm font-medium text-text-primary">Token expiry</p>
                            <p className="text-xs text-text-secondary mt-0.5">Access tokens expire every 15 minutes and auto-refresh.</p>
                        </div>
                        <span className="text-xs text-text-secondary font-medium">15 min</span>
                    </div>
                </section>

                {/* ── Danger Zone ── */}
                <section className="bg-surface rounded-2xl border border-red-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                            <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-text-primary">Sign Out</h2>
                    </div>
                    <p className="text-sm text-text-secondary mb-4">
                        This will clear your session and tokens from this device.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                        Sign out
                    </button>
                </section>

            </main>
        </div>
    );
}
