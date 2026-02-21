import { useState } from 'react';
import { UserRole } from '../App';
import { Search, Plus, AlertTriangle, TrendingDown, Package, Pill } from 'lucide-react';

interface PharmacyInventoryProps {
  userRole: UserRole;
}

interface Medicine {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  minStock: number;
  price: number;
  mrp: number;
  location: string;
}

const mockMedicines: Medicine[] = [
  {
    id: 'M001',
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    manufacturer: 'ABC Pharma',
    batchNumber: 'BT12345',
    expiryDate: '2026-12-31',
    quantity: 250,
    minStock: 50,
    price: 2.5,
    mrp: 5,
    location: 'Shelf A1'
  },
  {
    id: 'M002',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotic',
    manufacturer: 'XYZ Pharma',
    batchNumber: 'BT12346',
    expiryDate: '2025-06-30',
    quantity: 120,
    minStock: 40,
    price: 8,
    mrp: 15,
    location: 'Shelf A2'
  },
  {
    id: 'M003',
    name: 'Cetirizine 10mg',
    category: 'Antihistamine',
    manufacturer: 'DEF Pharma',
    batchNumber: 'BT12347',
    expiryDate: '2026-09-15',
    quantity: 180,
    minStock: 60,
    price: 3,
    mrp: 6,
    location: 'Shelf B1'
  },
  {
    id: 'M004',
    name: 'Omeprazole 20mg',
    category: 'Antacid',
    manufacturer: 'GHI Pharma',
    batchNumber: 'BT12348',
    expiryDate: '2025-03-20',
    quantity: 35,
    minStock: 50,
    price: 5,
    mrp: 10,
    location: 'Shelf B2'
  },
  {
    id: 'M005',
    name: 'Metformin 500mg',
    category: 'Diabetes',
    manufacturer: 'JKL Pharma',
    batchNumber: 'BT12349',
    expiryDate: '2025-02-10',
    quantity: 22,
    minStock: 40,
    price: 4,
    mrp: 8,
    location: 'Shelf C1'
  },
];

export function PharmacyInventory({ userRole }: PharmacyInventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredMedicines = mockMedicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || medicine.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = mockMedicines.filter(m => m.quantity <= m.minStock).length;
  const expiringCount = mockMedicines.filter(m => {
    const daysUntilExpiry = Math.ceil((new Date(m.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  }).length;

  const isLowStock = (medicine: Medicine) => medicine.quantity <= medicine.minStock;
  const isExpiringSoon = (medicine: Medicine) => {
    const daysUntilExpiry = Math.ceil((new Date(medicine.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pharmacy & Inventory</h1>
          <p className="text-gray-600">Manage medicine stock and inventory</p>
        </div>
        {(userRole === 'admin' || userRole === 'pharmacist') && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Medicine
          </button>
        )}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockMedicines.length}</p>
          <p className="text-sm text-gray-600">Total Items</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
          <p className="text-sm text-gray-600">Low Stock Items</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-50">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">{expiringCount}</p>
          <p className="text-sm text-gray-600">Expiring Soon (&lt;90 days)</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by medicine name, ID, or manufacturer..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Pain Relief">Pain Relief</option>
            <option value="Antibiotic">Antibiotic</option>
            <option value="Antihistamine">Antihistamine</option>
            <option value="Antacid">Antacid</option>
            <option value="Diabetes">Diabetes</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/MRP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMedicines.map((medicine) => (
                <tr key={medicine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{medicine.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{medicine.name}</p>
                      <p className="text-xs text-gray-500">{medicine.manufacturer}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {medicine.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`text-sm font-semibold ${
                        isLowStock(medicine) ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {medicine.quantity} units
                      </p>
                      <p className="text-xs text-gray-500">Min: {medicine.minStock}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900 font-medium">₹{medicine.price}</p>
                      <p className="text-xs text-gray-500">MRP: ₹{medicine.mrp}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm ${
                      isExpiringSoon(medicine) ? 'text-red-600 font-medium' : 'text-gray-600'
                    }`}>
                      {new Date(medicine.expiryDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {isLowStock(medicine) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          <TrendingDown className="w-3 h-3" />
                          Low Stock
                        </span>
                      )}
                      {isExpiringSoon(medicine) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <AlertTriangle className="w-3 h-3" />
                          Expiring Soon
                        </span>
                      )}
                      {!isLowStock(medicine) && !isExpiringSoon(medicine) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          In Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedMedicine(medicine)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Medicine Details Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Medicine Details</h2>
                <button 
                  onClick={() => setSelectedMedicine(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedMedicine.name}</h3>
                  <p className="text-gray-600">{selectedMedicine.category}</p>
                  <p className="text-sm text-gray-500">{selectedMedicine.manufacturer}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Medicine ID</label>
                  <p className="text-gray-900 font-medium">{selectedMedicine.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Batch Number</label>
                  <p className="text-gray-900 font-medium">{selectedMedicine.batchNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Current Stock</label>
                  <p className={`font-bold text-lg ${
                    isLowStock(selectedMedicine) ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {selectedMedicine.quantity} units
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Minimum Stock</label>
                  <p className="text-gray-900 font-medium">{selectedMedicine.minStock} units</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Purchase Price</label>
                  <p className="text-gray-900 font-medium">₹{selectedMedicine.price}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">MRP</label>
                  <p className="text-gray-900 font-medium">₹{selectedMedicine.mrp}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Expiry Date</label>
                  <p className={`font-medium ${
                    isExpiringSoon(selectedMedicine) ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {new Date(selectedMedicine.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                  <p className="text-gray-900 font-medium">{selectedMedicine.location}</p>
                </div>
              </div>

              {/* Alerts */}
              {(isLowStock(selectedMedicine) || isExpiringSoon(selectedMedicine)) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Alerts
                  </h4>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    {isLowStock(selectedMedicine) && (
                      <li>• Stock level below minimum threshold. Reorder recommended.</li>
                    )}
                    {isExpiringSoon(selectedMedicine) && (
                      <li>• Medicine expiring within 90 days. Plan clearance or return.</li>
                    )}
                  </ul>
                </div>
              )}

              {(userRole === 'admin' || userRole === 'pharmacist') && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Update Stock
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Edit Details
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add New Medicine</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Select Category</option>
                      <option>Pain Relief</option>
                      <option>Antibiotic</option>
                      <option>Antihistamine</option>
                      <option>Antacid</option>
                      <option>Diabetes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer *</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number *</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock *</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (₹) *</label>
                    <input type="number" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹) *</label>
                    <input type="number" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., Shelf A1" />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Medicine
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
