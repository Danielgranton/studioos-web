"use client";

import { ClipboardEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useVerifyRegistration } from "../hooks/useVerifyRegistration";
import { useVerifyLogin } from "../hooks/useVerifyLogin";
import { AuthResponse, OtpSentResponse } from "../types/auth";

type VerifyOTPProps = {
    identifier: string;
    delivery: OtpSentResponse;
    mode?: "registration" | "login";
    embedded?: boolean;
    onVerified?: (user: AuthResponse) => void | Promise<void>;
};

export function VerifyOTP({ identifier, delivery, mode = "registration", embedded = false, onVerified }: VerifyOTPProps) {
    const [code, setCode] = useState("");
    const submittingRef = useRef(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const { loading, error, user, verify } = useVerifyRegistration();
    const loginVerification = useVerifyLogin();
    const router = useRouter();
    const activeLoading = mode === "login" ? loginVerification.loading : loading;
    const activeError = mode === "login" ? loginVerification.error : error;
    const activeUser = mode === "login" ? loginVerification.user : user;
    const handledUserRef = useRef<number | null>(null);

    useEffect(() => {
        if (activeUser && handledUserRef.current !== activeUser.userId) {
            handledUserRef.current = activeUser.userId;
            void (async () => {
                await onVerified?.(activeUser);
                toast.success(mode === "login" ? "Signed in" : "Account verified", { description: "Welcome to StudioOS." });
                router.replace("/");
            })();
        }
    }, [activeUser, mode, onVerified, router]);

    useEffect(() => {
        if (activeError) toast.error("Verification failed", { description: activeError });
    }, [activeError]);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submittingRef.current || activeLoading || code.length !== 6) return;
        submittingRef.current = true;
        try {
            if (mode === "login") await loginVerification.verify(identifier, code);
            else await verify(identifier, code);
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
        if (event.key === "Backspace" && !code[index] && index > 0) inputRefs.current[index - 1]?.focus();
    }

    function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
        event.preventDefault();
        const pastedCode = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pastedCode) return;
        setCode(pastedCode);
        inputRefs.current[Math.min(pastedCode.length, 6) - 1]?.focus();
    }

    if (activeUser) {
        return <div className="py-8 text-center text-[#f1f1f1]"><Check className="mx-auto text-[#3ea6ff]" size={32} /><h2 className="mt-3 text-xl font-semibold">{mode === "login" ? "Signed in" : "Account verified"}</h2></div>;
    }

    const target = delivery.maskedEmail || delivery.maskedPhone || identifier;

    return (
        <section className={embedded ? "rounded-xl border border-[#3f3f3f] bg-[#151515] p-4 sm:p-5" : "min-h-[calc(100vh-5rem)] bg-[#0f0f0f] px-4 py-10 text-[#f1f1f1]"}>
            <form onSubmit={submit} className={embedded ? "" : "mx-auto max-w-md rounded-3xl border border-[#3f3f3f] bg-[#151515] p-6 sm:p-10"}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3ea6ff]">Verify your account</p>
                        <h2 className="mt-1 text-lg font-semibold text-[#f1f1f1]">Enter the code</h2>
                        <p className="mt-1 text-xs text-[#888]">We sent a 6-digit code to {target}.</p>
                    </div>
                    <span className="rounded-md bg-[#3ea6ff]/10 px-1.5 py-1 font-mono text-[10px] text-[#3ea6ff]">OTP</span>
                </div>

                <div className="mx-auto mt-5 flex max-w-[280px] justify-center gap-1.5 sm:gap-2" role="group" aria-label="6-digit verification code">
                    {Array.from({ length: 6 }, (_, index) => (
                        <input
                            key={index}
                            ref={(element) => { inputRefs.current[index] = element; }}
                            aria-label={`Verification digit ${index + 1}`}
                            autoFocus={index === 0}
                            inputMode="numeric"
                            maxLength={1}
                            value={code[index] || ""}
                            onChange={(event) => updateCode(index, event.target.value)}
                            onKeyDown={(event) => handleKeyDown(index, event)}
                            onPaste={handlePaste}
                            className="h-11 w-9 rounded-lg border border-[#3f3f3f] bg-[#101010] text-center font-mono text-lg text-[#f1f1f1] outline-none transition focus:border-[#3ea6ff] focus:ring-4 focus:ring-[#3ea6ff]/10 sm:h-12 sm:w-10"
                        />
                    ))}
                </div>

                <p className="mt-3 min-h-5 text-xs text-red-300" role="alert" aria-live="assertive">{activeError}</p>
                <button disabled={activeLoading || code.length !== 6} aria-busy={activeLoading} type="submit" className="mt-1 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#3ea6ff] text-xs font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:cursor-not-allowed disabled:opacity-60">
                    {activeLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    {activeLoading ? "Verifying..." : "Verify code"}
                </button>

                <p className="mt-3 border-t border-[#3f3f3f] pt-3 text-[11px] text-[#777]">Code expires in 10 minutes</p>
            </form>
        </section>
    );
}
