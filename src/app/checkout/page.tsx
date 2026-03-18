"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft, 
    MapPin, 
    Truck, 
    CreditCard, 
    Banknote,
    Clock,
    CheckCircle,
    AlertTriangle,
    Pill,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { useCreateOrder } from "@/hooks/use-orders";
import { usePrescription } from "@/hooks/use-prescriptions";
import { usePricingConfig, useDefaultStore, useBusinessConfig } from "@/hooks/use-config";
import { useAddresses } from "@/hooks/use-addresses";
import { configService } from "@/lib/config";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { 
    initializeRazorpay, 
    createRazorpayOrder, 
    verifyRazorpayPayment,
    handlePaymentFailure,
    getRazorpayKey,
    type RazorpayResponse 
} from "@/lib/razorpay";
import type { Address } from "@/lib/address-service";

export default function CheckoutPage() {
    return (
        <RoleGuard allowedRoles={['USER']}>
            <CheckoutContent />
        </RoleGuard>
    );
}

function CheckoutContent() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart, prescriptionId, hasRxMedicines } = useCartStore();
    const { user } = useAuthStore();
    const createOrderMutation = useCreateOrder();
    
    // Fetch prescription details if prescriptionId exists
    const { data: prescription, isLoading: prescriptionLoading } = usePrescription(
        prescriptionId?.toString() || ""
    );
    
    // Fetch saved addresses
    const { data: savedAddresses, isLoading: addressesLoading } = useAddresses();
    
    // Use configuration
    const pricingConfig = usePricingConfig();
    const businessConfig = useBusinessConfig();

    // Payment processing state
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Address selection state
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [useNewAddress, setUseNewAddress] = useState(false);

    // Only DELIVERY type - no pickup
    const deliveryType = 'DELIVERY';
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'ONLINE'>('CASH');
    const [address, setAddress] = useState({
        street: '',
        city: businessConfig?.address.city || 'Indore',
        state: businessConfig?.address.state || 'Madhya Pradesh',
        pincode: '',
        phone: ''
    });

    const totalPrice = getTotalPrice();
    const deliveryFee = totalPrice >= 350 ? 0 : (pricingConfig?.deliveryFee || 35);
    const tax = totalPrice * (pricingConfig?.taxRate || 0.18);
    const finalAmount = totalPrice + deliveryFee + tax;
    
    // Check if cart has Rx medicines
    const needsPrescription = hasRxMedicines();

    // Handle address selection
    const handleSelectAddress = (addr: Address) => {
        setSelectedAddressId(addr.id);
        setUseNewAddress(false);
        // Pre-fill form with selected address
        setAddress({
            street: addr.addressLine,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            phone: addr.phone
        });
    };

    const handlePlaceOrder = async () => {
        if (!user) {
            toast.error("Please login to place order");
            return;
        }

        // Validate address - either selected or manually entered
        if (!selectedAddressId && !useNewAddress) {
            toast.error("Please select an address or enter a new one");
            return;
        }

        if (useNewAddress && (!address.street || !address.pincode || !address.phone)) {
            toast.error("Please fill all delivery address fields");
            return;
        }
        
        // Validate pincode format (6 digits)
        if (address.pincode) {
            const pincodeRegex = /^\d{6}$/;
            if (!pincodeRegex.test(address.pincode)) {
                toast.error("Invalid Pincode", {
                    description: "Please enter a valid 6-digit pincode."
                });
                return;
            }
        }
        
        // Validate phone format (10 digits)
        if (address.phone) {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(address.phone)) {
                toast.error("Invalid Phone Number", {
                    description: "Please enter a valid 10-digit phone number."
                });
                return;
            }
        }
        
        // Validate prescription for Rx medicines
        if (needsPrescription && !prescriptionId) {
            toast.error("Prescription Required", {
                description: "Please upload a prescription for Rx medicines in your cart."
            });
            router.push("/cart");
            return;
        }

        // OPTION A: Block order if prescription not APPROVED
        if (needsPrescription && prescriptionId) {
            if (!prescription) {
                toast.error("Prescription Not Found", {
                    description: "Unable to verify prescription. Please try again."
                });
                return;
            }
            
            if (prescription.status !== 'APPROVED') {
                toast.error("Prescription Not Approved", {
                    description: `Your prescription is ${prescription.status}. Please wait for approval before placing order.`
                });
                return;
            }
        }

        const fullAddress = `${address.street}, ${address.city}, ${address.state} - ${address.pincode}, Phone: ${address.phone}`;

        try {
            const orderData = {
                customerName: user.name,
                items: items,
                amount: finalAmount,
                address: fullAddress,
                addressId: selectedAddressId || undefined, // Use structured address if selected
                type: 'DELIVERY' as const, // Always delivery
                paymentMethod: 'CASH' as const, // Only CASH for now (Razorpay disabled)
                prescriptionId: prescriptionId || undefined,
                pincode: address.pincode
            };

            const order = await createOrderMutation.mutateAsync(orderData);
            
            // Always Cash on Delivery - Direct success (Razorpay disabled for now)
            toast.success("Order placed successfully!", {
                description: `Order #${order.id} has been created. Pay on delivery.`
            });

            clearCart();
            router.push(`/order-confirmation/${order.id}`);
        } catch (error: any) {
            const errorMessage = error.message || error.response?.data?.message || "Please try again.";
            toast.error("Failed to place order", {
                description: errorMessage
            });
        }
    };

    const handleOnlinePayment = async (orderId: number, amount: number) => {
        setIsProcessingPayment(true);

        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                throw new Error('Authentication required');
            }

            // Create Razorpay order
            const razorpayOrder = await createRazorpayOrder(orderId, amount, token);

            // Initialize Razorpay payment
            await initializeRazorpay({
                key: getRazorpayKey(),
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: businessConfig?.name || 'MedSetu Pharmacy',
                description: `Order #${orderId}`,
                order_id: razorpayOrder.id,
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: address.phone,
                },
                theme: {
                    color: '#0ea5e9', // primary color
                },
                handler: async (response: RazorpayResponse) => {
                    // Payment successful - verify on backend
                    try {
                        const isVerified = await verifyRazorpayPayment(response, token);

                        if (isVerified) {
                            toast.success("Payment successful!", {
                                description: "Your order has been confirmed."
                            });

                            clearCart();
                            router.push(`/order-confirmation/${orderId}`);
                        } else {
                            toast.error("Payment verification failed", {
                                description: "Please contact support."
                            });
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        toast.error("Payment verification failed", {
                            description: "Please contact support with your payment ID."
                        });
                    } finally {
                        setIsProcessingPayment(false);
                    }
                },
                modal: {
                    ondismiss: async () => {
                        // User closed payment modal
                        await handlePaymentFailure(razorpayOrder.id, 'User cancelled payment', token);
                        toast.error("Payment cancelled", {
                            description: "You can retry payment from order details."
                        });
                        setIsProcessingPayment(false);
                    },
                },
            });
        } catch (error: any) {
            console.error('Payment initialization error:', error);
            toast.error("Payment failed", {
                description: error.message || "Unable to initialize payment gateway."
            });
            setIsProcessingPayment(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Pill className="h-16 w-16 text-slate-300 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
                    <p className="text-slate-500">Add some medicines to proceed with checkout</p>
                    <Link href="/medicines">
                        <Button className="mt-4">Browse Medicines</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto py-8 px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="rounded-xl">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Checkout</h1>
                        <p className="text-slate-500">Complete your order</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Prescription Status Cards */}
                        {needsPrescription && !prescriptionId && (
                            <Card className="rounded-2xl border-red-200 bg-red-50">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-red-900 mb-1">Prescription Required</h3>
                                            <p className="text-sm text-red-700 mb-2">
                                                Your cart contains medicines that require a valid prescription. Please upload your prescription from the cart page.
                                            </p>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => router.push("/cart")}
                                                className="border-red-300 text-red-700 hover:bg-red-100"
                                            >
                                                Go to Cart
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        
                        {/* Prescription PENDING - Waiting for Approval */}
                        {needsPrescription && prescriptionId && prescription?.status === 'PENDING' && (
                            <Card className="rounded-2xl border-orange-200 bg-orange-50">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-orange-900 mb-1">⏳ Waiting for Prescription Approval</h3>
                                            <p className="text-sm text-orange-700 mb-3">
                                                Your prescription is being reviewed by our pharmacist. You cannot place order until it's approved.
                                            </p>
                                            <div className="bg-white/50 rounded-lg p-3 border border-orange-200">
                                                <p className="text-xs font-bold text-orange-900 mb-1">What happens next:</p>
                                                <ul className="text-xs text-orange-800 space-y-1 list-disc list-inside">
                                                    <li>Pharmacist will review (usually within 10 mins)</li>
                                                    <li>You'll get notification once approved</li>
                                                    <li>Come back and place your order</li>
                                                    <li>If rejected, you can upload a new prescription</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        
                        {/* Prescription APPROVED - Ready to Order */}
                        {needsPrescription && prescriptionId && prescription?.status === 'APPROVED' && (
                            <Card className="rounded-2xl border-green-200 bg-green-50">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-green-900 mb-1">✅ Prescription Approved!</h3>
                                            <p className="text-sm text-green-700">
                                                Your prescription has been verified. You can now place your order.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        
                        {/* Prescription REJECTED */}
                        {needsPrescription && prescriptionId && prescription?.status === 'REJECTED' && (
                            <Card className="rounded-2xl border-red-200 bg-red-50">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-red-900 mb-1">❌ Prescription Rejected</h3>
                                            <p className="text-sm text-red-700 mb-2">
                                                Your prescription could not be verified. Please upload a new, clear prescription.
                                            </p>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => router.push("/cart")}
                                                className="border-red-300 text-red-700 hover:bg-red-100"
                                            >
                                                Upload New Prescription
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Delivery Address - Always Required */}
                        <Card className="rounded-2xl border-slate-200">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        Delivery Address
                                    </div>
                                    {savedAddresses && savedAddresses.length > 0 && (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => router.push('/profile/manage-addresses')}
                                            className="text-primary"
                                        >
                                            Manage
                                        </Button>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
                                    <Truck className="h-5 w-5 text-blue-600" />
                                    <p className="text-sm text-blue-700 font-medium">
                                        Home delivery • {totalPrice >= 350 ? 'FREE delivery' : `${configService.formatCurrency(pricingConfig?.deliveryFee || 35)} delivery fee`}
                                    </p>
                                </div>

                                {/* Saved Addresses */}
                                {!addressesLoading && savedAddresses && savedAddresses.length > 0 && !useNewAddress && (
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold">Select Saved Address</Label>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {savedAddresses.map((addr) => (
                                                <div
                                                    key={addr.id}
                                                    onClick={() => handleSelectAddress(addr)}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                        selectedAddressId === addr.id
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Badge variant={addr.isDefault ? "default" : "secondary"}>
                                                                    {addr.title}
                                                                </Badge>
                                                                {addr.isDefault && (
                                                                    <Badge variant="outline" className="text-xs">Default</Badge>
                                                                )}
                                                            </div>
                                                            <p className="font-bold text-sm">{addr.fullName}</p>
                                                            <p className="text-sm text-slate-600">{addr.phone}</p>
                                                            <p className="text-sm text-slate-600 mt-1">
                                                                {addr.addressLine}
                                                                {addr.landmark && `, Near ${addr.landmark}`}
                                                            </p>
                                                            <p className="text-sm text-slate-600">
                                                                {addr.city}, {addr.state} - {addr.pincode}
                                                            </p>
                                                        </div>
                                                        {selectedAddressId === addr.id && (
                                                            <CheckCircle className="h-5 w-5 text-primary" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setUseNewAddress(true);
                                                setSelectedAddressId(null);
                                                setAddress({
                                                    street: '',
                                                    city: businessConfig?.address.city || 'Indore',
                                                    state: businessConfig?.address.state || 'Madhya Pradesh',
                                                    pincode: '',
                                                    phone: ''
                                                });
                                            }}
                                            className="w-full"
                                        >
                                            + Use New Address
                                        </Button>
                                    </div>
                                )}

                                {/* Manual Address Entry */}
                                {(useNewAddress || !savedAddresses || savedAddresses.length === 0) && (
                                    <div className="space-y-4">
                                        {savedAddresses && savedAddresses.length > 0 && (
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-bold">Enter New Address</Label>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    onClick={() => {
                                                        setUseNewAddress(false);
                                                        // Select default address if available
                                                        const defaultAddr = savedAddresses.find(a => a.isDefault);
                                                        if (defaultAddr) {
                                                            handleSelectAddress(defaultAddr);
                                                        }
                                                    }}
                                                    className="text-primary"
                                                >
                                                    ← Back to Saved Addresses
                                                </Button>
                                            </div>
                                        )}
                                        <div>
                                            <Label htmlFor="street">Street Address *</Label>
                                            <Textarea
                                                id="street"
                                                placeholder="Enter your complete address"
                                                value={address.street}
                                                onChange={(e) => setAddress({...address, street: e.target.value})}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    value={address.city}
                                                    onChange={(e) => setAddress({...address, city: e.target.value})}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="pincode">Pincode *</Label>
                                                <Input
                                                    id="pincode"
                                                    placeholder="452001"
                                                    value={address.pincode}
                                                    onChange={(e) => setAddress({...address, pincode: e.target.value})}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                placeholder={businessConfig?.contact.phone || "9876543210"}
                                                value={address.phone}
                                                onChange={(e) => setAddress({...address, phone: e.target.value})}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card className="rounded-2xl border-slate-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Only Cash on Delivery - Razorpay disabled for now */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2 p-4 rounded-xl border-2 border-primary bg-primary/5">
                                        <div className="h-4 w-4 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                                            <div className="h-2 w-2 rounded-full bg-white"></div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <Banknote className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="font-bold text-slate-900">Cash on Delivery</p>
                                                    <p className="text-sm text-slate-600">Pay when you receive the order</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Online Payment - Coming Soon */}
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 opacity-60">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="h-5 w-5 text-slate-400" />
                                            <div>
                                                <p className="font-bold text-slate-500">Online Payment</p>
                                                <p className="text-sm text-slate-400">Coming Soon - UPI, Cards, Net Banking</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="space-y-6">
                        <Card className="rounded-2xl border-slate-200 sticky top-8">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Items */}
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                                            <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center">
                                                <Pill className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-slate-900">{item.name}</p>
                                                <p className="text-xs text-slate-700">Qty: {item.quantity}</p>
                                                {item.rxRequired && (
                                                    <Badge variant="destructive" className="text-xs mt-1">
                                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                                        Rx Required
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="font-bold text-slate-900">{configService.formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{configService.formatCurrency(totalPrice)}</span>
                                    </div>
                                    {deliveryType === 'DELIVERY' && (
                                        <div className="flex justify-between">
                                            <span>Delivery Fee</span>
                                            {deliveryFee === 0 ? (
                                                <span className="text-green-600 font-bold">FREE</span>
                                            ) : (
                                                <span>{configService.formatCurrency(deliveryFee)}</span>
                                            )}
                                        </div>
                                    )}
                                    {deliveryType === 'DELIVERY' && totalPrice < 350 && (
                                        <p className="text-xs text-slate-500 italic">
                                            Add {configService.formatCurrency(350 - totalPrice)} more for free delivery
                                        </p>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Tax ({configService.getTaxPercentage()}%)</span>
                                        <span>{configService.formatCurrency(tax)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                        <span>Total</span>
                                        <span>{configService.formatCurrency(finalAmount)}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <Button 
                                    onClick={handlePlaceOrder}
                                    disabled={
                                        createOrderMutation.isPending || 
                                        (needsPrescription && !prescriptionId) ||
                                        (needsPrescription && prescriptionId && prescription?.status !== 'APPROVED') ||
                                        prescriptionLoading
                                    }
                                    className="w-full h-12 rounded-xl font-bold"
                                >
                                    {createOrderMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Placing Order...
                                        </>
                                    ) : prescriptionLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Checking Prescription...
                                        </>
                                    ) : needsPrescription && !prescriptionId ? (
                                        <>
                                            <AlertTriangle className="h-5 w-5 mr-2" />
                                            Upload Prescription First
                                        </>
                                    ) : needsPrescription && prescription?.status === 'PENDING' ? (
                                        <>
                                            <Clock className="h-5 w-5 mr-2" />
                                            Waiting for Approval
                                        </>
                                    ) : needsPrescription && prescription?.status === 'REJECTED' ? (
                                        <>
                                            <AlertTriangle className="h-5 w-5 mr-2" />
                                            Prescription Rejected
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            Place Order (COD)
                                        </>
                                    )}
                                </Button>
                                
                                {/* Helper Text */}
                                {needsPrescription && !prescriptionId && (
                                    <p className="text-xs text-center text-red-600">
                                        Please upload prescription from cart page
                                    </p>
                                )}
                                {needsPrescription && prescription?.status === 'PENDING' && (
                                    <p className="text-xs text-center text-orange-600">
                                        Waiting for pharmacist to approve your prescription
                                    </p>
                                )}
                                {needsPrescription && prescription?.status === 'REJECTED' && (
                                    <p className="text-xs text-center text-red-600">
                                        Please upload a new prescription from cart page
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}