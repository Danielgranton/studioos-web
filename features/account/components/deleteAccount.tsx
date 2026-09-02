"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { clearSession } from "@/features/auth";
import { useDeleteAccount } from "../hooks/useDeleteAccount";

export function DeleteAccount() {
    const { loading, deleteAccount } = useDeleteAccount();
    const [confirmation, setConfirmation] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (confirmation !== "DELETE") {
            toast.error("Type DELETE to confirm");
            return;
        }
        try {
            await deleteAccount(confirmation, currentPassword || undefined);
            clearSession();
            window.location.assign("/");
        } catch (error) {
            toast.error("Could not delete account", { description: getMessage(error) });
        }
    }

    return (
        <div className="mt-6 rounded-xl border border-red-400/25 bg-red-400/[0.03] p-4">
            <div className="flex items-start gap-3"><AlertTriangle size={17} className="mt-0.5 shrink-0 text-red-300" /><div><h3 className="text-sm font-medium text-red-100">Delete account</h3><p className="mt-1 text-xs leading-5 text-red-200/60">Your personal information will be anonymized and your account permanently disabled. Business records may be retained where required.</p></div></div>
            <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <label className="block text-xs font-medium text-[#aaa]">Type DELETE to confirm<input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="DELETE" autoComplete="off" className="mt-1.5 w-full rounded-xl border border-red-400/25 bg-[#101010] px-3.5 py-2.5 text-sm text-[#f1f1f1] outline-none placeholder:text-[#666] focus:border-red-300/60" /></label>
                <label className="block text-xs font-medium text-[#aaa]">Current password<input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Required if password is set" autoComplete="current-password" className="mt-1.5 w-full rounded-xl border border-red-400/25 bg-[#101010] px-3.5 py-2.5 text-sm text-[#f1f1f1] outline-none placeholder:text-[#666] focus:border-red-300/60" /></label>
                <button type="submit" disabled={loading} className="rounded-xl bg-red-500/85 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60">{loading ? "Deleting..." : "Delete account"}</button>
            </form>
        </div>
    );
}

function getMessage(error: unknown) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Please try again.";
}
