import apiClient from "./api-client";
import { AdminDashboardStats, AdminOrder, AdminUser, AdminMedicine } from "@/types";

export const adminService = {
    /**
     * Get admin dashboard statistics
     */
    async getDashboardStats(): Promise<AdminDashboardStats> {
        const { data } = await apiClient.get("/admin/dashboard");
        return data;
    },

    /**
     * Get all orders for admin management
     */
    async getAllOrders(page: number = 1, limit: number = 10, status?: string): Promise<{
        orders: AdminOrder[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const { data } = await apiClient.get("/admin/orders", {
            params: { page, limit, status }
        });
        return data;
    },

    /**
     * Update order status (admin only)
     */
    async updateOrderStatus(orderId: string, status: string): Promise<AdminOrder> {
        const { data } = await apiClient.put(`/admin/orders/${orderId}/status`, { status });
        return data;
    },

    /**
     * Get all users for admin management
     */
    async getAllUsers(page: number = 1, limit: number = 10): Promise<{
        users: AdminUser[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const { data } = await apiClient.get("/admin/users", {
            params: { page, limit }
        });
        return data;
    },

    /**
     * Update user role or status
     */
    async updateUser(userId: string, updateData: Partial<AdminUser>): Promise<AdminUser> {
        const { data } = await apiClient.put(`/admin/users/${userId}`, updateData);
        return data;
    },

    /**
     * Get inventory/medicines for admin management
     */
    async getInventory(page: number = 1, limit: number = 10): Promise<{
        medicines: AdminMedicine[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const { data } = await apiClient.get("/admin/inventory", {
            params: { page, limit }
        });
        return data;
    },

    /**
     * Add new medicine (admin only)
     */
    async addMedicine(medicineData: Omit<AdminMedicine, 'id'>): Promise<AdminMedicine> {
        const { data } = await apiClient.post("/admin/medicines", medicineData);
        return data;
    },

    /**
     * Update medicine (admin only)
     */
    async updateMedicine(id: string, medicineData: Partial<AdminMedicine>): Promise<AdminMedicine> {
        const { data } = await apiClient.put(`/admin/medicines/${id}`, medicineData);
        return data;
    },

    /**
     * Delete medicine (admin only)
     */
    async deleteMedicine(id: string): Promise<void> {
        await apiClient.delete(`/admin/medicines/${id}`);
    }
};