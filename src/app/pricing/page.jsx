"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { ShieldCheckIcon, BoltIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const SG = "'Special Gothic', sans-serif";
const SW = "'Switzer', sans-serif";
const dark = "#080b0f";
const gray = "#4b5b63";
const white = "#ffffff";
const borderCol = "rgba(255,255,255,0.6)";

function HeadsetIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  );
}

const pricingPlans = [
    {
        name: "Free Plan",
        desc: "Perfect to get started",
        price: "₹0",
        features: [
            { text: "1 Resume Upload", included: true },
            { text: "10 Job Matches / month", included: true },
            { text: "Basic Job Recommendations", included: true },
            { text: "Track 5 Applications", included: true },
            { text: "AI Cover Letter", included: false },
            { text: "Auto Apply", included: false },
        ],
        buttonText: "Get Started Free",
        popular: false,
    },
    {
        name: "Pro Plan",
        desc: "For serious job seekers",
        price: "₹499",
        features: [
            { text: "Unlimited Resume Uploads", included: true },
            { text: "Unlimited Job Matches", included: true },
            { text: "AI Job Recommendations", included: true },
            { text: "Track Unlimited Applications", included: true },
            { text: "AI Cover Letter Generator", included: true },
            { text: "Auto Apply to Jobs", included: true },
        ],
        buttonText: "Get Pro Plan",
        popular: true,
    },
    {
        name: "Team Plan",
        desc: "For small teams & recruiters",
        price: "₹1,499",
        features: [
            { text: "Everything in Pro Plan", included: true },
            { text: "Team Collaboration", included: true },
            { text: "Shared Dashboard", included: true },
            { text: "Bulk Resume Upload", included: true },
            { text: "Advanced Analytics", included: true },
            { text: "Priority Support", included: true },
        ],
        buttonText: "Get Team Plan",
        popular: false,
    },
    {
        name: "Enterprise",
        desc: "For large organizations",
        price: "Custom",
        features: [
            { text: "Everything in Team Plan", included: true },
            { text: "Custom Integrations", included: true },
            { text: "Dedicated Account Manager", included: true },
            { text: "Advanced Security", included: true },
            { text: "SLA & Compliance", included: true },
            { text: "Custom Reporting", included: true },
        ],
        buttonText: "Contact Sales",
        popular: false,
    }
];

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: SW, background: "linear-gradient(to bottom, #d5ecfa, #e9f2f9)" }}>
            <Sidebar />
            
            <main style={{ flex: 1, padding: "60px 48px", marginLeft: "256px", display: "flex", flexDirection: "column" }} className="lg:ml-64 p-6 lg:p-12 overflow-x-hidden">
                <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
                    
                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: 60, position: "relative" }}>
                        <div style={{ display: "inline-block", padding: "8px 16px", borderRadius: 999, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.8)", marginBottom: 16 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: dark }}>Pricing Plans</span>
                        </div>
                        <h2 style={{ fontFamily: SG, fontSize: 48, fontWeight: 800, color: dark, letterSpacing: "-1.5px", marginBottom: 12 }}>
                            Simple Plans, <span style={{ color: "#3a7ca5" }}>Powerful Results</span>
                        </h2>
                        <p style={{ fontSize: 16, color: gray, maxWidth: 600, margin: "0 auto", fontWeight: 500 }}>
                            Choose the perfect plan to speed up your job search and land your dream role.
                        </p>
                        
                        {/* Toggle */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 32, gap: 16 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: !isYearly ? dark : gray, transition: "color 0.2s" }}>Monthly</span>
                            <div 
                                style={{ width: 56, height: 32, borderRadius: 999, background: dark, position: "relative", cursor: "pointer", border: "2px solid rgba(255,255,255,0.5)" }}
                                onClick={() => setIsYearly(!isYearly)}
                            >
                                <div style={{ width: 24, height: 24, borderRadius: "50%", background: white, position: "absolute", top: 2, left: isYearly ? 26 : 2, transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
                            </div>
                            <span style={{ fontSize: 15, fontWeight: 700, color: isYearly ? dark : gray, position: "relative", transition: "color 0.2s" }}>
                                Yearly <span style={{ color: "#059669", background: "#d1fae5", padding: "2px 8px", borderRadius: 999, fontSize: 12, marginLeft: 6 }}>Save 20%</span>
                            </span>
                        </div>
                    </div>

                    {/* Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginBottom: 64 }}>
                        {pricingPlans.map((plan, i) => (
                            <div 
                                key={i} 
                                style={{ 
                                    position: "relative", display: "flex", flexDirection: "column", padding: 32, borderRadius: 32, 
                                    background: plan.popular ? dark : "rgba(255,255,255,0.6)", 
                                    backdropFilter: plan.popular ? "none" : "blur(20px)",
                                    border: plan.popular ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.8)",
                                    boxShadow: plan.popular ? "0 24px 64px rgba(8,11,15,0.2)" : "0 10px 40px rgba(0,0,0,0.04)",
                                    transform: plan.popular ? "scale(1.02)" : "scale(1)",
                                    zIndex: plan.popular ? 10 : 1
                                }}
                            >
                                {plan.popular && (
                                    <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", padding: "6px 16px", borderRadius: 999, background: "linear-gradient(135deg, #3a7ca5, #1e4f6d)", boxShadow: "0 4px 12px rgba(58,124,165,0.4)" }}>
                                        <span style={{ fontSize: 11, fontWeight: 800, color: white, textTransform: "uppercase", letterSpacing: "0.1em" }}>Most Popular</span>
                                    </div>
                                )}
                                
                                <div style={{ marginBottom: 32 }}>
                                    <h3 style={{ fontFamily: SG, fontSize: 24, fontWeight: 800, color: plan.popular ? white : dark, marginBottom: 4 }}>{plan.name}</h3>
                                    <p style={{ fontSize: 13, fontWeight: 500, color: plan.popular ? "rgba(255,255,255,0.6)" : gray, marginBottom: 20 }}>{plan.desc}</p>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                                        <span style={{ fontFamily: SG, fontSize: 40, fontWeight: 800, color: plan.popular ? white : dark, letterSpacing: "-1px" }}>
                                            {isYearly && plan.price !== 'Custom' && plan.price !== '₹0' ? `₹${(parseInt(plan.price.replace('₹','').replace(',','')) * 0.8).toFixed(0)}` : plan.price}
                                        </span>
                                        {plan.price !== 'Custom' && (
                                            <span style={{ fontSize: 13, fontWeight: 700, color: plan.popular ? "rgba(255,255,255,0.5)" : gray }}>/month</span>
                                        )}
                                    </div>
                                    {isYearly && plan.price !== 'Custom' && plan.price !== '₹0' && (
                                        <p style={{ fontSize: 12, color: "#10b981", fontWeight: 700, marginTop: 4 }}>Billed annually</p>
                                    )}
                                </div>

                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                            {feature.included ? (
                                                <CheckCircleIcon style={{ width: 18, height: 18, color: plan.popular ? "#3a7ca5" : dark, flexShrink: 0, marginTop: 2 }} />
                                            ) : (
                                                <XCircleIcon style={{ width: 18, height: 18, color: plan.popular ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)", flexShrink: 0, marginTop: 2 }} />
                                            )}
                                            <span style={{ fontSize: 14, fontWeight: feature.included ? 600 : 500, color: feature.included ? (plan.popular ? white : dark) : (plan.popular ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"), lineHeight: "1.4" }}>
                                                {feature.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    style={{ 
                                        width: "100%", padding: "16px 24px", borderRadius: 16, fontFamily: SW, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                                        background: plan.popular ? white : "transparent",
                                        color: plan.popular ? dark : dark,
                                        border: plan.popular ? "none" : "2px solid rgba(8,11,15,0.1)",
                                        boxShadow: plan.popular ? "0 8px 24px rgba(255,255,255,0.1)" : "none"
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        if (plan.popular) e.currentTarget.style.boxShadow = "0 12px 32px rgba(255,255,255,0.15)";
                                        else {
                                            e.currentTarget.style.background = dark;
                                            e.currentTarget.style.color = white;
                                            e.currentTarget.style.borderColor = dark;
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = "none";
                                        if (plan.popular) e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,255,255,0.1)";
                                        else {
                                            e.currentTarget.style.background = "transparent";
                                            e.currentTarget.style.color = dark;
                                            e.currentTarget.style.borderColor = "rgba(8,11,15,0.1)";
                                        }
                                    }}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Features Banner */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: 32, borderRadius: 24, background: "rgba(255,255,255,0.4)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.6)", justifyContent: "space-between", boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                        {[
                            { icon: ShieldCheckIcon, title: "Secure & Private", desc: "Your data is always safe" },
                            { icon: BoltIcon, title: "Cancel Anytime", desc: "No hidden charges" },
                            { icon: HeadsetIcon, title: "24/7 Support", desc: "We're here to help" },
                            { icon: ArrowPathIcon, title: "Regular Updates", desc: "New features, always" }
                        ].map((item, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 16, background: white, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                                    <item.icon style={{ width: 24, height: 24, color: dark }} />
                                </div>
                                <div>
                                    <h4 style={{ fontFamily: SG, fontSize: 16, fontWeight: 800, color: dark, letterSpacing: "-0.5px" }}>{item.title}</h4>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: gray, marginTop: 2 }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
