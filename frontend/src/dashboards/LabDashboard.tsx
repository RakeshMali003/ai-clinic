import { User } from '../common/types';
import {
    FlaskConical,
    CheckCircle,
    AlertCircle,
    Clock,
    TrendingUp,
    FileText,
    Activity,
    AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LabDashboardProps {
    user: User;
}

// Mock data
const mockTestsData = [
    { category: 'Blood', count: 24 },
    { category: 'Urine', count: 18 },
    { category: 'X-Ray', count: 12 },
    { category: 'ECG', count: 8 },
    { category: 'Ultrasound', count: 6 },
];

const mockPendingTests = [
    { id: 1, patient: 'John Smith', test: 'Complete Blood Count', priority: 'high', orderedBy: 'Dr. Sarah Johnson', time: '9:00 AM' },
    { id: 2, patient: 'Emily Davis', test: 'Lipid Profile', priority: 'normal', orderedBy: 'Dr. Michael Chen', time: '9:30 AM' },
    { id: 3, patient: 'Robert Brown', test: 'Chest X-Ray', priority: 'urgent', orderedBy: 'Dr. Sarah Johnson', time: '10:00 AM' },
    { id: 4, patient: 'Lisa Anderson', test: 'Urine Analysis', priority: 'normal', orderedBy: 'Dr. Michael Chen', time: '10:30 AM' },
];

export function LabDashboard({ user }: LabDashboardProps) {
    const stats = [
        { label: 'Pending Tests', value: '24', change: '+8%', icon: Clock, color: 'orange' },
        { label: 'Completed Today', value: '68', change: '+15%', icon: CheckCircle, color: 'green' },
        { label: 'Critical Results', value: '3', change: '+1', icon: AlertTriangle, color: 'red' },
        { label: 'Equipment Status', value: '98%', change: '+2%', icon: Activity, color: 'blue' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Lab Dashboard</h1>
                <p className="text-gray-600">Laboratory tests and diagnostics management</p>
            </div>

            {/* Stats Grid - ROLE: Lab technician can view lab stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </div>
                                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Tests by Category Chart */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-gray-900">Tests by Category</h3>
                        <p className="text-sm text-gray-600">Today's distribution</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>92 Total</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={mockTestsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Pending Tests - ROLE: Lab technician can process and update test results */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Pending Tests</h3>
                    <p className="text-sm text-gray-600">Tests awaiting processing</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ordered By</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {mockPendingTests.map((test) => (
                                <tr key={test.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{test.patient}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{test.test}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{test.orderedBy}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {test.time}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${test.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                                test.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {test.priority.charAt(0).toUpperCase() + test.priority.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* ROLE: Lab technician can process tests and upload results */}
                                        <button className="text-sm text-blue-600 hover:underline mr-3">Process</button>
                                        <button className="text-sm text-gray-600 hover:underline">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions - ROLE: Lab technician specific actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <FlaskConical className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Process Test</h3>
                    <p className="text-sm text-gray-600 mb-3">Record test results</p>
                    <button className="text-sm text-blue-600 hover:underline font-medium">
                        Start →
                    </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <FileText className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Upload Results</h3>
                    <p className="text-sm text-gray-600 mb-3">Submit completed test reports</p>
                    <button className="text-sm text-green-600 hover:underline font-medium">
                        Upload →
                    </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <Activity className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Equipment Status</h3>
                    <p className="text-sm text-gray-600 mb-3">Check and maintain equipment</p>
                    <button className="text-sm text-purple-600 hover:underline font-medium">
                        View Status →
                    </button>
                </div>
            </div>
        </div>
    );
}
