import apiClient from "./api-client";

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    city?: string;
    pincode?: string;
    dateOfBirth?: string;
    gender?: string;
    avatar?: string;
    // Store fields (for STORE users)
    storeName?: string;
    storeAddress?: string;
    storePhone?: string;
    licenseNumber?: string;
    ownerName?: string;
}

export const profileService = {
    /**
     * Get current user profile
     */
    async getCurrentUser(): Promise<UserProfile> {
        const { data } = await apiClient.get("/auth/profile");
        return data;
    },

    /**
     * Update user profile
     */
    async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
        const { data } = await apiClient.put("/auth/profile", profileData);
        return data;
    }
};