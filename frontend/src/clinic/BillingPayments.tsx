import { useState } from 'react';
import { UserRole } from '../App';
import { Plus, Search, Download, Eye, Sparkles, CreditCard, Wallet, DollarSign, TrendingUp } from 'lucide-react';

interface BillingPaymentsProps {
  userRole: UserRole;
}

interface Invoice {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  services: ServiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  paymentMode?: 'cash' | 'card' | 'upi' | 'insurance';
}

interface ServiceItem {
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    patientName: 'John Smith',
    patientId: 'P001',
    date: '2025-01-12',
    services: [
      { name: 'Consultation Fee', quantity: 1, rate: 500, amount: 500 },
      { name: 'Blood Test', quantity: 1, rate: 800, amount: 800 },
      { name: 'ECG', quantity: 1, rate: 300, amount: 300 }
    ],
    subtotal: 1600,
    tax: 288,
    discount: 0,
    total: 1888,
    paymentStatus: 'paid',
    paymentMode: 'upi'
  },
  {
    id: 'INV-002',
    patientName: 'Emily Davis',
    patientId: 'P002',
    date: '2025-01-12',
    services: [
      { name: 'Consultation Fee', quantity: 1, rate: 500, amount: 500 },
      { name: 'X-Ray', quantity: 1, rate: 1200, amount: 1200 }
    ],
    subtotal: 1700,
    tax: 306,
    discount: 100,
    total: 1906,
    paymentStatus: 'pending'
  },
  {
    id: 'INV-003',
    patientName: 'Robert Brown',
    patientId: 'P003',
    date: '2025-01-11',
    services: [
      { name: 'Consultation Fee', quantity: 1, rate: 800, amount: 800 },
      { name: 'Medicine', quantity: 1, rate: 450, amount: 450 }
    ],
    subtotal: 1250,
    tax: 225,
    discount: 50,
    total: 1425,
    paymentStatus: 'paid',
    paymentMode: 'card'
  },
  {
    id: 'INV-004',
    patientName: 'Lisa Anderson',
    patientId: 'P004',
    date: '2025-01-11',
    services: [
      { name: 'Consultation Fee', quantity: 1, rate: 500, amount: 500 }
    ],
    subtotal: 500,
    tax: 90,
    discount: 0,
    total: 590,
    paymentStatus: 'partial',
    paymentMode: 'cash'
  },
];

export function BillingPayments({ userRole }: BillingPaymentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredInvoices = mockInvoices.filter(invoice =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = mockInvoices.filter(inv => inv.paymentStatus === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingPayments = mockInvoices.filter(inv => inv.paymentStatus === 'pending' || inv.paymentStatus === 'partial').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600">Manage invoices and track payments</p>
        </div>
        {(userRole === 'admin' || userRole === 'receptionist') && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Invoice
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockInvoices.length}</p>
          <p className="text-sm text-gray-600">Total Invoices</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50">
              <Wallet className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
          <p className="text-sm text-gray-600">Pending Payments</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">+15%</p>
          <p className="text-sm text-gray-600">Monthly Growth</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">AI Revenue Insights</h3>
            <p className="text-sm text-gray-700">
              Revenue forecasting shows a potential ₹52,000 for next week. UPI payments increased by 23% this month. 
              Auto-generated payment reminders sent to 8 pending invoices.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice ID, patient name, or patient ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Mode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invoice.patientName}</p>
                      <p className="text-xs text-gray-500">{invoice.patientId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ₹{invoice.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {invoice.paymentMode ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 uppercase">
                        {invoice.paymentMode}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      invoice.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                      invoice.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedInvoice(invoice)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Invoice Details</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedInvoice(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Invoice Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Elinic Healthcare</h3>
                  <p className="text-sm text-gray-600">123 Medical Street, Mumbai</p>
                  <p className="text-sm text-gray-600">GST: 27AABCU9603R1ZM</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Invoice #</p>
                  <p className="text-xl font-bold text-gray-900">{selectedInvoice.id}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Date: {new Date(selectedInvoice.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Patient Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Bill To</p>
                <p className="font-semibold text-gray-900">{selectedInvoice.patientName}</p>
                <p className="text-sm text-gray-600">Patient ID: {selectedInvoice.patientId}</p>
              </div>

              {/* Services Table */}
              <div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedInvoice.services.map((service, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{service.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-center">{service.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">₹{service.rate}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">₹{service.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{selectedInvoice.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (18% GST)</span>
                    <span className="text-gray-900">₹{selectedInvoice.tax}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600">-₹{selectedInvoice.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-gray-900">₹{selectedInvoice.total}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Payment Status</p>
                    <p className="text-lg font-bold text-blue-600 capitalize">{selectedInvoice.paymentStatus}</p>
                  </div>
                  {selectedInvoice.paymentMode && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">Payment Mode</p>
                      <p className="text-lg font-bold text-blue-600 uppercase">{selectedInvoice.paymentMode}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create New Invoice</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Select Patient</option>
                      <option>John Smith (P001)</option>
                      <option>Emily Davis (P002)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Services</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-2">
                      <input placeholder="Service name" className="col-span-5 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      <input type="number" placeholder="Qty" className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      <input type="number" placeholder="Rate" className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      <input placeholder="Amount" className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" disabled />
                      <button type="button" className="col-span-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (₹)</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Cash</option>
                      <option>Card</option>
                      <option>UPI</option>
                      <option>Insurance</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generate Invoice
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
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
