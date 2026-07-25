import ExploreSection from "@/components/explore/ExploreSection";
import FeaturedStudios from "@/components/featuredStudios/featureStudios";
import Hero from "@/components/herosection/Hero";


export default function HomePage() {

    return (

        <div className="lg:p-8 h-screen  bg-[#0f0f0f]/95 space-y-10">
            <Hero/>
            <ExploreSection />
            <FeaturedStudios />
        </div>

    );

}