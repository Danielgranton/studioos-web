"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowUpRight, BarChart3, Check, CircleAlert, ImagePlus, Loader2, Megaphone, RefreshCw, UploadCloud } from "lucide-react";

import { useDashboardSession } from "@/features/dashboard";
import { AdvertisingService, type CampaignReport } from "../services/advertising.service";

const placements = [
    ["HOME_BANNER", "Home banner"],
    ["BEAT_PLAYER", "Beat player"],
    ["SEARCH_RESULTS", "Search results"],
    ["STUDIO_PROFILE", "Studio profile"],
    ["EXPLORE_PAGE", "Explore page"],
] as const;

function localDateTime(date: Date) {
    const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return adjusted.toISOString().slice(0, 16);
}

function formatMoney(amount?: number) {
    return `KSh ${(amount ?? 0).toLocaleString()}`;
}

export function ProducerAdvertisingPage() {
    const session = useDashboardSession();
    const router = useRouter();
    const [campaignId, setCampaignId] = useState("");
    const [report, setReport] = useState<CampaignReport | null>(null);
    const [loadingReport, setLoadingReport] = useState(false);
    const [busy, setBusy] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [startDate, setStartDate] = useState(() => localDateTime(new Date(Date.now() + 24 * 60 * 60 * 1000)));
    const [endDate, setEndDate] = useState(() => localDateTime(new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)));

    useEffect(() => {
        if (session && session.role !== "PRODUCER") router.replace("/dashboard");
    }, [router, session]);

    if (session?.role !== "PRODUCER") return null;

    async function refreshReport(id = campaignId) {
        const normalizedId = id.trim();
        if (!normalizedId) return;
        setLoadingReport(true);
        try {
            const nextReport = await AdvertisingService.getReport(normalizedId);
            setReport(nextReport);
            setCampaignId(nextReport.campaignId);
        } catch {
            setReport(null);
            toast.error("Campaign report unavailable", { description: "Check the campaign ID and try again." });
        } finally {
            setLoadingReport(false);
        }
    }

    async function createAndPay(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        const title = String(form.get("title") || "").trim();
        const headline = String(form.get("headline") || "").trim();
        const description = String(form.get("description") || "").trim();
        const ctaText = String(form.get("ctaText") || "").trim();
        const ctaUrl = String(form.get("ctaUrl") || "").trim();
        const phoneNumber = String(form.get("phoneNumber") || "").trim();
        const totalBudget = Number(form.get("totalBudget"));
        const dailyBudgetValue = String(form.get("dailyBudget") || "").trim();
        const dailyBudget = dailyBudgetValue ? Number(dailyBudgetValue) : undefined;
        const placement = String(form.get("placement")) as (typeof placements)[number][0];

        if (!file) {
            toast.error("Choose an ad creative first");
            return;
        }
        if (!Number.isInteger(totalBudget) || totalBudget < 1 || (dailyBudget !== undefined && (!Number.isInteger(dailyBudget) || dailyBudget < 1 || dailyBudget > totalBudget))) {
            toast.error("Check your campaign budget", { description: "The daily cap must be a whole number no greater than the total budget." });
            return;
        }
        if (endDate <= startDate) {
            toast.error("Choose a valid campaign schedule", { description: "The end date must be after the start date." });
            return;
        }

        const type = file.type.startsWith("image/") ? "IMAGE" : file.type.startsWith("video/") ? "VIDEO" : file.type.startsWith("audio/") ? "AUDIO" : null;
        if (!type) {
            toast.error("Unsupported creative format", { description: "Choose an image, video, or audio file." });
            return;
        }

        setBusy(true);
        setProgress(0);
        let createdCampaignId = "";
        try {
            setStage("Creating campaign");
            const campaign = await AdvertisingService.createCampaign({
                title,
                description,
                placement,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                totalBudget,
                dailyBudget,
            });
            createdCampaignId = campaign.campaignId;
            setCampaignId(createdCampaignId);

            setStage("Preparing your creative");
            const upload = await AdvertisingService.createAdvertisement(createdCampaignId, {
                type, headline, description, ctaText, ctaUrl,
                contentType: file.type || "application/octet-stream",
            });

            setStage("Uploading creative");
            await AdvertisingService.uploadFile(upload.uploadUrl, file, setProgress);

            setStage("Sending creative for processing");
            await AdvertisingService.completeUpload(upload.advertisementId);

            setStage("Requesting M-Pesa payment");
            const payment = await AdvertisingService.payForCampaign(createdCampaignId, phoneNumber);
            toast.success("Payment request sent", { description: "Approve the M-Pesa prompt on your phone. The campaign activates after payment and review." });
            setStage(`Payment ${payment.status.toLowerCase()} · ${payment.transactionId}`);
            await refreshReport(createdCampaignId);
            formElement.reset();
            setFile(null);
        } catch (error) {
            toast.error(createdCampaignId ? "Campaign setup paused" : "Could not create campaign", {
                description: createdCampaignId
                    ? `Your campaign ID is ${createdCampaignId}. Check its status below; if setup stopped before payment, resolve the issue before creating another campaign.`
                    : error instanceof Error ? error.message : "Try again in a moment.",
            });
            if (createdCampaignId) setStage(`Setup interrupted · Campaign ${createdCampaignId}`);
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-7 text-[#f1f1f1] sm:px-6 sm:py-10">
            <header className="flex flex-col gap-5 border-b border-[#2b2b2b] pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#3ea6ff]">Producer workspace / Growth</p>
                    <h1 className="mt-2 flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl"><Megaphone className="text-[#3ea6ff]" size={26} /> Advertising</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#888]">Promote your studio with a scheduled campaign, a processed creative, and a prepaid media budget.</p>
                </div>
                <div className="rounded-xl border border-[#313131] bg-[#151515] px-4 py-3 text-xs text-[#aaa]"><span className="block font-semibold text-white">Campaign spend is separate</span><span className="mt-1 block">Your budget funds ad delivery; subscription billing will be added separately.</span></div>
            </header>

            <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                <section className="rounded-2xl border border-[#2d2d2d] bg-[#141414] p-5 sm:p-7">
                    <div className="mb-6 flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3ea6ff]/10 text-[#3ea6ff]"><ImagePlus size={19} /></span>
                        <div><h2 className="text-lg font-semibold">Create a campaign</h2><p className="mt-1 text-xs leading-5 text-[#858585]">Set placement and schedule, upload your media, then approve the M-Pesa payment request.</p></div>
                    </div>

                    <form onSubmit={createAndPay} className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Campaign name"><input name="title" required maxLength={120} placeholder="e.g. Northside Studio launch" className={inputClass} /></Field>
                            <Field label="Placement"><select name="placement" className={inputClass}>{placements.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
                        </div>
                        <Field label="Campaign description"><textarea name="description" rows={2} maxLength={1000} placeholder="What should people know about this promotion?" className={`${inputClass} resize-y`} /></Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Start date"><input type="datetime-local" required value={startDate} onChange={(event) => setStartDate(event.target.value)} className={inputClass} /></Field>
                            <Field label="End date"><input type="datetime-local" required value={endDate} onChange={(event) => setEndDate(event.target.value)} className={inputClass} /></Field>
                            <Field label="Total campaign budget (KES)"><input name="totalBudget" type="number" min="1" step="1" required placeholder="5000" className={inputClass} /></Field>
                            <Field label="Daily spend cap (KES) · optional"><input name="dailyBudget" type="number" min="1" step="1" placeholder="No daily cap" className={inputClass} /></Field>
                        </div>

                        <div className="border-t border-[#292929] pt-5">
                            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#747474]">Creative details</p>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Ad headline"><input name="headline" required maxLength={180} placeholder="Your next release starts here" className={inputClass} /></Field>
                                <Field label="Call-to-action label"><input name="ctaText" maxLength={40} placeholder="Book a session" className={inputClass} /></Field>
                            </div>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <Field label="Destination URL"><input name="ctaUrl" type="url" placeholder="https://your-studio.example" className={inputClass} /></Field>
                                <Field label="M-Pesa phone number"><input name="phoneNumber" required inputMode="tel" placeholder="+254 7XX XXX XXX" className={inputClass} /></Field>
                            </div>
                            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#454545] bg-[#101010] px-4 py-5 text-center transition hover:border-[#3ea6ff]/60">
                                <UploadCloud size={20} className="text-[#3ea6ff]" />
                                <span className="mt-2 text-sm font-medium text-[#e5e5e5]">{file ? file.name : "Choose image, video, or audio"}</span>
                                <span className="mt-1 text-[11px] text-[#777]">Creative uploads directly to secure storage</span>
                                <input type="file" accept="image/*,video/*,audio/*" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
                            </label>
                        </div>

                        {busy && <div className="rounded-xl border border-[#303030] bg-[#101010] p-4" aria-live="polite"><div className="flex items-center justify-between gap-4 text-xs"><span className="inline-flex items-center gap-2 text-[#ddd]"><Loader2 size={14} className="animate-spin text-[#3ea6ff]" />{stage}</span>{stage === "Uploading creative" && <span className="tabular-nums text-[#aaa]">{progress}%</span>}</div>{stage === "Uploading creative" && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#292929]"><div className="h-full rounded-full bg-[#3ea6ff] transition-[width]" style={{ width: `${progress}%` }} /></div>}</div>}

                        <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3ea6ff] px-4 py-3 text-sm font-bold text-[#08121b] transition hover:bg-[#70bdff] disabled:cursor-not-allowed disabled:opacity-50"><ArrowUpRight size={16} />Create campaign and request payment</button>
                    </form>
                </section>

                <aside className="space-y-5">
                    <section className="rounded-2xl border border-[#2d2d2d] bg-[#141414] p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#737373]">Campaign report</p><h2 className="mt-1 text-lg font-semibold">Track performance</h2></div><BarChart3 size={19} className="text-[#3ea6ff]" /></div>
                        <form className="mt-5 flex gap-2" onSubmit={(event) => { event.preventDefault(); void refreshReport(); }}>
                            <input value={campaignId} onChange={(event) => setCampaignId(event.target.value)} placeholder="Paste campaign ID" aria-label="Campaign ID" className={`${inputClass} min-w-0 flex-1`} />
                            <button type="submit" disabled={loadingReport || !campaignId.trim()} aria-label="Load report" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#393939] bg-[#202020] text-[#ddd] hover:border-[#3ea6ff]/50 disabled:opacity-40">{loadingReport ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={15} />}</button>
                        </form>
                        {report ? <CampaignReportCard report={report} /> : <div className="mt-5 rounded-xl border border-dashed border-[#333] bg-[#101010] px-4 py-6 text-center"><p className="text-sm font-medium text-[#c8c8c8]">No report loaded</p><p className="mt-1 text-xs leading-5 text-[#777]">Your campaign ID appears after setup. Enter it here any time to check payment, delivery, and results.</p></div>}
                    </section>

                    <section className="rounded-2xl border border-[#2d2d2d] bg-[#141414] p-5 sm:p-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#737373]">What happens next</p>
                        <ol className="mt-4 space-y-4">{[
                            ["01", "Upload", "Your creative is transferred directly to storage and processed."],
                            ["02", "Approve payment", "Confirm the M-Pesa prompt. Campaign budget is prepaid."],
                            ["03", "Review & delivery", "Ads require approval before they can appear in sponsored placements."],
                        ].map(([number, title, description]) => <li key={number} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#202020] text-[10px] font-bold text-[#7ec4ff]">{number}</span><div><p className="text-xs font-semibold text-[#ddd]">{title}</p><p className="mt-1 text-[11px] leading-5 text-[#777]">{description}</p></div></li>)}</ol>
                    </section>
                </aside>
            </div>
        </main>
    );
}

function CampaignReportCard({ report }: { report: CampaignReport }) {
    const status = report.paymentStatus === "PAID" ? "Payment received" : report.paymentStatus === "FAILED" ? "Payment failed" : "Awaiting payment";
    const paid = report.paymentStatus === "PAID";
    return <div className="mt-5 rounded-xl border border-[#303030] bg-[#101010] p-4">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{report.title}</p><p className="mt-1 break-all font-mono text-[10px] text-[#666]">{report.campaignId}</p></div><span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${paid ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : report.paymentStatus === "FAILED" ? "border-red-500/20 bg-red-500/10 text-red-300" : "border-amber-400/20 bg-amber-400/10 text-amber-200"}`}>{report.status}</span></div>
        <p className="mt-4 flex items-center gap-2 text-xs text-[#c7c7c7]">{paid ? <Check size={14} className="text-emerald-400" /> : <CircleAlert size={14} className="text-amber-300" />}{status}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">{[["Budget", formatMoney(report.totalBudget)], ["Remaining", formatMoney(report.remainingBudget)], ["Impressions", report.impressions.toLocaleString()], ["Clicks", report.clicks.toLocaleString()], ["CTR", `${((report.clickThroughRate ?? 0) * 100).toFixed(2)}%`], ["Creatives", String(report.advertisementCount)]].map(([label, value]) => <div key={label} className="rounded-lg bg-[#191919] px-3 py-2"><p className="text-[9px] uppercase tracking-[0.14em] text-[#696969]">{label}</p><p className="mt-1 truncate text-xs font-semibold tabular-nums text-[#ddd]">{value}</p></div>)}</div>
        <p className="mt-3 text-[10px] leading-4 text-[#707070]">Results update as verified impressions and clicks are recorded. Creative approval may take additional time.</p>
    </div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return <label className="block"><span className="mb-1.5 block text-[11px] font-medium text-[#aaa]">{label}</span>{children}</label>;
}

const inputClass = "h-11 w-full rounded-xl border border-[#353535] bg-[#101010] px-3 text-sm text-[#e8e8e8] outline-none transition placeholder:text-[#555] focus:border-[#3ea6ff]/70 focus:ring-2 focus:ring-[#3ea6ff]/10";
