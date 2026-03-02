"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Pill, Loader2, AlertCircle, ArrowRight, User, Store, ShieldAlert } from "lucide-react";
import { authService } from "@/lib/auth-service";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";
import { motion } from "framer-motion";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type UserRole = 'customer' | 'store' | 'admin';

export default function LoginPage() {
    const router = useRouter();
    const { login, logout, isAuthenticated, isInitialized, initialize, user } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [role, setRole] = useState<UserRole>('customer');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    // Clear any existing auth and form data on mount
    useEffect(() => {
        // Initialize auth store
        if (!isInitialized) {
            initialize();
        }

        // If user is already authenticated, redirect them based on role
        if (isInitialized && isAuthenticated) {
            if (user?.role === 'USER') {
                router.push('/');
            } else if (user?.role === 'STORE') {
                router.push('/admin');
            } else if (user?.role === 'PLATFORM_ADMIN') {
                router.push('/platform-admin');
            } else {
                router.push('/');
            }
            return;
        }

        // Clear any stale auth data first
        logout();

        // Reset form to ensure clean state
        reset({
            email: '',
            password: ''
        });

    }, [isAuthenticated, isInitialized, user?.role, router, reset, logout, initialize]);

    const onSubmit = async (data: LoginFormValues) => {
        setIsSubmitting(true);

        try {
            const response = await authService.login(data.email, data.password);

            if (!response.user || !response.token) {
                throw new Error("Invalid response from server");
            }

            // Store auth data
            login(response.user, response.token);

            toast.success("Welcome back!", {
                description: `Logged in as ${response.user.name}`,
            });

            // Redirect based on actual user role from backend (not UI selection)
            const userRole = response.user.role;

            if (userRole === 'USER') {
                router.push('/');
            } else if (userRole === 'STORE') {
                router.push('/admin');
            } else if (userRole === 'PLATFORM_ADMIN') {
                router.push('/platform-admin');
            } else {
                // Fallback
                router.push('/');
            }

        } catch (error) {
            let errorMessage = "Invalid email or password.";

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                } else if (axiosError.response?.status === 401) {
                    errorMessage = "Invalid email or password.";
                } else if (axiosError.response?.status >= 500) {
                    errorMessage = "Server error. Please try again later.";
                }
            }

            toast.error("Login Failed", {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const roles = [
        { id: 'customer', label: 'Customer', icon: User },
        { id: 'store', label: 'Medical Store', icon: Store },
        { id: 'admin', label: 'Admin', icon: ShieldAlert },
    ];

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex items-center justify-center p-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-primary to-teal-500" />

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden min-h-[700px] perspective-1000">
                {/* Visual Side */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:flex relative bg-slate-900 p-16 flex-col justify-between overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl text-primary" />

                    <Link href="/" className="relative z-10 flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white"
                        >
                            <Pill className="h-6 w-6" />
                        </motion.div>
                        <span className="text-2xl font-black tracking-tight text-white">
                            Med<span className="text-primary italic">Setu</span>
                        </span>
                    </Link>

                    <div className="relative z-10 space-y-6">
                        <h2 className="text-5xl font-black text-white leading-tight">
                            Your Health, <br /> Our Priority.
                        </h2>
                        <p className="text-slate-300 text-lg max-w-md">
                            Access a wide range of medicines, connect with trusted pharmacies, and manage your health needs with ease.
                        </p>
                        <div className="flex items-center gap-4">
                            <Button size="lg" className="rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                                Learn More
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-full border-white text-white hover:bg-white hover:text-slate-900 transition-colors">
                                Contact Us
                            </Button>
                        </div>
                    </div>

                    <div className="relative z-10 text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} MedSetu. All rights reserved.
                    </div>
                </motion.div>

                {/* Form Side */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative p-16 flex flex-col justify-center"
                >
                            <h1 className="text-4xl font-black text-slate-900 mb-4">Welcome Back!</h1>
                            <p className="text-slate-600 mb-8">
                                Please select your role and enter your credentials to continue.
                            </p>

                            <div className="mb-8">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 mb-3 block">Login As</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {roles.map((r) => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => setRole(r.id as UserRole)}
                                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${role === r.id
                                                ? "border-primary bg-primary/5 text-primary shadow-md"
                                                : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100"
                                                }`}
                                        >
                                            <r.icon className={`h-4 w-4 mb-1 ${role === r.id ? "text-primary" : ""}`} />
                                            <span className="text-xs">{r.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 text-center mt-4">
                                    Your account role determines which dashboard you'll access after login.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email address"
                                        autoComplete="email"
                                        className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-lg focus-visible:ring-1 focus-visible:ring-primary/20 transition-all hover:bg-slate-100"
                                        {...register("email")}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1 ml-1"><AlertCircle size={12} /> {errors.email.message as string}</p>}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Password</label>
                                        <button type="button" className="text-[10px] font-black uppercase text-primary tracking-tighter hover:underline">Forgot Password?</button>
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-lg focus-visible:ring-1 focus-visible:ring-primary/20 transition-all hover:bg-slate-100"
                                        {...register("password")}
                                    />
                                    {errors.password && <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1 ml-1"><AlertCircle size={12} /> {errors.password.message as string}</p>}
                                </div>
                                <Button disabled={isSubmitting} size="lg" className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 group hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2 italic">
                                            <Loader2 className="animate-spin h-5 w-5" /> Verifying...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Login as {role === 'store' ? 'Partner' : role === 'admin' ? 'Admin' : 'Customer'} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </Button>
                            </form>

                            <div className="text-center pt-4">
                                <p className="text-slate-500 font-medium mb-1">New to MedSetu?</p>
                                <Link href="/register" className="text-primary font-black hover:underline underline-offset-4 decoration-2">Create an Account</Link>
                            </div>
                </motion.div>
            </div>
        </div>
    );
}
