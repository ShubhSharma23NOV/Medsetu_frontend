"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    MoreVertical,
    User,
    Mail,
    Phone,
    Shield,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { usePlatformUsers, useUpdateUserStatus } from "@/hooks/use-platform-admin";
import { toast } from "sonner";

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("");
    
    const { data: users, isLoading, error } = usePlatformUsers(roleFilter || undefined);
    const updateUserStatus = useUpdateUserStatus();

    const filteredUsers = users?.filter(user => 
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ) || [];

    const handleStatusUpdate = async (userId: number, newStatus: string) => {
        try {
            await updateUserStatus.mutateAsync({ id: userId, status: newStatus });
            toast.success(`User status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update user status");
        }
    };

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'USER': return 'Customer';
            case 'STORE': return 'Store Admin';
            case 'PLATFORM_ADMIN': return 'Platform Admin';
            default: return role;
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 font-medium">Failed to load users</p>
                    <p className="text-slate-500 text-sm mt-1">Please try again later</p>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Directory</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage customers and platform users.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                        <Filter className="mr-2 h-4 w-4" /> Filter Role
                    </Button>
                    <Button variant="destructive" className="rounded-xl font-bold shadow-lg shadow-red-500/20">
                        <Shield className="mr-2 h-4 w-4" /> blocked Users
                    </Button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search users..."
                            className="pl-10 h-10 bg-white border-slate-200 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500 pl-6">User Details</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500">Role</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500">Total Spent</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500">Status</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-xs text-slate-500 text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-slate-500">Loading users...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <div className="text-slate-500">
                                        {searchTerm ? "No users found matching your search" : "No users found"}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="group hover:bg-slate-50/50 cursor-pointer">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10 rounded-full border border-slate-200">
                                                <AvatarFallback className="font-bold text-slate-500">{user.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-bold text-slate-900">{user.name}</div>
                                                <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                                    <span className="flex items-center gap-1"><Mail size={10} /> {user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="rounded-md font-bold text-slate-600 bg-slate-50 border-slate-200">
                                            {getRoleDisplayName(user.role)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-900">
                                        {user.totalSpent ? `₹${user.totalSpent.toLocaleString()}` : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <div className={`
                                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                                            ${(user.status || 'Active') === 'Active' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}
                                        `}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${(user.status || 'Active') === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                            {user.status || 'Active'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-200">
                                                    <MoreVertical size={16} className="text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem className="font-bold text-slate-600">Order History</DropdownMenuItem>
                                                <DropdownMenuItem className="font-bold text-slate-600">Reset Password</DropdownMenuItem>
                                                {(user.status || 'Active') === 'Active' ? (
                                                    <DropdownMenuItem 
                                                        className="font-bold text-red-600 focus:text-red-700 focus:bg-red-50"
                                                        onClick={() => handleStatusUpdate(user.id, 'Blocked')}
                                                    >
                                                        Block Account
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem 
                                                        className="font-bold text-green-600 focus:text-green-700 focus:bg-green-50"
                                                        onClick={() => handleStatusUpdate(user.id, 'Active')}
                                                    >
                                                        Unblock Account
                                                    </DropdownMenuItem>
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
        </div>
    );
}
