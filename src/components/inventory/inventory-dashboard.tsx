"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Package, 
    AlertTriangle, 
    CheckCircle, 
    TrendingUp, 
    Calendar,
    Plus,
    Minus,
    Settings,
    Clock,
    Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
    useInventorySummary, 
    useLowStockAlerts, 
    useExpiryAlerts,
    useAdjustInventory,
    useUpdateExpiryDate
} from "@/hooks/use-inventory-management";

interface InventoryDashboardProps {
    className?: string;
}

export function InventoryDashboard({ className }: InventoryDashboardProps) {
    const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
    const [adjustmentData, setAdjustmentData] = useState({
        quantity: '',
        type: 'ADD' as 'ADD' | 'SUBTRACT' | 'SET',
        reason: ''
    });

    const { data: summary, isLoading: summaryLoading } = useInventorySummary();
    const { data: lowStockAlerts = [], isLoading: lowStockLoading } = useLowStockAlerts(10);
    const { data: expiryAlerts = [], isLoading: expiryLoading } = useExpiryAlerts(30);
    
    const adjustInventoryMutation = useAdjustInventory();
    const updateExpiryMutation = useUpdateExpiryDate();

    const handleAdjustInventory = async () => {
        if (!selectedMedicine || !adjustmentData.quantity || !adjustmentData.reason) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            await adjustInventoryMutation.mutateAsync({
                medicineId: selectedMedicine.medicineId,
                quantity: parseInt(adjustmentData.quantity),
                type: adjustmentData.type,
                reason: adjustmentData.reason
            });

            toast.success("Inventory adjusted successfully");
            setAdjustmentDialogOpen(false);
            setSelectedMedicine(null);
            setAdjustmentData({ quantity: '', type: 'ADD', reason: '' });
        } catch (error) {
            toast.error("Failed to adjust inventory");
        }
    };

    if (summaryLoading) {
        return (
            <div className={`space-y-6 ${className}`}>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Inventory Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="rounded-2xl border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Total Medicines</p>
                                    <p className="text-3xl font-black text-slate-900">{summary?.totalMedicines || 0}</p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="rounded-2xl border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">In Stock</p>
                                    <p className="text-3xl font-black text-green-600">{summary?.inStockMedicines || 0}</p>
                                    <p className="text-xs text-slate-500">{summary?.stockPercentage || 0}% of total</p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="rounded-2xl border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Low Stock</p>
                                    <p className="text-3xl font-black text-yellow-600">{summary?.lowStockMedicines || 0}</p>
                                    <p className="text-xs text-slate-500">Need restocking</p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="rounded-2xl border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Expiring Soon</p>
                                    <p className="text-3xl font-black text-red-600">{summary?.expiringMedicines || 0}</p>
                                    <p className="text-xs text-slate-500">Next 30 days</p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Alerts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alerts */}
                <Card className="rounded-2xl border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            Low Stock Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lowStockLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : lowStockAlerts.length === 0 ? (
                            <div className="text-center py-8">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                                <p className="text-sm text-slate-600">All medicines are well stocked!</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {lowStockAlerts.map((alert) => (
                                    <div key={alert.medicineId} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900">{alert.medicineName}</p>
                                            <p className="text-sm text-slate-600">
                                                Only {alert.currentStock} units left
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="rounded-lg"
                                            onClick={() => {
                                                setSelectedMedicine(alert);
                                                setAdjustmentDialogOpen(true);
                                            }}
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Restock
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Expiry Alerts */}
                <Card className="rounded-2xl border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-red-600" />
                            Expiry Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {expiryLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : expiryAlerts.length === 0 ? (
                            <div className="text-center py-8">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                                <p className="text-sm text-slate-600">No medicines expiring soon!</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {expiryAlerts.map((alert) => (
                                    <div key={alert.medicineId} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900">{alert.medicineName}</p>
                                            <p className="text-sm text-slate-600">
                                                Expires in {alert.daysUntilExpiry} days
                                            </p>
                                        </div>
                                        <Badge variant="destructive" className="text-xs">
                                            {alert.daysUntilExpiry} days
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Adjustment Dialog */}
            <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-900">
                            Adjust Inventory
                        </DialogTitle>
                    </DialogHeader>
                    
                    {selectedMedicine && (
                        <div className="space-y-6 mt-6">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="font-medium text-slate-900">{selectedMedicine.medicineName}</p>
                                <p className="text-sm text-slate-600">
                                    Current stock: {selectedMedicine.currentStock} units
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-slate-700">Adjustment Type</Label>
                                <Select 
                                    value={adjustmentData.type} 
                                    onValueChange={(value: 'ADD' | 'SUBTRACT' | 'SET') => 
                                        setAdjustmentData({...adjustmentData, type: value})
                                    }
                                >
                                    <SelectTrigger className="h-12 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADD">Add Stock</SelectItem>
                                        <SelectItem value="SUBTRACT">Remove Stock</SelectItem>
                                        <SelectItem value="SET">Set Exact Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-slate-700">Quantity</Label>
                                <Input
                                    type="number"
                                    placeholder="Enter quantity"
                                    value={adjustmentData.quantity}
                                    onChange={(e) => setAdjustmentData({...adjustmentData, quantity: e.target.value})}
                                    className="h-12 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-slate-700">Reason</Label>
                                <Input
                                    placeholder="e.g., New stock received, Damaged items removed"
                                    value={adjustmentData.reason}
                                    onChange={(e) => setAdjustmentData({...adjustmentData, reason: e.target.value})}
                                    className="h-12 rounded-xl"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 h-12 rounded-xl"
                                    onClick={() => setAdjustmentDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    className="flex-1 h-12 rounded-xl font-bold"
                                    onClick={handleAdjustInventory}
                                    disabled={adjustInventoryMutation.isPending}
                                >
                                    {adjustInventoryMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Adjusting...
                                        </>
                                    ) : (
                                        'Adjust Inventory'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}