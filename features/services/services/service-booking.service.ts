import { api } from "@/lib/api";
import type { CreateServiceBooking, ServiceBooking } from "../types/booking";

type ApiResponse<T> = { data?: T };

class ServiceBookingClient {
    async create(request: CreateServiceBooking): Promise<ServiceBooking> {
        const response = await api.post<ApiResponse<ServiceBooking>>("/service-bookings", request);
        return response.data.data as ServiceBooking;
    }

    async getMine(): Promise<ServiceBooking[]> {
        const response = await api.get<ApiResponse<ServiceBooking[]>>("/service-bookings/mine");
        return response.data.data ?? [];
    }

    async getProviderRequests(): Promise<ServiceBooking[]> {
        const response = await api.get<ApiResponse<ServiceBooking[]>>("/service-bookings/provider");
        return response.data.data ?? [];
    }

    async decide(id: string, accepted: boolean, amount?: number): Promise<ServiceBooking> {
        const response = await api.patch<ApiResponse<ServiceBooking>>(`/service-bookings/${encodeURIComponent(id)}/decision`, { accepted, amount });
        return response.data.data as ServiceBooking;
    }

    async pay(id: string, phoneNumber: string): Promise<{ transactionId: string; status: string }> {
        const response = await api.post<ApiResponse<{ transactionId: string; status: string }>>(`/service-bookings/${encodeURIComponent(id)}/pay`, { phoneNumber });
        return response.data.data as { transactionId: string; status: string };
    }

    async markDelivered(id: string): Promise<ServiceBooking> {
        const response = await api.patch<ApiResponse<ServiceBooking>>(`/service-bookings/${encodeURIComponent(id)}/delivered`);
        return response.data.data as ServiceBooking;
    }

    async cancel(id: string): Promise<ServiceBooking> {
        const response = await api.patch<ApiResponse<ServiceBooking>>(`/service-bookings/${encodeURIComponent(id)}/cancel`);
        return response.data.data as ServiceBooking;
    }
}

export const ServiceBookingService = new ServiceBookingClient();
