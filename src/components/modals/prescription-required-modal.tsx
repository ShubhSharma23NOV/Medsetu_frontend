"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";

interface PrescriptionRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPrescriptionUploaded: (prescriptionId: string) => void;
    rxMedicines: Array<{ name: string; }>;
    pincode?: string;
}

export function PrescriptionRequiredModal({ 
    isOpen, 
    onClose, 
    onPrescriptionUploaded, 
    rxMedicines,
    pincode 
}: PrescriptionRequiredModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Invalid file type", {
                    description: "Please upload a JPG, PNG, or PDF file.",
                });
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File too large", {
                    description: "Please upload a file smaller than 5MB.",
                });
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("No file selected", {
                description: "Please select a prescription file to upload.",
            });
            return;
        }

        setIsUploading(true);
        
        try {
            const formData = new FormData();
            formData.append('prescription', selectedFile);
            
            // Add pincode if available for store assignment
            if (pincode) {
                formData.append('pincode', pincode);
            }
            
            // Add medicine IDs for better store assignment (check availability)
            if (rxMedicines && rxMedicines.length > 0) {
                const medicineIds = rxMedicines
                    .map((med: any) => med.id)
                    .filter((id: any) => id)
                    .join(',');
                if (medicineIds) {
                    formData.append('medicineIds', medicineIds);
                }
            }
            
            // Get auth token from localStorage
            const token = localStorage.getItem('auth-token');
            
            if (!token) {
                throw new Error('Authentication required. Please log in.');
            }
            
            // Upload prescription to backend
            const response = await fetch('http://localhost:3001/api/prescriptions/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Upload failed with status ${response.status}`);
            }
            
            const result = await response.json();
            
            toast.success("Prescription uploaded successfully!", {
                description: "Your prescription has been submitted for verification.",
            });
            
            onPrescriptionUploaded(result.id?.toString() || result.prescriptionId?.toString());
            
        } catch (error: any) {
            console.error('Prescription upload error:', error);
            toast.error("Upload failed", {
                description: error.message || "Failed to upload prescription. Please try again.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Prescription Required
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800 font-medium mb-2">
                            The following medicines require a valid prescription:
                        </p>
                        <ul className="text-sm text-red-700 space-y-1">
                            {rxMedicines.map((medicine, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {medicine.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="prescription-file" className="text-sm font-medium">
                            Upload Prescription (JPG, PNG, or PDF)
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                                id="prescription-file"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <label
                                htmlFor="prescription-file"
                                className="cursor-pointer flex flex-col items-center gap-2"
                            >
                                <Upload className="h-8 w-8 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Click to upload prescription
                                </span>
                                <span className="text-xs text-gray-500">
                                    Max file size: 5MB
                                </span>
                            </label>
                        </div>
                        
                        {selectedFile && (
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700 flex-1">
                                    {selectedFile.name}
                                </span>
                                <button
                                    onClick={() => setSelectedFile(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-800">
                            <strong>Note:</strong> Your prescription will be verified by our licensed pharmacist before order processing. 
                            Please ensure the prescription is clear, valid, and matches the medicines in your cart.
                        </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            className="flex-1"
                            disabled={!selectedFile || isUploading}
                        >
                            {isUploading ? "Uploading..." : "Upload & Continue"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}