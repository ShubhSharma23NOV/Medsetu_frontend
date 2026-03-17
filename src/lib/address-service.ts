import { API_BASE_URL } from './api-config';

export interface Address {
  id: number;
  title: string;
  fullName: string;
  phone: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  title: string;
  fullName: string;
  phone: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  title?: string;
  fullName?: string;
  phone?: string;
  addressLine?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isDefault?: boolean;
}

class AddressService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAddresses(): Promise<Address[]> {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch addresses');
    }

    return response.json();
  }

  async addAddress(addressData: CreateAddressRequest): Promise<Address> {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      throw new Error('Failed to add address');
    }

    return response.json();
  }

  async updateAddress(id: number, addressData: UpdateAddressRequest): Promise<Address> {
    const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      throw new Error('Failed to update address');
    }

    return response.json();
  }

  async deleteAddress(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete address');
    }
  }

  async setDefaultAddress(id: number): Promise<Address> {
    const response = await fetch(`${API_BASE_URL}/addresses/${id}/default`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to set default address');
    }

    return response.json();
  }
}

export const addressService = new AddressService();