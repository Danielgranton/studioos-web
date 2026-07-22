"use client";

export default function HeroStats() {

    const stats = [
        {
            value: "500+",
            label: "Studios",
        },
        {
            value: "10K+",
            label: "Producers",
        },
        {
            value: "50K+",
            label: "Beats",
        },
    ];

    return (
        <div className="flex flex-wrap gap-12">

            {stats.map((stat) => (

                <div key={stat.label}>

                    <p className="text-3xl font-bold text-white">
                        {stat.value}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                        {stat.label}
                    </p>

                </div>

            ))}

        </div>
    );
}