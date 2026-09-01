
"use client";

import { ClipboardEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2, Mail, Phone, RefreshCw, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useVerifyRegistration } from "../hooks/useVerifyRegistration";
import { useVerifyLogin } from "../hooks/useVerifyLogin";
import { AuthService } from "../services/auth.service";
import { OtpSentResponse } from "../types/auth";

export function VerifyOTP({ identifier, delivery, mode = "registration" }: { identifier: string; delivery: OtpSentResponse; mode?: "registration" | "login" }) {
    const [code, setCode] = useState("");
    const [resendSeconds, setResendSeconds] = useState(30);
    const [resending, setResending] = useState(false);
    const [resendError, setResendError] = useState("");
    const submittingRef = useRef(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const { loading, error, user, verify } = useVerifyRegistration();
    const loginVerification = useVerifyLogin();
    const router = useRouter();
    const activeLoading = mode === "login" ? loginVerification.loading : loading;
    const activeError = mode === "login" ? loginVerification.error : error;
    const activeUser = mode === "login" ? loginVerification.user : user;

    useEffect(() => {
        if (activeUser) {
            toast.success(mode === "login" ? "Signed in" : "Account verified", { description: "Welcome to StudioOS." });
            router.replace("/");
        }
    }, [activeUser, mode, router]);

    useEffect(() => {
        if (activeError) toast.error("Verification failed", { description: activeError });
    }, [activeError]);

    useEffect(() => {
        if (resendSeconds <= 0) return;
        const timer = window.setInterval(() => {
            setResendSeconds((seconds) => Math.max(0, seconds - 1));
        }, 1000);
        return () => window.clearInterval(timer);
    }, [resendSeconds]);

    async function resend() {
        setResending(true);
        setResendError("");
        try {
            await AuthService.resendOtp(identifier);
            setCode("");
            setResendSeconds(30);
            toast.success("New code sent", { description: "Your previous code is no longer valid." });
        } catch (requestError) {
            const response = (requestError as { response?: { data?: { message?: string } } }).response;
            const message = response?.data?.message || "We could not resend the verification code.";
            setResendError(message);
            toast.error("Could not resend code", { description: message });
        } finally {
            setResending(false);
        }
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submittingRef.current || activeLoading || code.length !== 6) return;

        submittingRef.current = true;
        try {
            if (mode === "login") await loginVerification.verify(identifier, code.trim());
            else await verify(identifier, code.trim());
        } finally {
            submittingRef.current = false;
        }
    }

    function updateCode(index: number, value: string) {
        const digit = value.replace(/\D/g, "").slice(-1);
        const nextCode = code.split("");
        nextCode[index] = digit;
        setCode(nextCode.join("").slice(0, 6));
        if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    }

    function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
        event.preventDefault();
        const pastedCode = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pastedCode) return;
        setCode(pastedCode);
        inputRefs.current[Math.min(pastedCode.length, 6) - 1]?.focus();
    }

    if (activeUser) {
        return <div className="mx-auto max-w-md px-6 py-20 text-center text-[#f1f1f1]"><Check className="mx-auto text-[#3ea6ff]" size={36} /><h1 className="mt-5 text-2xl font-semibold">{mode === "login" ? "Signed in" : "Account verified"}</h1><p className="mt-2 text-sm text-[#999]">Welcome to StudioOS, {activeUser.name}.</p></div>;
    }

    const emailTarget = delivery.maskedEmail || (identifier.includes("@") ? identifier : "");
    const phoneTarget = delivery.maskedPhone || (!identifier.includes("@") ? identifier : "");

    return (
        <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[#0f0f0f] px-4 py-12 text-[#f1f1f1] sm:px-6 sm:py-20">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(62,166,255,0.09),transparent_38%)]" />
            <form onSubmit={submit} className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-[#3f3f3f] bg-[#151515] shadow-2xl shadow-black/30">
                <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
                    <div className="border-b border-[#3f3f3f] bg-[#181818] p-6 sm:p-10 lg:border-b-0 lg:border-r">
                        <button type="button" onClick={() => router.back()} className="mb-12 inline-flex items-center gap-2 text-xs font-medium text-[#888] transition hover:text-[#f1f1f1]">
                            <ArrowLeft size={15} /> Back
                        </button>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#3ea6ff]/20 bg-[#3ea6ff]/10 text-[#3ea6ff]">
                            <ShieldCheck size={26} />
                        </div>
                        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-[#3ea6ff]">Secure verification</p>
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Check your inbox.</h1>
                        <p className="mt-4 max-w-sm text-sm leading-7 text-[#999]">
                            Enter the one-time code to {mode === "login" ? "continue to your StudioOS account" : "finish creating your StudioOS account"}.
                        </p>
                        <div className="mt-8 space-y-3">
                            {emailTarget && <DeliveryRow icon={<Mail size={15} />} label="Email" value={emailTarget} />}
                            {phoneTarget && <DeliveryRow icon={<Phone size={15} />} label="Phone" value={phoneTarget} />}
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 lg:p-14">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-[#f1f1f1]">Verification code</p>
                                <p id="otp-help" className="mt-1 text-xs text-[#777]">Use the 6-digit code we just sent.</p>
                            </div>
                            <span className="rounded-full border border-[#3f3f3f] px-3 py-1.5 font-mono text-[11px] text-[#888]">10:00 expiry</span>
                        </div>

                        <div className="mt-10 flex justify-between gap-2 sm:justify-start sm:gap-3" role="group" aria-label="6-digit verification code">
                            {Array.from({ length: 6 }, (_, index) => (
                                <input
                                    key={index}
                                    ref={(element) => { inputRefs.current[index] = element; }}
                                    aria-label={`Verification digit ${index + 1}`}
                                    aria-describedby="otp-help"
                                    autoFocus={index === 0}
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={code[index] || ""}
                                    onChange={(event) => updateCode(index, event.target.value)}
                                    onKeyDown={(event) => handleKeyDown(index, event)}
                                    onPaste={handlePaste}
                                    className="h-14 min-w-0 flex-1 rounded-2xl border border-[#3f3f3f] bg-[#101010] text-center font-mono text-2xl text-[#f1f1f1] outline-none transition focus:border-[#3ea6ff] focus:bg-[#171717] focus:ring-4 focus:ring-[#3ea6ff]/10 sm:h-16 sm:max-w-[68px]"
                                />
                            ))}
                        </div>

                        <p className="mt-4 min-h-5 text-sm text-red-300" role="alert" aria-live="assertive">{activeError || resendError}</p>
                        <button disabled={activeLoading || code.length !== 6} aria-busy={activeLoading} type="submit" className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#3ea6ff] px-5 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:cursor-not-allowed disabled:opacity-60">
                            {activeLoading ? <Loader2 size={17} className="animate-spin" /> : <Check size={17} />}
                            {activeLoading ? "Verifying code" : "Verify and continue"}
                        </button>

                        <div className="mt-8 flex flex-col gap-3 border-t border-[#3f3f3f] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-[#777]">Did not receive a code?</span>
                            <button type="button" onClick={resend} disabled={resending || resendSeconds > 0} aria-busy={resending} className="inline-flex items-center gap-2 font-semibold text-[#3ea6ff] transition hover:text-[#65b8ff] disabled:cursor-not-allowed disabled:text-[#666]">
                                <RefreshCw size={13} className={resending ? "animate-spin" : ""} />
                                {resending ? "Sending new code..." : resendSeconds > 0 ? `Resend in ${resendSeconds}s` : "Send a new code"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
}

function DeliveryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-[#3f3f3f] bg-[#101010] px-4 py-3">
            <span className="text-[#3ea6ff]">{icon}</span>
            <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-[#666]">{label}</span>
                <span className="block truncate text-sm text-[#c9c9c9]">{value}</span>
            </span>
        </div>
    );
}
