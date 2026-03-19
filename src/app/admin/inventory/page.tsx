"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE_URL } from "@/lib/api-config";
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Package, 
    IndianRupee, 
    AlertTriangle,
    CheckCircle,
    Pill,
    Filter,
    Upload,
    Download,
    FileSpreadsheet,
    Loader2,
    BarChart3,
    FileText
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useMedicines } from "@/hooks/use-medicines";
import { useStoreInventory, useAddMedicine, useUpdateMedicine, useDeleteMedicine } from "@/hooks/use-store-inventory";
import { medicineService } from "@/lib/medicine-service";
import { storeInventoryService } from "@/lib/store-inventory-service";
import { Medicine } from "@/types";
import { InventoryDashboard } from "@/components/inventory/inventory-dashboard";

const categories = [
    "Pain Relief",
    "Antibiotics", 
    "Diabetes",
    "Heart Care",
    "Vitamins",
    "Ayurvedic",
    "First Aid",
    "Baby Care",
    "Skin Care",
    "Other"
];

const healthConditions = [
    "Diabetes Care",
    "Cardiac Care",
    "Stomach Care",
    "Pain Relief",
    "Liver Care",
    "Oral Care",
    "Respiratory",
    "Sexual Health",
    "Elderly Care",
    "Cold & Immunity",
    "General Health"
];

// Download template function (shared)
const downloadTemplate = () => {
    // Create sample Excel template with all required fields
    const sampleData = [
        { 
            name: "Paracetamol 500mg", 
            price: 25.50, 
            category: "Pain Relief", 
            healthCondition: "Pain Relief",
            brand: "Cipla",
            dosage: "500mg",
            expiryDate: "2026-12-31",
            description: "Pain reliever and fever reducer",
            quantity: 100,
            inStock: true, 
            rxRequired: false 
        },
        { 
            name: "Amoxicillin 250mg", 
            price: 45.00, 
            category: "Antibiotics", 
            healthCondition: "General Health",
            brand: "Sun Pharma",
            dosage: "250mg",
            expiryDate: "2027-06-30",
            description: "Antibiotic for bacterial infections",
            quantity: 50,
            inStock: true, 
            rxRequired: true 
        },
        { 
            name: "Vitamin D3 2000IU", 
            price: 180.25, 
            category: "Vitamins", 
            healthCondition: "General Health",
            brand: "HealthKart",
            dosage: "2000IU",
            expiryDate: "2028-03-15",
            description: "Vitamin D supplement",
            quantity: 200,
            inStock: true, 
            rxRequired: false 
        }
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
        + "name,price,category,healthCondition,brand,dosage,expiryDate,description,quantity,inStock,rxRequired\n"
        + sampleData.map(row => `"${row.name}",${row.price},"${row.category}","${row.healthCondition}","${row.brand}","${row.dosage}","${row.expiryDate}","${row.description}",${row.quantity},${row.inStock},${row.rxRequired}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "medicine_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Template downloaded", {
        description: "Use this template to format your medicine data."
    });
};

// Bulk Upload Dialog Component
function BulkUploadDialog({ onUploadSuccess }: { onUploadSuccess: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const downloadTemplate = async () => {
        try {
            const token = localStorage.getItem('auth-token');
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

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (['csv', 'xlsx', 'xls'].includes(fileExtension || '')) {
                setSelectedFile(file);
            } else {
                toast.error("Invalid file type", {
                    description: "Please select an Excel (.xlsx, .xls) or CSV file."
                });
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("No file selected", {
                description: "Please select a file to upload."
            });
            return;
        }

        setIsUploading(true);

        try {
            // Use the store inventory service which includes authentication
            const result = await storeInventoryService.bulkUploadMedicines(selectedFile);

            toast.success("Bulk upload successful!", {
                description: `${result.successCount} medicines added successfully.`
            });
            
            if (result.errors && result.errors.length > 0) {
                console.warn('Upload errors:', result.errors);
                toast.warning("Some rows had errors", {
                    description: `${result.errors.length} rows were skipped. Check console for details.`
                });
            }

            setIsOpen(false);
            setSelectedFile(null);
            onUploadSuccess();
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';
            toast.error("Upload failed", {
                description: errorMessage
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl font-bold border-2 hover:bg-slate-50">
                    <Upload className="h-5 w-5 mr-2" />
                    Bulk Upload
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <FileSpreadsheet className="h-8 w-8 text-primary" />
                        Bulk Upload Medicines
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                    {/* Instructions */}
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <h4 className="font-bold text-blue-900 mb-2">Upload Instructions:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Upload Excel (.xlsx, .xls) or CSV files</li>
                            <li>• Required: name, price, category, healthCondition, brand, dosage, expiryDate</li>
                            <li>• Optional: description, quantity, inStock, rxRequired, imageUrl</li>
                            <li>• Download template for correct format with sample data</li>
                        </ul>
                    </div>

                    {/* Download Template */}
                    <Button 
                        variant="outline" 
                        className="w-full h-12 rounded-xl"
                        onClick={downloadTemplate}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                    </Button>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-700">Select File</Label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <FileSpreadsheet className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm font-medium text-slate-600">
                                    {selectedFile ? selectedFile.name : "Click to select Excel or CSV file"}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Supports .xlsx, .xls, .csv files
                                </p>
                            </label>
                        </div>
                    </div>

                    {/* Upload Button */}
                    <div className="flex gap-3 pt-4">
                        <Button 
                            variant="outline" 
                            className="flex-1 h-12 rounded-xl"
                            onClick={() => setIsOpen(false)}
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="flex-1 h-12 rounded-xl font-bold"
                            onClick={handleUpload}
                            disabled={!selectedFile || isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Medicines
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function InventoryPage() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [activeTab, setActiveTab] = useState("overview");
    
    // Form state
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        healthCondition: "",
        inStock: true,
        rxRequired: false,
        description: "",
        brand: "",
        dosage: "",
        quantity: "0",
        expiryDate: ""
    });

    const { data: medicines = [], isLoading, refetch } = useStoreInventory(searchTerm, categoryFilter === "all" ? undefined : categoryFilter);
    const addMedicineMutation = useAddMedicine();
    const updateMedicineMutation = useUpdateMedicine();
    const deleteMedicineMutation = useDeleteMedicine();

    // Filter medicines based on search and category (filtering is now done on backend)
    const filteredMedicines = medicines;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const medicineData = {
                name: formData.name,
                price: parseFloat(formData.price),
                category: formData.category,
                healthCondition: formData.healthCondition,
                inStock: formData.inStock,
                rxRequired: formData.rxRequired,
                description: formData.description,
                brand: formData.brand,
                dosage: formData.dosage,
                quantity: parseInt(formData.quantity) || 0,
                expiryDate: new Date(formData.expiryDate).toISOString()
            };

            if (editingMedicine) {
                await updateMedicineMutation.mutateAsync({ 
                    id: editingMedicine.id.toString(), 
                    data: medicineData 
                });
                toast.success("Medicine updated successfully!", {
                    description: `${formData.name} has been updated in inventory.`
                });
            } else {
                await addMedicineMutation.mutateAsync(medicineData);
                toast.success("Medicine added successfully!", {
                    description: `${formData.name} has been added to inventory.`
                });
            }
            
            // Reset form
            setFormData({
                name: "",
                price: "",
                category: "",
                healthCondition: "",
                inStock: true,
                rxRequired: false,
                description: "",
                brand: "",
                dosage: "",
                quantity: "0",
                expiryDate: ""
            });
                
            setIsAddDialogOpen(false);
            setEditingMedicine(null);
        } catch (error) {
            toast.error("Error saving medicine", {
                description: "Please try again."
            });
        }
    };

    const handleEdit = (medicine: Medicine) => {
        setEditingMedicine(medicine);
        setFormData({
            name: medicine.name,
            price: medicine.price.toString(),
            category: medicine.category || "",
            healthCondition: medicine.healthCondition || "",
            inStock: medicine.inStock,
            rxRequired: medicine.rxRequired,
            description: medicine.description || "",
            brand: medicine.brand || "",
            dosage: medicine.dosage || "",
            quantity: "0",
            expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().split('T')[0] : ""
        });
        setIsAddDialogOpen(true);
    };

    const handleDelete = async (id: string | number, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;

        try {
            await deleteMedicineMutation.mutateAsync(id.toString());
            toast.success("Medicine deleted", {
                description: `${name} has been removed from inventory.`
            });
        } catch (error) {
            toast.error("Error deleting medicine", {
                description: "Please try again."
            });
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            category: "",
            healthCondition: "",
            inStock: true,
            rxRequired: false,
            description: "",
            brand: "",
            dosage: "",
            quantity: "0",
            expiryDate: ""
        });
        setEditingMedicine(null);
    };

    return (
        <div className="h-full bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-8 md:p-12 overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Package className="h-10 w-10 text-primary" />
                        Medicine Inventory
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Manage your pharmacy's medicine stock and pricing
                    </p>
                </div>

                <div className="flex gap-3">
                    {/* Bulk Upload Button */}
                    <BulkUploadDialog onUploadSuccess={refetch} />
                    
                    <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                        setIsAddDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="h-14 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20">
                                <Plus className="h-5 w-5 mr-2" />
                                Add New Medicine
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-slate-900">
                                    {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
                                </DialogTitle>
                            </DialogHeader>
                            
                            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-sm font-bold text-slate-700">Medicine Name</Label>
                                        <Input
                                            placeholder="e.g., Paracetamol 500mg"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="h-12 rounded-xl"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-slate-700">Brand</Label>
                                        <Input
                                            placeholder="e.g., Cipla, Generic"
                                            value={formData.brand}
                                            onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                            className="h-12 rounded-xl"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-slate-700">Dosage</Label>
                                        <Input
                                            placeholder="e.g., 500mg, 10ml"
                                            value={formData.dosage}
                                            onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                                            className="h-12 rounded-xl"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-slate-700">Price (₹)</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                            className="h-12 rounded-xl"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-slate-700">Quantity</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-slate-700">Expiry Date</Label>
                                        <Input
                                            type="date"
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                                            className="h-12 rounded-xl"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-sm font-bold text-slate-700">Category</Label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            className="w-full h-12 rounded-xl bg-slate-50 border-none px-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                            required
                                        >
                                            <option value="" className="text-slate-500">Select category</option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat} className="text-slate-900">
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-sm font-bold text-slate-700">Health Condition</Label>
                                        <select
                                            value={formData.healthCondition}
                                            onChange={(e) => setFormData({...formData, healthCondition: e.target.value})}
                                            className="w-full h-12 rounded-xl bg-slate-50 border-none px-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                            required
                                        >
                                            <option value="" className="text-slate-500">Select health condition</option>
                                            {healthConditions.map((condition) => (
                                                <option key={condition} value={condition} className="text-slate-900">
                                                    {condition}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-sm font-bold text-slate-700">Description</Label>
                                        <Input
                                            placeholder="Brief description of the medicine"
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                                    <div>
                                        <Label className="text-sm font-bold text-slate-700">In Stock</Label>
                                        <p className="text-xs text-slate-500">Available for sale</p>
                                    </div>
                                    <Switch
                                        checked={formData.inStock}
                                        onCheckedChange={(checked) => setFormData({...formData, inStock: checked})}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                                    <div>
                                        <Label className="text-sm font-bold text-slate-700">Prescription Required</Label>
                                        <p className="text-xs text-slate-500">Needs doctor's prescription</p>
                                    </div>
                                    <Switch
                                        checked={formData.rxRequired}
                                        onCheckedChange={(checked) => setFormData({...formData, rxRequired: checked})}
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="flex-1 h-12 rounded-xl"
                                        onClick={() => setIsAddDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1 h-12 rounded-xl font-bold">
                                        {editingMedicine ? "Update Medicine" : "Add Medicine"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 h-12 rounded-2xl bg-slate-100 p-1">
                    <TabsTrigger value="overview" className="rounded-xl font-bold text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Overview & Alerts
                    </TabsTrigger>
                    <TabsTrigger value="medicines" className="rounded-xl font-bold text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                        <Package className="h-4 w-4 mr-2" />
                        Medicine List
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="rounded-2xl border-none bg-slate-900">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Total Medicines</p>
                                        <p className="text-3xl font-black text-white">
                                            {medicines.length}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                        <Package className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-none bg-slate-900">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">In Stock</p>
                                        <p className="text-3xl font-black text-green-500">
                                            {medicines.filter(m => m.inStock).length}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {medicines.length > 0 ? Math.round((medicines.filter(m => m.inStock).length / medicines.length) * 100) : 0}% of total
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-none bg-slate-900">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Out of Stock</p>
                                        <p className="text-3xl font-black text-orange-500">
                                            {medicines.filter(m => !m.inStock).length}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">Need restocking</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center">
                                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-none bg-slate-900">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Rx Required</p>
                                        <p className="text-3xl font-black text-purple-500">
                                            {medicines.filter(m => m.rxRequired).length}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">Prescription needed</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Category Breakdown */}
                    <Card className="rounded-2xl border-none bg-slate-900">
                        <CardHeader className="p-6 border-b border-slate-800">
                            <CardTitle className="text-white font-black">Category Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {medicines.length > 0 ? (
                                <div className="space-y-4">
                                    {Array.from(new Set(medicines.map(m => m.category).filter(Boolean))).map((category) => {
                                        const count = medicines.filter(m => m.category === category).length;
                                        const percentage = Math.round((count / medicines.length) * 100);
                                        return (
                                            <div key={category} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-white">{category}</span>
                                                    <span className="text-sm text-slate-400">{count} medicines ({percentage}%)</span>
                                                </div>
                                                <div className="w-full bg-slate-800 rounded-full h-2">
                                                    <div 
                                                        className="bg-primary h-2 rounded-full transition-all" 
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-slate-400 py-8">No medicines added yet</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="rounded-2xl border-none bg-slate-900">
                        <CardHeader className="p-6 border-b border-slate-800">
                            <CardTitle className="text-white font-black">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button 
                                    onClick={() => setIsAddDialogOpen(true)}
                                    className="rounded-xl h-12 font-bold"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Medicine
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => setActiveTab("medicines")}
                                    className="rounded-xl h-12 font-bold border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                                >
                                    <Package className="h-4 w-4 mr-2" />
                                    View All Medicines
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={downloadTemplate}
                                    className="rounded-xl h-12 font-bold border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Template
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="medicines" className="space-y-6">{/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                            <Input
                                placeholder="Search medicines..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 rounded-xl bg-slate-50 border-none"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full md:w-48 h-12 rounded-xl bg-slate-50 border-none">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Medicine Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center space-y-4">
                                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-slate-500 font-medium">Loading medicines...</p>
                            </div>
                        </div>
                    ) : filteredMedicines.length === 0 ? (
                        <div className="text-center py-20 space-y-4">
                            <Pill className="h-16 w-16 text-slate-300 mx-auto" />
                            <h3 className="text-xl font-bold text-slate-900">No medicines found</h3>
                            <p className="text-slate-500">
                                {searchTerm || categoryFilter !== "all" 
                                    ? "Try adjusting your search or filters" 
                                    : "Add your first medicine to get started"
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredMedicines.map((medicine: Medicine) => (
                                    <motion.div
                                        key={medicine.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        whileHover={{ y: -5 }}
                                        className="group"
                                    >
                                        <Card className="h-full rounded-2xl border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all">
                                            <CardHeader className="pb-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg font-bold text-slate-900 leading-tight mb-2">
                                                            {medicine.name}
                                                        </CardTitle>
                                                        {medicine.category && (
                                                            <Badge variant="secondary" className="text-xs font-bold">
                                                                {medicine.category}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                                                            onClick={() => handleEdit(medicine)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600"
                                                            onClick={() => handleDelete(medicine.id, medicine.name)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <IndianRupee className="h-4 w-4 text-slate-500" />
                                                        <span className="text-2xl font-black text-slate-900">
                                                            {medicine.price.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {medicine.inStock ? (
                                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                                In Stock
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="destructive">
                                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                                Out of Stock
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {medicine.rxRequired && (
                                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 border border-orange-200">
                                                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                                                        <span className="text-xs font-bold text-orange-700">
                                                            Prescription Required
                                                        </span>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}