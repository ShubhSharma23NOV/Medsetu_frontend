import apiClient from "./api-client";
import { Medicine } from "@/types";

export interface StoreInventoryStats {
    inventory: {
        totalMedicines: number;
        inStockMedicines: number;
        outOfStockMedicines: number;
    };
    orders: {
        totalOrders: number;
        pendingOrders: number;
        completedOrders: number;
    };
    revenue: {
        totalRevenue: number;
    };
    recentOrders: Array<{
        id: number;
        customerName: string;
        amount: number;
        status: string;
        createdAt: string;
    }>;
}

export const storeInventoryService = {
    /**
     * Get store inventory (medicines)
     */
    async getInventory(search?: string, category?: string): Promise<Medicine[]> {
        const { data } = await apiClient.get("/store/inventory", {
            params: { search, category }
        });
        return data;
    },

    /**
     * Get store dashboard stats
     */
    async getDashboardStats(): Promise<StoreInventoryStats> {
        const { data } = await apiClient.get("/store/dashboard");
        return data;
    },

    /**
     * Add new medicine to store inventory
     */
    async addMedicine(medicineData: {
        name: string;
        price: number;
        category?: string;
        inStock: boolean;
        rxRequired: boolean;
    }): Promise<Medicine> {
        const { data } = await apiClient.post("/store/inventory", medicineData);
        return data;
    },

    /**
     * Update medicine in store inventory
     */
    async updateMedicine(id: string, medicineData: Partial<Medicine>): Promise<Medicine> {
        const { data } = await apiClient.put(`/store/inventory/${id}`, medicineData);
        return data;
    },

    /**
     * Delete medicine from store inventory
     */
    async deleteMedicine(id: string): Promise<void> {
        await apiClient.delete(`/store/inventory/${id}`);
    },

    /**
     * Bulk upload medicines
     */
    async bulkUploadMedicines(file: File): Promise<{
        success: boolean;
        totalRows: number;
        successCount: number;
        errorCount: number;
        errors?: any[];
        summary?: string;
    }> {
        const formData = new FormData();
        formData.append('file', file);

        // Don't set Content-Type header - let browser set it with boundary
        const { data } = await apiClient.post("/medicines/bulk-upload", formData);
        return data;
    }
};