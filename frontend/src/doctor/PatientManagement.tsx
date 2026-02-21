import { useEffect, useState } from 'react';
import { UserRole } from '../common/types';
import {
    Search,
    Filter,
    Plus,
    Eye,
    Edit,
    Calendar,
    Phone,
    Mail,
    MapPin,
    User,
    X,
    Loader2,
    AlertCircle,
    Trash2
} from 'lucide-react';
import { patientService, Patient as BackendPatient } from '../services/patientService';

interface PatientManagementProps {
    userRole: UserRole;
}

// Map BackendPatient to UI needs
interface Patient extends BackendPatient {
    id: string; // Add id to satisfy lint/logic
    name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    address: string;
    bloodGroup: string;
    lastVisit: string;
    condition: string;
    status: 'active' | 'inactive';
}

export function PatientManagement({ userRole }: PatientManagementProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const [newPatientData, setNewPatientData] = useState({
        patient_id: '',
        full_name: '',
        age: 0,
        gender: 'Male',
        phone: '',
        email: '',
        address: '',
        blood_group: 'O+'
    });

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await patientService.getPatients();
            const mappedPatients: Patient[] = data.map((p: BackendPatient) => ({
                ...p,
                id: p.patient_id,
                name: p.full_name,
                age: p.age || 0,
                gender: p.gender || 'Unknown',
                phone: p.phone || '',
                email: p.email || '',
                address: p.address || '',
                bloodGroup: p.blood_group || 'Unknown',
                lastVisit: 'N/A', // Update if backend provides visit history
                condition: p.medical_history || 'N/A',
                status: 'active'
            }));
            setPatients(mappedPatients);
        } catch (err) {
            console.error('Error fetching patients:', err);
            setError('Failed to load patient records.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleAddPatient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setFormLoading(true);
            // Generate a temporary ID if not provided, or ask user
            const pData = { ...newPatientData };
            if (!pData.patient_id) pData.patient_id = `P${Date.now()}`;

            await patientService.createPatient(pData);
            setShowAddModal(false);
            setNewPatientData({
                patient_id: '',
                full_name: '',
                age: 0,
                gender: 'Male',
                phone: '',
                email: '',
                address: '',
                blood_group: 'O+'
            });
            await fetchPatients();
        } catch (err) {
            console.error('Error adding patient:', err);
            alert('Failed to add patient record');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeletePatient = async (id: string | number) => {
        if (!window.confirm('Are you sure you want to remove this patient record?')) return;
        try {
            setLoading(true);
            await patientService.deletePatient(id.toString());
            await fetchPatients();
        } catch (err) {
            console.error('Error deleting patient:', err);
            alert('Failed to delete patient record');
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const canEdit = userRole === 'doctor' || userRole === 'admin' || userRole === 'receptionist';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
                    <p className="text-gray-600">Manage patient records and information</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Patient
                    </button>
                )}
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search patients by name, phone, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-5 h-5" />
                    Filter
                </button>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600">Retrieving patient records...</p>
                </div>
            )}

            {error && (
                <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {!loading && filteredPatients.length === 0 && (
                <div className="text-center p-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500 text-lg">No patient records found matching your search.</p>
                </div>
            )}

            {/* Patient List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{patient.name}</p>
                                                <p className="text-sm text-gray-600">{patient.age} yrs, {patient.gender}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4" />
                                                {patient.phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4" />
                                                {patient.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                                            {patient.bloodGroup}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{patient.lastVisit}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{patient.condition}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${patient.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setSelectedPatient(patient)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {canEdit && (
                                                <button
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            )}
                                            {canEdit && (
                                                <button
                                                    onClick={() => handleDeletePatient(patient.patient_id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove Record"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Patient Details Modal */}
            {selectedPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-10 h-10 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h3>
                                    <p className="text-gray-600">{selectedPatient.age} years • {selectedPatient.gender}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Phone className="w-4 h-4" />
                                        {selectedPatient.phone}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Mail className="w-4 h-4" />
                                        {selectedPatient.email}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Blood Group</label>
                                    <p className="text-gray-900">{selectedPatient.bloodGroup}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Last Visit</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Calendar className="w-4 h-4" />
                                        {selectedPatient.lastVisit}
                                    </div>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500">Address</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <MapPin className="w-4 h-4" />
                                        {selectedPatient.address}
                                    </div>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500">Current Condition</label>
                                    <p className="text-gray-900">{selectedPatient.condition}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    View Medical History
                                </button>
                                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Schedule Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Patient Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Add New Patient</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form className="space-y-4" onSubmit={handleAddPatient}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                            value={newPatientData.full_name}
                                            onChange={(e) => setNewPatientData({ ...newPatientData, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                            value={newPatientData.age}
                                            onChange={(e) => setNewPatientData({ ...newPatientData, age: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={newPatientData.gender}
                                            onChange={(e) => setNewPatientData({ ...newPatientData, gender: e.target.value })}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={newPatientData.blood_group}
                                            onChange={(e) => setNewPatientData({ ...newPatientData, blood_group: e.target.value })}
                                        >
                                            <option>A+</option>
                                            <option>A-</option>
                                            <option>B+</option>
                                            <option>B-</option>
                                            <option>AB+</option>
                                            <option>AB-</option>
                                            <option>O+</option>
                                            <option>O-</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                            value={newPatientData.phone}
                                            onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={newPatientData.email}
                                            onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={newPatientData.address}
                                            onChange={(e) => setNewPatientData({ ...newPatientData, address: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                                    >
                                        {formLoading ? 'Adding...' : 'Add Patient'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
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
