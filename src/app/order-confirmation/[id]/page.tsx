"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    CheckCircle, 
    Clock, 
    MapPin, 
    Phone, 
    Store,
    Truck,
    CreditCard,
    ArrowRight,
    Home,
    Pill,
    AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useOrder } from "@/hooks/use-orders";
import { useDefaultStore, useBusinessConfig, useDeliveryConfig } from "@/hooks/use-config";
import { configService } from "@/lib/config";
import { motion } from "framer-motion";
import { RoleGuard } from "@/components/auth/role-guard";

export default function OrderConfirmationPage() {
    return (
        <RoleGuard allowedRoles={['USER']}>
            <OrderConfirmationContent />
        </RoleGuard>
    );
}

function OrderConfirmationContent() {
    const params = useParams();
    const orderId = params.id as string;
    
    const { data: order, isLoading, error } = useOrder(orderId);
    const defaultStore = useDefaultStore();
    const businessConfig = useBusinessConfig();
    const deliveryConfig = useDeliveryConfig();
    const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'PAID' | 'FAILED'>('PENDING');

    const handlePaymentAction = (status: 'PAID' | 'FAILED') => {
        setPaymentStatus(status);
        // Here you would typically update the order status in the backend
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-slate-500 font-medium">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-900">Order Not Found</h2>
                    <p className="text-slate-500">The order you're looking for doesn't exist.</p>
                    <Link href="/medicines">
                        <Button>Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto py-8 px-4 max-w-4xl">
                {/* Success Header */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Order Confirmed!</h1>
                    <p className="text-slate-600">Your order has been placed successfully</p>
                    <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-slate-900 text-white rounded-full">
                        <span className="text-sm font-bold">Order ID:</span>
                        <span className="text-sm font-mono">#{order.id}</span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status */}
                        <Card className="rounded-2xl border-slate-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Order Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <Badge 
                                        variant={order.status === 'NEW' ? 'default' : 'secondary'}
                                        className="px-3 py-1"
                                    >
                                        {order.status}
                                    </Badge>
                                    <span className="text-sm text-slate-600">
                                        {order.status === 'NEW' && 'Your order is being processed'}
                                        {order.status === 'PACKING' && 'Your order is being packed'}
                                        {order.status === 'READY' && 'Your order is ready for pickup/delivery'}
                                        {order.status === 'DELIVERED' && 'Your order has been delivered'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Information */}
                        <Card className="rounded-2xl border-slate-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {order.type === 'DELIVERY' ? (
                                        <Truck className="h-5 w-5 text-primary" />
                                    ) : (
                                        <Store className="h-5 w-5 text-primary" />
                                    )}
                                    {order.type === 'DELIVERY' ? 'Delivery Information' : 'Pickup Information'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {order.type === 'DELIVERY' ? (
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-sm">Delivery Address</p>
                                                <p className="text-sm text-slate-600">{order.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-slate-500" />
                                            <div>
                                                <p className="font-bold text-sm">Estimated Delivery</p>
                                                <p className="text-sm text-slate-600">{configService.getDeliveryTimeText()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Store className="h-5 w-5 text-slate-500 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-sm">Pickup Location</p>
                                                <p className="text-sm text-slate-600">{defaultStore?.address || businessConfig?.address.street || "Auto-assigned store"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-5 w-5 text-slate-500" />
                                            <div>
                                                <p className="font-bold text-sm">Store Contact</p>
                                                <p className="text-sm text-slate-600">{defaultStore?.phone || businessConfig?.contact.phone || "Contact store for details"}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment Status */}
                        <Card className="rounded-2xl border-slate-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    Payment Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span>Payment Status:</span>
                                        <Badge 
                                            variant={
                                                paymentStatus === 'PAID' ? 'default' : 
                                                paymentStatus === 'FAILED' ? 'destructive' : 'secondary'
                                            }
                                        >
                                            {paymentStatus}
                                        </Badge>
                                    </div>
                                    
                                    {paymentStatus === 'PENDING' && (
                                        <div className="space-y-3">
                                            <p className="text-sm text-slate-600">
                                                Complete your payment to confirm the order processing.
                                            </p>
                                            <div className="flex gap-3">
                                                <Button 
                                                    onClick={() => handlePaymentAction('PAID')}
                                                    className="flex-1"
                                                >
                                                    Mark as Paid
                                                </Button>
                                                <Button 
                                                    onClick={() => handlePaymentAction('FAILED')}
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    Payment Failed
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {paymentStatus === 'PAID' && (
                                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                            <p className="text-sm text-green-700 font-medium">
                                                ✅ Payment completed successfully! Your order is now being processed.
                                            </p>
                                        </div>
                                    )}

                                    {paymentStatus === 'FAILED' && (
                                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                            <p className="text-sm text-red-700 font-medium">
                                                ❌ Payment failed. Please try again or contact support.
                                            </p>
                                            <Button 
                                                onClick={() => setPaymentStatus('PENDING')}
                                                variant="outline"
                                                size="sm"
                                                className="mt-2"
                                            >
                                                Retry Payment
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="space-y-6">
                        <Card className="rounded-2xl border-slate-200 bg-slate-900">
                            <CardHeader>
                                <CardTitle className="text-white">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Order Items */}
                                <div className="space-y-3">
                                    {order.OrderItems && order.OrderItems.length > 0 ? (
                                        order.OrderItems.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white">
                                                <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                                    <Pill className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm text-slate-900">{item.name}</p>
                                                    <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                                                    {item.rxRequired && (
                                                        <Badge variant="destructive" className="text-xs mt-1">
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            Rx Required
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="font-bold text-slate-900">{configService.formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white">
                                            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                                <Pill className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-slate-900">Order Items</p>
                                                <p className="text-xs text-slate-600">{order.items} items</p>
                                            </div>
                                            <p className="font-bold text-slate-900">₹{order.amount}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-slate-700 pt-4">
                                    <div className="flex justify-between font-bold text-lg text-white">
                                        <span>Total Paid</span>
                                        <span>₹{order.amount}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Link href="/orders" className="block">
                                <Button variant="outline" className="w-full h-12 rounded-xl">
                                    View All Orders
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/medicines" className="block">
                                <Button variant="ghost" className="w-full h-12 rounded-xl">
                                    <Home className="h-4 w-4 mr-2" />
                                    Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}