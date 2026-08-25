import {
    BadgeCheck,
    Calendar,
    type LucideIcon,
    MessageSquare,
    Music2,
    UserPlus,
    Wallet,
} from "lucide-react";

export type NotificationType =
    | "booking"
    | "payment"
    | "beat"
    | "message"
    | "follow"
    | "system";

export interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: NotificationType;
}

export const NOTIFICATIONS: NotificationItem[] = [
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

export const NOTIFICATION_ICONS: Record<NotificationType, LucideIcon> = {
    booking: Calendar,
    payment: Wallet,
    beat: Music2,
    message: MessageSquare,
    follow: UserPlus,
    system: BadgeCheck,
};
