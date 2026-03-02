"use client";

import {
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    Download,
    Calendar,
    Wallet,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePlatformStats, usePlatformPayments } from "@/hooks/use-platform-admin";

export default function PlatformPaymentsPage() {
    const { data: stats, isLoading: statsLoading } = usePlatformStats();
    const { data: payments, isLoading: paymentsLoading } = usePlatformPayments();

    const totalRevenue = stats?.totalRevenue || 0;
    const platformCommission = Math.round(totalRevenue * 0.05); // 5% commission
    const pendingPayouts = Math.round(totalRevenue * 0.15); // Mock pending payouts

    if (statsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-slate-500">Loading financial data...</span>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Track commissions, revenue, and store payouts.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                        <Calendar className="mr-2 h-4 w-4" /> This Month
                    </Button>
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                        <Download className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-2xl border-none shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Revenue</CardTitle>
                        <Wallet className="h-5 w-5 text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">₹{(totalRevenue / 100).toLocaleString()}</div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <span className="text-green-400 font-bold flex items-center gap-0.5"><ArrowUpRight size={12} /> +{stats?.monthlyGrowth || 0}%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Platform Commission</CardTitle>
                        <TrendingUp className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">₹{(platformCommission / 100).toLocaleString()}</div>
                        <p className="text-xs text-slate-400 mt-1 font-medium">at 5% commission rate</p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending Payouts</CardTitle>
                        <CreditCard className="h-5 w-5 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">₹{(pendingPayouts / 100).toLocaleString()}</div>
                        <p className="text-xs text-slate-400 mt-1 font-medium">To {stats?.activeStores || 0} Stores</p>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction History */}
            <Card className="rounded-[2rem] border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="font-bold text-slate-900">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-bold text-xs uppercase text-slate-500">Transaction ID</TableHead>
                                <TableHead className="font-bold text-xs uppercase text-slate-500">Store</TableHead>
                                <TableHead className="font-bold text-xs uppercase text-slate-500">Date</TableHead>
                                <TableHead className="font-bold text-xs uppercase text-slate-500">Amount</TableHead>
                                <TableHead className="font-bold text-xs uppercase text-slate-500">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paymentsLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span className="text-slate-500">Loading transactions...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : payments && payments.length > 0 ? (
                                payments.map((txn) => (
                                    <TableRow key={txn.id}>
                                        <TableCell className="font-mono text-slate-600 text-xs">{txn.id}</TableCell>
                                        <TableCell className="font-bold text-slate-900">Store #{txn.orderId.split('-')[1]}</TableCell>
                                        <TableCell className="text-slate-500 text-sm">{new Date(txn.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-bold text-slate-900">₹{txn.amount}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={txn.status === 'Success' ? 'outline' : txn.status === 'Pending' ? 'secondary' : 'destructive'}
                                                className={`rounded-md border-none ${
                                                    txn.status === 'Success' ? 'bg-green-50 text-green-700' :
                                                    txn.status === 'Pending' ? 'bg-orange-50 text-orange-700' :
                                                    'bg-red-50 text-red-700'
                                                }`}
                                            >
                                                {txn.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                        No transactions found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
