import apiClient from "./api-client";

export interface PlatformStats {
    totalUsers: number;
    totalStores: number;
    totalCustomers: number;
    totalOrders: number;
    totalMedicines: number;
    totalPrescriptions: number;
    totalRevenue: number;
    monthlyGrowth: number;
    activeStores: number;
}

export interface PlatformUser {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    status?: string;
    totalSpent?: number;
}

export interface PlatformStore {
    id: number;
    storeId?: number;
    name: string;
    owner: string;
    email: string;
    license: string;
    location: string;
    status: string;
    joined: string;
    totalOrders?: number;
    revenue?: number;
    priority?: number;
    serviceablePincodes?: string[];
    isActive?: boolean;
}

export interface PlatformOrder {
    id: number;
    customer: string;
    store: string;
    items: number;
    amount: number;
    status: string;
    createdAt: string;
    address?: string;
    type?: string;
}

export interface PlatformPayment {
    id: string;
    orderId: string;
    amount: number;
    method: string;
    status: string;
    date: string;
}

export const platformAdminService = {
    /**
     * Get platform dashboard statistics
     */
    async getStats(): Promise<PlatformStats> {
        const { data } = await apiClient.get<PlatformStats>("/platform-admin/stats");
        return data;
    },

    /**
     * Get all users
     */
    async getUsers(role?: string): Promise<PlatformUser[]> {
        const { data } = await apiClient.get<PlatformUser[]>("/platform-admin/users", {
            params: { role }
        });
        return data;
    },

    /**
     * Update user status
     */
    async updateUserStatus(id: number, status: string): Promise<any> {
        const { data } = await apiClient.put(`/platform-admin/users/${id}/status`, { status });
        return data;
    },

    /**
     * Get all stores
     */
    async getStores(status?: string): Promise<PlatformStore[]> {
        const { data } = await apiClient.get<PlatformStore[]>("/platform-admin/stores", {
            params: { status }
        });
        return data;
    },

    /**
     * Create new store
     */
    async createStore(storeData: {
        name: string;
        ownerName: string;
        email: string;
        license: string;
        location: string;
    }): Promise<PlatformStore> {
        const { data } = await apiClient.post<PlatformStore>("/platform-admin/stores", storeData);
        return data;
    },

    /**
     * Update store status
     */
    async updateStoreStatus(id: number, status: string): Promise<any> {
        const { data } = await apiClient.put(`/platform-admin/stores/${id}/status`, { status });
        return data;
    },

    /**
     * Get all orders across platform
     */
    async getOrders(status?: string): Promise<PlatformOrder[]> {
        const { data } = await apiClient.get<PlatformOrder[]>("/platform-admin/orders", {
            params: { status }
        });
        return data;
    },

    /**
     * Get payment transactions
     */
    async getPayments(): Promise<PlatformPayment[]> {
        const { data } = await apiClient.get<PlatformPayment[]>("/platform-admin/payments");
        return data;
    }
};