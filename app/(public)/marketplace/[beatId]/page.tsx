import { BeatDetailsPage } from "@/features/beatmarketplace";

export default async function BeatDetailsRoute({ params }: { params: Promise<{ beatId: string }> }) {
    const { beatId } = await params;
    return <BeatDetailsPage beatId={beatId} />;
}
