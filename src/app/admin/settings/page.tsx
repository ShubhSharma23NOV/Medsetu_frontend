"use client";

import { useState, useEffect } from "react";
import {
    Settings,
    Store,
    MapPin,
    Phone,
    FileText,
    User,
    Save,
    Plus,
    X,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/use-store-settings";
import { toast } from "sonner";

export default function SettingsPage() {
    const { data: settings, isLoading } = useStoreSettings();
    const updateSettingsMutation = useUpdateStoreSettings();
    
    const [formData, setFormData] = useState({
        storeName: "",
        storeAddress: "",
        storePhone: "",
        licenseNumber: "",
        ownerName: "",
        isActive: true,
    });

    const [pincodes, setPincodes] = useState<string[]>([]);
    const [newPincode, setNewPincode] = useState("");

    // Update form when settings load - using useEffect properly
    useEffect(() => {
        if (settings) {
            setFormData({
                storeName: settings.storeName || "",
                storeAddress: settings.storeAddress || "",
                storePhone: settings.storePhone || "",
                licenseNumber: settings.licenseNumber || "",
                ownerName: settings.ownerName || "",
                isActive: settings.isActive ?? true,
            });
            
            // Parse pincodes
            if (settings.serviceablePincodes) {
                try {
                    const parsedPincodes = typeof settings.serviceablePincodes === 'string' 
                        ? JSON.parse(settings.serviceablePincodes)
                        : settings.serviceablePincodes;
                    setPincodes(Array.isArray(parsedPincodes) ? parsedPincodes : []);
                } catch (error) {
                    console.error('Failed to parse pincodes:', error);
                    setPincodes([]);
                }
            }
        }
    }, [settings]);

    const handleAddPincode = () => {
        if (newPincode.trim() && /^\d{6}$/.test(newPincode)) {
            if (!pincodes.includes(newPincode)) {
                setPincodes([...pincodes, newPincode]);
                setNewPincode("");
            } else {
                toast.error("Pincode already added");
            }
        } else {
            toast.error("Invalid pincode", {
                description: "Please enter a valid 6-digit pincode"
            });
        }
    };

    const handleRemovePincode = (pincode: string) => {
        setPincodes(pincodes.filter(p => p !== pincode));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await updateSettingsMutation.mutateAsync({
                ...formData,
                serviceablePincodes: pincodes,
            });
            
            toast.success("Settings updated successfully!", {
                description: "Your store settings have been saved."
            });
        } catch (error: any) {
            toast.error("Failed to update settings", {
                description: error.message || "Please try again"
            });
        }
    };

    if (isLoading) {
        return (
            <div className="h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-8 md:p-10 bg-white border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Settings className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Store Settings</h1>
                        <p className="text-slate-500 font-medium mt-1">Manage your store information and preferences</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto">
                <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                    {/* Store Information */}
                    <Card className="p-6 rounded-3xl border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Store className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-black text-slate-900">Store Information</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="storeName" className="text-sm font-bold text-slate-700">
                                    Store Name
                                </Label>
                                <Input
                                    id="storeName"
                                    value={formData.storeName}
                                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                    className="h-12 rounded-xl border-slate-200"
                                    placeholder="Enter store name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ownerName" className="text-sm font-bold text-slate-700">
                                    Owner Name
                                </Label>
                                <Input
                                    id="ownerName"
                                    value={formData.ownerName}
                                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                    className="h-12 rounded-xl border-slate-200"
                                    placeholder="Enter owner name"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="storeAddress" className="text-sm font-bold text-slate-700">
                                    Store Address
                                </Label>
                                <Input
                                    id="storeAddress"
                                    value={formData.storeAddress}
                                    onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                                    className="h-12 rounded-xl border-slate-200"
                                    placeholder="Enter complete address"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="storePhone" className="text-sm font-bold text-slate-700">
                                    Phone Number
                                </Label>
                                <Input
                                    id="storePhone"
                                    value={formData.storePhone}
                                    onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                                    className="h-12 rounded-xl border-slate-200"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="licenseNumber" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    License Number
                                    <Badge variant="outline" className="text-xs">Read-only</Badge>
                                </Label>
                                <Input
                                    id="licenseNumber"
                                    value={formData.licenseNumber}
                                    disabled
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50 cursor-not-allowed"
                                    placeholder="License number"
                                />
                                <p className="text-xs text-slate-500">License number cannot be modified</p>
                            </div>
                        </div>
                    </Card>

                    {/* Serviceable Pincodes */}
                    <Card className="p-6 rounded-3xl border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <MapPin className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-black text-slate-900">Serviceable Pincodes</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newPincode}
                                    onChange={(e) => setNewPincode(e.target.value)}
                                    className="h-12 rounded-xl border-slate-200"
                                    placeholder="Enter 6-digit pincode"
                                    maxLength={6}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddPincode();
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddPincode}
                                    className="h-12 px-6 rounded-xl bg-primary text-white font-bold"
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add
                                </Button>
                            </div>

                            {pincodes.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {pincodes.map((pincode) => (
                                        <Badge
                                            key={pincode}
                                            className="h-10 px-4 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-2"
                                        >
                                            <MapPin className="h-3 w-3" />
                                            {pincode}
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePincode(pincode)}
                                                className="ml-1 hover:text-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm italic">No pincodes added yet. Add pincodes to enable delivery service.</p>
                            )}
                        </div>
                    </Card>

                    {/* Store Status */}
                    <Card className="p-6 rounded-3xl border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 mb-1">Store Status</h2>
                                <p className="text-sm text-slate-500">
                                    {formData.isActive 
                                        ? "Your store is currently accepting orders" 
                                        : "Your store is currently closed for orders"}
                                </p>
                            </div>
                            <Switch
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                className="data-[state=checked]:bg-green-500"
                            />
                        </div>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={updateSettingsMutation.isPending}
                            className="h-12 px-8 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/20"
                        >
                            {updateSettingsMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Settings
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
