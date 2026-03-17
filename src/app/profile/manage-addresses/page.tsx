'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from '@/hooks/use-addresses';
import { MapPin, Plus, Edit, Trash2, Star, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageAddressesPage() {
  const router = useRouter();
  const { data: addresses, isLoading } = useAddresses();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress.mutateAsync(id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress.mutateAsync(id);
    } catch (error) {
      console.error('Set default failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/10 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Manage Addresses</h1>
            <p className="text-slate-300">Add, edit, or delete your delivery addresses</p>
          </div>
          <Button
            onClick={() => router.push('/profile/add-address')}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-3"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses?.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center py-12">
              <CardContent>
                <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No addresses found</h3>
                <p className="text-slate-300 mb-6">Add your first delivery address to get started</p>
                <Button
                  onClick={() => router.push('/profile/add-address')}
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </CardContent>
            </Card>
          ) : (
            addresses?.map((address) => (
              <Card key={address.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge 
                          variant={address.isDefault ? "default" : "secondary"}
                          className={address.isDefault ? "bg-primary text-white" : "bg-white/20 text-white"}
                        >
                          {address.title}
                        </Badge>
                        {address.isDefault && (
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">{address.fullName}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-white">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span>{address.phone}</span>
                        </div>

                        <div className="flex items-start gap-2 text-slate-300">
                          <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                          <div>
                            <p>{address.addressLine}</p>
                            {address.landmark && <p className="text-sm text-slate-400">Near {address.landmark}</p>}
                            <p>{address.city}, {address.state} - {address.pincode}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {!address.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          className="text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10"
                          disabled={setDefaultAddress.isPending}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/profile/edit-address/${address.id}`)}
                        className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                        className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                        disabled={deleteAddress.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/profile')}
            className="text-white hover:bg-white/10 rounded-xl"
          >
            ← Back to Profile
          </Button>
        </div>
      </div>
    </div>
  );
}