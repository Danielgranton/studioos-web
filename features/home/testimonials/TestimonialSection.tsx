"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Disc3,
  Globe2,
  Mic2,
  Music2,
  BriefcaseBusiness,
  MessageCircleMore,
  Star,
  ThumbsUp,
} from "lucide-react";

import { TestimonialSlider } from "./TestimonialSlider";

const filters = [
  {
    label: "All",
    icon: Globe2,
    active: true,
  },
  {
    label: "Artists",
    icon: Mic2,
  },
  {
    label: "Producers",
    icon: Music2,
  },
  {
    label: "Studios",
    icon: Building2,
  },
  {
    label: "Beats",
    icon: Disc3,
  },
  {
    label: "Services",
    icon: BriefcaseBusiness,
  },
];

export function TestimonialSection() {
  return (
    <section
      id="testimonials"
      className="
                relative
                overflow-hidden
                scroll-mt-28
            "
    >
      <div
        className="
                    mx-auto
                    max-w-[1600px]
                    px-6
                "
      >
        {/* Header */}

        <div
          className="
                    mb-10
                    flex
                    flex-col
                    gap-8
                    xl:flex-row
                    xl:items-end
                    xl:justify-between
                "
        >
          {/* Left */}

          <div className="max-w-2xl">
            {/* Badge */}

            <span
              className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[#e8a33d]/20
                            bg-[#e8a33d]/10
                            px-2
                            py-1
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-[#e8a33d]
                        "
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="
                                    absolute
                                    inline-flex
                                    h-full
                                    w-full
                                    animate-ping
                                    rounded-full
                                    bg-[#e8a33d]
                                    opacity-70
                                "
                />

                <span
                  className="
                                    relative
                                    inline-flex
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-[#e8a33d]
                                "
                />
              </span>
              Live Creator Reviews
            </span>

            {/* Title */}

            <h2
              className="
                            mt-4
                            text-3xl
                            font-black
                            tracking-tight
                            text-[#f5f4f1]
                            md:text-4xl
                        "
            >
              Loved by{" "}
              <span className="relative inline-block">
                <span className="text-blue-600">creators</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 110 16"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-3 w-full text-blue-600"
                >
                  <path
                    d="M2 8 H108"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="14 8"
                    className="testimonial-headline-underline"
                  />
                </svg>
              </span>{" "}
              worldwide.
            </h2>

            <p
              className="
                            mt-4
                            max-w-2xl
                            text-base
                            leading-7
                            text-[#9a978f]
                            md:text-lg
                        "
            >
              Honest feedback from artists, producers, studios and creators
              building amazing careers with StudioOS.
            </p>

            {/* Metrics — mono numbers, same convention as every card */}

            <div
              className="
                            mt-6
                            flex
                            flex-wrap
                            items-center
                            gap-6
                        "
            >
              <div className="flex items-center gap-2">
                <Star size={18} className="fill-[#e8a33d] text-[#e8a33d]" />

                <div>
                  <p className="font-mono font-semibold text-[#f5f4f1]">4.9</p>

                  <p className="text-xs text-[#6b685f]">Average Rating</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircleMore size={18} className="text-[#5eead4]" />

                <div>
                  <p className="font-mono font-semibold text-[#f5f4f1]">8.4K</p>

                  <p className="text-xs text-[#6b685f]">Reviews</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ThumbsUp size={18} className="text-emerald-400" />

                <div>
                  <p className="font-mono font-semibold text-[#f5f4f1]">97%</p>

                  <p className="text-xs text-[#6b685f]">Recommend StudioOS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}

          <div
            className="
                        flex
                        w-full
                        flex-col
                        items-start
                        gap-4
                        xl:w-auto
                        xl:items-end
                    "
          >
            {/* View All */}

            <Link
              href="/testimonials"
              className="
                            group
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-blue-600
                            bg-blue-600
                            px-3
                            py-1
                            text-sm
                            font-semibold
                            text-white
                            transition-all
                            duration-300
                            hover:bg-blue-700
                        "
            >
              View All Reviews
              <ArrowRight
                size={16}
                className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
              />
            </Link>

            {/* Filters */}

            <div
              className="
                            flex
                            w-full
                            flex-wrap
                            gap-2
                            xl:w-auto
                            xl:justify-end
                        "
            >
              {filters.map((filter) => {
                const Icon = filter.icon;

                return (
                  <button
                    key={filter.label}
                    className={`
                                        inline-flex
                                        h-7
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        px-3.5
                                        text-xs
                                        font-medium
                                        transition-all
                                        duration-300
                                        ${
                                          filter.active
                                            ? "bg-[#e8a33d] text-[#161513]"
                                            : "border border-[#2a2825] bg-[#161513]/80 text-[#9a978f] hover:border-[#e8a33d]/30 hover:bg-[#1c1a17] hover:text-[#f5f4f1]"
                                        }
                                    `}
                  >
                    <Icon size={14} />

                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <TestimonialSlider />
      </div>

      <style>{`
                .testimonial-headline-underline {
                    animation: testimonial-dash-march 1.2s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .testimonial-headline-underline {
                        animation: none;
                    }
                }
                @keyframes testimonial-dash-march {
                    to {
                        stroke-dashoffset: -22;
                    }
                }
            `}</style>
    </section>
  );
}
