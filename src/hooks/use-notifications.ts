import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "@/lib/notifications-service";
import { toast } from "sonner";

export function useNotifications(unreadOnly: boolean = false) {
    return useQuery({
        queryKey: ["notifications", unreadOnly],
        queryFn: () => notificationsService.getNotifications(unreadOnly),
        refetchInterval: 30000, // Refetch every 30 seconds
    });
}

export function useUnreadNotificationsCount() {
    return useQuery({
        queryKey: ["notifications", "unread-count"],
        queryFn: () => notificationsService.getUnreadCount(),
        refetchInterval: 30000, // Refetch every 30 seconds
    });
}

export function useMarkNotificationAsRead() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (notificationId: number) => notificationsService.markAsRead(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to mark as read");
        },
    });
}

export function useMarkAllNotificationsAsRead() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: () => notificationsService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.success("All notifications marked as read");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to mark all as read");
        },
    });
}

export function useDeleteNotification() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (notificationId: number) => notificationsService.deleteNotification(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.success("Notification deleted");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete notification");
        },
    });
}