"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
    ArrowRight,
    BadgeHelp,
    Building2,
    CheckCircle2,
    ChevronRight,
    CircleAlert,
    FileAudio,
    LifeBuoy,
    Search,
    ShieldCheck,
    ShoppingBag,
    UploadCloud,
    UserRound,
    RefreshCw,
} from "lucide-react";

import BackButton from "@/constants/BackButton";

import { HelpService } from "../services/help.service";
import type { HelpArticleSummary, HelpCategory as HelpCategoryRecord } from "../types/help";

type HelpFilter = "All" | "Getting started" | "Beat marketplace" | "Studios" | "Uploads & media" | "Payments" | "Account & security";

const defaultCategories: { label: HelpFilter; icon: typeof Search }[] = [
    { label: "All", icon: BadgeHelp },
    { label: "Getting started", icon: UserRound },
    { label: "Beat marketplace", icon: ShoppingBag },
    { label: "Studios", icon: Building2 },
    { label: "Uploads & media", icon: UploadCloud },
    { label: "Payments", icon: FileAudio },
    { label: "Account & security", icon: ShieldCheck },
];

const roleLinks = [
    { role: "I am a producer", text: "Upload beats, manage licenses, and understand processing.", icon: FileAudio, accent: "#e8a33d" },
    { role: "I am an artist", text: "Find studios, discover beats, and prepare your next session.", icon: UserRound, accent: "#5eead4" },
    { role: "I manage a studio", text: "Keep your listing, gallery, and availability up to date.", icon: Building2, accent: "#a78bfa" },
];

export function HelpCenterPage() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<HelpFilter>("All");
    const [availableCategories, setAvailableCategories] = useState(defaultCategories);
    const [articles, setArticles] = useState<HelpArticleSummary[] | null>(null);
    const [popularArticles, setPopularArticles] = useState<HelpArticleSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const categorySlug = category === "All" ? undefined : slugForCategory(category);

    const loadLibrary = useCallback(async () => {
        setLoading(true);
        setLoadError(false);
        try {
            const [categoryRecords, response, popular] = await Promise.all([
                HelpService.getCategories(),
                HelpService.searchArticles({ query: query.trim() || undefined, category: categorySlug, size: 50 }),
                HelpService.getPopularArticles(),
            ]);
            setAvailableCategories([defaultCategories[0], ...categoryRecords.map(toCategoryOption)]);
            setArticles(response.content);
            setPopularArticles(popular);
        } catch {
            setLoadError(true);
            setArticles(null);
        } finally {
            setLoading(false);
        }
    }, [categorySlug, query]);

    useEffect(() => {
        void loadLibrary();
    }, [loadLibrary]);

    return (
        <main className="min-h-screen bg-[#0f0f0f] text-[#f5f4f1]">
            <section className="relative overflow-hidden border-b border-[#292722] bg-[#0f0f0f]">
                <div className="relative mx-auto max-w-[1180px] px-5 pb-8 pt-5 sm:px-8 sm:pb-10 sm:pt-7">
                    <BackButton />
                    <div className="mt-7 grid items-center gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
                        <div>
                            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]"><LifeBuoy size={13} /> StudioOS support</span>
                            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">How can we help?</h1>
                            <p className="mt-2 max-w-md text-xs leading-6 text-[#aaa49a] sm:text-sm">Clear answers for beats, studios, uploads, payments, and your creative workspace.</p>
                        </div>
                        <div>
                            <label className="flex items-center gap-3 rounded-xl border border-[#40382d] bg-[#1b1916] px-3.5 py-3 text-left shadow-lg focus-within:border-[#e8a33d]/70"><Search size={17} className="shrink-0 text-[#e8a33d]" /><span className="sr-only">Search the Help Center</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search help articles" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#777169]" /></label>
                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#777169]"><span>Popular:</span>{popularArticles.slice(0, 3).map((article) => <button key={article.title} type="button" onClick={() => setQuery(article.title)} className="text-[#c5a66c] transition hover:text-[#f0bd65]">{article.title}</button>)}</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8 sm:py-14">
                <section>
                    <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]">Start here</p><h2 className="mt-2 text-2xl font-bold tracking-tight">Help for your workflow</h2></div><span className="hidden text-xs text-[#777169] sm:block">Choose the path that sounds like you</span></div>
                    <div className="mt-5 grid gap-3 md:grid-cols-3">{roleLinks.map(({ role, text, icon: Icon, accent }) => <button key={role} type="button" onClick={() => setQuery(role.replace("I am ", ""))} className="group rounded-2xl border border-[#2b2925] bg-[#161513] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#4a4031] hover:bg-[#1b1916]"><span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}18`, color: accent }}><Icon size={18} /></span><h3 className="mt-4 text-sm font-bold text-white">{role}</h3><p className="mt-1 text-xs leading-5 text-[#858078]">{text}</p><span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-[#c5a66c]">Explore help <ArrowRight size={13} className="transition group-hover:translate-x-1" /></span></button>)}</div>
                </section>

                <section className="mt-12">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]">Browse the library</p><h2 className="mt-2 text-2xl font-bold tracking-tight">What do you need help with?</h2></div><div className="flex gap-1.5 overflow-x-auto pb-1">{availableCategories.map(({ label, icon: Icon }) => <button key={label} type="button" onClick={() => setCategory(label)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${category === label ? "border-[#e8a33d]/40 bg-[#e8a33d]/10 text-[#e8a33d]" : "border-[#2a2825] bg-[#161513] text-[#99938a] hover:text-white"}`}><Icon size={13} />{label}</button>)}</div></div>
                    {loading ? <HelpLibraryLoading /> : loadError ? <HelpLibraryError onRetry={() => void loadLibrary()} /> : !articles || articles.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-[#3a3027] bg-[#151311] px-6 py-14 text-center"><CircleAlert size={24} className="mx-auto text-[#e8a33d]" /><h3 className="mt-4 text-base font-semibold">No help articles found</h3><p className="mt-2 text-sm text-[#777169]">Try a different search or browse another category.</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); }} className="mt-5 rounded-xl border border-[#4a4031] px-4 py-2.5 text-xs font-semibold text-[#ddd5c8] hover:bg-[#211d18]">Clear search</button></div> : <div className="mt-6 grid gap-3 md:grid-cols-2">{articles.map((article) => <ArticleCard key={article.id} article={article} />)}</div>}
                </section>

                <section className="mt-12 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-2xl border border-[#2b2925] bg-[#161513] p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]">Common fixes</p><h2 className="mt-2 text-xl font-bold">Troubleshooting shortcuts</h2></div><CircleAlert size={20} className="text-[#e8a33d]" /></div><div className="mt-5 grid gap-2 sm:grid-cols-2"><QuickFix text="My beat upload is stuck" /><QuickFix text="My preview is not playing" /><QuickFix text="My media job failed" /><QuickFix text="I cannot complete a payment" /></div></div>
                    <div className="relative overflow-hidden rounded-2xl border border-[#4a4031] bg-[linear-gradient(135deg,#211b13,#171513)] p-5 sm:p-6"><div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#e8a33d]/10 blur-3xl" /><div className="relative"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]">Still need a hand?</p><h2 className="mt-2 text-xl font-bold">Talk to StudioOS support</h2><p className="mt-2 text-xs leading-5 text-[#aaa49a]">Tell us what happened and include the beat, studio, or transaction involved. We will help you find the next step.</p><button type="button" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-2.5 text-xs font-bold text-[#17130c] transition hover:bg-[#f0b458]"><LifeBuoy size={14} /> Contact support <ArrowRight size={14} /></button></div></div>
                </section>
            </div>
        </main>
    );
}

function ArticleCard({ article }: { article: HelpArticleSummary }) {
    return <Link href={`/help/${article.categorySlug}/${article.slug}`} className="group flex items-start justify-between gap-4 rounded-2xl border border-[#2b2925] bg-[#161513] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#4a4031] hover:bg-[#1b1916]"><div className="min-w-0"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#c5a66c]">{article.categoryName}</span><h3 className="mt-2 text-sm font-bold text-white">{article.title}</h3><p className="mt-1.5 text-xs leading-5 text-[#858078]">{article.excerpt}</p><p className="mt-3 text-[10px] text-[#6f6a62]">{article.readTimeMinutes} min read</p></div><ChevronRight size={17} className="mt-1 shrink-0 text-[#6f6a62] transition group-hover:translate-x-1 group-hover:text-[#e8a33d]" /></Link>;
}

function slugForCategory(label: HelpFilter) { return label.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-"); }
function toCategoryOption(category: HelpCategoryRecord) { const fallback = defaultCategories.find((item) => item.label.toLowerCase() === category.name.toLowerCase()); return { label: (category.name as HelpFilter), icon: fallback?.icon ?? BadgeHelp }; }
function HelpLibraryLoading() { return <div className="mt-6 grid gap-3 md:grid-cols-2">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="animate-pulse rounded-2xl border border-[#2b2925] bg-[#161513] p-4"><div className="h-2 w-24 rounded bg-[#292621]" /><div className="mt-4 h-4 w-3/4 rounded bg-[#292621]" /><div className="mt-3 h-3 w-full rounded bg-[#24211d]" /><div className="mt-2 h-3 w-2/3 rounded bg-[#24211d]" /></div>)}</div>; }
function HelpLibraryError({ onRetry }: { onRetry: () => void }) { return <div className="mt-6 rounded-2xl border border-red-300/15 bg-red-300/[0.04] px-6 py-10 text-center"><CircleAlert size={22} className="mx-auto text-red-300" /><h3 className="mt-3 text-sm font-semibold">Help articles could not load</h3><p className="mt-1 text-xs text-[#938e84]">The Help Center is temporarily unavailable.</p><button type="button" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-2.5 text-xs font-bold text-[#17130c]"><RefreshCw size={14} /> Try again</button></div>; }

function QuickFix({ text }: { text: string }) { return <button type="button" className="flex items-center justify-between rounded-xl border border-[#2b2925] bg-[#1b1916] px-3 py-2.5 text-left text-xs text-[#c4bdb3] transition hover:border-[#e8a33d]/30 hover:text-white"><span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#5eead4]" />{text}</span><ChevronRight size={14} className="text-[#6f6a62]" /></button>; }
