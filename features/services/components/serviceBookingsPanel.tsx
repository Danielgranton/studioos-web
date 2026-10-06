"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarClock, Check, CircleDollarSign, LoaderCircle, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/features/auth";
import { ServiceBookingService } from "../services/service-booking.service";
import type { ServiceBooking } from "../types/booking";

export function ServiceBookingsPanel() {
    const { session } = useSession();
    const [incoming, setIncoming] = useState<ServiceBooking[]>([]);
    const [outgoing, setOutgoing] = useState<ServiceBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [quotes, setQuotes] = useState<Record<string, string>>({});
    const [phones, setPhones] = useState<Record<string, string>>({});
    const isProvider = session?.role === "ARTIST" || session?.role === "PRODUCER";

    const load = useCallback(async () => {
        if (!session || !isProvider) { setLoading(false); return; }
        setLoading(true);
        setError(false);
        try {
            const [providerRequests, myRequests] = await Promise.all([
                ServiceBookingService.getProviderRequests().catch(() => []),
                ServiceBookingService.getMine(),
            ]);
            setIncoming(providerRequests);
            setOutgoing(myRequests);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [isProvider, session]);

    useEffect(() => { void load(); }, [load]);

    async function runAction(id: string, action: () => Promise<unknown>, success: string) {
        setBusyId(id);
        try { await action(); toast.success(success); await load(); }
        catch { toast.error("Could not update service request", { description: "Please try again." }); }
        finally { setBusyId(null); }
    }

    if (!isProvider) return null;
    const incomingPending = incoming.filter((item) => item.status === "PENDING").length;

    return <section className="mt-7 rounded-2xl border border-white/[0.08] bg-[#151514] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4"><div><div className="flex items-center gap-2"><h2 className="text-base font-bold text-white">Service requests</h2>{incomingPending > 0 && <span className="rounded-md bg-[#e8a33d]/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#e8a33d]">{incomingPending}</span>}</div><p className="mt-1 text-xs text-[#77746e]">Review requests, confirm your price, and track paid work.</p></div><button onClick={() => void load()} disabled={loading} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-[#aaa59c] hover:text-white disabled:opacity-50" aria-label="Refresh service requests"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button></div>
        {loading ? <div className="mt-4 flex items-center gap-2 rounded-xl bg-black/15 px-4 py-5 text-xs text-[#89857d]"><LoaderCircle size={15} className="animate-spin text-[#e8a33d]" />Loading service requests…</div> : error ? <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-300/10 bg-rose-300/[0.04] px-4 py-3 text-xs text-rose-100/80">Requests could not be loaded.<button onClick={() => void load()} className="font-semibold text-rose-100 underline underline-offset-4">Try again</button></div> : incoming.length === 0 && outgoing.length === 0 ? <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-white/10 px-4 py-5"><CalendarClock size={18} className="text-[#77746e]" /><div><p className="text-xs font-semibold text-[#d5d0c7]">No service requests yet</p><p className="mt-1 text-[11px] text-[#77746e]">New customer requests will appear here.</p></div></div> : <div className="mt-4 space-y-3">
            {incoming.map((item) => <article key={`incoming-${item.id}`} className="rounded-xl border border-white/[0.07] bg-[#10100f] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-bold text-white">{item.serviceName}</p><p className="mt-1 text-[11px] text-[#8b877f]">Request from {item.requesterName} · {formatDate(item.preferredDate)}</p></div><Badge status={item.status} /></div>
                <p className="mt-3 whitespace-pre-wrap rounded-lg bg-white/[0.025] px-3 py-2.5 text-xs leading-5 text-[#b7b2a9]">{item.requestDetails}</p>
                {item.status === "PENDING" && <div className="mt-3 flex flex-col gap-2 sm:flex-row"><label className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3"><CircleDollarSign size={14} className="text-[#e8a33d]" /><span className="text-[10px] text-[#77746e]">{item.currency}</span><input aria-label="Confirmed service price" inputMode="numeric" min="1" value={quotes[item.id] ?? (item.amount > 0 ? String(item.amount) : "")} onChange={(event) => setQuotes((current) => ({ ...current, [item.id]: event.target.value }))} placeholder="Your confirmed price" className="min-w-0 flex-1 bg-transparent py-2.5 text-xs text-white outline-none" /></label><button disabled={busyId === item.id} onClick={() => { const amount = Number(quotes[item.id] ?? item.amount); if (!Number.isInteger(amount) || amount < 1) { toast.error("Enter a valid price"); return; } void runAction(item.id, () => ServiceBookingService.decide(item.id, true, amount), "Request accepted and price sent"); }} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#e8a33d] px-3 py-2.5 text-xs font-bold text-[#17130c] disabled:opacity-50"><Check size={13} />Accept with price</button><button disabled={busyId === item.id} onClick={() => void runAction(item.id, () => ServiceBookingService.decide(item.id, false), "Request declined")} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 py-2.5 text-xs font-semibold text-[#aaa59c] hover:text-white disabled:opacity-50"><X size={13} />Decline</button></div>}
                {item.status === "PAID" && <button disabled={busyId === item.id} onClick={() => void runAction(item.id, () => ServiceBookingService.markDelivered(item.id), "Marked as delivered")} className="mt-3 rounded-lg border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-2 text-xs font-semibold text-emerald-100 disabled:opacity-50">Mark work delivered</button>}
                <p className="mt-3 text-[11px] text-[#77746e]">{item.currency} {item.amount.toLocaleString()}</p>
            </article>)}
            {outgoing.map((item) => <article key={`outgoing-${item.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#10100f] p-4"><div><p className="text-sm font-bold text-white">{item.serviceName} <span className="font-normal text-[#77746e]">· {item.providerName}</span></p><p className="mt-1 text-[11px] text-[#8b877f]">{formatDate(item.preferredDate)} · {item.currency} {item.amount.toLocaleString()}</p></div><div className="flex items-center gap-2"><Badge status={item.status} />{item.status === "ACCEPTED" && <button disabled={busyId === item.id} onClick={() => { const raw = phones[item.id] ?? session?.phone ?? ""; const phone = normalizePhone(raw); if (!phone) { toast.error("Enter a valid Kenyan M-Pesa number"); return; } void runAction(item.id, () => ServiceBookingService.pay(item.id, phone), "M-Pesa prompt sent"); }} className="rounded-lg bg-[#e8a33d] px-3 py-2 text-[11px] font-bold text-[#17130c]">Pay</button>}{item.status === "PAYMENT_PENDING" && <span className="text-[10px] text-amber-200">Waiting for M-Pesa</span>}</div>{item.status === "ACCEPTED" && <label className="w-full text-[10px] text-[#77746e]">M-Pesa number<input value={phones[item.id] ?? session?.phone ?? ""} onChange={(event) => setPhones((current) => ({ ...current, [item.id]: event.target.value }))} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none" /></label>}</article>)}
        </div>}
    </section>;
}

function Badge({ status }: { status: string }) {
    const tones: Record<string, string> = { PENDING: "text-amber-200 bg-amber-200/10", ACCEPTED: "text-sky-200 bg-sky-200/10", PAYMENT_PENDING: "text-amber-200 bg-amber-200/10", PAID: "text-emerald-200 bg-emerald-200/10", DELIVERED: "text-emerald-200 bg-emerald-200/10", DECLINED: "text-rose-200 bg-rose-200/10", CANCELLED: "text-[#aaa59c] bg-white/[0.06]" };
    return <span className={`rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${tones[status] ?? tones.PENDING}`}>{status.replaceAll("_", " ")}</span>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
function normalizePhone(value: string) { const digits = value.replace(/\D/g, ""); if (/^254[17]\d{8}$/.test(digits)) return digits; if (/^0[17]\d{8}$/.test(digits)) return `254${digits.slice(1)}`; if (/^[17]\d{8}$/.test(digits)) return `254${digits}`; return ""; }
