import Image from "next/image";
import Link from "next/link";

interface NavbarLogoProps {
    compact?: boolean;
}

export function NavbarLogo({ compact = false }: NavbarLogoProps) {
    return (
        <Link
            href="/"
            className="group inline-flex items-center gap-2.5"
            aria-label="StudioOS — Home"
        >
            <span
                className="
                    relative
                    flex
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-lg
                    transition-transform
                    duration-300
                    ease-out
                    group-hover:-rotate-6
                    group-hover:scale-105
                "
            >
                <Image
                    src="/images/logo.png"
                    alt=""
                    width={compact ? 28 : 32}
                    height={compact ? 28 : 32}
                    priority
                />
            </span>

            {!compact && (
                <span className="flex items-baseline gap-1.5">
                    <span
                        className="
                            text-xl
                            font-semibold
                            tracking-tight
                            text-[#f1f1f1]
                        "
                    >
                        {"Studio".split("").map((letter, i) => (
                            <span
                                key={i}
                                aria-hidden="true"
                                className="navbar-boot-letter inline-block"
                                style={{ animationDelay: `${i * 45}ms` }}
                            >
                                {letter}
                            </span>
                        ))}
                    </span>

                    <span
                        className="
                            navbar-boot-chip
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-md
                            bg-black/40
                            px-1.5
                            py-0.5
                            font-mono
                            text-[11px]
                            font-bold
                            tracking-[0.1em]
                            text-blue-400
                            ring-1
                            ring-inset
                            ring-blue-500/30
                            transition-all
                            duration-300
                            group-hover:text-blue-300
                            group-hover:ring-blue-400/60
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"
                        />
                        OS
                        <span
                            aria-hidden="true"
                            className="navbar-boot-cursor h-3 w-[2px] bg-blue-400/80"
                        />
                    </span>

                    {/* Screen-reader-only static text — the animated letters above are hidden from assistive tech */}
                    <span className="sr-only">StudioOS</span>
                </span>
            )}

            <style>{`
                .navbar-boot-letter,
                .navbar-boot-chip {
                    opacity: 0;
                    transform: translateY(3px);
                    animation: navbar-boot-in 0.3s ease-out forwards;
                }
                .navbar-boot-chip {
                    animation-delay: 330ms;
                }
                .navbar-boot-cursor {
                    opacity: 0;
                    animation: navbar-boot-cursor-blink 1.1s steps(1) infinite;
                    animation-delay: 650ms;
                    animation-fill-mode: backwards;
                }
                @keyframes navbar-boot-in {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes navbar-boot-cursor-blink {
                    0% {
                        opacity: 0;
                    }
                    1%, 50% {
                        opacity: 1;
                    }
                    51%, 100% {
                        opacity: 0;
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .navbar-boot-letter,
                    .navbar-boot-chip,
                    .navbar-boot-cursor {
                        animation: none;
                        opacity: 1;
                        transform: none;
                    }
                }
            `}</style>
        </Link>
    );
}
