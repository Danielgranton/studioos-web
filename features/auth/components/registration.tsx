"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import { ArrowLeft, Loader2, Mail, RefreshCw, Upload, UserRound } from "lucide-react";
import { toast } from "sonner";

import { useRegistration } from "../hooks/useRegistration";
import { useOtpResend } from "../hooks/useOtpResend";
import { VerifyOTP } from "./verifyOTP";

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]";

export function Registration() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", acceptedTerms: false });
    const { state, error, fieldErrors, otpDelivery, register } = useRegistration();
    const router = useRouter();
    const verifyRef = useRef<HTMLDivElement>(null);
    const { resend, resendCount, resending, remaining, canResend } = useOtpResend();

    function updateField(field: keyof typeof form, value: string | boolean) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await register({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            password: form.password || undefined,
        });
    }

    async function resendRegistrationOtp() {
        try {
            const sent = await resend(form.email.trim());
            if (sent) toast.success("New code sent");
        } catch (requestError) {
            const response = (requestError as { response?: { data?: { message?: string } } }).response;
            toast.error("Could not resend code", { description: response?.data?.message || "Please try again later." });
        }
    }

    useEffect(() => {
        if (state === "success" && otpDelivery) {
            toast.success("Verification code sent", {
                description: `Check ${form.email.trim()} for your code.`,
            });
            requestAnimationFrame(() => verifyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
        }
    }, [state, otpDelivery, form.email]);

    useEffect(() => {
        if (error) toast.error("Registration failed", { description: error });
    }, [error]);

    function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) setPreview(URL.createObjectURL(file));
        // TODO: hand `file` to register() once the endpoint accepts a photo —
        // profile images are currently URL strings only (S3 upload deferred).
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4 py-10">
            <div className="w-full max-w-2xl rounded-[20px] border border-[#3f3f3f] bg-[#151515] p-8">
                <div className="mb-10 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#3ea6ff]/20 bg-[#3ea6ff]/10">
                            <Image src="/images/logo.png" alt="StudioOS" width={30} height={30} priority style={{ width: "auto", height: "auto" }} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#f1f1f1]">
                                StudioOS<span className="text-[#3ea6ff]">.</span>
                            </h1>
                            <p className="mt-1 text-sm text-[#999]">Create your account</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        aria-label="Go back"
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#3f3f3f] bg-[#181818] text-[#aaaaaa] transition hover:border-[#3ea6ff]/40 hover:text-[#f1f1f1] ${FOCUS_RING}`}
                    >
                        <ArrowLeft size={18} />
                    </button>
                </div>

                <form className="space-y-4" onSubmit={submit}>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhoto}
                    />
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className={`w-full cursor-pointer rounded-2xl border-[1.5px] border-dashed border-[#3ea6ff]/25 bg-[#3ea6ff]/5 p-5 text-center transition-all hover:border-[#3ea6ff]/60 hover:bg-[#3ea6ff]/10 ${FOCUS_RING}`}
                    >
                        {preview ? (
                            <div className="relative h-48 w-full overflow-hidden rounded-xl">
                                <Image src={preview} alt="Profile preview" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2.5 py-4">
                                <div className="flex h-9 w-12 items-center justify-center rounded-xl border border-[#3ea6ff]/20 bg-[#3ea6ff]/10">
                                    <Upload size={20} className="text-[#3ea6ff]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#f1f1f1]">Add a profile photo</p>
                                    <p className="mt-0.5 text-xs text-[#717171]">JPG, PNG or WEBP · up to 5 MB</p>
                                </div>
                            </div>
                        )}
                    </button>

                    <div className="relative">
                        <label htmlFor="registration-name" className="sr-only">Full name</label>
                        <UserRound size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717171]" />
                        <input
                            id="registration-name"
                            type="text"
                            placeholder="Full name"
                            autoComplete="name"
                            required
                            aria-invalid={Boolean(fieldErrors.name)}
                            aria-describedby={fieldErrors.name ? "registration-name-error" : undefined}
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            className={`w-full rounded-xl border border-[#3f3f3f] bg-[#101010] py-3 pl-9 pr-4 text-sm text-[#f1f1f1] outline-none transition placeholder:text-[#5f5f5f] focus:border-[#3ea6ff]/70 ${FOCUS_RING}`}
                        />
                        {fieldErrors.name && <p id="registration-name-error" className="mt-1 text-xs text-red-300">{fieldErrors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="relative">
                            <label htmlFor="registration-email" className="sr-only">Email address</label>
                            <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717171]" />
                            <input
                                id="registration-email"
                                type="email"
                                placeholder="Email"
                                autoComplete="email"
                                required
                                aria-invalid={Boolean(fieldErrors.email)}
                                aria-describedby={fieldErrors.email ? "registration-email-error" : undefined}
                                value={form.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                className={`w-full rounded-xl border border-[#3f3f3f] bg-[#101010] py-3 pl-9 pr-3 text-sm text-[#f1f1f1] outline-none transition placeholder:text-[#5f5f5f] focus:border-[#3ea6ff]/70 ${FOCUS_RING}`}
                            />
                            {fieldErrors.email && <p id="registration-email-error" className="mt-1 text-xs text-red-300">{fieldErrors.email}</p>}
                        </div>
                        <div className="relative">
                            <label htmlFor="registration-phone" className="sr-only">Phone number</label>
                            <PhoneInput
                                international
                                defaultCountry="KE"
                                countryCallingCodeEditable={false}
                                limitMaxLength
                                value={form.phone || undefined}
                                onChange={(value) => setForm({ ...form, phone: value || "" })}
                                className="phone-field"
                                countrySelectComponent={CountryPicker}
                                numberInputProps={{
                                    id: "registration-phone",
                                    required: true,
                                    autoComplete: "tel",
                                    placeholder: "700 000 000",
                                    title: "Enter a valid international phone number",
                                    "aria-invalid": Boolean(fieldErrors.phone),
                                    "aria-describedby": fieldErrors.phone ? "registration-phone-error" : undefined,
                                }}
                            />
                            {fieldErrors.phone && <p id="registration-phone-error" className="mt-1 text-xs text-red-300">{fieldErrors.phone}</p>}
                        </div>
                    </div>

                    <label htmlFor="registration-password" className="sr-only">Password (optional)</label>
                    <input
                        id="registration-password"
                        type="password"
                        placeholder="Password (optional)"
                        autoComplete="new-password"
                        minLength={form.password ? 8 : undefined}
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        aria-invalid={Boolean(fieldErrors.password)}
                        aria-describedby={fieldErrors.password ? "registration-password-error" : undefined}
                        className={`w-full rounded-xl border border-[#3f3f3f] bg-[#101010] px-4 py-3 text-sm text-[#f1f1f1] outline-none transition placeholder:text-[#5f5f5f] focus:border-[#3ea6ff]/70 ${FOCUS_RING}`}
                    />
                    {fieldErrors.password && <p id="registration-password-error" className="-mt-2 text-xs text-red-300">{fieldErrors.password}</p>}

                    <label className="flex items-start gap-3 text-xs leading-5 text-[#999]">
                        <input
                            type="checkbox"
                            required
                            checked={form.acceptedTerms}
                            onChange={(e) => setForm({ ...form, acceptedTerms: e.target.checked })}
                            className="mt-1 h-4 w-4 shrink-0 accent-[#3ea6ff]"
                        />
                        <span>
                            I agree to the{" "}
                            <a href="/terms" className="text-[#3ea6ff] hover:underline">Terms of Service</a>
                            {" "}and{" "}
                            <a href="/privacy" className="text-[#3ea6ff] hover:underline">Privacy Policy</a>.
                        </span>
                    </label>

                    <button
                        type={state === "success" ? "button" : "submit"}
                        onClick={state === "success" ? resendRegistrationOtp : undefined}
                        disabled={state === "loading" || (state === "success" && (resending || !canResend))}
                        aria-busy={state === "loading" || resending}
                        className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-0 bg-[#3ea6ff] text-sm font-medium text-[#0f0f0f] shadow-none transition-all duration-200 hover:bg-[#65b8ff] active:scale-[.98] disabled:cursor-wait disabled:opacity-60 ${FOCUS_RING}`}
                    >
                        {state === "loading" || resending ? <Loader2 size={16} className="animate-spin" /> : state === "success" ? <RefreshCw size={16} /> : null}
                        {state === "loading" ? "Creating" : state === "success" ? (canResend ? `Resend OTP (${remaining} left)` : "Resend limit reached") : "Create account"}
                    </button>

                    {error && (
                        <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300" role="alert" aria-live="assertive">
                            {error}
                        </p>
                    )}
                </form>

                {state === "success" && otpDelivery && (
                    <div ref={verifyRef} className="mt-8 border-t border-[#3f3f3f] pt-6">
                        <div className="mb-4">
                            <p className="text-base font-bold text-[#f1f1f1]">Verify your email</p>
                            <p className="mt-1 text-sm text-[#999]">
                                Enter the code sent to{" "}
                                <span className="font-semibold text-[#f1f1f1]">{form.email.trim()}</span>.
                            </p>
                        </div>
                        <VerifyOTP key={resendCount} identifier={form.email.trim()} delivery={otpDelivery} embedded />
                    </div>
                )}

                <p className="mt-4 text-center text-[13px] text-[#717171]">
                    Already have an account?{" "}
                    <button
                        onClick={() => router.push("/auth/signin")}
                        className={`font-medium text-[#3ea6ff] hover:underline ${FOCUS_RING} rounded-sm`}
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
}

export type CountryOption = {
    value?: string;
    label?: string;
    divider?: boolean;
};

export function CountryPicker({
    value,
    onChange,
    options,
    disabled,
    readOnly,
}: {
    value?: string;
    onChange: (value?: string) => void;
    options: CountryOption[];
    disabled?: boolean;
    readOnly?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const pickerRef = useRef<HTMLDivElement>(null);
    const visibleOptions = options.filter(
        (option) => !option.divider && option.label?.toLowerCase().includes(query.toLowerCase()),
    );

    useEffect(() => {
        if (!open) return;

        function closeOnOutside(event: MouseEvent) {
            if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
        }

        document.addEventListener("mousedown", closeOnOutside);
        return () => document.removeEventListener("mousedown", closeOnOutside);
    }, [open]);

    return (
        <div ref={pickerRef} className="relative shrink-0">
            <button
                type="button"
                disabled={disabled || readOnly}
                aria-label="Select country"
                aria-expanded={open}
                aria-haspopup="listbox"
                onClick={() => setOpen((current) => !current)}
                className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm text-[#f1f1f1] outline-none transition hover:bg-[#1f1f1f] focus-visible:ring-2 focus-visible:ring-[#3ea6ff] disabled:opacity-50"
            >
                <span aria-hidden="true" className="text-base">{countryFlag(value)}</span>
                <span className="font-mono text-xs text-[#bdbdbd]">{value || "INT"}</span>
                <span className="text-[10px] text-[#777]">▾</span>
            </button>

            {open && (
                <div className="absolute left-0 top-[calc(100%+0.6rem)] z-50 w-64 overflow-hidden rounded-2xl border border-[#3f3f3f] bg-[#181818] p-2 shadow-2xl shadow-black/50">
                    <input
                        autoFocus
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search country"
                        aria-label="Search countries"
                        className="mb-2 w-full rounded-xl border border-[#3f3f3f] bg-[#101010] px-3 py-2 text-xs text-[#f1f1f1] outline-none placeholder:text-[#717171] focus:border-[#3ea6ff]/70"
                    />
                    <div role="listbox" aria-label="Countries" className="max-h-56 overflow-y-auto">
                        {visibleOptions.map((option) => (
                            <button
                                key={option.value || option.label}
                                type="button"
                                role="option"
                                aria-selected={option.value === value}
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                    setQuery("");
                                }}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs transition hover:bg-[#272727] ${option.value === value ? "bg-[#3ea6ff]/10 text-[#3ea6ff]" : "text-[#c9c9c9]"}`}
                            >
                                <span aria-hidden="true" className="text-base">{countryFlag(option.value)}</span>
                                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function countryFlag(country?: string) {
    if (!country || country === "ZZ") return "🌐";
    return country
        .toUpperCase()
        .split("")
        .map((letter) => String.fromCodePoint(letter.charCodeAt(0) + 127397))
        .join("");
}
