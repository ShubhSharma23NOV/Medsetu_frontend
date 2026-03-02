import apiClient from "./api-client";

export interface DashboardStats {
    todayEarnings: number;
    newOrders: number;
    pendingPrescriptions: number;
    expiryAlerts: number;
    totalMedicines: number;
    inStockMedicines: number;
    rxRequiredMedicines: number;
    totalPrescriptions: number;
}

export interface Activity {
    type: string;
    title: string;
    description: string;
    time: string;
    status: string;
}

export interface PendingTasks {
    pendingPrescriptions: number;
    lowStockMedicines: number;
    pendingOrders: number;
    expiringMedicines: number;
}

export const dashboardService = {
    /**
     * Get dashboard statistics
     */
    async getStats(): Promise<DashboardStats> {
        const { data } = await apiClient.get<DashboardStats>("/dashboard/stats");
        return data;
    },

    /**
     * Get recent activities
     */
    async getRecentActivities(): Promise<Activity[]> {
        const { data } = await apiClient.get<Activity[]>("/dashboard/recent-activities");
        return data;
    },

    /**
     * Get pending tasks count
     */
    async getPendingTasks(): Promise<PendingTasks> {
        const { data } = await apiClient.get<PendingTasks>("/dashboard/pending-tasks");
        return data;
    }
};