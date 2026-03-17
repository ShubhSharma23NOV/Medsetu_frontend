"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, ShoppingCart, Star, Loader2, Pill, Syringe, Heart, Activity, Tablets, Droplet, Smile, Wind, Users, UserCircle, Snowflake } from "lucide-react";
import { useMedicines } from "@/hooks/use-medicines";
import { Category } from "@/types";
import { useCartStore } from "@/lib/cart-store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function MedicinesPage() {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState<Category | "All">("All");
    const [healthCondition, setHealthCondition] = useState<string>("");

    // Get health condition from URL
    useEffect(() => {
        const condition = searchParams.get('healthCondition');
        if (condition) {
            setHealthCondition(condition);
        }
    }, [searchParams]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [search]);

    const { data: medicines, isLoading, isError } = useMedicines(debouncedSearch, category === "All" ? undefined : category);
    const addItem = useCartStore((state) => state.addItem);

    // Filter by health condition if set
    const filteredMedicines = healthCondition 
        ? medicines?.filter(med => med.healthCondition === healthCondition)
        : medicines;

    const categories: (Category | "All")[] = ["All", "Pain Relief", "Antibiotic", "Vitamins", "Digestive", "Allergy", "Cold & Cough", "Diabetes Care"];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100
            }
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="bg-white border-b py-12 relative overflow-hidden">
                {/* Abstract Background Element */}
                <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl" />

                <div className="container mx-auto space-y-8 relative z-10">
                    <div className="space-y-2 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-xs mb-2 tracking-widest uppercase"
                        >
                            Indore's Trusted Store
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            {healthCondition ? healthCondition : "Our Medicine Shop"}
                        </h1>
                        <p className="text-slate-500 font-medium font-inter text-lg">
                            {healthCondition 
                                ? `Find medicines for ${healthCondition.toLowerCase()} at the best prices.`
                                : "Generic, Branded, and Ayurvedic medicines at the best prices in town."
                            }
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative flex-1 group"
                        >
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search by name, brand, or salt..."
                                className="pl-12 h-14 bg-slate-50 border-none rounded-2xl text-lg focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-sm hover:shadow-md"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </motion.div>
                        {healthCondition && (
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide"
                            >
                                {categories.map((cat, i) => (
                                    <Button
                                        key={cat}
                                        variant={category === cat ? "default" : "outline"}
                                        className={`rounded-2xl px-6 h-14 font-bold shrink-0 transition-all ${category === cat ? 'shadow-lg shadow-primary/25' : 'hover:bg-slate-50'}`}
                                        onClick={() => setCategory(cat)}
                                    >
                                        {cat}
                                    </Button>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Browse by Health Conditions */}
            <div className="bg-slate-50 py-12 border-b">
                <div className="container mx-auto">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Browse by Health Conditions</h2>
                        <p className="text-slate-500 font-medium">Find medicines for your specific health needs.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { name: "Diabetes Care", icon: Syringe, color: "bg-blue-50 hover:bg-blue-100 border-blue-200", iconColor: "text-blue-600" },
                            { name: "Cardiac Care", icon: Heart, color: "bg-red-50 hover:bg-red-100 border-red-200", iconColor: "text-red-600" },
                            { name: "Stomach Care", icon: Activity, color: "bg-orange-50 hover:bg-orange-100 border-orange-200", iconColor: "text-orange-600" },
                            { name: "Pain Relief", icon: Tablets, color: "bg-purple-50 hover:bg-purple-100 border-purple-200", iconColor: "text-purple-600" },
                            { name: "Liver Care", icon: Droplet, color: "bg-amber-50 hover:bg-amber-100 border-amber-200", iconColor: "text-amber-600" },
                            { name: "Oral Care", icon: Smile, color: "bg-teal-50 hover:bg-teal-100 border-teal-200", iconColor: "text-teal-600" },
                            { name: "Respiratory", icon: Wind, color: "bg-cyan-50 hover:bg-cyan-100 border-cyan-200", iconColor: "text-cyan-600" },
                            { name: "Sexual Health", icon: Users, color: "bg-pink-50 hover:bg-pink-100 border-pink-200", iconColor: "text-pink-600" },
                            { name: "Elderly Care", icon: UserCircle, color: "bg-slate-50 hover:bg-slate-100 border-slate-200", iconColor: "text-slate-600" },
                            { name: "Cold & Immunity", icon: Snowflake, color: "bg-green-50 hover:bg-green-100 border-green-200", iconColor: "text-green-600" },
                        ].map((condition, i) => {
                            const IconComponent = condition.icon;
                            return (
                                <motion.button
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setHealthCondition(healthCondition === condition.name ? "" : condition.name)}
                                    className={`p-4 rounded-2xl border-2 ${
                                        healthCondition === condition.name 
                                            ? 'border-primary bg-primary/10' 
                                            : condition.color
                                    } transition-all group`}
                                >
                                    <div className="flex flex-col items-center text-center gap-2">
                                        <div className={`h-10 w-10 rounded-xl ${
                                            healthCondition === condition.name 
                                                ? 'bg-primary/20' 
                                                : 'bg-white'
                                        } flex items-center justify-center`}>
                                            <IconComponent className={`h-5 w-5 ${
                                                healthCondition === condition.name 
                                                    ? 'text-primary' 
                                                    : condition.iconColor
                                            }`} />
                                        </div>
                                        <h3 className={`text-xs font-bold ${
                                            healthCondition === condition.name 
                                                ? 'text-primary' 
                                                : 'text-slate-900 group-hover:text-primary'
                                        } transition-colors`}>
                                            {condition.name}
                                        </h3>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-12 px-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-sm">
                            {category === "All" ? "Loading All Medicines..." : `Loading ${category}...`}
                        </p>
                    </div>
                ) : isError ? (
                    <div className="text-center py-32 space-y-4">
                        <p className="text-red-500 font-bold">Unable to load medicines right now.</p>
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                ) : filteredMedicines?.length === 0 ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-32 space-y-2"
                    >
                        <p className="text-2xl font-black text-slate-900">No medicines found.</p>
                        <p className="text-slate-500 font-medium">
                            {healthCondition 
                                ? `No medicines available for ${healthCondition}. Try browsing other categories.`
                                : "Try searching for something else, or call our support."
                            }
                        </p>
                        {healthCondition && (
                            <Button onClick={() => window.location.href = '/medicines'} className="mt-4">
                                View All Medicines
                            </Button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {filteredMedicines?.map((med) => (
                            <motion.div
                                key={med.id}
                                variants={itemVariants}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="group bg-white rounded-xl border border-slate-200 hover:border-primary/50 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full"
                            >
                                {/* Medicine Icon */}
                                <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-teal-50 relative flex items-center justify-center border-b border-slate-100">
                                    <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center text-primary shadow-md transition-transform group-hover:scale-110 group-hover:rotate-6">
                                        <Pill size={40} strokeWidth={2.5} />
                                    </div>
                                    {med.rxRequired && (
                                        <div className="absolute top-3 right-3 bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                            Rx Required
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-grow gap-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                                                {med.category || 'Medicine'}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 line-clamp-2" title={med.name}>{med.name}</h3>
                                            <p className="text-sm text-slate-500 font-medium">{med.brand || 'Generic'}</p>
                                        </div>
                                        {med.rating && med.rating > 0 && (
                                            <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100 shrink-0">
                                                <Star size={12} fill="currentColor" />
                                                <span className="text-xs font-bold text-yellow-700">{med.rating.toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 font-medium line-through">₹{(med.price * 1.2).toFixed(0)}</span>
                                            <span className="text-xl font-bold text-slate-900">₹{med.price.toFixed(0)}</span>
                                        </div>
                                        {med.inStock ? (
                                            <Button
                                                size="icon"
                                                className="h-10 w-10 shrink-0 rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addItem({
                                                        ...med,
                                                        id: med.id.toString(),
                                                        brand: med.brand || 'Generic',
                                                        category: med.category || 'Medicine',
                                                        description: med.description || '',
                                                        rating: med.rating || 0,
                                                        stock: med.stock || 0,
                                                        rxRequired: med.rxRequired,
                                                        requiresPrescription: med.rxRequired
                                                    });
                                                    toast.success(`${med.name} added to cart`, {
                                                        description: "Added to your basket.",
                                                        position: "bottom-right",
                                                    });
                                                }}
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Badge variant="secondary" className="text-[10px] uppercase font-bold shrink-0">
                                                Out of Stock
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
