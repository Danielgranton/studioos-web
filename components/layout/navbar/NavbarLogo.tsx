import Image from "next/image";
import Link from "next/link";
import { COLORS } from "@/constants/theme";

export default function NavbarLogo() {
    return (
        <Link
            href="/"
            className="felx items-center gap-3"
            aria-label="StudioOS Home"
        >
            <Image
                src="/images/logo.svg"
                alt="Studioos logo"
                width={40}
                height={40}
                priority
            />

            <span 
                className="text-2xl font-bold tracking-tight"
                style={{
                    color: COLORS.text.primary
                }}
            >
                StudioOS
            </span>

        </Link>
    )
}