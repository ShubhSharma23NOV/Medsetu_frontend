"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Package,
    MapPin,
    Phone,
    Calendar,
    CreditCard,
    Truck,
    Store,
    Pill,
    AlertTriangle,
    CheckCircle2,
    Clock,
    XCircle,
    Loader2,
    RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOrder, useCancelOrder } from "@/hooks/use-orders";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { RoleGuard } from "@/components/auth/role-guard";
import { useCartStore } from "@/lib/cart-store";

export default function UserOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <RoleGuard allowedRoles={['USER']}>
            <UserOrderDetailContent params={params} />
        </RoleGuard>
    );
}

function UserOrderDetailContent({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { data: order, isLoading, error } = useOrder(resolvedParams.id);
    const cancelOrderMutation = useCancelOrder();
    const { addItem } = useCartStore();

    const handleCancelOrder = async () => {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        
        try {
            await cancelOrderMutation.mutateAsync(resolvedParams.id);
            toast.success("Order cancelled", {
                description: "Your order has been cancelled successfully."
            });
        } catch (error: any) {
            toast.error("Failed to cancel order", {
                description: error.message || "Please contact support"
            });
        }
    };

    const handleReorder = () => {
        if (!order?.OrderItems) return;
        
        order.OrderItems.forEach((item: any) => {
            addItem({
                id: item.medicineId,
                name: item.name,
                price: item.price,
                rxRequired: item.rxRequired,
                inStock: true,
            });
        });
        
        toast.success("Items added to cart", {
            description: `${order.OrderItems.length} items added to your cart`
        });
        
        router.push('/cart');
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
                return 'bg-emerald-500';
            case 'CANCELLED':
                return 'bg-red-500';
            default:
                return 'bg-slate-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'NEW':
                return <Clock className="h-4 w-4" />;
            case 'PACKING':
                return <Package className="h-4 w-4" />;
            case 'READY':
                return <CheckCircle2 className="h-4 w-4" />;
            case 'DELIVERED':
                return <CheckCircle2 className="h-4 w-4" />;
            case 'CANCELLED':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Package className="h-16 w-16 text-slate-300 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-900">Order not found</h2>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto py-8 px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Orders
                    </Button>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-black text-slate-900">Order #{order.id}</h1>
                                <Badge className={`${getStatusColor(order.status)} text-white border-0`}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-1">{order.status}</span>
                                </Badge>
                            </div>
                            <p className="text-slate-500">
                                Placed {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                        
                        <div className="flex gap-2">
                            {(order.status === 'DELIVERED' || order.status === 'CANCELLED') && (
                                <Button
                                    variant="outline"
                                    onClick={handleReorder}
                                    className="rounded-xl"
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reorder
                                </Button>
                            )}
                            {order.status === 'NEW' && (
                                <Button
                                    variant="destructive"
                                    onClick={handleCancelOrder}
                                    disabled={cancelOrderMutation.isPending}
                                    className="rounded-xl"
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel Order
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Timeline */}
                <Card className="p-6 rounded-2xl border-slate-200 mb-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Order Status</h2>
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 -z-10"></div>
                        <div 
                            className={`absolute top-5 left-0 h-1 ${getStatusColor(order.status)} -z-10 transition-all`}
                            style={{
                                width: order.status === 'NEW' ? '0%' :
                                       order.status === 'PACKING' ? '33%' :
                                       order.status === 'READY' ? '66%' :
                                       order.status === 'DELIVERED' ? '100%' : '0%'
                            }}
                        ></div>
                        
                        {['NEW', 'PACKING', 'READY', 'DELIVERED'].map((status, index) => {
                            const isActive = order.status === status;
                            const isPast = ['NEW', 'PACKING', 'READY', 'DELIVERED'].indexOf(order.status) > index;
                            
                            return (
                                <div key={status} className="flex flex-col items-center">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                        isActive || isPast ? getStatusColor(order.status) : 'bg-slate-200'
                                    } text-white mb-2`}>
                                        {status === 'NEW' && <Clock className="h-5 w-5" />}
                                        {status === 'PACKING' && <Package className="h-5 w-5" />}
                                        {status === 'READY' && <CheckCircle2 className="h-5 w-5" />}
                                        {status === 'DELIVERED' && <Truck className="h-5 w-5" />}
                                    </div>
                                    <span className={`text-xs font-bold ${isActive || isPast ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6 rounded-2xl border-slate-200">
                            <h2 className="text-xl font-black text-slate-900 mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.OrderItems && order.OrderItems.length > 0 ? (
                                    order.OrderItems.map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="h-16 w-16 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                                                <Pill className="h-8 w-8 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900">{item.name}</h3>
                                                <p className="text-sm text-slate-500">
                                                    Quantity: {item.quantity} × ₹{item.price}
                                                </p>
                                                {item.rxRequired && (
                                                    <Badge className="mt-1 bg-orange-100 text-orange-700 text-xs border-0">
                                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                                        Rx Required
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-slate-900 text-lg">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-400">
                                        <Package className="h-12 w-12 mx-auto mb-2" />
                                        <p>No items found</p>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Subtotal</span>
                                    <span className="font-bold text-slate-900">₹{(order.amount * 0.85).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Delivery Fee</span>
                                    <span className="font-bold text-slate-900">
                                        {order.type === 'DELIVERY' ? '₹35' : 'FREE'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">GST (18%)</span>
                                    <span className="font-bold text-slate-900">₹{(order.amount * 0.15).toFixed(2)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between">
                                    <span className="font-black text-slate-900">Total Amount</span>
                                    <span className="font-black text-slate-900 text-xl">₹{order.amount}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Delivery & Payment Info */}
                    <div className="space-y-6">
                        {/* Delivery Info */}
                        <Card className="p-6 rounded-2xl border-slate-200">
                            <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                {order.type === 'DELIVERY' ? (
                                    <><Truck className="h-5 w-5 text-primary" /> Delivery</>
                                ) : (
                                    <><Store className="h-5 w-5 text-primary" /> Pickup</>
                                )}
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Type</p>
                                    <Badge className={order.type === 'DELIVERY' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>
                                        {order.type}
                                    </Badge>
                                </div>
                                {order.address && (
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Address</p>
                                        <p className="font-medium text-slate-700 text-sm">{order.address}</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Payment Info */}
                        <Card className="p-6 rounded-2xl border-slate-200">
                            <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" /> Payment
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Method</p>
                                    <p className="font-bold text-slate-900">Cash on Delivery</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Status</p>
                                    <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
                                </div>
                            </div>
                        </Card>

                        {/* Help Card */}
                        <Card className="p-6 rounded-2xl border-slate-200 bg-gradient-to-br from-primary/5 to-blue-50">
                            <h3 className="font-bold text-slate-900 mb-2">Need Help?</h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Contact us if you have any questions about your order.
                            </p>
                            <Button variant="outline" className="w-full rounded-xl">
                                <Phone className="h-4 w-4 mr-2" />
                                Contact Support
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
