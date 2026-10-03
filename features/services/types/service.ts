export type ServiceAudience = "ARTIST" | "STUDIO";

export type ServiceCatalogItem = {
    id: string;
    slug: string;
    name: string;
    category: string;
    description?: string;
    artistAllowed: boolean;
    studioAllowed: boolean;
};
