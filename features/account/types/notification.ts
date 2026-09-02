export type NotificationPreference = {
    notificationType: string;
    inAppEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
};

export type NotificationPreferenceUpdate = {
    notificationType: string;
    inAppEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
};
