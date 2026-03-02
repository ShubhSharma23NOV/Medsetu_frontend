import apiClient from "./api-client";

export interface StoreApplicationData {
    storeName: string;
    storeAddress: string;
    storePhone: string;
    licenseNumber: string;
    ownerName: string;
}

export interface StoreApplicationStatus {
    id: number;
    email: string;
    name: string;
    role: string;
    storeStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    storeName?: string;
    storeAddress?: string;
    storePhone?: string;
    licenseNumber?: string;
    ownerName?: string;
    rejectionReason?: string;
}

export const storeApplicationService = {
    /**
     * Submit store application
     */
    async submitApplication(applicationData: StoreApplicationData): Promise<StoreApplicationStatus> {
        const { data } = await apiClient.post("/store-application/submit", applicationData);
        return data;
    },

    /**
     * Get current application status
     */
    async getApplicationStatus(): Promise<StoreApplicationStatus> {
        const { data } = await apiClient.get("/store-application/status");
        return data;
    }
};