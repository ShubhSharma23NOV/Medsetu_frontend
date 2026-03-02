"use client";

import { Button } from "@/components/ui/button";
import {
    HeartPulse,
    Leaf,
    Sparkles,
    Zap,
    ArrowRight,
    Star,
    ShoppingCart,
    ShieldCheck,
    Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart-store";
import { motion } from "framer-motion";

const WELLNESS_PRODUCTS = [
    {
        id: "well_1",
        name: "Pure Omega-3 Fish Oil",
        brand: "BioHealth",
        category: "Supplements",
        price: 999,
        rating: 4.8,
        reviews: 1240,
        image: "🐟",
        benefit: "Heart Health"
    },
    {
        id: "well_2",
        name: "Plant-Based Protein",
        brand: "GreenFuel",
        category: "Nutrition",
        price: 2499,
        rating: 4.9,
        reviews: 890,
        image: "🌿",
        benefit: "Muscle Gain"
    },
    {
        id: "well_3",
        name: "Vitamin C + Zinc Serum",
        brand: "GlowClinique",
        category: "Skin Care",
        price: 799,
        rating: 4.7,
        reviews: 560,
        image: "✨",
        benefit: "Immunity"
    },
    {
        id: "well_4",
        name: "Daily Multi-Vitamin (Women)",
        brand: "Vitality",
        category: "Supplements",
        price: 549,
        rating: 4.6,
        reviews: 2100,
        image: "💊",
        benefit: "Energy"
    }
];

export default function WellnessPage() {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (product: any) => {
        addItem({
            ...product,
            description: `Premium ${product.category} for ${product.benefit}.`,
            stock: 100,
            requiresPrescription: false
        });
        toast.success(`${product.name} added to cart`, {
            description: "Added to your wellness bundle.",
            position: "bottom-right",
        });
    };

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
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center overflow-hidden bg-slate-900 perspective-1000">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent" />

                <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-black uppercase tracking-widest border border-teal-500/20"
                        >
                            <Leaf size={14} /> Sehat Aur Wellness
                        </motion.div>
                        <h1 className="text-6xl font-black text-white tracking-tighter leading-tight">
                            Start Your <br />
                            <span className="text-teal-400 italic">Wellness Journey.</span>
                        </h1>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-md">
                            Best quality vitamins and ayurvedic products for specific Indian health needs.
                        </p>
                        <div className="flex gap-4">
                            <Button size="lg" className="h-14 rounded-2xl px-8 font-black bg-teal-500 hover:bg-teal-600 shadow-xl shadow-teal-500/20 group transition-all hover:scale-105 active:scale-95">
                                Explore Products <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, rotateY: 30 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hidden lg:grid grid-cols-2 gap-6 relative"
                    >
                        <div className="space-y-6 pt-12">
                            <motion.div
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="h-48 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center space-y-3 backdrop-blur-sm cursor-pointer"
                            >
                                <Zap className="text-teal-400" size={32} />
                                <p className="text-white font-black text-sm uppercase tracking-widest">Boost Energy</p>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="h-48 bg-teal-500 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center space-y-3 shadow-2xl shadow-teal-500/20 cursor-pointer"
                            >
                                <HeartPulse className="text-white" size={32} />
                                <p className="text-white font-black text-sm uppercase tracking-widest">Healthy Heart</p>
                            </motion.div>
                        </div>
                        <div className="space-y-6">
                            <motion.div
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="h-48 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center space-y-3 backdrop-blur-sm cursor-pointer"
                            >
                                <ShieldCheck className="text-teal-400" size={32} />
                                <p className="text-white font-black text-sm uppercase tracking-widest">Immunity</p>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="h-48 bg-white rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center space-y-3 shadow-xl cursor-pointer"
                            >
                                <Sparkles className="text-teal-500" size={32} />
                                <p className="text-slate-900 font-black text-sm uppercase tracking-widest">Glowing Skin</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Product Section */}
            <section className="py-24 container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Premium Supplements</h2>
                        <p className="text-slate-500 font-medium font-inter max-w-lg">
                            Lab-tested products for proper nutrition and care.
                        </p>
                    </div>

                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Find vitamins..."
                            className="h-14 bg-white border-none rounded-2xl pl-10 px-6 shadow-sm focus-visible:ring-1 focus-visible:ring-teal-500/20 transition-all hover:shadow-md"
                        />
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {WELLNESS_PRODUCTS.map((prod) => (
                        <motion.div
                            key={prod.id}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all"
                        >
                            <div className="h-48 rounded-[2rem] bg-slate-50 mb-6 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-50 via-transparent to-transparent">
                                {prod.image}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-teal-600 tracking-widest">{prod.category}</p>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{prod.name}</h3>
                                    </div>
                                </div>

                                <p className="text-slate-400 text-sm font-medium italic">by {prod.brand}</p>

                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < Math.floor(prod.rating) ? "fill-teal-400 text-teal-400" : "text-slate-200"} />
                                    ))}
                                    <span className="text-xs font-black text-slate-400 ml-1">{prod.reviews} users</span>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-2xl font-black text-slate-900">₹{prod.price}</span>
                                    <Button
                                        size="icon"
                                        className="h-12 w-12 rounded-xl bg-slate-900 hover:bg-teal-500 shadow-xl shadow-slate-200 transition-all active:scale-95"
                                        onClick={() => handleAddToCart(prod)}
                                    >
                                        <ShoppingCart size={20} />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="pb-24 container mx-auto px-6">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-teal-500 rounded-[3.5rem] p-16 text-center text-white space-y-8 shadow-2xl shadow-teal-500/30 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-bl-full" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-tr-full" />

                    <div className="space-y-4 max-w-2xl mx-auto relative z-10">
                        <h2 className="text-4xl font-black tracking-tighter">Sabse Pehle Sehat</h2>
                        <p className="text-teal-50 font-medium text-lg italic leading-relaxed">
                            Need help choosing? Our wellness experts are here to guide you.
                        </p>
                    </div>

                    <Button variant="secondary" size="lg" className="h-16 px-12 rounded-2xl text-lg font-black bg-white text-teal-600 hover:bg-teal-50 relative z-10 shadow-xl transition-all hover:scale-105 active:scale-95" asChild>
                        <Link href="/prescriptions">Chat with Expert</Link>
                    </Button>
                </motion.div>
            </section>
        </div>
    );
}
