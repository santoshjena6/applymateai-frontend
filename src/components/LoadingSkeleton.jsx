"use client";

const LoadingSkeleton = ({ type = "card", count = 1 }) => {
    const skeletons = Array.from({ length: count });

    const renderSkeleton = (index) => {
        switch (type) {
            case "card":
                return (
                    <div key={index} className="glass p-6 rounded-2xl border border-white/10 animate-pulse">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10" />
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-white/10 rounded w-3/4" />
                                <div className="h-3 bg-white/10 rounded w-1/2" />
                                <div className="flex space-x-2 mt-4">
                                    <div className="h-4 bg-white/10 rounded-full w-16" />
                                    <div className="h-4 bg-white/10 rounded-full w-16" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between">
                            <div className="h-4 bg-white/10 rounded w-20" />
                            <div className="h-8 bg-white/10 rounded-xl w-24" />
                        </div>
                    </div>
                );
            case "stats":
                return (
                    <div key={index} className="glass p-6 rounded-2xl border border-white/10 animate-pulse">
                        <div className="flex justify-between">
                            <div className="space-y-3">
                                <div className="h-3 bg-white/10 rounded w-20" />
                                <div className="h-6 bg-white/10 rounded w-24" />
                                <div className="h-3 bg-white/10 rounded w-16" />
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white/10" />
                        </div>
                    </div>
                );
            case "table":
                return (
                    <div key={index} className="space-y-4 p-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="w-8 h-8 rounded-lg bg-white/10" />
                                <div className="h-4 bg-white/10 rounded flex-1" />
                                <div className="h-4 bg-white/10 rounded w-24" />
                                <div className="h-4 bg-white/10 rounded w-20" />
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`grid gap-6 ${type === "stats" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}>
            {skeletons.map((_, i) => renderSkeleton(i))}
        </div>
    );
};

export default LoadingSkeleton;
