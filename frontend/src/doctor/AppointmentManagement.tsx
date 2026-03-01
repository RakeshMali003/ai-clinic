import { useState, useEffect } from 'react';
import {
    Calendar, Clock, Search, Phone, Video, MapPin,
    Trash2, Play, Eye, Edit2
} from 'lucide-react';
import { doctorService } from '../services/doctorService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface AppointmentManagementProps {
    userRole: string;
    onStartAppointment: (appointment: any) => void;
}

export function AppointmentManagement({ onStartAppointment }: AppointmentManagementProps) {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [patientType, setPatientType] = useState('all');
    const [dateFilter, setDateFilter] = useState('today');
    const [customRange, setCustomRange] = useState({ from: '', to: '' });
    const [sortBy, setSortBy] = useState('time');

    useEffect(() => {
        fetchAppointments();
    }, [patientType, dateFilter, customRange]);

    const fetchAppointments = async () => {
        if (!user?.doctor_id) return;
        setLoading(true);
        try {
            const filters: any = {
                doctor_id: user.doctor_id,
                type: patientType,
                dateFilter: dateFilter
            };
            if (dateFilter === 'custom') {
                filters.from = customRange.from;
                filters.to = customRange.to;
            }
            const data = await doctorService.getDoctorAppointments(filters);
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: string, appointment: any) => {
        try {
            switch (action) {
                case 'start':
                    await doctorService.startAppointment(appointment.appointment_id);
                    onStartAppointment(appointment);
                    break;
                case 'called':
                    await doctorService.updateAppointmentStatus(appointment.appointment_id, 'in_progress');
                    toast.success('Patient called');
                    fetchAppointments();
                    break;
                case 'delete':
                    if (window.confirm('Are you sure you want to delete this appointment?')) {
                        await doctorService.deleteAppointment(appointment.appointment_id);
                        toast.success('Appointment deleted');
                        fetchAppointments();
                    }
                    break;
                case 'reschedule':
                    // In a real app, this would open a modal
                    toast('Reschedule feature coming soon in modal', { icon: '📅' });
                    break;
                case 'view':
                    toast('Viewing patient details');
                    break;
            }
        } catch (error) {
            toast.error(`Failed to ${action} appointment`);
        }
    };

    const sortedAppointments = [...appointments].sort((a, b) => {
        if (sortBy === 'time') return a.appointment_time.localeCompare(b.appointment_time);
        if (sortBy === 'date') return new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime();
        // Day sorting could be complex, simple Lexicographical for now or based on date
        return 0;
    }).filter(apt =>
        apt.patient?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.appointment_id.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Appointments</h1>
                    <p className="text-gray-400 mt-1">Manage your consultations and patient flow</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all backdrop-blur-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Selection/Filters Bar */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-2 backdrop-blur-md shadow-xl flex flex-wrap items-center gap-4">
                <div className="flex p-1 bg-gray-900/50 rounded-xl border border-gray-700/50">
                    {['all', 'in-clinic', 'online'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setPatientType(type)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${patientType === type
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                        </button>
                    ))}
                </div>

                <div className="h-8 w-px bg-gray-700/50 mx-2 hidden md:block" />

                <div className="flex flex-wrap items-center gap-2">
                    {['today', 'yesterday', 'tomorrow', 'custom'].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDateFilter(d)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${dateFilter === d
                                ? 'bg-blue-600/10 border-blue-500/50 text-blue-400'
                                : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {d}
                        </button>
                    ))}

                    {dateFilter === 'custom' && (
                        <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300">
                            <input
                                type="date"
                                value={customRange.from}
                                onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })}
                                className="bg-gray-900/50 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white"
                            />
                            <span className="text-gray-600">to</span>
                            <input
                                type="date"
                                value={customRange.to}
                                onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })}
                                className="bg-gray-900/50 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white"
                            />
                        </div>
                    )}
                </div>

                <div className="ml-auto flex items-center gap-4 pr-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="hidden sm:inline">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent border-none text-blue-400 font-medium focus:ring-0 cursor-pointer"
                        >
                            <option value="time">Time</option>
                            <option value="date">Date</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl backdrop-blur-md overflow-hidden shadow-2xl">
                <div className="overflow-x-auto text-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-gray-700/50">
                                <th className="px-6 py-4 font-semibold text-gray-400 uppercase tracking-wider text-xs">Patient info</th>
                                <th className="px-6 py-4 font-semibold text-gray-400 uppercase tracking-wider text-xs">Apt Details</th>
                                <th className="px-6 py-4 font-semibold text-gray-400 uppercase tracking-wider text-xs">Mode</th>
                                <th className="px-6 py-4 font-semibold text-gray-400 uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-400 uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/30">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">Scanning time-space for appointments...</p>
                                    </td>
                                </tr>
                            ) : sortedAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                                        <p className="text-gray-400 text-lg">No appointments found for this selection</p>
                                    </td>
                                </tr>
                            ) : sortedAppointments.map((apt) => (
                                <tr key={apt.appointment_id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20 shadow-inner">
                                                {apt.patient?.full_name?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">{apt.patient?.full_name || 'Anonymous'}</p>
                                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {apt.patient?.phone || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="font-medium">{new Date(apt.appointment_date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                <Clock className="w-3.5 h-3.5" />
                                                {apt.appointment_time}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${apt.mode === 'video'
                                            ? 'bg-purple-500/10 text-purple-400 ring-purple-500/30'
                                            : 'bg-blue-500/10 text-blue-400 ring-blue-500/30'
                                            }`}>
                                            {apt.mode === 'video' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                            {apt.mode === 'video' ? 'Online' : 'In-Clinic'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${apt.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                            apt.status === 'in_progress' ? 'bg-orange-500/10 text-orange-400 animate-pulse' :
                                                apt.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' :
                                                    'bg-red-500/10 text-red-400'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${apt.status === 'completed' ? 'bg-green-400' :
                                                apt.status === 'in_progress' ? 'bg-orange-400' :
                                                    apt.status === 'scheduled' ? 'bg-blue-400' :
                                                        'bg-red-400'
                                                }`} />
                                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1).replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {apt.status === 'scheduled' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction('start', apt)}
                                                        title="Start Appointment"
                                                        className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                                                    >
                                                        <Play className="w-4 h-4 fill-current" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('called', apt)}
                                                        title="Called Patient"
                                                        className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                                                    >
                                                        <Phone className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleAction('view', apt)}
                                                title="View Details"
                                                className="p-2 bg-gray-700/50 text-gray-300 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleAction('reschedule', apt)}
                                                title="Reschedule"
                                                className="p-2 bg-gray-700/50 text-gray-300 hover:bg-yellow-500 hover:text-white rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleAction('delete', apt)}
                                                title="Delete"
                                                className="p-2 bg-gray-700/50 text-gray-300 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
