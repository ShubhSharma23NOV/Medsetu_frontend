"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    Phone,
    Calendar,
    CreditCard,
    FileText,
    Printer,
    CheckCircle2,
    XCircle,
    Truck,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOrder, useUpdateOrder } from "@/hooks/use-orders";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { data: order, isLoading, error } = useOrder(resolvedParams.id);
    const updateOrderMutation = useUpdateOrder();

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            await updateOrderMutation.mutateAsync({
                id: resolvedParams.id,
                data: { status: newStatus }
            });
            toast.success("Order updated", {
                description: `Order status changed to ${newStatus}`
            });
        } catch (error: any) {
            toast.error("Failed to update order", {
                description: error.message || "Please try again"
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'NEW':
                return 'bg-blue-500';
            case 'PACKING':
                return 'bg-orange-500';
            case 'READY':
                return 'bg-green-500';
            case 'DELIVERED':
                return 'bg-slate-500';
            case 'CANCELLED':
                return 'bg-red-500';
            default:
                return 'bg-slate-500';
        }
    };

    if (isLoading) {
        return (
            <div className="h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex items-center justify-center">
                <div className="text-center">
                    <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-red-500 font-medium">Order not found</p>
                    <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => router.back()}
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-8 md:p-10 bg-white border-b border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order #ORD-{order.id}</h1>
                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                                {order.status}
                            </Badge>
                        </div>
                        <p className="text-slate-500 font-medium mt-1">
                            Placed {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                    <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 font-bold">
                        <Printer className="mr-2 h-4 w-4" /> Print Invoice
                    </Button>
                </div>

                {/* Action Buttons */}
                {order.status === 'NEW' && (
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 font-bold"
                            onClick={() => handleStatusUpdate('CANCELLED')}
                            disabled={updateOrderMutation.isPending}
                        >
                            <XCircle className="mr-2 h-4 w-4" /> Reject Order
                        </Button>
                        <Button
                            className="rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20"
                            onClick={() => handleStatusUpdate('PACKING')}
                            disabled={updateOrderMutation.isPending}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Accept & Start Packing
                        </Button>
                    </div>
                )}
                {order.status === 'PACKING' && (
                    <Button
                        className="rounded-xl bg-green-600 text-white font-bold shadow-lg shadow-green-500/20"
                        onClick={() => handleStatusUpdate('READY')}
                        disabled={updateOrderMutation.isPending}
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Ready
                    </Button>
                )}
                {order.status === 'READY' && (
                    <Button
                        className="rounded-xl bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20"
                        onClick={() => handleStatusUpdate('DELIVERED')}
                        disabled={updateOrderMutation.isPending}
                    >
                        <Truck className="mr-2 h-4 w-4" /> Mark as Delivered
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6 rounded-3xl border-slate-800 bg-slate-900">
                            <h2 className="text-xl font-black text-white mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.orderItems && order.orderItems.length > 0 ? (
                                    order.orderItems.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-slate-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                                                    <p className="text-xs text-slate-600">
                                                        Quantity: {item.quantity} × ₹{item.price}
                                                    </p>
                                                    {item.rxRequired && (
                                                        <Badge className="mt-1 bg-orange-100 text-orange-700 text-[10px]">
                                                            Rx Required
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-slate-900">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-center py-4">No items found</p>
                                )}
                            </div>

                            <Separator className="my-6 bg-slate-700" />

                            <div className="space-y-2">
                                {(() => {
                                    // Calculate actual subtotal from order items
                                    const subtotal = order.orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
                                    const deliveryFee = order.type === 'DELIVERY' ? 35 : 0;
                                    const tax = subtotal * 0.18;
                                    const calculatedTotal = subtotal + deliveryFee + tax;
                                    
                                    return (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Subtotal</span>
                                                <span className="font-bold text-white">₹{subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Delivery Fee</span>
                                                <span className="font-bold text-white">
                                                    {order.type === 'DELIVERY' ? '₹35' : 'FREE'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">GST (18%)</span>
                                                <span className="font-bold text-white">₹{tax.toFixed(2)}</span>
                                            </div>
                                            <Separator className="my-2 bg-slate-700" />
                                            <div className="flex justify-between">
                                                <span className="font-black text-white">Total Amount</span>
                                                <span className="font-black text-white text-xl">₹{order.amount.toFixed(2)}</span>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Customer & Delivery Info */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <Card className="p-6 rounded-3xl border-slate-800 bg-slate-900">
                            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-white" /> Customer Details
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Name</p>
                                    <p className="font-bold text-white">{order.customerName}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Delivery Info */}
                        <Card className="p-6 rounded-3xl border-slate-800 bg-slate-900">
                            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-white" /> Delivery Details
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Type</p>
                                    <Badge className={order.type === 'DELIVERY' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>
                                        {order.type}
                                    </Badge>
                                </div>
                                {order.address && (
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Address</p>
                                        <p className="font-medium text-slate-300 text-sm">{order.address}</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Payment Info */}
                        <Card className="p-6 rounded-3xl border-slate-800 bg-slate-900">
                            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-white" /> Payment
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Method</p>
                                    <p className="font-bold text-white">Cash on Delivery</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Status</p>
                                    <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
