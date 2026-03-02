import { useEffect } from 'react';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { API_BASE_URL } from '@/lib/api-config';
import { toast } from 'sonner';

/**
 * Hook to load cart from backend when user logs in
 * Also merges local cart with server cart
 */
export function useCartLoader() {
  const { isAuthenticated, user } = useAuthStore();
  const { items: localItems, setPrescriptionId } = useCartStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const loadAndMergeCart = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) return;

        // If user has local cart items, merge them
        if (localItems.length > 0) {
          console.log('🔄 Merging local cart with server cart...');
          
          const response = await fetch(`${API_BASE_URL}/cart/merge`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: localItems.map(item => ({
                id: typeof item.id === 'string' ? parseInt(item.id) : item.id,
                quantity: item.quantity,
                price: item.price
              }))
            })
          });

          if (!response.ok) throw new Error('Failed to merge cart');
          
          const serverCart = await response.json();
          
          // Update local cart with merged data
          if (serverCart.items && serverCart.items.length > 0) {
            const cartItems = serverCart.items.map((item: any) => ({
              id: item.medicine.id.toString(),
              name: item.medicine.name,
              price: item.medicine.price,
              quantity: item.quantity,
              inStock: item.medicine.inStock,
              rxRequired: item.medicine.rxRequired,
              category: item.medicine.category,
              brand: item.medicine.brand,
            }));
            
            useCartStore.setState({ items: cartItems });
          }
          
          if (serverCart.prescriptionId) {
            setPrescriptionId(serverCart.prescriptionId.toString());
          }
          
          console.log('✅ Cart merged successfully');
        } else {
          // Just load server cart
          console.log('📥 Loading cart from server...');
          
          const response = await fetch(`${API_BASE_URL}/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });

          if (!response.ok) throw new Error('Failed to load cart');
          
          const serverCart = await response.json();
          
          // Update local cart with server data
          if (serverCart.items && serverCart.items.length > 0) {
            const cartItems = serverCart.items.map((item: any) => ({
              id: item.medicine.id.toString(),
              name: item.medicine.name,
              price: item.medicine.price,
              quantity: item.quantity,
              inStock: item.medicine.inStock,
              rxRequired: item.medicine.rxRequired,
              category: item.medicine.category,
              brand: item.medicine.brand,
            }));
            
            useCartStore.setState({ items: cartItems });
          }
          
          if (serverCart.prescriptionId) {
            setPrescriptionId(serverCart.prescriptionId.toString());
          }
          
          console.log('✅ Cart loaded from server');
        }
      } catch (error) {
        console.error('❌ Failed to load/merge cart:', error);
        toast.error('Failed to sync cart', {
          description: 'Your cart may not be up to date'
        });
      }
    };

    loadAndMergeCart();
  }, [isAuthenticated, user]); // Only run when auth state changes
}
