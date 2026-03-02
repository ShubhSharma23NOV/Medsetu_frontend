import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';

/**
 * Hook to validate authentication state on app initialization
 * Should be used in layout components to ensure auth state is valid
 */
export function useAuthValidation() {
    const { isAuthenticated, validateToken, clearAuth } = useAuthStore();

    useEffect(() => {
        // Only validate if user claims to be authenticated
        if (isAuthenticated) {
            const isValid = validateToken();
            if (!isValid) {
                clearAuth();
            }
        }
    }, []); // Only run once on mount

    return { isAuthenticated };
}