import { useQuery } from "@tanstack/react-query";
import { healthService } from "@/lib/health-service";

export function useHealthCheck() {
    return useQuery({
        queryKey: ["health"],
        queryFn: () => healthService.checkHealth(),
        refetchInterval: 30000, // Check health every 30 seconds
        retry: 3,
    });
}