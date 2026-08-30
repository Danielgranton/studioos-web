import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
            className={`${geistSans.variable} ${geistMono.variable}`}
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
