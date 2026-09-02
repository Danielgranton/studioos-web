"use client";

import { BriefcaseBusiness } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useRoleManagement } from "../hooks/useRoleManagement";
import type { AuthResponse } from "@/features/auth";

const roles: { value: AuthResponse["role"]; label: string; description: string }[] = [
    { value: "USER", label: "User", description: "Discover StudioOS and manage your personal profile." },
    { value: "ARTIST", label: "Artist", description: "Build a public artist profile and manage creative projects." },
    { value: "PRODUCER", label: "Producer", description: "Offer production services and manage studio bookings." },
];

export function RoleManagement({ currentRole }: { currentRole: AuthResponse["role"] }) {
    const { loading, updateRole } = useRoleManagement();
    const [role, setRole] = useState<AuthResponse["role"]>(currentRole === "ADMIN" || currentRole === "SUPER_ADMIN" ? "USER" : currentRole);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (role === currentRole) return;
        try {
            await updateRole(role);
            toast.success("Role updated", { description: "Your active sessions were refreshed for this change." });
        } catch (error) {
            toast.error("Could not update role", { description: getMessage(error) });
        }
    }

    return (
        <form onSubmit={submit} className="mt-4 rounded-xl border border-[#303030] bg-[#101010] p-4">
            <div className="flex items-start gap-3">
                <BriefcaseBusiness size={17} className="mt-0.5 text-[#3ea6ff]" />
                <div><h3 className="text-sm font-medium">Your StudioOS role</h3><p className="mt-1 text-xs leading-5 text-[#777]">Choose the role that best describes how you use StudioOS. Admin roles are assigned separately.</p></div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {roles.map((option) => (
                    <label key={option.value} className={`cursor-pointer rounded-xl border px-3 py-3 transition ${role === option.value ? "border-[#3ea6ff]/70 bg-[#3ea6ff]/10" : "border-[#303030] hover:bg-[#181818]"}`}>
                        <input type="radio" name="role" value={option.value} checked={role === option.value} onChange={() => setRole(option.value)} className="sr-only" />
                        <span className="block text-sm font-medium text-[#ddd]">{option.label}</span>
                        <span className="mt-1 block text-xs leading-5 text-[#777]">{option.description}</span>
                    </label>
                ))}
            </div>
            <div className="mt-4 flex justify-end"><button type="submit" disabled={loading || role === currentRole} className="rounded-lg bg-[#3ea6ff] px-4 py-2 text-xs font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:opacity-60">{loading ? "Updating..." : "Update role"}</button></div>
        </form>
    );
}

function getMessage(error: unknown) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Please try again.";
}
