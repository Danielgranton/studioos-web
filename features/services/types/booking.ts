export type ServiceBookingStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "PAYMENT_PENDING" | "PAID" | "DELIVERED" | "CANCELLED";

export type ServiceBooking = {
    id: string;
    providerId: number;
    providerType: "ARTIST" | "PRODUCER";
    providerName: string;
    listingId: string;
    studioId?: string | null;
    catalogServiceId?: string | null;
    serviceName: string;
    requesterId: number;
    requesterName: string;
    preferredDate: string;
    requestDetails: string;
    amount: number;
    currency: string;
    transactionId?: string | null;
    status: ServiceBookingStatus;
    createdAt: string;
    updatedAt: string;
};

export type CreateServiceBooking = {
    providerType: "ARTIST" | "PRODUCER";
    providerId: number;
    listingId: string;
    studioId?: string | null;
    catalogServiceId?: string | null;
    serviceName: string;
    preferredDate: string;
    requestDetails: string;
};
