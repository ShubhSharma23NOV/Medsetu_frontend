"use client";

import {
    Settings,
    Shield,
    CreditCard,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PlatformSettingsPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Settings</h1>
                    <p className="text-slate-500 font-medium mt-1">Configure system-wide preferences and controls.</p>
                </div>
                <Button className="rounded-xl bg-slate-900 text-white font-bold shadow-xl shadow-slate-900/20">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </div>

            <Card className="rounded-[2rem] border-none shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="font-bold text-slate-900">General Configuration</CardTitle>
                            <CardDescription>Control critical system states.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div>
                            <h3 className="font-bold text-slate-900">Maintenance Mode</h3>
                            <p className="text-xs text-slate-500">Suspend all customer access. Only admins can login.</p>
                        </div>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div>
                            <h3 className="font-bold text-slate-900">New Store Registrations</h3>
                            <p className="text-xs text-slate-500">Allow new pharmacies to sign up.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="font-bold text-slate-900">Financial Settings</CardTitle>
                            <CardDescription>Manage fees and payout schedules.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-500 uppercase text-xs">Platform Commission (%)</Label>
                            <Input defaultValue="5" className="font-bold text-slate-900 bg-slate-50 border-none h-11" />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-500 uppercase text-xs">Min Payout Threshold (₹)</Label>
                            <Input defaultValue="1000" className="font-bold text-slate-900 bg-slate-50 border-none h-11" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
