"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    function handleBack() {
        if (window.history.length > 1) {
            router.back();
            return;
        }

        router.push("/dashboard");
    }

    return (
        <button
            type="button"
            onClick={handleBack}
            className="group inline-flex items-center gap-2 rounded-full border border-[#302d28] bg-[#161513] px-3.5 py-2 text-[11px] font-semibold text-[#aaa69d] shadow-lg shadow-black/10 transition hover:border-[#e8a33d]/50 hover:bg-[#1c1a17] hover:text-[#f5f4f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a33d]/60"
        >
            <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back
        </button>
    );
}
