import { Check, Clock3, ShieldCheck } from "lucide-react";

type VerificationGuideProps = {
    subject: "profile" | "studio";
    status?: "UNVERIFIED" | "PENDING_REVIEW" | "VERIFIED" | "REJECTED";
    items: { label: string; complete: boolean }[];
};

export function VerificationGuide({ subject, status = "UNVERIFIED", items }: VerificationGuideProps) {
    const verified = status === "VERIFIED";
    const pending = status === "PENDING_REVIEW";
    const complete = items.filter((item) => item.complete).length;

    return <section className="mt-5 rounded-2xl border border-[#3f3f3f] bg-[#151515] p-5 sm:p-6" aria-labelledby={`${subject}-verification-title`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3"><span className="mt-0.5 text-[#3ea6ff]"><ShieldCheck size={18} /></span><div><h2 id={`${subject}-verification-title`} className="text-base font-semibold">Get {subject === "studio" ? "your studio" : "your profile"} verified</h2><p className="mt-1 max-w-xl text-sm leading-5 text-[#888]">Complete the quality checks below so the StudioOS team can review your {subject} for the verified badge.</p></div></div>
            <span className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${verified ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : pending ? "border-amber-400/20 bg-amber-400/10 text-amber-300" : "border-[#3f3f3f] bg-[#202020] text-[#999]"}`}>
                {verified ? <Check size={12} /> : pending ? <Clock3 size={12} /> : <ShieldCheck size={12} />}
                {verified ? "Verified" : pending ? "Review pending" : status === "REJECTED" ? "Needs updates" : `${complete}/${items.length} ready`}
            </span>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {items.map((item) => <div key={item.label} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs ${item.complete ? "border-emerald-400/15 bg-emerald-400/5 text-[#c7e9d3]" : "border-[#303030] bg-[#101010] text-[#999]"}`}><span className={item.complete ? "text-emerald-300" : "text-[#666]"}>{item.complete ? <Check size={14} /> : <span className="block h-1.5 w-1.5 rounded-full bg-current" />}</span>{item.label}</div>)}
        </div>
        {!verified && <p className="mt-4 text-[11px] leading-5 text-[#666]">Keep your details accurate and add real work samples. Verification is a quality signal, not a paid upgrade.</p>}
    </section>;
}
