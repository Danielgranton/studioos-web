"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Banknote, Clock3, Loader2, LockKeyhole, WalletCards } from "lucide-react";
import { toast } from "sonner";

import { DashboardErrorState, useDashboardSession } from "@/features/dashboard";

import { useWallet } from "../hooks/useWallet";
import { WalletService } from "../services/wallet.service";
import type { WalletStudio } from "../types/wallet";

const money = (value: number) => `KES ${value.toLocaleString()}`;

export function WalletPage() {
    const session = useDashboardSession();
    const { wallet, loading, error, refresh } = useWallet();
    const [selectedStudio, setSelectedStudio] = useState<WalletStudio | null>(null);
    const [amount, setAmount] = useState("");
    const [phone, setPhone] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (session?.role !== "PRODUCER") return null;
    if (loading) return <div className="mx-auto max-w-6xl p-6 text-sm text-[#888]">Loading your wallet...</div>;
    if (error || !wallet) return <DashboardErrorState title="Wallet temporarily unavailable" description="We could not load your studio balances. No payout has been changed; reconnect and try again." onRetry={refresh} />;

    async function submitWithdrawal(event: React.FormEvent) {
        event.preventDefault();
        if (!selectedStudio || Number(amount) <= 0 || !phone.trim()) return;
        setSubmitting(true);
        try {
            await WalletService.requestWithdrawal(selectedStudio.studioId, Number(amount), phone.trim());
            toast.success("Withdrawal request submitted", { description: "Your payout will be reviewed and processed through M-Pesa." });
            setAmount("");
            setPhone("");
            setSelectedStudio(null);
            await refresh();
        } catch (requestError) {
            const message = (requestError as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error("Could not request withdrawal", { description: message || "Check your balance and payout details." });
        } finally {
            setSubmitting(false);
        }
    }

    return <div className="mx-auto max-w-6xl px-5 py-7 text-[#f1f1f1] sm:px-8 sm:py-12"><header className="border-b border-[#2b2b2b] pb-7"><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#3ea6ff]">Producer finance</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Wallet</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#888]">Track earnings across your studios, understand what is pending, and request secure payouts.</p></header>
        <section className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Balance label="Available to withdraw" value={money(wallet.availableBalance)} icon={<WalletCards size={17} />} accent /><Balance label="Pending" value={money(wallet.pendingBalance)} icon={<Clock3 size={17} />} /><Balance label="Reserved" value={money(wallet.reservedBalance)} icon={<LockKeyhole size={17} />} /><Balance label="Withdrawn to date" value={money(wallet.withdrawnBalance)} icon={<ArrowUpRight size={17} />} /></section>
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"><section className="rounded-2xl border border-[#2b2b2b] bg-[#151515] p-5 sm:p-6"><div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666]">Studio wallets</p><h2 className="mt-2 text-xl font-semibold">Your earning accounts</h2></div><span className="text-xs text-[#666]">{wallet.studios.length} studios</span></div><div className="mt-5 space-y-3">{wallet.studios.length ? wallet.studios.map((studio) => <StudioWallet key={studio.studioId} studio={studio} onWithdraw={() => setSelectedStudio(studio)} />) : <p className="rounded-xl border border-dashed border-[#363636] p-6 text-sm text-[#777]">Create a studio listing before requesting payouts.</p>}</div></section>
            <section className="rounded-2xl border border-[#2b2b2b] bg-[#151515] p-5 sm:p-6"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666]">Payout request</p><h2 className="mt-2 text-xl font-semibold">Withdraw earnings</h2><p className="mt-2 text-sm leading-6 text-[#888]">Choose a studio wallet and send available earnings to M-Pesa.</p>{selectedStudio ? <form onSubmit={submitWithdrawal} className="mt-5 space-y-4"><div className="rounded-xl border border-[#3ea6ff]/25 bg-[#3ea6ff]/5 px-4 py-3"><p className="text-xs text-[#777]">Paying from</p><p className="mt-1 text-sm font-semibold text-[#eee]">{selectedStudio.studioName}</p><p className="mt-1 text-xs text-[#3ea6ff]">Available: {money(selectedStudio.availableBalance)}</p></div><label className="block text-xs font-medium text-[#aaa]">Amount<input required min="1" max={selectedStudio.availableBalance} type="number" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="e.g. 5000" className="mt-2 w-full rounded-xl border border-[#363636] bg-[#101010] px-4 py-3 text-sm text-white outline-none focus:border-[#3ea6ff]" /></label><label className="block text-xs font-medium text-[#aaa]">M-Pesa number<input required value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+254 7XX XXX XXX" className="mt-2 w-full rounded-xl border border-[#363636] bg-[#101010] px-4 py-3 text-sm text-white outline-none focus:border-[#3ea6ff]" /></label><button disabled={submitting} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3ea6ff] px-4 py-3 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:opacity-60">{submitting && <Loader2 size={16} className="animate-spin" />}Request payout</button><button type="button" onClick={() => setSelectedStudio(null)} className="w-full text-xs text-[#777] hover:text-white">Cancel</button></form> : <div className="mt-6 rounded-xl border border-dashed border-[#363636] p-5 text-sm leading-6 text-[#777]">Select <span className="text-[#ddd]">Withdraw</span> on a studio wallet to prepare a payout.</div>}</section></div>
        <section className="mt-6 grid gap-6 lg:grid-cols-2"><Activity title="Recent transactions" empty="No wallet transactions yet." items={wallet.transactions.map((item) => ({ id: item.id, label: item.description || item.type, meta: item.status, amount: item.amount, date: item.createdAt, incoming: item.type !== "WITHDRAWAL" }))} /><Activity title="Withdrawal history" empty="No withdrawals requested yet." items={wallet.withdrawals.map((item) => ({ id: item.id, label: `Payout · ${item.mpesaPhoneNumber || "M-Pesa"}`, meta: item.status, amount: item.amount, date: item.createdAt, incoming: false }))} /></section>
    </div>;
}

function Balance({ label, value, icon, accent = false }: { label: string; value: string; icon: React.ReactNode; accent?: boolean }) { return <div className={`rounded-2xl border p-4 ${accent ? "border-[#3ea6ff]/35 bg-[#3ea6ff]/8" : "border-[#2b2b2b] bg-[#151515]"}`}><div className="flex items-center gap-2 text-[#3ea6ff]">{icon}<span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#888]">{label}</span></div><p className="mt-4 font-mono text-xl font-semibold text-white">{value}</p></div>; }
function StudioWallet({ studio, onWithdraw }: { studio: WalletStudio; onWithdraw: () => void }) { return <div className="flex flex-col gap-4 rounded-xl border border-[#2b2b2b] bg-[#101010] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-[#eee]">{studio.studioName}</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#777]"><span>Available <b className="font-normal text-[#ddd]">{money(studio.availableBalance)}</b></span><span>Pending <b className="font-normal text-[#aaa]">{money(studio.pendingBalance)}</b></span></div></div><button type="button" disabled={studio.availableBalance <= 0} onClick={onWithdraw} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#3ea6ff]/40 px-3 py-2 text-xs font-semibold text-[#3ea6ff] transition hover:bg-[#3ea6ff]/10 disabled:cursor-not-allowed disabled:opacity-40">Withdraw <ArrowUpRight size={14} /></button></div>; }
function Activity({ title, empty, items }: { title: string; empty: string; items: { id: string; label: string; meta: string; amount: number; date?: string; incoming: boolean }[] }) { return <section className="rounded-2xl border border-[#2b2b2b] bg-[#151515] p-5 sm:p-6"><h2 className="text-lg font-semibold">{title}</h2>{items.length ? <div className="mt-4 divide-y divide-[#2b2b2b]">{items.slice(0, 8).map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"><div className="flex min-w-0 items-center gap-3"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.incoming ? "bg-emerald-400/10 text-emerald-400" : "bg-[#3ea6ff]/10 text-[#3ea6ff]"}`}>{item.incoming ? <ArrowDownLeft size={15} /> : <Banknote size={15} />}</span><div className="min-w-0"><p className="truncate text-sm text-[#ddd]">{item.label}</p><p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#666]">{item.meta} · {item.date ? new Date(item.date).toLocaleDateString() : "Recent"}</p></div></div><span className={`shrink-0 font-mono text-sm ${item.incoming ? "text-emerald-400" : "text-[#ddd]"}`}>{item.incoming ? "+" : "-"}{money(item.amount)}</span></div>)}</div> : <p className="mt-5 text-sm text-[#777]">{empty}</p>}</section>; }
