import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderTrackingService } from "@/lib/order-tracking-service";
import { toast } from "sonner";

export function useOrderTracking(orderId: number) {
    return useQuery({
        queryKey: ["order-tracking", orderId],
        queryFn: () => orderTrackingService.getTracking(orderId),
        enabled: !!orderId,
        refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    });
}

export function useUpdateOrderTracking() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ orderId, data }: { 
            orderId: number; 
            data: {
                status?: string;
                currentLocation?: { lat: number; lng: number };
                deliveryPartnerName?: string;
                deliveryPartnerPhone?: string;
                vehicleNumber?: string;
                estimatedDeliveryTime?: string;
            }
        }) => orderTrackingService.updateTracking(orderId, data),
        onSuccess: (_, { orderId }) => {
            queryClient.invalidateQueries({ queryKey: ["order-tracking", orderId] });
            toast.success("Tracking updated");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update tracking");
        },
    });
}

export function useUpdateOrderLocation() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ orderId, location }: { 
            orderId: number; 
            location: { lat: number; lng: number }
        }) => orderTrackingService.updateLocation(orderId, location),
        onSuccess: (_, { orderId }) => {
            queryClient.invalidateQueries({ queryKey: ["order-tracking", orderId] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update location");
        },
    });
}

export function useAssignDeliveryPartner() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ orderId, data }: { 
            orderId: number; 
            data: {
                name: string;
                phone: string;
                vehicleNumber: string;
                estimatedDeliveryTime?: string;
            }
        }) => orderTrackingService.assignDeliveryPartner(orderId, data),
        onSuccess: (_, { orderId }) => {
            queryClient.invalidateQueries({ queryKey: ["order-tracking", orderId] });
            toast.success("Delivery partner assigned");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to assign delivery partner");
        },
    });
}