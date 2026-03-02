"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Store,
    Users,
    ShoppingBag,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";

export default function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();

    // Authentication and role-based access control
    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("Access Denied", {
                description: "Please login to access the platform admin dashboard.",
            });
            router.push("/login");
            return;
        }

        if (user?.role !== 'PLATFORM_ADMIN') {
            toast.error("Access Denied", {
                description: "You don't have permission to access the platform admin dashboard.",
            });
            router.push("/"); // Redirect to home page
            return;
        }
    }, [isAuthenticated, user, router]);

    // Show loading or nothing while checking authentication
    if (!isAuthenticated || user?.role !== 'PLATFORM_ADMIN') {
        return null;
    }

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/platform-admin" },
        { icon: Store, label: "Pharmacies", href: "/platform-admin/stores" },
        { icon: Users, label: "Users", href: "/platform-admin/users" },
        { icon: ShoppingBag, label: "Orders", href: "/platform-admin/orders" },
        { icon: CreditCard, label: "Financials", href: "/platform-admin/payments" },
        { icon: Settings, label: "Settings", href: "/platform-admin/settings" },
    ];

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: sidebarOpen ? 280 : 90 }}
                className="bg-slate-900 text-slate-300 flex flex-col m-4 rounded-[2.5rem] shadow-2xl z-20 shrink-0 overflow-hidden"
            >
                {/* Brand */}
                <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
                            <span className="font-black text-lg">A</span>
                        </div>
                        {sidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="overflow-hidden whitespace-nowrap"
                            >
                                <span className="text-lg font-black text-white block leading-none">Platform Admin</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MedSetu Control</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-4 py-6 overflow-y-auto">
                    <div className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <div className={`flex items-center rounded-2xl transition-all group ${sidebarOpen ? 'gap-4 p-4' : 'justify-center p-3'
                                        } ${isActive
                                            ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/30 font-black"
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
                        <div className={`flex items-center ${sidebarOpen ? 'gap-3 mb-4' : 'justify-center'} relative z-10`}>
                            <Avatar className="h-10 w-10 shrink-0">
                                <AvatarFallback className="bg-indigo-500 text-white font-bold">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                </AvatarFallback>
                            </Avatar>
                            {sidebarOpen && (
                                <div className="overflow-hidden">
                                    <p className="text-sm font-black text-white truncate">{user?.name || 'Platform Admin'}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Super Admin</p>
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
                                    router.push('/login');
                                }}
                            >
                                <LogOut size={16} /> Logout
                            </Button>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Header */}
                <header className="h-24 px-8 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm border-b border-slate-100">
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
                                placeholder="Search users, stores, orders..."
                                className="pl-10 h-11 bg-white border-none rounded-xl focus-visible:ring-indigo-500/20 shadow-sm"
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

                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}