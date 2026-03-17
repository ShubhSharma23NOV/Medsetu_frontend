import { OrderTracking } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class OrderTrackingService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth-token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getTracking(orderId: number): Promise<OrderTracking> {
    const response = await fetch(`${API_URL}/orders/${orderId}/tracking`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order tracking');
    }

    return response.json();
  }

  // Store-only methods
  async updateTracking(orderId: number, data: {
    status?: string;
    currentLocation?: { lat: number; lng: number };
    deliveryPartnerName?: string;
    deliveryPartnerPhone?: string;
    vehicleNumber?: string;
    estimatedDeliveryTime?: string;
  }): Promise<OrderTracking> {
    const response = await fetch(`${API_URL}/orders/${orderId}/tracking`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update tracking');
    }

    return response.json();
  }

  async updateLocation(orderId: number, location: { lat: number; lng: number }): Promise<OrderTracking> {
    const response = await fetch(`${API_URL}/orders/${orderId}/tracking/location`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(location),
    });

    if (!response.ok) {
      throw new Error('Failed to update location');
    }

    return response.json();
  }

  async assignDeliveryPartner(orderId: number, data: {
    name: string;
    phone: string;
    vehicleNumber: string;
    estimatedDeliveryTime?: string;
  }): Promise<OrderTracking> {
    const response = await fetch(`${API_URL}/orders/${orderId}/tracking/assign-partner`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to assign delivery partner');
    }

    return response.json();
  }
}

export const orderTrackingService = new OrderTrackingService();