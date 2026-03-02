import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeApplicationService, StoreApplicationData } from "@/lib/store-application-service";

export function useStoreApplication() {
    return useQuery({
        queryKey: ["storeApplication"],
        queryFn: () => storeApplicationService.getApplicationStatus(),
        retry: false, // Don't retry if user is not authenticated
        // Return null if error (show form for new stores)
        throwOnError: false,
    });
}

export function useSubmitStoreApplication() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (applicationData: StoreApplicationData) => 
            storeApplicationService.submitApplication(applicationData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storeApplication"] });
            // Refresh the page to show the new status
            window.location.reload();
        },
        onError: (error) => {
            console.error('Failed to submit application:', error);
        }
    });
}