import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/dashboard-service";

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard", "stats"],
        queryFn: () => dashboardService.getStats(),
        refetchInterval: 30000, // Refresh every 30 seconds
    });
}

export function useRecentActivities() {
    return useQuery({
        queryKey: ["dashboard", "activities"],
        queryFn: () => dashboardService.getRecentActivities(),
        refetchInterval: 60000, // Refresh every minute
    });
}

export function usePendingTasks() {
    return useQuery({
        queryKey: ["dashboard", "tasks"],
        queryFn: () => dashboardService.getPendingTasks(),
        refetchInterval: 30000, // Refresh every 30 seconds
    });
}