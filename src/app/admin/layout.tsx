"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    FileText,
    Settings,
    LogOut,
    Pill,
    Power,
    CheckCircle2,
    Menu,
    X,
    Search,
    Bell,
    Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useStoreApplication } from "@/hooks/use-store-application";
import { toast } from "sonner";

const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { label: "Dukan Stock", icon: Package, href: "/admin/inventory" },
    { label: "Bulk Upload", icon: Upload, href: "/admin/bulk-upload" },
    { label: "Purchase Orders", icon: FileText, href: "/admin/orders" },
    { label: "Prescriptions", icon: Pill, href: "/admin/prescriptions" },
    { label: "Store Settings", icon: Settings, href: "/admin/settings" },
    { label: "Store Profile", icon: CheckCircle2, href: "/admin/profile" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        const pathname = usePathname();
        const router = useRouter();
        const { user, isAuthenticated, logout } = useAuthStore();
        const { data: applicationStatus, isLoading: statusLoading } = useStoreApplication();
        const [isStoreOpen, setIsStoreOpen] = useState(true);
        const [sidebarOpen, setSidebarOpen] = useState(true);

        // Authentication and role-based access control
        useEffect(() => {
            // Don't redirect if we're still loading or if user is already authenticated with correct role
            if (statusLoading) return;
            
            if (!isAuthenticated || !user) {
                toast.error("Access Denied", {
                    description: "Please login to access the admin dashboard.",
                });
                router.push("/login");
                return;
            }

            if (user.role !== 'STORE') {
                toast.error("Access Denied", {
                    description: "You don't have permission to access the medical store dashboard.",
                });
                router.push("/"); // Redirect to home page
                return;
            }
        }, [isAuthenticated, user?.id, user?.role, statusLoading, router]); // More specific dependencies

        // Check store application status
        useEffect(() => {
            // Only check status if user is authenticated and is a STORE user
            if (!isAuthenticated || !user || user.role !== 'STORE') return;
            
            if (!statusLoading && applicationStatus && user?.role === 'STORE') {
                if (applicationStatus.storeStatus === 'PENDING' || 
                    applicationStatus.storeStatus === 'REJECTED' || 
                    !applicationStatus.storeStatus) {
                    // Redirect to store application page
                    router.push('/store-application');
                    return;
                }
            }
        }, [applicationStatus, statusLoading, user?.id, user?.role, isAuthenticated, router]);

        // Show loading while checking authentication and status
        if (!isAuthenticated || user?.role !== 'STORE') {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-slate-500 font-medium">Loading Authentication...</p>
                    </div>
                </div>
            );
        }

        // Show loading while checking store status
        if (statusLoading) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-slate-500 font-medium">Loading Store Status...</p>
                    </div>
                </div>
            );
        }

        // If store status check failed or store is not approved, show appropriate message
        if (!applicationStatus) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 font-medium">Failed to load store status</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        // If store is not approved, don't render admin layout
        if (applicationStatus.storeStatus !== 'APPROVED') {
            return null;
        }

        return (
            <div className="flex h-screen bg-slate-50 overflow-hidden font-inter">
                {/* Sidebar */}
                <motion.aside
                    initial={{ width: 280 }}
                    animate={{ width: sidebarOpen ? 280 : 90 }}
                    className="bg-slate-900 text-white flex flex-col justify-between m-4 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 shrink-0 overflow-hidden z-20"
                >
                    <div className="flex flex-col h-full">
                        {/* Brand */}
                        <div className="h-24 flex items-center px-6 shrink-0">
                            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
                                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                                    <Pill className="h-6 w-6" />
                                </div>
                                {sidebarOpen && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="overflow-hidden whitespace-nowrap"
                                    >
                                        <span className="text-xl font-black tracking-tight block leading-none">
                                            Med<span className="text-primary italic">Setu</span>
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partner App</span>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 px-4 py-2 overflow-y-auto custom-scrollbar">
                            {/* Store Status Toggle */}
                            <div className={`bg-white/5 rounded-2xl p-4 mb-8 border border-white/5 transition-all ${!sidebarOpen && 'p-2 flex justify-center'}`}>
                                {sidebarOpen ? (
                                    <>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Shop Status</span>
                                            <div className={`h-2 w-2 rounded-full ${isStoreOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                        </div>
                                        <button
                                            onClick={() => setIsStoreOpen(!isStoreOpen)}
                                            className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${isStoreOpen
                                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                : 'bg-red-500/20 text-red-500'
                                                }`}
                                        >
                                            <Power size={14} />
                                            {isStoreOpen ? 'Open for Orders' : 'Shop Closed'}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsStoreOpen(!isStoreOpen)}
                                        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${isStoreOpen
                                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                            : 'bg-red-500/20 text-red-500'
                                            }`}
                                        title={isStoreOpen ? 'Shop Open' : 'Shop Closed'}
                                    >
                                        <Power size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Navigation */}
                            <div className="space-y-2">
                                {NAV_ITEMS.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <div className={`flex items-center rounded-2xl transition-all group ${sidebarOpen ? 'gap-4 p-4' : 'justify-center p-3'
                                                } ${isActive
                                                    ? "bg-primary text-white shadow-xl shadow-primary/30 font-black"
                                                    : "text-slate-400 hover:bg-white/10 hover:text-white font-medium"
                                                }`}>
                                                <item.icon size={20} className="shrink-0" />
                                                {sidebarOpen && (
                                                    <span className="text-sm whitespace-nowrap">{item.label}</span>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Profile */}
                        <div className={`p-4 mt-auto shrink-0 ${!sidebarOpen && 'flex justify-center'}`}>
                            <div className={`bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden transition-all ${sidebarOpen ? 'p-6' : 'p-2 w-12 h-12 flex items-center justify-center'}`}>
                                {sidebarOpen && <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl -mr-12 -mt-12" />}

                                <div className={`flex items-center ${sidebarOpen ? 'gap-3 mb-4' : 'justify-center'} relative z-10`}>
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                                        {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'SM'}
                                    </div>
                                    {sidebarOpen && (
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-black text-white truncate">{user?.name || 'Your Store'}</p>
                                            <div className="flex items-center gap-1 text-[10px] text-green-400 font-bold uppercase tracking-widest mt-1">
                                                <CheckCircle2 size={10} /> Verified
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {sidebarOpen && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-2 relative z-10"
                                        onClick={() => {
                                            logout();
                                            // Force page reload to ensure clean state
                                            setTimeout(() => {
                                                window.location.href = "/login";
                                            }, 100);
                                        }}
                                    >
                                        <LogOut size={16} /> Logout
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* Main Page Content */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    {/* Top Header */}
                    <header className="h-24 px-8 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="bg-white rounded-xl hover:bg-slate-200 shadow-sm"
                            >
                                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                            </Button>
                            <div className="relative hidden md:block w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search inventory, orders..."
                                    className="pl-10 h-11 bg-white border-none rounded-xl focus-visible:ring-primary/20 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-slate-200 bg-white shadow-sm">
                                <Bell className="h-5 w-5 text-slate-600" />
                                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                            </Button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                        {children}
                    </div>
                </main>
            </div>
        );
    } catch (error) {
        // Type guard to safely access error properties
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 font-medium">Admin Layout Error</p>
                    <p className="text-sm text-gray-500 mt-2">{errorMessage}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }
}