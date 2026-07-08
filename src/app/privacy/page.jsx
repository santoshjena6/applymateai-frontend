'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const SG = "'Special Gothic', sans-serif";
const SW = "'Switzer', sans-serif";
const dark = "#080b0f";
const gray = "#4b5b63";
const white = "#ffffff";

const EFFECTIVE_DATE = "July 1, 2026";
const COMPANY_NAME   = "Joblenso";
const CONTACT_EMAIL  = "support@joblenso.com";

export default function PrivacyPolicyPage() {
    const router = useRouter();

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #d5ecfa, #e9f2f9)", fontFamily: SW }}>
            {/* ── Nav bar ── */}
            <nav style={{ background: white, borderBottom: "1px solid #e8e8e8", padding: "16px 48px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 50 }}>
                <button
                    onClick={() => router.back()}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: gray, fontFamily: SW, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                    <ArrowLeftIcon style={{ width: 16, height: 16 }} />
                    Back
                </button>
                <span style={{ fontFamily: SG, fontSize: 20, fontWeight: 800, color: dark }}>Joblenso</span>
            </nav>

            {/* ── Content ── */}
            <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>
                <div style={{ background: white, borderRadius: 24, padding: "48px 56px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)" }}>
                    <h1 style={{ fontFamily: SG, fontSize: 40, fontWeight: 800, color: dark, letterSpacing: "-1.5px", marginBottom: 8 }}>Privacy Policy</h1>
                    <p style={{ fontSize: 14, color: gray, marginBottom: 40 }}>Effective date: {EFFECTIVE_DATE}</p>

                    <Section title="1. Introduction">
                        <p>{COMPANY_NAME} ("we", "us", or "our") operates the Joblenso platform — a service that allows users to upload their résumé and receive AI-assisted job matches and application assistance. This Privacy Policy explains what data we collect, how we use it, and your rights.</p>
                        <p>By using our service you agree to the collection and use of information as described in this policy. If you do not agree, please do not use the service.</p>
                    </Section>

                    <Section title="2. Information We Collect">
                        <p><strong>Account information:</strong> name, email address, job type preference, and optionally phone number, location, and expected salary — provided during registration or profile setup.</p>
                        <p><strong>Résumé data:</strong> the résumé file you upload (PDF or DOCX) and the structured data we extract from it (skills, experience, education) used to match you with relevant jobs.</p>
                        <p><strong>Usage data:</strong> pages visited, features used, application statuses you track, and error logs — collected to improve the platform.</p>
                        <p><strong>Authentication data:</strong> if you sign in with Google, we receive your Google profile name and email; we do not receive your Google password.</p>
                    </Section>

                    <Section title="3. How We Use Your Information">
                        <p>We use your data to: create and manage your account; extract structured information from your résumé for job matching; display relevant job listings from third-party job boards; track job applications you record; communicate with you about your account (including OTP emails); and improve the platform through aggregate analytics.</p>
                        <p>We do <strong>not</strong> sell your personal data to third parties. We do not serve targeted advertisements.</p>
                    </Section>

                    <Section title="4. Third-Party Services">
                        <p>We use the following third-party services to power the platform:</p>
                        <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 6 }}>
                            <li><strong>Adzuna & JSearch:</strong> job listing APIs — your search keywords and location are sent to retrieve matching jobs. These providers have their own privacy policies.</li>
                            <li><strong>Google OAuth2:</strong> optional sign-in method. Governed by Google's Privacy Policy.</li>
                            <li><strong>Email provider:</strong> used solely to send OTP verification and account emails.</li>
                            <li><strong>AI engine:</strong> résumé text is processed by our proprietary AI engine to extract skills and match jobs. Data is not used to train external models.</li>
                        </ul>
                    </Section>

                    <Section title="5. Data Retention">
                        <p>Your account data is retained for as long as your account is active. If you registered but never verified your email, your account is automatically deleted after 24 hours. Expired authentication tokens are deleted nightly. You may request deletion of your account and associated data at any time by contacting us.</p>
                    </Section>

                    <Section title="6. Security">
                        <p>We implement industry-standard security measures: passwords are hashed with BCrypt; access tokens expire in 15 minutes; tokens are invalidated on logout; file uploads are validated for type and sanitized against path traversal attacks; all traffic is served over HTTPS in production.</p>
                        <p>No system is perfectly secure. We encourage you to use a strong, unique password and to log out when using shared devices.</p>
                    </Section>

                    <Section title="7. Your Rights">
                        <p>Depending on your location, you may have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your account and data; object to processing of your data; and data portability.</p>
                        <p>Indian users: your rights are governed by the Digital Personal Data Protection Act, 2023 (DPDPA). EU/EEA users: your rights are governed by the GDPR. To exercise any of these rights, contact us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#3a7ca5", fontWeight: 600 }}>{CONTACT_EMAIL}</a>.</p>
                    </Section>

                    <Section title="8. Cookies">
                        <p>We use only essential cookies required for authentication and session management. We do not use tracking or advertising cookies. You will be asked for consent on your first visit; you may withdraw consent at any time by clearing your browser cookies.</p>
                    </Section>

                    <Section title="9. Children's Privacy">
                        <p>Our service is intended for users 18 years of age and older. We do not knowingly collect personal data from minors. If you believe a minor has provided us with personal data, contact us and we will delete it promptly.</p>
                    </Section>

                    <Section title="10. Changes to This Policy">
                        <p>We may update this Privacy Policy from time to time. We will notify registered users by email and update the effective date above. Continued use of the service after changes constitutes acceptance of the updated policy.</p>
                    </Section>

                    <Section title="11. Contact Us">
                        <p>For privacy-related questions or requests, contact us at:<br />
                        <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#3a7ca5", fontWeight: 600 }}>{CONTACT_EMAIL}</a></p>
                    </Section>
                </div>
            </main>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: SG, fontSize: 22, fontWeight: 800, color: dark, letterSpacing: "-0.5px", marginBottom: 14 }}>{title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 15, lineHeight: 1.75, color: "#2d3748" }}>
                {children}
            </div>
        </div>
    );
}
