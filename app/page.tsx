import {
    ExploreSection,
    FeaturedStudios,
    Hero,
    ServiceSection,
    TestimonialSection,
    TopProducers,
    TopArtists,
    TrendingBeats,
} from "@/features/home";


export default function HomePage() {

    return (

        <div className="min-h-screen space-y-10">
            <Hero />
            <ExploreSection />
            <TopProducers />
            <FeaturedStudios />
            <TrendingBeats />
            <TopArtists />
            <TestimonialSection/>
            <ServiceSection />
        </div>

    );

}
