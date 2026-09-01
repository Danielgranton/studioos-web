"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import { ArrowLeft, ArrowRight, Loader2, Mail, Phone, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useLogin } from "../hooks/useLogin";
import { useOtpResend } from "../hooks/useOtpResend";
import { CountryPicker } from "./registration";
import { VerifyOTP } from "./verifyOTP";

type IdentifierMode = "email" | "phone";

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]";

export function Signin() {
    const [identifier, setIdentifier] = useState("");
    const [mode, setMode] = useState<IdentifierMode>("email");
    const [dismissedError, setDismissedError] = useState(false);
    const verifyRef = useRef<HTMLDivElement>(null);
    const { state, error, delivery, login } = useLogin();
    const { resend, resendCount, resending, remaining, canResend } = useOtpResend();
    const router = useRouter();

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setDismissedError(false);
        await login(identifier);
    }

    function switchMode(option: IdentifierMode) {
        setMode(option);
        setIdentifier("");
        setDismissedError(true);
    }

    async function resendLoginOtp() {
        try {
            const sent = await resend(identifier.trim());
            if (sent) toast.success("New code sent");
        } catch (requestError) {
            const response = (requestError as { response?: { data?: { message?: string } } }).response;
            toast.error("Could not resend code", { description: response?.data?.message || "Please try again later." });
        }
    }

    useEffect(() => {
        if (state === "success") toast.success("Verification code sent", { description: "Check your email or phone." });
        if (error) toast.error("Login failed", { description: error });
    }, [error, state]);

    useEffect(() => {
        if (state === "success" && delivery) {
            window.requestAnimationFrame(() => verifyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
        }
    }, [delivery, state]);

    const showError = error && !dismissedError;

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4 py-10">
            <div className="w-full max-w-2xl rounded-[20px] border border-[#3f3f3f] bg-[#151515] p-8">
                <div className="mb-10 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#3ea6ff]/20 bg-[#3ea6ff]/10">
                            <Image src="/images/logo.png" alt="StudioOS" width={30} height={30} priority style={{ width: "auto", height: "auto" }} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#f1f1f1]">StudioOS<span className="text-[#3ea6ff]">.</span></h1>
                            <p className="mt-1 text-sm text-[#999]">Welcome back</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        aria-label="Go back"
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#3f3f3f] bg-[#181818] text-[#aaa] transition hover:border-[#3ea6ff]/40 hover:text-white ${FOCUS_RING}`}
                    >
                        <ArrowLeft size={18} />
                    </button>
                </div>

                <form className="space-y-4" onSubmit={submit} noValidate>
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight text-[#f1f1f1]">Sign in to StudioOS</h2>
                        <p className="mt-3 text-sm leading-6 text-[#999]">Use the email or phone number connected to your account.</p>
                    </div>

                    <div className="pt-4">
                        <div role="tablist" aria-label="Sign-in method" className="mb-2 grid grid-cols-2 rounded-xl border border-[#3f3f3f] bg-[#101010] p-1">
                            {(["email", "phone"] as const).map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    role="tab"
                                    aria-selected={mode === option}
                                    onClick={() => switchMode(option)}
                                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium capitalize transition ${FOCUS_RING} ${
                                        mode === option ? "bg-[#252525] text-[#f1f1f1]" : "text-[#777] hover:text-[#bdbdbd]"
                                    }`}
                                >
                                    {option === "email" ? <Mail size={14} /> : <Phone size={14} />}
                                    {option}
                                </button>
                            ))}
                        </div>

                        <label htmlFor="signin-identifier" className="sr-only">
                            {mode === "email" ? "Email address" : "Phone number"}
                        </label>
                        {mode === "email" ? (
                            <div className="relative">
                                <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717171]" />
                                <input
                                    id="signin-identifier"
                                    type="email"
                                    required
                                    autoFocus
                                    value={identifier}
                                    onChange={(event) => setIdentifier(event.target.value)}
                                    placeholder="Email address"
                                    autoComplete="email"
                                    className={`w-full rounded-xl border border-[#3f3f3f] bg-[#101010] py-3 pl-9 pr-4 text-sm text-[#f1f1f1] outline-none transition placeholder:text-[#5f5f5f] focus:border-[#3ea6ff]/70 ${FOCUS_RING}`}
                                />
                            </div>
                        ) : (
                            <PhoneInput
                                international
                                defaultCountry="KE"
                                countryCallingCodeEditable={false}
                                limitMaxLength
                                value={identifier || undefined}
                                onChange={(value) => setIdentifier(value || "")}
                                className="phone-field"
                                countrySelectComponent={CountryPicker}
                                numberInputProps={{
                                    id: "signin-identifier",
                                    required: true,
                                    autoFocus: true,
                                    autoComplete: "tel",
                                    placeholder: "700 000 000",
                                    title: "Enter a valid international phone number",
                                }}
                            />
                        )}
                    </div>

                    {showError && (
                        <p
                            role="alert"
                            aria-live="polite"
                            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type={state === "success" ? "button" : "submit"}
                        onClick={state === "success" ? resendLoginOtp : undefined}
                        disabled={state === "loading" || (state === "success" && (resending || !canResend))}
                        aria-busy={state === "loading" || resending}
                        className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#3ea6ff] text-sm font-medium text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:cursor-wait disabled:opacity-60 ${FOCUS_RING}`}
                    >
                        {state === "loading" || resending ? <Loader2 size={16} className="animate-spin" /> : state === "success" ? <RefreshCw size={16} /> : <ArrowRight size={16} />}
                        {state === "loading" ? "Sending code" : state === "success" ? (canResend ? `Resend OTP (${remaining} left)` : "Resend limit reached") : "Continue with OTP"}
                    </button>
                </form>

                {state === "success" && delivery && (
                    <div ref={verifyRef} className="mt-6 border-t border-[#3f3f3f] pt-6">
                        <VerifyOTP key={resendCount} mode="login" identifier={identifier.trim()} delivery={delivery} embedded />
                    </div>
                )}

                <p className="mt-6 text-center text-[13px] text-[#717171]">
                    New to StudioOS?{" "}
                    <button
                        type="button"
                        onClick={() => router.push("/register")}
                        className={`font-medium text-[#3ea6ff] hover:underline ${FOCUS_RING} rounded-sm`}
                    >
                        Create an account
                    </button>
                </p>
            </div>
        </div>
    );
}
