import { useState } from 'react';
import { UserRole } from '../common/types';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Download, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

interface ReportsAnalyticsProps {
    userRole: UserRole;
}

const appointmentData = [
    { day: 'Mon', appointments: 24 },
    { day: 'Tue', appointments: 28 },
    { day: 'Wed', appointments: 32 },
    { day: 'Thu', appointments: 26 },
    { day: 'Fri', appointments: 30 },
    { day: 'Sat', appointments: 18 },
    { day: 'Sun', appointments: 12 },
];

const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
];

const patientDistribution = [
    { name: 'New Patients', value: 35, color: '#3b82f6' },
    { name: 'Follow-up', value: 45, color: '#10b981' },
    { name: 'Emergency', value: 15, color: '#f59e0b' },
    { name: 'Referrals', value: 5, color: '#8b5cf6' },
];

const doctorPerformance = [
    { doctor: 'Dr. Sarah Johnson', patients: 156, revenue: 45230, satisfaction: 4.8 },
    { doctor: 'Dr. Michael Chen', patients: 142, revenue: 41800, satisfaction: 4.7 },
    { doctor: 'Dr. Emily Brown', patients: 128, revenue: 38500, satisfaction: 4.9 },
    { doctor: 'Dr. Robert Davis', patients: 134, revenue: 39200, satisfaction: 4.6 },
];

export function ReportsAnalytics({ userRole }: ReportsAnalyticsProps) {
    const [dateRange, setDateRange] = useState('week');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-600">Comprehensive clinic performance insights</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="year">Last Year</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Download className="w-5 h-5" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">170</p>
                            <p className="text-sm text-gray-600">Total Appointments</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>+12% from last week</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">₹67,000</p>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>+18% from last month</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">560</p>
                            <p className="text-sm text-gray-600">Active Patients</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>+8% from last month</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Activity className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">4.7</p>
                            <p className="text-sm text-gray-600">Avg Satisfaction</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>+0.3 from last month</span>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Appointments */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Daily Appointments</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={appointmentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="appointments" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Trend */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Patient Distribution */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Patient Visit Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={patientDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {patientDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Doctor Performance */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Doctor Performance</h3>
                    <div className="space-y-3">
                        {doctorPerformance.map((doc, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-gray-900">{doc.doctor}</p>
                                    <span className="text-sm text-yellow-600">★ {doc.satisfaction}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Patients:</span>
                                        <span className="ml-2 font-medium text-gray-900">{doc.patients}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Revenue:</span>
                                        <span className="ml-2 font-medium text-gray-900">₹{doc.revenue.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
