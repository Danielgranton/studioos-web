"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            theme="dark"
            richColors
            closeButton
            toastOptions={{
                classNames: {
                    toast: "border-[#3f3f3f] bg-[#181818] text-[#f1f1f1]",
                },
            }}
        />
    );
}
