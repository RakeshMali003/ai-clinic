import { useState } from 'react';
import React from 'react';
import {
  CreditCard,
  Download,
  Eye,
  Calendar,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/ui/card';
import { Button } from '../common/ui/button';
import { Badge } from '../common/ui/badge';
import { Input } from '../common/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/ui/select';
import type { PatientUser } from '../PatientPortal';

interface MyBillingProps {
  patient: PatientUser;
}

const invoices = [
  {
    id: 'INV-2025-001',
    date: 'Nov 10, 2025',
    service: 'Cardiology Consultation',
    provider: 'Dr. Sarah Johnson',
    amount: 1500,
    status: 'Paid',
    paymentDate: 'Nov 10, 2025',
    paymentMethod: 'UPI'
  },
  {
    id: 'INV-2025-002',
    date: 'Nov 05, 2025',
    service: 'Blood Test - CBC',
    provider: 'Lab Services',
    amount: 800,
    status: 'Pending',
    dueDate: 'Nov 12, 2025'
  },
  {
    id: 'INV-2025-003',
    date: 'Oct 28, 2025',
    service: 'General Checkup',
    provider: 'Dr. Rajesh Kumar',
    amount: 500,
    status: 'Paid',
    paymentDate: 'Oct 28, 2025',
    paymentMethod: 'Card'
  },
  {
    id: 'INV-2025-004',
    date: 'Oct 15, 2025',
    service: 'X-Ray Chest',
    provider: 'Radiology Dept',
    amount: 1200,
    status: 'Paid',
    paymentDate: 'Oct 15, 2025',
    paymentMethod: 'Cash'
  },
  {
    id: 'INV-2025-005',
    date: 'Oct 08, 2025',
    service: 'Lipid Profile Test',
    provider: 'Lab Services',
    amount: 650,
    status: 'Paid',
    paymentDate: 'Oct 08, 2025',
    paymentMethod: 'UPI'
  }
];

export function MyBilling({ patient }: MyBillingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);

  const invoices = (patient as any).invoices || [];

  const filteredInvoices = invoices.filter((invoice: any) =>
    invoice.invoice_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPaid = invoices.filter((i: any) => i.status === 'Paid').reduce((sum: number, i: any) => sum + Number(i.amount), 0);
  const totalPending = invoices.filter((i: any) => i.status === 'Pending').reduce((sum: number, i: any) => sum + Number(i.amount), 0);
  const completedCount = invoices.filter((i: any) => i.status === 'Paid').length;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-gray-900 mb-1">My Billing</h1>
          <p className="text-sm text-gray-600">View your invoices and pay your bills securely online</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-600 rounded-lg">
                <CheckCircle className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="font-semibold text-gray-900">₹{totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-600 rounded-lg">
                <Clock className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="font-semibold text-gray-900">₹{totalPending.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <CreditCard className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="font-semibold text-gray-900">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Invoice ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice: any) => (
                  <React.Fragment key={invoice.invoice_id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm text-gray-900">{invoice.invoice_id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="size-4" />
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{invoice.description}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">Clinic Visit</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">₹{invoice.amount}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {invoice.status === 'Paid' ? (
                          <Badge className="bg-green-600">
                            <CheckCircle className="size-3 mr-1" />
                            Paid
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-600">
                            <Clock className="size-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {invoice.status === 'Pending' ? (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => setShowPaymentModal(invoice.invoice_id)}
                            >
                              Pay Now
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline">
                              <Download className="size-4 mr-1" />
                              Download
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleExpand(invoice.invoice_id)}
                          >
                            {expandedId === invoice.invoice_id ? (
                              <ChevronUp className="size-4" />
                            ) : (
                              <ChevronDown className="size-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {expandedId === invoice.invoice_id && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Invoice Details</h4>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600 mb-1">Patient Name</p>
                                <p className="font-medium text-gray-900">{patient.full_name}</p>
                              </div>
                              <div>
                                <p className="text-gray-600 mb-1">Patient ID</p>
                                <p className="font-medium text-gray-900">{patient.patient_id}</p>
                              </div>
                              {invoice.status === 'Paid' && (
                                <>
                                  <div>
                                    <p className="text-gray-600 mb-1">Payment Date</p>
                                    <p className="font-medium text-gray-900">{new Date(invoice.updated_at).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600 mb-1">Payment Method</p>
                                    <p className="font-medium text-gray-900">Online</p>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="pt-3 border-t">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Service Charge</span>
                                <span className="font-medium text-gray-900">₹{invoice.amount}</span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="font-semibold text-gray-900">Total Amount</span>
                                <span className="font-semibold text-gray-900">
                                  ₹{invoice.amount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" />
                Make Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const invoice = invoices.find((i: any) => i.invoice_id === showPaymentModal);
                const total = invoice ? Math.round(Number(invoice.amount)) : 0;

                return (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Invoice ID</span>
                        <span className="text-sm font-mono font-medium">{showPaymentModal}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Service</span>
                        <span className="text-sm font-medium">{invoice?.service}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-medium text-gray-900">Amount to Pay</span>
                        <span className="font-semibold text-gray-900">₹{total}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <CreditCard className="size-4 mr-2" />
                        Pay with UPI
                      </Button>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <CreditCard className="size-4 mr-2" />
                        Pay with Card
                      </Button>
                      <Button className="w-full" variant="outline">
                        <CreditCard className="size-4 mr-2" />
                        Net Banking
                      </Button>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="size-4 text-blue-600 mt-0.5" />
                        <p className="text-xs text-blue-800">
                          Your payment is secured with 256-bit SSL encryption
                        </p>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => setShowPaymentModal(null)}
                    >
                      Cancel
                    </Button>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}