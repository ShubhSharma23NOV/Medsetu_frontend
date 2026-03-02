"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Trash2, Plus, Minus, Pill, User } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { PrescriptionRequiredModal } from "@/components/modals/prescription-required-modal";
import { useState } from "react";

export default function CartPage() {
    return (
        <RoleGuard allowedRoles={['USER']}>
            <CartContent />
        </RoleGuard>
    );
}

function CartContent() {
    const { items, removeItem, updateQuantity, getTotalPrice, getItemCount, prescriptionId, setPrescriptionId } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [deliveryPincode, setDeliveryPincode] = useState("");
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [pincodeConfirmed, setPincodeConfirmed] = useState(false);
    
    const totalPrice = getTotalPrice();
    const itemCount = getItemCount();
    
    // Get Rx medicines in cart
    const rxMedicines = items.filter(item => item.rxRequired);
    const hasRxMedicines = rxMedicines.length > 0;

    const handleCheckout = () => {
        if (!isAuthenticated) {
            toast.error("Login Required", {
                description: "Please login to place your order.",
            });
            router.push("/login");
            return;
        }

        // Step 1: Check delivery pincode
        if (!pincodeConfirmed) {
            toast.error("Delivery Address Required", {
                description: "Please enter and confirm your delivery pincode first."
            });
            return;
        }

        // Step 2: Check for Rx medicines and prescription
        if (hasRxMedicines && !prescriptionId) {
            setShowPrescriptionModal(true);
            return;
        }

        // Step 3: Proceed with checkout
        router.push(`/checkout?pincode=${deliveryPincode}`);
    };

    const handlePrescriptionUploaded = (uploadedPrescriptionId: string) => {
        if (!uploadedPrescriptionId) {
            toast.error("Upload Failed", {
                description: "Prescription ID not received. Please try again."
            });
            return;
        }
        
        setPrescriptionId(uploadedPrescriptionId);
        toast.success("Prescription uploaded successfully!", {
            description: "You can now proceed to checkout."
        });
        setShowPrescriptionModal(false);
    };

    const handlePincodeSubmit = () => {
        if (!deliveryPincode) {
            toast.error("Please enter pincode");
            return;
        }
        
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(deliveryPincode)) {
            toast.error("Invalid Pincode", {
                description: "Please enter a valid 6-digit pincode."
            });
            return;
        }
        
        setPincodeConfirmed(true);
        toast.success("Pincode confirmed!", {
            description: "Now you can proceed with your order."
        });
    };

    if (items.length === 0) {
        return (
            <div className="bg-slate-50 min-h-screen py-12">
                <div className="container mx-auto max-w-4xl space-y-8 px-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Registry</h1>
                            <p className="text-slate-500 font-medium">Review your health supplies before payment.</p>
                        </div>
                        <Button variant="ghost" asChild className="text-slate-500 font-bold">
                            <Link href="/medicines" className="flex gap-2">
                                <ArrowLeft className="h-4 w-4" /> Go Back
                            </Link>
                        </Button>
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-10 py-32 rounded-[3.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 text-center px-12"
                    >
                        <div className="relative">
                            <div className="h-32 w-32 rounded-[2.5rem] bg-slate-50 flex items-center justify-center relative z-10 transition-transform hover:scale-105">
                                <ShoppingBag className="h-16 w-16 text-slate-200" />
                            </div>
                            <div className="absolute -bottom-4 -right-4 h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 z-20 animate-bounce">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="space-y-3 max-w-sm">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your cart is empty!</h3>
                            <p className="text-slate-500 font-medium italic">
                                Looks like you haven't selected anything yet. Browse our Indore store for best offers.
                            </p>
                        </div>

                        <Button size="lg" className="h-16 px-12 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 group transition-all hover:scale-105 active:scale-95" asChild>
                            <Link href="/medicines">
                                Explore Medicines <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto max-w-6xl space-y-8 px-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Registry</h1>
                        <p className="text-slate-500 font-medium font-inter">Total items: {itemCount}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence>
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all font-inter"
                                >
                                    <div className="h-24 w-24 rounded-2xl bg-slate-50 flex items-center justify-center text-primary shrink-0 transition-transform hover:scale-110 hover:rotate-6">
                                        <Pill size={32} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 truncate">{item.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block">
                                                        {item.category}
                                                    </p>
                                                    {item.rxRequired && (
                                                        <p className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded-full inline-block border border-red-200">
                                                            Rx Required
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                onClick={() => removeItem(item.id.toString())}
                                            >
                                                <Trash2 size={20} />
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 px-2 border border-slate-100">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg hover:bg-white transition-all"
                                                    onClick={() => updateQuantity(item.id.toString(), item.quantity - 1)}
                                                >
                                                    <Minus size={14} />
                                                </Button>
                                                <span className="text-lg font-black text-slate-900 w-8 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg hover:bg-white transition-all"
                                                    onClick={() => updateQuantity(item.id.toString(), item.quantity + 1)}
                                                >
                                                    <Plus size={14} />
                                                </Button>
                                            </div>
                                            <span className="text-xl font-black text-slate-900 font-inter">₹{(item.price * item.quantity).toFixed(0)}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Checkout Summary */}
                    <div className="space-y-6">
                        {/* Delivery Pincode Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[2.5rem] p-8 space-y-6 shadow-xl border border-slate-200"
                        >
                            <h3 className="text-xl font-black tracking-tight">Delivery Location</h3>
                            
                            <div className="space-y-4">
                                {pincodeConfirmed ? (
                                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <div>
                                            <p className="text-sm font-bold text-green-900">Pincode: {deliveryPincode}</p>
                                            <p className="text-xs text-green-700">Delivery available</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setPincodeConfirmed(false);
                                                setDeliveryPincode("");
                                            }}
                                            className="text-xs font-bold text-green-700 hover:text-green-800"
                                        >
                                            Change
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-slate-600">Enter your pincode to check delivery availability</p>
                                        <div className="flex gap-2">
                                            <Input
                                                key="pincode-input"
                                                type="tel"
                                                placeholder="452001"
                                                value={deliveryPincode}
                                                onChange={(e) => {
                                                    const input = e.target.value;
                                                    const cleaned = input.replace(/\D/g, '');
                                                    if (cleaned.length <= 6) {
                                                        setDeliveryPincode(cleaned);
                                                    }
                                                }}
                                                autoComplete="off"
                                                className="flex-1 h-12 rounded-xl text-lg"
                                            />
                                            <Button 
                                                onClick={handlePincodeSubmit}
                                                disabled={deliveryPincode.length !== 6}
                                                className="h-12 px-6 rounded-xl font-bold"
                                            >
                                                Check
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Payment Details */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-slate-900 text-white rounded-[2.5rem] p-10 space-y-8 shadow-2xl shadow-slate-900/20 sticky top-32"
                        >
                            <h3 className="text-2xl font-black tracking-tight border-b border-white/10 pb-6 italic">Payment Details</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between text-slate-400 font-medium font-inter">
                                    <span>Subtotal</span>
                                    <span className="text-white font-black">₹{totalPrice.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 font-medium font-inter">
                                    <span>Delivery Fee</span>
                                    {totalPrice >= 350 ? (
                                        <span className="text-green-400 font-black">FREE</span>
                                    ) : (
                                        <span className="text-white font-black">₹35</span>
                                    )}
                                </div>
                                {totalPrice < 350 && (
                                    <p className="text-xs text-slate-500 italic">
                                        Add ₹{(350 - totalPrice).toFixed(0)} more for free delivery
                                    </p>
                                )}
                                <div className="flex justify-between text-slate-400 font-medium font-inter">
                                    <span>Taxes (GST)</span>
                                    <span className="text-white font-black">₹{(totalPrice * 0.18).toFixed(0)}</span>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black uppercase tracking-widest text-primary">Total to Pay</p>
                                        <p className="text-4xl font-black">₹{(totalPrice + (totalPrice >= 350 ? 0 : 35) + (totalPrice * 0.18)).toFixed(0)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Button 
                                    onClick={handleCheckout}
                                    className="w-full h-16 rounded-2xl text-lg font-black bg-white text-slate-900 hover:bg-slate-100 shadow-xl group transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {!isAuthenticated ? (
                                        <>Login to Order <User className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                                    ) : !pincodeConfirmed ? (
                                        <>Enter Pincode <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                                    ) : hasRxMedicines && !prescriptionId ? (
                                        <>Upload Prescription <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                                    ) : (
                                        <>Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </Button>
                                
                                {/* Show prescription status if Rx medicines present */}
                                {hasRxMedicines && prescriptionId && (
                                    <div className="flex items-center justify-between gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-green-600" />
                                            <span className="text-xs font-bold text-green-700">Prescription Uploaded</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setPrescriptionId(null);
                                                setShowPrescriptionModal(true);
                                            }}
                                            className="text-xs font-bold text-green-700 hover:text-green-800 h-7"
                                        >
                                            Change
                                        </Button>
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest text-center">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    {!isAuthenticated ? "Login Required for Checkout" : 
                                     !pincodeConfirmed ? "Enter Delivery Pincode First" :
                                     hasRxMedicines && !prescriptionId ? "Prescription Required for Rx Medicines" :
                                     "Ready for Checkout"}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="p-8 rounded-[2rem] bg-teal-50 border border-teal-100 space-y-4"
                        >
                            <div className="flex items-center gap-3 text-teal-700">
                                <Pill size={20} className="shrink-0" />
                                <p className="text-sm font-bold">Pharmacist Check</p>
                            </div>
                            <p className="text-xs text-teal-600 font-medium leading-relaxed">
                                Our team will verify any prescription items before dispatch. We may call you for confirmation.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
            
            {/* Prescription Required Modal */}
            <PrescriptionRequiredModal
                isOpen={showPrescriptionModal}
                onClose={() => setShowPrescriptionModal(false)}
                onPrescriptionUploaded={handlePrescriptionUploaded}
                rxMedicines={rxMedicines}
                pincode={deliveryPincode}
            />
        </div>
    );
}
