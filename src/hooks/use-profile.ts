import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, UserProfile } from "@/lib/profile-service";

export function useCurrentUser() {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: () => profileService.getCurrentUser(),
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (profileData: Partial<UserProfile>) => profileService.updateProfile(profileData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
    });
}