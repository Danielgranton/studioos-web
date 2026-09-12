import { ArtistDetailPage } from "@/features/artist";

export default async function ArtistDetailsRoute({
    params,
}: {
    params: Promise<{ artistId: string }>;
}) {
    const { artistId } = await params;
    return <ArtistDetailPage artistId={artistId} />;
}
