import { useState } from 'react';
import { UserRole } from '../common/types';
import {
    Calendar,
    Clock,
    Plus,
    Filter,
    Search,
    User,
    Phone,
    CheckCircle,
    XCircle,
    AlertCircle,
    Video,
    MapPin,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface AppointmentManagementProps {
    userRole: UserRole;
}

interface Appointment {
    id: number;
    patientName: string;
    patientPhone: string;
    doctor: string;
    date: string;
    time: string;
    type: 'in-person' | 'video';
    status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
    reason: string;
}

const mockAppointments: Appointment[] = [
    {
        id: 1,
        patientName: 'John Smith',
        patientPhone: '+91 98765 43210',
        doctor: 'Dr. Sarah Johnson',
        date: '2024-02-20',
        time: '09:30 AM',
        type: 'in-person',
        status: 'scheduled',
        reason: 'Regular checkup'
    },
    {
        id: 2,
        patientName: 'Emily Davis',
        patientPhone: '+91 98765 43211',
        doctor: 'Dr. Michael Chen',
        date: '2024-02-20',
        time: '10:00 AM',
        type: 'video',
        status: 'scheduled',
        reason: 'Follow-up consultation'
    },
    {
        id: 3,
        patientName: 'Robert Brown',
        patientPhone: '+91 98765 43212',
        doctor: 'Dr. Sarah Johnson',
        date: '2024-02-19',
        time: '11:30 AM',
        type: 'in-person',
        status: 'completed',
        reason: 'Blood pressure check'
    },
    {
        id: 4,
        patientName: 'Lisa Anderson',
        patientPhone: '+91 98765 43213',
        doctor: 'Dr. Michael Chen',
        date: '2024-02-19',
        time: '02:00 PM',
        type: 'video',
        status: 'cancelled',
        reason: 'Diabetes consultation'
    },
];

export function AppointmentManagement({ userRole }: AppointmentManagementProps) {
    const [view, setView] = useState<'list' | 'calendar'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showBookModal, setShowBookModal] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    const filteredAppointments = mockAppointments.filter(apt => {
        const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.patientPhone.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const canBook = userRole === 'doctor' || userRole === 'admin' || userRole === 'receptionist';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
                    <p className="text-gray-600">Schedule and manage patient appointments</p>
                </div>
                {canBook && (
                    <button
                        onClick={() => setShowBookModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Book Appointment
                    </button>
                )}
            </div>

            {/* View Toggle and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                            }`}
                    >
                        List View
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={`px-4 py-2 rounded-lg transition-colors ${view === 'calendar' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                            }`}
                    >
                        Calendar View
                    </button>
                </div>

                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by patient name or phone..."
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
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                </select>
            </div>

            {/* List View */}
            {view === 'list' && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredAppointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{apt.patientName}</p>
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Phone className="w-3 h-3" />
                                                        {apt.patientPhone}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{apt.doctor}</td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-900">
                                                    <Calendar className="w-4 h-4" />
                                                    {apt.date}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    {apt.time}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${apt.type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {apt.type === 'video' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                                {apt.type === 'video' ? 'Video' : 'In-Person'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{apt.reason}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-orange-100 text-orange-700'
                                                }`}>
                                                {apt.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                                {apt.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                                {apt.status === 'no-show' && <AlertCircle className="w-3 h-3" />}
                                                {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {apt.status === 'scheduled' && (
                                                    <>
                                                        <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                                            Start
                                                        </button>
                                                        <button className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Calendar View */}
            {view === 'calendar' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCurrentDate(new Date())}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="text-center text-gray-500 py-12">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p>Calendar view coming soon</p>
                    </div>
                </div>
            )}

            {/* AI Smart Slot Suggestion */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-600 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">AI Smart Slot Suggestions</h3>
                        <p className="text-sm text-gray-700 mb-3">
                            Based on historical data and current schedule, here are optimal time slots:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700 border border-purple-200">
                                10:00 AM - Low wait time
                            </span>
                            <span className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700 border border-purple-200">
                                2:30 PM - Available
                            </span>
                            <span className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700 border border-purple-200">
                                4:00 PM - Recommended
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Book Appointment Modal */}
            {showBookModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Book New Appointment</h2>
                            <button
                                onClick={() => setShowBookModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Dr. Sarah Johnson</option>
                                            <option>Dr. Michael Chen</option>
                                            <option>Dr. Emily Brown</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>In-Person</option>
                                            <option>Video Consultation</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                        <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                                        <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Book Appointment
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowBookModal(false)}
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
