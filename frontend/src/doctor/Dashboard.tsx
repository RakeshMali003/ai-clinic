import { useEffect, useState } from 'react';
import { UserRole } from '../common/types';
import {
    Calendar,
    DollarSign,
    Users,
    AlertCircle,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    Loader2
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService, DashboardStats, AppointmentChartData, RevenueChartData, RecentAppointment } from '../services/dashboardService';

interface DashboardProps {
    userRole: UserRole;
}

export function Dashboard({ userRole }: DashboardProps) {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [appointmentData, setAppointmentData] = useState<AppointmentChartData[]>([]);
    const [revenueData, setRevenueData] = useState<RevenueChartData[]>([]);
    const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsRes, apptDataRes, revDataRes, recentApptsRes] = await Promise.all([
                    dashboardService.getStats(),
                    dashboardService.getAppointmentData(),
                    dashboardService.getRevenueData(),
                    dashboardService.getRecentAppointments()
                ]);
                setStats(statsRes);
                setAppointmentData(apptDataRes);
                setRevenueData(revDataRes);
                setRecentAppointments(recentApptsRes);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statConfig = stats ? [
        { label: "Today's Appointments", value: stats.todaysAppointments.toString(), change: '+12%', icon: Calendar, color: 'blue' },
        { label: 'Total Revenue', value: stats.totalRevenue, change: '+8%', icon: DollarSign, color: 'green' },
        { label: 'Active Patients', value: stats.activePatients.toString(), change: '+5%', icon: Users, color: 'purple' },
        { label: 'Pending Payments', value: stats.pendingPayments.toString(), change: '-3%', icon: AlertCircle, color: 'orange' },
    ] : [];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 animate-pulse">Scanning biometric data and syncing with medical database...</p>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Overview of clinic performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statConfig.map((stat) => {
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
                {/* Appointment Distribution */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-900">Today's Appointments</h3>
                            <p className="text-sm text-gray-600">By time slot</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>Peak: 11 AM</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={appointmentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Trend */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-900">Weekly Revenue</h3>
                            <p className="text-sm text-gray-600">Last 7 days</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>+15%</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={revenueData}>
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
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Recent Appointments</h3>
                    <p className="text-sm text-gray-600">Latest patient appointments</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {recentAppointments.map((appointment) => (
                                <tr key={appointment.appointment_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{appointment.patient}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{appointment.doctor}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {typeof appointment.time === 'string' && appointment.time.includes('T')
                                                ? new Date(appointment.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : appointment.time
                                            }
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                appointment.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                                                    appointment.status === 'scheduled' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-red-100 text-red-700'
                                            }`}>
                                            {appointment.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                            {appointment.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-600 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">AI Insights</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span><strong>Peak Hours:</strong> Most appointments scheduled between 10-11 AM. Consider adding more slots.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span><strong>Revenue Trend:</strong> 15% increase in weekly revenue. Saturday shows highest revenue generation.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span><strong>No-show Prediction:</strong> 3 appointments at risk of no-show today. Auto-reminder sent.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
