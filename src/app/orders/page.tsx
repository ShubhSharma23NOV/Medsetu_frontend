"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
    Package, 
    Clock, 
    CheckCircle, 
    Truck, 
    Store,
    Search,
    Filter,
    ArrowRight,
    Pill,
    AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useOrders } from "@/hooks/use-orders";
import { RoleGuard } from "@/components/auth/role-guard";
import { Order } from "@/types";

export default function OrdersPage() {
    return (
        <RoleGuard allowedRoles={['USER']}>
            <OrdersContent />
        </RoleGuard>
    );
}

function OrdersContent() {
    const { data: orders, isLoading, error } = useOrders();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    const filteredOrders = orders?.filter(order => {
        const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return 'bg-blue-100 text-blue-800';
            case 'PACKING': return 'bg-yellow-100 text-yellow-800';
            case 'READY': return 'bg-green-100 text-green-800';
            case 'DELIVERED': return 'bg-emerald-100 text-emerald-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'NEW': return <Clock className="h-4 w-4" />;
            case 'PACKING': return <Package className="h-4 w-4" />;
            case 'READY': return <CheckCircle className="h-4 w-4" />;
            case 'DELIVERED': return <CheckCircle className="h-4 w-4" />;
            case 'CANCELLED': return <AlertTriangle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-slate-500 font-medium">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-900">Failed to Load Orders</h2>
                    <p className="text-slate-500">Please try again later.</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">My Orders</h1>
                    <p className="text-slate-600">Track and manage your medicine orders</p>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            placeholder="Search orders by ID or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={statusFilter === "ALL" ? "default" : "outline"}
                            onClick={() => setStatusFilter("ALL")}
                            size="sm"
                        >
                            All
                        </Button>
                        <Button
                            variant={statusFilter === "NEW" ? "default" : "outline"}
                            onClick={() => setStatusFilter("NEW")}
                            size="sm"
                        >
                            New
                        </Button>
                        <Button
                            variant={statusFilter === "DELIVERED" ? "default" : "outline"}
                            onClick={() => setStatusFilter("DELIVERED")}
                            size="sm"
                        >
                            Delivered
                        </Button>
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Orders Found</h3>
                        <p className="text-slate-500 mb-6">
                            {searchTerm || statusFilter !== "ALL" 
                                ? "Try adjusting your search or filter criteria"
                                : "You haven't placed any orders yet"
                            }
                        </p>
                        <Link href="/medicines">
                            <Button>Start Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <Card key={order.id} className="rounded-2xl border-slate-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-lg">Order #{order.id}</h3>
                                                <Badge className={`${getStatusColor(order.status)} border-0`}>
                                                    {getStatusIcon(order.status)}
                                                    <span className="ml-1">{order.status}</span>
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">₹{order.amount}</p>
                                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                                {order.type === 'DELIVERY' ? (
                                                    <>
                                                        <Truck className="h-4 w-4" />
                                                        <span>Delivery</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Store className="h-4 w-4" />
                                                        <span>Pickup</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="mb-4">
                                        {order.orderItems && order.orderItems.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {order.orderItems.slice(0, 3).map((item) => (
                                                    <div key={item.id} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                                                        <Pill className="h-4 w-4 text-primary" />
                                                        <span className="text-sm font-medium">{item.name}</span>
                                                        <span className="text-xs text-slate-500">×{item.quantity}</span>
                                                        {item.rxRequired && (
                                                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                                                        )}
                                                    </div>
                                                ))}
                                                {order.orderItems.length > 3 && (
                                                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
                                                        <span className="text-sm text-slate-600">
                                                            +{order.orderItems.length - 3} more
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 w-fit">
                                                <Package className="h-4 w-4 text-slate-500" />
                                                <span className="text-sm text-slate-600">{order.items} items</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Address */}
                                    {order.address && order.address !== 'Store Pickup' && (
                                        <div className="mb-4">
                                            <p className="text-sm text-slate-500 mb-1">Delivery Address:</p>
                                            <p className="text-sm text-slate-700">{order.address}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex justify-between items-center pt-4 border-t">
                                        <div className="text-sm text-slate-500">
                                            {order.status === 'NEW' && 'Order is being processed'}
                                            {order.status === 'PACKING' && 'Order is being packed'}
                                            {order.status === 'READY' && 'Order is ready for pickup/delivery'}
                                            {order.status === 'DELIVERED' && 'Order has been delivered'}
                                            {order.status === 'CANCELLED' && 'Order was cancelled'}
                                        </div>
                                        <Link href={`/orders/${order.id}`}>
                                            <Button variant="outline" size="sm">
                                                View Details
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}