import { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  Clock,
  Shield,
  Upload,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/ui/card';
import { Button } from '../common/ui/button';
import { Input } from '../common/ui/input';
import { Badge } from '../common/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../common/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/ui/select';
import { ImageWithFallback } from "../public/figma/ImageWithFallback";

const medicines = [
  {
    id: 'MED-001',
    name: 'Paracetamol 650mg',
    company: 'Cipla',
    category: 'Pain Relief',
    price: 45,
    mrp: 60,
    discount: 25,
    rating: 4.5,
    reviews: 234,
    inStock: true,
    prescription: false,
    packaging: 'Strip of 15 tablets'
  },
  {
    id: 'MED-002',
    name: 'Metformin 500mg',
    company: 'Sun Pharma',
    category: 'Diabetes',
    price: 120,
    mrp: 150,
    discount: 20,
    rating: 4.7,
    reviews: 456,
    inStock: true,
    prescription: true,
    packaging: 'Strip of 10 tablets'
  },
  {
    id: 'MED-003',
    name: 'Cetirizine 10mg',
    company: 'Dr. Reddy\'s',
    category: 'Allergy',
    price: 35,
    mrp: 50,
    discount: 30,
    rating: 4.6,
    reviews: 189,
    inStock: true,
    prescription: false,
    packaging: 'Strip of 10 tablets'
  },
  {
    id: 'MED-004',
    name: 'Amoxicillin 500mg',
    company: 'Lupin',
    category: 'Antibiotic',
    price: 180,
    mrp: 220,
    discount: 18,
    rating: 4.8,
    reviews: 321,
    inStock: true,
    prescription: true,
    packaging: 'Strip of 10 capsules'
  },
  {
    id: 'MED-005',
    name: 'Vitamin D3 60000 IU',
    company: 'HealthKart',
    category: 'Vitamins',
    price: 95,
    mrp: 120,
    discount: 21,
    rating: 4.4,
    reviews: 567,
    inStock: true,
    prescription: false,
    packaging: 'Strip of 4 capsules'
  },
  {
    id: 'MED-006',
    name: 'Amlodipine 5mg',
    company: 'Cipla',
    category: 'Blood Pressure',
    price: 85,
    mrp: 110,
    discount: 23,
    rating: 4.7,
    reviews: 298,
    inStock: true,
    prescription: true,
    packaging: 'Strip of 10 tablets'
  }
];

export function MedicineStore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Array<{ id: string; quantity: number }>>([]);
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCartQuantity = (id: string) => {
    const item = cart.find(c => c.id === id);
    return item?.quantity || 0;
  };

  const addToCart = (id: string) => {
    const medicine = medicines.find(m => m.id === id);
    if (medicine?.prescription) {
      setShowPrescriptionUpload(true);
      return;
    }

    const existing = cart.find(c => c.id === id);
    if (existing) {
      setCart(cart.map(c => c.id === id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { id, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    const existing = cart.find(c => c.id === id);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c));
    } else {
      setCart(cart.filter(c => c.id !== id));
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    const med = medicines.find(m => m.id === item.id);
    return sum + (med?.price || 0) * item.quantity;
  }, 0);

  const cartItems = cart.map(item => ({
    ...medicines.find(m => m.id === item.id)!,
    quantity: item.quantity
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-gray-900 mb-1">Medicine Store</h1>
          <p className="text-sm text-gray-600">Order medicines online with doorstep delivery</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 relative">
          <ShoppingCart className="size-5 mr-2" />
          View Cart
          {cart.length > 0 && (
            <Badge className="absolute -top-2 -right-2 size-6 flex items-center justify-center p-0 bg-red-500">
              {cart.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Features Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Truck className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Free Delivery</p>
              <p className="text-xs text-blue-700">On orders above ₹500</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Clock className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Fast Delivery</p>
              <p className="text-xs text-green-700">Delivered in 24-48 hours</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Shield className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-900">100% Authentic</p>
              <p className="text-xs text-purple-700">Genuine medicines only</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search medicines by name, company, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="pain">Pain Relief</SelectItem>
            <SelectItem value="diabetes">Diabetes</SelectItem>
            <SelectItem value="allergy">Allergy</SelectItem>
            <SelectItem value="vitamins">Vitamins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Medicines</TabsTrigger>
          <TabsTrigger value="prescription">Prescription Required</TabsTrigger>
          <TabsTrigger value="otc">Over the Counter</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine) => {
              const quantity = getCartQuantity(medicine.id);

              return (
                <Card key={medicine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHBpbGxzJTIwcGhhcm1hY3l8ZW58MXx8fHwxNzY5MTQyMTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt={medicine.name}
                      className="w-full h-full object-cover"
                    />
                    {medicine.discount > 0 && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        {medicine.discount}% OFF
                      </Badge>
                    )}
                    {medicine.prescription && (
                      <Badge className="absolute top-2 left-2 bg-orange-500">
                        Rx Required
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 mb-1">{medicine.name}</h3>
                      <p className="text-xs text-gray-600">{medicine.company}</p>
                      <p className="text-xs text-gray-500">{medicine.packaging}</p>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{medicine.rating}</span>
                      <span className="text-xs text-gray-500">({medicine.reviews})</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-semibold text-gray-900">₹{medicine.price}</span>
                      {medicine.discount > 0 && (
                        <>
                          <span className="text-sm text-gray-500 line-through">₹{medicine.mrp}</span>
                          <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                            Save ₹{medicine.mrp - medicine.price}
                          </Badge>
                        </>
                      )}
                    </div>

                    {quantity > 0 ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(medicine.id)}
                          className="flex-1"
                        >
                          <Minus className="size-4" />
                        </Button>
                        <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                          {quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(medicine.id)}
                          className="flex-1"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => addToCart(medicine.id)}
                      >
                        <ShoppingCart className="size-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}

                    {!medicine.inStock && (
                      <Badge variant="outline" className="w-full mt-2 bg-gray-50">
                        Out of Stock
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="prescription" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.filter(m => m.prescription).map((medicine) => {
              const quantity = getCartQuantity(medicine.id);

              return (
                <Card key={medicine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHBpbGxzJTIwcGhhcm1hY3l8ZW58MXx8fHwxNzY5MTQyMTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt={medicine.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-orange-500">
                      Rx Required
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 mb-1">{medicine.name}</h3>
                      <p className="text-xs text-gray-600">{medicine.company}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-semibold text-gray-900">₹{medicine.price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{medicine.mrp}</span>
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowPrescriptionUpload(true)}
                    >
                      <Upload className="size-4 mr-2" />
                      Upload Prescription
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="otc" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.filter(m => !m.prescription).map((medicine) => {
              const quantity = getCartQuantity(medicine.id);

              return (
                <Card key={medicine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHBpbGxzJTIwcGhhcm1hY3l8ZW58MXx8fHwxNzY5MTQyMTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt={medicine.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-red-500">
                      {medicine.discount}% OFF
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 mb-1">{medicine.name}</h3>
                      <p className="text-xs text-gray-600">{medicine.company}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-semibold text-gray-900">₹{medicine.price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{medicine.mrp}</span>
                    </div>

                    {quantity > 0 ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(medicine.id)}
                          className="flex-1"
                        >
                          <Minus className="size-4" />
                        </Button>
                        <span className="font-medium text-gray-900">{quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(medicine.id)}
                          className="flex-1"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => addToCart(medicine.id)}
                      >
                        <ShoppingCart className="size-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <Card className="fixed bottom-6 right-6 w-80 shadow-2xl border-2 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingCart className="size-5" />
                Cart Summary
              </span>
              <Badge>{cart.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-40 overflow-y-auto space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-600">{item.quantity} x ₹{item.price}</p>
                  </div>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-green-600">
                  {cartTotal >= 500 ? 'FREE' : '₹50'}
                </span>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">
                  ₹{cartTotal + (cartTotal >= 500 ? 0 : 50)}
                </span>
              </div>
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700">
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Prescription Upload Modal */}
      {showPrescriptionUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upload Prescription</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPrescriptionUpload(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="size-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-4">
                  Upload a valid prescription to order this medicine
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Choose File
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  Supports: PDF, JPG, PNG (Max 5MB)
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                <p className="text-xs text-amber-800">
                  ⚠️ Prescription must be valid and contain doctor's signature and registration number
                </p>
              </div>

              <Button className="w-full" variant="outline" onClick={() => setShowPrescriptionUpload(false)}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
