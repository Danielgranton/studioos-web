import ExploreSection from "@/components/home/explore/ExploreSection";
import FeaturedStudios from "@/components/home/featuredStudios/featureStudios";
import Hero from "@/components/home/herosection/Hero";
import { TopProducers } from "@/components/home/producers";
import { TrendingBeats } from "@/components/home/treadingBeats";


export default function HomePage() {

    return (

        <div className="lg:p-8 h-screen  bg-[#0f0f0f]/95 space-y-10">
            <Hero/>
            <ExploreSection />
            <FeaturedStudios />
            <TopProducers />
            <TrendingBeats/>
        </div>

    );

}