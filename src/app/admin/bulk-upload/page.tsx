"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";

export default function BulkUploadPage() {
    return (
        <RoleGuard allowedRoles={['STORE', 'PLATFORM_ADMIN']}>
            <BulkUploadContent />
        </RoleGuard>
    );
}

function BulkUploadContent() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
                setFile(selectedFile);
                setUploadResult(null);
            } else {
                toast.error("Please select a CSV file");
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file first");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3001/api/medicines/bulk-upload', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const result = await response.json();

            if (response.ok) {
                setUploadResult(result);
                toast.success(`Successfully uploaded ${result.successCount} medicines!`);
                setFile(null);
            } else {
                toast.error(result.message || "Upload failed");
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error("Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    const downloadTemplate = () => {
        window.open('/medicine_template.csv', '_blank');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Bulk Medicine Upload</h1>
                <p className="text-slate-600">Upload multiple medicines at once using CSV file</p>
            </div>

            {/* Template Download */}
            <Card className="rounded-[2rem] border border-slate-200 shadow-sm bg-white">
                <CardHeader className="p-6 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-2 text-slate-900 font-black">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Download className="h-5 w-5" />
                        </div>
                        Download Template
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-slate-600 mb-4">
                        Download the CSV template to see the required format for bulk upload
                    </p>
                    <Button 
                        onClick={downloadTemplate}
                        variant="outline"
                        className="rounded-xl font-bold"
                    >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Download CSV Template
                    </Button>
                </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="rounded-[2rem] border border-slate-200 shadow-sm bg-white">
                <CardHeader className="p-6 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-2 text-slate-900 font-black">
                        <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <Upload className="h-5 w-5" />
                        </div>
                        Upload CSV File
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="csv-upload"
                        />
                        <label 
                            htmlFor="csv-upload"
                            className="cursor-pointer flex flex-col items-center gap-4"
                        >
                            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                                <FileSpreadsheet className="h-8 w-8 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-slate-900 font-bold mb-1">
                                    {file ? file.name : "Click to select CSV file"}
                                </p>
                                <p className="text-sm text-slate-500">
                                    or drag and drop your file here
                                </p>
                            </div>
                        </label>
                    </div>

                    <Button 
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="w-full rounded-xl h-12 font-bold"
                    >
                        {uploading ? "Uploading..." : "Upload Medicines"}
                    </Button>
                </CardContent>
            </Card>

            {/* Upload Results */}
            {uploadResult && (
                <Card className="rounded-[2rem] border border-slate-200 shadow-sm bg-white">
                    <CardHeader className="p-6 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-2 text-slate-900 font-black">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            Upload Results
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-green-50 rounded-xl p-4">
                                <p className="text-sm text-green-600 font-bold mb-1">Successful</p>
                                <p className="text-2xl font-black text-green-900">{uploadResult.successCount}</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-4">
                                <p className="text-sm text-red-600 font-bold mb-1">Failed</p>
                                <p className="text-2xl font-black text-red-900">{uploadResult.errorCount}</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4">
                                <p className="text-sm text-blue-600 font-bold mb-1">Total</p>
                                <p className="text-2xl font-black text-blue-900">{uploadResult.totalRows}</p>
                            </div>
                        </div>

                        {uploadResult.errors && uploadResult.errors.length > 0 && (
                            <div className="space-y-2">
                                <p className="font-bold text-slate-900 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                    Errors:
                                </p>
                                <div className="bg-red-50 rounded-xl p-4 space-y-2 max-h-60 overflow-y-auto">
                                    {uploadResult.errors.map((error: any, index: number) => (
                                        <p key={index} className="text-sm text-red-700">
                                            Row {error.row}: {error.error}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
