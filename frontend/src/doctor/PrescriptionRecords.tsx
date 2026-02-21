import { useState } from 'react';
import { UserRole } from '../common/types';
import {
    FileText,
    Search,
    Plus,
    Eye,
    Download,
    Upload,
    Calendar,
    User,
    Pill,
    AlertCircle,
    X,
    Brain
} from 'lucide-react';

interface PrescriptionRecordsProps {
    userRole: UserRole;
}

interface Prescription {
    id: number;
    patientName: string;
    patientId: string;
    doctor: string;
    date: string;
    medications: { name: string; dosage: string; duration: string }[];
    diagnosis: string;
    notes: string;
}

const mockPrescriptions: Prescription[] = [
    {
        id: 1,
        patientName: 'John Smith',
        patientId: 'P001',
        doctor: 'Dr. Sarah Johnson',
        date: '2024-02-15',
        medications: [
            { name: 'Metformin', dosage: '500mg', duration: '30 days' },
            { name: 'Lisinopril', dosage: '10mg', duration: '30 days' }
        ],
        diagnosis: 'Type 2 Diabetes, Hypertension',
        notes: 'Take with food. Monitor blood pressure daily.'
    },
    {
        id: 2,
        patientName: 'Emily Davis',
        patientId: 'P002',
        doctor: 'Dr. Michael Chen',
        date: '2024-02-14',
        medications: [
            { name: 'Albuterol', dosage: '90mcg', duration: '90 days' },
            { name: 'Fluticasone', dosage: '250mcg', duration: '90 days' }
        ],
        diagnosis: 'Asthma',
        notes: 'Use inhaler as needed. Avoid triggers.'
    },
];

export function PrescriptionRecords({ userRole }: PrescriptionRecordsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const filteredPrescriptions = mockPrescriptions.filter(rx =>
        rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rx.patientId.includes(searchTerm)
    );

    const canUpload = userRole === 'doctor' || userRole === 'admin';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Prescription Records</h1>
                    <p className="text-gray-600">View and manage patient prescriptions</p>
                </div>
                {canUpload && (
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        New Prescription
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by patient name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-600 rounded-lg">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">AI Prescription Insights</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-0.5">•</span>
                                <span><strong>Drug Interaction Alert:</strong> No interactions detected in recent prescriptions.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-0.5">•</span>
                                <span><strong>Compliance Prediction:</strong> 85% of patients showing good medication adherence.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-0.5">•</span>
                                <span><strong>Refill Reminder:</strong> 3 prescriptions due for refill this week.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Prescription List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPrescriptions.map((rx) => (
                    <div key={rx.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{rx.patientName}</h3>
                                    <p className="text-sm text-gray-600">ID: {rx.patientId}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedPrescription(rx)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="View Details"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Download"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>Prescribed by: {rx.doctor}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{rx.date}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-2">Medications:</p>
                                <div className="space-y-2">
                                    {rx.medications.map((med, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm">
                                            <Pill className="w-4 h-4 text-purple-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-900">{med.name}</p>
                                                <p className="text-gray-600">{med.dosage} - {med.duration}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                                <p className="text-sm text-gray-600 mt-1">{rx.diagnosis}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Prescription Details Modal */}
            {selectedPrescription && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Prescription Details</h2>
                            <button
                                onClick={() => setSelectedPrescription(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Patient Name</label>
                                    <p className="text-gray-900 mt-1">{selectedPrescription.patientName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Patient ID</label>
                                    <p className="text-gray-900 mt-1">{selectedPrescription.patientId}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Prescribed By</label>
                                    <p className="text-gray-900 mt-1">{selectedPrescription.doctor}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Date</label>
                                    <p className="text-gray-900 mt-1">{selectedPrescription.date}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Diagnosis</label>
                                <p className="text-gray-900 mt-1">{selectedPrescription.diagnosis}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 mb-3 block">Medications</label>
                                <div className="space-y-3">
                                    {selectedPrescription.medications.map((med, idx) => (
                                        <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                            <div className="flex items-start gap-3">
                                                <Pill className="w-5 h-5 text-purple-600 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{med.name}</p>
                                                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                                        <div>
                                                            <span className="text-gray-600">Dosage:</span>
                                                            <span className="ml-2 text-gray-900">{med.dosage}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">Duration:</span>
                                                            <span className="ml-2 text-gray-900">{med.duration}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Notes</label>
                                <p className="text-gray-900 mt-1">{selectedPrescription.notes}</p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <Download className="w-4 h-4 inline mr-2" />
                                    Download PDF
                                </button>
                                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Create New Prescription</h2>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                                    <textarea rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Medications</label>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-3 gap-2">
                                            <input type="text" placeholder="Medicine name" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                            <input type="text" placeholder="Dosage" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                            <input type="text" placeholder="Duration" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                        </div>
                                        <button type="button" className="text-sm text-blue-600 hover:text-blue-700">+ Add another medication</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Create Prescription
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowUploadModal(false)}
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
