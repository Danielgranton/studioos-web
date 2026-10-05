import { api } from "@/lib/api";

import type { Booking, BookingPage, CreateBookingRequest } from "../types/booking";

type ApiResponse<T> = { data?: T };

class BookingServiceClient {
    async createBooking(request: CreateBookingRequest): Promise<Booking> {
        const response = await api.post<ApiResponse<Booking>>("/bookings", request);
        return response.data.data as Booking;
    }

    async getMyBookings(page = 0, size = 50): Promise<BookingPage> {
        const response = await api.get<ApiResponse<BookingPage>>("/bookings/my/bookings", { params: { page, size } });
        return response.data.data as BookingPage;
    }

    async getStudioBookings(studioId: string, page = 0, size = 50): Promise<BookingPage> {
        const response = await api.get<ApiResponse<BookingPage>>(`/bookings/studio/${encodeURIComponent(studioId)}`, { params: { page, size } });
        return response.data.data as BookingPage;
    }

    async getBooking(bookingId: string): Promise<Booking> {
        const response = await api.get<ApiResponse<Booking>>(`/bookings/${encodeURIComponent(bookingId)}`);
        return response.data.data as Booking;
    }

    async confirmBooking(bookingId: string, totalPrice: number): Promise<Booking> {
        const response = await api.patch<ApiResponse<Booking>>(`/bookings/${encodeURIComponent(bookingId)}/confirm`, { totalPrice });
        return response.data.data as Booking;
    }

    async initiatePayment(bookingId: string, phoneNumber: string): Promise<{ transactionId: string; status: string }> {
        const response = await api.post<ApiResponse<{ transactionId: string; status: string }>>(
            `/bookings/${encodeURIComponent(bookingId)}/pay`,
            { phoneNumber },
        );
        return response.data.data as { transactionId: string; status: string };
    }

    async cancelBooking(bookingId: string): Promise<void> {
        await api.patch(`/bookings/${encodeURIComponent(bookingId)}/cancel`);
    }
}

export const BookingService = new BookingServiceClient();
