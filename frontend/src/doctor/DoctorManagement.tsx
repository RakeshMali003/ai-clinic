import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, User, Plus, Search,
  CheckCircle, XCircle, Eye, FileText,
  TrendingUp, UserPlus
} from 'lucide-react';
import { doctorService } from '../services/doctorService';

interface DoctorManagementProps {
  filterType?: 'all' | 'online';
}

export function DoctorManagement({ filterType = 'all' }: DoctorManagementProps) {
  // State for data
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalPatients: 0, pendingAppointments: 0, completedAppointments: 0 });

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [aptFilter, setAptFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);

  // Form state for new appointment/patient
  const [formData, setFormData] = useState({
    full_name: '', age: '', gender: 'Male', phone: '', email: '',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '10:00',
    type: 'Consultation', reason: ''
  });

  useEffect(() => {
    fetchData();
  }, [filterType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aptData, statData] = await Promise.all([
        doctorService.getDoctorAppointments(aptFilter === 'all' ? undefined : aptFilter),
        doctorService.getDoctorStats()
      ]);

      // Filter by online if needed
      let filteredApts = aptData;
      if (filterType === 'online') {
        filteredApts = aptData.filter((a: any) => a.type?.toLowerCase() === 'video' || a.type?.toLowerCase() === 'consultation'); // Consultation might be online too, but usually video is the key
      }

      setAppointments(filteredApts);
      setStats(statData);
    } catch (error) {
      console.error('Error loading doctor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAptStatusUpdate = async (id: string, status: string) => {
    try {
      await doctorService.updateAppointmentStatus(id, status);
      fetchData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doctorService.createDoctorAppointment(formData);
      setShowBookModal(false);
      setFormData({
        full_name: '', age: '', gender: 'Male', phone: '', email: '',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '10:00',
        type: 'Consultation', reason: ''
      });
      fetchData();
    } catch (error) {
      alert('Failed to book appointment');
    }
  };

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState<any>(null);
  const [prescriptionData, setPrescriptionData] = useState<{
    diagnosis: string, notes: string, medicines: { name: string, dosage: string, frequency: string, duration: string }[], lab_tests: any[], follow_up_date: string
  }>({
    diagnosis: '', notes: '', medicines: [], lab_tests: [], follow_up_date: ''
  });

  const handleGeneratePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doctorService.createDoctorPrescription({
        ...prescriptionData,
        appointment_id: activeAppointment.appointment_id,
        patient_id: activeAppointment.patient_id
      });
      setShowPrescriptionModal(false);
      setPrescriptionData({ diagnosis: '', notes: '', medicines: [], lab_tests: [], follow_up_date: '' });
      fetchData();
    } catch (error) {
      alert('Failed to generate prescription');
    }
  };

  const addMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [...prescriptionData.medicines, { name: '', dosage: '', frequency: '1-0-1', duration: '5 Days' }]
    });
  };

  const updateMedicine = (index: number, field: string, value: string) => {
    const newMedicines = [...prescriptionData.medicines];
    newMedicines[index] = { ...newMedicines[index], [field]: value };
    setPrescriptionData({ ...prescriptionData, medicines: newMedicines });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {filterType === 'online' ? 'Online Appointments' : 'All Appointments'}
          </h1>
          <p className="text-gray-500">
            {filterType === 'online'
              ? 'Manage your virtual consultation sessions'
              : 'Manage your complete clinical schedule'}
          </p>
        </div>
        <button
          onClick={() => setShowBookModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add Patient / Appointment</span>
        </button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<User className="w-6 h-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Pending Appointments"
          value={stats.pendingAppointments}
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          color="orange"
        />
        <StatCard
          title="Completed Today"
          value={stats.completedAppointments}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          color="green"
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Filters Row */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={aptFilter}
              onChange={(e) => setAptFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={fetchData}
              className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300 bg-white"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <AppointmentTable
                data={appointments.filter(a =>
                  a.patient?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
                )}
                onStatusUpdate={handleAptStatusUpdate}
                onStartPrescription={(apt: any) => {
                  setActiveAppointment(apt);
                  setShowPrescriptionModal(true);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-blue-600" />
                Add Patient / Book Appointment
              </h2>
              <button onClick={() => setShowBookModal(false)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleCreateAppointment} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">Patient Name</label>
                  <input required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter patient name" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Age</label>
                  <input value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} type="number" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Phone</label>
                  <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} type="tel" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Email</label>
                  <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} type="email" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Date</label>
                  <input required value={formData.appointment_date} onChange={e => setFormData({ ...formData, appointment_date: e.target.value })} type="date" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Time</label>
                  <input required value={formData.appointment_time} onChange={e => setFormData({ ...formData, appointment_time: e.target.value })} type="time" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">
                  Book Appointment
                </button>
                <button type="button" onClick={() => setShowBookModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && activeAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-blue-600 text-white">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Generate Prescription
                </h2>
                <p className="text-blue-100 text-xs mt-1">Patient: {activeAppointment.patient?.full_name}</p>
              </div>
              <button onClick={() => setShowPrescriptionModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleGeneratePrescription} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Diagnosis / Reason</label>
                  <textarea
                    required
                    value={prescriptionData.diagnosis}
                    onChange={e => setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Enter clinical diagnosis..."
                  ></textarea>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-600 uppercase">Medications</label>
                    <button type="button" onClick={addMedicine} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
                      <Plus className="w-3 h-3" /> Add Medicine
                    </button>
                  </div>
                  <div className="space-y-3">
                    {prescriptionData.medicines.map((m, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <input required value={m.name} onChange={e => updateMedicine(i, 'name', e.target.value)} placeholder="Name" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        <input value={m.dosage} onChange={e => updateMedicine(i, 'dosage', e.target.value)} placeholder="Dosage (e.g. 500mg)" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        <input value={m.frequency} onChange={e => updateMedicine(i, 'frequency', e.target.value)} placeholder="Freq (1-0-1)" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        <input value={m.duration} onChange={e => updateMedicine(i, 'duration', e.target.value)} placeholder="Dur (5 days)" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Follow-up Date</label>
                    <input type="date" value={prescriptionData.follow_up_date} onChange={e => setPrescriptionData({ ...prescriptionData, follow_up_date: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Special Notes</label>
                    <textarea value={prescriptionData.notes} onChange={e => setPrescriptionData({ ...prescriptionData, notes: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" rows={1}></textarea>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button type="submit" className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-md">
                  Generate Rx & Complete Appointment
                </button>
                <button type="button" onClick={() => setShowPrescriptionModal(false)} className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-200',
    orange: 'from-orange-500/10 to-orange-500/5 border-orange-200',
    green: 'from-green-500/10 to-green-500/5 border-green-200'
  };
  return (
    <div className={`p-6 rounded-2xl border bg-gradient-to-br ${colors[color]} flex items-center gap-4 shadow-sm`}>
      <div className={`p-4 rounded-xl bg-white shadow-sm border border-${color}-100`}>{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function AppointmentTable({ data, onStatusUpdate, onStartPrescription }: any) {
  if (data.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <Calendar className="w-12 h-12 mb-4 opacity-20" />
      <p className="font-medium">No appointments found for the selected criteria</p>
    </div>
  );
  return (
    <table className="w-full text-left">
      <thead className="bg-gray-50/50">
        <tr>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Patient Details</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Schedule</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data.map((apt: any) => (
          <tr key={apt.appointment_id} className="hover:bg-blue-50/30 transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                  {apt.patient?.full_name[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{apt.patient?.full_name}</p>
                  <p className="text-xs text-gray-500">{apt.patient?.phone}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <p className="text-sm font-semibold text-gray-900">{new Date(apt.appointment_date).toLocaleDateString()}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {apt.appointment_time}
              </p>
            </td>
            <td className="px-6 py-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                {apt.type}
              </span>
            </td>
            <td className="px-6 py-4">
              <StatusBadge status={apt.status} />
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                {apt.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => onStatusUpdate(apt.appointment_id, 'in_progress')}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Start Appointment
                    </button>
                    <button
                      onClick={() => onStatusUpdate(apt.appointment_id, 'cancelled')}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                      title="Cancel Appointment"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
                {apt.status === 'in_progress' && (
                  <button
                    onClick={() => onStartPrescription(apt)}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Write Prescription
                  </button>
                )}
                <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200" title="View Profile">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


function StatusBadge({ status }: { status: string }) {
  const config: any = {
    scheduled: { color: 'bg-blue-100 text-blue-700', label: 'Scheduled' },
    in_progress: { color: 'bg-orange-100 text-orange-700 border border-orange-200 animate-pulse', label: 'In Progress' },
    completed: { color: 'bg-green-100 text-green-700', label: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-700', label: 'Cancelled' }
  };
  const s = config[status] || { color: 'bg-gray-100 text-gray-700', label: status };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${s.color}`}>
      {s.label}
    </span>
  );
}
