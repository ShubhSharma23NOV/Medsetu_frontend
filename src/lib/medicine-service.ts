import apiClient from "./api-client";
import { Medicine } from "@/types";

export const medicineService = {
    /**
     * Fetch all medicines with optional search and category filters.
     */
    async getMedicines(search?: string, category?: string): Promise<Medicine[]> {
        const { data } = await apiClient.get<Medicine[]>("/medicines", { 
            params: { search, category } 
        });
        return data;
    },

    /**
     * Get a specific medicine by ID
     */
    async getMedicineById(id: string): Promise<Medicine> {
        const { data } = await apiClient.get<Medicine>(`/medicines/${id}`);
        return data;
    },

    /**
     * Get medicines by category
     */
    async getMedicinesByCategory(category: string): Promise<Medicine[]> {
        const { data } = await apiClient.get<Medicine[]>("/medicines", {
            params: { category }
        });
        return data;
    },

    /**
     * Search medicines by name or brand
     */
    async searchMedicines(query: string): Promise<Medicine[]> {
        const { data } = await apiClient.get<Medicine[]>("/medicines/search", {
            params: { q: query }
        });
        return data;
    },

    /**
     * Get featured/popular medicines
     */
    async getFeaturedMedicines(): Promise<Medicine[]> {
        const { data } = await apiClient.get<Medicine[]>("/medicines/featured");
        return data;
    },

    /**
     * Admin: Create new medicine
     */
    async createMedicine(medicineData: {
        name: string;
        price: number;
        inStock: boolean;
        rxRequired: boolean;
        category?: string;
    }): Promise<Medicine> {
        const { data } = await apiClient.post<Medicine>("/medicines", medicineData);
        return data;
    },

    /**
     * Admin: Update existing medicine
     */
    async updateMedicine(id: string, medicineData: {
        name?: string;
        price?: number;
        inStock?: boolean;
        rxRequired?: boolean;
        category?: string;
    }): Promise<Medicine> {
        const { data } = await apiClient.put<Medicine>(`/medicines/${id}`, medicineData);
        return data;
    },

    /**
     * Admin: Delete medicine
     */
    async deleteMedicine(id: string): Promise<void> {
        await apiClient.delete(`/medicines/${id}`);
    },

    /**
     * Admin: Bulk upload medicines from Excel/CSV file
     */
    async bulkUploadMedicines(file: File): Promise<{
        success: boolean;
        message: string;
        totalRows: number;
        successCount: number;
        errors: string[];
    }> {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await apiClient.post("/medicines/bulk-upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    }
};
