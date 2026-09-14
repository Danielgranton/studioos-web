import {
    FeaturedStudios,
    Hero,
    ServiceSection,
    TopProducers,
    TopArtists,
    TrendingBeats,
} from "@/features/home";


export default function HomePage() {

    return (

        <div className="min-h-screen space-y-10">
            <Hero />
            <TopProducers />
            <FeaturedStudios />
            <TrendingBeats />
            <TopArtists />
            <ServiceSection />
        </div>

    );

}
