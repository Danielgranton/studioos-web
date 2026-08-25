"use client";

import Link from "next/link";
import {
    Heart,
    MessageCircle,
    ThumbsDown,
    Star,
} from "lucide-react";
import Image from "next/image";

interface TestimonialCardProps {
    username: string;
    name: string;
    avatar: string;
    role: string;

    rating: number;
    review: string;

    provider: string;
    service: string;

    likes: number;
    comments: number;
    dislikes: number;

    time: string;
}

export default function TestimonialCard({
    username,
    name,
    avatar,
    role,
    rating,
    review,
    provider,
    service,
    likes,
    comments,
    dislikes,
    time,
}: TestimonialCardProps) {
    return (
        <Link
            href={`/testimonials/${username}`}
            className="
                group
                block
                border-y
                border-[#2a2825]
                bg-transparent
                px-4
                py-4
                transition-all
                duration-300
                hover:bg-[#1c1a17]
                sm:px-5
                sm:py-5
            "
        >
            {/* Header */}

            <div className="flex flex-wrap items-start justify-between gap-y-2">

                <div className="flex gap-2.5 sm:gap-3">

                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/20 sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                        <Image
                            src={avatar}
                            alt={name}
                            fill
                            className="
                                object-cover
                                transition-transform
                                duration-500
                                group-hover:scale-110
                            "
                        />
                      </div>  

                    <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">

                            <h3
                                className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    tracking-tight
                                    text-[#f5f4f1]
                                    sm:text-base
                                "
                            >
                                {name}
                            </h3>

                            <span
                                className="
                                    shrink-0
                                    rounded-md
                                    bg-[#1c1a17]
                                    px-1.5
                                    py-0.5
                                    text-[9px]
                                    font-medium
                                    text-[#9a978f]
                                    sm:px-2
                                    sm:text-[10px]
                                "
                            >
                                {role}
                            </span>

                        </div>

                        <p
                            className="
                                mt-0.5
                                truncate
                                font-mono
                                text-xs
                                text-[#6b685f]
                                sm:text-sm
                            "
                        >
                            @{username}
                        </p>

                    </div>

                </div>

                <div className="flex shrink-0">

                    {Array.from({ length: rating }).map((_, index) => (
                        <Star
                            key={index}
                            size={12}
                            className="
                                fill-[#e8a33d]
                                text-[#e8a33d]
                                sm:size-[14px]
                            "
                        />
                    ))}

                </div>

            </div>

            {/* Review */}

            <p
                className="
                    mt-4
                    line-clamp-3
                    text-xs
                    leading-6
                    text-[#c4c1b8]
                    sm:mt-5
                    sm:text-sm
                    sm:leading-7
                "
            >
                {review}
            </p>

            {/* Tags */}

            <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">

                <span
                    className="
                        rounded-md
                        border
                        border-[#e8a33d]/20
                        bg-[#e8a33d]/10
                        px-2.5
                        py-0.5
                        text-[10px]
                        font-medium
                        text-[#e8a33d]
                        sm:px-3
                        sm:py-1
                        sm:text-[11px]
                    "
                >
                    {provider}
                </span>

                <span
                    className="
                        rounded-md
                        border
                        border-[#2a2825]
                        bg-[#1c1a17]
                        px-2.5
                        py-0.5
                        text-[10px]
                        text-[#b5b2a8]
                        sm:px-3
                        sm:py-1
                        sm:text-[11px]
                    "
                >
                    {service}
                </span>

            </div>

            {/* Footer */}

            <div
                className="
                    mt-4
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-y-2
                    sm:mt-5
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-3
                        font-mono
                        text-xs
                        text-[#6b685f]
                        sm:gap-5
                        sm:text-sm
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-1
                            transition-colors
                            group-hover:text-red-400
                            sm:gap-1.5
                        "
                    >
                        <Heart size={14} className="sm:size-4" />

                        {likes.toLocaleString()}
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-1
                            sm:gap-1.5
                        "
                    >
                        <MessageCircle size={14} className="sm:size-4" />

                        {comments}
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-1
                            sm:gap-1.5
                        "
                    >
                        <ThumbsDown size={14} className="sm:size-4" />

                        {dislikes}
                    </div>

                </div>

                <span
                    className="
                        font-mono
                        text-[10px]
                        text-[#6b685f]
                        sm:text-xs
                    "
                >
                    {time}
                </span>

            </div>
        </Link>
    );
}