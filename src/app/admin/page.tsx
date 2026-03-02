"use client";

import {
    LayoutDashboard,
    Package,
    FileText,
    Bell,
    Search,
    IndianRupee,
    TrendingUp,
    AlertCircle,
    User,
    Calendar,
    ArrowRight,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useDashboardStats, useRecentActivities, usePendingTasks } from "@/hooks/use-dashboard";
import { useStoreDashboard } from "@/hooks/use-store-inventory";
import { useAuthStore } from "@/lib/auth-store";

export default function AdminDashboard() {
    const { user } = useAuthStore();
    const { data: storeStats, isLoading: statsLoading } = useStoreDashboard();
    const { data: activities, isLoading: activitiesLoading } = useRecentActivities();
    const { data: tasks } = usePendingTasks();

    // Get pharmacy name from user or default
    const pharmacyName = user?.name || "Your Pharmacy";
    const ownerName = user?.name?.split(' ')[0] || "Owner";

    return (
        <div className="h-full bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-8 md:p-12 overflow-y-auto relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Namaste, {ownerName} Ji 👋</h1>
                    <p className="text-slate-500 font-medium mt-1">Here is the summary of your <span className="text-primary font-bold">{pharmacyName}</span>.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <Calendar size={14} /> {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </div>
                    <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-slate-50 relative border border-slate-100">
                        <Bell size={20} className="text-slate-600" />
                        {(tasks?.pendingPrescriptions || 0) > 0 && (
                            <span className="absolute top-3 right-3 h-2 w-2 bg-red-500 rounded-full border border-white" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statsLoading ? (
                    // Loading skeleton
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100/50 animate-pulse">
                            <div className="h-12 w-12 bg-slate-200 rounded-2xl mb-4"></div>
                            <div className="h-8 bg-slate-200 rounded mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        </div>
                    ))
                ) : (
                    [
                        { 
                            label: "Aaj Ki Kamai (Earnings)", 
                            value: `₹${storeStats?.revenue?.totalRevenue?.toLocaleString() || '0'}`, 
                            sub: (storeStats?.revenue?.totalRevenue || 0) > 0 ? `₹${storeStats?.revenue?.totalRevenue} total revenue` : "No revenue yet", 
                            icon: IndianRupee, 
                            color: "bg-green-500", 
                            txtColor: "text-green-600" 
                        },
                        { 
                            label: "New Orders (Nayi Order)", 
                            value: storeStats?.orders?.pendingOrders?.toString() || '0', 
                            sub: (storeStats?.orders?.pendingOrders || 0) > 0 ? `${storeStats?.orders?.pendingOrders} orders pending` : "No pending orders", 
                            icon: Package, 
                            color: "bg-blue-500", 
                            txtColor: "text-blue-600" 
                        },
                        { 
                            label: "Total Orders", 
                            value: storeStats?.orders?.totalOrders?.toString() || '0', 
                            sub: (storeStats?.orders?.completedOrders || 0) > 0 ? `${storeStats?.orders?.completedOrders} completed` : "No completed orders", 
                            icon: FileText, 
                            color: "bg-purple-500", 
                            txtColor: "text-purple-600" 
                        },
                        { 
                            label: "Out of Stock", 
                            value: storeStats?.inventory?.outOfStockMedicines?.toString() || '0', 
                            sub: (storeStats?.inventory?.outOfStockMedicines || 0) > 0 ? `${storeStats?.inventory?.outOfStockMedicines} medicines out of stock` : "All medicines in stock", 
                            icon: AlertCircle, 
                            color: "bg-red-500", 
                            txtColor: "text-red-600" 
                        },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100/50 hover:shadow-lg hover:shadow-slate-200/50 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`h-12 w-12 rounded-2xl ${stat.color} bg-opacity-10 flex items-center justify-center ${stat.txtColor} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="px-3 py-1 rounded-full bg-white border border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                    Live
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                            <p className="text-[10px] font-medium text-slate-500 mt-2 flex items-center gap-1">
                                <TrendingUp size={10} className="text-green-500" /> {stat.sub}
                            </p>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Main Dashboard Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Pending Actions Feed */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-2xl font-black tracking-tight">Requires Attention</h3>
                            <Button variant="secondary" size="sm" className="rounded-xl text-xs font-bold bg-white/10 text-white hover:bg-white/20 border border-white/10">View All Tasks</Button>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {activitiesLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-white/50" />
                                </div>
                            ) : (
                                activities?.map((activity, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg
                                            ${activity.type === 'prescription' ? 'bg-purple-500/20 text-purple-400' :
                                                activity.type === 'stock' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-blue-500/20 text-blue-400'}
                                        `}>
                                            !
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white group-hover:text-primary transition-colors">{activity.title}</h4>
                                            <p className="text-xs text-slate-400">{activity.description}</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{activity.time}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Medicine Inventory Stats</h3>
                            <Button variant="ghost" size="sm" className="text-slate-400 font-bold hover:text-primary">View All</Button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                                        <Package size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Total Medicines</p>
                                        <p className="text-xs text-slate-500 font-medium">In your inventory</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900">{storeStats?.inventory?.totalMedicines || 0}</p>
                                    <p className="text-[10px] uppercase font-black text-green-500">Active</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                                        <AlertCircle size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Prescription Required</p>
                                        <p className="text-xs text-slate-500 font-medium">Controlled medicines</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900">{storeStats?.inventory?.totalMedicines || 0}</p>
                                    <p className="text-[10px] uppercase font-black text-orange-500">Total</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Actions */}
                <div className="space-y-8">
                    <div className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 h-full relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-xl font-black text-indigo-900 tracking-tight">Quick Actions</h3>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <Button 
                                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20"
                                onClick={() => window.location.href = '/admin/inventory'}
                            >
                                <Package className="mr-2 h-4 w-4" />
                                Add New Medicine
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full h-12 rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold"
                                onClick={() => window.location.href = '/admin/prescriptions'}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Review Prescriptions
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full h-12 rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold"
                                onClick={() => window.location.href = '/admin/orders'}
                            >
                                <IndianRupee className="mr-2 h-4 w-4" />
                                View Today's Sales
                            </Button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-indigo-200/50 relative z-10">
                            <h4 className="text-indigo-900 font-black text-lg mb-4">Store Status</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-indigo-700 uppercase tracking-widest">
                                    <span>In Stock Items</span>
                                    <span>{storeStats?.inventory?.inStockMedicines || 0}</span>
                                </div>
                                <div className="h-2 bg-indigo-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                                        style={{ 
                                            width: `${storeStats?.inventory?.totalMedicines ? (storeStats.inventory.inStockMedicines / storeStats.inventory.totalMedicines) * 100 : 0}%` 
                                        }}
                                    />
                                </div>
                                <p className="text-[10px] text-indigo-400 font-medium mt-2">
                                    {storeStats?.inventory?.totalMedicines ? Math.round((storeStats.inventory.inStockMedicines / storeStats.inventory.totalMedicines) * 100) : 0}% of medicines are in stock
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
