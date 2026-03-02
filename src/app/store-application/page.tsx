"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Store,
    MapPin,
    Phone,
    FileText,
    User,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreApplication, useSubmitStoreApplication } from "@/hooks/use-store-application";
import { useAuthStore } from "@/lib/auth-store";
import { motion } from "framer-motion";

export default function StoreApplicationPage() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const { data: applicationStatus, isLoading } = useStoreApplication();
    const submitApplication = useSubmitStoreApplication();
    
    const [formData, setFormData] = useState({
        storeName: '',
        storeStreet: '',
        storeCity: '',
        storeState: '',
        storePincode: '',
        storePhone: '',
        licenseNumber: '',
        ownerName: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Combine address fields
            const fullAddress = `${formData.storeStreet}, ${formData.storeCity}, ${formData.storeState} - ${formData.storePincode}`;
            
            await submitApplication.mutateAsync({
                storeName: formData.storeName,
                storeAddress: fullAddress,
                storePhone: formData.storePhone,
                licenseNumber: formData.licenseNumber,
                ownerName: formData.ownerName,
            });
        } catch (error) {
            console.error('Failed to submit application:', error);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading application status...</p>
                </div>
            </div>
        );
    }

    // Show different UI based on application status
    if (applicationStatus?.storeStatus === 'APPROVED') {
        // Redirect to admin dashboard if approved
        router.push('/admin');
        return null;
    }

    if (applicationStatus?.storeStatus === 'REJECTED') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader className="text-center">
                            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <XCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <CardTitle className="text-red-900">Application Rejected</CardTitle>
                            <CardDescription className="text-red-700">
                                Your store application has been rejected by the admin.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {applicationStatus.rejectionReason && (
                                <div className="p-4 bg-red-100 rounded-lg">
                                    <h4 className="font-semibold text-red-900 mb-2">Rejection Reason:</h4>
                                    <p className="text-red-800 text-sm">{applicationStatus.rejectionReason}</p>
                                </div>
                            )}
                            <div className="flex flex-col gap-3">
                                <Button 
                                    onClick={() => window.location.href = 'mailto:admin@medsetu.com'}
                                    className="w-full bg-red-600 hover:bg-red-700"
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Contact Admin
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        // Logout and redirect to login
                                        logout();
                                        window.location.href = '/login';
                                    }}
                                    className="w-full border-red-200 text-red-700 hover:bg-red-50"
                                >
                                    Back to Login
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    if (applicationStatus?.storeStatus === 'PENDING') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <Card className="border-orange-200 bg-orange-50">
                        <CardHeader className="text-center">
                            <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-8 w-8 text-orange-600" />
                            </div>
                            <CardTitle className="text-orange-900">Application Under Review</CardTitle>
                            <CardDescription className="text-orange-700">
                                Your store application is being reviewed by our admin team.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-orange-100 rounded-lg">
                                <h4 className="font-semibold text-orange-900 mb-2">Application Details:</h4>
                                <div className="space-y-2 text-sm text-orange-800">
                                    <p><strong>Store Name:</strong> {applicationStatus.storeName}</p>
                                    <p><strong>Owner:</strong> {applicationStatus.ownerName}</p>
                                    <p><strong>License:</strong> {applicationStatus.licenseNumber}</p>
                                </div>
                            </div>
                            <div className="text-center text-sm text-orange-700">
                                <p>We'll notify you via email once the review is complete.</p>
                                <p className="mt-2">Expected review time: 1-2 business days</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button 
                                    onClick={() => window.location.href = 'mailto:admin@medsetu.com'}
                                    className="w-full"
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Contact Admin
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        // Logout and redirect to login
                                        logout();
                                        window.location.href = '/login';
                                    }}
                                    className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                                >
                                    Back to Login
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    // Show application form for new applications
    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Store className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Complete Your Store Application</h1>
                    <p className="text-slate-600">Provide your store details to get started with MedSetu</p>
                </motion.div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Store Information
                        </CardTitle>
                        <CardDescription>
                            Fill in your pharmacy details for admin approval
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName" className="text-sm font-semibold text-slate-700">
                                        Store Name *
                                    </Label>
                                    <div className="relative">
                                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="storeName"
                                            value={formData.storeName}
                                            onChange={(e) => handleInputChange('storeName', e.target.value)}
                                            placeholder="e.g., Apollo Pharmacy"
                                            className="pl-10 h-12 rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ownerName" className="text-sm font-semibold text-slate-700">
                                        Owner Name *
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="ownerName"
                                            value={formData.ownerName}
                                            onChange={(e) => handleInputChange('ownerName', e.target.value)}
                                            placeholder="Your full name"
                                            className="pl-10 h-12 rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="storePhone" className="text-sm font-semibold text-slate-700">
                                        Phone Number *
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="storePhone"
                                            value={formData.storePhone}
                                            onChange={(e) => handleInputChange('storePhone', e.target.value)}
                                            placeholder="+91 98765 43210"
                                            className="pl-10 h-12 rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="licenseNumber" className="text-sm font-semibold text-slate-700">
                                        Drug License Number *
                                    </Label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="licenseNumber"
                                            value={formData.licenseNumber}
                                            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                                            placeholder="DL-XX-XXXX-XXXXX"
                                            className="pl-10 h-12 rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">
                                    Store Address *
                                </Label>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            value={formData.storeStreet}
                                            onChange={(e) => handleInputChange('storeStreet', e.target.value)}
                                            placeholder="Street Address (e.g., 123 Main Street, Vijay Nagar)"
                                            className="pl-10 h-12 rounded-xl"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            value={formData.storeCity}
                                            onChange={(e) => handleInputChange('storeCity', e.target.value)}
                                            placeholder="City (e.g., Indore)"
                                            className="h-12 rounded-xl"
                                            required
                                        />
                                        <Input
                                            value={formData.storeState}
                                            onChange={(e) => handleInputChange('storeState', e.target.value)}
                                            placeholder="State (e.g., Madhya Pradesh)"
                                            className="h-12 rounded-xl"
                                            required
                                        />
                                    </div>
                                    <Input
                                        value={formData.storePincode}
                                        onChange={(e) => handleInputChange('storePincode', e.target.value)}
                                        placeholder="Pincode (e.g., 452001)"
                                        className="h-12 rounded-xl"
                                        maxLength={6}
                                        pattern="[0-9]{6}"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-semibold mb-1">Important Notes:</p>
                                        <ul className="space-y-1 text-xs">
                                            <li>• Ensure your drug license is valid and up-to-date</li>
                                            <li>• All information will be verified by our admin team</li>
                                            <li>• You'll receive an email notification once reviewed</li>
                                            <li>• Review process typically takes 1-2 business days</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/login')}
                                    className="flex-1 h-12 rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitApplication.isPending}
                                    className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
                                >
                                    {submitApplication.isPending ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Submit Application
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}