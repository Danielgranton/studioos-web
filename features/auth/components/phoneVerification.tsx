"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { usePhoneVerification } from "../hooks/usePhoneVerification";
import { useSession } from "../hooks/useSession";

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]";

export function PhoneVerification() {
    const { session, isAuthenticated, isLoading: sessionLoading } = useSession();
    const { loading, error, sent, verified, requestCode, verify } = usePhoneVerification();
    const [code, setCode] = useState("");
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const router = useRouter();

    useEffect(() => {
        if (verified) toast.success("Phone number verified");
    }, [verified]);

    if (sessionLoading) return null;
    if (!isAuthenticated || !session) {
        return <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4 text-center text-[#f1f1f1]"><p>Sign in to verify your phone. <Link href="/auth/signin" className="text-[#3ea6ff] hover:underline">Sign in</Link></p></main>;
    }

    if (!session.phone) {
        return <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4 text-center text-[#f1f1f1]"><p>No phone number is attached to this account.</p></main>;
    }

    const phone = session.phone;

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await verify(phone, code);
    }

    function updateCode(index: number, value: string) {
        const digit = value.replace(/\D/g, "").slice(-1);
        const next = code.split("");
        next[index] = digit;
        setCode(next.join("").slice(0, 6));
        if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    }

    async function sendCode() {
        if (await requestCode()) toast.success("Verification code sent", { description: "Check your phone." });
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4 py-10 text-[#f1f1f1]">
            <section className="w-full max-w-2xl rounded-[20px] border border-[#3f3f3f] bg-[#151515] p-6 sm:p-8">
                <button type="button" onClick={() => router.back()} className={`inline-flex items-center gap-2 text-sm text-[#888] hover:text-[#f1f1f1] ${FOCUS_RING}`}><ArrowLeft size={16} /> Back</button>
                <div className="mx-auto mt-8 max-w-xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3ea6ff]/10 text-[#3ea6ff]"><Phone size={22} /></div>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#3ea6ff]">Phone verification</p>
                    <h1 className="mt-3 text-3xl font-semibold">Verify your phone</h1>
                    <p className="mt-3 text-sm leading-6 text-[#999]">Confirm <span className="text-[#f1f1f1]">{phone}</span> to keep your account secure.</p>
                    {!sent && !verified && <button type="button" onClick={sendCode} disabled={loading} className={`mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#3ea6ff] text-sm font-semibold text-[#0f0f0f] hover:bg-[#65b8ff] disabled:opacity-60 ${FOCUS_RING}`}>{loading ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} />}Send verification code</button>}
                    {sent && !verified && <form onSubmit={submit} className="mt-8"><div className="flex justify-center gap-2">{Array.from({ length: 6 }, (_, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element; }} aria-label={`Verification digit ${index + 1}`} inputMode="numeric" maxLength={1} value={code[index] || ""} onChange={(event) => updateCode(index, event.target.value)} className="h-12 w-10 rounded-xl border border-[#3f3f3f] bg-[#101010] text-center font-mono text-xl outline-none focus:border-[#3ea6ff]" />)}</div>{error && <p className="mt-3 text-sm text-red-300" role="alert">{error}</p>}<button type="submit" disabled={loading || code.length !== 6} className={`mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#3ea6ff] text-sm font-semibold text-[#0f0f0f] hover:bg-[#65b8ff] disabled:opacity-60 ${FOCUS_RING}`}>{loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}Verify phone</button></form>}
                    {verified && <div className="mt-8 rounded-2xl border border-[#3ea6ff]/20 bg-[#3ea6ff]/10 p-5 text-center text-sm text-[#c9c9c9]"><Check className="mx-auto text-[#3ea6ff]" size={24} /><p className="mt-2">Your phone number is verified.</p></div>}
                </div>
            </section>
        </main>
    );
}
