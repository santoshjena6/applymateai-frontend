"use client";

const ApplicationTable = ({ applications }) => {
    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case "applied":
                return "bg-blue-50 text-blue-600 border-blue-100";
            case "interviewing":
                return "bg-purple-50 text-purple-600 border-purple-100";
            case "offer":
                return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "rejected":
                return "bg-rose-50 text-rose-600 border-rose-100";
            case "hired":
                return "bg-cyan-50 text-cyan-600 border-cyan-100";
            default:
                return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <div className="w-full overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Company</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Role</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date Applied</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {applications.map((app, index) => (
                            <tr key={index} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-blue-600 text-xs uppercase tracking-widest">
                                            {app.company.charAt(0)}
                                        </div>
                                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{app.company}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-xs font-bold text-slate-900 leading-none">{app.position}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.date}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors">
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApplicationTable;
