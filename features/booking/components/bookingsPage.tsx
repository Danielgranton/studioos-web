"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CalendarDays, Check, Clock3, CreditCard, LoaderCircle, MapPin, RefreshCw, Sparkles, X } from "lucide-react";

import { useSession } from "@/features/auth";
import { StudioService } from "@/features/studio";

import { BookingService } from "../services/booking.service";
import type { Booking, BookingStatus } from "../types/booking";

type Filter = "ALL" | "ACTION" | "UPCOMING" | "PAST";

export function BookingsPage() {
    const { session, isLoading: sessionLoading } = useSession();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState<Filter>("ALL");
    const [busyId, setBusyId] = useState<string | null>(null);
    const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
    const [phoneDrafts, setPhoneDrafts] = useState<Record<string, string>>({});
    const [notice, setNotice] = useState("");
    const [now, setNow] = useState(0);
    const [highlightedBooking, setHighlightedBooking] = useState<string | null>(null);
    const handledTarget = useRef<string | null>(null);
    const isProducer = session?.role === "PRODUCER";
    const canAccessBookings = session?.role === "ARTIST" || isProducer || session?.role === "SUPER_ADMIN";

    const loadBookings = useCallback(async () => {
        if (sessionLoading) return;
        if (!session || !canAccessBookings) {
            setBookings([]);
            setError("");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError("");
        try {
            if (isProducer) {
                const studios = await StudioService.getMyStudios();
                const pages = await Promise.all(studios.map((studio) => BookingService.getStudioBookings(studio.id)));
                const unique = new Map<string, Booking>();
                pages.flatMap((page) => page.content).forEach((booking) => unique.set(booking.id, booking));
                setBookings([...unique.values()].sort((a, b) => b.sessionDate.localeCompare(a.sessionDate)));
            } else {
                const page = await BookingService.getMyBookings();
                setBookings(page.content);
            }
        } catch {
            setError("We couldn't load your bookings. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }, [canAccessBookings, isProducer, session, sessionLoading]);

    useEffect(() => {
        if (sessionLoading) return;
        void loadBookings();
    }, [loadBookings, sessionLoading]);
    useEffect(() => { setNow(Date.now()); }, []);

    useEffect(() => {
        if (loading || !session) return;
        const bookingId = new URLSearchParams(window.location.search).get("bookingId");
        if (!bookingId || handledTarget.current === bookingId) return;
        handledTarget.current = bookingId;

        const existing = bookings.find((booking) => booking.id === bookingId);
        if (existing) {
            setHighlightedBooking(bookingId);
            return;
        }

        void BookingService.getBooking(bookingId).then((booking) => {
            setBookings((current) => current.some((item) => item.id === booking.id) ? current : [booking, ...current]);
            setHighlightedBooking(bookingId);
        }).catch(() => {
            setNotice("That booking may have been removed or is no longer available to your account.");
        });
    }, [bookings, loading, session]);

    useEffect(() => {
        if (!highlightedBooking) return;
        const frame = window.requestAnimationFrame(() => {
            document.getElementById(`booking-${highlightedBooking}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
        const timeout = window.setTimeout(() => setHighlightedBooking(null), 5000);
        return () => {
            window.cancelAnimationFrame(frame);
            window.clearTimeout(timeout);
        };
    }, [bookings, highlightedBooking]);

    const counts = useMemo(() => {
        const needsAction = bookings.filter((booking) => isProducer
            ? booking.status === "PENDING"
            : booking.status === "APPROVED" && booking.paymentStatus !== "PAID").length;
        const upcoming = bookings.filter((booking) => new Date(booking.sessionDate).getTime() >= now && booking.status !== "CANCELLED" && booking.status !== "EXPIRED").length;
        return { all: bookings.length, action: needsAction, upcoming };
    }, [bookings, isProducer, now]);

    const visible = bookings.filter((booking) => {
        if (filter === "ACTION") return isProducer ? booking.status === "PENDING" : booking.status === "APPROVED" && booking.paymentStatus !== "PAID";
        if (filter === "UPCOMING") return new Date(booking.sessionDate).getTime() >= now && booking.status !== "CANCELLED" && booking.status !== "EXPIRED";
        if (filter === "PAST") return booking.status === "CANCELLED" || booking.status === "EXPIRED" || new Date(booking.sessionDate).getTime() < now;
        return true;
    });

    async function confirm(booking: Booking) {
        const totalPrice = Number(priceDrafts[booking.id]);
        if (!Number.isInteger(totalPrice) || totalPrice < 1) {
            setNotice("Enter a total price in KSh before confirming.");
            return;
        }
        setBusyId(booking.id);
        setNotice("");
        try {
            await BookingService.confirmBooking(booking.id, totalPrice);
            setNotice("Booking approved. The artist can now complete payment.");
            await loadBookings();
        } catch (cause) {
            setNotice(errorMessage(cause, "Could not approve this booking."));
        } finally {
            setBusyId(null);
        }
    }

    async function pay(booking: Booking) {
        const phoneNumber = (phoneDrafts[booking.id] ?? session?.phone ?? "").trim();
        if (!phoneNumber) {
            setNotice("Enter the M-Pesa phone number that should receive the payment prompt.");
            return;
        }
        setBusyId(booking.id);
        setNotice("");
        try {
            await BookingService.initiatePayment(booking.id, phoneNumber);
            setNotice("Payment prompt sent. Complete it on your phone, then refresh booking status here.");
            await loadBookings();
        } catch (cause) {
            setNotice(errorMessage(cause, "Could not start the M-Pesa payment."));
        } finally {
            setBusyId(null);
        }
    }

    async function cancel(booking: Booking) {
        setBusyId(booking.id);
        setNotice("");
        try {
            await BookingService.cancelBooking(booking.id);
            setNotice("Booking cancelled.");
            await loadBookings();
        } catch (cause) {
            setNotice(errorMessage(cause, "Could not cancel this booking."));
        } finally {
            setBusyId(null);
        }
    }

    const tabs: { id: Filter; label: string; count?: number }[] = [
        { id: "ALL", label: "All bookings", count: counts.all },
        { id: "ACTION", label: "Needs action", count: counts.action },
        { id: "UPCOMING", label: "Upcoming", count: counts.upcoming },
        { id: "PAST", label: "Past" },
    ];

    return (
        <div className="mx-auto max-w-6xl px-4 py-7 text-[#f1f1f1] sm:px-6 sm:py-9">
            <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]">StudioOS booking desk</p><h1 className="mt-2 text-3xl font-black tracking-[-0.04em]">Bookings</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#92908a]">{isProducer ? "Review studio requests, set the session price, and keep your schedule clear." : "Track studio requests, confirm your session, and manage payment."}</p></div>
                <button type="button" onClick={() => void loadBookings()} disabled={loading} className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 px-3.5 py-2.5 text-xs font-semibold text-[#c9c5bd] transition hover:border-white/20 hover:text-white disabled:opacity-50 sm:self-auto"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh</button>
            </header>

            <div className="mt-7 flex gap-2 overflow-x-auto border-b border-white/[0.08] pb-3">
                {tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setFilter(tab.id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${filter === tab.id ? "bg-white/[0.09] text-white" : "text-[#77746e] hover:bg-white/[0.04] hover:text-[#ddd]"}`}>{tab.label}{tab.count !== undefined && <span className={`rounded-md px-1.5 py-0.5 font-mono text-[9px] ${filter === tab.id ? "bg-[#e8a33d]/15 text-[#e8a33d]" : "bg-white/[0.05] text-[#77746e]"}`}>{tab.count}</span>}</button>)}
            </div>

            {notice && <div role="status" className="mt-4 flex items-start justify-between gap-3 rounded-xl border border-[#e8a33d]/20 bg-[#e8a33d]/[0.07] px-4 py-3 text-xs leading-5 text-[#e6c891]">{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice("")}><X size={14} /></button></div>}
            {error && <BookingsError message={error} onRetry={() => void loadBookings()} />}
            {!sessionLoading && session && !canAccessBookings ? <BookingsAccessState /> : loading || sessionLoading ? <BookingsLoading /> : !error && visible.length === 0 ? <EmptyBookings producer={isProducer} filter={filter} hasBookings={bookings.length > 0} /> : <div className="mt-5 space-y-3">{visible.map((booking) => <article id={`booking-${booking.id}`} key={booking.id} className={`scroll-mt-8 rounded-2xl border p-4 transition-colors duration-700 sm:p-5 ${highlightedBooking === booking.id ? "border-[#e8a33d]/70 bg-[#211d15] shadow-[0_0_35px_rgba(232,163,61,0.12)]" : "border-white/[0.08] bg-[#151514]"}`}>
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-bold">{booking.studioName || "Studio session"}</h2><StatusBadge status={booking.status} paymentStatus={booking.paymentStatus} /></div>
                        <p className="mt-1 text-xs text-[#77746e]">{isProducer ? `Requested by ${booking.artistName || "artist"}` : "Studio booking request"}</p>
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#aaa69d]"><span className="inline-flex items-center gap-1.5"><CalendarDays size={13} className="text-[#e8a33d]" />{formatDate(booking.sessionDate)}</span><span className="inline-flex items-center gap-1.5"><Clock3 size={13} className="text-[#e8a33d]" />{formatTime(booking.sessionDate)} · {booking.durationHours} {booking.durationHours === 1 ? "hour" : "hours"}</span>{booking.totalPrice != null && <span className="inline-flex items-center gap-1.5"><CreditCard size={13} className="text-[#e8a33d]" />KSh {booking.totalPrice.toLocaleString()}</span>}</div>
                        {booking.notes && <p className="mt-4 max-w-2xl rounded-xl border border-white/[0.06] bg-black/15 px-3 py-2.5 text-xs leading-5 text-[#aaa69d]">{booking.notes}</p>}
                    </div>
                    <div className="w-full lg:max-w-[310px]">
                        {isProducer && booking.status === "PENDING" && <div className="rounded-xl border border-white/[0.08] bg-black/15 p-3"><label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#77746e]">Set total price · KSh</label><input inputMode="numeric" min="1" value={priceDrafts[booking.id] ?? ""} onChange={(event) => setPriceDrafts((current) => ({ ...current, [booking.id]: event.target.value }))} placeholder="Enter amount" className="mt-2 w-full rounded-lg border border-white/[0.1] bg-[#10100f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#e8a33d]/50"/><button type="button" disabled={busyId === booking.id} onClick={() => void confirm(booking)} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#e8a33d] px-3 py-2.5 text-xs font-bold text-[#17130c] transition hover:bg-[#f0b458] disabled:opacity-50">{busyId === booking.id ? <LoaderCircle size={14} className="animate-spin" /> : <Check size={14} />}Approve booking</button></div>}
                        {!isProducer && booking.status === "APPROVED" && booking.paymentStatus !== "PAID" && <div className="rounded-xl border border-[#e8a33d]/20 bg-[#e8a33d]/[0.05] p-3"><p className="text-xs font-semibold text-[#e5d2ac]">Your session is approved</p><label className="mt-3 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#77746e]">M-Pesa phone</label><input type="tel" value={phoneDrafts[booking.id] ?? session?.phone ?? ""} onChange={(event) => setPhoneDrafts((current) => ({ ...current, [booking.id]: event.target.value }))} placeholder="07xx xxx xxx" className="mt-2 w-full rounded-lg border border-white/[0.1] bg-[#10100f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#e8a33d]/50"/><button type="button" disabled={busyId === booking.id} onClick={() => void pay(booking)} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#e8a33d] px-3 py-2.5 text-xs font-bold text-[#17130c] transition hover:bg-[#f0b458] disabled:opacity-50">{busyId === booking.id ? <LoaderCircle size={14} className="animate-spin" /> : <CreditCard size={14} />}Pay KSh {booking.totalPrice?.toLocaleString()}</button></div>}
                        {canCancel(booking.status) && <button type="button" disabled={busyId === booking.id} onClick={() => void cancel(booking)} className="mt-2 w-full rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-semibold text-[#99958d] transition hover:border-red-300/20 hover:text-red-200 disabled:opacity-50">Cancel booking</button>}
                    </div>
                </div>
            </article>)}</div>}
            {bookings.length > 0 && <p className="mt-5 inline-flex items-center gap-2 text-[10px] text-[#66635d]"><MapPin size={12} /> Studio sessions are confirmed by the studio producer before payment.</p>}
        </div>
    );
}

function StatusBadge({ status, paymentStatus }: { status: BookingStatus; paymentStatus: Booking["paymentStatus"] }) {
    const styles: Record<BookingStatus, string> = { PENDING: "border-amber-300/20 bg-amber-300/[0.08] text-amber-200", APPROVED: "border-sky-300/20 bg-sky-300/[0.08] text-sky-200", EXPIRED: "border-white/10 bg-white/[0.04] text-[#888]", RECORDING: "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200", MIXING: "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200", READY: "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200", DELIVERED: "border-white/10 bg-white/[0.04] text-[#aaa]", CANCELLED: "border-red-300/20 bg-red-300/[0.06] text-red-200" };
    const label = status === "APPROVED" && paymentStatus === "PAID" ? "Paid · approved" : status.toLowerCase().replaceAll("_", " ");
    return <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${styles[status]}`}>{label}</span>;
}

function EmptyBookings({ producer, filter, hasBookings }: { producer: boolean; filter: Filter; hasBookings: boolean }) {
    const title = filter === "ACTION" ? "You’re all caught up" : filter === "UPCOMING" ? "No upcoming sessions" : filter === "PAST" ? "No past sessions" : producer ? "Your studio desk is clear" : "Your next session starts here";
    const copy = filter === "ACTION"
        ? producer ? "New artist requests will appear here when a producer needs to review them." : "Approved sessions waiting for your payment will appear here."
        : filter === "UPCOMING" ? "Confirmed sessions will show here with their time and payment status."
            : filter === "PAST" ? "Completed, cancelled, and expired bookings will collect here."
                : producer ? "When an artist requests a session at one of your studios, you can review the time and send a quote here."
                    : "Explore recording spaces, choose a time that works, and manage your request from this page.";
    const showDiscover = !producer && !hasBookings && filter === "ALL";
    return <div className="relative mt-6 overflow-hidden rounded-[26px] border border-white/[0.09] bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,163,61,0.10),transparent_58%),#151514] px-5 py-12 text-center sm:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-1/4 top-0 h-px bg-gradient-to-r from-transparent via-[#e8a33d]/50 to-transparent" />
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-[19px] border border-[#e8a33d]/20 bg-[#e8a33d]/[0.08] text-[#e8b557] shadow-[0_0_35px_rgba(232,163,61,0.08)]">{filter === "ALL" && !hasBookings ? <Sparkles size={23} /> : <CalendarDays size={22} />}</span>
        <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#9b7950]">{producer ? "Studio schedule" : "Session planner"}</p>
        <h2 className="mt-2 text-lg font-bold tracking-tight text-[#f2eee6]">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817e77]">{copy}</p>
        {showDiscover && <Link href="/studios" className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-[#e8a33d] px-4 text-xs font-bold text-[#17130c] transition hover:bg-[#f0b458]">Find a studio <ArrowRight size={14} /></Link>}
    </div>;
}

function BookingsLoading() {
    return <div role="status" aria-label="Loading bookings" aria-busy="true" className="mt-6 space-y-3">
        <span className="sr-only">Loading bookings</span>
        {[0, 1, 2].map((key) => <div key={key} className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#151514] p-4 sm:p-5">
            <div className="animate-pulse"><div className="flex items-center gap-2"><div className="h-4 w-40 rounded bg-white/[0.08]" /><div className="h-5 w-20 rounded-full bg-white/[0.06]" /></div><div className="mt-3 h-3 w-28 rounded bg-white/[0.05]" /><div className="mt-5 flex flex-wrap gap-3"><div className="h-8 w-36 rounded-lg bg-white/[0.05]" /><div className="h-8 w-28 rounded-lg bg-white/[0.05]" /><div className="h-8 w-24 rounded-lg bg-white/[0.05]" /></div></div>
        </div>)}
        <p className="flex items-center justify-center gap-2 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#706c64]"><LoaderCircle size={13} className="animate-spin text-[#e8a33d]" /> Syncing your schedule</p>
    </div>;
}

function BookingsAccessState() {
    return <div className="mt-6 rounded-[26px] border border-white/[0.09] bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,163,61,0.08),transparent_58%),#151514] px-5 py-12 text-center sm:py-16">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-[19px] border border-amber-200/15 bg-amber-200/[0.06] text-amber-200"><AlertCircle size={22} /></span>
        <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#9b7950]">Booking access</p>
        <h2 className="mt-2 text-lg font-bold text-[#f2eee6]">Bookings are for artists and studio producers</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817e77]">Switch to an artist or producer account to request sessions or manage studio requests.</p>
        <Link href="/dashboard" className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 px-4 text-xs font-semibold text-[#d5d0c7] transition hover:border-white/20 hover:text-white">Back to dashboard <ArrowRight size={14} /></Link>
    </div>;
}

function BookingsError({ message, onRetry }: { message: string; onRetry: () => void }) {
    return <div role="alert" className="relative mt-6 overflow-hidden rounded-[26px] border border-red-300/15 bg-[radial-gradient(ellipse_at_0%_0%,rgba(239,68,68,0.10),transparent_55%),#151514] p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-red-300/15 bg-red-300/[0.06] text-red-200"><AlertCircle size={20} /></span>
            <div className="min-w-0 flex-1"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-200/70">Schedule unavailable</p><h2 className="mt-1 text-base font-bold text-[#f2eee6]">We couldn’t sync your bookings</h2><p className="mt-1 text-sm leading-6 text-[#a69b98]">{message}</p></div>
            <button type="button" onClick={onRetry} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200/20 px-4 text-xs font-semibold text-red-100 transition hover:bg-red-200/[0.07]"><RefreshCw size={13} /> Try again</button>
        </div>
    </div>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(new Date(value)); }
function formatTime(value: string) { return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value)); }
function canCancel(status: BookingStatus) { return status === "PENDING" || status === "APPROVED"; }
function errorMessage(error: unknown, fallback: string) { return (error as { response?: { data?: { message?: string } } })?.response?.data?.message || fallback; }
