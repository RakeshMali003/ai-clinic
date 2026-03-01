import { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Truck,
  Clock,
  Shield,
  Upload,
  Bookmark,
  BookMarked
} from 'lucide-react';
import { Card, CardContent } from '../common/ui/card';
import { Button } from '../common/ui/button';
import { Input } from '../common/ui/input';
import { Badge } from '../common/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/ui/select';
import { ImageWithFallback } from "../public/figma/ImageWithFallback";
import { medicineService } from '../services/medicineService';
import type { PatientPage } from './PatientPortal';

export function MedicineStore({ onNavigate }: { onNavigate?: (page: PatientPage) => void }) {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    fetchMedicines();
    fetchCart();
    fetchBookmarks();
  }, [category, searchQuery]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const data = await medicineService.getMedicines({
        category: category === 'All' ? undefined : category,
        search: searchQuery || undefined
      });
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const data = await medicineService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const data = await medicineService.getBookmarks();
      setBookmarks(data.map((b: any) => b.medicine_id));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedicines();
  };

  const handleAddToCart = async (medicineId: string) => {
    try {
      await medicineService.addToCart(medicineId, 1);
      fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleToggleBookmark = async (medicineId: string) => {
    try {
      await medicineService.toggleBookmark(medicineId);
      fetchBookmarks();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const getCartQuantity = (medicineId: string) => {
    const item = cart.find(c => c.medicine_id === medicineId);
    return item?.quantity || 0;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-gray-900 mb-1">Buy Medicine</h1>
          <p className="text-sm text-gray-600">Order medicines from our clinic with doorstep delivery</p>
        </div>
        <Button
          onClick={() => onNavigate && onNavigate('cart')}
          className="bg-pink-600 hover:bg-pink-700 relative text-white"
        >
          <ShoppingCart className="size-5 mr-2" />
          View Cart
          {cart.length > 0 && (
            <Badge className="absolute -top-2 -right-2 size-6 flex items-center justify-center p-0 bg-purple-600">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Features Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-pink-600 rounded-lg">
              <Truck className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-pink-900">Free Delivery</p>
              <p className="text-xs text-pink-700">On orders above ₹500</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Clock className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-900">Fast Delivery</p>
              <p className="text-xs text-purple-700">Delivered in 24-48 hours</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Shield className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-900">100% Authentic</p>
              <p className="text-xs text-indigo-700">Genuine medicines only</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search medicines by name, company, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={(val) => setCategory(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Pain Relief">Pain Relief</SelectItem>
            <SelectItem value="Diabetes">Diabetes</SelectItem>
            <SelectItem value="Allergy">Allergy</SelectItem>
            <SelectItem value="Vitamins">Vitamins</SelectItem>
            <SelectItem value="Antibiotic">Antibiotic</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((medicine) => {
            const quantity = getCartQuantity(medicine.medicine_id);
            const isBookmarked = bookmarks.includes(medicine.medicine_id);

            return (
              <Card key={medicine.medicine_id} className="overflow-hidden hover:shadow-lg transition-shadow border-pink-100">
                <div className="aspect-video bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt={medicine.medicine_name}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-pink-600"
                    onClick={() => handleToggleBookmark(medicine.medicine_id)}
                  >
                    {isBookmarked ? <BookMarked className="size-5" /> : <Bookmark className="size-5" />}
                  </Button>
                  {medicine.category && (
                    <Badge className="absolute top-2 left-2 bg-purple-600">
                      {medicine.category}
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 mb-1">{medicine.medicine_name}</h3>
                    <p className="text-xs text-gray-600">{medicine.manufacturer || 'Generic'}</p>
                    <p className="text-xs text-gray-500">{medicine.clinic?.clinic_name}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-semibold text-gray-900 text-lg">₹{medicine.mrp}</span>
                    {medicine.stock_quantity <= 5 && medicine.stock_quantity > 0 && (
                      <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                        Only {medicine.stock_quantity} left
                      </Badge>
                    )}
                  </div>

                  {medicine.stock_quantity > 0 ? (
                    <Button
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
                      onClick={() => handleAddToCart(medicine.medicine_id)}
                    >
                      <ShoppingCart className="size-4 mr-2" />
                      {quantity > 0 ? `Added (${quantity})` : 'Add to Cart'}
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="w-full justify-center py-2 bg-gray-100 text-gray-500">
                      Out of Stock
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Prescription Upload Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="p-2 bg-blue-600 rounded-lg mt-1">
            <Upload className="size-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Ordering Prescription Medicines?</p>
            <p className="text-xs text-blue-700 mb-2">
              For medicines requiring a prescription, you can upload it during checkout in the Cart page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
