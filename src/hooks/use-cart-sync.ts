import { useEffect, useRef } from 'react';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';

/**
 * Hook to sync cart with backend (debounced)
 * Automatically syncs cart every 3 seconds when user is logged in
 */
export function useCartSync() {
  const { items, prescriptionId } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<string>('');

  useEffect(() => {
    // Only sync if user is authenticated
    if (!isAuthenticated) return;

    // Create a hash of current cart state
    const currentState = JSON.stringify({ items, prescriptionId });
    
    // Skip if nothing changed
    if (currentState === lastSyncRef.current) return;

    // Clear previous timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Debounce: sync after 3 seconds of inactivity
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) return;

        await fetch('http://localhost:3001/api/cart/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: items.map(item => ({
              id: typeof item.id === 'string' ? parseInt(item.id) : item.id,
              quantity: item.quantity,
              price: item.price
            })),
            prescriptionId: prescriptionId ? parseInt(prescriptionId) : undefined
          })
        });

        lastSyncRef.current = currentState;
        console.log('✅ Cart synced to backend');
      } catch (error) {
        console.error('❌ Cart sync failed:', error);
      }
    }, 3000);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [items, prescriptionId, isAuthenticated]);
}
