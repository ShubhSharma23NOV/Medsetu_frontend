import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "@/lib/store-service";
import { Store } from "@/types";

export function useStoreOrders(storeId?: string, page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: ["store", "orders", storeId, page, limit],
        queryFn: () => storeService.getStoreOrders(storeId, page, limit),
    });
}

export function useStore(storeId: string) {
    return useQuery({
        queryKey: ["store", storeId],
        queryFn: () => storeService.getStore(storeId),
        enabled: !!storeId,
    });
}

export function useMyStore() {
    return useQuery({
        queryKey: ["store", "my-store"],
        queryFn: () => storeService.getMyStore(),
    });
}

export function useStoreStats(storeId?: string) {
    return useQuery({
        queryKey: ["store", "stats", storeId],
        queryFn: () => storeService.getStoreStats(storeId),
    });
}

export function useUpdateStoreOrderStatus() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: string }) => 
            storeService.updateStoreOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["store", "orders"] });
        },
    });
}

export function useUpdateStore() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ storeId, data }: { storeId: string; data: Partial<Store> }) => 
            storeService.updateStore(storeId, data),
        onSuccess: (_, { storeId }) => {
            queryClient.invalidateQueries({ queryKey: ["store", storeId] });
            queryClient.invalidateQueries({ queryKey: ["store", "my-store"] });
        },
    });
}