"use client";

import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useChangePassword } from "../hooks/useChangePassword";

export function ChangePasswordForm() {
    const { loading, changePassword } = useChangePassword();
    const [showPasswords, setShowPasswords] = useState(false);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const currentPassword = String(form.get("currentPassword") || "");
        const newPassword = String(form.get("newPassword") || "");
        const confirmation = String(form.get("confirmation") || "");

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (newPassword !== confirmation) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await changePassword(currentPassword, newPassword);
            event.currentTarget.reset();
            toast.success("Password updated", {
                description: "Your other sessions have been signed out.",
            });
        } catch (error) {
            const response = (error as { response?: { data?: { message?: string } } }).response;
            toast.error("Could not update password", {
                description: response?.data?.message || "Please check your details and try again.",
            });
        }
    }

    return (
        <form onSubmit={submit} className="mt-4 rounded-xl border border-[#303030] bg-[#101010] p-4">
            <div className="mb-4 flex items-start gap-3">
                <KeyRound size={17} className="mt-0.5 text-[#3ea6ff]" />
                <div>
                    <h3 className="text-sm font-medium">Update password</h3>
                    <p className="mt-1 text-xs text-[#777]">Use at least 8 characters. Leave the current password blank if you use OTP login.</p>
                </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
                <PasswordInput name="currentPassword" label="Current password" placeholder="Optional for OTP accounts" visible={showPasswords} onToggle={() => setShowPasswords((value) => !value)} />
                <PasswordInput name="newPassword" label="New password" placeholder="At least 8 characters" visible={showPasswords} onToggle={() => setShowPasswords((value) => !value)} />
                <PasswordInput name="confirmation" label="Confirm password" placeholder="Repeat new password" visible={showPasswords} onToggle={() => setShowPasswords((value) => !value)} />
            </div>
            <div className="mt-4 flex justify-end">
                <button type="submit" disabled={loading} className="rounded-xl bg-[#3ea6ff] px-4 py-2.5 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:opacity-60">
                    {loading ? "Updating..." : "Update password"}
                </button>
            </div>
        </form>
    );
}

function PasswordInput({ name, label, placeholder, visible, onToggle }: { name: string; label: string; placeholder: string; visible: boolean; onToggle: () => void }) {
    return (
        <label className="block text-xs font-medium text-[#aaa]">
            {label}
            <span className="relative mt-1.5 block">
                <input name={name} type={visible ? "text" : "password"} placeholder={placeholder} autoComplete={name === "currentPassword" ? "current-password" : "new-password"} className="w-full rounded-xl border border-[#3f3f3f] bg-[#151515] px-3.5 py-2.5 pr-10 text-sm text-[#f1f1f1] outline-none placeholder:text-[#666] focus:border-[#3ea6ff]/70" />
                <button type="button" onClick={onToggle} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777] hover:text-[#ddd]">
                    {visible ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </span>
        </label>
    );
}
