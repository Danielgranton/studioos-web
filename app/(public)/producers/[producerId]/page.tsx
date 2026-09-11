import { ProducerDetailPage } from "@/features/producer";

export default async function ProducerDetailsRoute({
    params,
}: {
    params: Promise<{ producerId: string }>;
}) {
    const { producerId } = await params;
    return <ProducerDetailPage producerId={producerId} />;
}
