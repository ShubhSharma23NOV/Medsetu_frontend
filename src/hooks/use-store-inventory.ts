import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeInventoryService } from "@/lib/store-inventory-service";
import { Medicine } from "@/types";

export function useStoreInventory(search?: string, category?: string) {
    return useQuery({
        queryKey: ["store", "inventory", search, category],
        queryFn: () => storeInventoryService.getInventory(search, category),
        staleTime: 30000, // Consider data fresh for 30 seconds
        refetchOnWindowFocus: false, // Don't refetch on window focus
    });
}

export function useStoreDashboard() {
    return useQuery({
        queryKey: ["store", "dashboard"],
        queryFn: () => storeInventoryService.getDashboardStats(),
        staleTime: 30000,
        refetchOnWindowFocus: false,
    });
}

export function useAddMedicine() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (medicineData: {
            name: string;
            price: number;
            category?: string;
            inStock: boolean;
            rxRequired: boolean;
        }) => storeInventoryService.addMedicine(medicineData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["store", "inventory"] });
            queryClient.invalidateQueries({ queryKey: ["store", "dashboard"] });
        },
    });
}

export function useUpdateMedicine() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Medicine> }) => 
            storeInventoryService.updateMedicine(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["store", "inventory"] });
            queryClient.invalidateQueries({ queryKey: ["store", "dashboard"] });
        },
    });
}

export function useDeleteMedicine() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => storeInventoryService.deleteMedicine(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["store", "inventory"] });
            queryClient.invalidateQueries({ queryKey: ["store", "dashboard"] });
        },
    });
}

export function useBulkUploadMedicines() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (file: File) => storeInventoryService.bulkUploadMedicines(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["store", "inventory"] });
            queryClient.invalidateQueries({ queryKey: ["store", "dashboard"] });
        },
    });
}