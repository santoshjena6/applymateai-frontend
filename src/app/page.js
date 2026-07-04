"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ── Exact Homy font stack ──────────────────────────────────────────────────
const SG = "'Special Gothic', sans-serif";
const SW = "'Switzer', sans-serif";
const GV = "'Great Vibes', cursive";

// ── Homy color tokens ──────────────────────────────────────────────────────
const dark   = "#080b0f";
const gray   = "#4b5b63";
const light  = "#f6f6f6";
const white  = "#ffffff";
const border = "#e8e8e8";

// ── Arrow-box CTA button (Homy's signature style) ─────────────────────────
function ArrowBtn({ children, filled = true, href, onClick, extraStyle = {} }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: filled ? dark : white,
    color:      filled ? white : dark,
    border:     filled ? "none" : `1.5px solid ${dark}`,
    borderRadius: 999,
    padding: filled ? "10px 14px 10px 22px" : "12px 28px",
    fontFamily: SW, fontWeight: 500, fontSize: 15,
    cursor: "pointer", textDecoration: "none",
    ...extraStyle,
  };
  const arrow = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 34, height: 34,
    background: white,
    color: dark,
    borderRadius: 8, flexShrink: 0, fontSize: 17,
  };
  if (href) return (
    <Link href={href} style={base}>
      {children}{filled && <span style={arrow}>→</span>}
    </Link>
  );
  return (
    <button style={base} onClick={onClick}>
      {children}{filled && <span style={arrow}>→</span>}
    </button>
  );
}

// ── Circle-dot section label ───────────────────────────────────────────────
function DotLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
      <span style={{
        width: 16, height: 16, borderRadius: "50%",
        border: `1.5px solid ${gray}`,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: gray, display: "block" }} />
      </span>
      <span style={{ fontFamily: SW, fontSize: 11, fontWeight: 600, color: gray, letterSpacing: "0.14em", textTransform: "uppercase" }}>
        {children}
      </span>
    </div>
  );
}

// ── Scroll-reveal wrapper ──────────────────────────────────────────────────
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq]       = useState(null);

  // ── Hero scroll — manual window listener (avoids useScroll ref timing issues) ──
  // Sticky range = 230vh - 100vh = 130vh. Map raw scrollY to animations.
  const heroRef  = useRef(null);
  const scrollPx = useMotionValue(0);   // raw window.scrollY

  useEffect(() => {
    const onScroll = () => scrollPx.set(window.scrollY);
    onScroll();                          // seed on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollPx]);

  // Text: fade fast so card can rise without overlap
  const textY       = useTransform(scrollPx, [0, 300], [0, -50]);
  const textOpacity = useTransform(scrollPx, [0, 300], [1, 0]);

  // Card+cloud rise together (like Homy's house image). 320px total rise.
  const buildingY   = useTransform(scrollPx, [0, 949], [0, -320]);

  return (
    <div style={{ fontFamily: SW, background: white, color: dark }}>

      {/* ══════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "transparent", borderBottom: "none",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 70,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: dark }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          <span style={{ fontFamily: SG, fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>Joblenso</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 40 }} className="desk-nav" />

        <div className="desk-nav">
          <ArrowBtn filled href="/login">Get Started</ArrowBtn>
        </div>

        <button className="mob-btn" onClick={() => setMobileOpen(true)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: dark, padding: 8 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: white, display: "flex", flexDirection: "column", padding: "24px 32px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
              <span style={{ fontFamily: SG, fontSize: 22, fontWeight: 700 }}>Joblenso</span>
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={dark} strokeWidth="2.2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            {["Jobs", "Services", "About"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)}
                style={{ fontFamily: SG, fontSize: 36, fontWeight: 700, color: dark, textDecoration: "none", marginBottom: 16 }}>
                {l}
              </a>
            ))}
            <div style={{ marginTop: "auto" }}>
              <ArrowBtn filled href="/login">Get Started</ArrowBtn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════
          HERO — sticky sky + resume rises from clouds
      ══════════════════════════════════════════════ */}
      <div ref={heroRef} style={{ height: "230vh" }}>
        <section style={{
          position: "sticky", top: 0, height: "100vh",
          background: "linear-gradient(180deg, #c3e5f7 0%, #a8d4ec 18%, #7eb8d8 36%, #559dbe 52%, #3d86a8 64%, #2e6f8e 75%, #1e5a75 84%, #315f70 92%, #316073 100%)",
          filter: "brightness(1.03) contrast(1.05)",
          overflow: "hidden",
        }}>

          {/* ── TEXT — compact to leave room for cloud + card ── */}
          <motion.div style={{ y: textY, opacity: textOpacity, position: "relative", zIndex: 3 }}>
            <div style={{ textAlign: "center", paddingTop: 52, paddingLeft: 24, paddingRight: 24 }}>

              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.90)", backdropFilter: "blur(14px)",
                borderRadius: 999, padding: "7px 16px 7px 9px",
                marginBottom: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.09)",
              }}>
                <div style={{ display: "flex" }}>
                  {[
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
                    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=64&h=64&fit=crop&crop=face",
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid white", marginLeft: i > 0 ? -8 : 0, objectFit: "cover" }} />
                  ))}
                </div>
                <span style={{ fontFamily: SW, fontSize: 13, fontWeight: 500, color: dark }}>10,000+ Placements</span>
              </div>

              <h1 style={{
                fontFamily: SG, fontSize: "clamp(30px, 3.8vw, 62px)",
                fontWeight: 900, lineHeight: 1.02, letterSpacing: "-1.5px",
                color: dark, margin: "0 0 12px",
              }}>Find Your Dream Job</h1>

              <p style={{ fontFamily: SW, fontSize: 15, lineHeight: 1.6, color: gray, maxWidth: 400, margin: "0 auto 18px" }}>
                Upload your resume — AI matches and auto-applies to perfect jobs.
              </p>

              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <ArrowBtn filled href="/jobs">Explore Jobs</ArrowBtn>
                <ArrowBtn filled={false} href="/resume-upload">Upload Resume</ArrowBtn>
              </div>
            </div>
          </motion.div>

          {/* ── CARD + CLOUD — one rising unit (like Homy's house image)
              bottom:-230px → card top at y≈320 at scroll=0 (peeking above cloud)
              Cloud at top:250px inside → cloud peaks at y≈570 at scroll=0
              Rises 240px → card top at y≈80 at full scroll, cloud at y≈330      */}
          <motion.div style={{
            y: buildingY,
            position: "absolute",
            bottom: "-230px",
            left: 0, right: 0,
            zIndex: 2,
          }}>


            {/* ── Cloud SVG — Homy-style puff clouds rising with card ── */}
            <div style={{
              position: "absolute", top: 280, left: "-5%", right: "-5%",
              height: 500, zIndex: 5, pointerEvents: "none",
            }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1500 500"
                preserveAspectRatio="none"
                style={{ display: "block", width: "100%", height: "100%" }}
              >
                <defs>
                  {/* Heavy blur — atmospheric haze base */}
                  <filter id="cfa" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="20 15" />
                  </filter>
                  {/* Medium blur — applied to entire cloud puff group at once */}
                  <filter id="cfp" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="14 12" />
                  </filter>
                </defs>

                {/* Atmospheric haze — wide, low, heavy blur for depth */}
                <ellipse cx="750" cy="465" rx="940" ry="170"
                  fill="rgba(255,255,255,0.8)" filter="url(#cfa)" />

                {/* Cloud puff group — all puffs composite then blur together,
                    creates thick organic cloud mass like Homy's photograph */}
                <g filter="url(#cfp)" fill="white">
                  {/* Row 1 — prominent bumpy tops */}
                  <ellipse cx="120" cy="385" rx="215" ry="135" />
                  <ellipse cx="400" cy="360" rx="265" ry="150" />
                  <ellipse cx="700" cy="348" rx="280" ry="155" />
                  <ellipse cx="1000" cy="358" rx="265" ry="150" />
                  <ellipse cx="1280" cy="372" rx="240" ry="140" />
                  <ellipse cx="1460" cy="390" rx="195" ry="125" />
                  {/* Row 2 — fills gaps between row 1 */}
                  <ellipse cx="260" cy="410" rx="235" ry="122" />
                  <ellipse cx="560" cy="398" rx="248" ry="128" />
                  <ellipse cx="860" cy="402" rx="244" ry="126" />
                  <ellipse cx="1148" cy="406" rx="238" ry="122" />
                  <ellipse cx="1390" cy="416" rx="205" ry="115" />
                  {/* Solid floor to seal bottom */}
                  <ellipse cx="750" cy="455" rx="950" ry="105" />
                  <rect x="-100" y="450" width="1700" height="60" />
                </g>
              </svg>
            </div>

            {/* ── Resume card ── */}
            <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 3 }}>
            <div style={{
              width: "min(660px, 88vw)",
              background: white,
              borderRadius: "22px 22px 0 0",
              boxShadow: "0 -12px 80px rgba(0,0,0,0.22), 0 -2px 20px rgba(0,0,0,0.10)",
              padding: "30px 34px 0",
              position: "relative",
              overflow: "hidden",
              height: "min(640px, 88vh)",
            }}>
              {/* AI Scanning badge */}
              <div style={{
                position: "absolute", top: 16, right: 16,
                background: dark, borderRadius: 999, padding: "5px 13px",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} />
                <span style={{ fontFamily: SW, fontSize: 11, fontWeight: 600, color: white }}>AI Scanning…</span>
              </div>

              {/* ── Header: Name + contact ── */}
              <div style={{ paddingBottom: 14, borderBottom: `1px solid ${border}`, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#7abcd4,#3a7ca5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: SG, fontSize: 20, fontWeight: 800, color: dark, lineHeight: 1 }}>Rahul Sharma</div>
                    <div style={{ fontFamily: SW, fontSize: 12, color: "#3a7ca5", fontWeight: 600, marginTop: 3 }}>Senior Product Designer</div>
                    {/* Contact row */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", marginTop: 6 }}>
                      {[
                        { icon: "✉", text: "rahul.sharma@gmail.com" },
                        { icon: "📞", text: "+91 ••••• •••••" },
                        { icon: "📍", text: "Bengaluru, Karnataka" },
                        { icon: "🔗", text: "linkedin.com/in/rahulsharma" },
                      ].map(({ icon, text }) => (
                        <span key={text} style={{ fontFamily: SW, fontSize: 10, color: gray, display: "flex", alignItems: "center", gap: 3 }}>
                          <span style={{ fontSize: 9 }}>{icon}</span> {text}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "#e8f4fb", borderRadius: 6, padding: "3px 10px", flexShrink: 0 }}>
                    <span style={{ fontFamily: SW, fontSize: 11, fontWeight: 600, color: "#3a7ca5" }}>Open to work</span>
                  </div>
                </div>
              </div>

              {/* ── Summary ── */}
              <div style={{ marginBottom: 13 }}>
                <div style={{ fontFamily: SW, fontSize: 9, fontWeight: 700, color: gray, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 5 }}>Summary</div>
                <p style={{ fontFamily: SW, fontSize: 11, lineHeight: 1.65, color: "#5a6a73", margin: 0 }}>
                  Product designer with 6+ years crafting intuitive B2B/B2C products at scale. Expert in Figma, design systems, and bridging UX research with engineering. Led end-to-end design for Google Pay India (50M+ users) and Razorpay Checkout.
                </p>
              </div>

              {/* ── Skills ── */}
              <div style={{ marginBottom: 13 }}>
                <div style={{ fontFamily: SW, fontSize: 9, fontWeight: 700, color: gray, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>Skills</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {["Figma", "React", "UX Research", "Design Systems", "Prototyping", "Usability Testing", "Wireframing", "A/B Testing"].map(s => (
                    <span key={s} style={{ fontFamily: SW, fontSize: 10, background: light, borderRadius: 5, padding: "3px 9px", color: dark, fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* ── Experience ── */}
              <div style={{ marginBottom: 13 }}>
                <div style={{ fontFamily: SW, fontSize: 9, fontWeight: 700, color: gray, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Experience</div>
                {[
                  {
                    co: "Google", role: "Senior UX Designer", yr: "Jan 2022 – Present", loc: "Bengaluru",
                    dot: "#4285F4",
                    points: ["Led redesign of Google Pay India onboarding, reducing drop-off by 34%", "Owned design system components used across 8 product teams"],
                  },
                  {
                    co: "Razorpay", role: "Product Designer", yr: "Aug 2020 – Dec 2021", loc: "Bengaluru",
                    dot: "#2EB67D",
                    points: ["Redesigned Razorpay Checkout — conversion improved by 22%", "Built accessible component library (React + Figma)"],
                  },
                  {
                    co: "Zomato", role: "UI Designer", yr: "Jun 2018 – Jul 2020", loc: "Gurugram",
                    dot: "#E23744",
                    points: ["Designed Zomato Pro subscription flow (3M+ subscribers)", "Led dark-mode rollout across Android & iOS"],
                  },
                ].map(({ co, role, yr, loc, dot, points }) => (
                  <div key={co} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                      <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontFamily: SW, fontSize: 12, fontWeight: 700, color: dark }}>{co}</span>
                        <span style={{ fontFamily: SW, fontSize: 11, color: gray }}>· {role}</span>
                      </div>
                      <span style={{ fontFamily: SW, fontSize: 10, color: gray }}>{yr} · {loc}</span>
                    </div>
                    {points.map(p => (
                      <div key={p} style={{ display: "flex", gap: 6, paddingLeft: 16, marginBottom: 2 }}>
                        <span style={{ fontFamily: SW, fontSize: 9, color: gray, marginTop: 2, flexShrink: 0 }}>▸</span>
                        <span style={{ fontFamily: SW, fontSize: 10, color: "#5a6a73", lineHeight: 1.5 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* ── Education ── */}
              <div>
                <div style={{ fontFamily: SW, fontSize: 9, fontWeight: 700, color: gray, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>Education</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontFamily: SW, fontSize: 12, fontWeight: 600, color: dark }}>B.Des — Visual Communication</div>
                    <div style={{ fontFamily: SW, fontSize: 11, color: gray }}>National Institute of Design, Ahmedabad</div>
                  </div>
                  <div style={{ fontFamily: SW, fontSize: 10, color: gray }}>2014 – 2018</div>
                </div>
              </div>
            </div>
            </div>
          </motion.div>

        </section>
      </div>

      {/* ══════════════════════════════════════════════
          STATS  (photo | stats | photo)
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "80px 48px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 20, alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: 20, overflow: "hidden", height: 340 }}>
              <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80" alt="Professional" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="stats-center" style={{ padding: "0 40px" }}>
              <h2 style={{ fontFamily: SG, fontSize: "clamp(28px,4vw,50px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 36 }}>
                Real insights behind every career leap
              </h2>
              {[["5,000+", "ACTIVE JOBS"], ["800+", "TOP COMPANIES"], ["98%", "PLACEMENT RATE"]].map(([n, l]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderTop: `1px solid ${border}` }}>
                  <span style={{ fontFamily: SG, fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 700, letterSpacing: "-1px" }}>{n}</span>
                  <span style={{ fontFamily: SW, fontSize: 12, fontWeight: 600, color: gray, letterSpacing: "0.14em", textTransform: "uppercase" }}>{l}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ borderRadius: 20, overflow: "hidden", height: 340 }}>
              <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80" alt="Team meeting" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LARGE CENTERED QUOTE
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "100px 48px", background: light }}>
        <Reveal>
          <p style={{
            fontFamily: SG,
            fontSize: "clamp(24px, 4vw, 52px)",
            fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.5px",
            textAlign: "center", maxWidth: 940, margin: "0 auto", color: dark,
          }}>
            We build platforms that help{" "}
            <em style={{ fontFamily: GV, fontStyle: "italic", fontSize: "1.2em", fontWeight: 400 }}>professionals</em>{" "}
            discover roles, match their skills, and move forward with confidence.
          </p>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════
          TOP JOBS — header
      ══════════════════════════════════════════════ */}
      <section id="jobs" style={{ padding: "100px 48px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end" }}>
          <Reveal>
            <div>
              <DotLabel>Top Jobs</DotLabel>
              <h2 style={{ fontFamily: SG, fontSize: "clamp(26px,4vw,50px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-1px", margin: 0 }}>
                Explore our selected roles for modern professionals
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{ fontFamily: SW, fontSize: 16, lineHeight: 1.8, color: gray, margin: 0 }}>
              Carefully chosen opportunities that combine growth, culture, and compensation to match your real career needs.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          JOB CARDS — bento magazine layout
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "0 48px 80px", maxWidth: 1280, margin: "0 auto" }}>
        {(() => {
          const jobs = [
            { salary: "$120K – $160K / yr", title: "Senior Frontend Engineer", company: "Google", location: "Mountain View, CA", tag: "Full-Time", img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1600&q=90" },
            { salary: "$90K – $130K / yr",  title: "Product Designer",          company: "Figma",  location: "Remote, US",         tag: "Remote",    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=85" },
            { salary: "$150K – $190K / yr", title: "AI / ML Engineer",           company: "OpenAI", location: "San Francisco, CA", tag: "Hybrid",    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=85" },
          ];
          const tagColor = { "Full-Time": "#22c55e", "Remote": "#3b82f6", "Hybrid": "#f59e0b" };
          return (
            <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>

              {/* ── Featured card (left, tall) ── */}
              <div style={{ flex: "0 0 58%", minWidth: 0 }}>
                <Reveal>
                  <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 580, cursor: "pointer" }}>
                    <img src={jobs[0].img} alt={jobs[0].title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,11,15,0.0) 30%, rgba(8,11,15,0.85))" }} />
                    {/* Tag badge */}
                    <div style={{ position: "absolute", top: 22, left: 22, display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.94)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "6px 14px 6px 10px" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: tagColor[jobs[0].tag], display: "inline-block" }} />
                      <span style={{ fontFamily: SW, fontSize: 12, fontWeight: 600, color: dark }}>{jobs[0].tag}</span>
                    </div>
                    {/* Content */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "36px 36px 40px" }}>
                      <p style={{ fontFamily: SW, fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 6px", fontWeight: 500 }}>{jobs[0].company} · {jobs[0].location}</p>
                      <h3 style={{ fontFamily: SG, fontSize: "clamp(22px,3.2vw,40px)", fontWeight: 700, color: white, margin: "0 0 14px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>{jobs[0].title}</h3>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: SW, fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{jobs[0].salary}</span>
                        <button style={{ display: "inline-flex", alignItems: "center", gap: 8, background: white, color: dark, border: "none", borderRadius: 999, padding: "9px 12px 9px 18px", fontFamily: SW, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                          Apply Now
                          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, background: dark, color: white, borderRadius: 7, fontSize: 15 }}>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* ── Right column — 2 compact stacked cards ── */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
                {jobs.slice(1).map((job, i) => (
                  <Reveal key={i} delay={(i + 1) * 0.1}>
                    <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 283, cursor: "pointer" }}>
                      <img src={job.img} alt={job.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,11,15,0.05) 20%, rgba(8,11,15,0.88))" }} />
                      {/* Tag badge */}
                      <div style={{ position: "absolute", top: 18, right: 18, display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "5px 12px 5px 8px" }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: tagColor[job.tag], display: "inline-block" }} />
                        <span style={{ fontFamily: SW, fontSize: 11, fontWeight: 600, color: dark }}>{job.tag}</span>
                      </div>
                      {/* Content */}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                          <p style={{ fontFamily: SW, fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>{job.company} · {job.location}</p>
                          <h4 style={{ fontFamily: SG, fontSize: "clamp(18px,2.4vw,26px)", fontWeight: 700, color: white, margin: "0 0 5px", letterSpacing: "-0.3px" }}>{job.title}</h4>
                          <p style={{ fontFamily: SW, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0 }}>{job.salary}</p>
                        </div>
                        <div style={{ width: 38, height: 38, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: white, fontSize: 16, flexShrink: 0 }}>→</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

            </div>
          );
        })()}
      </section>

      {/* ══════════════════════════════════════════════
          SERVICES  .01 / .02 / .03
      ══════════════════════════════════════════════ */}
      <section id="services" style={{ padding: "80px 48px", background: white }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <DotLabel>Our Services</DotLabel>
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[
              { num: ".01", label: "AI Resume Scan",     desc: "Upload your resume — our AI extracts skills, experience, and ideal role in seconds.",      img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=85" },
              { num: ".02", label: "Smart Job Match",    desc: "Our algorithm matches your profile to thousands of live openings ranked by fit score.",     img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=85" },
              { num: ".03", label: "Track Applications", desc: "See every application status in one clean dashboard. Never lose track of an opportunity.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=85" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: light, borderRadius: 24, overflow: "hidden", cursor: "pointer" }}>
                  <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ maxWidth: 180 }}>
                      <p style={{ fontFamily: SW, fontSize: 11, color: gray, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px", fontWeight: 600 }}>{s.label}</p>
                      <p style={{ fontFamily: SW, fontSize: 13, color: gray, margin: 0, lineHeight: 1.55 }}>{s.desc}</p>
                    </div>
                    <span style={{ fontFamily: SG, fontSize: 72, fontWeight: 700, color: dark, lineHeight: 1, opacity: 0.10 }}>{s.num}</span>
                  </div>
                  <div style={{ height: 220, marginTop: 16 }}>
                    <img src={s.img} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2-COLUMN JOB CARDS
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "80px 48px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { badge: "Full-Time", title: "Backend Engineer", salary: "$130,000 / yr", specs: "3–5 yrs  ·  Node, Go  ·  Onsite", img: "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=1000&q=85" },
            { badge: "Remote",    title: "UX Researcher",    salary: "$95,000 / yr",  specs: "2–4 yrs  ·  Figma  ·  Remote",   img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1000&q=85" },
          ].map((card, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ borderRadius: 24, overflow: "hidden", position: "relative", height: 500, cursor: "pointer" }}>
                <img src={card.img} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 28%, rgba(8,11,15,0.88))" }} />
                <div style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "7px 16px", fontFamily: SW, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  {card.badge}
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px" }}>
                  <p style={{ fontFamily: SW, fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 5px" }}>{card.specs}</p>
                  <h4 style={{ fontFamily: SG, fontSize: 30, fontWeight: 700, color: white, margin: "0 0 6px", letterSpacing: "-0.5px" }}>{card.title}</h4>
                  <p style={{ fontFamily: SG, fontSize: 24, fontWeight: 700, color: white, margin: 0 }}>{card.salary}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CAREER GROWTH — dot label + two col
      ══════════════════════════════════════════════ */}
      <section id="about" style={{ padding: "80px 48px 100px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end" }}>
          <Reveal>
            <div>
              <DotLabel>Career Growth</DotLabel>
              <h2 style={{ fontFamily: SG, fontSize: "clamp(26px,4vw,50px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-1px", margin: 0 }}>
                Modern careers, designed to grow better
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{ fontFamily: SW, fontSize: 16, lineHeight: 1.8, color: gray, margin: 0 }}>
              Explore true modern career paths — crafted by experts who understand real talent needs, workplace culture, and long-term professional transformation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════════════ */}
      <section style={{ overflow: "hidden", padding: "44px 0", borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ display: "flex", width: "max-content", animation: "marquee 28s linear infinite" }}>
          {[...Array(4)].map((_, r) => (
            <div key={r} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              {["Explore Jobs", "Grow Career", "Top Companies", "AI Matching", "Get Hired"].map((t, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: SG, fontSize: "clamp(36px,5.5vw,68px)", fontWeight: 700, color: dark, whiteSpace: "nowrap", padding: "0 28px" }}>{t}</span>
                  <span style={{ fontSize: 24, color: border, flexShrink: 0 }}>•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "100px 48px", maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <h2 style={{ fontFamily: SG, fontSize: "clamp(24px,4vw,48px)", fontWeight: 700, letterSpacing: "-1px", textAlign: "center", marginBottom: 60 }}>
            What professionals say about their job search
          </h2>
        </Reveal>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { q: '"Finding my dream role was incredibly smooth. The AI matched my resume to the perfect company and saved me countless hours."', name: "Priya Sharma", role: "Software Engineer, Stripe", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
            { q: '"The platform is beautifully designed. Skill-based filtering and the application tracker are genuinely life-changing."',        name: "Marcus Chen",  role: "Product Manager, Notion",  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
          ].map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ background: light, borderRadius: 24, padding: 48 }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 22 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#f59e0b", fontSize: 19 }}>★</span>)}
                </div>
                <p style={{ fontFamily: SW, fontSize: 19, lineHeight: 1.65, fontWeight: 500, marginBottom: 32, color: dark }}>{t.q}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <img src={t.img} alt={t.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <p style={{ fontFamily: SG, fontSize: 17, fontWeight: 700, margin: 0 }}>{t.name}</p>
                    <p style={{ fontFamily: SW, fontSize: 14, color: gray, margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "80px 48px 100px", maxWidth: 760, margin: "0 auto" }}>
        <Reveal>
          <h2 style={{ fontFamily: SG, fontSize: "clamp(24px,4vw,48px)", fontWeight: 700, letterSpacing: "-1px", textAlign: "center", marginBottom: 52 }}>
            Things You Should Know
          </h2>
        </Reveal>
        {[
          { q: "How does the AI matching process work?",  a: "We analyse your resume with Groq AI to extract skills, experience level, and target role — then rank live openings by relevance score." },
          { q: "Are the company listings verified?",       a: "Yes. Every company in our network is vetted. We partner only with organisations that meet our standards for culture and compensation." },
          { q: "Can I track my application status?",       a: "Absolutely. Your dashboard shows every application in real time — from Submitted through Interviewed to Offered." },
          { q: "Is the platform free to use?",             a: "Core job search and tracking features are free. AI resume optimisation and priority matching are available on our Pro plan." },
        ].map((item, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <div onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ borderTop: `1px solid ${border}`, padding: "22px 0", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
                <h4 style={{ fontFamily: SG, fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>{item.q}</h4>
                <span style={{
                  width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${border}`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, fontSize: 22, color: dark,
                  transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform .3s",
                }}>+</span>
              </div>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: "hidden" }} transition={{ duration: 0.3 }}>
                    <p style={{ fontFamily: SW, fontSize: 16, color: gray, lineHeight: 1.75, margin: "14px 0 0" }}>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
        <div style={{ borderTop: `1px solid ${border}` }} />
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA CARD
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "0 48px 100px", maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <div style={{ borderRadius: 32, overflow: "hidden", position: "relative", height: 480, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=90" alt="Team"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(8,11,15,0.74)" }} />
            <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 680 }}>
              <h2 style={{ fontFamily: SG, fontSize: "clamp(28px,5vw,62px)", fontWeight: 700, color: white, letterSpacing: "-1px", marginBottom: 20 }}>
                Discover roles designed for your future
              </h2>
              <p style={{ fontFamily: SW, fontSize: 17, color: "rgba(255,255,255,0.72)", maxWidth: 440, margin: "0 auto 36px" }}>
                Join thousands of professionals who found their perfect role using our AI platform.
              </p>
              <ArrowBtn filled={false} href="/jobs"
                extraStyle={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.4)", color: white }}>
                Get Started Now
              </ArrowBtn>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer style={{ borderTop: `1px solid ${border}`, padding: "80px 48px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 60 }}>
            <div>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: dark, marginBottom: 16 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                <span style={{ fontFamily: SG, fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>Joblenso</span>
              </Link>
              <p style={{ fontFamily: SW, fontSize: 15, color: gray, lineHeight: 1.7, maxWidth: 260 }}>
                Making finding your dream job a beautiful and effortless experience.
              </p>
            </div>
            {[
              { title: "Company",   links: ["About Us", "Careers", "Press", "Contact"] },
              { title: "Resources", links: ["Blog", "Guides", "FAQ", "Help Center"] },
              { title: "Legal",     links: ["Terms", "Privacy", "Cookies"] },
            ].map(col => (
              <div key={col.title}>
                <h5 style={{ fontFamily: SG, fontSize: 15, fontWeight: 700, marginBottom: 20 }}>{col.title}</h5>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {col.links.map(l => (
                    <li key={l} style={{ marginBottom: 12 }}>
                      <a href="#" style={{ fontFamily: SW, fontSize: 15, color: gray, textDecoration: "none" }}>{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 28, borderTop: `1px solid ${border}`, flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontFamily: SW, fontSize: 14, color: gray, margin: 0 }}>© 2026 Joblenso. All rights reserved.</p>
            <div style={{ display: "flex", gap: 24 }}>
              {["Twitter", "LinkedIn", "Instagram"].map(s => (
                <a key={s} href="#" style={{ fontFamily: SW, fontSize: 14, color: gray, textDecoration: "none" }}>{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════
          GLOBAL STYLES
      ══════════════════════════════════════════════ */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-25%); }
        }
        * { box-sizing: border-box; }
        @media (max-width: 900px) {
          .desk-nav  { display: none !important; }
          .mob-btn   { display: block !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .stats-grid > *:first-child,
          .stats-grid > *:last-child { display: none !important; }
          .stats-center { padding: 0 !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .two-col   { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
