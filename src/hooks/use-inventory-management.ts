import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface InventorySummary {
  totalMedicines: number;
  inStockMedicines: number;
  outOfStockMedicines: number;
  lowStockMedicines: number;
  expiringMedicines: number;
  stockPercentage: number;
}

interface LowStockAlert {
  medicineId: number;
  medicineName: string;
  currentStock: number;
  threshold: number;
  storeId: number;
  storeName: string;
}

interface ExpiryAlert {
  medicineId: number;
  medicineName: string;
  expiryDate: string;
  daysUntilExpiry: number;
  storeId: number;
  storeName: string;
}

interface InventoryAdjustment {
  medicineId: number;
  quantity: number;
  type: 'ADD' | 'SUBTRACT' | 'SET';
  reason: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// API functions
const fetchInventorySummary = async (): Promise<InventorySummary> => {
  const response = await fetch(`${API_BASE_URL}/store/dashboard`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - Please login again');
    }
    throw new Error('Failed to fetch inventory summary');
  }
  
  const data = await response.json();
  
  // Transform dashboard data to inventory summary format
  return {
    totalMedicines: data.inventory?.totalMedicines || 0,
    inStockMedicines: data.inventory?.inStockMedicines || 0,
    outOfStockMedicines: data.inventory?.outOfStockMedicines || 0,
    lowStockMedicines: 0, // Not available in current API
    expiringMedicines: 0, // Not available in current API
    stockPercentage: data.inventory?.totalMedicines > 0 
      ? Math.round((data.inventory.inStockMedicines / data.inventory.totalMedicines) * 100) 
      : 0,
  };
};

const fetchLowStockAlerts = async (threshold: number = 10): Promise<LowStockAlert[]> => {
  const response = await fetch(`${API_BASE_URL}/medicines/inventory/low-stock?threshold=${threshold}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch low stock alerts');
  }
  
  return response.json();
};

const fetchExpiryAlerts = async (days: number = 30): Promise<ExpiryAlert[]> => {
  const response = await fetch(`${API_BASE_URL}/medicines/inventory/expiry-alerts?days=${days}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch expiry alerts');
  }
  
  return response.json();
};

const adjustInventory = async (adjustment: InventoryAdjustment): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/medicines/inventory/adjust`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(adjustment),
  });
  
  if (!response.ok) {
    throw new Error('Failed to adjust inventory');
  }
};

const bulkUpdateInventory = async (updates: Array<{ medicineId: number; quantity: number }>): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/medicines/inventory/bulk-update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to bulk update inventory');
  }
};

const updateExpiryDate = async (medicineId: number, expiryDate: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/medicines/${medicineId}/expiry`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ expiryDate }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update expiry date');
  }
};

// Hooks
export const useInventorySummary = () => {
  return useQuery({
    queryKey: ['inventory-summary'],
    queryFn: fetchInventorySummary,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 1, // Only retry once on failure
  });
};

export const useLowStockAlerts = (threshold: number = 10) => {
  return useQuery({
    queryKey: ['low-stock-alerts', threshold],
    queryFn: () => fetchLowStockAlerts(threshold),
    staleTime: 60000,
    refetchOnWindowFocus: false,
    enabled: false, // Disable for now as endpoint doesn't exist
  });
};

export const useExpiryAlerts = (days: number = 30) => {
  return useQuery({
    queryKey: ['expiry-alerts', days],
    queryFn: () => fetchExpiryAlerts(days),
    staleTime: 300000,
    refetchOnWindowFocus: false,
    enabled: false, // Disable for now as endpoint doesn't exist
  });
};

export const useAdjustInventory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adjustInventory,
    onSuccess: () => {
      // Invalidate and refetch inventory-related queries
      queryClient.invalidateQueries({ queryKey: ['inventory-summary'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['store-inventory'] });
    },
  });
};

export const useBulkUpdateInventory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bulkUpdateInventory,
    onSuccess: () => {
      // Invalidate and refetch inventory-related queries
      queryClient.invalidateQueries({ queryKey: ['inventory-summary'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['store-inventory'] });
    },
  });
};

export const useUpdateExpiryDate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ medicineId, expiryDate }: { medicineId: number; expiryDate: string }) => 
      updateExpiryDate(medicineId, expiryDate),
    onSuccess: () => {
      // Invalidate and refetch inventory-related queries
      queryClient.invalidateQueries({ queryKey: ['expiry-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['store-inventory'] });
    },
  });
};