import ExploreSection from "@/components/explore/ExploreSection";
import Hero from "@/components/herosection/Hero";


export default function HomePage() {

    return (

        <div className="p-10 h-screen  bg-[#0f0f0f]/95">
            <Hero/>
            <ExploreSection />
        </div>

    );

}