"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function OAuth2CallbackInner() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token  = searchParams.get("token");
        const email  = searchParams.get("email");
        const name   = searchParams.get("name");
        const role   = searchParams.get("role") || "USER";

        if (!token) {
            console.error("OAuth2 callback: no token received");
            router.replace("/login?error=oauth_failed");
            return;
        }

        // Store access token immediately
        localStorage.setItem("applync_token", token);

        // Check if this user already has a resume uploaded
        // — if yes, grab jobCategory; if no, send them to resume-upload first
        const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
        fetch(`${BASE}/resume/all`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : [])
            .then(resumes => {
                const latest = Array.isArray(resumes) ? resumes[0] : null;
                const jobCategory = latest?.jobCategory || null;
                localStorage.setItem("applync_user", JSON.stringify({ email, name, role, jobCategory }));
                // New Google user (no resume yet) → go upload first, then dashboard
                router.replace(latest ? "/dashboard" : "/resume-upload");
            })
            .catch(() => {
                localStorage.setItem("applync_user", JSON.stringify({ email, name, role }));
                router.replace("/dashboard");
            });
    }, [searchParams, router]);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            fontFamily: "sans-serif",
            gap: "16px"
        }}>
            <div style={{
                width: 40,
                height: 40,
                border: "4px solid #e5e7eb",
                borderTop: "4px solid #6366f1",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
            }} />
            <p style={{ color: "#6b7280", fontSize: 16 }}>Signing you in with Google…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export default function OAuth2Callback() {
    return (
        <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>Loading…</div>}>
            <OAuth2CallbackInner />
        </Suspense>
    );
}
