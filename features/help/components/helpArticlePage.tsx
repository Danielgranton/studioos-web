"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, Copy, RefreshCw, Share2 } from "lucide-react";

import BackButton from "@/constants/BackButton";

import { HelpService } from "../services/help.service";
import type { HelpArticle } from "../types/help";

export function HelpArticlePage({ categorySlug, slug }: { categorySlug: string; slug: string }) {
    const [article, setArticle] = useState<HelpArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | "error" | null>(null);
    const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

    const loadArticle = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            setArticle(await HelpService.getArticle(slug));
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        void loadArticle();
    }, [loadArticle]);

    async function submitFeedback(helpful: boolean) {
        if (!article || feedbackSubmitting || feedback) return;
        setFeedbackSubmitting(true);
        try {
            await HelpService.submitFeedback(article.slug, helpful);
            setFeedback(helpful ? "helpful" : "not-helpful");
        } catch {
            setFeedback("error");
        } finally {
            setFeedbackSubmitting(false);
        }
    }

    if (loading) return <ArticleLoading />;
    if (error || !article) return <ArticleError onRetry={() => void loadArticle()} />;
    const articleCategorySlug = article.categorySlug || categorySlug;

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#0f0f0f] text-[#f5f4f1]">
            <div className="mx-auto max-w-[1120px] px-5 py-6 sm:px-8 sm:py-9">
                <div className="flex items-center justify-between gap-4">
                    <BackButton />
                    <Link href="/help" className="inline-flex items-center gap-2 text-xs font-semibold text-[#9a948a] transition hover:text-white"><ArrowLeft size={14} /> Help Center</Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-2 text-[11px] text-[#777169]">
                    <Link href="/help" className="transition hover:text-white">Help Center</Link><span>/</span><Link href={`/help/${articleCategorySlug}`} className="transition hover:text-white">{article.categoryName}</Link><span>/</span><span className="truncate text-[#c5a66c]">{article.title}</span>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
                    <article>
                        <div className="border-b border-[#2b2925] pb-7"><span className="inline-flex items-center gap-2 rounded-full border border-[#e8a33d]/20 bg-[#e8a33d]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#e8a33d]"><BookOpen size={12} /> {article.categoryName}</span><h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">{article.title}</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[#aaa49a]">{article.excerpt}</p><div className="mt-5 flex flex-wrap items-center gap-4 text-[11px] text-[#777169]"><span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{article.readTimeMinutes} min read</span><span>{article.viewCount.toLocaleString()} views</span><span>{article.audience === "ALL" ? "For everyone" : `${article.audience.toLowerCase().replace("_", " ")} guide`}</span></div></div>
                        <div className="prose-studioos mt-8 whitespace-pre-line text-sm leading-8 text-[#c4bdb3]">{article.content}</div>
                        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#2b2925] pt-5"><div><p className="text-xs font-semibold text-white">Was this helpful?</p><p className="mt-1 text-[10px] text-[#777169]">Your feedback helps us improve StudioOS support.</p></div><div className="flex items-center gap-2">{feedback === "helpful" || feedback === "not-helpful" ? <span className="text-xs text-[#5eead4]">Thanks for the feedback.</span> : feedback === "error" ? <span className="text-xs text-red-300">Could not save feedback.</span> : <><button type="button" disabled={feedbackSubmitting} onClick={() => void submitFeedback(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#2b2925] bg-[#161513] px-3 py-2 text-xs text-[#bdb6ab] transition hover:border-[#e8a33d]/40 hover:text-white disabled:cursor-wait disabled:opacity-50"><Check size={13} /> Yes</button><button type="button" disabled={feedbackSubmitting} onClick={() => void submitFeedback(false)} className="rounded-lg border border-[#2b2925] bg-[#161513] px-3 py-2 text-xs text-[#bdb6ab] transition hover:border-[#e8a33d]/40 hover:text-white disabled:cursor-wait disabled:opacity-50">Not quite</button></>}</div></div>
                    </article>

                    <aside className="h-fit space-y-3 lg:sticky lg:top-24"><div className="rounded-2xl border border-[#2b2925] bg-[#161513] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8a33d]">Article tools</p><button type="button" onClick={() => void copyLink()} className="mt-4 flex w-full items-center gap-2 rounded-xl border border-[#2b2925] px-3 py-2.5 text-left text-xs text-[#c4bdb3] transition hover:border-[#e8a33d]/40 hover:text-white">{copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />} {copied ? "Link copied" : "Copy article link"}</button><button type="button" onClick={() => { if (navigator.share) void navigator.share({ title: article.title, url: window.location.href }); }} className="mt-2 flex w-full items-center gap-2 rounded-xl border border-[#2b2925] px-3 py-2.5 text-left text-xs text-[#c4bdb3] transition hover:border-[#e8a33d]/40 hover:text-white"><Share2 size={14} /> Share article</button></div><div className="rounded-2xl border border-[#2b2925] bg-[#161513] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8a33d]">Related help</p>{article.relatedArticles.length === 0 ? <p className="mt-3 text-xs leading-5 text-[#777169]">More guidance for this workflow is coming soon.</p> : <div className="mt-3 space-y-1">{article.relatedArticles.map((related) => <Link key={related.id} href={`/help/${related.categorySlug}/${related.slug}`} className="group flex items-start justify-between gap-2 rounded-lg px-2 py-2 text-xs leading-5 text-[#bdb6ab] transition hover:bg-[#211d18] hover:text-white"><span>{related.title}</span><ArrowRight size={13} className="mt-1 shrink-0 text-[#6f6a62] transition group-hover:translate-x-0.5 group-hover:text-[#e8a33d]" /></Link>)}</div>}</div><Link href="/help" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-3 py-2.5 text-xs font-bold text-[#17130c] transition hover:bg-[#f0b458]"><ArrowLeft size={14} /> Browse all help</Link></aside>
                </div>
            </div>
            <style>{`.prose-studioos strong { color: #f5f4f1; font-weight: 700; } .prose-studioos a { color: #e8a33d; text-decoration: underline; }`}</style>
        </main>
    );
}

function ArticleLoading() { return <main className="min-h-screen animate-pulse bg-[#0f0f0f] px-5 py-8 sm:px-8"><div className="mx-auto max-w-[1120px]"><div className="h-4 w-24 rounded bg-[#292621]" /><div className="mt-12 max-w-3xl"><div className="h-5 w-32 rounded bg-[#292621]" /><div className="mt-5 h-12 w-4/5 rounded bg-[#292621]" /><div className="mt-4 h-4 w-full rounded bg-[#24211d]" /><div className="mt-2 h-4 w-2/3 rounded bg-[#24211d]" /><div className="mt-10 space-y-3"><div className="h-3 w-full rounded bg-[#24211d]" /><div className="h-3 w-full rounded bg-[#24211d]" /><div className="h-3 w-4/5 rounded bg-[#24211d]" /></div></div></div></main>; }
function ArticleError({ onRetry }: { onRetry: () => void }) { return <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-6 text-center text-white"><div><BookOpen size={28} className="mx-auto text-[#e8a33d]" /><h1 className="mt-5 text-2xl font-bold">Article unavailable</h1><p className="mt-2 text-sm text-[#888176]">This help article could not be loaded.</p><button type="button" onClick={onRetry} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-2.5 text-sm font-bold text-[#17130c]"><RefreshCw size={15} /> Try again</button></div></main>; }
