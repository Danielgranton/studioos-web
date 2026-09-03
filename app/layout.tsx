import type { Metadata } from "next";

import "./globals.css";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
    title: "StudioOS",
    description: "The modern platform for studios, producers and artists.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html
            lang="en"
        >
            <body
                className="
                    flex
                    min-h-screen
                    bg-[#0f0f0f]
                    text-white
                    flex-col
                "
            >
                <Navbar />
                <ToastProvider />

                <main
                    className="
                        flex-1
                        bg-[#0f0f0f]/95
                        px-2
                        md:px-10
                        lg:px-20
                    "
                >
                    {children}
                </main>

                <Footer />

            </body>
        </html>
    );
}
