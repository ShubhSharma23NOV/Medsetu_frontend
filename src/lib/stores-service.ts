import { API_BASE_URL } from './api-config';

export interface Store {
  id: number;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  licenseNumber: string;
  ownerName: string;
  serviceablePincodes: string[];
  priority: number;
  isActive: boolean;
  distance?: number;
  createdAt: string;
  stats?: {
    medicineCount: number;
    recentOrdersCount: number;
    rating: number;
    reviewCount: number;
  };
}

export interface StoreMedicine {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  dosage: string;
  healthCondition: string;
  description?: string;
  imageUrl?: string;
  inStock: boolean;
  rxRequired: boolean;
  createdAt: string;
}

export interface StoresResponse {
  stores: Store[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StoreMedicinesResponse {
  medicines: StoreMedicine[];
  store: {
    id: number;
    name: string;
    address: string;
    phone: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class StoresService {
  async getNearbyStores(params?: {
    pincode?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    page?: number;
    limit?: number;
  }): Promise<StoresResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.pincode) searchParams.append('pincode', params.pincode);
    if (params?.lat) searchParams.append('lat', params.lat.toString());
    if (params?.lng) searchParams.append('lng', params.lng.toString());
    if (params?.radius) searchParams.append('radius', params.radius.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/stores/nearby?${searchParams}`);

    if (!response.ok) {
      throw new Error('Failed to fetch nearby stores');
    }

    return response.json();
  }

  async getStoreDetails(id: number): Promise<Store> {
    const response = await fetch(`${API_BASE_URL}/stores/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch store details');
    }

    return response.json();
  }

  async getStoreMedicines(
    storeId: number,
    params?: {
      search?: string;
      category?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<StoreMedicinesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/stores/${storeId}/medicines?${searchParams}`);

    if (!response.ok) {
      throw new Error('Failed to fetch store medicines');
    }

    return response.json();
  }
}

export const storesService = new StoresService();