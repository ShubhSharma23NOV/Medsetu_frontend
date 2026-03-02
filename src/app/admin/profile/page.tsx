"use client";

import { useState, useEffect } from "react";
import {
    Store,
    MapPin,
    Clock,
    Truck,
    ShieldCheck,
    Save,
    Image as ImageIcon,
    Loader2,
    User,
    Mail,
    Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/use-profile";
import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/use-store-settings";
import { toast } from "sonner";

export default function StoreProfilePage() {
    const { data: user, isLoading: userLoading } = useCurrentUser();
    const { data: settings, isLoading: settingsLoading } = useStoreSettings();
    const updateSettingsMutation = useUpdateStoreSettings();

    const [formData, setFormData] = useState({
        storeName: "",
        storeAddress: "",
        storePhone: "",
        licenseNumber: "",
        ownerName: "",
        isActive: true,
    });

    // Update form when settings load
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
        }
    }, [settings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await updateSettingsMutation.mutateAsync(formData);
            
            toast.success("Profile updated successfully!", {
                description: "Your store profile has been saved."
            });
        } catch (error: any) {
            toast.error("Failed to update profile", {
                description: error.message || "Please try again"
            });
        }
    };

    if (userLoading || settingsLoading) {
        return (
            <div className="h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-y-auto">
            {/* Header */}
            <div className="p-8 md:p-10 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10 backdrop-blur-xl bg-white/80">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Store Profile</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your pharmacy details and settings.</p>
                </div>
                <Button 
                    onClick={handleSubmit}
                    disabled={updateSettingsMutation.isPending}
                    className="rounded-xl bg-primary text-white font-black shadow-xl shadow-primary/20"
                >
                    {updateSettingsMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </>
                    )}
                </Button>
            </div>

            <div className="max-w-4xl mx-auto p-8 space-y-8">

                {/* Profile Card */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/20">
                            {formData.storeName ? formData.storeName.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-slate-900">{formData.storeName || 'Your Store'}</h2>
                            <p className="text-sm text-slate-500 font-medium break-all">{user?.email || ''}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${formData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {formData.isActive ? 'Active' : 'Inactive'}
                                </div>
                                <div className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                    Verified Store
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Store size={14} /> Store Name
                            </Label>
                            <Input 
                                value={formData.storeName}
                                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-900" 
                                placeholder="Enter store name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <User size={14} /> Owner Name
                            </Label>
                            <Input 
                                value={formData.ownerName}
                                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-900" 
                                placeholder="Enter owner name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Mail size={14} /> Email Address
                            </Label>
                            <Input 
                                value={user?.email || ''} 
                                disabled 
                                className="h-12 rounded-xl bg-slate-100 border-none font-bold text-slate-500" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Phone size={14} /> Phone Number
                            </Label>
                            <Input 
                                value={formData.storePhone}
                                onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                                className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-900" 
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck size={14} /> License Number (DL)
                            </Label>
                            <Input 
                                value={formData.licenseNumber}
                                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-900" 
                                placeholder="Enter license number"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={14} /> Store Address
                            </Label>
                            <Input 
                                value={formData.storeAddress}
                                onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                                className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-900" 
                                placeholder="Enter complete address"
                            />
                        </div>
                    </div>
                </div>

                {/* Store Status */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                            <Store size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Store Status</h2>
                            <p className="text-sm text-slate-400 font-medium">Control whether your store accepts new orders.</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1">Accept Orders</h3>
                            <p className="text-xs text-slate-500 font-medium">
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
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-primary to-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-primary/20">
                    <h2 className="text-xl font-black mb-2">Need Help?</h2>
                    <p className="text-sm text-white/80 font-medium mb-6">
                        For advanced settings like serviceable pincodes, visit the Store Settings page.
                    </p>
                    <Button 
                        variant="secondary" 
                        className="rounded-xl font-bold"
                        onClick={() => window.location.href = '/admin/settings'}
                    >
                        Go to Settings
                    </Button>
                </div>
            </div>
        </div>
    );
}