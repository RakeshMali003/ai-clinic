import { useEffect, useState } from 'react';
import { UserRole } from '../common/types';
import { clinicService } from '../services/clinicService';
import { Users, Clock, CheckCircle, Play, Loader2 } from 'lucide-react';

interface QueueManagementProps {
    userRole: UserRole;
}

export function QueueManagement({ userRole }: QueueManagementProps) {
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQueue = async () => {
        try {
            setLoading(true);
            const data = await clinicService.getQueue();
            setQueue(data);
        } catch (error) {
            console.error('Error fetching queue:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const success = await clinicService.updateAppointment(id, { status: newStatus });
            if (success) {
                setQueue(prev => prev.map(patient =>
                    patient.appointment_id === id ? { ...patient, status: newStatus } : patient
                ));
            } else {
                alert('Failed to update status synchronize across the medical network');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('A neural sync error occurred during status update');
        }
    };

    const waitingCount = queue.filter(p => p.status === 'scheduled').length;
    const inProgressCount = queue.filter(p => p.status === 'in-progress').length;
    const completedTodayCount = queue.filter(p => p.status === 'completed').length;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Syncing live queue pulse...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Patient Queue Management</h1>
                    <p className="text-gray-600">Real-time patient queue and token system</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Live Operation Mode</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-yellow-50">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{waitingCount}</p>
                    <p className="text-sm text-gray-600">Waiting</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-blue-50">
                            <Play className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
                    <p className="text-sm text-gray-600">In Progress</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-green-50">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{completedTodayCount}</p>
                    <p className="text-sm text-gray-600">Completed Today</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-purple-50">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{queue.length}</p>
                    <p className="text-sm text-gray-600">Total in Queue</p>
                </div>
            </div>

            {/* Current Queue - Display Board Style */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="font-semibold text-gray-900 text-center text-xl">Now Serving (In-Progress)</h3>
                </div>
                <div className="p-8">
                    {queue.filter(p => p.status === 'in-progress').length > 0 ? (
                        queue.filter(p => p.status === 'in-progress').map((apt, idx) => (
                            <div key={apt.appointment_id} className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-6 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-green-600 text-white rounded-xl p-6 min-w-[100px] text-center">
                                            <p className="text-sm font-medium mb-1">Spot</p>
                                            <p className="text-4xl font-bold">{idx + 1}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{apt.patient?.full_name}</h3>
                                            <p className="text-lg text-gray-600">ID: {apt.patient_id}</p>
                                            <p className="text-lg text-gray-600 mt-1">Doctor: {apt.doctor?.full_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-700">
                                        <Play className="w-6 h-6" />
                                        <span className="font-semibold text-lg uppercase">{apt.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-12">No patients currently in consultation</p>
                    )}
                </div>
            </div>

            {/* Queue List */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Scheduled Queue</h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                Waiting: {waitingCount}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-200">
                    {queue.filter(p => p.status === 'scheduled').length > 0 ? (
                        queue.filter(p => p.status === 'scheduled').map((apt, idx) => (
                            <div key={apt.appointment_id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-lg p-4 min-w-[80px] text-center bg-blue-100 border border-blue-300">
                                            <p className="text-xs font-medium text-gray-600 mb-1">Token</p>
                                            <p className="text-3xl font-bold text-blue-700">{idx + 1}</p>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-gray-900 text-lg">{apt.patient?.full_name}</h4>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>ID: {apt.patient_id}</span>
                                                <span>•</span>
                                                <span>{apt.doctor?.full_name}</span>
                                                <span>•</span>
                                                <span>{apt.type}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 text-sm">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600">Time: {new Date(apt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {(userRole === 'clinic' || userRole === 'receptionist') && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateStatus(apt.appointment_id, 'in-progress')}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Play className="w-4 h-4" />
                                                Start
                                            </button>
                                            <button
                                                onClick={() => updateStatus(apt.appointment_id, 'cancelled')}
                                                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-12">No patients waiting in queue</p>
                    )}
                </div>
            </div>

            {/* Completed Today section should be here, outside the Scheduled Queue div */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Completed Today</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {queue.filter(p => p.status === 'completed').length > 0 ? (
                            queue.filter(p => p.status === 'completed').map((apt, idx) => (
                                <div key={apt.appointment_id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-bold text-green-700">Spot {idx + 1}</span>
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <p className="font-medium text-gray-900">{apt.patient?.full_name}</p>
                                    <p className="text-sm text-gray-600">{apt.doctor?.full_name}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4 col-span-3">No completed appointments recently</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
