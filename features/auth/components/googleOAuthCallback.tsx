"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthService } from "../services/auth.service";
import { saveSession } from "../services/session.service";

export function GoogleOAuthCallback() {
    const router = useRouter();

    useEffect(() => {
        let active = true;
        async function finishLogin() {
            try {
                const profile = await AuthService.getMyProfile();
                if (!active) return;
                saveSession({ userId: profile.id, name: profile.name, email: profile.email, phone: profile.phone, role: profile.role });
                toast.success("Signed in with Google", { description: "Welcome to StudioOS." });
                router.replace("/");
            } catch {
                toast.error("Google sign-in could not be completed", { description: "Please try again." });
                router.replace("/auth/signin");
            }
        }
        void finishLogin();
        return () => { active = false; };
    }, [router]);

    return <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-sm text-[#888]">Completing Google sign-in...</main>;
}
