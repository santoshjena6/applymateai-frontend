"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  SparklesIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";

export default function LandingPage() {
  const features = [
    {
      title: "AI Resume Scan",
      description: "Our advanced AI parses your resume to extract skills and match them with high-paying job opportunities.",
      icon: CpuChipIcon,
    },
    {
      title: "Smart Job Matching",
      description: "Get a match score for every job with detailed insights on why you're a good fit or what skills you're missing.",
      icon: SparklesIcon,
    },
    {
      title: "Auto Apply Flow",
      description: "Apply to multiple jobs with a single click. Our AI optimizes your application for each specific role.",
      icon: RocketLaunchIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 mb-10">
            <SparklesIcon className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">AI-Powered Job Automation</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Let AI Apply <br />
            <span className="text-blue-600">Jobs For You</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-12 leading-relaxed font-medium">
            The automated job search platform for developers. Upload your resume, match with top companies, and let our AI handle the applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/register"
              className="px-10 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center group"
            >
              Get Started for Free
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-10 py-4 bg-white border border-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              View Demo
            </Link>
          </div>

          <div className="mt-24 relative max-w-5xl mx-auto">
            <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
                alt="Dashboard Preview"
                className="rounded-xl w-full h-auto brightness-[0.98]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 border-t border-slate-50 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Next-Gen Job Application Tools</h2>
            <p className="mt-4 text-slate-500 font-medium">Precision engineering for your career growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-10 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group shadow-sm">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div>
                <p className="text-4xl font-black text-blue-600 mb-2">10k+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Users</p>
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 mb-2">50k+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jobs Applied</p>
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 mb-2">85%</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</p>
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 mb-2">2x</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faster Hires</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-2">
            <BriefcaseIcon className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-black text-slate-900 tracking-tight">ApplyMate AI</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 ApplyMate AI. All rights reserved.</p>
          <div className="flex space-x-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">
            <Link href="#" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
