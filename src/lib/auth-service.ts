import apiClient from "./api-client";
import { User } from "@/types";

export const authService = {
    /**
     * Login user with email and password
     */
    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        const { data } = await apiClient.post("/auth/login", { email, password });
        return data;
    },

    /**
     * Register new user
     */
    async register(name: string, email: string, password: string, role: string): Promise<{ user: User; token: string }> {
        try {
            const { data } = await apiClient.post("/auth/register", { name, email, password, role });
            
            // Validate response structure
            if (!data || !data.user || !data.token) {
                throw new Error("Invalid response from server: missing user or token");
            }
            
            return data;
        } catch (error) {
            console.error("Auth service register error:", error);
            throw error;
        }
    },

    /**
     * Logout user (optional backend call to invalidate token)
     */
    async logout(): Promise<void> {
        try {
            await apiClient.post("/auth/logout");
        } catch (error) {
            // Even if logout fails on backend, we'll clear local storage
            console.warn("Logout request failed:", error);
        }
    },

    /**
     * Refresh authentication token
     */
    async refreshToken(): Promise<{ token: string }> {
        const { data } = await apiClient.post("/auth/refresh");
        return data;
    },

    /**
     * Get current user profile
     */
    async getProfile(): Promise<User> {
        const { data } = await apiClient.get("/auth/profile");
        return data;
    },

    /**
     * Update user profile
     */
    async updateProfile(userData: Partial<User>): Promise<User> {
        const { data } = await apiClient.put("/auth/profile", userData);
        return data;
    },

    /**
     * Change password
     */
    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        await apiClient.put("/auth/change-password", {
            currentPassword,
            newPassword
        });
    },

    /**
     * Request password reset
     */
    async requestPasswordReset(email: string): Promise<void> {
        await apiClient.post("/auth/forgot-password", { email });
    },

    /**
     * Reset password with token
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        await apiClient.post("/auth/reset-password", { token, newPassword });
    }
};
