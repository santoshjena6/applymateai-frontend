'use client';

// Profile page — view and edit user profile details
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import {
    UserCircleIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    CalendarIcon,
    BriefcaseIcon,
    PhoneIcon,
    MapPinIcon,
    CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import { userService } from '@/services/api';
import { getErrorMessage } from '@/utils/errorMessage';

const SG = "'Special Gothic', sans-serif";
const SW = "'Switzer', sans-serif";
const dark = "#080b0f";
const gray = "#4b5b63";
const white = "#ffffff";
const borderCol = "#e8e8e8";

// jobType label map for the badge
const JOB_TYPE_LABELS = {
    IT:     'IT / Software',
    NON_IT: 'Non-IT',
};

const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 16,
    background: "#fcfcfc", border: `1px solid ${borderCol}`,
    fontFamily: SW, fontSize: 15, color: dark, outline: "none", transition: "all 0.2s",
};

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser]                   = useState({});
    const [name, setName]                   = useState('');
    const [phone, setPhone]                 = useState('');
    const [location, setLocation]           = useState('');
    const [expectedSalary, setExpectedSalary] = useState('');
    const [saving, setSaving]               = useState(false);
    const [saveMsg, setSaveMsg]             = useState('');
    const [saveErr, setSaveErr]             = useState('');

    useEffect(() => {
        const token = localStorage.getItem('applync_token');
        if (!token) { router.replace('/login'); return; }

        try {
            const stored = JSON.parse(localStorage.getItem('applync_user') || '{}');
            hydrate(stored);
        } catch {}

        userService.getProfile()
            .then((res) => {
                const fresh = res.data;
                hydrate(fresh);
                localStorage.setItem('applync_user', JSON.stringify(fresh));
            })
            .catch(() => {});
    }, [router]);

    const hydrate = (u) => {
        setUser(u);
        setName(u.name || '');
        setPhone(u.phone || '');
        setLocation(u.location || '');
        setExpectedSalary(u.expectedSalary || '');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) { setSaveErr('Name cannot be empty.'); return; }
        setSaving(true);
        setSaveMsg('');
        setSaveErr('');
        try {
            const payload = {
                name:           name.trim(),
                phone:          phone.trim() || null,
                location:       location.trim() || null,
                expectedSalary: expectedSalary.trim() || null,
            };
            const res = await userService.updateProfile(payload);
            const updated = { ...user, ...res.data };
            localStorage.setItem('applync_user', JSON.stringify(updated));
            setUser(updated);
            setSaveMsg('Profile updated successfully!');
        } catch (err) {
            setSaveErr(getErrorMessage(err, "profile"));
        } finally {
            setSaving(false);
            setTimeout(() => { setSaveMsg(''); setSaveErr(''); }, 3000);
        }
    };

    const avatarLetter = (user.name || user.email || 'U')[0].toUpperCase();
    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : null;

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: SW, background: "linear-gradient(to bottom, #d5ecfa, #e9f2f9)" }}>
            <Sidebar />

            <main style={{ flex: 1, padding: "40px 48px", marginLeft: "256px" }} className="lg:ml-64 p-6 lg:p-8">
                {/* ── Page Header ── */}
                <header style={{ marginBottom: 40 }}>
                    <button
                        onClick={() => router.push('/dashboard')}
                        style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: gray, fontFamily: SW, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "color 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.color = dark}
                        onMouseLeave={e => e.currentTarget.style.color = gray}
                    >
                        <ArrowLeftIcon className="w-4 h-4 stroke-[2.5]" />
                        <span>Back to Dashboard</span>
                    </button>
                </header>

                <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

                    {/* ── Profile Info Card ── */}
                    <div style={{ background: white, borderRadius: 24, padding: 32, border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 10px 40px rgba(0,0,0,0.04)" }}>
                        {/* Avatar + name + email row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
                            <div style={{ width: 80, height: 80, borderRadius: 24, background: dark, color: white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SG, fontSize: 32, fontWeight: 800, boxShadow: "0 8px 24px rgba(8,11,15,0.2)" }}>
                                {avatarLetter}
                            </div>
                            <div>
                                <h2 style={{ fontFamily: SG, fontSize: 32, fontWeight: 800, color: dark, letterSpacing: "-1px", marginBottom: 4 }}>
                                    {user.name || 'Your Name'}
                                </h2>
                                <p style={{ fontSize: 15, color: gray, fontWeight: 500 }}>{user.email || '—'}</p>
                            </div>
                        </div>

                        {/* Info rows */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {/* Email */}
                            <InfoRow icon={<EnvelopeIcon style={{ width: 20, height: 20, color: gray }} />} label="Email" value={user.email || '—'} />

                            {/* Phone */}
                            {user.phone && <InfoRow icon={<PhoneIcon style={{ width: 20, height: 20, color: gray }} />} label="Phone" value={user.phone} />}

                            {/* Location */}
                            {user.location && <InfoRow icon={<MapPinIcon style={{ width: 20, height: 20, color: gray }} />} label="Location" value={user.location} />}

                            {/* Expected Salary */}
                            {user.expectedSalary && <InfoRow icon={<CurrencyRupeeIcon style={{ width: 20, height: 20, color: gray }} />} label="Expected Salary" value={user.expectedSalary} />}

                            {/* Job type */}
                            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 16, background: "#f8fafc", border: `1px solid ${borderCol}` }}>
                                <BriefcaseIcon style={{ width: 20, height: 20, color: gray }} />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                                    <div>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: gray, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Job Type</p>
                                        <p style={{ fontSize: 15, fontWeight: 600, color: dark }}>
                                            {JOB_TYPE_LABELS[user.jobType] || user.jobType || '—'}
                                        </p>
                                    </div>
                                    {user.jobType && (
                                        <span style={{ padding: "6px 12px", borderRadius: 999, background: "#e9f2f9", color: "#3a7ca5", fontSize: 12, fontWeight: 800 }}>
                                            {JOB_TYPE_LABELS[user.jobType] || user.jobType}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Member since */}
                            {memberSince && (
                                <InfoRow icon={<CalendarIcon style={{ width: 20, height: 20, color: gray }} />} label="Member Since" value={memberSince} />
                            )}
                        </div>
                    </div>

                    {/* ── Edit Profile Form ── */}
                    <div style={{ background: white, borderRadius: 24, padding: 32, border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 10px 40px rgba(0,0,0,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                            <UserCircleIcon style={{ width: 24, height: 24, color: dark }} />
                            <h3 style={{ fontFamily: SG, fontSize: 24, fontWeight: 800, color: dark, letterSpacing: "-0.5px" }}>Edit Profile</h3>
                        </div>

                        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {/* Name */}
                            <FormField label="Full Name" required>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                    style={inputStyle}
                                    onFocus={(e) => { e.target.style.borderColor = dark; e.target.style.background = white; }}
                                    onBlur={(e)  => { e.target.style.borderColor = borderCol; e.target.style.background = "#fcfcfc"; }}
                                />
                            </FormField>

                            {/* Email — read-only */}
                            <FormField label="Email Address" hint="(read-only)">
                                <input
                                    type="email"
                                    value={user.email || ''}
                                    readOnly
                                    style={{ ...inputStyle, background: "#f8fafc", color: gray, cursor: "not-allowed" }}
                                />
                            </FormField>

                            {/* Phone */}
                            <FormField label="Phone Number" hint="(optional)">
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    style={inputStyle}
                                    onFocus={(e) => { e.target.style.borderColor = dark; e.target.style.background = white; }}
                                    onBlur={(e)  => { e.target.style.borderColor = borderCol; e.target.style.background = "#fcfcfc"; }}
                                />
                            </FormField>

                            {/* Location */}
                            <FormField label="Location" hint="(optional)">
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. Bangalore, India"
                                    style={inputStyle}
                                    onFocus={(e) => { e.target.style.borderColor = dark; e.target.style.background = white; }}
                                    onBlur={(e)  => { e.target.style.borderColor = borderCol; e.target.style.background = "#fcfcfc"; }}
                                />
                            </FormField>

                            {/* Expected Salary */}
                            <FormField label="Expected Salary" hint="(optional)">
                                <input
                                    type="text"
                                    value={expectedSalary}
                                    onChange={(e) => setExpectedSalary(e.target.value)}
                                    placeholder="e.g. ₹8 LPA or $80,000/yr"
                                    style={inputStyle}
                                    onFocus={(e) => { e.target.style.borderColor = dark; e.target.style.background = white; }}
                                    onBlur={(e)  => { e.target.style.borderColor = borderCol; e.target.style.background = "#fcfcfc"; }}
                                />
                            </FormField>

                            {/* Success */}
                            {saveMsg && (
                                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 12, background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0", fontSize: 14, fontWeight: 600 }}>
                                    <CheckCircleIcon style={{ width: 18, height: 18 }} />
                                    <span>{saveMsg}</span>
                                </div>
                            )}

                            {/* Error */}
                            {saveErr && (
                                <div style={{ padding: "12px 16px", borderRadius: 12, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", fontSize: 14, fontWeight: 600 }}>
                                    {saveErr}
                                </div>
                            )}

                            {/* Save button */}
                            <button
                                type="submit"
                                disabled={saving}
                                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "14px 24px", borderRadius: 999, background: dark, color: white, fontFamily: SW, fontSize: 15, fontWeight: 700, border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, transition: "all 0.2s", boxShadow: "0 4px 12px rgba(8,11,15,0.2)", marginTop: 8 }}
                                onMouseEnter={e => { if(!saving){ e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(8,11,15,0.3)"; } }}
                                onMouseLeave={e => { if(!saving){ e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(8,11,15,0.2)"; } }}
                            >
                                {saving ? (
                                    <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: white, borderRadius: "50%" }} className="animate-spin" />
                                ) : (
                                    <CheckCircleIcon style={{ width: 20, height: 20 }} />
                                )}
                                <span>{saving ? 'Saving…' : 'Save Changes'}</span>
                            </button>
                        </form>
                    </div>

                    {/* ── Account Section ── */}
                    <div style={{ background: white, borderRadius: 24, padding: 32, border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 10px 40px rgba(0,0,0,0.04)" }}>
                        <h3 style={{ fontFamily: SG, fontSize: 24, fontWeight: 800, color: dark, letterSpacing: "-0.5px", marginBottom: 24 }}>Account</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {memberSince && (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: `1px solid ${borderCol}` }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: gray }}>Member since</span>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: dark }}>{memberSince}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: `1px solid ${borderCol}` }}>
                                <span style={{ fontSize: 14, fontWeight: 600, color: gray }}>Account status</span>
                                <span style={{ padding: "4px 12px", borderRadius: 999, background: "#ecfdf5", color: "#059669", fontSize: 12, fontWeight: 800 }}>Active</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 14, fontWeight: 600, color: gray }}>Plan</span>
                                <span style={{ fontSize: 14, fontWeight: 800, color: dark }}>Free</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 16, background: "#f8fafc", border: `1px solid #e8e8e8` }}>
            {icon}
            <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#4b5b63", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#080b0f" }}>{value}</p>
            </div>
        </div>
    );
}

function FormField({ label, hint, required, children }) {
    return (
        <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#080b0f", marginBottom: 8 }}>
                {label}{' '}
                {hint && <span style={{ color: "#4b5b63", fontWeight: 500 }}>{hint}</span>}
                {required && <span style={{ color: "#dc2626" }}> *</span>}
            </label>
            {children}
        </div>
    );
}
