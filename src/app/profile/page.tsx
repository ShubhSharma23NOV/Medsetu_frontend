"use client";

import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
    User, 
    Mail, 
    Calendar, 
    Shield, 
    Edit, 
    Save, 
    X, 
    Phone, 
    MapPin, 
    Home,
    Users,
    Cake
} from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser, useUpdateProfile } from "@/hooks/use-profile";
import { RoleGuard } from "@/components/auth/role-guard";

export default function ProfilePage() {
    return (
        <RoleGuard allowedRoles={['USER', 'STORE', 'PLATFORM_ADMIN']}>
            <ProfileContent />
        </RoleGuard>
    );
}

function ProfileContent() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const { data: profileData, isLoading, refetch } = useCurrentUser();
    const updateProfileMutation = useUpdateProfile();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        dateOfBirth: "",
        gender: ""
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (profileData) {
            setFormData({
                name: profileData.name || "",
                phone: profileData.phone || "",
                address: profileData.address || "",
                city: profileData.city || "",
                pincode: profileData.pincode || "",
                dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : "",
                gender: profileData.gender || ""
            });
        }
    }, [profileData]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            await updateProfileMutation.mutateAsync(formData);
            toast.success("Profile updated successfully!");
            setIsEditing(false);
            refetch();
        } catch (error) {
            toast.error("Failed to update profile. Please try again.");
            console.error("Profile update error:", error);
        }
    };

    const handleCancel = () => {
        if (profileData) {
            setFormData({
                name: profileData.name || "",
                phone: profileData.phone || "",
                address: profileData.address || "",
                city: profileData.city || "",
                pincode: profileData.pincode || "",
                dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : "",
                gender: profileData.gender || ""
            });
        }
        setIsEditing(false);
    };

    if (!isAuthenticated || !user) {
        return null; // Will redirect to login
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    const currentUser = profileData || user;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">My Profile</h1>
                    <p className="text-slate-600">Manage your account settings and delivery preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="rounded-[2rem] border border-slate-200 shadow-sm bg-white">
                            <CardHeader className="text-center p-8">
                                <div className="flex justify-center mb-6">
                                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                        <AvatarImage src={(currentUser as any).avatar || undefined} />
                                        <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                                            {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <CardTitle className="text-xl font-black text-slate-900">{currentUser.name}</CardTitle>
                                <p className="text-slate-600 font-medium break-all">{currentUser.email}</p>
                                <div className="flex justify-center mt-4">
                                    <Badge 
                                        variant={currentUser.role === 'STORE' || currentUser.role === 'PLATFORM_ADMIN' ? 'default' : 'secondary'}
                                        className="rounded-full px-3 py-1 font-bold"
                                    >
                                        {currentUser.role === 'STORE' ? 'Medical Store' : 
                                         currentUser.role === 'PLATFORM_ADMIN' ? 'Platform Admin' : 'Customer'}
                                    </Badge>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Profile Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card className="rounded-[2rem] border border-slate-200 shadow-sm bg-white">
                            <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-slate-100">
                                <CardTitle className="flex items-center gap-2 text-slate-900 font-black">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <User className="h-5 w-5" />
                                    </div>
                                    Basic Information
                                </CardTitle>
                                {!isEditing ? (
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                        className="rounded-xl font-bold"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={handleCancel}
                                            disabled={updateProfileMutation.isPending}
                                            className="rounded-xl font-bold"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                        <Button 
                                            size="sm"
                                            onClick={handleSave}
                                            disabled={updateProfileMutation.isPending}
                                            className="rounded-xl font-bold"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {updateProfileMutation.isPending ? "Saving..." : "Save"}
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="name" className="flex items-center gap-2 text-slate-700 font-bold">
                                            <User className="h-4 w-4 text-slate-500" />
                                            Full Name
                                        </Label>
                                        {isEditing ? (
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                placeholder="Enter your full name"
                                                className="rounded-xl bg-slate-50 border-none h-12"
                                            />
                                        ) : (
                                            <p className="text-slate-900 font-medium bg-slate-50 rounded-xl p-3 min-h-[3rem] flex items-center">
                                                {currentUser.name || 'Not provided'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-slate-700 font-bold">
                                            <Mail className="h-4 w-4 text-slate-500" />
                                            Email Address
                                        </Label>
                                        <p className="text-slate-900 font-medium bg-slate-50 rounded-xl p-3 min-h-[3rem] flex items-center break-all">
                                            {currentUser.email}
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium">Email cannot be changed</p>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="phone" className="flex items-center gap-2 text-slate-700 font-bold">
                                            <Phone className="h-4 w-4 text-slate-500" />
                                            Phone Number
                                        </Label>
                                        {isEditing ? (
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                placeholder="Enter your phone number"
                                                className="rounded-xl bg-slate-50 border-none h-12 text-slate-900"
                                                maxLength={10}
                                            />
                                        ) : (
                                            <p className="text-slate-900 font-medium bg-slate-50 rounded-xl p-3 min-h-[3rem] flex items-center">
                                                {(currentUser as any).phone || 'Not provided'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="dateOfBirth" className="flex items-center gap-2 text-slate-700 font-bold">
                                            <Cake className="h-4 w-4 text-slate-500" />
                                            Date of Birth
                                        </Label>
                                        {isEditing ? (
                                            <Input
                                                id="dateOfBirth"
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                className="rounded-xl bg-slate-50 border-none h-12 text-slate-900"
                                            />
                                        ) : (
                                            <p className="text-slate-900 font-medium bg-slate-50 rounded-xl p-3 min-h-[3rem] flex items-center">
                                                {(currentUser as any).dateOfBirth ? 
                                                    new Date((currentUser as any).dateOfBirth).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    }) : 
                                                    'Not provided'
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="gender" className="flex items-center gap-2 text-slate-700 font-bold">
                                            <Users className="h-4 w-4 text-slate-500" />
                                            Gender
                                        </Label>
                                        {isEditing ? (
                                            <select
                                                id="gender"
                                                value={formData.gender}
                                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                                className="w-full rounded-xl bg-slate-50 border-none h-12 px-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                            >
                                                <option value="" className="text-slate-500">Select gender</option>
                                                <option value="MALE" className="text-slate-900">Male</option>
                                                <option value="FEMALE" className="text-slate-900">Female</option>
                                                <option value="OTHER" className="text-slate-900">Other</option>
                                            </select>
                                        ) : (
                                            <p className="text-slate-900 font-medium bg-slate-50 rounded-xl p-3 min-h-[3rem] flex items-center">
                                                {(currentUser as any).gender === 'MALE' ? 'Male' : 
                                                 (currentUser as any).gender === 'FEMALE' ? 'Female' : 
                                                 (currentUser as any).gender === 'OTHER' ? 'Other' : 
                                                 'Not provided'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-slate-700 font-bold">
                                            <Shield className="h-4 w-4 text-slate-500" />
                                            Account Type
                                        </Label>
                                        <p className="text-slate-900 font-medium bg-slate-50 rounded-xl p-3 min-h-[3rem] flex items-center">
                                            {currentUser.role === 'STORE' ? 'Medical Store Partner' : 
                                             currentUser.role === 'PLATFORM_ADMIN' ? 'Platform Administrator' : 'Customer'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address Information */}
                        <Card className="rounded-[2rem] border border-slate-200 shadow-sm bg-white">
                            <CardHeader className="p-6 border-b border-slate-100">
                                <CardTitle className="flex items-center gap-2 text-slate-900 font-black">
                                    <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    Delivery Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="address" className="flex items-center gap-2 text-slate-700 font-bold">
                                        <Home className="h-4 w-4 text-slate-500" />
                                        Full Address
                                    </Label>
                                    {isEditing ? (
                                        <Textarea
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Enter your complete address"
                                            rows={3}
                                            className="rounded-xl bg-slate-50 border-none text-slate-900"
                                        />
                                    ) : (
                                        <p className="text-slate-900 font-medium bg-slate-50 rounded-xl p-3 min-h-[5rem] flex items-start">
                                            {(currentUser as any).address || 'Not provided'}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="city" className="text-slate-700 font-bold">City</Label>
                                        {isEditing ? (
                                            <Input
                                                id="city"
                                                value={formData.city}
                                                onChange={(e) => handleInputChange('city', e.target.value)}
                                                placeholder="Enter your city"
                                                className="rounded-xl bg-slate-50 border-none h-12 text-slate-900"
                                            />
                                        ) : (
                                            <p className="text-slate-900 font-medium bg-slate-50 rounded-xl p-3 min-h-[3rem] flex items-center">
                                                {(currentUser as any).city || 'Not provided'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="pincode" className="text-slate-700 font-bold">PIN Code</Label>
                                        {isEditing ? (
                                            <Input
                                                id="pincode"
                                                value={formData.pincode}
                                                onChange={(e) => handleInputChange('pincode', e.target.value)}
                                                placeholder="Enter PIN code"
                                                className="rounded-xl bg-slate-50 border-none h-12 text-slate-900"
                                                maxLength={6}
                                            />
                                        ) : (
                                            <p className="text-slate-900 font-medium bg-slate-50 rounded-xl p-3 min-h-[3rem] flex items-center">
                                                {(currentUser as any).pincode || 'Not provided'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="rounded-[2rem] border border-slate-200 shadow-sm bg-white">
                            <CardHeader className="p-6 border-b border-slate-100">
                                <CardTitle className="text-slate-900 font-black">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button variant="outline" asChild className="rounded-xl h-12 font-bold">
                                        <a href="/orders">View My Orders</a>
                                    </Button>
                                    <Button variant="outline" asChild className="rounded-xl h-12 font-bold">
                                        <a href="/prescriptions">My Prescriptions</a>
                                    </Button>
                                    {currentUser.role === 'STORE' && (
                                        <Button variant="outline" asChild className="rounded-xl h-12 font-bold">
                                            <a href="/admin">Medical Store Dashboard</a>
                                        </Button>
                                    )}
                                    {currentUser.role === 'PLATFORM_ADMIN' && (
                                        <Button variant="outline" asChild className="rounded-xl h-12 font-bold">
                                            <a href="/platform-admin">Platform Admin Dashboard</a>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}