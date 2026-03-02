import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/lib/admin-service";
import { AdminUser, AdminMedicine } from "@/types";

export function useAdminDashboard() {
    return useQuery({
        queryKey: ["admin", "dashboard"],
        queryFn: () => adminService.getDashboardStats(),
    });
}

export function useAdminOrders(page: number = 1, limit: number = 10, status?: string) {
    return useQuery({
        queryKey: ["admin", "orders", page, limit, status],
        queryFn: () => adminService.getAllOrders(page, limit, status),
    });
}

export function useAdminUsers(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: ["admin", "users", page, limit],
        queryFn: () => adminService.getAllUsers(page, limit),
    });
}

export function useAdminInventory(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: ["admin", "inventory", page, limit],
        queryFn: () => adminService.getInventory(page, limit),
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: string }) => 
            adminService.updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: Partial<AdminUser> }) => 
            adminService.updateUser(userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
        },
    });
}

export function useAddMedicine() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (medicineData: Omit<AdminMedicine, 'id'>) => 
            adminService.addMedicine(medicineData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
            queryClient.invalidateQueries({ queryKey: ["medicines"] });
        },
    });
}

export function useUpdateMedicine() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<AdminMedicine> }) => 
            adminService.updateMedicine(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
            queryClient.invalidateQueries({ queryKey: ["medicines"] });
        },
    });
}

export function useDeleteMedicine() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => adminService.deleteMedicine(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
            queryClient.invalidateQueries({ queryKey: ["medicines"] });
        },
    });
}