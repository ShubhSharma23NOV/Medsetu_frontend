'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNearbyStores } from '@/hooks/use-stores';
import { MapPin, Phone, Clock, Star, Search, Navigation, Filter } from 'lucide-react';

export default function NearbyChemistPage() {
  const router = useRouter();
  const [searchPincode, setSearchPincode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [useLocation, setUseLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { data: storesData, isLoading, refetch } = useNearbyStores({
    pincode: searchPincode || undefined,
    lat: userLocation?.lat,
    lng: userLocation?.lng,
    page: currentPage,
    limit: 10,
  });

  const handleSearch = () => {
    setCurrentPage(1);
    refetch();
  };

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setSearchPincode('');
          setUseLocation(true);
          setCurrentPage(1);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter pincode manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto pt-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-white/10 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Nearby Chemists</h1>
          <p className="text-slate-300">Find pharmacies and medical stores near you</p>
        </div>

        {/* Search Section */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter pincode (e.g., 452001)"
                    value={searchPincode}
                    onChange={(e) => setSearchPincode(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl"
                    disabled={useLocation}
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6"
                    disabled={!searchPincode && !useLocation}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleLocationSearch}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Use My Location
                </Button>
              </div>
            </div>

            {useLocation && userLocation && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
                <p className="text-green-300 text-sm">
                  📍 Using your current location ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {storesData?.stores.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center py-12">
            <CardContent>
              <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No stores found</h3>
              <p className="text-slate-300 mb-6">
                {searchPincode 
                  ? `No pharmacies found for pincode ${searchPincode}`
                  : 'Try searching with a pincode or use your location'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results Header */}
            {storesData && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-slate-300">
                  Found {storesData.pagination.total} stores
                  {searchPincode && ` for pincode ${searchPincode}`}
                </p>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Page {storesData.pagination.page} of {storesData.pagination.totalPages}
                </Badge>
              </div>
            )}

            {/* Stores List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {storesData?.stores.map((store) => (
                <Card 
                  key={store.id} 
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                  onClick={() => router.push(`/chemist-detail/${store.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{store.storeName}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">
                            {store.stats?.rating || 4.5}
                          </span>
                          <span className="text-slate-400 text-sm">
                            ({store.stats?.reviewCount || 0} reviews)
                          </span>
                        </div>
                      </div>
                      
                      {store.distance && (
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {store.distance} km
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-slate-300">
                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                        <p className="text-sm">{store.storeAddress}</p>
                      </div>

                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <p className="text-sm">{store.storePhone}</p>
                      </div>

                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <p className="text-sm">Open 24/7</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <div className="flex gap-2">
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          {store.stats?.medicineCount || 0} Medicines
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          Priority {store.priority}
                        </Badge>
                      </div>
                      
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/chemist-detail/${store.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {storesData && storesData.pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, storesData.pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl ${
                          currentPage === page
                            ? 'bg-primary text-white'
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(storesData.pagination.totalPages, prev + 1))}
                  disabled={currentPage === storesData.pagination.totalPages}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}