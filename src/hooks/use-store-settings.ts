import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export function useStoreSettings() {
    return useQuery({
        queryKey: ["store-settings"],
        queryFn: async () => {
            const response = await apiClient.get("/store/settings");
            return response.data;
        },
    });
}

export function useUpdateStoreSettings() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (settingsData: {
            storeName?: string;
            storeAddress?: string;
            storePhone?: string;
            licenseNumber?: string;
            ownerName?: string;
            serviceablePincodes?: string[];
            isActive?: boolean;
        }) => {
            const response = await apiClient.put("/store/settings", settingsData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["store-settings"] });
        },
    });
}
