"use client";

export default function SearchLoading() {
    return (
        <div className="p-6">

            <div className="mb-4 h-4 w-32 animate-pulse rounded bg-slate-700" />

            <div className="space-y-3">

                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="flex items-center gap-4"
                    >
                        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-700" />

                        <div className="flex-1 space-y-2">

                            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-700" />

                            <div className="h-3 w-1/3 animate-pulse rounded bg-slate-800" />

                        </div>
                    </div>
                ))}

            </div>

        </div>
    );
}