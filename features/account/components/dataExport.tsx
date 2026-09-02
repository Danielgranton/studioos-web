"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AccountService } from "../services/account.service";

export function DataExport() {
    const [loading, setLoading] = useState(false);

    async function downloadExport() {
        setLoading(true);
        try {
            const blob = await AccountService.exportData();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `studioos-account-export-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
            toast.success("Your account data was downloaded");
        } catch (error) {
            const response = (error as { response?: { data?: { message?: string } } }).response;
            toast.error("Could not export account data", {
                description: response?.data?.message || "Please try again.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-5 flex flex-col gap-4 rounded-xl border border-[#303030] bg-[#101010] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h3 className="text-sm font-medium text-[#eee]">Download your data</h3>
                <p className="mt-1 text-xs leading-5 text-[#777]">
                    Export your profile, preferences, sessions, and account history as JSON.
                </p>
            </div>
            <button
                type="button"
                onClick={() => void downloadExport()}
                disabled={loading}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#3f3f3f] px-4 py-2.5 text-sm font-medium text-[#ddd] transition hover:border-[#3ea6ff]/50 hover:bg-[#202020] disabled:cursor-not-allowed disabled:opacity-60"
            >
                <Download size={15} />
                {loading ? "Preparing..." : "Download JSON"}
            </button>
        </div>
    );
}
