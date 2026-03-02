"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    MoreVertical,
    MapPin,
    Building2,
    Loader2,
    Plus,
    X,
    Save,
    Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { usePlatformStores, useUpdateStoreStatus, useCreateStore } from "@/hooks/use-platform-admin";
import { toast } from "sonner";

export default function StoresPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState<any>(null);
    const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [managementData, setManagementData] = useState({
        priority: 0,
        pincodes: "",
        isActive: true
    });
    const [newStoreData, setNewStoreData] = useState({
        name: "",
        ownerName: "",
        email: "",
        license: "",
        location: ""
    });
    
    const { data: stores, isLoading, error, refetch } = usePlatformStores(statusFilter || undefined);
    const updateStoreStatus = useUpdateStoreStatus();
    const createStore = useCreateStore();

    const filteredStores = stores?.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.owner.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleStatusUpdate = async (storeId: number, newStatus: string) => {
        try {
            await updateStoreStatus.mutateAsync({ id: storeId, status: newStatus });
            toast.success(`Store status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update store status");
        }
    };

    const handleCreateStore = async () => {
        // Validate required fields
        const requiredFields = [
            { field: 'name', label: 'Store Name' },
            { field: 'ownerName', label: 'Owner Name' },
            { field: 'email', label: 'Email' },
            { field: 'license', label: 'License Number' },
            { field: 'location', label: 'Location' }
        ];

        const emptyFields = requiredFields.filter(({ field }) => !newStoreData[field as keyof typeof newStoreData].trim());
        
        if (emptyFields.length > 0) {
            toast.error(`Please fill in: ${emptyFields.map(f => f.label).join(', ')}`);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newStoreData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            await createStore.mutateAsync(newStoreData);
            toast.success("Store created successfully! It will be reviewed for approval.");
            setIsAddDialogOpen(false);
            setNewStoreData({
                name: "",
                ownerName: "",
                email: "",
                license: "",
                location: ""
            });
        } catch (error: any) {
            console.error('Create store error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to create store";
            toast.error(errorMessage);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setNewStoreData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleOpenManageDialog = (store: any) => {
        console.log('Opening manage dialog for store:', {
            id: store.id,
            storeId: store.storeId,
            name: store.name,
            priority: store.priority,
            pincodes: store.serviceablePincodes,
            isActive: store.isActive
        });
        
        setSelectedStore(store);
        setManagementData({
            priority: store.priority || 0,
            pincodes: store.serviceablePincodes?.join(", ") || "",
            isActive: store.isActive ?? true
        });
        setIsManageDialogOpen(true);
    };

    const handleSaveManagement = async () => {
        if (!selectedStore) return;

        const storeId = selectedStore.storeId || selectedStore.id;

        console.log('Saving management data:', {
            selectedStore,
            storeId,
            managementData,
            apiUrl: process.env.NEXT_PUBLIC_API_URL
        });

        if (!storeId) {
            toast.error("Invalid store ID");
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                toast.error("Authentication required");
                return;
            }

            // Update priority
            console.log('Updating priority to:', managementData.priority);
            const priorityResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/store-management/${storeId}/priority`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ priority: Number(managementData.priority) })
            });

            if (!priorityResponse.ok) {
                const errorData = await priorityResponse.json().catch(() => ({}));
                console.error('Priority update failed:', errorData);
                throw new Error(errorData.message || 'Failed to update priority');
            }
            const priorityResult = await priorityResponse.json();
            console.log('Priority updated:', priorityResult);

            // Update pincodes
            const pincodesArray = managementData.pincodes
                .split(',')
                .map(p => p.trim())
                .filter(p => p.length === 6 && /^\d+$/.test(p));

            console.log('Updating pincodes to:', pincodesArray);
            const pincodesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/store-management/${storeId}/pincodes`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ pincodes: pincodesArray })
            });

            if (!pincodesResponse.ok) {
                const errorData = await pincodesResponse.json().catch(() => ({}));
                console.error('Pincodes update failed:', errorData);
                throw new Error(errorData.message || 'Failed to update pincodes');
            }
            const pincodesResult = await pincodesResponse.json();
            console.log('Pincodes updated:', pincodesResult);

            // Update active status
            console.log('Updating active status to:', managementData.isActive);
            const statusResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/store-management/${storeId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: Boolean(managementData.isActive) })
            });

            if (!statusResponse.ok) {
                const errorData = await statusResponse.json().catch(() => ({}));
                console.error('Status update failed:', errorData);
                throw new Error(errorData.message || 'Failed to update status');
            }
            const statusResult = await statusResponse.json();
            console.log('Status updated:', statusResult);

            toast.success("Store management settings updated successfully");
            setIsManageDialogOpen(false);
            
            // Refresh the stores list using React Query refetch
            await refetch();
        } catch (error: any) {
            console.error('Management update error:', error);
            toast.error(error.message || "Failed to update store management settings");
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 font-medium">Failed to load stores</p>
                    <p className="text-slate-500 text-sm mt-1">Please try again later</p>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pharmacy Partners</h1>
                    <p className="text-slate-500 font-medium mt-1">Review and approve pharmacy store registrations.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-lg shadow-indigo-500/20">
                                <Plus className="mr-2 h-4 w-4" />
                                Manual Registration
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Manual Store Registration</DialogTitle>
                                <DialogDescription>
                                    Register a pharmacy store manually (for special cases). 
                                    <br />
                                    <span className="text-sm text-amber-600 font-medium">
                                        Note: Store owners can also register themselves at the registration page.
                                    </span>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Store Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={newStoreData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="col-span-3"
                                        placeholder="Apollo Pharmacy"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="ownerName" className="text-right">
                                        Owner Name
                                    </Label>
                                    <Input
                                        id="ownerName"
                                        value={newStoreData.ownerName}
                                        onChange={(e) => handleInputChange("ownerName", e.target.value)}
                                        className="col-span-3"
                                        placeholder="Dr. Rajesh Kumar"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newStoreData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="col-span-3"
                                        placeholder="store@pharmacy.com"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="license" className="text-right">
                                        License No.
                                    </Label>
                                    <Input
                                        id="license"
                                        value={newStoreData.license}
                                        onChange={(e) => handleInputChange("license", e.target.value)}
                                        className="col-span-3"
                                        placeholder="DL-IND-1234"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="location" className="text-right">
                                        Location
                                    </Label>
                                    <Input
                                        id="location"
                                        value={newStoreData.location}
                                        onChange={(e) => handleInputChange("location", e.target.value)}
                                        className="col-span-3"
                                        placeholder="Vijay Nagar, Indore"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setIsAddDialogOpen(false);
                                        setNewStoreData({
                                            name: "",
                                            ownerName: "",
                                            email: "",
                                            license: "",
                                            location: ""
                                        });
                                    }}
                                    disabled={createStore.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    onClick={handleCreateStore}
                                    disabled={createStore.isPending}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {createStore.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Store"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by name, license or location..."
                            className="pl-10 h-10 bg-white border-slate-200 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500 pl-6">Store Name</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500">License</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500">Location</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500">Priority</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500">Status</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500 text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-slate-500">Loading stores...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredStores.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <div className="text-slate-500">
                                        {searchTerm ? "No stores found matching your search" : "No stores registered yet"}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStores.map((store) => (
                                <TableRow key={store.id} className="group hover:bg-slate-50/50 cursor-pointer">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                                                <AvatarFallback><Building2 size={20} /></AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-bold text-slate-900">{store.name}</div>
                                                <div className="text-xs text-slate-500 font-medium">Owner: {store.owner}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-600">{store.license}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-slate-500 font-medium text-sm">
                                            <MapPin size={14} /> {store.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {store.priority !== undefined && store.priority > 0 ? (
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                <span className="font-bold text-slate-900">{store.priority}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-sm">Not set</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={`rounded-lg px-2.5 py-0.5 font-bold ${
                                                    store.status === 'APPROVED' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                                    store.status === 'PENDING' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                                                    store.status === 'REJECTED' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                                                    'bg-gray-100 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {store.status}
                                            </Badge>
                                            {store.status === 'APPROVED' && (
                                                <Badge
                                                    className={`rounded-lg px-2.5 py-0.5 font-bold ${
                                                        store.isActive 
                                                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' 
                                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {store.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-200">
                                                    <MoreVertical size={16} className="text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl min-w-[180px]">
                                                <DropdownMenuItem 
                                                    className="font-bold text-slate-600"
                                                    onClick={() => {
                                                        setSelectedStore(store);
                                                        setIsProfileDialogOpen(true);
                                                    }}
                                                >
                                                    View Full Profile
                                                </DropdownMenuItem>
                                                {store.status === 'APPROVED' && (
                                                    <DropdownMenuItem 
                                                        className="font-bold text-indigo-600 focus:text-indigo-700 focus:bg-indigo-50"
                                                        onClick={() => handleOpenManageDialog(store)}
                                                    >
                                                        Manage Store
                                                    </DropdownMenuItem>
                                                )}
                                                {store.status === 'APPROVED' && (
                                                    <DropdownMenuItem 
                                                        className="font-bold text-red-600 focus:text-red-700 focus:bg-red-50"
                                                        onClick={() => handleStatusUpdate(store.id, 'REJECTED')}
                                                    >
                                                        Suspend Store
                                                    </DropdownMenuItem>
                                                )}
                                                {store.status === 'REJECTED' && (
                                                    <DropdownMenuItem 
                                                        className="font-bold text-green-600 focus:text-green-700 focus:bg-green-50"
                                                        onClick={() => handleStatusUpdate(store.id, 'APPROVED')}
                                                    >
                                                        Approve Store
                                                    </DropdownMenuItem>
                                                )}
                                                {store.status === 'PENDING' && (
                                                    <>
                                                        <DropdownMenuItem 
                                                            className="font-bold text-green-600 focus:text-green-700 focus:bg-green-50"
                                                            onClick={() => handleStatusUpdate(store.id, 'APPROVED')}
                                                        >
                                                            Approve Store
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="font-bold text-red-600 focus:text-red-700 focus:bg-red-50"
                                                            onClick={() => handleStatusUpdate(store.id, 'REJECTED')}
                                                        >
                                                            Reject Store
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Store Management Dialog */}
            <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-indigo-600" />
                            {selectedStore ? `Manage ${selectedStore.name}` : 'Store Management'}
                        </DialogTitle>
                        <DialogDescription>
                            Configure priority, serviceable pincodes, and operational status for this store.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedStore && (
                        <div className="space-y-6 py-4">
                            {/* Store Info */}
                            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-500">Store Name</span>
                                    <span className="text-sm font-bold text-slate-900">{selectedStore.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-500">Owner</span>
                                    <span className="text-sm font-bold text-slate-900">{selectedStore.owner}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-500">License</span>
                                    <span className="text-sm font-bold text-slate-900">{selectedStore.license}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-500">Location</span>
                                    <span className="text-sm font-bold text-slate-900">{selectedStore.location}</span>
                                </div>
                            </div>

                            {/* Priority Setting */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-sm font-bold">
                                    <Star className="h-4 w-4 text-amber-500" />
                                    Store Priority (1 = Highest)
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={managementData.priority}
                                    onChange={(e) => setManagementData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                                    className="h-12 rounded-xl"
                                    placeholder="Enter priority (1-100)"
                                />
                                <p className="text-xs text-slate-500">
                                    Lower numbers = higher priority. Orders are assigned to stores with lower priority numbers first.
                                </p>
                            </div>

                            {/* Serviceable Pincodes */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-sm font-bold">
                                    <MapPin className="h-4 w-4 text-indigo-500" />
                                    Serviceable Pincodes
                                </Label>
                                <Input
                                    type="text"
                                    value={managementData.pincodes}
                                    onChange={(e) => setManagementData(prev => ({ ...prev, pincodes: e.target.value }))}
                                    className="h-12 rounded-xl"
                                    placeholder="452001, 452010, 452016"
                                />
                                <p className="text-xs text-slate-500">
                                    Enter comma-separated 6-digit pincodes. Only valid pincodes will be saved.
                                </p>
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <Label className="text-sm font-bold">Store Active Status</Label>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Inactive stores won't receive new orders
                                    </p>
                                </div>
                                <Button
                                    variant={managementData.isActive ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setManagementData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                    className={managementData.isActive ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                    {managementData.isActive ? "Active" : "Inactive"}
                                </Button>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsManageDialogOpen(false)}
                            className="rounded-xl"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSaveManagement}
                            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Store Full Profile Dialog */}
            <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <Building2 className="h-6 w-6 text-indigo-600" />
                            {selectedStore?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Complete store profile and operational details
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedStore && (
                        <div className="space-y-6 py-4">
                            {/* Basic Information */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Basic Information</h3>
                                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs font-bold text-slate-500">Store Name</span>
                                            <p className="text-sm font-bold text-slate-900 mt-1">{selectedStore.name}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-500">Owner Name</span>
                                            <p className="text-sm font-bold text-slate-900 mt-1">{selectedStore.owner}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs font-bold text-slate-500">Email</span>
                                            <p className="text-sm font-medium text-slate-900 mt-1">{selectedStore.email}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-500">Phone</span>
                                            <p className="text-sm font-medium text-slate-900 mt-1">{selectedStore.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-500">License Number</span>
                                        <p className="text-sm font-bold text-slate-900 mt-1">{selectedStore.license}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-500">Location</span>
                                        <p className="text-sm font-medium text-slate-900 mt-1 flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-slate-400" />
                                            {selectedStore.location}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status & Operations */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Status & Operations</h3>
                                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs font-bold text-slate-500">Approval Status</span>
                                            <div className="mt-1">
                                                <Badge
                                                    className={`rounded-lg px-2.5 py-0.5 font-bold ${
                                                        selectedStore.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                        selectedStore.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {selectedStore.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-500">Operational Status</span>
                                            <div className="mt-1">
                                                <Badge
                                                    className={`rounded-lg px-2.5 py-0.5 font-bold ${
                                                        selectedStore.isActive 
                                                            ? 'bg-blue-100 text-blue-700' 
                                                            : 'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {selectedStore.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs font-bold text-slate-500">Priority Level</span>
                                            <div className="mt-1 flex items-center gap-1">
                                                {selectedStore.priority > 0 ? (
                                                    <>
                                                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                        <span className="text-sm font-bold text-slate-900">{selectedStore.priority}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-slate-400">Not set</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-500">Joined Date</span>
                                            <p className="text-sm font-medium text-slate-900 mt-1">
                                                {new Date(selectedStore.joined).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Serviceable Areas */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Serviceable Areas</h3>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <span className="text-xs font-bold text-slate-500">Pincodes</span>
                                    {selectedStore.serviceablePincodes && selectedStore.serviceablePincodes.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedStore.serviceablePincodes.map((pincode: string, index: number) => (
                                                <Badge key={index} variant="outline" className="rounded-lg px-3 py-1 font-mono">
                                                    {pincode}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 mt-2">No serviceable pincodes configured</p>
                                    )}
                                </div>
                            </div>

                            {/* Statistics (if available) */}
                            {(selectedStore.totalOrders || selectedStore.revenue) && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Performance</h3>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedStore.totalOrders && (
                                                <div>
                                                    <span className="text-xs font-bold text-slate-500">Total Orders</span>
                                                    <p className="text-2xl font-bold text-slate-900 mt-1">{selectedStore.totalOrders}</p>
                                                </div>
                                            )}
                                            {selectedStore.revenue && (
                                                <div>
                                                    <span className="text-xs font-bold text-slate-500">Revenue</span>
                                                    <p className="text-2xl font-bold text-slate-900 mt-1">₹{selectedStore.revenue.toLocaleString()}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Rejection Reason (if rejected) */}
                            {selectedStore.status === 'REJECTED' && selectedStore.rejectionReason && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider">Rejection Reason</h3>
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <p className="text-sm text-red-700">{selectedStore.rejectionReason}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsProfileDialogOpen(false)}
                            className="rounded-xl"
                        >
                            Close
                        </Button>
                        {selectedStore?.status === 'APPROVED' && (
                            <Button 
                                onClick={() => {
                                    setIsProfileDialogOpen(false);
                                    handleOpenManageDialog(selectedStore);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                            >
                                Manage Store
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
