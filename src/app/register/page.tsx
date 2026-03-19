"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Pill, ShieldCheck, Activity, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { authService } from "@/lib/auth-service";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE_URL } from "@/lib/api-config";

const customerSchema = z.object({
    name: z.string().min(2, "Full name is required."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

const storeSchema = z.object({
    name: z.string().min(2, "Owner name is required."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    storeName: z.string().min(2, "Store name is required."),
    storePhone: z.string().min(10, "Valid phone number is required."),
    licenseNumber: z.string().min(5, "License number is required."),
    storeStreet: z.string().min(5, "Street address is required."),
    storeCity: z.string().min(2, "City is required."),
    storeState: z.string().min(2, "State is required."),
    storePincode: z.string().length(6, "Pincode must be 6 digits."),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

type CustomerFormValues = z.infer<typeof customerSchema>;
type StoreFormValues = z.infer<typeof storeSchema>;
type RegisterFormValues = CustomerFormValues | StoreFormValues;

export default function RegisterPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [role, setRole] = useState("USER");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<any>({
        resolver: zodResolver(role === "USER" ? customerSchema : storeSchema),
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            // Map frontend role to database role
            let dbRole = "USER"; // Default
            if (role === "USER") {
                dbRole = "USER";        // Customer
            } else if (role === "ADMIN") {
                dbRole = "STORE";       // Medical Store/Pharmacy Partner
            }

            const response = await authService.register(data.name, data.email, data.password, dbRole);

            // Check if response has the expected structure
            if (!response.user || !response.token) {
                throw new Error("Invalid response format from server");
            }

            login(response.user, response.token);

            // If store registration, submit store application immediately
            if (role === "ADMIN" && response.user.role === 'STORE') {
                try {
                    const fullAddress = `${data.storeStreet}, ${data.storeCity}, ${data.storeState} - ${data.storePincode}`;
                    
                    const storeResponse = await fetch(`${API_BASE_URL}/store-application/submit`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${response.token}`,
                        },
                        body: JSON.stringify({
                            storeName: data.storeName,
                            storeAddress: fullAddress,
                            storePhone: data.storePhone,
                            licenseNumber: data.licenseNumber,
                            ownerName: data.name,
                        }),
                    });

                    if (!storeResponse.ok) {
                        throw new Error('Failed to submit store application');
                    }

                    toast.success("Store Application Submitted!", {
                        description: "Your application is under review. We'll notify you via email.",
                    });
                    router.push("/admin");
                } catch (storeError) {
                    toast.error("Store Application Failed", {
                        description: "Account created but store application failed. Please try again from your dashboard.",
                    });
                    router.push("/admin");
                }
            } else {
                toast.success("Account Created!", {
                    description: `Swagat hai, ${response.user.name}. You are now a MedSetu member.`,
                });
                
                // Redirect based on user role
                if (response.user.role === 'PLATFORM_ADMIN') {
                    router.push("/platform-admin");
                } else {
                    router.push("/");
                }
            }
        } catch (error) {
            // More detailed error handling
            let errorMessage = "Something went wrong. Please check your details.";

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                } else if (axiosError.response?.status) {
                    errorMessage = `Server error: ${axiosError.response.status}`;
                }
            }

            toast.error("Sign Up Failed", {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex items-center justify-center p-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-primary to-teal-500" />

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-[700px]">

                {/* Visual Side */}
                <div
                    className="hidden lg:flex relative bg-slate-900 p-16 flex-col justify-between overflow-hidden order-last"
                >
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
                    </div>

                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <Image src="/medsetu-logo.jpeg" alt="MedSetu Logo" width={32} height={32} className="rounded-lg" />
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Med<span className="text-primary font-bold">Setu</span>
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <h1 className="text-4xl font-bold text-white leading-tight placeholder-slate-900 tracking-tight">
                            Create Your <br />
                            <span className="text-primary">Account</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-sm">
                            Register to access your personalized medical dashboard.
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-800">
                            <div className="space-y-1">
                                <div className="text-2xl font-bold text-white">Secure</div>
                                <div className="text-sm font-medium text-slate-500">ISO 27001 Certified</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold text-white">Fast</div>
                                <div className="text-sm font-medium text-slate-500">Quick Registration</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-slate-50">
                    <div className="w-full max-w-md mx-auto space-y-8">
                        <div className="space-y-2 text-center lg:text-left">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign Up</h2>
                            <p className="text-slate-500 font-medium">Create a new account to get started.</p>
                        </div>

                        <Tabs defaultValue="USER" onValueChange={setRole} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl bg-slate-200/50 p-1 border border-slate-200">
                                <TabsTrigger value="USER" className="rounded-lg h-full font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
                                    Customer
                                </TabsTrigger>
                                <TabsTrigger value="ADMIN" className="rounded-lg h-full font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all">
                                    Pharmacy Partner
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">
                                    {role === "ADMIN" ? "Owner Name" : "Full Name"}
                                </label>
                                <Input
                                    placeholder={role === "ADMIN" ? "e.g. Rahul Verma" : "e.g. Rahul Verma"}
                                    className="h-12 bg-white border-slate-200 rounded-xl px-4 text-base focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-sm"
                                    {...register("name")}
                                />
                                {errors.name && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1"><AlertCircle size={10} /> {errors.name.message as string}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="h-12 bg-white border-slate-200 rounded-xl px-4 text-base focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-sm"
                                    {...register("email")}
                                />
                                {errors.email && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1"><AlertCircle size={10} /> {errors.email.message as string}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Password</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-12 bg-white border-slate-200 rounded-xl px-4 text-base focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-sm"
                                        {...register("password")}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Confirm</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-12 bg-white border-slate-200 rounded-xl px-4 text-base focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-sm"
                                        {...register("confirmPassword")}
                                    />
                                </div>
                                {(errors.password || errors.confirmPassword) && (
                                    <div className="col-span-2">
                                        <p className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1">
                                            <AlertCircle size={10} /> {(errors.password?.message || errors.confirmPassword?.message) as string}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Store-specific fields */}
                            {role === "ADMIN" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-5 pt-4 border-t border-slate-200"
                                >
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Store Name</label>
                                        <Input
                                            placeholder="e.g. Apollo Pharmacy"
                                            className="h-12 bg-white border-slate-200 rounded-xl px-4 text-base focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-sm"
                                            {...register("storeName")}
                                        />
                                        {errors.storeName && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1"><AlertCircle size={10} /> {errors.storeName.message as string}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 ml-1">Phone Number</label>
                                            <Input
                                                placeholder="+91 98765 43210"
                                                className="h-12 bg-white border-slate-200 rounded-xl px-4 text-base focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-sm"
                                                {...register("storePhone")}
                                            />
                                            {errors.storePhone && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1"><AlertCircle size={10} /> {errors.storePhone.message as string}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 ml-1">License Number</label>
                                            <Input
                                                placeholder="DL-XX-XXXX-XXXXX"
                                                className="h-12 bg-white border-slate-200 rounded-xl px-4 text-base focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-sm"
                                                {...register("licenseNumber")}
                                            />
                                            {errors.licenseNumber && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1"><AlertCircle size={10} /> {errors.licenseNumber.message as string}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Street Address</label>
                                        <Input
                                            placeholder="123 Main Street, Vijay Nagar"
                                            className="h-12 bg-white border-slate-200 rounded-xl px-4 text-base focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-sm"
                                            {...register("storeStreet")}
                                        />
                                        {errors.storeStreet && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1"><AlertCircle size={10} /> {errors.storeStreet.message as string}</p>}
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 ml-1">City</label>
                                            <Input
                                                placeholder="Indore"
                                                className="h-12 bg-white border-slate-200 rounded-xl px-4 text-base focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-sm"
                                                {...register("storeCity")}
                                            />
                                            {errors.storeCity && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1"><AlertCircle size={10} /> {errors.storeCity.message as string}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 ml-1">State</label>
                                            <Input
                                                placeholder="Madhya Pradesh"
                                                className="h-12 bg-white border-slate-200 rounded-xl px-4 text-base focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-sm"
                                                {...register("storeState")}
                                            />
                                            {errors.storeState && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1"><AlertCircle size={10} /> {errors.storeState.message as string}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 ml-1">Pincode</label>
                                            <Input
                                                placeholder="452001"
                                                maxLength={6}
                                                className="h-12 bg-white border-slate-200 rounded-xl px-4 text-base focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-sm"
                                                {...register("storePincode")}
                                            />
                                            {errors.storePincode && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1"><AlertCircle size={10} /> {errors.storePincode.message as string}</p>}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <Button disabled={isSubmitting} size="lg" className="w-full h-12 rounded-xl text-md font-bold shadow-sm transition-all hover:scale-[1.02]">
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2 italic">
                                        <Loader2 className="animate-spin h-5 w-5" /> Processing...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        {role === "ADMIN" ? "Submit Application" : "Create Account"} <ArrowRight className="h-5 w-5" />
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="text-center">
                            <p className="text-slate-500 font-medium text-sm mb-1">Already a member?</p>
                            <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">Log in now</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
