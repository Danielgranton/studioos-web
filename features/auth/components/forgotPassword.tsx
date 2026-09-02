"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { usePasswordReset } from "../hooks/usePasswordReset";

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]";

export function ForgotPassword() {
    const [identifier, setIdentifier] = useState("");
    const { requestState, error, requestReset } = usePasswordReset();
    const router = useRouter();

    useEffect(() => {
        if (requestState === "success") {
            toast.success("Reset instructions sent", { description: "Check your email or phone." });
        }
    }, [requestState]);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await requestReset(identifier);
    }

    if (requestState === "success") {
        return (
            <AuthShell onBack={() => router.push("/auth/signin")}>
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3ea6ff]/10 text-[#3ea6ff]"><Check size={22} /></div>
                    <h1 className="mt-5 text-2xl font-semibold text-[#f1f1f1]">Check your inbox</h1>
                    <p className="mt-3 text-sm leading-6 text-[#999]">If an account exists for that identifier, reset instructions are on the way.</p>
                    <Link href="/auth/signin" className={`mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#3ea6ff] hover:text-[#65b8ff] ${FOCUS_RING}`}>Back to sign in <ArrowRight size={15} /></Link>
                </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell onBack={() => router.back()}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3ea6ff]">Account recovery</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#f1f1f1]">Reset your password</h1>
            <p className="mt-3 text-sm leading-6 text-[#999]">Enter the email or phone number connected to your account.</p>
            <form onSubmit={submit} className="mt-8 space-y-4">
                <label htmlFor="forgot-identifier" className="sr-only">Email or phone number</label>
                <div className="relative">
                    <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717171]" />
                    <input id="forgot-identifier" required value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="Email or phone number" autoComplete="username" className={`w-full rounded-xl border border-[#3f3f3f] bg-[#101010] py-3 pl-9 pr-4 text-sm text-[#f1f1f1] outline-none placeholder:text-[#5f5f5f] focus:border-[#3ea6ff]/70 ${FOCUS_RING}`} />
                </div>
                {error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300" role="alert">{error}</p>}
                <button type="submit" disabled={requestState === "loading"} className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#3ea6ff] text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:opacity-60 ${FOCUS_RING}`}>
                    {requestState === "loading" ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    {requestState === "loading" ? "Sending instructions" : "Send reset instructions"}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-[#777]">Remembered your password? <Link href="/auth/signin" className="font-semibold text-[#3ea6ff] hover:underline">Sign in</Link></p>
        </AuthShell>
    );
}

function AuthShell({ children, onBack }: { children: React.ReactNode; onBack: () => void }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4 py-10 text-[#f1f1f1]">
            <section className="w-full max-w-2xl rounded-[20px] border border-[#3f3f3f] bg-[#151515] p-6 sm:p-8">
                <div className="mb-8 flex items-center gap-3 border-b border-[#3f3f3f] pb-6">
                    <Image src="/images/logo.png" alt="StudioOS" width={32} height={32} priority />
                    <div>
                        <p className="text-lg font-bold tracking-tight text-[#f1f1f1]">StudioOS<span className="text-[#3ea6ff]">.</span></p>
                        <p className="text-xs text-[#777]">Creator workspace</p>
                    </div>
                </div>
                <button type="button" onClick={onBack} className={`mb-8 inline-flex items-center gap-2 text-sm text-[#888] hover:text-[#f1f1f1] ${FOCUS_RING}`}><ArrowLeft size={16} /> Back</button>
                <div className="mx-auto max-w-xl">{children}</div>
            </section>
        </main>
    );
}
