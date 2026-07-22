import Image from "next/image";
import Link from "next/link";

export default function NavbarLogo() {
    return (
        <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="StudioOS Home"
        >
            <Image
                src="/images/logo1.png"
                alt="Studioos logo"
                width={35}
                height={35}
                priority
            />

            <span className="text-2xl font-semibold tracking-tight text-[#f1f1f1]">
                StudioOS
            </span>

        </Link>
    );
}