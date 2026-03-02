"use client";

import { useState } from "react";
import {
    FileText,
    CheckCircle2,
    XCircle,
    ZoomIn,
    Download,
    Eye,
    MessageSquare,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";

// Backend base URL for static files (without /api)
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePrescriptions, useUpdatePrescriptionStatus } from "@/hooks/use-prescriptions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function PrescriptionsPage() {
    const { data: prescriptions = [], isLoading, error } = usePrescriptions();
    const updateStatusMutation = useUpdatePrescriptionStatus();
    const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await updateStatusMutation.mutateAsync({ id, status });
            toast.success(`Prescription ${status.toLowerCase()}`, {
                description: `Prescription #${id} has been ${status.toLowerCase()}.`
            });
            setSelectedPrescription(null);
        } catch (error: any) {
            toast.error("Failed to update prescription", {
                description: error.message || "Please try again."
            });
        }
    };

    const formatTimeAgo = (date: string) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return 'bg-orange-500';
            case 'APPROVED':
                return 'bg-green-500';
            case 'REJECTED':
                return 'bg-red-500';
            default:
                return 'bg-slate-500';
        }
    };

    const pendingCount = prescriptions.filter((p: any) => p.status === 'PENDING').length;

    if (isLoading) {
        return (
            <div className="h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading prescriptions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex items-center justify-center">
                <div className="text-center">
                    <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-red-500 font-medium">Failed to load prescriptions</p>
                    <p className="text-slate-400 text-sm mt-2">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-8 md:p-10 bg-white border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Parchi (Prescriptions)</h1>
                    <p className="text-slate-500 font-medium mt-1">Review uploaded prescriptions and create orders.</p>
                </div>
                {pendingCount > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-red-500 uppercase tracking-widest">{pendingCount} Pending Review</span>
                    </div>
                )}
            </div>

            {/* Grid */}
            <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prescriptions.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-400 mb-2">No Prescriptions</h3>
                        <p className="text-slate-400">No prescriptions have been uploaded yet.</p>
                    </div>
                ) : (
                    prescriptions.map((rx: any, i: number) => (
                        <motion.div
                            key={rx.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                        >
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-slate-100">
                                {rx.imageUrl.endsWith('.pdf') ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                                        <FileText className="h-16 w-16 text-slate-400" />
                                    </div>
                                ) : (
                                    <Image
                                        src={`${BACKEND_URL}${rx.imageUrl}`}
                                        alt="Prescription"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800";
                                        }}
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button 
                                                variant="secondary" 
                                                size="sm" 
                                                className="rounded-xl font-bold"
                                                onClick={() => setSelectedPrescription(rx)}
                                            >
                                                <ZoomIn size={16} className="mr-2" /> View
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden rounded-3xl bg-slate-900 border-none">
                                            <DialogTitle className="sr-only">
                                                Prescription Review - {rx.patientName || 'Patient'}
                                            </DialogTitle>
                                            <div className="relative w-full h-full flex flex-col md:flex-row">
                                                {/* Image/PDF Viewer */}
                                                <div className="flex-1 relative bg-black flex items-center justify-center p-4">
                                                    {rx.imageUrl.endsWith('.pdf') ? (
                                                        <iframe
                                                            src={`${BACKEND_URL}${rx.imageUrl}`}
                                                            className="w-full h-full"
                                                            title="Prescription PDF"
                                                        />
                                                    ) : (
                                                        <div className="relative w-full h-full max-h-[80vh]">
                                                            <Image 
                                                                src={`${BACKEND_URL}${rx.imageUrl}`} 
                                                                alt="Full Rx" 
                                                                fill 
                                                                className="object-contain"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800";
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Sidebar */}
                                                <div className="w-full md:w-96 bg-white p-8 flex flex-col h-full overflow-y-auto">
                                                    <div className="mb-8">
                                                        <h2 className="text-2xl font-black text-slate-900">{rx.patientName || 'Patient'}</h2>
                                                        <p className="text-slate-500 font-medium">
                                                            {rx.age ? `${rx.age} • ` : ''}{rx.doctorName || 'Self Upload'}
                                                        </p>
                                                        <div className="mt-4 p-4 rounded-xl bg-slate-50 text-xs font-bold text-slate-500 border border-slate-100">
                                                            Rx ID: <span className="text-slate-900">RX-{rx.id}</span> <br />
                                                            Uploaded: {formatTimeAgo(rx.createdAt)}
                                                        </div>
                                                        {rx.customer && (
                                                            <div className="mt-3 p-4 rounded-xl bg-blue-50 text-xs font-bold text-blue-700 border border-blue-100">
                                                                Customer: {rx.customer.name}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <Badge className={`${getStatusColor(rx.status)} text-white`}>
                                                            {rx.status}
                                                        </Badge>
                                                    </div>

                                                    {rx.status === 'PENDING' && (
                                                        <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
                                                            <Button 
                                                                className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black shadow-lg shadow-green-500/20"
                                                                onClick={() => handleStatusUpdate(rx.id.toString(), 'APPROVED')}
                                                                disabled={updateStatusMutation.isPending}
                                                            >
                                                                <CheckCircle2 className="mr-2" /> Accept & Create Order
                                                            </Button>
                                                            <Button 
                                                                variant="outline" 
                                                                className="w-full h-12 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 font-black"
                                                                onClick={() => handleStatusUpdate(rx.id.toString(), 'REJECTED')}
                                                                disabled={updateStatusMutation.isPending}
                                                            >
                                                                <XCircle className="mr-2" /> Reject Prescription
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <Badge className={`${getStatusColor(rx.status)} border-white shadow-sm text-white`}>
                                        {rx.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-black text-slate-900 text-lg">{rx.patientName || 'Patient'}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{rx.doctorName || 'Self Upload'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400">{formatTimeAgo(rx.createdAt)}</p>
                                </div>
                            </div>

                            {rx.status === 'PENDING' && (
                                <div className="mt-6 flex gap-2">
                                    <Button 
                                        className="flex-1 rounded-xl bg-slate-900 text-white font-bold h-10 shadow-lg shadow-slate-900/10"
                                        onClick={() => setSelectedPrescription(rx)}
                                    >
                                        Verify Now
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
