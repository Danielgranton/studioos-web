import Link from "next/link";

const NAV_LINKS = [
    {
        label : "Explore",
        href : "/explore",
    },
    {
        label : "studios",
        href : "/studios", 
    },
    {
        label : "producers",
        href : "/producers",
    },
    {
        label : "Beats",
        href : "/beats",
    },
    {
        label : "Beat Store",
        href : "/marketplace",
    },
];

export default function NavbarLinks() {
    return (
        <nav className="hidden lg:flex items-center gap-8">
            {
                NAV_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm font-medium transition-colors hover:text-blue-500"
                    >
                        {link.label}
                    </Link>
                ))
            }
        </nav>
    )
}