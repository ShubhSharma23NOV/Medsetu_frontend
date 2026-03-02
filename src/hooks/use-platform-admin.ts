import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { platformAdminService } from "@/lib/platform-admin-service";

export function usePlatformStats() {
    return useQuery({
        queryKey: ["platform-admin", "stats"],
        queryFn: () => platformAdminService.getStats(),
        refetchInterval: 30000, // Refresh every 30 seconds
    });
}

export function usePlatformUsers(role?: string) {
    return useQuery({
        queryKey: ["platform-admin", "users", role],
        queryFn: () => platformAdminService.getUsers(role),
    });
}

export function usePlatformStores(status?: string) {
    return useQuery({
        queryKey: ["platform-admin", "stores", status],
        queryFn: () => platformAdminService.getStores(status),
    });
}

export function usePlatformOrders(status?: string) {
    return useQuery({
        queryKey: ["platform-admin", "orders", status],
        queryFn: () => platformAdminService.getOrders(status),
    });
}

export function usePlatformPayments() {
    return useQuery({
        queryKey: ["platform-admin", "payments"],
        queryFn: () => platformAdminService.getPayments(),
    });
}

// Mutations
export function useUpdateUserStatus() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            platformAdminService.updateUserStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "users"] });
        },
    });
}

export function useUpdateStoreStatus() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            platformAdminService.updateStoreStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "stores"] });
        },
    });
}

export function useCreateStore() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (storeData: {
            name: string;
            ownerName: string;
            email: string;
            license: string;
            location: string;
        }) => platformAdminService.createStore(storeData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["platform-admin", "stores"] });
        },
    });
}