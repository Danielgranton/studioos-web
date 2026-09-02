"use client";

import { Bell, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { useNotificationPreferences } from "../hooks/useNotificationPreferences";
import type { NotificationPreference } from "../types/notification";

const groups: Record<string, string[]> = {
    Activity: ["NEW_MESSAGE", "LOGIN_ACTIVITY", "SIGNUP_ACTIVITY", "INCOMING_CALL", "MISSED_CALL"],
    Bookings: ["BOOKING_REQUEST", "BOOKING_CONFIRMED", "BOOKING_CANCELLED", "BOOKING_EXPIRED"],
    Payments: ["PAYMENT_REQUEST", "WALLET_TRANSACTION", "ESCROW_ACTIVITY", "TOPUP_REQUEST", "BEAT_SOLD", "BEAT_PURCHASED"],
    Projects: ["PROJECT_UPDATE", "BEAT_SHARED", "BEAT_PROCESSING_COMPLETED", "BEAT_PROCESSING_FAILED"],
    Advertising: ["ADVERTISEMENT_APPROVED", "ADVERTISEMENT_REJECTED", "ADVERTISEMENT_PROCESSING_COMPLETED", "ADVERTISEMENT_PROCESSING_FAILED", "ADVERTISEMENT_REVIEW_REQUIRED", "AD_CAMPAIGN_PAYMENT_SUCCESS", "AD_CAMPAIGN_PAYMENT_FAILED", "AD_CAMPAIGN_LIVE"],
};

export function NotificationPreferences() {
    const { preferences, loading, saving, error, toggle, save, reset } = useNotificationPreferences();

    async function handleSave() {
        try {
            await save();
            toast.success("Notification preferences saved");
        } catch (requestError) {
            toast.error("Could not save notification preferences", { description: getMessage(requestError) });
        }
    }

    async function handleReset() {
        try {
            await reset();
            toast.success("Notification preferences reset");
        } catch (requestError) {
            toast.error("Could not reset notification preferences", { description: getMessage(requestError) });
        }
    }

    if (loading) return <p className="mt-5 text-sm text-[#777]">Loading notification preferences...</p>;
    if (error) return <p className="mt-5 rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-200">Could not load notification preferences. Refresh and try again.</p>;

    const preferenceMap = new Map(preferences.map((preference) => [preference.notificationType, preference]));

    return (
        <div className="mt-5 overflow-hidden rounded-xl border border-[#303030] bg-[#101010]">
            <div className="flex flex-col gap-3 border-b border-[#303030] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Bell size={17} className="text-[#3ea6ff]" />
                    <p className="text-xs text-[#777]">Choose where each type of update can reach you.</p>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={() => void handleReset()} disabled={saving} className="inline-flex items-center gap-2 rounded-lg border border-[#3f3f3f] px-3 py-2 text-xs text-[#bbb] transition hover:bg-[#222] disabled:opacity-60">
                        <RotateCcw size={13} /> Reset
                    </button>
                    <button type="button" onClick={() => void handleSave()} disabled={saving} className="rounded-lg bg-[#3ea6ff] px-3 py-2 text-xs font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:opacity-60">
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </div>

            <div className="hidden grid-cols-[minmax(0,1fr)_64px_64px_64px] gap-3 border-b border-[#303030] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#666] sm:grid">
                <span>Update</span><span className="text-center">In-app</span><span className="text-center">Email</span><span className="text-center">SMS</span>
            </div>
            {Object.entries(groups).map(([group, types]) => (
                <div key={group} className="border-b border-[#303030] last:border-b-0">
                    <h3 className="px-4 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3ea6ff]">{group}</h3>
                    {types.map((type) => {
                        const preference = preferenceMap.get(type);
                        return preference ? <PreferenceRow key={type} preference={preference} onToggle={toggle} /> : null;
                    })}
                </div>
            ))}
        </div>
    );
}

function PreferenceRow({ preference, onToggle }: { preference: NotificationPreference; onToggle: (type: string, channel: "inAppEnabled" | "emailEnabled" | "smsEnabled") => void }) {
    return (
        <div className="grid gap-2 px-4 py-3 transition hover:bg-[#181818] sm:grid-cols-[minmax(0,1fr)_64px_64px_64px] sm:items-center sm:gap-3">
            <span className="text-sm text-[#ccc]">{formatLabel(preference.notificationType)}</span>
            <ChannelToggle label="In-app" checked={preference.inAppEnabled} onChange={() => onToggle(preference.notificationType, "inAppEnabled")} />
            <ChannelToggle label="Email" checked={preference.emailEnabled} onChange={() => onToggle(preference.notificationType, "emailEnabled")} />
            <ChannelToggle label="SMS" checked={preference.smsEnabled} onChange={() => onToggle(preference.notificationType, "smsEnabled")} />
        </div>
    );
}

function ChannelToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
    return <label className="flex items-center justify-between gap-3 text-xs text-[#777] sm:justify-center"><span className="sm:sr-only">{label}</span><input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-[#3ea6ff]" /></label>;
}

function formatLabel(value: string) {
    return value.toLowerCase().split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function getMessage(error: unknown) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Please try again.";
}
