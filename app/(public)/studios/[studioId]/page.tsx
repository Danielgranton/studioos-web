import { StudioDetailPage } from "@/features/studio";

export default async function StudioDetailsRoute({ params }: { params: Promise<{ studioId: string }> }) {
    const { studioId } = await params;
    return <StudioDetailPage studioId={studioId} />;
}
