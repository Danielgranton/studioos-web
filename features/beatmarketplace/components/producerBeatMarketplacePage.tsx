"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { AlertTriangle, BadgeCheck, BarChart3, CheckCircle2, ChevronDown, Clock3, DollarSign, FileAudio, Heart, Loader2, Music2, Play, Plus, Star, Upload, X } from "lucide-react";

import { DashboardErrorState, useDashboardSession } from "@/features/dashboard";
import { StudioService } from "@/features/studio";

import { BeatService } from "../services/beat.service";
import type { BeatGenre, BeatLicense, BeatReview, BeatSale, BeatSummary } from "../types/beat";

type BeatForm = { title: string; description: string; genreId: string; bpm: string; keySignature: string; mood: string; studioId: string; visibility: "PUBLIC" | "PRIVATE" };
const EMPTY_FORM: BeatForm = { title: "", description: "", genreId: "", bpm: "", keySignature: "", mood: "", studioId: "", visibility: "PUBLIC" };

export function ProducerBeatMarketplacePage() {
    const session = useDashboardSession();
    const router = useRouter();
    const [beats, setBeats] = useState<BeatSummary[]>([]);
    const [sales, setSales] = useState<BeatSale[]>([]);
    const [genres, setGenres] = useState<BeatGenre[]>([]);
    const [studioIds, setStudioIds] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [filter, setFilter] = useState("ALL");
    const [uploading, setUploading] = useState(false);
    const [uploadStage, setUploadStage] = useState<"preparing" | "files" | "finalizing" | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (session && session.role !== "PRODUCER") router.replace("/dashboard");
    }, [router, session]);

    async function load() {
        setLoading(true);
        setError(false);
        try {
            const [myBeats, mySales] = await Promise.all([BeatService.getMyBeats(), BeatService.getMySales()]);
            setBeats(myBeats);
            setSales(mySales);
            const [genreResult, studioResult] = await Promise.allSettled([BeatService.getGenres(), StudioService.getMyStudios()]);
            if (genreResult.status === "fulfilled") setGenres(genreResult.value);
            if (studioResult.status === "fulfilled") setStudioIds(studioResult.value.map((studio) => ({ id: studio.id, name: studio.studioName })));
            if (genreResult.status === "rejected" || studioResult.status === "rejected") {
                toast.error("Some upload options are unavailable", { description: "Refresh the page after checking the server connection." });
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { if (session?.role === "PRODUCER") void load(); }, [session]);
    const processingBeats = useMemo(() => beats.filter((beat) => ["UPLOADING", "PROCESSING", "FAILED"].includes(beat.status || "")), [beats]);
    const catalogBeats = useMemo(() => beats.filter((beat) => !["UPLOADING", "PROCESSING", "FAILED"].includes(beat.status || "")), [beats]);
    const visibleBeats = useMemo(() => catalogBeats.filter((beat) => filter === "ALL" || (filter === "SOLD" && sales.some((sale) => sale.beatId === beat.id && sale.status === "PAID")) || (filter === "UNSOLD" && !sales.some((sale) => sale.beatId === beat.id && sale.status === "PAID"))), [catalogBeats, filter, sales]);
    const paidSales = sales.filter((sale) => sale.status === "PAID");
    const revenue = paidSales.reduce((sum, sale) => sum + sale.amount, 0);

    async function upload(form: BeatForm, audio: File, cover: File) {
        setUploading(true);
        let draft: { beatId: string; beatUploadUrl: string; coverUploadUrl: string } | null = null;
        try {
            setUploadStage("preparing");
            setUploadProgress(0);
            draft = await BeatService.createUpload({ ...form, bpm: form.bpm ? Number(form.bpm) : undefined });
            setUploadStage("files");
            let audioRatio = 0;
            let coverRatio = 0;
            const updateProgress = () => setUploadProgress(Math.round(((audioRatio + coverRatio) / 2) * 100));
            await Promise.all([
                putFile(draft.beatUploadUrl, audio, "audio/mpeg", (ratio) => { audioRatio = ratio; updateProgress(); }),
                putFile(draft.coverUploadUrl, cover, "image/jpeg", (ratio) => { coverRatio = ratio; updateProgress(); }),
            ]);
            setUploadStage("finalizing");
            setUploadProgress(99);
            await BeatService.completeUpload(draft.beatId);
            setUploadProgress(100);
            toast.success("Beat uploaded", { description: "Your beat is processing and will appear when it is ready." });
            setShowUpload(false);
            await load();
        } catch (uploadError) {
            if (draft) {
                try { await BeatService.cancelUpload(draft.beatId); } catch { /* Keep the original upload error visible. */ }
            }
            toast.error("Beat upload failed", { description: getErrorMessage(uploadError) });
        } finally {
            setUploading(false);
            setUploadStage(null);
            setUploadProgress(0);
        }
    }

    if (session?.role !== "PRODUCER") return null;
    return <div className="mx-auto w-full max-w-6xl p-5 text-[#f1f1f1] sm:p-8 lg:p-10">
        <header className="flex flex-col gap-5 border-b border-[#2b2b2b] pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e8a33d]">Producer workspace</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Beat marketplace</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#888]">Upload, price, and understand the instrumentals powering your catalog.</p></div><button type="button" onClick={() => setShowUpload(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-2.5 text-sm font-semibold text-[#161513] transition hover:bg-[#f0b458]"><Plus size={16} /> Upload beat</button></header>
        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4"><Kpi icon={<Music2 size={16} />} label="Total beats" value={String(beats.length)} /><Kpi icon={<CheckCircle2 size={16} />} label="Sold" value={String(paidSales.length)} /><Kpi icon={<DollarSign size={16} />} label="Revenue" value={`KSh ${revenue.toLocaleString()}`} /><Kpi icon={<Star size={16} />} label="Reviews" value={String(beats.reduce((sum, beat) => sum + (beat.reviewCount || 0), 0))} /></div>
        {showUpload && <BeatUploadForm genres={genres} studios={studioIds} busy={uploading} stage={uploadStage} progress={uploadProgress} onCancel={() => setShowUpload(false)} onSubmit={upload} />}
        {loading ? <BeatDashboardLoading /> : error ? <DashboardErrorState title="Beat workspace unavailable" description="We could not load your beats and sales. Your catalog is safe; try again." onRetry={() => void load()} /> : <>
            {processingBeats.length > 0 && <section className="mt-8"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#666]">Media pipeline</p><h2 className="mt-1 text-xl font-semibold">Preparing your beats</h2></div><div className="mt-4 space-y-3">{processingBeats.map((beat) => <BeatProcessingCard key={beat.id} beat={beat} />)}</div></section>}
            <div className="mt-8 flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#666]">Catalog control</p><h2 className="mt-1 text-xl font-semibold">Your beats</h2></div><div className="flex rounded-xl border border-[#303030] bg-[#151515] p-1">{["ALL", "SOLD", "UNSOLD"].map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${filter === item ? "bg-[#e8a33d] text-[#161513]" : "text-[#777] hover:text-white"}`}>{item}</button>)}</div></div>
            {visibleBeats.length === 0 ? (processingBeats.length === 0 ? <EmptyBeatState onUpload={() => setShowUpload(true)} /> : <p className="mt-4 rounded-2xl border border-dashed border-[#303030] px-5 py-8 text-center text-sm text-[#666]">Your finished beats will appear here after media processing.</p>) : <div className="mt-4 space-y-3">{visibleBeats.map((beat) => <ProducerBeatRow key={beat.id} beat={beat} sales={sales.filter((sale) => sale.beatId === beat.id)} onArchived={() => setBeats((current) => current.filter((item) => item.id !== beat.id))} />)}</div>}
            <SalesPanel sales={paidSales} />
        </>}
    </div>;
}

function BeatProcessingCard({ beat }: { beat: BeatSummary }) {
    const failed = beat.status === "FAILED";
    const circumference = 2 * Math.PI * 30;
    return <article className="flex items-center gap-4 rounded-2xl border border-[#2b2b2b] bg-[#151515] p-4 sm:p-5">
        <div className="relative h-[72px] w-[72px] shrink-0">
            <svg viewBox="0 0 72 72" className={`h-full w-full -rotate-90 ${failed ? "" : "animate-[spin_2.8s_linear_infinite]"}`} aria-hidden="true">
                <circle cx="36" cy="36" r="30" fill="none" stroke="currentColor" strokeWidth="5" className="text-[#302f2d]" />
                <circle cx="36" cy="36" r="30" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${circumference * 0.22} ${circumference * 0.78}`} className={failed ? "text-red-300" : "text-[#e8a33d]"} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center">{failed ? <AlertTriangle size={18} className="text-red-300" /> : <Loader2 size={18} className="animate-spin text-[#e8a33d]" />}</span>
        </div>
        <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-semibold text-white">{beat.title}</h3><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${failed ? "bg-red-400/10 text-red-300" : "bg-[#24211d] text-[#d7a35d]"}`}>{failed ? "Needs attention" : "Processing"}</span></div>
            <p className="mt-1 truncate text-xs text-[#777]">{beat.genreName || "Unclassified"} · {beat.bpm || "--"} BPM · {beat.keySignature || "Key unset"}</p>
            <p className="mt-2 text-xs leading-5 text-[#999]">{failed ? "Media processing could not finish. Remove this entry and upload the files again." : "Fetching audio and artwork, then generating the preview, waveform, and marketplace images."}</p>
        </div>
    </article>;
}

function BeatUploadForm({ genres, studios, busy, stage, progress, onCancel, onSubmit }: { genres: BeatGenre[]; studios: { id: string; name: string }[]; busy: boolean; stage: "preparing" | "files" | "finalizing" | null; progress: number; onCancel: () => void; onSubmit: (form: BeatForm, audio: File, cover: File) => Promise<void> }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [audio, setAudio] = useState<File | null>(null);
    const [cover, setCover] = useState<File | null>(null);
    function field(key: keyof BeatForm, value: string) { setForm((current) => ({ ...current, [key]: value })); }
    function submit(event: FormEvent) { event.preventDefault(); if (!audio || !cover || !form.genreId || !form.studioId) { toast.error("Complete the beat details", { description: "Select a studio and genre, then add audio and cover files." }); return; } void onSubmit(form, audio, cover); }
    const circumference = 2 * Math.PI * 34;
    const dashOffset = circumference - (progress / 100) * circumference;
    return <form onSubmit={submit} className="mt-7 rounded-2xl border border-[#4a4032] bg-[#191612] p-5 sm:p-7"><div className="flex items-start justify-between border-b border-[#3a3027] pb-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">New catalog entry</p><h2 className="mt-2 text-xl font-semibold">Upload a beat</h2></div><button type="button" disabled={busy} onClick={onCancel} className="rounded-lg p-2 text-[#777] hover:bg-[#28221b] hover:text-white disabled:opacity-40" aria-label="Close upload form"><X size={18} /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Input label="Beat title" value={form.title} onChange={(value) => field("title", value)} required /><Select label="Studio" value={form.studioId} options={studios.map((item) => [item.id, item.name])} onChange={(value) => field("studioId", value)} disabled={!studios.length} /><div><Select label="Genre" value={form.genreId} options={genres.map((genre) => [genre.id, genre.name])} onChange={(value) => field("genreId", value)} disabled={!genres.length} />{!genres.length && <p className="mt-1.5 text-[11px] text-amber-300">No genres available. Refresh after the server finishes loading.</p>}</div><Input label="BPM" type="number" value={form.bpm} onChange={(value) => field("bpm", value)} /><Input label="Key signature" value={form.keySignature} onChange={(value) => field("keySignature", value)} placeholder="G Minor" /><Input label="Mood" value={form.mood} onChange={(value) => field("mood", value)} placeholder="Late night" /><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[#aaa]">Description</span><textarea value={form.description} onChange={(event) => field("description", event.target.value)} rows={3} className="w-full resize-none rounded-xl border border-[#36312a] bg-[#11100e] px-3 py-2.5 text-sm text-white outline-none focus:border-[#e8a33d]" /></label></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><FilePicker label="Audio master" accept="audio/mpeg,audio/wav,audio/x-wav" file={audio} onChange={setAudio} icon={<FileAudio size={16} />} /><FilePicker label="Cover artwork" accept="image/jpeg,image/png" file={cover} onChange={setCover} icon={<Upload size={16} />} /></div>{busy && <div className="mt-5 flex items-center gap-4 rounded-xl border border-[#4a4032] bg-[#151311] p-4"><div className="relative h-[82px] w-[82px] shrink-0"><svg viewBox="0 0 82 82" className="h-full w-full -rotate-90" aria-hidden="true"><circle cx="41" cy="41" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-[#30291f]" /><circle cx="41" cy="41" r="34" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} className="text-[#e8a33d] transition-[stroke-dashoffset] duration-300" /></svg><span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">{progress}%</span></div><div className="min-w-0"><p className="text-sm font-semibold text-white">{stage === "preparing" ? "Preparing your upload" : stage === "files" ? "Uploading your files" : "Finalizing your beat"}</p><p className="mt-1 text-xs leading-5 text-[#888]">{stage === "files" ? "Audio and artwork are being transferred securely." : "Keep this window open until the upload is complete."}</p></div></div>}<div className="mt-6 flex justify-end gap-2"><button type="button" disabled={busy} onClick={onCancel} className="rounded-xl border border-[#3d3830] px-4 py-2.5 text-sm text-[#aaa] disabled:opacity-40">Cancel</button><button disabled={busy || !genres.length || !studios.length} className="inline-flex items-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-2.5 text-sm font-semibold text-[#161513] disabled:opacity-60">{busy && <Loader2 size={15} className="animate-spin" />} {busy ? "Uploading..." : "Upload beat"}</button></div></form>;
}

function ProducerBeatRow({ beat, sales, onArchived }: { beat: BeatSummary; sales: BeatSale[]; onArchived: () => void }) {
    const [open, setOpen] = useState(false);
    const [reviews, setReviews] = useState<BeatReview[] | null>(null);
    const [licenses, setLicenses] = useState<BeatLicense[] | null>(null);
    const [archiveOpen, setArchiveOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [archiving, setArchiving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState(false);
    const paid = sales.filter((sale) => sale.status === "PAID");
    async function toggle() { setOpen((value) => !value); if (!reviews) { const [loadedReviews, loadedLicenses] = await Promise.all([BeatService.getReviews(beat.id), BeatService.getLicenses(beat.id)]); setReviews(loadedReviews); setLicenses(loadedLicenses); } }
    async function addLicense(type: string, price: number) { const created = await BeatService.createLicense(beat.id, type, price); setLicenses((current) => [...(current || []), ...created]); toast.success("License added"); }
    async function archive() { setArchiving(true); try { await BeatService.archiveBeat(beat.id); onArchived(); setArchiveOpen(false); toast.success("Beat archived", { description: "The beat is no longer available in the public marketplace." }); } catch (error) { toast.error("Could not archive beat", { description: getErrorMessage(error) }); } finally { setArchiving(false); } }
    async function deleteArchived() { setDeleting(true); try { await BeatService.deleteArchivedBeat(beat.id); onArchived(); setDeleteOpen(false); toast.success("Archived beat deleted"); } catch (error) { toast.error("Could not delete archived beat", { description: getErrorMessage(error) }); } finally { setDeleting(false); } }
    async function loadPreview() { if (previewUrl || previewLoading) return; setPreviewLoading(true); setPreviewError(false); try { setPreviewUrl(await BeatService.getPreviewUrl(beat.id)); } catch { setPreviewError(true); } finally { setPreviewLoading(false); } }
    const archived = beat.status === "ARCHIVED";
    return <><article className="overflow-hidden rounded-2xl border border-[#2b2b2b] bg-[#151515]"><button type="button" onClick={() => void toggle()} className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-[#1b1b1b] sm:p-5"><div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#24211d]">{beat.thumbnailUrl ? <Image src={beat.thumbnailUrl} alt="" fill sizes="56px" className="object-cover" unoptimized /> : <Music2 size={22} className="text-[#e8a33d]" />}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate font-semibold text-white">{beat.title}</h3>{beat.verified && <BadgeCheck size={15} className="text-[#5eead4]" />}</div><p className="mt-1 truncate text-xs text-[#777]">{beat.genreName || "Unclassified"} · {beat.bpm || "--"} BPM · {beat.keySignature || "Key unset"}</p></div><div className="hidden items-center gap-5 text-right sm:flex"><Metric label="Price" value={beat.startingPrice ? `KSh ${beat.startingPrice.toLocaleString()}` : "Unset"} /><Metric label="Sales" value={String(paid.length)} /><Metric label="Rating" value={beat.averageRating ? `${beat.averageRating.toFixed(1)} (${beat.reviewCount || 0})` : "New"} /></div><ChevronDown size={17} className={`shrink-0 text-[#666] transition ${open ? "rotate-180" : ""}`} /></button>{open && <div className="border-t border-[#2b2b2b] bg-[#111111] p-4 sm:p-5"><div className="grid gap-3 sm:grid-cols-3"><Metric label="Status" value={beat.status || "Unknown"} icon={<Clock3 size={13} />} /><Metric label="Visibility" value={beat.visibility || "Unknown"} icon={<Play size={13} />} /><Metric label="Likes / plays" value={`${beat.likeCount || 0} / ${(beat.playCount || 0).toLocaleString()}`} icon={<Heart size={13} />} /></div><div className="mt-5 rounded-xl border border-[#2b2b2b] bg-[#151515] p-3"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777]">Private preview</p><p className="mt-1 text-xs text-[#888]">Listen to the processed version before publishing.</p></div>{!previewUrl && <button type="button" disabled={previewLoading || !beat.previewAvailable} onClick={() => void loadPreview()} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#e8a33d] px-3 py-2 text-xs font-semibold text-[#161513] disabled:cursor-not-allowed disabled:opacity-50">{previewLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}{previewLoading ? "Loading" : beat.previewAvailable ? "Preview" : "Unavailable"}</button>}</div>{previewUrl && <audio controls preload="none" src={previewUrl} className="mt-3 h-9 w-full" onError={() => { setPreviewError(true); setPreviewUrl(null); }} />}{previewError && <p className="mt-2 text-xs text-red-300">The preview could not be loaded. Try again after processing finishes.</p>}</div><div className="mt-5 grid gap-5 lg:grid-cols-2"><ReviewPreview reviews={reviews} /><LicensePreview licenses={licenses} onCreate={addLicense} /></div><div className="mt-5 flex justify-end border-t border-[#252525] pt-4">{archived ? <button type="button" onClick={() => setDeleteOpen(true)} className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-medium text-red-300 transition hover:border-red-300/60 hover:bg-red-400/10">Delete permanently</button> : <button type="button" onClick={() => setArchiveOpen(true)} className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-medium text-red-300 transition hover:border-red-300/60 hover:bg-red-400/10">Archive beat</button>}</div></div>}</article>{archiveOpen && <ArchiveConfirmationDialog beatTitle={beat.title} busy={archiving} onCancel={() => setArchiveOpen(false)} onConfirm={() => void archive()} />}{deleteOpen && <ArchiveConfirmationDialog beatTitle={beat.title} busy={deleting} deleteMode onCancel={() => setDeleteOpen(false)} onConfirm={() => void deleteArchived()} />}</>;
}

function ArchiveConfirmationDialog({ beatTitle, busy, deleteMode = false, onCancel, onConfirm }: { beatTitle: string; busy: boolean; deleteMode?: boolean; onCancel: () => void; onConfirm: () => void }) {
    const cancelRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        cancelRef.current?.focus();
        function handleKeyDown(event: KeyboardEvent) { if (event.key === "Escape" && !busy) onCancel(); }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [busy, onCancel]);
    return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel(); }}><div role="dialog" aria-modal="true" aria-labelledby="archive-dialog-title" className="w-full max-w-md rounded-2xl border border-[#40362b] bg-[#171513] p-5 shadow-2xl sm:p-6"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-300"><AlertTriangle size={19} /></span><div><h2 id="archive-dialog-title" className="text-base font-semibold text-white">{deleteMode ? "Delete this archived beat?" : "Archive this beat?"}</h2><p className="mt-1 text-sm leading-5 text-[#aaa]">{deleteMode ? `“${beatTitle}” and its uploaded media will be permanently deleted. This cannot be undone.` : `“${beatTitle}” will be removed from the public marketplace. Existing sales and reviews will remain safe.`}</p></div></div><div className="mt-6 flex justify-end gap-2"><button ref={cancelRef} type="button" disabled={busy} onClick={onCancel} className="rounded-xl border border-[#3b3834] px-4 py-2.5 text-sm font-medium text-[#bbb] transition hover:bg-[#24211f] disabled:opacity-50">Keep beat</button><button type="button" disabled={busy} onClick={onConfirm} className="inline-flex items-center gap-2 rounded-xl bg-red-400/15 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-400/25 disabled:opacity-60">{busy && <Loader2 size={15} className="animate-spin" />}{busy ? (deleteMode ? "Deleting..." : "Archiving...") : (deleteMode ? "Delete permanently" : "Archive beat")}</button></div></div></div>;
}

function ReviewPreview({ reviews }: { reviews: BeatReview[] | null }) { return <div><h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#777]">Reviews</h4>{!reviews ? <p className="mt-3 text-sm text-[#666]">Loading reviews...</p> : reviews.length === 0 ? <p className="mt-3 text-sm text-[#666]">No reviews yet.</p> : <div className="mt-3 space-y-2">{reviews.slice(0, 3).map((review) => <div key={review.id} className="rounded-xl border border-[#2b2b2b] bg-[#151515] p-3"><div className="flex items-center gap-1 text-[#e8a33d]">{Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={12} className="fill-current" />)}</div><p className="mt-2 text-xs leading-5 text-[#999]">{review.comment || "Rated this beat without a comment."}</p></div>)}</div>}</div>; }
function LicensePreview({ licenses, onCreate }: { licenses: BeatLicense[] | null; onCreate: (type: string, price: number) => Promise<void> }) { const [type, setType] = useState("BASIC"); const [price, setPrice] = useState(""); const [saving, setSaving] = useState(false); async function submit() { const amount = Number(price); if (!amount) return; setSaving(true); try { await onCreate(type, amount); setPrice(""); } catch (error) { toast.error("Could not add license", { description: getErrorMessage(error) }); } finally { setSaving(false); } } return <div><h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#777]">Active licenses</h4>{!licenses ? <p className="mt-3 text-sm text-[#666]">Loading licenses...</p> : <><div className="mt-3 space-y-2">{licenses.map((license) => <div key={license.id} className="flex items-center justify-between rounded-xl border border-[#2b2b2b] bg-[#151515] p-3 text-xs"><span className="font-medium text-[#ddd]">{license.type}</span><span className="font-mono text-[#e8a33d]">KSh {license.price.toLocaleString()}</span></div>)}</div><div className="mt-3 flex gap-2"><select value={type} onChange={(event) => setType(event.target.value)} className="rounded-lg border border-[#36312a] bg-[#151515] px-2 text-xs text-[#ddd]"><option value="BASIC">Basic</option><option value="PREMIUM">Premium</option><option value="EXCLUSIVE">Exclusive</option></select><input type="number" min="1" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Price" className="min-w-0 flex-1 rounded-lg border border-[#36312a] bg-[#151515] px-2 text-xs text-white outline-none" /><button type="button" disabled={saving} onClick={() => void submit()} className="rounded-lg bg-[#e8a33d] px-3 text-xs font-semibold text-[#161513] disabled:opacity-60">{saving ? "..." : "Add"}</button></div></>}</div>; }
function SalesPanel({ sales }: { sales: BeatSale[] }) { return <section className="mt-9"><div className="flex items-center gap-2"><BarChart3 size={16} className="text-[#e8a33d]" /><h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#777]">Recent sales</h2></div>{sales.length === 0 ? <div className="mt-3 rounded-2xl border border-dashed border-[#303030] px-5 py-8 text-center text-sm text-[#666]">Your paid beat sales will appear here.</div> : <div className="mt-3 overflow-hidden rounded-2xl border border-[#2b2b2b] bg-[#151515]">{sales.slice(0, 8).map((sale) => <div key={sale.id} className="flex items-center justify-between gap-4 border-b border-[#292929] px-4 py-3.5 last:border-0"><div className="min-w-0"><p className="truncate text-sm font-medium text-[#ddd]">{sale.beatTitle}</p><p className="mt-1 text-xs text-[#666]">{new Date(sale.purchasedAt).toLocaleDateString()}</p></div><span className="font-mono text-sm text-emerald-300">+ KSh {sale.amount.toLocaleString()}</span></div>)}</div>}</section>; }
function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-2xl border border-[#2b2b2b] bg-[#151515] p-4"><span className="text-[#777]">{icon}</span><p className="mt-3 text-xl font-semibold text-white">{value}</p><p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#666]">{label}</p></div>; }
function Metric({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) { return <div><p className="text-[9px] uppercase tracking-[0.14em] text-[#666]">{label}</p><p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#ccc]">{icon}{value}</p></div>; }
function Input({ label, value, onChange, type = "text", placeholder, required }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean }) { return <label><span className="mb-1.5 block text-xs font-medium text-[#aaa]">{label}</span><input required={required} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-[#36312a] bg-[#11100e] px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#555] focus:border-[#e8a33d]" /></label>; }
function Select({ label, value, options, onChange, disabled }: { label: string; value: string; options: string[][]; onChange: (value: string) => void; disabled?: boolean }) { return <label><span className="mb-1.5 block text-xs font-medium text-[#aaa]">{label}</span><select required disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-[#36312a] bg-[#11100e] px-3 py-2.5 text-sm text-white outline-none focus:border-[#e8a33d] disabled:cursor-not-allowed disabled:opacity-50"><option value="">{disabled ? `${label} unavailable` : `Select ${label.toLowerCase()}`}</option>{options.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>; }
function FilePicker({ label, accept, file, onChange, icon }: { label: string; accept: string; file: File | null; onChange: (file: File | null) => void; icon: React.ReactNode }) { return <label className="relative flex min-h-14 cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-dashed border-[#4a4032] bg-[#151311] px-4 py-3 text-sm text-[#aaa] transition hover:border-[#e8a33d]/60 focus-within:border-[#e8a33d] focus-within:ring-2 focus-within:ring-[#e8a33d]/20"><input type="file" required accept={accept} className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" onChange={(event) => onChange(event.target.files?.[0] || null)} />{icon}<span className="pointer-events-none min-w-0 truncate">{file?.name || label}</span></label>; }
function EmptyBeatState({ onUpload }: { onUpload: () => void }) { return <div className="mt-4 rounded-2xl border border-dashed border-[#3a3027] bg-[#151311] px-6 py-14 text-center"><Music2 size={25} className="mx-auto text-[#e8a33d]" /><h2 className="mt-4 text-lg font-semibold">Your beat catalog is quiet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#888176]">Upload your first instrumental to start building a marketplace presence.</p><button type="button" onClick={onUpload} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-2.5 text-sm font-semibold text-[#161513]"><Plus size={15} /> Upload first beat</button></div>; }
function BeatDashboardLoading() { return <div className="mt-8 space-y-3">{[1, 2, 3].map((item) => <div key={item} className="animate-pulse rounded-2xl border border-[#2b2b2b] bg-[#151515] p-5"><div className="h-4 w-1/3 rounded bg-[#292929]" /><div className="mt-3 h-3 w-1/2 rounded bg-[#232323]" /></div>)}</div>; }
async function putFile(url: string, file: File, signedContentType: string, onProgress: (ratio: number) => void) {
    await new Promise<void>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("PUT", url);
        request.setRequestHeader("Content-Type", signedContentType);
        request.upload.onprogress = (event) => {
            if (event.lengthComputable) onProgress(event.loaded / event.total);
        };
        request.onload = () => {
            if (request.status >= 200 && request.status < 300) resolve();
            else reject(new Error(`Could not upload ${file.name} (${request.status})`));
        };
        request.onerror = () => reject(new Error(`Could not upload ${file.name}: network error`));
        request.onabort = () => reject(new Error(`Could not upload ${file.name}: upload cancelled`));
        request.send(file);
    });
}
function getErrorMessage(error: unknown) { return (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error instanceof Error ? error.message : "Check your files and try again."); }
