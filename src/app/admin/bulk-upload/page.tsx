"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { API_BASE_URL } from "@/lib/api-config";
import { medicineService } from "@/lib/medicine-service";

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
    const [userInfo, setUserInfo] = useState<any>(null);

    // Check user info on mount
    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserInfo(payload);
                console.log('Current user:', JSON.stringify(payload, null, 2));
                console.log('User role:', payload.role);
                console.log('User ID:', payload.userId);
            } catch (e) {
                console.error('Failed to parse token:', e);
            }
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
            
            if (['csv', 'xlsx', 'xls'].includes(fileExtension || '')) {
                setFile(selectedFile);
                setUploadResult(null);
            } else {
                toast.error("Please select a CSV or Excel file (.csv, .xlsx, .xls)");
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file first");
            return;
        }

        setUploading(true);

        try {
            console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
            const result = await medicineService.bulkUploadMedicines(file);
            console.log('Upload result:', result);

            setUploadResult(result);
            toast.success(`Successfully uploaded ${result.successCount} medicines!`, {
                description: result.summary || `${result.successCount} medicines added successfully.`
            });
            
            if (result.errors && result.errors.length > 0) {
                console.warn('Upload errors:', result.errors);
                toast.warning(`${result.errorCount} rows had errors`, {
                    description: "Check console for details"
                });
            }
            
            setFile(null);
            // Reset file input
            const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error: any) {
            console.error('Upload error:', error);
            console.error('Error response:', JSON.stringify(error?.response, null, 2));
            console.error('Error data:', JSON.stringify(error?.response?.data, null, 2));
            console.error('Error status:', error?.response?.status);
            console.error('Error message from backend:', error?.response?.data?.message);
            
            let errorMessage = 'Upload failed';
            
            if (error?.response?.data) {
                // Backend returned structured error
                errorMessage = error.response.data.message 
                    || error.response.data.error
                    || JSON.stringify(error.response.data);
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            toast.error("Upload failed", {
                description: errorMessage,
                duration: 5000,
            });
            
            // Show specific guidance based on error
            if (errorMessage.includes('Store not found')) {
                toast.info("Action Required", {
                    description: "Please create a store first from the Store Application page, or login as a STORE user.",
                    duration: 7000,
                });
            }
        } finally {
            setUploading(false);
        }
    };

    const downloadTemplate = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                toast.error("Please login first");
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/medicines/bulk-upload/template`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to download template');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'medicine_bulk_upload_template.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            toast.success("Template downloaded successfully!");
        } catch (error) {
            console.error('Template download error:', error);
            toast.error("Failed to download template");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Bulk Medicine Upload</h1>
                <p className="text-slate-600">Upload multiple medicines at once using Excel (.xlsx, .xls) or CSV file</p>
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
                        Download the Excel template with sample data to see the required format for bulk upload. 
                        The template includes examples of different medicine categories and required fields.
                    </p>
                    <Button 
                        onClick={downloadTemplate}
                        variant="outline"
                        className="rounded-xl font-bold"
                    >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Download Excel Template (.xlsx)
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
                        Upload Excel or CSV File
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                        <input
                            type="file"
                            accept=".csv,.xlsx,.xls"
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
                                    {file ? file.name : "Click to select Excel or CSV file"}
                                </p>
                                <p className="text-sm text-slate-500">
                                    Supports .xlsx, .xls, and .csv formats
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
