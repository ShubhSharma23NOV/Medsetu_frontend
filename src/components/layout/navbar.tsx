"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Pill, ShoppingCart, User, Menu, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { useCartSync } from "@/hooks/use-cart-sync";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const itemCount = useCartStore((state) => state.getItemCount());
    const { user, isAuthenticated, isInitialized, logout, initialize } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Sync cart with authentication
    useCartSync();

    useEffect(() => {
        setMounted(true);

        // Initialize auth store on mount
        if (!isInitialized) {
            initialize();
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isInitialized, initialize]);

    // Log auth state changes for debugging
    useEffect(() => {
        // Remove this useEffect as it's only for debugging
    }, [mounted, isInitialized, isAuthenticated, user]);

    const handleLogout = () => {
        logout();
        // Force page reload to ensure clean state
        setTimeout(() => {
            window.location.href = "/";
        }, 100);
    };

    if (pathname?.startsWith("/admin") || pathname?.startsWith("/platform-admin") || pathname?.startsWith("/store-application")) return null;

    // Don't render until mounted and initialized
    if (!mounted || !isInitialized) {
        return (
            <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-16 flex items-center">
                <nav className="w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Pill className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                            Med<span className="text-primary font-bold">Setu</span>
                        </span>
                    </div>
                </nav>
            </div>
        );
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-16 flex flex-col justify-center">
            <nav className="w-full max-w-7xl mx-auto px-4 md:px-8">
                {/* 2-Column Grid - Logo and Actions */}
                <div className="flex items-center justify-between w-full">

                    {/* Left Section: Logo */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 group shrink-0">
                            <Pill className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                                Med<span className="text-primary font-bold">Setu</span>
                            </span>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-6 ml-4">
                            <Link href="/medicines" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors whitespace-nowrap">
                                Medicines
                            </Link>
                            <Link href="/prescriptions" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors whitespace-nowrap">
                                Prescriptions
                            </Link>
                            <Link href="/wellness" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors whitespace-nowrap">
                                Wellness
                            </Link>
                        </div>
                    </div>

                    {/* Right Section: Actions */}
                    <div className="flex items-center justify-end gap-1 md:gap-3">
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="h-10 w-10 md:h-11 md:w-11 rounded-full relative hover:bg-slate-100" asChild>
                                <Link href="/cart">
                                    <ShoppingCart className="h-5 w-5 text-slate-600" />
                                    {mounted && itemCount > 0 && (
                                        <span className="absolute top-1 right-1 md:top-2 md:right-2 h-4 w-4 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center animate-in zoom-in border-2 border-white">
                                            {itemCount}
                                        </span>
                                    )}
                                </Link>
                            </Button>

                            {/* Profile Icon - Conditional based on auth status */}
                            {isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 md:h-11 md:w-11 rounded-full hover:bg-slate-100">
                                            <Avatar className="h-8 w-8 md:h-9 md:w-9">
                                                <AvatarImage src={user?.avatar || undefined} />
                                                <AvatarFallback className="bg-primary text-white text-sm font-bold">
                                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user?.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        {/* Role-based navigation */}
                                        {user?.role === 'STORE' && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin" className="cursor-pointer">
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    <span>Store Dashboard</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}

                                        {user?.role === 'PLATFORM_ADMIN' && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/platform-admin" className="cursor-pointer">
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    <span>Platform Admin</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}

                                        {user?.role === 'USER' && (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/profile" className="cursor-pointer">
                                                        <User className="mr-2 h-4 w-4" />
                                                        <span>My Profile</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/orders" className="cursor-pointer">
                                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                                        <span>My Orders</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/prescriptions" className="cursor-pointer">
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        <span>My Prescriptions</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}

                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button variant="ghost" size="icon" className="h-10 w-10 md:h-11 md:w-11 rounded-full hover:bg-slate-100" asChild>
                                    <Link href="/login">
                                        <User className="h-5 w-5 text-slate-600" />
                                    </Link>
                                </Button>
                            )}
                        </div>


                        <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 rounded-full hover:bg-slate-100">
                            <Menu className="h-5 w-5 text-slate-600" />
                        </Button>
                    </div>
                </div>
            </nav>
        </div>
    );
}
