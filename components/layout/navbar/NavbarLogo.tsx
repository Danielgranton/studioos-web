import Image from "next/image";
import Link from "next/link";

interface NavbarLogoProps {
    compact?: boolean;
}

export default function NavbarLogo({ compact = false }: NavbarLogoProps) {
    return (
        <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="StudioOS Home"
        >
            <Image
                src="/images/logo.png"
                alt="Studioos logo"
                width={compact ? 28 : 32}
                height={compact ? 28 : 32}
                priority
            />

            {!compact && (
                <span className="text-xl font-semibold tracking-tight text-[#f1f1f1]">
                    StudioOS
                </span>
            )}

        </Link>
    );
}