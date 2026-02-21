import { useState } from 'react';
import { UserRole } from '../common/types';
import {
    TestTube,
    Search,
    Plus,
    Eye,
    Download,
    Upload,
    Calendar,
    User,
    AlertCircle,
    CheckCircle,
    Clock,
    X,
    FileText,
    Activity
} from 'lucide-react';

interface LabDiagnosticsProps {
    userRole: UserRole;
}

interface LabTest {
    id: number;
    patientName: string;
    patientId: string;
    testName: string;
    testType: string;
    orderedBy: string;
    orderedDate: string;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'normal' | 'urgent' | 'stat';
    results?: string;
}

const mockLabTests: LabTest[] = [
    {
        id: 1,
        patientName: 'John Smith',
        patientId: 'P001',
        testName: 'Complete Blood Count (CBC)',
        testType: 'Hematology',
        orderedBy: 'Dr. Sarah Johnson',
        orderedDate: '2024-02-15',
        status: 'completed',
        priority: 'normal',
        results: 'Normal ranges'
    },
    {
        id: 2,
        patientName: 'Emily Davis',
        patientId: 'P002',
        testName: 'Lipid Panel',
        testType: 'Chemistry',
        orderedBy: 'Dr. Michael Chen',
        orderedDate: '2024-02-16',
        status: 'in-progress',
        priority: 'normal'
    },
    {
        id: 3,
        patientName: 'Robert Brown',
        patientId: 'P003',
        testName: 'HbA1c',
        testType: 'Chemistry',
        orderedBy: 'Dr. Sarah Johnson',
        orderedDate: '2024-02-17',
        status: 'pending',
        priority: 'urgent'
    },
];

export function LabDiagnostics({ userRole }: LabDiagnosticsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    const filteredTests = mockLabTests.filter(test => {
        const matchesSearch = test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.patientId.includes(searchTerm) ||
            test.testName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const canOrder = userRole === 'doctor' || userRole === 'admin';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lab Diagnostics</h1>
                    <p className="text-gray-600">Manage lab tests and view results</p>
                </div>
                {canOrder && (
                    <button
                        onClick={() => setShowOrderModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Order Test
                    </button>
                )}
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by patient, test name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {mockLabTests.filter(t => t.status === 'pending').length}
                            </p>
                            <p className="text-sm text-gray-600">Pending</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {mockLabTests.filter(t => t.status === 'in-progress').length}
                            </p>
                            <p className="text-sm text-gray-600">In Progress</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {mockLabTests.filter(t => t.status === 'completed').length}
                            </p>
                            <p className="text-sm text-gray-600">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {mockLabTests.filter(t => t.priority === 'urgent' || t.priority === 'stat').length}
                            </p>
                            <p className="text-sm text-gray-600">Urgent</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Test List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ordered By</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTests.map((test) => (
                                <tr key={test.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{test.patientName}</p>
                                                <p className="text-sm text-gray-600">ID: {test.patientId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <TestTube className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm text-gray-900">{test.testName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{test.testType}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{test.orderedBy}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            {test.orderedDate}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${test.priority === 'stat' ? 'bg-red-100 text-red-700' :
                                                test.priority === 'urgent' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {test.priority.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${test.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                test.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                    test.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                            }`}>
                                            {test.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                            {test.status === 'in-progress' && <Activity className="w-3 h-3" />}
                                            {test.status === 'pending' && <Clock className="w-3 h-3" />}
                                            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setSelectedTest(test)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {test.status === 'completed' && (
                                                <button
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Download Report"
                                                >
                                                    <Download className="w-4 h-4" />
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

            {/* Test Details Modal */}
            {selectedTest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Lab Test Details</h2>
                            <button
                                onClick={() => setSelectedTest(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Patient Name</label>
                                    <p className="text-gray-900 mt-1">{selectedTest.patientName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Patient ID</label>
                                    <p className="text-gray-900 mt-1">{selectedTest.patientId}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Test Name</label>
                                    <p className="text-gray-900 mt-1">{selectedTest.testName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Test Type</label>
                                    <p className="text-gray-900 mt-1">{selectedTest.testType}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Ordered By</label>
                                    <p className="text-gray-900 mt-1">{selectedTest.orderedBy}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Ordered Date</label>
                                    <p className="text-gray-900 mt-1">{selectedTest.orderedDate}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Priority</label>
                                    <p className="text-gray-900 mt-1">{selectedTest.priority.toUpperCase()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                    <p className="text-gray-900 mt-1">{selectedTest.status}</p>
                                </div>
                            </div>

                            {selectedTest.results && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Results</label>
                                    <div className="mt-2 p-4 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-gray-900">{selectedTest.results}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                {selectedTest.status === 'completed' && (
                                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        <Download className="w-4 h-4 inline mr-2" />
                                        Download Report
                                    </button>
                                )}
                                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Test Modal */}
            {showOrderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Order Lab Test</h2>
                            <button
                                onClick={() => setShowOrderModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Hematology</option>
                                            <option>Chemistry</option>
                                            <option>Microbiology</option>
                                            <option>Immunology</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Complete Blood Count (CBC)</option>
                                            <option>Lipid Panel</option>
                                            <option>HbA1c</option>
                                            <option>Thyroid Panel</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Normal</option>
                                            <option>Urgent</option>
                                            <option>STAT</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Collection Date</label>
                                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
                                    <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Order Test
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowOrderModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
