import { HelpArticlePage } from "@/features/help";

export default async function HelpArticleRoute({ params }: { params: Promise<{ categorySlug: string; slug: string }> }) {
    const { categorySlug, slug } = await params;
    return <HelpArticlePage categorySlug={categorySlug} slug={slug} />;
}
