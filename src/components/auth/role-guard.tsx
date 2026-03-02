"use client";

import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface RoleGuardProps {
    allowedRoles: string[];
    children: React.ReactNode;
    redirectTo?: string;
}

export function RoleGuard({ allowedRoles, children, redirectTo = "/" }: RoleGuardProps) {
    const { user, isAuthenticated, isInitialized } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isInitialized) return;

        if (!isAuthenticated || !user) {
            toast.error("Access Denied", {
                description: "Please login to access this page.",
            });
            router.push("/login");
            return;
        }

        if (!allowedRoles.includes(user.role)) {
            toast.error("Access Denied", {
                description: `This page is restricted to ${allowedRoles.join(", ")} users only.`,
            });
            
            // Redirect based on user role
            if (user.role === 'USER') {
                router.push("/");
            } else if (user.role === 'STORE') {
                router.push("/admin");
            } else if (user.role === 'PLATFORM_ADMIN') {
                router.push("/platform-admin");
            } else {
                router.push(redirectTo);
            }
            return;
        }
    }, [isAuthenticated, user, isInitialized, allowedRoles, router, redirectTo]);

    // Show loading while checking authentication
    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Checking permissions...</p>
                </div>
            </div>
        );
    }

    // Don't render if user doesn't have permission
    if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}