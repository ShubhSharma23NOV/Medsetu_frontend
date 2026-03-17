"use client";

import {
    Users,
    Store,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    Search,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePlatformStats, usePlatformStores } from "@/hooks/use-platform-admin";

export default function PlatformAdminDashboard() {
    const { data: stats, isLoading: statsLoading } = usePlatformStats();
    const { data: stores, isLoading: storesLoading } = usePlatformStores();

    const pendingStores = stores?.filter(store => store.status?.toUpperCase() === 'PENDING') || [];
    const recentStores = stores?.slice(0, 4) || [];

    if (statsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-slate-500">Loading dashboard...</span>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Overview</h1>
                <p className="text-slate-500 font-medium mt-1">Real-time insights into MedSetu's performance.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        title: "Total Revenue", 
                        value: `₹${((stats?.totalRevenue || 0) / 100000).toFixed(1)}L`, 
                        change: `+${stats?.monthlyGrowth || 0}%`, 
                        icon: TrendingUp, 
                        color: "text-green-600", 
                        bg: "bg-green-50",
                        cardBg: "bg-slate-900"
                    },
                    { 
                        title: "Active Pharmacies", 
                        value: stats?.activeStores?.toString() || "0", 
                        change: "+4 new", 
                        icon: Store, 
                        color: "text-indigo-600", 
                        bg: "bg-indigo-50",
                        cardBg: "bg-slate-900"
                    },
                    { 
                        title: "Registered Users", 
                        value: `${((stats?.totalUsers || 0) / 1000).toFixed(1)}k`, 
                        change: "+120 today", 
                        icon: Users, 
                        color: "text-blue-600", 
                        bg: "bg-blue-50",
                        cardBg: "bg-slate-900"
                    },
                    { 
                        title: "Pending Approvals", 
                        value: pendingStores.length.toString(), 
                        change: "Requires action", 
                        icon: AlertCircle, 
                        color: "text-orange-600", 
                        bg: "bg-orange-50",
                        cardBg: "bg-slate-900"
                    },
                ].map((stat, i) => (
                    <Card key={i} className={`rounded-2xl border-none shadow-sm hover:shadow-lg transition-shadow ${stat.cardBg}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                                {stat.title}
                            </CardTitle>
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{stat.value}</div>
                            <p className="text-xs font-bold mt-1 flex items-center gap-1">
                                <span className={stat.title === "Pending Approvals" ? "text-orange-500" : "text-green-500"}>
                                    {stat.change}
                                </span>
                                <span className="text-slate-500">
                                    {stat.title !== "Pending Approvals" && "from last month"}
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Registrations */}
                <Card className="lg:col-span-2 rounded-[2rem] border-none shadow-sm bg-slate-900">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-white">New Pharmacy Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {storesLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2 text-slate-400" />
                                    <span className="text-slate-400">Loading stores...</span>
                                </div>
                            ) : recentStores.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    No recent pharmacy requests
                                </div>
                            ) : (
                                recentStores.map((store, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex flex-1 items-center gap-4">
                                            <Avatar className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700">
                                                <AvatarFallback className="rounded-xl font-bold text-slate-300 bg-slate-800">{store.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-white">{store.name}</p>
                                                <p className="text-xs text-slate-400 font-medium">{store.location} • {new Date(store.joined).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <Badge 
                                                variant={store.status === 'Pending' ? 'default' : store.status === 'Active' ? 'secondary' : 'destructive'}
                                                className="rounded-lg px-3 py-1 text-xs"
                                            >
                                                {store.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <Button variant="outline" className="w-full mt-6 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700">
                            View All Requests
                        </Button>
                    </CardContent>
                </Card>

                {/* System Health / Quick Actions */}
                <div className="space-y-6">
                    <Card className="rounded-[2rem] bg-indigo-600 text-white border-none shadow-xl shadow-indigo-500/30">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button 
                                className="w-full justify-start h-12 rounded-xl bg-white/10 hover:bg-white/20 font-bold border-none"
                                onClick={() => window.location.href = '/platform-admin/stores'}
                            >
                                <Search className="mr-2 h-4 w-4" /> Verify a License
                            </Button>
                            <Button 
                                className="w-full justify-start h-12 rounded-xl bg-white/10 hover:bg-white/20 font-bold border-none"
                                onClick={() => window.location.href = '/platform-admin/users'}
                            >
                                <Users className="mr-2 h-4 w-4" /> Manage Access
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">System Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-slate-500">API Latency</span>
                                <span className="text-green-600">24ms (Healthy)</span>
                            </div>
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-slate-500">Database</span>
                                <span className="text-green-600">Connected</span>
                            </div>
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-slate-500">Storage</span>
                                <span className="text-indigo-600">45% Used</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
