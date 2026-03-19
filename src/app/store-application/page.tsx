"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Store,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStoreApplication } from "@/hooks/use-store-application";
import { useAuthStore } from "@/lib/auth-store";
import { motion } from "framer-motion";
import Link from "next/link";

export default function StoreApplicationPage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { data: applicationStatus, isLoading } = useStoreApplication();

    // Redirect if not a store user
    useEffect(() => {
        if (!isLoading && user?.role !== 'STORE') {
            router.push('/');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const getStatusIcon = () => {
        switch (applicationStatus?.storeStatus) {
            case 'APPROVED':
                return <CheckCircle2 className="h-16 w-16 text-green-500" />;
            case 'REJECTED':
                return <XCircle className="h-16 w-16 text-red-500" />;
            case 'PENDING':
                return <Clock className="h-16 w-16 text-yellow-500" />;
            default:
                return <AlertCircle className="h-16 w-16 text-gray-500" />;
        }
    };

    const getStatusBadge = () => {
        switch (applicationStatus?.storeStatus) {
            case 'APPROVED':
                return <Badge className="bg-green-500">Approved</Badge>;
            case 'REJECTED':
                return <Badge className="bg-red-500">Rejected</Badge>;
            case 'PENDING':
                return <Badge className="bg-yellow-500">Under Review</Badge>;
            default:
                return <Badge className="bg-gray-500">Not Submitted</Badge>;
        }
    };

    const getStatusMessage = () => {
        switch (applicationStatus?.storeStatus) {
            case 'APPROVED':
                return {
                    title: "Application Approved!",
                    description: "Congratulations! Your pharmacy has been approved. You can now start managing your inventory and accepting orders."
                };
            case 'REJECTED':
                return {
                    title: "Application Rejected",
                    description: applicationStatus.rejectionReason || "Your application was rejected. Please contact support for more information."
                };
            case 'PENDING':
                return {
                    title: "Application Under Review",
                    description: "Your pharmacy application is being reviewed by our team. We'll notify you via email once the review is complete."
                };
            default:
                return {
                    title: "No Application Found",
                    description: "We couldn't find your store application. Please contact support if you believe this is an error."
                };
        }
    };

    const statusInfo = getStatusMessage();

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Link href="/admin">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="rounded-2xl border-slate-200 shadow-lg">
                        <CardHeader className="text-center pb-8 pt-12">
                            <div className="flex justify-center mb-6">
                                {getStatusIcon()}
                            </div>
                            <div className="flex justify-center mb-4">
                                {getStatusBadge()}
                            </div>
                            <CardTitle className="text-3xl font-bold text-slate-900">
                                {statusInfo.title}
                            </CardTitle>
                            <CardDescription className="text-lg mt-4">
                                {statusInfo.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6 pb-12">
                            {applicationStatus && (
                                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <Store className="h-5 w-5" />
                                        Store Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-slate-500 font-medium">Store Name</p>
                                            <p className="text-slate-900 font-bold">{applicationStatus.storeName}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 font-medium">Owner Name</p>
                                            <p className="text-slate-900 font-bold">{applicationStatus.ownerName}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 font-medium">License Number</p>
                                            <p className="text-slate-900 font-bold">{applicationStatus.licenseNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 font-medium">Phone</p>
                                            <p className="text-slate-900 font-bold">{applicationStatus.storePhone}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-slate-500 font-medium">Address</p>
                                            <p className="text-slate-900 font-bold">{applicationStatus.storeAddress}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                                {applicationStatus?.storeStatus === 'APPROVED' && (
                                    <Link href="/admin">
                                        <Button size="lg" className="w-full sm:w-auto rounded-xl">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                )}
                                {applicationStatus?.storeStatus === 'PENDING' && (
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl" disabled>
                                        Waiting for Approval
                                    </Button>
                                )}
                                {applicationStatus?.storeStatus === 'REJECTED' && (
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl">
                                        Contact Support
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="mt-8 text-center text-sm text-slate-500">
                    <p>Need help? Contact us at <a href="mailto:support@medsetu.com" className="text-primary font-bold hover:underline">support@medsetu.com</a></p>
                </div>
            </div>
        </div>
    );
}
