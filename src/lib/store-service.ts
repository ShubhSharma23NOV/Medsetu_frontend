import apiClient from "./api-client";
import { StoreOrder, Store, StoreStats } from "@/types";

export const storeService = {
    /**
     * Get all orders for a specific store
     */
    async getStoreOrders(storeId?: string, page: number = 1, limit: number = 10): Promise<{
        orders: StoreOrder[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const endpoint = storeId ? `/store/${storeId}/orders` : "/store/orders";
        const { data } = await apiClient.get(endpoint, {
            params: { page, limit }
        });
        return data;
    },

    /**
     * Get store information
     */
    async getStore(storeId: string): Promise<Store> {
        const { data } = await apiClient.get(`/store/${storeId}`);
        return data;
    },

    /**
     * Get current user's store (if they own one)
     */
    async getMyStore(): Promise<Store> {
        const { data } = await apiClient.get("/store/my-store");
        return data;
    },

    /**
     * Update store order status
     */
    async updateStoreOrderStatus(orderId: string, status: string): Promise<StoreOrder> {
        const { data } = await apiClient.put(`/store/orders/${orderId}/status`, { status });
        return data;
    },

    /**
     * Get store statistics
     */
    async getStoreStats(storeId?: string): Promise<StoreStats> {
        const endpoint = storeId ? `/store/${storeId}/stats` : "/store/stats";
        const { data } = await apiClient.get(endpoint);
        return data;
    },

    /**
     * Update store information
     */
    async updateStore(storeId: string, storeData: Partial<Store>): Promise<Store> {
        const { data } = await apiClient.put(`/store/${storeId}`, storeData);
        return data;
    }
};