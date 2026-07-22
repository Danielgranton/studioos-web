"use client";

interface HeroVideoCardProps {

    title: string;

    video: string;

}

export default function HeroVideoCard({

    title,

    video,

}: HeroVideoCardProps) {

    return (

        <button
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-800
                bg-[#171717]
                transition
                hover:scale-[1.03]
                hover:border-red-500
            "
        >

            <video
                muted
                loop
                autoPlay
                playsInline
                className="
                    aspect-video
                    w-full
                    object-cover
                "
            >
                <source
                    src={video}
                    type="video/mp4"
                />
            </video>

            <div className="p-3">

                <p
                    className="
                        truncate
                        text-sm
                        font-semibold
                        text-white
                    "
                >
                    {title}
                </p>

            </div>

        </button>

    );
}