import apiClient from "./api-client";

export const healthService = {
    /**
     * Check API health status
     */
    async checkHealth(): Promise<{ status: string; timestamp: string }> {
        const { data } = await apiClient.get("/health");
        return data;
    }
};