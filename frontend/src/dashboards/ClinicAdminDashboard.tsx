import { useState } from 'react';
import { User } from '../common/types';
import {
    Users,
    DollarSign,
    Building2,
    AlertCircle,
    TrendingUp,
    Stethoscope,
    Calendar,
    Shield
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ClinicAdminDashboardProps {
    user: User;
}

// Mock data
const mockRevenueData = [
    { day: 'Mon', revenue: 45000 },
    { day: 'Tue', revenue: 52000 },
    { day: 'Wed', revenue: 48000 },
    { day: 'Thu', revenue: 61000 },
    { day: 'Fri', revenue: 55000 },
    { day: 'Sat', revenue: 67000 },
    { day: 'Sun', revenue: 38000 },
];

const mockDepartmentData = [
    { dept: 'General', patients: 45 },
    { dept: 'Cardio', patients: 32 },
    { dept: 'Pediatric', patients: 28 },
    { dept: 'Ortho', patients: 24 },
    { dept: 'Lab', patients: 56 },
];

const mockStaffPerformance = [
    { name: 'Dr. Sarah Johnson', patients: 45, rating: 4.8, status: 'active' },
    { name: 'Dr. Michael Chen', patients: 38, rating: 4.9, status: 'active' },
    { name: 'Dr. Priya Sharma', patients: 32, rating: 4.7, status: 'active' },
    { name: 'Dr. Rajesh Kumar', patients: 28, rating: 4.6, status: 'on-leave' },
];

export function ClinicAdminDashboard({ user }: ClinicAdminDashboardProps) {
    const stats = [
        { label: 'Total Revenue', value: '₹3,66,000', change: '+18%', icon: DollarSign, color: 'green' },
        { label: 'Active Doctors', value: '12', change: '+2', icon: Stethoscope, color: 'blue' },
        { label: 'Total Patients', value: '1,247', change: '+15%', icon: Users, color: 'purple' },
        { label: 'Pending Issues', value: '3', change: '-2', icon: AlertCircle, color: 'orange' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Clinic Admin Dashboard</h1>
                <p className="text-gray-600">Complete clinic management and oversight</p>
            </div>

            {/* Stats Grid - ROLE: Admin can view ALL clinic stats */}
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

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-900">Weekly Revenue</h3>
                            <p className="text-sm text-gray-600">Last 7 days performance</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>+18%</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={mockRevenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ fill: '#10b981', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Department Performance */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-900">Department Performance</h3>
                            <p className="text-sm text-gray-600">Patient distribution</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={mockDepartmentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="dept" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="patients" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Staff Performance - ROLE: Admin can view and manage all staff */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Doctor Performance</h3>
                        <p className="text-sm text-gray-600">This week's overview</p>
                    </div>
                    {/* ROLE: Admin can add new doctors */}
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        + Add Doctor
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patients</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {mockStaffPerformance.map((doctor, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{doctor.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{doctor.patients}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            ⭐ {doctor.rating}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${doctor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1).replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* ROLE: Admin can edit/manage doctors */}
                                        <button className="text-sm text-blue-600 hover:underline mr-3">Edit</button>
                                        <button className="text-sm text-gray-600 hover:underline">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions - ROLE: Admin specific actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <Stethoscope className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Manage Doctors</h3>
                    <p className="text-sm text-gray-600 mb-3">Add, edit, or remove doctors</p>
                    <button className="text-sm text-blue-600 hover:underline font-medium">
                        Manage →
                    </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <Users className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Staff Management</h3>
                    <p className="text-sm text-gray-600 mb-3">Manage all clinic staff</p>
                    <button className="text-sm text-green-600 hover:underline font-medium">
                        Manage →
                    </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <Building2 className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Clinic Profile</h3>
                    <p className="text-sm text-gray-600 mb-3">Update clinic information</p>
                    <button className="text-sm text-purple-600 hover:underline font-medium">
                        Update →
                    </button>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                    <Shield className="w-8 h-8 text-orange-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Security Settings</h3>
                    <p className="text-sm text-gray-600 mb-3">Manage access and permissions</p>
                    <button className="text-sm text-orange-600 hover:underline font-medium">
                        Configure →
                    </button>
                </div>
            </div>
        </div>
    );
}
