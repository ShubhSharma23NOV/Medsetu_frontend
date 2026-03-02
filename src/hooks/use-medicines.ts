import { useQuery } from "@tanstack/react-query";
import { medicineService } from "@/lib/medicine-service";

export function useMedicines(search?: string, category?: string) {
    return useQuery({
        queryKey: ["medicines", search || "", category || ""],
        queryFn: () => medicineService.getMedicines(search, category),
        staleTime: 2 * 60 * 1000, // 2 minutes - shorter stale time
        gcTime: 5 * 60 * 1000, // 5 minutes cache
        refetchOnWindowFocus: false,
        retry: 2, // Retry failed requests twice
    });
}

export function useMedicine(id: string) {
    return useQuery({
        queryKey: ["medicine", id],
        queryFn: () => medicineService.getMedicineById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
    });
}

export function useMedicinesByCategory(category: string) {
    return useQuery({
        queryKey: ["medicines", "category", category],
        queryFn: () => medicineService.getMedicinesByCategory(category),
        enabled: !!category,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function useSearchMedicines(query: string) {
    return useQuery({
        queryKey: ["medicines", "search", query],
        queryFn: () => medicineService.searchMedicines(query),
        enabled: !!query && query.length > 2, // Only search if query is longer than 2 characters
        staleTime: 3 * 60 * 1000, // 3 minutes for search results
        gcTime: 5 * 60 * 1000,
    });
}

export function useFeaturedMedicines() {
    return useQuery({
        queryKey: ["medicines", "featured"],
        queryFn: () => medicineService.getFeaturedMedicines(),
        staleTime: 10 * 60 * 1000, // 10 minutes - featured medicines don't change often
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
}
