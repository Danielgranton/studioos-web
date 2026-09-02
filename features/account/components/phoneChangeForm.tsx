"use client";

import { FormEvent, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import { Check, Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { saveSession } from "@/features/auth";
import { AccountService } from "../services/account.service";

export function PhoneChangeForm({ currentPhone, onChanged }: { currentPhone?: string; onChanged: () => void }) {
    const [newPhone, setNewPhone] = useState("");
    const [code, setCode] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    async function sendCode() {
        if (!newPhone) {
            toast.error("Enter a phone number");
            return;
        }
        setLoading(true);
        try {
            await AccountService.requestPhoneChange({ newPhone });
            setSent(true);
            setCode("");
            toast.success("Verification code sent", { description: "Check your new phone number." });
        } catch (error) {
            toast.error("Could not start phone change", { description: getErrorMessage(error) });
        } finally {
            setLoading(false);
        }
    }

    async function verifyCode(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (code.length !== 6) return;
        setLoading(true);
        try {
            const auth = await AccountService.verifyPhoneChange({ identifier: newPhone, code });
            saveSession(auth);
            toast.success("Phone number updated successfully");
            onChanged();
        } catch (error) {
            toast.error("Could not verify phone number", { description: getErrorMessage(error) });
        } finally {
            setLoading(false);
        }
    }

    function updateCode(index: number, rawValue: string) {
        const digit = rawValue.replace(/\D/g, "").slice(-1);
        const next = code.split("");
        next[index] = digit;
        setCode(next.join("").slice(0, 6));
        if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    }

    return (
        <div className="mt-6 rounded-xl border border-[#303030] bg-[#101010] p-4">
            <div className="flex items-start gap-3">
                <Smartphone size={17} className="mt-0.5 shrink-0 text-[#3ea6ff]" />
                <div><p className="text-sm font-medium">Change phone number</p><p className="mt-1 text-xs leading-5 text-[#777]">{currentPhone ? `Your current number is ${currentPhone}. ` : ""}A code will be sent to the new number.</p></div>
            </div>
            {!sent ? (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <label className="block flex-1 text-xs font-medium text-[#aaa]">New phone number<PhoneInput international defaultCountry="KE" value={newPhone} onChange={(value) => setNewPhone(value || "")} className="phone-field mt-1.5" /></label>
                    <button type="button" onClick={() => void sendCode()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3ea6ff] px-4 py-2.5 text-sm font-semibold text-[#0f0f0f] hover:bg-[#65b8ff] disabled:opacity-60">{loading && <Loader2 size={15} className="animate-spin" />}Send code</button>
                </div>
            ) : (
                <form onSubmit={verifyCode} className="mt-4">
                    <p className="text-xs text-[#888]">Enter the 6-digit code sent to <span className="text-[#ddd]">{newPhone}</span>.</p>
                    <div className="mt-3 flex gap-2">
                        {Array.from({ length: 6 }, (_, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element; }} aria-label={`Phone verification digit ${index + 1}`} inputMode="numeric" maxLength={1} value={code[index] || ""} onChange={(event) => updateCode(index, event.target.value)} className="h-10 w-9 rounded-lg border border-[#3f3f3f] bg-[#151515] text-center font-mono text-lg text-[#f1f1f1] outline-none focus:border-[#3ea6ff]" />)}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button type="submit" disabled={loading || code.length !== 6} className="inline-flex items-center gap-2 rounded-xl bg-[#3ea6ff] px-4 py-2.5 text-sm font-semibold text-[#0f0f0f] hover:bg-[#65b8ff] disabled:opacity-60">{loading ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}Verify number</button>
                        <button type="button" onClick={() => setSent(false)} disabled={loading} className="rounded-xl border border-[#3f3f3f] px-4 py-2.5 text-sm text-[#aaa] hover:bg-[#222] disabled:opacity-60">Change number</button>
                        <button type="button" onClick={() => void sendCode()} disabled={loading} className="px-2 py-2.5 text-sm text-[#3ea6ff] hover:text-[#65b8ff] disabled:opacity-60">Resend</button>
                    </div>
                </form>
            )}
        </div>
    );
}

function getErrorMessage(error: unknown) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || "Please try again.";
}
