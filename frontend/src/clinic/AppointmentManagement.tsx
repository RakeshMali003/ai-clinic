import { useState } from 'react';
import { UserRole } from '../common/types';
import { Calendar, Clock, Plus, Filter, ChevronLeft, ChevronRight, User, Sparkles } from 'lucide-react';

interface AppointmentManagementProps {
  userRole: UserRole;
}

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'checkup';
  status: 'scheduled' | 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  tokenNumber?: number;
}

const mockAppointments: Appointment[] = [
  {
    id: 'A001',
    patientName: 'John Smith',
    patientId: 'P001',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-12',
    time: '09:30',
    type: 'consultation',
    status: 'scheduled',
    tokenNumber: 1
  },
  {
    id: 'A002',
    patientName: 'Emily Davis',
    patientId: 'P002',
    doctorName: 'Dr. Michael Chen',
    date: '2025-01-12',
    time: '10:00',
    type: 'follow-up',
    status: 'waiting',
    tokenNumber: 2
  },
  {
    id: 'A003',
    patientName: 'Robert Brown',
    patientId: 'P003',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-12',
    time: '10:30',
    type: 'checkup',
    status: 'in-progress',
    tokenNumber: 3
  },
  {
    id: 'A004',
    patientName: 'Lisa Anderson',
    patientId: 'P004',
    doctorName: 'Dr. Michael Chen',
    date: '2025-01-12',
    time: '11:00',
    type: 'consultation',
    status: 'scheduled',
    tokenNumber: 4
  },
  {
    id: 'A005',
    patientName: 'David Wilson',
    patientId: 'P005',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-12',
    time: '11:30',
    type: 'follow-up',
    status: 'scheduled',
    tokenNumber: 5
  },
  {
    id: 'A006',
    patientName: 'Sarah Miller',
    patientId: 'P006',
    doctorName: 'Dr. Michael Chen',
    date: '2025-01-12',
    time: '14:00',
    type: 'consultation',
    status: 'scheduled',
    tokenNumber: 6
  },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export function AppointmentManagement({ userRole }: AppointmentManagementProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const todaysAppointments = mockAppointments.filter(apt => apt.date === '2025-01-12');
  const filteredAppointments = filterStatus === 'all'
    ? todaysAppointments
    : todaysAppointments.filter(apt => apt.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600">Schedule and manage patient appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
            >
              List View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
            >
              Calendar View
            </button>
          </div>
          {(userRole === 'admin' || userRole === 'receptionist') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Book Appointment
            </button>
          )}
        </div>
      </div>

      {/* AI Smart Suggestions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">AI Smart Slot Suggestion</h3>
            <p className="text-sm text-gray-700">
              Based on current appointments, we suggest scheduling next patient at <strong>12:00 PM</strong> with Dr. Sarah Johnson.
              No-show risk detected for appointment #A004 - reminder sent automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2">
            {['all', 'scheduled', 'waiting', 'in-progress', 'completed'].map((status) => (
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

      {view === 'list' ? (
        /* List View */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Today's Appointments - January 12, 2026</span>
              </div>
              <span className="text-sm text-gray-600">{filteredAppointments.length} appointments</span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 rounded-lg p-3 text-center min-w-[60px]">
                      <p className="text-xs text-blue-600 font-medium">Token</p>
                      <p className="text-xl font-bold text-blue-700">{appointment.tokenNumber}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                        <span className="text-xs text-gray-500">({appointment.patientId})</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {appointment.doctorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.time}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${appointment.type === 'consultation' ? 'bg-purple-100 text-purple-700' :
                            appointment.type === 'follow-up' ? 'bg-green-100 text-green-700' :
                              'bg-blue-100 text-blue-700'
                          }`}>
                          {appointment.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          appointment.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                            appointment.status === 'scheduled' ? 'bg-purple-100 text-purple-700' :
                              'bg-red-100 text-red-700'
                      }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                    </span>

                    {(userRole === 'admin' || userRole === 'receptionist' || userRole === 'doctor') && (
                      <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Manage
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button className="text-sm text-blue-600 hover:underline">
              Go to Today
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {['Dr. Sarah Johnson', 'Dr. Michael Chen'].map(doctor => (
              <div key={doctor}>
                <h3 className="font-semibold text-gray-900 mb-3">{doctor}</h3>
                <div className="space-y-2">
                  {timeSlots.map(slot => {
                    const appointment = mockAppointments.find(
                      apt => apt.doctorName === doctor && apt.time === slot
                    );

                    return (
                      <div
                        key={slot}
                        className={`p-3 rounded-lg border transition-colors ${appointment
                            ? 'border-blue-300 bg-blue-50 cursor-pointer hover:bg-blue-100'
                            : 'border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{slot}</span>
                          {appointment ? (
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">{appointment.patientName}</p>
                              <p className="text-xs text-gray-600">Token #{appointment.tokenNumber}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">Available</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Book New Appointment</h2>
                <button
                  onClick={() => setShowAddModal(false)}
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
                      <option>Robert Brown (P003)</option>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Select Time</option>
                      {timeSlots.map(slot => (
                        <option key={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Consultation</option>
                      <option>Follow-up</option>
                      <option>Checkup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>In-Clinic</option>
                      <option>Online</option>
                    </select>
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
                    Book Appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
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
