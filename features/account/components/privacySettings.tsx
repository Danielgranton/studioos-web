"use client";

import { Eye, LockKeyhole, MessageCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { usePrivacySettings } from "../hooks/usePrivacySettings";
import type { PrivacySettings as PrivacySettingsData } from "../types/privacy";

const options: { key: keyof PrivacySettingsData; title: string; description: string; icon: typeof Eye }[] = [
    { key: "profileDiscoverable", title: "Discoverable profile", description: "Allow your profile to appear in StudioOS search and public profile links.", icon: Eye },
    { key: "emailVisible", title: "Show email on profile", description: "Let other users see your email address on your public profile.", icon: LockKeyhole },
    { key: "phoneVisible", title: "Show phone on profile", description: "Let other users see your phone number on your public profile.", icon: LockKeyhole },
    { key: "directMessagesEnabled", title: "Allow direct messages", description: "Allow other users to start conversations with you.", icon: MessageCircle },
    { key: "personalizedRecommendations", title: "Personalized recommendations", description: "Use your activity to improve studio, producer, and beat recommendations.", icon: Sparkles },
];

export function PrivacySettings() {
    const { settings, loading, saving, error, toggle, save } = usePrivacySettings();

    async function handleSave() {
        try {
            await save();
            toast.success("Privacy settings saved");
        } catch (requestError) {
            toast.error("Could not save privacy settings", { description: getMessage(requestError) });
        }
    }

    if (loading) return <p className="mt-5 text-sm text-[#777]">Loading privacy settings...</p>;
    if (error || !settings) return <p className="mt-5 rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-200">Could not load privacy settings. Refresh and try again.</p>;

    return (
        <div className="mt-5 rounded-xl border border-[#303030] bg-[#101010]">
            <div className="divide-y divide-[#303030]">
                {options.map(({ key, title, description, icon: Icon }) => (
                    <label key={key} className="flex cursor-pointer items-start justify-between gap-4 px-4 py-4 transition hover:bg-[#181818]">
                        <span className="flex gap-3">
                            <Icon size={17} className="mt-0.5 shrink-0 text-[#3ea6ff]" />
                            <span><span className="block text-sm font-medium text-[#ddd]">{title}</span><span className="mt-1 block max-w-xl text-xs leading-5 text-[#777]">{description}</span></span>
                        </span>
                        <input type="checkbox" checked={settings[key]} onChange={() => toggle(key)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#3ea6ff]" />
                    </label>
                ))}
            </div>
            <div className="flex justify-end border-t border-[#303030] px-4 py-3">
                <button type="button" onClick={() => void handleSave()} disabled={saving} className="rounded-lg bg-[#3ea6ff] px-4 py-2 text-xs font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button>
            </div>
        </div>
    );
}

function getMessage(error: unknown) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Please try again.";
}
