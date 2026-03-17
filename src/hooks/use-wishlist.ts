import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/lib/wishlist-service";
import { toast } from "sonner";

export function useWishlist() {
    return useQuery({
        queryKey: ["wishlist"],
        queryFn: () => wishlistService.getWishlist(),
    });
}

export function useAddToWishlist() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (medicineId: number) => wishlistService.addToWishlist(medicineId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            toast.success("Added to wishlist!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to add to wishlist");
        },
    });
}

export function useRemoveFromWishlist() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (medicineId: number) => wishlistService.removeFromWishlist(medicineId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            toast.success("Removed from wishlist");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to remove from wishlist");
        },
    });
}

export function useIsInWishlist(medicineId: number) {
    return useQuery({
        queryKey: ["wishlist", "check", medicineId],
        queryFn: () => wishlistService.isInWishlist(medicineId),
        enabled: !!medicineId,
    });
}

export function useClearWishlist() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: () => wishlistService.clearWishlist(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            toast.success("Wishlist cleared");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to clear wishlist");
        },
    });
}