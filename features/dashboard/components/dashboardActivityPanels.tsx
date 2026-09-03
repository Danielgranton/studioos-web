"use client";

import { Activity, CalendarDays, Clock3, MapPin } from "lucide-react";

import type { DashboardActivity, DashboardBooking } from "../types/overview";

export function DashboardActivityPanels({
    bookings,
    activity,
}: {
    bookings: DashboardBooking[];
    activity: DashboardActivity[];
}) {
    return (
        <section className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
            <BookingsPanel bookings={bookings} />
            <ActivityPanel activity={activity} />
        </section>
    );
}

function BookingsPanel({ bookings }: { bookings: DashboardBooking[] }) {
    return (
        <div className="rounded-2xl border border-[#303030] bg-[#151515] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666]">Your schedule</p>
                    <h2 className="mt-2 text-base font-semibold text-[#f1f1f1]">Upcoming bookings</h2>
                </div>
                <CalendarDays size={18} className="text-[#3ea6ff]" />
            </div>

            {bookings.length > 0 ? (
                <div className="mt-5 divide-y divide-[#292929]">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                            <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[#3ea6ff]/10 text-[#3ea6ff]">
                                <span className="text-[10px] font-semibold uppercase">{formatMonth(booking.startsAt)}</span>
                                <span className="text-base font-semibold leading-4">{formatDay(booking.startsAt)}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="truncate text-sm font-medium text-[#eee]">{booking.title}</p>
                                    <span className="rounded-full border border-[#3f3f3f] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#888]">{formatLabel(booking.status)}</span>
                                </div>
                                <p className="mt-1 truncate text-xs text-[#999]">{booking.counterpartyName || "StudioOS booking"}</p>
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#666]">
                                    <span className="inline-flex items-center gap-1"><Clock3 size={12} />{formatTime(booking.startsAt)}</span>
                                    {booking.location && <span className="inline-flex items-center gap-1"><MapPin size={12} />{booking.location}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyPanel icon={<CalendarDays size={17} />} title="Nothing scheduled yet" description="Your confirmed sessions will appear here." />
            )}
        </div>
    );
}

function ActivityPanel({ activity }: { activity: DashboardActivity[] }) {
    return (
        <div className="rounded-2xl border border-[#303030] bg-[#151515] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666]">Your trail</p>
                    <h2 className="mt-2 text-base font-semibold text-[#f1f1f1]">Recent activity</h2>
                </div>
                <Activity size={18} className="text-[#3ea6ff]" />
            </div>

            {activity.length > 0 ? (
                <div className="mt-5 divide-y divide-[#292929]">
                    {activity.map((item) => (
                        <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                            <p className="text-sm font-medium text-[#ddd]">{formatLabel(item.title)}</p>
                            {item.description && <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#777]">{item.description}</p>}
                            <time dateTime={item.occurredAt} className="mt-2 block text-[11px] text-[#555]">{formatDate(item.occurredAt)}</time>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyPanel icon={<Activity size={17} />} title="No activity yet" description="Your account actions will appear here." />
            )}
        </div>
    );
}

function EmptyPanel({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="mt-5 rounded-xl border border-dashed border-[#363636] px-4 py-7 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#222] text-[#777]">{icon}</span>
            <p className="mt-3 text-sm font-medium text-[#bbb]">{title}</p>
            <p className="mt-1 text-xs text-[#666]">{description}</p>
        </div>
    );
}

function formatMonth(value: string) {
    return new Intl.DateTimeFormat(undefined, { month: "short" }).format(new Date(value));
}

function formatDay(value: string) {
    return new Intl.DateTimeFormat(undefined, { day: "2-digit" }).format(new Date(value));
}

function formatTime(value: string) {
    return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function formatLabel(value: string) {
    return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
