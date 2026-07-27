"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import TestimonialCard from "./TestimonialCard";
import { testimonials } from "./testimonialData";

const ITEMS_PER_PAGE = 6;

export default function TestimonialSlider() {
    const pages = useMemo(() => {
        const result = [];

        for (let i = 0; i < testimonials.length; i += ITEMS_PER_PAGE) {
            result.push(testimonials.slice(i, i + ITEMS_PER_PAGE));
        }

        return result;
    }, []);

    const [page, setPage] = useState(0);
    const [paused, setPaused] = useState(false);

    const next = () => {
        setPage((prev) => (prev + 1) % pages.length);
    };

    const previous = () => {
        setPage((prev) => (prev - 1 + pages.length) % pages.length);
    };

    useEffect(() => {
        if (paused) return;

        const interval = setInterval(next, 10000);

        return () => clearInterval(interval);
    }, [paused, pages.length]);

    return (
        <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Previous */}

            <button
                onClick={previous}
                className="
                    absolute
                    left-0
                    top-1/2
                    z-20
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    border
                    border-[#2a2a2a]
                    bg-[#171717]
                    p-3
                    text-slate-300
                    transition
                    hover:border-blue-500/40
                    hover:bg-[#1d1d1d]
                    hover:text-white
                "
            >
                <ChevronLeft size={18} />
            </button>

            {/* Next */}

            <button
                onClick={next}
                className="
                    absolute
                    right-0
                    top-1/2
                    z-20
                    translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    border
                    border-[#2a2a2a]
                    bg-[#171717]
                    p-3
                    text-slate-300
                    transition
                    hover:border-blue-500/40
                    hover:bg-[#1d1d1d]
                    hover:text-white
                "
            >
                <ChevronRight size={18} />
            </button>

            {/* Slides */}

            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                        transform: `translateX(-${page * 100}%)`,
                    }}
                >
                    {pages.map((group, index) => (
                        <div
                            key={index}
                            className="
                                min-w-full
                                grid
                                gap-6
                                sm:grid-cols-2
                                md:grid-cols-3
                                lg:grid-cols-4
                            "
                        >
                            {group.map((testimonial) => (
                                <TestimonialCard
                                    key={testimonial.id}
                                    {...testimonial}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Indicators */}

            <div className="mt-10 flex justify-center gap-2">
                {pages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setPage(index)}
                        className={`
                            h-2
                            rounded-full
                            transition-all
                            duration-300
                            ${
                                page === index
                                    ? "w-8 bg-blue-500"
                                    : "w-2 bg-[#353535]"
                            }
                        `}
                    />
                ))}
            </div>
        </div>
    );
}