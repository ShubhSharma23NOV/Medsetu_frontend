import { useQuery } from "@tanstack/react-query";
import { configService, AppConfig } from "@/lib/config";

export function useConfig() {
    return useQuery({
        queryKey: ["appConfig"],
        queryFn: () => configService.loadConfig(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
}

export function useBusinessConfig() {
    const { data: config } = useConfig();
    return config?.business;
}

export function usePricingConfig() {
    const { data: config } = useConfig();
    return config?.pricing;
}

export function useDeliveryConfig() {
    const { data: config } = useConfig();
    return config?.delivery;
}

export function useDefaultStore() {
    const { data: config } = useConfig();
    return config?.defaultStore;
}