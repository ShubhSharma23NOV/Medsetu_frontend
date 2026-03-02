"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    MoreVertical,
    Package,
    Clock,
    MapPin,
    Store,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlatformOrders } from "@/hooks/use-platform-admin";

export default function PlatformOrdersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    
    const { data: orders, isLoading, error } = usePlatformOrders(statusFilter || undefined);

    const filteredOrders = orders?.filter(order => 
        order.id.toString().includes(searchTerm) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.store.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING': return 'bg-blue-100 text-blue-700';
            case 'PROCESSING': return 'bg-orange-100 text-orange-700';
            case 'READY': return 'bg-indigo-100 text-indigo-700';
            case 'DELIVERED': return 'bg-green-100 text-green-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 font-medium">Failed to load orders</p>
                    <p className="text-slate-500 text-sm mt-1">Please try again later</p>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Order Monitor</h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time view of all orders across the platform.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                        <Filter className="mr-2 h-4 w-4" /> Filter Status
                    </Button>
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                        <Store className="mr-2 h-4 w-4" /> Filter by Store
                    </Button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search Order ID..."
                            className="pl-10 h-10 bg-white border-slate-200 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500 pl-6">Order Details</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500">Store</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500">Amount</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500">Status</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500 text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-slate-500">Loading orders...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <div className="text-slate-500">
                                        {searchTerm ? "No orders found matching your search" : "No orders found"}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id} className="group hover:bg-slate-50/50 cursor-pointer">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">ORD-{order.id}</div>
                                                <div className="text-xs text-slate-500 font-medium">{order.customer} • {order.items} Items</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-600">{order.store}</TableCell>
                                    <TableCell className="font-bold text-slate-900">₹{order.amount}</TableCell>
                                    <TableCell>
                                        <span className={`
                                            px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider
                                            ${getStatusColor(order.status)}
                                        `}>
                                            {order.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-200">
                                                    <MoreVertical size={16} className="text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem className="font-bold text-slate-600">View Details</DropdownMenuItem>
                                                <DropdownMenuItem className="font-bold text-slate-600">Track Driver</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
