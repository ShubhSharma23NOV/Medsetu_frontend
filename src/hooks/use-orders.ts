import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/lib/order-service";
import { CreateOrderRequest, UpdateOrderRequest } from "@/types";
import { toast } from "sonner";

export function useOrders() {
    return useQuery({
        queryKey: ["orders"],
        queryFn: () => orderService.getOrders(),
    });
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: ["order", id],
        queryFn: () => orderService.getOrderById(id),
        enabled: !!id,
    });
}

export function useOrderHistory(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: ["orders", "history", page, limit],
        queryFn: () => orderService.getOrderHistory(page, limit),
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (orderData: CreateOrderRequest) => orderService.createOrder(orderData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
}

export function useUpdateOrder() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { status: string } }) => 
            orderService.updateOrderStatus(id, data.status),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", id] });
        },
    });
}

export function useCancelOrder() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) => 
            orderService.cancelOrder(id, reason),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", id] });
            toast.success("Order cancelled successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to cancel order");
        },
    });
}