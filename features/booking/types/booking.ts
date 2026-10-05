export type BookingStatus = "PENDING" | "APPROVED" | "EXPIRED" | "RECORDING" | "MIXING" | "READY" | "DELIVERED" | "CANCELLED";
export type BookingPaymentStatus = "BOOKED" | "PAID" | "FAILED";

export type Booking = {
    id: string;
    studioId: string;
    studioName?: string;
    artistId: number;
    artistName?: string;
    sessionDate: string;
    durationHours: number;
    attemptCount?: number;
    totalPrice?: number | null;
    status: BookingStatus;
    paymentStatus: BookingPaymentStatus;
    notes?: string;
    createdAt: string;
};

export type BookingPage = {
    content: Booking[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
};

export type CreateBookingRequest = {
    studioId: string;
    sessionDate: string;
    durationHours: number;
    notes?: string;
};
