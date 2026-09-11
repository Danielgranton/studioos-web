import { SearchService } from "@/features/search";

import type { ProducerPage } from "../types/producer";

class ProducerServiceClient {
    async getProducers(page = 0, size = 20): Promise<ProducerPage> {
        return SearchService.producers(undefined, page, size);
    }
}

export const ProducerService = new ProducerServiceClient();
