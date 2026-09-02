import Link from "next/link";
import { ArrowUpRight, Bell, LockKeyhole, UserRound } from "lucide-react";

const cards = [
    { href: "/dashboard/profile", label: "Profile", description: "Update your public identity, contact details, and role.", icon: UserRound },
    { href: "/dashboard/settings#notifications", label: "Notifications", description: "Choose where StudioOS updates can reach you.", icon: Bell },
    { href: "/dashboard/sessions", label: "Security", description: "Review active devices and revoke access you do not recognize.", icon: LockKeyhole },
];

export default function DashboardPage() {
    return (
        <div className="mx-auto max-w-6xl py-10 text-[#f1f1f1] sm:py-14">
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3ea6ff]">Workspace</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Your StudioOS dashboard</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#888]">A quick path to your account, preferences, and security controls.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {cards.map(({ href, label, description, icon: Icon }) => (
                    <Link key={href} href={href} className="group rounded-2xl border border-[#3f3f3f] bg-[#151515] p-5 transition hover:border-[#3ea6ff]/50 hover:bg-[#191919]">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3ea6ff]/10 text-[#3ea6ff]"><Icon size={19} /></span>
                        <span className="mt-5 flex items-center justify-between gap-3"><span className="text-base font-semibold">{label}</span><ArrowUpRight size={16} className="text-[#666] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#3ea6ff]" /></span>
                        <span className="mt-2 block text-sm leading-6 text-[#888]">{description}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
