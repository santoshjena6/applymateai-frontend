'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const SG = "'Special Gothic', sans-serif";
const SW = "'Switzer', sans-serif";
const dark = "#080b0f";
const gray = "#4b5b63";
const white = "#ffffff";

const EFFECTIVE_DATE = "July 1, 2026";
const CONTACT_EMAIL  = "support@joblenso.com";

export default function TermsOfServicePage() {
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
                    <h1 style={{ fontFamily: SG, fontSize: 40, fontWeight: 800, color: dark, letterSpacing: "-1.5px", marginBottom: 8 }}>Terms of Service</h1>
                    <p style={{ fontSize: 14, color: gray, marginBottom: 40 }}>Effective date: {EFFECTIVE_DATE}</p>

                    <Section title="1. Acceptance of Terms">
                        <p>By accessing or using the Joblenso platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you may not use the Service. These Terms apply to all visitors, users, and others who access the Service.</p>
                    </Section>

                    <Section title="2. Description of Service">
                        <p>Joblenso is a job-matching platform that allows users to upload a résumé, which is then analysed by our AI engine to suggest relevant job listings and assist with applications. Job listings are sourced from third-party job boards and are not under our control.</p>
                    </Section>

                    <Section title="3. Eligibility">
                        <p>You must be at least 18 years old to use the Service. By registering, you represent that you are 18 or older and that the information you provide is accurate and complete.</p>
                    </Section>

                    <Section title="4. User Accounts">
                        <p>You are responsible for maintaining the security of your account credentials. You must notify us immediately at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#3a7ca5", fontWeight: 600 }}>{CONTACT_EMAIL}</a> if you suspect unauthorised access.</p>
                        <p>You may not share your account with others, use another person's account, or create multiple accounts to circumvent restrictions.</p>
                    </Section>

                    <Section title="5. Acceptable Use">
                        <p>You agree not to:</p>
                        <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 6 }}>
                            <li>Upload false, misleading, or fraudulent résumé content.</li>
                            <li>Attempt to access another user's account or data.</li>
                            <li>Use automated tools (bots, scrapers) to access the Service without our written permission.</li>
                            <li>Attempt to reverse-engineer, decompile, or extract proprietary algorithms from the Service.</li>
                            <li>Use the Service for any unlawful purpose or in violation of any applicable laws.</li>
                            <li>Upload files containing malicious code, viruses, or any content that could harm our systems or other users.</li>
                        </ul>
                    </Section>

                    <Section title="6. Résumé Data and AI Processing">
                        <p>By uploading your résumé, you grant us a non-exclusive, worldwide, royalty-free licence to process and store the content solely for the purpose of providing the Service. You retain full ownership of your résumé data.</p>
                        <p>Our AI engine analyses your résumé to extract skills and experience for job matching purposes. We do not share your raw résumé with third-party employers without your explicit consent.</p>
                    </Section>

                    <Section title="7. Third-Party Job Listings">
                        <p>Job listings displayed on Joblenso are sourced from third-party job boards (Adzuna, JSearch, and others). We make no representations about the accuracy, completeness, or availability of these listings. We are not responsible for the hiring decisions, terms, or actions of any employer.</p>
                    </Section>

                    <Section title="8. Intellectual Property">
                        <p>The Joblenso platform, including its design, logo, AI technology, and software, is owned by us and protected by copyright and intellectual property laws. You may not copy, reproduce, or create derivative works from our platform without explicit written permission.</p>
                    </Section>

                    <Section title="9. Disclaimers">
                        <p>The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the Service will be uninterrupted, error-free, or that job matches will result in employment. Job matching is AI-assisted and may not be perfect.</p>
                    </Section>

                    <Section title="10. Limitation of Liability">
                        <p>To the maximum extent permitted by applicable law, Joblenso shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the Service, even if we have been advised of the possibility of such damages.</p>
                    </Section>

                    <Section title="11. Termination">
                        <p>We reserve the right to suspend or terminate your account if you violate these Terms. You may also delete your account at any time by contacting us. Upon termination, your right to use the Service ceases immediately.</p>
                    </Section>

                    <Section title="12. Governing Law">
                        <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in India. International users acknowledge that this Service is operated from India and consent to Indian jurisdiction.</p>
                    </Section>

                    <Section title="13. Changes to Terms">
                        <p>We reserve the right to modify these Terms at any time. We will notify registered users by email and update the effective date above. Continued use of the Service after changes constitutes your acceptance of the new Terms.</p>
                    </Section>

                    <Section title="14. Contact">
                        <p>For questions about these Terms, contact us at:<br />
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
