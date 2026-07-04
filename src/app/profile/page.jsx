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
} from '@heroicons/react/24/outline';
import { userService } from '@/services/api';
import { getErrorMessage } from '@/utils/errorMessage';

// jobType label map for the badge
const JOB_TYPE_LABELS = {
    IT:     'IT / Software',
    NON_IT: 'Non-IT',
};

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser]         = useState({});
    const [name, setName]         = useState('');
    const [saving, setSaving]     = useState(false);
    const [saveMsg, setSaveMsg]   = useState('');
    const [saveErr, setSaveErr]   = useState('');

    useEffect(() => {
        // Auth guard — redirect if no token
        const token = localStorage.getItem('applync_token');
        if (!token) { router.replace('/login'); return; }

        // Seed from localStorage immediately so UI isn't blank while API loads
        try {
            const stored = JSON.parse(localStorage.getItem('applync_user') || '{}');
            setUser(stored);
            setName(stored.name || '');
        } catch {}

        // GET /api/v1/user/profile — fetch fresh data from backend
        userService.getProfile()
            .then((res) => {
                const fresh = res.data;
                setUser(fresh);
                setName(fresh.name || '');
                // Keep localStorage in sync with backend
                localStorage.setItem('applync_user', JSON.stringify(fresh));
            })
            .catch(() => {
                // Backend unavailable — localStorage values already set above, just continue
            });
    }, [router]);

    // Save updated name to backend and sync localStorage
    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) { setSaveErr('Name cannot be empty.'); return; }
        setSaving(true);
        setSaveMsg('');
        setSaveErr('');
        try {
            // PUT /api/v1/user/profile
            const res = await userService.updateProfile({ name: name.trim() });
            // Merge returned data back into localStorage user object
            const updated = { ...user, ...res.data, name: name.trim() };
            localStorage.setItem('applync_user', JSON.stringify(updated));
            setUser(updated);
            setSaveMsg('Profile updated successfully!');
        } catch (err) {
            setSaveErr(getErrorMessage(err, "profile"));
        } finally {
            setSaving(false);
            // Auto-clear status messages after 3s
            setTimeout(() => { setSaveMsg(''); setSaveErr(''); }, 3000);
        }
    };

    // Avatar initial — first letter of name or email
    const avatarLetter = (user.name || user.email || 'U')[0].toUpperCase();

    // Format createdAt date if available
    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : null;

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-6 lg:p-8">
                {/* ── Page Header ── */}
                <header className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center space-x-1.5 text-sm font-medium transition-colors hover:text-indigo-600"
                        style={{ color: '#6B7280' }}
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </button>
                </header>

                <div className="max-w-2xl space-y-6">
                    {/* ── Profile Info Card ── */}
                    <div
                        className="bg-white rounded-2xl p-6"
                        style={{ border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                    >
                        {/* Avatar + name + email row */}
                        <div className="flex items-center space-x-4 mb-6">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white brand-gradient shrink-0"
                            >
                                {avatarLetter}
                            </div>
                            <div>
                                <h2 className="text-xl font-black" style={{ color: '#111827' }}>
                                    {user.name || 'Your Name'}
                                </h2>
                                <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{user.email || '—'}</p>
                            </div>
                        </div>

                        {/* Info rows */}
                        <div className="space-y-3">
                            {/* Email — read-only */}
                            <div
                                className="flex items-center space-x-3 px-4 py-3 rounded-xl"
                                style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}
                            >
                                <EnvelopeIcon className="w-4 h-4 shrink-0" style={{ color: '#9CA3AF' }} />
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Email</p>
                                    <p className="text-sm font-medium" style={{ color: '#111827' }}>{user.email || '—'}</p>
                                </div>
                            </div>

                            {/* Job type badge */}
                            <div
                                className="flex items-center space-x-3 px-4 py-3 rounded-xl"
                                style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}
                            >
                                <BriefcaseIcon className="w-4 h-4 shrink-0" style={{ color: '#9CA3AF' }} />
                                <div className="flex items-center justify-between w-full">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Job Type</p>
                                        <p className="text-sm font-medium" style={{ color: '#111827' }}>
                                            {JOB_TYPE_LABELS[user.jobType] || user.jobType || '—'}
                                        </p>
                                    </div>
                                    {user.jobType && (
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-semibold"
                                            style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
                                        >
                                            {JOB_TYPE_LABELS[user.jobType] || user.jobType}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Member since */}
                            {memberSince && (
                                <div
                                    className="flex items-center space-x-3 px-4 py-3 rounded-xl"
                                    style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}
                                >
                                    <CalendarIcon className="w-4 h-4 shrink-0" style={{ color: '#9CA3AF' }} />
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Member Since</p>
                                        <p className="text-sm font-medium" style={{ color: '#111827' }}>{memberSince}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Edit Name Form ── */}
                    <div
                        className="bg-white rounded-2xl p-6"
                        style={{ border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                    >
                        <div className="flex items-center space-x-2 mb-5">
                            <UserCircleIcon className="w-5 h-5" style={{ color: '#4F46E5' }} />
                            <h3 className="text-base font-bold" style={{ color: '#111827' }}>Edit Profile</h3>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            {/* Name input pre-filled from localStorage */}
                            <div>
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white"
                                    style={{ border: '1px solid #E5E7EB', color: '#111827' }}
                                    onFocus={(e) => { e.target.style.borderColor = '#4F46E5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)'; }}
                                    onBlur={(e)  => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>

                            {/* Email — read-only, not editable */}
                            <div>
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
                                    Email Address <span className="text-xs font-normal" style={{ color: '#9CA3AF' }}>(read-only)</span>
                                </label>
                                <input
                                    type="email"
                                    value={user.email || ''}
                                    readOnly
                                    className="w-full px-4 py-3 rounded-xl text-sm cursor-not-allowed"
                                    style={{ border: '1px solid #E5E7EB', color: '#9CA3AF', backgroundColor: '#F9FAFB' }}
                                />
                            </div>

                            {/* Success message */}
                            {saveMsg && (
                                <div
                                    className="flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium"
                                    style={{ backgroundColor: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0' }}
                                >
                                    <CheckCircleIcon className="w-4 h-4 shrink-0" />
                                    <span>{saveMsg}</span>
                                </div>
                            )}

                            {/* Error message */}
                            {saveErr && (
                                <div
                                    className="px-4 py-3 rounded-xl text-sm font-medium"
                                    style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }}
                                >
                                    {saveErr}
                                </div>
                            )}

                            {/* Save button */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 rounded-xl text-sm font-semibold text-white brand-gradient hover:opacity-90 transition-all disabled:opacity-60 flex items-center space-x-2"
                            >
                                {saving ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <CheckCircleIcon className="w-4 h-4" />
                                )}
                                <span>{saving ? 'Saving…' : 'Save Changes'}</span>
                            </button>
                        </form>
                    </div>

                    {/* ── Account Section ── */}
                    <div
                        className="bg-white rounded-2xl p-6"
                        style={{ border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                    >
                        <h3 className="text-base font-bold mb-4" style={{ color: '#111827' }}>Account</h3>
                        <div className="space-y-3">
                            {memberSince && (
                                <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <span className="text-sm" style={{ color: '#6B7280' }}>Member since</span>
                                    <span className="text-sm font-semibold" style={{ color: '#111827' }}>{memberSince}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <span className="text-sm" style={{ color: '#6B7280' }}>Account status</span>
                                <span
                                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                    style={{ backgroundColor: '#D1FAE5', color: '#059669' }}
                                >
                                    Active
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm" style={{ color: '#6B7280' }}>Plan</span>
                                <span className="text-sm font-semibold" style={{ color: '#111827' }}>Free</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
