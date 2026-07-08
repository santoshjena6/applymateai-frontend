'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CONSENT_KEY = 'joblenso_cookie_consent';

/**
 * CookieConsent — shows a bottom banner on first visit.
 * Stores acceptance in localStorage. Links to /privacy.
 * Compliant with GDPR (EU) and DPDPA (India).
 */
export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show banner only if user hasn't consented yet
        try {
            if (!localStorage.getItem(CONSENT_KEY)) {
                setVisible(true);
            }
        } catch {}
    }, []);

    const accept = () => {
        try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch {}
        setVisible(false);
    };

    const decline = () => {
        try { localStorage.setItem(CONSENT_KEY, 'declined'); } catch {}
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label="Cookie consent"
            style={{
                position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
                width: "min(680px, calc(100vw - 32px))",
                background: "#080b0f", color: "#ffffff",
                borderRadius: 20, padding: "20px 24px",
                display: "flex", alignItems: "center", gap: 16,
                boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
                zIndex: 9999, fontFamily: "'Switzer', sans-serif",
                flexWrap: "wrap",
            }}
        >
            {/* Text */}
            <p style={{ flex: 1, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.85)", margin: 0, minWidth: 200 }}>
                We use essential cookies for authentication and security.{' '}
                <Link href="/privacy" style={{ color: "#7ecfff", fontWeight: 700, textDecoration: "underline" }}>
                    Learn more
                </Link>
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0, alignItems: "center" }}>
                <button
                    onClick={decline}
                    style={{
                        padding: "9px 18px", borderRadius: 999, border: "1.5px solid rgba(255,255,255,0.2)",
                        background: "transparent", color: "rgba(255,255,255,0.7)",
                        fontFamily: "'Switzer', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                >
                    Decline
                </button>
                <button
                    onClick={accept}
                    style={{
                        padding: "9px 20px", borderRadius: 999, border: "none",
                        background: "#ffffff", color: "#080b0f",
                        fontFamily: "'Switzer', sans-serif", fontSize: 13, fontWeight: 800, cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#e8f4fd"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; }}
                >
                    Accept
                </button>
                <button
                    onClick={decline}
                    aria-label="Close"
                    style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                >
                    <XMarkIcon style={{ width: 18, height: 18 }} />
                </button>
            </div>
        </div>
    );
}
