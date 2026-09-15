"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { Bell, CheckCheck } from "lucide-react";

import { useClickOutside } from "@/features/search";
import { formatNotificationTime, getNotificationVisual, useNotifications } from "@/features/notifications";
import { useSession } from "@/features/auth";

export function NavbarNotifications() {

    const [open, setOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated } = useSession();

    useClickOutside(containerRef, () => setOpen(false));

    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(true, isAuthenticated);

    return (

        <div ref={containerRef} className="relative">

            <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Notifications"
                aria-expanded={open}
                className="
                    relative
                    rounded-full
                    p-2
                    transition
                    hover:bg-[#272727]
                "
            >

                <Bell
                    className="text-[#f1f1f1]"
                    size={22}
                />

                {unreadCount > 0 && (

                    <span
                        className="
                            absolute
                            -right-0.5
                            -top-0.5
                            flex
                            h-5
                            min-w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-500
                            px-1
                            text-[10px]
                            font-semibold
                            text-white
                        "
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>

                )}

            </button>

            {open && (

                <div
                    className="
                        absolute
                        right-0
                        mt-3
                        w-96
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[#3f3f3f]
                        bg-[#181818]
                        shadow-2xl
                        
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-[#3f3f3f]
                            px-5
                            py-4
                        "
                    >

                        <h3 className="text-base flex gap-2 font-semibold text-white">
                            <Bell size={20} className="text-green-600"/>
                            Notifications
                        </h3>

                        {unreadCount > 0 && (

                            <button
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                    text-xs
                                    font-medium
                                    text-[#3ea6ff]
                                    transition
                                    hover:text-white
                                "
                                onClick={() => void markAllAsRead()}
                            >
                                <CheckCheck size={15} />
                                Mark all read
                            </button>

                        )}

                    </div>

                    {loading ? (
                        <div className="space-y-3 px-5 py-8">
                            <div className="h-3 w-1/2 animate-pulse rounded bg-[#2a2a2a]" />
                            <div className="h-3 w-4/5 animate-pulse rounded bg-[#232323]" />
                            <div className="h-3 w-2/3 animate-pulse rounded bg-[#232323]" />
                        </div>
                    ) : notifications.length === 0 ? (

                        <div className="px-5 py-12 text-center">

                            <Bell size={28} className="mx-auto mb-3 text-[#5a5a5a]" />

                            <p className="text-sm text-[#aaaaaa]">
                                You&rsquo;re all caught up
                            </p>

                        </div>

                    ) : (

                        <div className="max-h-[420px] overflow-y-auto no-scrollbar">

                            {notifications.slice(0, 6).map((notification) => (

                                <button
                                    key={notification.id}
                                    onClick={() => void markAsRead(notification.id)}
                                    className={`
                                        flex
                                        w-full
                                        gap-4
                                        px-5
                                        py-4
                                        text-left
                                        transition
                                        hover:bg-[#272727]
                                        ${!notification.isRead ? "bg-[#272727]/40" : ""}
                                    `}
                                >

                                    <div className="mt-0.5 text-[#3ea6ff]">
                                        {(() => {
                                            const Icon = getNotificationVisual(notification).icon;

                                            return <Icon size={18} />;
                                        })()}
                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <p className="truncate text-sm font-medium text-white">
                                            {notification.title}
                                        </p>

                                        <p className="mt-0.5 line-clamp-2 text-xs text-[#aaaaaa]">
                                            {notification.message}
                                        </p>

                                        <p className="mt-1.5 text-[11px] text-[#717171]">
                                            {formatNotificationTime(notification.createdAt)}
                                        </p>

                                    </div>

                                    {!notification.isRead && (
                                        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#3ea6ff]" />
                                    )}

                                </button>

                            ))}

                        </div>

                    )}

                    <Link
                        href="/dashboard/notifications"
                        onClick={() => setOpen(false)}
                        className="
                            block
                            border-t
                            border-[#3f3f3f]
                            py-3.5
                            text-center
                            text-sm
                            font-medium
                            text-[#3ea6ff]
                            transition
                            hover:bg-[#272727]
                        "
                    >
                        View all notifications
                    </Link>

                </div>

            )}

        </div>

    );

}
