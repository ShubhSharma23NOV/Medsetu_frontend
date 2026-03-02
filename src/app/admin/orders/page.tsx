"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock,
    Package,
    Truck,
    MapPin,
    Phone,
    ChevronDown,
    Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useOrders, useUpdateOrder } from "@/hooks/use-orders";
import { formatDistanceToNow } from "date-fns";

export default function OrdersPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    
    const { data: orders = [], isLoading, error } = useOrders();
    const updateOrderMutation = useUpdateOrder();

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        const matchesTab = activeTab === "all" || order.status.toLowerCase() === activeTab.toLowerCase();
        const matchesSearch = !searchQuery || 
            order.id.toString().includes(searchQuery) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        try {
            await updateOrderMutation.mutateAsync({
                id: orderId.toString(),
                data: { status: newStatus }
            });
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    const formatTimeAgo = (date: string) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    if (isLoading) {
        return (
            <div className="h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 font-medium">Failed to load orders</p>
                    <p className="text-slate-400 text-sm mt-2">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-8 md:p-10 bg-white border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Purchase Orders</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage new orders, packing, and deliveries.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 font-bold hidden md:flex">
                        <Printer className="mr-2 h-4 w-4" /> Export List
                    </Button>
                    <Button className="rounded-xl bg-primary text-white font-black shadow-xl shadow-primary/20">
                        Create Manual Order
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="p-6 pb-0">
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <TabsList className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm h-14">
                            <TabsTrigger value="all" className="rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">All</TabsTrigger>
                            <TabsTrigger value="new" className="rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">New</TabsTrigger>
                            <TabsTrigger value="packing" className="rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">Packing</TabsTrigger>
                            <TabsTrigger value="ready" className="rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-green-50 data-[state=active]:text-green-600">Ready</TabsTrigger>
                        </TabsList>

                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search Order ID, Name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 h-12 w-full md:w-[300px] bg-white border-none rounded-2xl shadow-sm ring-1 ring-slate-100 focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>

                    <TabsContent value={activeTab} className="mt-0">
                        <div className="space-y-4 pb-8 overflow-y-auto max-h-[calc(100vh-320px)] pr-2">
                            {filteredOrders.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-400 mb-2">No Orders Found</h3>
                                    <p className="text-slate-400">
                                        {activeTab === "all" 
                                            ? "No orders have been placed yet." 
                                            : `No ${activeTab} orders found.`}
                                    </p>
                                </div>
                            ) : (
                                filteredOrders.map((order, i) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-slate-100/50 hover:border-slate-200 transition-all cursor-pointer"
                                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                                            {/* Left: Order Info */}
                                            <div className="flex items-start gap-4">
                                                <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                    <Package className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-black text-lg text-slate-900">ORD-{order.id}</span>
                                                        <span className={`
                                                            px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                                            ${order.status === 'NEW' ? 'bg-blue-50 text-blue-600' :
                                                                order.status === 'PACKING' ? 'bg-orange-50 text-orange-600' :
                                                                    order.status === 'READY' ? 'bg-green-50 text-green-600' :
                                                                        order.status === 'DELIVERED' ? 'bg-slate-100 text-slate-500' :
                                                                            'bg-red-50 text-red-600'}
                                                        `}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={12} /> {formatTimeAgo(order.createdAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin size={12} /> {order.address || 'Store Pickup'}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 text-sm font-medium text-slate-600">
                                                        Customer: {order.customerName}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Actions & Total */}
                                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                                                    <p className="text-xl font-black text-slate-900">₹{order.amount}</p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {order.status === "NEW" && (
                                                        <>
                                                            <Button 
                                                                variant="outline" 
                                                                className="rounded-xl border-slate-200 text-red-500 hover:text-red-600 hover:bg-red-50 font-bold"
                                                                onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                                                disabled={updateOrderMutation.isPending}
                                                            >
                                                                Reject
                                                            </Button>
                                                            <Button 
                                                                className="rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700"
                                                                onClick={() => handleStatusUpdate(order.id, 'PACKING')}
                                                                disabled={updateOrderMutation.isPending}
                                                            >
                                                                Accept Order
                                                            </Button>
                                                        </>
                                                    )}
                                                    {order.status === "PACKING" && (
                                                        <Button 
                                                            className="rounded-xl bg-green-600 text-white font-bold shadow-lg shadow-green-500/20 hover:bg-green-700"
                                                            onClick={() => handleStatusUpdate(order.id, 'READY')}
                                                            disabled={updateOrderMutation.isPending}
                                                        >
                                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Ready
                                                        </Button>
                                                    )}
                                                    {order.status === "READY" && (
                                                        <Button 
                                                            className="rounded-xl bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800"
                                                            onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                                                            disabled={updateOrderMutation.isPending}
                                                        >
                                                            <Truck className="mr-2 h-4 w-4" /> Mark Delivered
                                                        </Button>
                                                    )}

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                                                                <MoreVertical className="h-4 w-4 text-slate-500" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="font-bold text-slate-600">View Details</DropdownMenuItem>
                                                            <DropdownMenuItem className="font-bold text-slate-600">Print Invoice</DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                className="font-bold text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                                            >
                                                                Cancel Order
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items Preview (Expandable) */}
                                        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-500">
                                            <span>Includes: {order.items} Items</span>
                                            <span className="text-primary cursor-pointer hover:underline">View Full List</span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
