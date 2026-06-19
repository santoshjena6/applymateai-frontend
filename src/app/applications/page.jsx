"use client";

import Sidebar from "@/components/Sidebar";
import ApplicationTable from "@/components/ApplicationTable";
import { FunnelIcon, CalendarIcon } from "@heroicons/react/24/outline";

const allApplications = [
    { company: "Google", position: "Senior Frontend Engineer", date: "Mar 08, 2026", status: "Interviewing", type: "Full-time" },
    { company: "Stripe", position: "Product Designer", date: "Mar 07, 2026", status: "Applied", type: "Contract" },
    { company: "Vercel", position: "Fullstack Developer", date: "Mar 05, 2026", status: "Hired", type: "Full-time" },
    { company: "Linear", position: "Software Engineer", date: "Mar 02, 2026", status: "Rejected", type: "Full-time" },
    { company: "Github", position: "DevOps Engineer", date: "Feb 28, 2026", status: "Applied", type: "Full-time" },
    { company: "Figma", position: "UI Engineer", date: "Feb 25, 2026", status: "Interviewing", type: "Full-time" },
];

export default function ApplicationsPage() {
    return (
        <div className="flex min-h-screen bg-bg-light">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
                        <p className="text-foreground/50 mt-1">Track and manage your {allApplications.length} active job applications.</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2.5 glass border border-white/10 rounded-xl text-sm font-semibold text-foreground/60 hover:text-primary transition-colors">
                            <CalendarIcon className="w-5 h-5" />
                            <span>Mar 2026</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2.5 glass border border-white/10 rounded-xl text-sm font-semibold text-foreground/60 hover:text-primary transition-colors">
                            <FunnelIcon className="w-5 h-5" />
                            <span>Filter</span>
                        </button>
                    </div>
                </header>

                <section className="space-y-6">
                    <div className="flex items-center space-x-6 pb-2 border-b border-white/5">
                        {["All", "Applied", "In Progress", "Closed"].map((tab, i) => (
                            <button
                                key={tab}
                                className={`text-sm font-bold pb-2 transition-all relative ${i === 0 ? "text-primary" : "text-foreground/40 hover:text-foreground/60"
                                    }`}
                            >
                                {tab}
                                {i === 0 && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
                            </button>
                        ))}
                    </div>

                    <ApplicationTable applications={allApplications} />
                </section>

                {/* Analytics Card */}
                <div className="mt-10 p-8 glass rounded-[2rem] border border-white/10 bg-linear-to-r from-primary/5 to-secondary/5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-bold text-foreground">Weekly Progress</h3>
                            <p className="text-sm text-foreground/50 mt-1">You've applied to 5 more jobs than last week. Great job!</p>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-bold text-primary">12</span>
                                <span className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest">Applications</span>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-bold text-secondary">3</span>
                                <span className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest">Interviews</span>
                            </div>
                        </div>
                        <button className="px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg">
                            Download Report
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
