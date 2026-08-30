"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import {
    ArrowRight,
    ArrowUpRight,
    CalendarCheck,
    Check,
    Headphones,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Sparkles,
    Users,
} from "lucide-react";

import { NavbarLogo } from "../navbar";

type FooterLink = {
    label: string;
    href: string;
};

const exploreLinks: FooterLink[] = [
    { label: "Hero", href: "/#hero" },
    { label: "Explore", href: "/#explore" },
    { label: "Studios", href: "/#studios" },
    { label: "Producers", href: "/#producers" },
];

const creatorLinks: FooterLink[] = [
    { label: "Beats", href: "/#beats" },
    { label: "Projects", href: "/#projects" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Marketplace", href: "/marketplace" },
];

const businessLinks: FooterLink[] = [
    { label: "Services", href: "/#services" },
    { label: "Bookings", href: "/bookings" },
    { label: "Reviews", href: "/reviews" },
    { label: "Sponsored", href: "/sponsored" },
];

const supportLinks: FooterLink[] = [
    { label: "Help Center", href: "/help" },
    { label: "hello@studioos.app", href: "mailto:hello@studioos.app" },
    { label: "+254 700 123 456", href: "tel:+254700123456" },
    { label: "Nairobi, Kenya", href: "https://maps.google.com/?q=Nairobi,Kenya" },
];

const footerHighlights = [
    "Curated studios",
    "Verified talent",
    "Fast bookings",
    "Creator-first tools",
];

const footerStats = [
    { value: "200+", label: "Studios onboarded" },
    { value: "12K+", label: "Bookings completed" },
    { value: "4.9", label: "Average creator rating" },
];

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]";

export function Footer() {
    return (
        <footer className="relative mt-16 overflow-hidden border-t border-[#3f3f3f]/60 bg-[#090909] sm:px-10 md:px-15 lg:px-20">
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-[#3ea6ff]/30
                    to-transparent
                "
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <div className="absolute -left-16 top-0 h-96 w-96 rounded-full bg-[#3ea6ff]/5 blur-[140px]" />
                <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-[#e8a33d]/10 blur-[120px]" />
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #3ea6ff 1px, transparent 1px), linear-gradient(to bottom, #3ea6ff 1px, transparent 1px)",
                        backgroundSize: "58px 58px",
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-[1600px] px-6 py-10 lg:py-12">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
                    <div>
                        <div className="flex items-center gap-3">
                            <NavbarLogo compact />
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#3ea6ff]/20 bg-[#3ea6ff]/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#3ea6ff]">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ea6ff] opacity-60" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3ea6ff]" />
                                </span>
                                Live network
                            </span>
                        </div>

                        <div className="mt-6 max-w-3xl">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#717171]">
                                StudioOS footer
                            </p>
                            <h2 className="mt-2 max-w-2xl text-2xl font-black tracking-tight text-[#f1f1f1] sm:text-3xl lg:text-4xl">
                                Build your next release with a platform that
                                actually{" "}
                                <span className="bg-gradient-to-r from-[#3ea6ff] via-[#6eb8ff] to-[#e8a33d] bg-clip-text text-transparent">
                                    keeps up.
                                </span>
                            </h2>
                            <p className="mt-4 max-w-2xl text-xs leading-6 text-[#aaaaaa] sm:text-sm sm:leading-7">
                                Discover studios, book producers, source beats,
                                and manage the path from first idea to final
                                release without losing momentum.
                            </p>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {footerHighlights.map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-[#3f3f3f] bg-[#111111] px-2.5 py-1 text-[10px] text-[#c9c9c9]"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>

                        <div className="mt-6 grid gap-2 sm:grid-cols-3">
                            <ContactCard
                                href="mailto:hello@studioos.app"
                                icon={<Mail size={18} />}
                                label="Email"
                                value="hello@studioos.app"
                            />
                            <ContactCard
                                href="tel:+254700123456"
                                icon={<Phone size={18} />}
                                label="Call"
                                value="+254 700 123 456"
                            />
                            <ContactCard
                                href="https://maps.google.com/?q=Nairobi,Kenya"
                                icon={<MapPin size={18} />}
                                label="Location"
                                value="Nairobi, Kenya"
                            />
                        </div>
                    </div>

                    <aside className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-3.5 shadow-2xl shadow-black/25 lg:px-4 lg:py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#717171]">
                                    Join the list
                                </p>
                                <h3 className="mt-1 text-sm font-semibold leading-5 text-[#f1f1f1]">
                                    Get drops, launches, and booking updates.
                                </h3>
                            </div>
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3ea6ff]/10 text-[#3ea6ff]">
                                <Sparkles size={14} />
                            </div>
                        </div>

                        <NewsletterForm />

                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                            {footerStats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-lg border border-white/5 bg-black/20 px-2.5 py-2.5"
                                >
                                    <div className="font-mono text-lg font-bold text-[#f1f1f1]">
                                        {stat.value}
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-[#9a9a9a]">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>

                <div className="mt-9 grid gap-6 border-t border-white/10 pt-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f1f1f1]">
                            Built for
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#c9c9c9]">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#3f3f3f] bg-[#111111] px-3 py-2">
                                <Users size={13} className="text-[#3ea6ff]" />
                                Artists
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#3f3f3f] bg-[#111111] px-3 py-2">
                                <Headphones size={13} className="text-[#3ea6ff]" />
                                Producers
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#3f3f3f] bg-[#111111] px-3 py-2">
                                <CalendarCheck size={13} className="text-[#3ea6ff]" />
                                Studios
                            </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Link
                                href="/#hero"
                                className={`inline-flex items-center gap-2 rounded-full border border-[#3ea6ff]/30 bg-[#3ea6ff]/10 px-3 py-2 text-xs font-semibold text-[#f1f1f1] transition hover:border-[#3ea6ff]/50 hover:bg-[#3ea6ff]/15 ${FOCUS_RING}`}
                            >
                                Back to top
                                <ArrowUpRight size={14} />
                            </Link>
                            <Link
                                href="/marketplace"
                                className={`inline-flex items-center gap-2 rounded-full border border-[#3f3f3f] bg-[#111111] px-3 py-2 text-xs font-semibold text-[#f1f1f1] transition hover:border-[#5a5a5a] hover:bg-[#181818] ${FOCUS_RING}`}
                            >
                                Open marketplace
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    <nav aria-label="Footer" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        <FooterColumn title="Explore" links={exploreLinks} />
                        <FooterColumn title="Creators" links={creatorLinks} />
                        <FooterColumn title="Business" links={businessLinks} />
                        <FooterColumn title="Support" links={supportLinks} />
                    </nav>
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-[#717171]">
                        © {new Date().getFullYear()} StudioOS. Built for music that moves.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#aaaaaa]">
                        <span className="inline-flex items-center gap-1.5">
                            <Users size={13} className="text-[#3ea6ff]" />
                            Creators first
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Headphones size={13} className="text-[#3ea6ff]" />
                            Audio native
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarCheck size={13} className="text-[#3ea6ff]" />
                            Book faster
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function ContactCard({
    href,
    icon,
    label,
    value,
}: {
    href: string;
    icon: ReactNode;
    label: string;
    value: string;
}) {
    const external = href.startsWith("http");

    return (
        <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className={`group flex items-center gap-2.5 rounded-xl border border-[#3f3f3f] bg-[#111111] px-3 py-2.5 transition hover:border-[#3ea6ff]/40 hover:bg-[#171717] ${FOCUS_RING}`}
        >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3ea6ff]/10 text-[#3ea6ff]">
                {icon}
            </span>
            <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-[0.16em] text-[#717171]">
                    {label}
                </span>
                <span className="block truncate text-xs font-medium text-[#f1f1f1]">
                    {value}
                </span>
            </span>
        </a>
    );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
    return (
        <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f1f1f1]">
                {title}
            </h2>

            <ul className="mt-3 space-y-0.5">
                {links.map((link) => {
                    const external =
                        link.href.startsWith("http") ||
                        link.href.startsWith("mailto:") ||
                        link.href.startsWith("tel:");
                    const className =
                        "group flex items-center justify-between gap-3 rounded-lg border border-transparent px-2.5 py-1.5 text-xs text-[#aaaaaa] transition hover:border-[#3f3f3f] hover:bg-[#111111] hover:text-[#f1f1f1]";

                    return (
                        <li key={link.label}>
                            {external ? (
                                <a
                                    href={link.href}
                                    target={link.href.startsWith("http") ? "_blank" : undefined}
                                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                                    className={className}
                                >
                                    <span>{link.label}</span>
                                    <ArrowUpRight
                                        size={14}
                                        className="text-[#717171] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#3ea6ff]"
                                    />
                                </a>
                            ) : (
                                <Link href={link.href} className={className}>
                                    <span>{link.label}</span>
                                    <ArrowUpRight
                                        size={14}
                                        className="text-[#717171] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#3ea6ff]"
                                    />
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

type SubscribeState = "idle" | "loading" | "success" | "error";

function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [state, setState] = useState<SubscribeState>("idle");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setState("error");
            return;
        }

        setState("loading");

        try {
            // TODO: wire to a real subscribe endpoint.
            await new Promise((resolve) => setTimeout(resolve, 600));
            setState("success");
            setEmail("");
        } catch {
            setState("error");
        }
    }

    return (
        <div className="mt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="footer-email" className="sr-only">
                    Email address
                </label>
                <input
                    id="footer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (state !== "idle") setState("idle");
                    }}
                    placeholder="you@email.com"
                    className={`w-full rounded-full border border-[#3f3f3f] bg-[#0c0c0c] px-4 py-2.5 text-xs text-[#f1f1f1] placeholder:text-[#717171] transition focus:border-[#3ea6ff]/60 sm:max-w-xs ${FOCUS_RING}`}
                />
                <button
                    type="submit"
                    disabled={state === "loading"}
                    className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#3ea6ff] px-4 py-2.5 text-xs font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:opacity-60 ${FOCUS_RING}`}
                >
                    {state === "loading" ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : state === "success" ? (
                        <Check size={16} />
                    ) : (
                        <ArrowRight size={16} />
                    )}
                    {state === "success" ? "Subscribed" : "Join the list"}
                </button>
            </form>

            <p aria-live="polite" className="mt-2 min-h-[1.25rem] text-xs">
                {state === "error" && (
                    <span className="text-red-400">Enter a valid email address.</span>
                )}
                {state === "success" && (
                    <span className="text-[#3ea6ff]">You&apos;re on the list - welcome aboard.</span>
                )}
            </p>
        </div>
    );
}
