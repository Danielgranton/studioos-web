import {
    Bell,
    CalendarCheck,
    CheckCircle2,
    CreditCard,
    Heart,
    MessageCircle,
    Music2,
    Star,
    UserPlus,
    type LucideIcon,
} from "lucide-react";

import type { Notification } from "../types/notification";

const visualMap: Record<string, { icon: LucideIcon; color: string; tint: string }> = {
    BOOKING_REQUEST: { icon: CalendarCheck, color: "text-amber-300", tint: "bg-amber-300/10" },
    BOOKING_CONFIRMED: { icon: CalendarCheck, color: "text-emerald-300", tint: "bg-emerald-300/10" },
    BOOKING_CANCELLED: { icon: CalendarCheck, color: "text-rose-300", tint: "bg-rose-300/10" },
    PAYMENT_REQUEST: { icon: CreditCard, color: "text-sky-300", tint: "bg-sky-300/10" },
    WALLET_TRANSACTION: { icon: CreditCard, color: "text-emerald-300", tint: "bg-emerald-300/10" },
    BEAT_SOLD: { icon: Music2, color: "text-violet-300", tint: "bg-violet-300/10" },
    BEAT_PURCHASED: { icon: Music2, color: "text-violet-300", tint: "bg-violet-300/10" },
    REVIEW_COMMENT: { icon: MessageCircle, color: "text-blue-300", tint: "bg-blue-300/10" },
    REVIEW_REACTION: { icon: Heart, color: "text-pink-300", tint: "bg-pink-300/10" },
    FOLLOW: { icon: UserPlus, color: "text-cyan-300", tint: "bg-cyan-300/10" },
    RATING: { icon: Star, color: "text-yellow-300", tint: "bg-yellow-300/10" },
    SYSTEM: { icon: CheckCircle2, color: "text-emerald-300", tint: "bg-emerald-300/10" },
};

export function getNotificationVisual(notification: Notification) {
    return visualMap[notification.type] ?? { icon: Bell, color: "text-[#3ea6ff]", tint: "bg-[#3ea6ff]/10" };
}

export function formatNotificationTime(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently";

    const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
