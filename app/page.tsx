import ExploreSection from "@/components/home/explore/ExploreSection";
import FeaturedStudios from "@/components/home/featuredStudios/featureStudios";
import Hero from "@/components/home/herosection/Hero";
import { TopProducers } from "@/components/home/producers";
import { FeaturedProjects } from "@/components/home/projects";
import { ServiceSection } from "@/components/home/services";
import { TestimonialSection } from "@/components/home/testimonials";
import { TrendingBeats } from "@/components/home/treadingBeats";


export default function HomePage() {

    return (

        <div className=" h-screen  space-y-10">
            <Hero/>
            <ExploreSection />
            <FeaturedStudios />
            <TopProducers />
            <TrendingBeats/>
            <ServiceSection />
            <FeaturedProjects />
            <TestimonialSection />
        </div>

    );

}