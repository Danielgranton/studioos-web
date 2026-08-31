import {
    ExploreSection,
    FeaturedProjects,
    FeaturedStudios,
    Hero,
    ServiceSection,
    TestimonialSection,
    TopProducers,
    TrendingBeats,
} from "@/features/home";


export default function HomePage() {

    return (

        <div className="min-h-screen space-y-10">
            <Hero />
            <ExploreSection />
            <TopProducers />
            <FeaturedStudios />
            <FeaturedProjects/>
            <TrendingBeats />
            <TestimonialSection/>
            <ServiceSection />
        </div>

    );

}
