"use client";

import { useState } from "react";
import Link from "next/link";

import {
    Bell,
    CheckCheck,
    Calendar,
    Music2,
    Wallet,
    UserPlus,
    MessageSquare,
    BadgeCheck,
} from "lucide-react";

interface Notification {

    id: string;

    title: string;

    description: string;

    time: string;

    read: boolean;

    type:
        | "booking"
        | "payment"
        | "beat"
        | "message"
        | "follow"
        | "system";

}

const notifications: Notification[] = [

    {
        id: "1",
        title: "Booking Confirmed",
        description: "Studio Alpha accepted your booking.",
        time: "2 min ago",
        read: false,
        type: "booking",
    },

    {
        id: "2",
        title: "Beat Sold",
        description: "Trap Anthem was purchased.",
        time: "18 min ago",
        read: false,
        type: "beat",
    },

    {
        id: "3",
        title: "Payment Received",
        description: "KES 12,000 has been added to your wallet.",
        time: "1 hour ago",
        read: true,
        type: "payment",
    },

    {
        id: "4",
        title: "New Follower",
        description: "John Mwangi started following you.",
        time: "Yesterday",
        read: true,
        type: "follow",
    },

    {
        id: "5",
        title: "Advertisement Approved",
        description: "Your homepage advertisement is now live.",
        time: "2 days ago",
        read: true,
        type: "system",
    },

];

export default function NavbarNotifications() {

    const [open, setOpen] = useState(false);

    const unread = notifications.filter(n => !n.read).length;

    const getIcon = (type: Notification["type"]) => {

        switch (type) {

            case "booking":
                return <Calendar size={18} />;

            case "payment":
                return <Wallet size={18} />;

            case "beat":
                return <Music2 size={18} />;

            case "message":
                return <MessageSquare size={18} />;

            case "follow":
                return <UserPlus size={18} />;

            default:
                return <BadgeCheck size={18} />;

        }

    };

    return (

        <div className="relative">

            <button
                onClick={() => setOpen(!open)}
                className="
                    relative
                    rounded-full
                    p-2
                    transition
                    hover:bg-slate-800
                "
            >

                <Bell
                    className="text-slate-300"
                    size={22}
                />

                {unread > 0 && (

                    <span
                        className="
                            absolute
                            -right-1
                            -top-1
                            flex
                            h-5
                            min-w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-red-500
                            px-1
                            text-[10px]
                            font-semibold
                            text-white
                        "
                    >
                        {unread}
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
                        border-slate-700
                        bg-slate-900
                        shadow-2xl
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-slate-700
                            px-5
                            py-4
                        "
                    >

                        <h3
                            className="
                                text-lg
                                font-semibold
                                text-white
                            "
                        >
                            Notifications
                        </h3>

                        <button
                            className="
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-blue-400
                                hover:text-blue-300
                            "
                        >

                            <CheckCheck size={15} />

                            Mark all read

                        </button>

                    </div>

                    <div
                        className="
                            max-h-[450px]
                            overflow-y-auto
                        "
                    >

                        {notifications.map(notification => (

                            <button
                                key={notification.id}
                                className={`
                                    flex
                                    w-full
                                    gap-4
                                    px-5
                                    py-4
                                    text-left
                                    transition
                                    hover:bg-slate-800
                                    ${
                                        !notification.read
                                            ? "bg-slate-800/40"
                                            : ""
                                    }
                                `}
                            >

                                <div
                                    className="
                                        mt-1
                                        text-blue-400
                                    "
                                >
                                    {getIcon(notification.type)}
                                </div>

                                <div className="flex-1">

                                    <p
                                        className="
                                            font-medium
                                            text-white
                                        "
                                    >
                                        {notification.title}
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-400
                                        "
                                    >
                                        {notification.description}
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        {notification.time}
                                    </p>

                                </div>

                                {!notification.read && (

                                    <div
                                        className="
                                            mt-2
                                            h-2
                                            w-2
                                            rounded-full
                                            bg-blue-500
                                        "
                                    />

                                )}

                            </button>

                        ))}

                    </div>

                    <Link
                        href="/dashboard/notifications"
                        className="
                            block
                            border-t
                            border-slate-700
                            py-4
                            text-center
                            text-sm
                            font-medium
                            text-blue-400
                            transition
                            hover:bg-slate-800
                        "
                    >
                        View all notifications
                    </Link>

                </div>

            )}

        </div>

    );

}