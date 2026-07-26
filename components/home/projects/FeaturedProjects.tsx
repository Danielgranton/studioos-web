"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ProjectCard from "./ProjectCard";
import { featuredProjects } from "./projectData";

export default function FeaturedProjects() {
    return (
        <section
            className="
                relative
                overflow-hidden
            "
        >
            <div
                className="
                    relative
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
                        items-end
                        justify-between
                        gap-10
                    "
                >
                    <div>

                        <span
                            className="
                                inline-flex
                                items-center
                                rounded-full
                                border
                                border-indigo-500/20
                                bg-indigo-500/10
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-indigo-400
                            "
                        >
                            ⭐ Featured Projects
                        </span>

                        <h2
                            className="
                                mt-5
                                text-4xl
                                font-black
                                tracking-tight
                                text-white
                                md:text-5xl
                            "
                        >
                            Real Music.
                            <br />
                            Real Creators.
                            <br />
                            Real Success.
                        </h2>

                        <p
                            className="
                                mt-5
                                max-w-2xl
                                text-lg
                                leading-8
                                text-slate-400
                            "
                        >
                            Discover songs, podcasts and creative projects
                            brought to life through StudioOS. From recording
                            and production to mixing, mastering and
                            distribution—everything happens in one place.
                        </p>

                    </div>

                    <Link
                        href="/projects"
                        className="
                            hidden
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[#272727]
                            bg-[#171717]
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:border-indigo-500/40
                            hover:bg-[#1b1b1b]
                            lg:flex
                        "
                    >
                        Explore Projects

                        <ArrowRight size={17} />
                    </Link>

                </div>

                {/* Projects */}

                <div
                    className="
                        grid
                        gap-6
                        md:grid-cols-2
                        xl:grid-cols-3
                    "
                >
                    {featuredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            {...project}
                        />
                    ))}
                </div>

                {/* Mobile Button */}

                <div className="mt-10 flex justify-center lg:hidden">
                    <Link
                        href="/projects"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[#272727]
                            bg-[#171717]
                            px-6
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:border-indigo-500/40
                            hover:bg-[#1b1b1b]
                        "
                    >
                        Explore Projects

                        <ArrowRight size={17} />
                    </Link>
                </div>
            </div>
        </section>
    );
}