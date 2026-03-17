'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStoreDetails, useStoreMedicines } from '@/hooks/use-stores';
import { MapPin, Phone, Star, Search, ShoppingCart, Clock, Award, Package } from 'lucide-react';

interface ChemistDetailPageProps {
  params: {
    id: string;
  };
}

export default function ChemistDetailPage({ params }: ChemistDetailPageProps) {
  const router = useRouter();
  const storeId = parseInt(params.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: store, isLoading: storeLoading } = useStoreDetails(storeId);
  const { data: medicinesData, isLoading: medicinesLoading } = useStoreMedicines(storeId, {
    search: searchQuery || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    page: currentPage,
    limit: 20,
  });

  const categories = ['All', 'General', 'Pain Relief', 'Vitamins', 'Antibiotics', 'Diabetes', 'Heart Care'];

  const handleSearch = () => {
    setCurrentPage(1);
  };

  if (storeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto pt-8">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-white/10 rounded-2xl"></div>
            <div className="h-96 bg-white/10 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto pt-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Store not found</h1>
          <Button onClick={() => router.push('/nearby-chemist')} className="bg-primary hover:bg-primary/90 text-white rounded-xl">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Store Header */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{store.storeName}</h1>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="text-yellow-400 font-bold text-lg">
                        {store.stats?.rating || 4.5}
                      </span>
                      <span className="text-slate-400">
                        ({store.stats?.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    Open Now
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 text-slate-300">
                    <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p>{store.storeAddress}</p>
                      <p className="text-sm text-slate-400">
                        Serves pincodes: {store.serviceablePincodes.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <p>{store.storePhone}</p>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock className="h-5 w-5 text-slate-400" />
                    <p>Open 24/7</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Store
                  </Button>
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl">
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>

              {/* Store Stats */}
              <div className="lg:w-80">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <Package className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{store.stats?.medicineCount || 0}</p>
                      <p className="text-sm text-slate-400">Medicines</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <Award className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{store.stats?.recentOrdersCount || 0}</p>
                      <p className="text-sm text-slate-400">Recent Orders</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">#{store.priority}</p>
                      <p className="text-sm text-slate-400">Priority</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">24/7</p>
                      <p className="text-sm text-slate-400">Available</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medicines Section */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5" />
              Available Medicines
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`rounded-xl ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Medicines Grid */}
            {medicinesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : medicinesData?.medicines.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No medicines found</h3>
                <p className="text-slate-300">
                  {searchQuery 
                    ? `No medicines found for "${searchQuery}"`
                    : 'No medicines available in this category'
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {medicinesData?.medicines.map((medicine) => (
                    <Card key={medicine.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-white mb-1">{medicine.name}</h4>
                            <p className="text-sm text-slate-400 mb-2">{medicine.brand}</p>
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                              {medicine.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">₹{medicine.price}</p>
                            <p className="text-xs text-slate-400">{medicine.dosage}</p>
                          </div>
                        </div>

                        <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                          {medicine.description || `For ${medicine.healthCondition}`}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Badge className={`text-xs ${
                              medicine.inStock 
                                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                : 'bg-red-500/20 text-red-300 border-red-500/30'
                            }`}>
                              {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                            {medicine.rxRequired && (
                              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                                Rx Required
                              </Badge>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            disabled={!medicine.inStock}
                            className="bg-primary hover:bg-primary/90 text-white rounded-lg"
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {medicinesData && medicinesData.pagination.totalPages > 1 && (
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
                      {Array.from({ length: Math.min(5, medicinesData.pagination.totalPages) }, (_, i) => {
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
                      onClick={() => setCurrentPage(prev => Math.min(medicinesData.pagination.totalPages, prev + 1))}
                      disabled={currentPage === medicinesData.pagination.totalPages}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/nearby-chemist')}
            className="text-white hover:bg-white/10 rounded-xl"
          >
            ← Back to Search
          </Button>
        </div>
      </div>
    </div>
  );
}