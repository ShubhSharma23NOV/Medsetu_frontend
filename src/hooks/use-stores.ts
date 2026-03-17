import { useQuery } from '@tanstack/react-query';
import { storesService } from '@/lib/stores-service';

export function useNearbyStores(params?: {
  pincode?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['stores', 'nearby', params],
    queryFn: () => storesService.getNearbyStores(params),
    enabled: !!(params?.pincode || (params?.lat && params?.lng)) || !params,
  });
}

export function useStoreDetails(id: number) {
  return useQuery({
    queryKey: ['stores', id],
    queryFn: () => storesService.getStoreDetails(id),
    enabled: !!id,
  });
}

export function useStoreMedicines(
  storeId: number,
  params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }
) {
  return useQuery({
    queryKey: ['stores', storeId, 'medicines', params],
    queryFn: () => storesService.getStoreMedicines(storeId, params),
    enabled: !!storeId,
  });
}