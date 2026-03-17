import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userPreferencesService } from "@/lib/user-preferences-service";
import { UserPreferences } from "@/types";
import { toast } from "sonner";

export function useUserPreferences() {
    return useQuery({
        queryKey: ["user-preferences"],
        queryFn: () => userPreferencesService.getPreferences(),
    });
}

export function useUpdateUserPreferences() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: Partial<UserPreferences>) => userPreferencesService.updatePreferences(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-preferences"] });
            toast.success("Preferences updated");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update preferences");
        },
    });
}

export function useResetUserPreferences() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: () => userPreferencesService.resetPreferences(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-preferences"] });
            toast.success("Preferences reset to default");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to reset preferences");
        },
    });
}