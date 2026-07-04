"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { ShieldCheckIcon, BoltIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

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
        name: "Enterprise Plan",
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
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar />
            
            <main className="flex-1 lg:ml-64 bg-[#FAFBFF] overflow-hidden flex flex-col justify-center px-4 py-2">
                <div className="w-full max-w-6xl mx-auto transform scale-[0.85] 2xl:scale-100 origin-center">
                    {/* Header */}
                    <div className="text-center mb-6 relative">
                        {/* Sparkles */}
                        <div className="absolute top-0 left-[20%] hidden lg:block">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0L13.8868 8.11319L22 10L13.8868 11.8868L12 20L10.1132 11.8868L2 10L10.1132 8.11319L12 0Z" fill="#4F46E5"/>
                            </svg>
                        </div>
                        <div className="absolute top-12 left-[21%] hidden lg:block opacity-30">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0L13.8868 8.11319L22 10L13.8868 11.8868L12 20L10.1132 11.8868L2 10L10.1132 8.11319L12 0Z" fill="#4F46E5"/>
                            </svg>
                        </div>
                        <div className="absolute top-10 right-[20%] hidden lg:block">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0L13.8868 8.11319L22 10L13.8868 11.8868L12 20L10.1132 11.8868L2 10L10.1132 8.11319L12 0Z" fill="#4F46E5"/>
                            </svg>
                        </div>
                        <div className="absolute top-[4.5rem] right-[23%] hidden lg:block opacity-80">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0L13.8868 8.11319L22 10L13.8868 11.8868L12 20L10.1132 11.8868L2 10L10.1132 8.11319L12 0Z" fill="#4F46E5"/>
                            </svg>
                        </div>

                        <div className="inline-block px-3 py-1 rounded-full mb-3" style={{ backgroundColor: "#EEF2FF" }}>
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#4F46E5" }}>Pricing Plans</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-gray-900">
                            Simple Plans, <span style={{ color: "#4F46E5" }}>Powerful Results</span>
                        </h2>
                        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                            Choose the perfect plan to speed up your job search and land your dream role.
                        </p>
                        
                        {/* Toggle */}
                        <div className="flex items-center justify-center mt-4 space-x-3">
                            <span className={`text-sm font-semibold ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
                            <div 
                                className="relative w-12 h-6 rounded-full cursor-pointer transition-colors" 
                                style={{ backgroundColor: "#4F46E5" }}
                                onClick={() => setIsYearly(!isYearly)}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isYearly ? 'left-7' : 'left-1'}`}></div>
                            </div>
                            <span className={`text-sm font-semibold relative ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                                Yearly <span style={{ color: "#4F46E5" }}>(Save 20%)</span>
                                
                                {/* Hand drawn arrow */}
                                <div className="absolute -right-14 -top-3 w-10 h-8 hidden sm:block">
                                    <svg width="100%" height="100%" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M38 2C26 0 14 7 3 15M3 15L11 14M3 15L6 22" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </span>
                        </div>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 max-w-6xl mx-auto mb-6">
                        {pricingPlans.map((plan, i) => (
                            <div 
                                key={i} 
                                className={`relative flex flex-col p-6 rounded-2xl bg-white ${plan.popular ? 'shadow-lg scale-105 z-10' : 'shadow-sm hover:shadow-md'}`}
                                style={{ 
                                    border: plan.popular ? "2px solid #4F46E5" : "1px solid #E5E7EB",
                                    transition: "all 0.2s"
                                }}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full brand-gradient">
                                        <span className="text-[10px] font-bold text-white tracking-wider">Most Popular</span>
                                    </div>
                                )}
                                
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-0.5">{plan.name}</h3>
                                    <p className="text-[11px] text-gray-500 mb-3">{plan.desc}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black" style={{ color: plan.popular ? "#4F46E5" : "#4F46E5" }}>
                                            {isYearly && plan.price !== 'Custom' && plan.price !== '₹0' ? `₹${(parseInt(plan.price.replace('₹','').replace(',','')) * 0.8).toFixed(0)}` : plan.price}
                                        </span>
                                        <span className="text-[10px] font-medium text-gray-500">/month</span>
                                    </div>
                                    {isYearly && plan.price !== 'Custom' && plan.price !== '₹0' && (
                                        <p className="text-[10px] text-green-500 font-semibold mt-1">Billed annually</p>
                                    )}
                                </div>

                                <div className="flex-grow space-y-2.5 mb-4">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-2">
                                            {feature.included ? (
                                                <CheckCircleIcon className="w-4 h-4 shrink-0" style={{ color: "#4F46E5" }} />
                                            ) : (
                                                <XCircleIcon className="w-4 h-4 shrink-0 text-gray-300" />
                                            )}
                                            <span className={`text-[12px] leading-tight ${feature.included ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                                                {feature.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                                        plan.popular 
                                            ? "text-white hover:opacity-90 shadow-md" 
                                            : "bg-white hover:bg-gray-50"
                                    }`}
                                    style={plan.popular ? { backgroundColor: "#4F46E5" } : { border: "1px solid #C7D2FE", color: "#4F46E5" }}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Features Banner */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-gray-50/50 max-w-5xl mx-auto" style={{ border: "1px solid #F3F4F6" }}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#EEF2FF" }}>
                                <ShieldCheckIcon className="w-4 h-4" style={{ color: "#4F46E5" }} />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-900">Secure & Private</h4>
                                <p className="text-[9px] text-gray-500 mt-0.5">Your data is always safe</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#EEF2FF" }}>
                                <BoltIcon className="w-4 h-4" style={{ color: "#4F46E5" }} />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-900">Cancel Anytime</h4>
                                <p className="text-[9px] text-gray-500 mt-0.5">No hidden charges</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#EEF2FF" }}>
                                <HeadsetIcon className="w-4 h-4" style={{ color: "#4F46E5" }} />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-900">24/7 Support</h4>
                                <p className="text-[9px] text-gray-500 mt-0.5">We're here to help</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#EEF2FF" }}>
                                <ArrowPathIcon className="w-4 h-4" style={{ color: "#4F46E5" }} />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-900">Regular Updates</h4>
                                <p className="text-[9px] text-gray-500 mt-0.5">New features, always</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
