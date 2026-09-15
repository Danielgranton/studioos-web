export type NotificationType = string;

export type Notification = {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedEntityId?: string | null;
    isRead: boolean;
    createdAt: string;
};

export type NotificationPage = {
    content: Notification[];
    number?: number;
    page?: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first?: boolean;
};
