"use client";

import {
    ChevronDown,
    User,
} from "lucide-react";

interface NavbarProfileProps {
    onMenuOpen: () => void;
}

export default function NavbarProfile({
}: NavbarProfileProps) {
    return (
        <div className="relative">
            <div  
                aria-label="Open profile menu"
                className="
                    flex
                    items-center
                    gap-1
                    rounded-lg
                    p-2
                    transition-colors
                    hover:bg-slate-800
                "
            >
                <User size={25} />

                <ChevronDown
                    size={16}
                    className="text-slate-400"
                />
            </div>
        </div>
    );
}