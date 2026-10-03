import { ServiceProvidersPage } from "@/features/services";

export default async function ServiceProvidersRoute({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <ServiceProvidersPage slug={slug} />;
}
