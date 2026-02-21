import { useState, useEffect } from 'react';
import { User } from '../common/types';
import {
    Calendar,
    Users,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Clock,
    FileText,
    Activity
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DoctorDashboardProps {
    user: User;
}

// Mock data for doctor dashboard
const mockAppointmentData = [
    { time: '9 AM', count: 2 },
    { time: '10 AM', count: 4 },
    { time: '11 AM', count: 5 },
    { time: '12 PM', count: 3 },
    { time: '2 PM', count: 4 },
    { time: '3 PM', count: 3 },
    { time: '4 PM', count: 2 },
];

const mockPatientData = [
    { day: 'Mon', patients: 12 },
    { day: 'Tue', patients: 15 },
    { day: 'Wed', patients: 18 },
    { day: 'Thu', patients: 14 },
    { day: 'Fri', patients: 20 },
    { day: 'Sat', patients: 16 },
    { day: 'Sun', patients: 8 },
];

const mockRecentAppointments = [
    { id: 1, patient: 'John Smith', time: '9:30 AM', type: 'Consultation', status: 'completed' },
    { id: 2, patient: 'Emily Davis', time: '10:00 AM', type: 'Follow-up', status: 'in-progress' },
    { id: 3, patient: 'Robert Brown', time: '10:30 AM', type: 'Checkup', status: 'waiting' },
    { id: 4, patient: 'Lisa Anderson', time: '11:00 AM', type: 'Consultation', status: 'scheduled' },
];

export function DoctorDashboard({ user }: DoctorDashboardProps) {
    const [loading, setLoading] = useState(false);

    const stats = [
        { label: "Today's Appointments", value: '23', change: '+12%', icon: Calendar, color: 'blue' },
        { label: 'Active Patients', value: '156', change: '+5%', icon: Users, color: 'purple' },
        { label: 'Completed Today', value: '18', change: '+8%', icon: CheckCircle, color: 'green' },
        { label: 'Pending Reviews', value: '5', change: '-2%', icon: AlertCircle, color: 'orange' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
                <p className="text-gray-600">Welcome back, Dr. {user.name}</p>
            </div>

            {/* Stats Grid - ROLE: Doctor can view all stats */}
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
                {/* Today's Appointments */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
                            <p className="text-sm text-gray-600">Appointments by time slot</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>Peak: 11 AM</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={mockAppointmentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Weekly Patient Trend */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-900">Weekly Patients</h3>
                            <p className="text-sm text-gray-600">Last 7 days</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>+12%</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={mockPatientData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="patients"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ fill: '#10b981', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Today's Appointments</h3>
                    <p className="text-sm text-gray-600">Your upcoming consultations</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {mockRecentAppointments.map((appointment) => (
                                <tr key={appointment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{appointment.patient}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {appointment.time}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{appointment.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                    appointment.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-purple-100 text-purple-700'
                                            }`}>
                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* ROLE: Doctor can view/edit patient records */}
                                        <button className="text-sm text-blue-600 hover:underline">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions - ROLE: Doctor specific actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <FileText className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Write Prescription</h3>
                    <p className="text-sm text-gray-600 mb-3">Create new prescription for patients</p>
                    <button className="text-sm text-blue-600 hover:underline font-medium">
                        Create Now →
                    </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <Activity className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Patient Records</h3>
                    <p className="text-sm text-gray-600 mb-3">View and update medical records</p>
                    <button className="text-sm text-green-600 hover:underline font-medium">
                        View Records →
                    </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <Calendar className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Manage Schedule</h3>
                    <p className="text-sm text-gray-600 mb-3">Update availability and time slots</p>
                    <button className="text-sm text-purple-600 hover:underline font-medium">
                        Manage →
                    </button>
                </div>
            </div>
        </div>
    );
}
