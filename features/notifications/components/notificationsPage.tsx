"use client";

import { useState } from "react";
import { Activity, Bell, CheckCheck, RefreshCw, Trash2 } from "lucide-react";

import { useNotifications } from "../hooks/useNotifications";
import { formatNotificationTime, getNotificationVisual } from "./notificationVisuals";

type Filter = "all" | "unread";

export function NotificationsPage() {
    const [filter, setFilter] = useState<Filter>("all");
    const { notifications, unreadCount, loading, error, refresh, markAsRead, markAllAsRead, remove } = useNotifications(filter === "unread");

    return (
        <div className="mx-auto max-w-5xl px-4 py-7 text-[#f1f1f1] sm:px-6 sm:py-10">
            <section className="relative overflow-hidden rounded-2xl border border-[#303030] bg-[#151515]">
                <div aria-hidden="true" className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/[0.02] blur-2xl" />
                <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#888]"><span className="h-1.5 w-1.5 rounded-full bg-[#777]" /> Signal center</div>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Keep your studio life moving.</h1>
                        <p className="mt-2 max-w-xl text-sm leading-5 text-[#888]">Bookings, releases, payments, and community activity, gathered in one clear feed.</p>
                    </div>
                    <div className="grid grid-cols-3 divide-x divide-[#353535] rounded-xl border border-[#303030] bg-[#111111] lg:min-w-[18rem]">
                        <div className="px-3 py-2.5"><div className="flex items-center gap-1.5 text-[#777]"><Bell size={13} /><span className="text-[9px] font-semibold uppercase tracking-[0.12em]">Unread</span></div><p className="mt-1 text-lg font-semibold text-white">{unreadCount}</p></div>
                        <div className="px-3 py-2.5"><div className="flex items-center gap-1.5 text-[#777]"><Activity size={13} /><span className="text-[9px] font-semibold uppercase tracking-[0.12em]">In view</span></div><p className="mt-1 text-lg font-semibold text-white">{loading ? "--" : notifications.length}</p></div>
                        <div className="flex flex-col justify-center gap-1 px-3 py-2.5 text-[10px] text-[#888]"><span className="h-1.5 w-1.5 rounded-full bg-[#777]" /> Feed live</div>
                    </div>
                </div>
            </section>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex w-fit rounded-xl border border-[#303030] bg-[#151515] p-1">
                    {(["all", "unread"] as Filter[]).map((item) => (
                        <button key={item} onClick={() => setFilter(item)} className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${filter === item ? "bg-[#3ea6ff] text-[#0f0f0f]" : "text-[#8f8f8f] hover:text-white"}`}>
                            {item} {item === "unread" && <span className="ml-1 text-xs">{unreadCount}</span>}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => void refresh()} className="inline-flex items-center gap-2 rounded-xl border border-[#353535] px-3 py-2 text-xs font-medium text-[#bdbdbd] transition hover:border-[#3ea6ff]/60 hover:text-white" aria-label="Refresh notifications"><RefreshCw size={14} /> Refresh</button>
                    {unreadCount > 0 && <button onClick={() => void markAllAsRead()} className="inline-flex items-center gap-2 rounded-xl bg-[#202b33] px-3 py-2 text-xs font-medium text-[#9fd4f8] transition hover:bg-[#263c4a]"><CheckCheck size={14} /> Mark all read</button>}
                </div>
            </div>

            <section className="mt-4 overflow-hidden rounded-2xl border border-[#303030] bg-[#141414]">
                {loading ? <NotificationSkeleton /> : error ? (
                    <div className="px-6 py-16 text-center"><p className="text-sm text-[#aaa]">{error}</p><button onClick={() => void refresh()} className="mt-4 rounded-xl bg-[#3ea6ff] px-4 py-2 text-sm font-semibold text-[#0f0f0f]">Try again</button></div>
                ) : notifications.length === 0 ? (
                    <div className="px-6 py-20 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3ea6ff]/10 text-[#3ea6ff]"><Bell size={24} /></span><h2 className="mt-5 text-lg font-semibold">You are all caught up</h2><p className="mt-2 text-sm text-[#777]">New activity from your StudioOS network will appear here.</p></div>
                ) : notifications.map((notification) => {
                    const visual = getNotificationVisual(notification);
                    const Icon = visual.icon;
                    return <article key={notification.id} className={`group flex gap-4 border-b border-[#292929] p-4 last:border-b-0 sm:p-5 ${!notification.isRead ? "bg-[#18232b]/60" : ""}`}>
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${visual.tint} ${visual.color}`}><Icon size={18} /></span>
                        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-3 gap-y-1"><h2 className={`text-sm ${notification.isRead ? "font-medium text-[#ddd]" : "font-semibold text-white"}`}>{notification.title}</h2>{!notification.isRead && <span className="h-1.5 w-1.5 rounded-full bg-[#3ea6ff]" />}<time className="text-xs text-[#707070]">{formatNotificationTime(notification.createdAt)}</time></div><p className="mt-1.5 text-sm leading-6 text-[#8e8e8e]">{notification.message}</p></div>
                        <div className="flex shrink-0 items-start gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                            {!notification.isRead && <button onClick={() => void markAsRead(notification.id)} className="rounded-lg p-2 text-[#777] transition hover:bg-[#272727] hover:text-[#9fd4f8]" aria-label={`Mark ${notification.title} as read`}><CheckCheck size={15} /></button>}
                            <button onClick={() => void remove(notification.id)} className="rounded-lg p-2 text-[#777] transition hover:bg-[#272727] hover:text-rose-300" aria-label={`Delete ${notification.title}`}><Trash2 size={15} /></button>
                        </div>
                    </article>;
                })}
            </section>
        </div>
    );
}

function NotificationSkeleton() {
    return <div className="divide-y divide-[#292929]">{[1, 2, 3, 4].map((item) => <div key={item} className="flex gap-4 p-5"><div className="h-10 w-10 animate-pulse rounded-xl bg-[#252525]" /><div className="flex-1 space-y-3"><div className="h-3 w-1/3 animate-pulse rounded bg-[#252525]" /><div className="h-3 w-4/5 animate-pulse rounded bg-[#202020]" /></div></div>)}</div>;
}
