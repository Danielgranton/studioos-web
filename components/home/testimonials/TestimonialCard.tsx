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
                border-[#262626]
                bg-transparent
                px-5
                py-5
                transition-all
                duration-300
                hover:bg-[#1a1a1a]
            "
        >
            {/* Header */}

            <div className="flex items-start justify-between">

                <div className="flex gap-3">

                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/20 sm:h-20 sm:w-20">
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

                    <div>

                        <div className="flex items-center gap-2">

                            <h3
                                className="
                                    font-semibold
                                    text-white
                                "
                            >
                                {name}
                            </h3>

                            <span
                                className="
                                    rounded-full
                                    bg-[#202020]
                                    px-2
                                    py-0.5
                                    text-[10px]
                                    font-medium
                                    text-slate-400
                                "
                            >
                                {role}
                            </span>

                        </div>

                        <p
                            className="
                                mt-0.5
                                text-sm
                                text-slate-500
                            "
                        >
                            @{username}
                        </p>

                    </div>

                </div>

                <div className="flex">

                    {Array.from({ length: rating }).map((_, index) => (
                        <Star
                            key={index}
                            size={14}
                            className="
                                fill-yellow-400
                                text-yellow-400
                            "
                        />
                    ))}

                </div>

            </div>

            {/* Review */}

            <p
                className="
                    mt-5
                    line-clamp-3
                    text-sm
                    leading-7
                    text-slate-300
                "
            >
                {review}
            </p>

            {/* Tags */}

            <div className="mt-4 flex flex-wrap gap-2">

                <span
                    className="
                        rounded-full
                        bg-blue-500/10
                        px-3
                        py-1
                        text-[11px]
                        font-medium
                        text-blue-400
                    "
                >
                    {provider}
                </span>

                <span
                    className="
                        rounded-full
                        bg-[#202020]
                        px-3
                        py-1
                        text-[11px]
                        text-slate-300
                    "
                >
                    {service}
                </span>

            </div>

            {/* Footer */}

            <div
                className="
                    mt-5
                    flex
                    items-center
                    justify-between
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-5
                        text-sm
                        text-slate-500
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            transition-colors
                            group-hover:text-red-400
                        "
                    >
                        <Heart size={16} />

                        {likes.toLocaleString()}
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                        "
                    >
                        <MessageCircle size={16} />

                        {comments}
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                        "
                    >
                        <ThumbsDown size={16} />

                        {dislikes}
                    </div>

                </div>

                <span
                    className="
                        text-xs
                        text-slate-600
                    "
                >
                    {time}
                </span>

            </div>
        </Link>
    );
}