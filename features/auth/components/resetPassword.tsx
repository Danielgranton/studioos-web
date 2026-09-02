"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { usePasswordReset } from "../hooks/usePasswordReset";

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]";

export function ResetPassword() {
    const params = useSearchParams();
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { resetState, error, session, resetPassword } = usePasswordReset();
    const router = useRouter();

    useEffect(() => {
        setToken(params.get("token") || "");
    }, [params]);

    useEffect(() => {
        if (session) {
            toast.success("Password reset", { description: "You are now signed in." });
            router.replace("/");
        }
    }, [router, session]);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (password !== confirmation) return;
        await resetPassword(token, password);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4 py-10 text-[#f1f1f1]">
            <section className="w-full max-w-2xl rounded-[20px] border border-[#3f3f3f] bg-[#151515] p-6 sm:p-8">
                <div className="mb-8 flex items-center gap-3 border-b border-[#3f3f3f] pb-6">
                    <Image src="/images/logo.png" alt="StudioOS" width={32} height={32} priority />
                    <div>
                        <p className="text-lg font-bold tracking-tight">StudioOS<span className="text-[#3ea6ff]">.</span></p>
                        <p className="text-xs text-[#777]">Creator workspace</p>
                    </div>
                </div>
                <Link href="/auth/signin" className={`inline-flex items-center gap-2 text-sm text-[#888] hover:text-[#f1f1f1] ${FOCUS_RING}`}><ArrowLeft size={16} /> Back to sign in</Link>
                <div className="mx-auto max-w-xl">
                    <p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-[#3ea6ff]">Account recovery</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight">Create a new password</h1>
                    <p className="mt-3 text-sm leading-6 text-[#999]">Use at least 8 characters. This will sign you out of other devices.</p>
                    <form onSubmit={submit} className="mt-8 space-y-4">
                    <label htmlFor="reset-token" className="sr-only">Reset token</label>
                    <input id="reset-token" required value={token} onChange={(event) => setToken(event.target.value)} placeholder="Reset token" autoComplete="one-time-code" className={`w-full rounded-xl border border-[#3f3f3f] bg-[#101010] px-4 py-3 text-sm text-[#f1f1f1] outline-none placeholder:text-[#5f5f5f] focus:border-[#3ea6ff]/70 ${FOCUS_RING}`} />
                    <PasswordField id="reset-password" value={password} onChange={setPassword} visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} placeholder="New password" />
                    <PasswordField id="reset-confirmation" value={confirmation} onChange={setConfirmation} visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} placeholder="Confirm new password" />
                    {confirmation && password !== confirmation && <p className="text-xs text-red-300">Passwords do not match.</p>}
                    {error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300" role="alert">{error}</p>}
                    <button type="submit" disabled={resetState === "loading" || password.length < 8 || password !== confirmation} className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#3ea6ff] text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:opacity-60 ${FOCUS_RING}`}>
                        {resetState === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        {resetState === "loading" ? "Updating password" : "Update password"}
                    </button>
                    </form>
                </div>
            </section>
        </main>
    );
}

function PasswordField({ id, value, onChange, visible, onToggle, placeholder }: { id: string; value: string; onChange: (value: string) => void; visible: boolean; onToggle: () => void; placeholder: string }) {
    return (
        <div className="relative">
            <label htmlFor={id} className="sr-only">{placeholder}</label>
            <input id={id} type={visible ? "text" : "password"} required minLength={8} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete={id === "reset-password" ? "new-password" : "new-password"} className={`w-full rounded-xl border border-[#3f3f3f] bg-[#101010] px-4 py-3 pr-12 text-sm text-[#f1f1f1] outline-none placeholder:text-[#5f5f5f] focus:border-[#3ea6ff]/70 ${FOCUS_RING}`} />
            <button type="button" onClick={onToggle} aria-label={visible ? `Hide ${placeholder.toLowerCase()}` : `Show ${placeholder.toLowerCase()}`} className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#777] hover:text-[#f1f1f1] ${FOCUS_RING}`}>{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
        </div>
    );
}
