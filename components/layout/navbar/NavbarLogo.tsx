import Image from "next/image";
import Link from "next/link";

export default function NavbarLogo() {
    return (
        <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="StudioOS Home"
        >
            <Image
                src="/images/logo.png"
                alt="Studioos logo"
                width={32}
                height={32}
                priority
            />

            <span className="text-xl font-semibold tracking-tight text-[#f1f1f1]">
                StudioOS
            </span>

        </Link>
    );
}