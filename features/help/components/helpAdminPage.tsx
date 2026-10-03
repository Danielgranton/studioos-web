"use client";

import { useEffect, useState } from "react";
import { Archive, BookOpen, Check, FilePlus2, Loader2, Plus, Send, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { useSession } from "@/features/auth";
import { getApiErrorMessage } from "@/lib/api/errorMessage";

import { HelpService } from "../services/help.service";
import { AdminHelpService } from "../services/admin-help.service";
import type { HelpAudience } from "../types/help";
import type { HelpAdminArticle, HelpAdminRequest } from "../types/admin-help";

const emptyForm: HelpAdminRequest = {
    slug: "", title: "", excerpt: "", content: "", categorySlug: "", audience: "ALL",
    featured: false, displayOrder: 0, readTimeMinutes: 1, tags: [],
};

export function HelpAdminPage() {
    const router = useRouter();
    const { session, isAuthenticated, isLoading: sessionLoading } = useSession();
    const [articles, setArticles] = useState<HelpAdminArticle[]>([]);
    const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
    const [selected, setSelected] = useState<HelpAdminArticle | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!sessionLoading && (!isAuthenticated || !session || !["ADMIN", "SUPER_ADMIN"].includes(session.role))) router.replace("/");
    }, [isAuthenticated, router, session, sessionLoading]);

    async function load() {
        setLoading(true);
        setError("");
        try {
            const [articlePage, categoryRecords] = await Promise.all([AdminHelpService.getArticles(), HelpService.getCategories()]);
            setArticles(articlePage.content);
            setCategories(categoryRecords);
        } catch (loadError) {
            setError(getApiErrorMessage(loadError, "The Help Center workspace could not load."));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!sessionLoading && session && ["ADMIN", "SUPER_ADMIN"].includes(session.role)) void load();
    }, [session, sessionLoading]);

    if (sessionLoading || !session || !["ADMIN", "SUPER_ADMIN"].includes(session.role)) return <div className="min-h-screen bg-[#0f0f0f]" />;

    function edit(article: HelpAdminArticle) {
        setSelected(article);
        setForm({ slug: article.slug, title: article.title, excerpt: article.excerpt, content: article.content, categorySlug: article.categorySlug, audience: article.audience, featured: article.featured, displayOrder: article.displayOrder, readTimeMinutes: article.readTimeMinutes, tags: article.tags });
        setError("");
    }

    function newArticle() {
        setSelected(null);
        setForm({ ...emptyForm, categorySlug: categories[0]?.slug ?? "" });
        setError("");
    }

    async function save(event: React.FormEvent) {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            const article = selected ? await AdminHelpService.updateArticle(selected.id, form) : await AdminHelpService.createArticle(form);
            setArticles((current) => selected ? current.map((item) => item.id === article.id ? article : item) : [article, ...current]);
            edit(article);
        } catch (saveError) {
            setError(getApiErrorMessage(saveError, "The article could not be saved."));
        } finally {
            setSaving(false);
        }
    }

    async function transition(article: HelpAdminArticle, action: "publish" | "archive") {
        try {
            const updated = action === "publish" ? await AdminHelpService.publishArticle(article.id) : await AdminHelpService.archiveArticle(article.id);
            setArticles((current) => current.map((item) => item.id === updated.id ? updated : item));
            if (selected?.id === updated.id) edit(updated);
        } catch (actionError) {
            setError(getApiErrorMessage(actionError, "The article status could not be updated."));
        }
    }

    return <main className="min-h-screen bg-[#0f0f0f] px-5 py-8 text-[#f5f4f1] sm:px-8 sm:py-12"><div className="mx-auto max-w-[1280px]"><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]"><ShieldCheck size={13} /> Content control</div><h1 className="mt-3 text-3xl font-black tracking-tight">Help Center workspace</h1><p className="mt-2 text-sm text-[#858078]">Write, review, and publish guidance for the StudioOS community.</p></div><button type="button" onClick={newArticle} className="inline-flex items-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-2.5 text-xs font-bold text-[#17130c]"><Plus size={15} /> New article</button></div>{error && <p role="alert" className="mt-6 rounded-xl border border-red-300/20 bg-red-300/[0.05] px-4 py-3 text-xs text-red-200">{error}</p>}<div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><section className="rounded-2xl border border-[#2b2925] bg-[#161513] p-4"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8a33d]">Library</p><h2 className="mt-1 text-lg font-bold">Articles <span className="text-sm font-normal text-[#777169]">{articles.length}</span></h2></div><BookOpen size={19} className="text-[#6f6a62]" /></div>{loading ? <div className="mt-5 space-y-2">{[1, 2, 3, 4].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-[#211f1b]" />)}</div> : <div className="mt-5 space-y-2">{articles.map((article) => <button key={article.id} type="button" onClick={() => edit(article)} className={`w-full rounded-xl border p-3 text-left transition ${selected?.id === article.id ? "border-[#e8a33d]/50 bg-[#211d18]" : "border-[#2b2925] hover:border-[#4a4031]"}`}><div className="flex items-start justify-between gap-3"><span className="min-w-0 truncate text-sm font-semibold text-white">{article.title}</span><span className={`shrink-0 text-[9px] font-bold uppercase tracking-wider ${article.status === "PUBLISHED" ? "text-emerald-300" : article.status === "ARCHIVED" ? "text-[#777169]" : "text-[#e8a33d]"}`}>{article.status}</span></div><p className="mt-1 truncate text-[11px] text-[#777169]">{article.categoryName} · {article.viewCount.toLocaleString()} views · {article.helpfulCount} helpful</p></button>)}{articles.length === 0 && <p className="py-10 text-center text-xs text-[#777169]">No articles yet. Create the first one.</p>}</div>}</section><section className="rounded-2xl border border-[#2b2925] bg-[#161513] p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8a33d]">Editor</p><h2 className="mt-1 text-lg font-bold">{selected ? "Edit article" : "Draft an article"}</h2></div>{selected && <button type="button" onClick={newArticle} className="text-xs text-[#99938a] hover:text-white"><FilePlus2 size={16} /></button>}</div><form onSubmit={save} className="mt-5 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Title"><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={inputClass} /></Field><Field label="URL slug"><input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className={inputClass} /></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Category"><select required value={form.categorySlug} onChange={(event) => setForm({ ...form, categorySlug: event.target.value })} className={inputClass}>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></Field><Field label="Audience"><select value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value as HelpAudience })} className={inputClass}>{["ALL", "PRODUCER", "ARTIST", "STUDIO_MANAGER", "BUYER"].map((audience) => <option key={audience}>{audience}</option>)}</select></Field></div><Field label="Excerpt"><textarea required rows={2} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} className={inputClass} /></Field><Field label="Content"><textarea required rows={10} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} className={`${inputClass} resize-y`} /></Field><div className="grid gap-4 sm:grid-cols-3"><Field label="Read time"><input required min={1} type="number" value={form.readTimeMinutes} onChange={(event) => setForm({ ...form, readTimeMinutes: Number(event.target.value) })} className={inputClass} /></Field><Field label="Order"><input min={0} type="number" value={form.displayOrder} onChange={(event) => setForm({ ...form, displayOrder: Number(event.target.value) })} className={inputClass} /></Field><Field label="Tags"><input value={form.tags.join(", ")} onChange={(event) => setForm({ ...form, tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} placeholder="upload, beats" className={inputClass} /></Field></div><label className="flex items-center gap-2 text-xs text-[#bdb6ab]"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Feature this article</label><div className="flex flex-wrap gap-2 pt-2"><button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-2.5 text-xs font-bold text-[#17130c] disabled:opacity-50">{saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save draft</button>{selected?.status !== "PUBLISHED" && <button type="button" onClick={() => void transition(selected!, "publish")} className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 px-4 py-2.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-300/10"><Send size={14} /> Publish</button>}{selected?.status === "PUBLISHED" && <button type="button" onClick={() => void transition(selected!, "archive")} className="inline-flex items-center gap-2 rounded-xl border border-[#2b2925] px-4 py-2.5 text-xs font-semibold text-[#aaa49a] hover:text-white"><Archive size={14} /> Archive</button>}</div></form></section></div></div></main>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-xs font-semibold text-[#bdb6ab]"><span className="mb-1.5 block">{label}</span>{children}</label>; }
const inputClass = "w-full rounded-xl border border-[#2b2925] bg-[#11100f] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#e8a33d]/60";
