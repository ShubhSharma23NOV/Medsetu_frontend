'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAddresses, useUpdateAddress } from '@/hooks/use-addresses';
import { MapPin, User, Phone, Building, Navigation } from 'lucide-react';

const addressSchema = z.object({
  title: z.string().min(1, 'Address title is required'),
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  addressLine: z.string().min(10, 'Complete address is required'),
  landmark: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(6, 'Valid pincode is required').max(6, 'Valid pincode is required'),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

const addressTitles = ['Home', 'Office', 'Other'];

interface EditAddressPageProps {
  params: {
    id: string;
  };
}

export default function EditAddressPage({ params }: EditAddressPageProps) {
  const router = useRouter();
  const addressId = parseInt(params.id);
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const updateAddress = useUpdateAddress();
  const [selectedTitle, setSelectedTitle] = useState('Home');

  const address = addresses?.find(addr => addr.id === addressId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    if (address) {
      setSelectedTitle(address.title);
      reset({
        title: address.title,
        fullName: address.fullName,
        phone: address.phone,
        addressLine: address.addressLine,
        landmark: address.landmark || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: address.isDefault,
      });
    }
  }, [address, reset]);

  const onSubmit = async (data: AddressFormData) => {
    try {
      await updateAddress.mutateAsync({
        id: addressId,
        data: {
          ...data,
          title: selectedTitle,
        },
      });
      router.push('/profile/manage-addresses');
    } catch (error) {
      console.error('Update address failed:', error);
    }
  };

  if (addressesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="animate-pulse">
            <div className="h-96 bg-white/10 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-2xl mx-auto pt-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Address not found</h1>
          <Button onClick={() => router.push('/profile/manage-addresses')} className="bg-primary hover:bg-primary/90 text-white rounded-xl">
            Back to Addresses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Address</h1>
          <p className="text-slate-300">Update your delivery address details</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Address Title */}
              <div className="space-y-3">
                <Label className="text-white font-medium">Address Type</Label>
                <div className="grid grid-cols-3 gap-3">
                  {addressTitles.map((title) => (
                    <Button
                      key={title}
                      type="button"
                      variant={selectedTitle === title ? "default" : "outline"}
                      onClick={() => {
                        setSelectedTitle(title);
                        setValue('title', title);
                      }}
                      className={`rounded-xl ${
                        selectedTitle === title
                          ? 'bg-primary text-white'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {title}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    {...register('fullName')}
                    placeholder="Enter full name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl"
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-sm">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    {...register('phone')}
                    placeholder="Enter phone number"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-2">
                <Label className="text-white font-medium flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Complete Address
                </Label>
                <Textarea
                  {...register('addressLine')}
                  placeholder="House/Flat No., Building Name, Street, Area"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl min-h-[80px]"
                />
                {errors.addressLine && (
                  <p className="text-red-400 text-sm">{errors.addressLine.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  Landmark (Optional)
                </Label>
                <Input
                  {...register('landmark')}
                  placeholder="Nearby landmark for easy delivery"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl"
                />
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">City</Label>
                  <Input
                    {...register('city')}
                    placeholder="City"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl"
                  />
                  {errors.city && (
                    <p className="text-red-400 text-sm">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium">State</Label>
                  <Input
                    {...register('state')}
                    placeholder="State"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl"
                  />
                  {errors.state && (
                    <p className="text-red-400 text-sm">{errors.state.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium">Pincode</Label>
                  <Input
                    {...register('pincode')}
                    placeholder="Pincode"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl"
                  />
                  {errors.pincode && (
                    <p className="text-red-400 text-sm">{errors.pincode.message}</p>
                  )}
                </div>
              </div>

              {/* Default Address */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={watch('isDefault')}
                  onCheckedChange={(checked) => setValue('isDefault', !!checked)}
                  className="border-white/20 data-[state=checked]:bg-primary"
                />
                <Label htmlFor="isDefault" className="text-white font-medium">
                  Set as default address
                </Label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/profile/manage-addresses')}
                  className="flex-1 text-white hover:bg-white/10 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateAddress.isPending}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl"
                >
                  {updateAddress.isPending ? 'Updating...' : 'Update Address'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}