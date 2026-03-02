import apiClient from "./api-client";
import { Order, CreateOrderRequest, UpdateOrderRequest } from "@/types";

export const orderService = {
    /**
     * Get all orders for the current user
     */
    async getOrders(): Promise<Order[]> {
        const { data } = await apiClient.get("/orders");
        return data;
    },

    /**
     * Get a specific order by ID
     */
    async getOrderById(id: string): Promise<Order> {
        const { data } = await apiClient.get(`/orders/${id}`);
        return data;
    },

    /**
     * Create a new order (requires authentication)
     */
    async createOrder(orderData: CreateOrderRequest): Promise<Order> {
        const { data } = await apiClient.post("/orders", orderData);
        return data;
    },

    /**
     * Update an existing order
     */
    async updateOrder(id: string, updateData: UpdateOrderRequest): Promise<Order> {
        const { data } = await apiClient.put(`/orders/${id}`, updateData);
        return data;
    },

    /**
     * Update order status
     */
    async updateOrderStatus(id: string, status: string): Promise<Order> {
        const { data } = await apiClient.patch(`/orders/${id}/status`, { status });
        return data;
    },

    /**
     * Cancel an order
     */
    async cancelOrder(id: string): Promise<void> {
        await apiClient.delete(`/orders/${id}`);
    },

    /**
     * Get order history with pagination
     */
    async getOrderHistory(page: number = 1, limit: number = 10): Promise<{
        orders: Order[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const { data } = await apiClient.get("/orders", {
            params: { page, limit }
        });
        return data;
    }
};