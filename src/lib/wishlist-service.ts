import { WishlistItem } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class WishlistService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth-token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getWishlist(): Promise<WishlistItem[]> {
    const response = await fetch(`${API_URL}/wishlist`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch wishlist');
    }

    return response.json();
  }

  async addToWishlist(medicineId: number): Promise<WishlistItem> {
    const response = await fetch(`${API_URL}/wishlist/${medicineId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add to wishlist');
    }

    return response.json();
  }

  async removeFromWishlist(medicineId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/wishlist/${medicineId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to remove from wishlist');
    }

    return response.json();
  }

  async isInWishlist(medicineId: number): Promise<{ inWishlist: boolean }> {
    const response = await fetch(`${API_URL}/wishlist/check/${medicineId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to check wishlist status');
    }

    return response.json();
  }

  async clearWishlist(): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/wishlist`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to clear wishlist');
    }

    return response.json();
  }
}

export const wishlistService = new WishlistService();