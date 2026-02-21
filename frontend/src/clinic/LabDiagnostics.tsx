import { useState } from 'react';
import { UserRole } from '../common/types';
import { Search, Plus, FlaskConical, Upload, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface LabDiagnosticsProps {
  userRole: UserRole;
}

interface LabTest {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  testType: string;
  orderDate: string;
  collectionDate?: string;
  reportDate?: string;
  status: 'pending' | 'collected' | 'processing' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent';
  price: number;
  results?: string;
}

const mockLabTests: LabTest[] = [
  {
    id: 'LAB-001',
    patientName: 'John Smith',
    patientId: 'P001',
    doctorName: 'Dr. Sarah Johnson',
    testType: 'Complete Blood Count',
    orderDate: '2025-01-12',
    collectionDate: '2025-01-12',
    status: 'processing',
    priority: 'normal',
    price: 800
  },
  {
    id: 'LAB-002',
    patientName: 'Emily Davis',
    patientId: 'P002',
    doctorName: 'Dr. Michael Chen',
    testType: 'Lipid Profile',
    orderDate: '2025-01-12',
    collectionDate: '2025-01-12',
    reportDate: '2025-01-12',
    status: 'completed',
    priority: 'normal',
    price: 1200,
    results: 'Available'
  },
  {
    id: 'LAB-003',
    patientName: 'Robert Brown',
    patientId: 'P003',
    doctorName: 'Dr. Sarah Johnson',
    testType: 'HbA1c',
    orderDate: '2025-01-12',
    status: 'pending',
    priority: 'urgent',
    price: 600
  },
  {
    id: 'LAB-004',
    patientName: 'Lisa Anderson',
    patientId: 'P004',
    doctorName: 'Dr. Michael Chen',
    testType: 'Thyroid Function Test',
    orderDate: '2025-01-11',
    collectionDate: '2025-01-11',
    reportDate: '2025-01-12',
    status: 'completed',
    priority: 'normal',
    price: 900,
    results: 'Available'
  },
];

const testTypes = [
  { name: 'Complete Blood Count', price: 800, turnaround: '6 hours' },
  { name: 'Lipid Profile', price: 1200, turnaround: '12 hours' },
  { name: 'Liver Function Test', price: 1000, turnaround: '12 hours' },
  { name: 'Kidney Function Test', price: 900, turnaround: '12 hours' },
  { name: 'Thyroid Function Test', price: 900, turnaround: '24 hours' },
  { name: 'HbA1c', price: 600, turnaround: '6 hours' },
  { name: 'Urine Routine', price: 400, turnaround: '4 hours' },
  { name: 'ECG', price: 300, turnaround: '1 hour' },
  { name: 'X-Ray Chest', price: 1200, turnaround: '2 hours' },
];

export function LabDiagnostics({ userRole }: LabDiagnosticsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

  const filteredTests = mockLabTests.filter(test => {
    const matchesSearch = test.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || test.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingTests = mockLabTests.filter(t => t.status === 'pending' || t.status === 'collected').length;
  const completedToday = mockLabTests.filter(t => t.status === 'completed' && t.reportDate === '2025-01-12').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab & Diagnostics</h1>
          <p className="text-gray-600">Manage lab tests and diagnostic reports</p>
        </div>
        {(userRole === 'admin' || userRole === 'doctor' || userRole === 'lab') && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Lab Order
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <FlaskConical className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockLabTests.length}</p>
          <p className="text-sm text-gray-600">Total Tests</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-50">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{pendingTests}</p>
          <p className="text-sm text-gray-600">Pending Tests</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{completedToday}</p>
          <p className="text-sm text-gray-600">Completed Today</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50">
              <FlaskConical className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{testTypes.length}</p>
          <p className="text-sm text-gray-600">Test Types Available</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by test ID, patient name, or test type..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'processing', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lab Tests Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{test.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{test.patientName}</p>
                      <p className="text-xs text-gray-500">{test.patientId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{test.testType}</p>
                      {test.priority === 'urgent' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 mt-1">
                          Urgent
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{test.doctorName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(test.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{test.price}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${test.status === 'completed' ? 'bg-green-100 text-green-700' :
                      test.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        test.status === 'collected' ? 'bg-purple-100 text-purple-700' :
                          test.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                      }`}>
                      {test.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                      {test.status === 'processing' && <Clock className="w-3 h-3" />}
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {test.status === 'completed' && test.results && (
                        <button
                          onClick={() => setSelectedTest(test)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      {userRole === 'lab' && test.status === 'processing' && (
                        <button
                          onClick={() => {
                            setSelectedTest(test);
                            setShowUploadModal(true);
                          }}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Upload Report"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Type Pricing */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Available Test Types & Pricing</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testTypes.map((test, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{test.name}</h4>
                  <FlaskConical className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">₹{test.price}</span>
                  <span className="text-xs text-gray-500">TAT: {test.turnaround}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Lab Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create Lab Order</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Select Doctor</option>
                      <option>Dr. Sarah Johnson</option>
                      <option>Dr. Michael Chen</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Test Type *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Select Test Type</option>
                      {testTypes.map((test, index) => (
                        <option key={index} value={test.name}>
                          {test.name} - ₹{test.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Normal</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Collection Date</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2}></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Order
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

      {/* Upload Report Modal */}
      {showUploadModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Upload Lab Report</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedTest(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Test ID: <strong>{selectedTest.id}</strong></p>
                <p className="text-sm text-gray-600">Patient: <strong>{selectedTest.patientName}</strong></p>
                <p className="text-sm text-gray-600">Test: <strong>{selectedTest.testType}</strong></p>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Report *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PDF (Max 10MB)</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Upload & Complete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      setSelectedTest(null);
                    }}
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
