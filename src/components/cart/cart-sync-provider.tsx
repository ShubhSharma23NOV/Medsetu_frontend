"use client";

import { useCartSync } from "@/hooks/use-cart-sync";
import { useCartLoader } from "@/hooks/use-cart-loader";

/**
 * Provider component that handles cart synchronization
 * Place this in the root layout to enable automatic cart sync
 */
export function CartSyncProvider() {
  // Load cart from backend on login
  useCartLoader();
  
  // Sync cart to backend (debounced)
  useCartSync();
  
  return null; // This component doesn't render anything
}
