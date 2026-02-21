import { useState } from 'react';
import { UserRole } from '../common/types';
import { Search, FileText, Download, Eye, Upload, Sparkles } from 'lucide-react';

interface PrescriptionRecordsProps {
  userRole: UserRole;
}

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  labTests?: string[];
  followUpDate?: string;
  notes?: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const mockPrescriptions: Prescription[] = [
  {
    id: 'RX-001',
    patientName: 'John Smith',
    patientId: 'P001',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-12',
    diagnosis: 'Upper Respiratory Tract Infection',
    medications: [
      { name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', duration: '5 days' },
      { name: 'Paracetamol', dosage: '650mg', frequency: 'Thrice daily', duration: '3 days' },
      { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily at night', duration: '5 days' }
    ],
    labTests: ['Complete Blood Count', 'C-Reactive Protein'],
    followUpDate: '2025-01-17',
    notes: 'Rest advised. Avoid cold drinks. Monitor temperature.'
  },
  {
    id: 'RX-002',
    patientName: 'Emily Davis',
    patientId: 'P002',
    doctorName: 'Dr. Michael Chen',
    date: '2025-01-12',
    diagnosis: 'Hypertension',
    medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
      { name: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily', duration: '30 days' }
    ],
    labTests: ['Lipid Profile', 'ECG'],
    followUpDate: '2025-02-12',
    notes: 'Low salt diet recommended. Regular BP monitoring required.'
  },
  {
    id: 'RX-003',
    patientName: 'Robert Brown',
    patientId: 'P003',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-11',
    diagnosis: 'Type 2 Diabetes Mellitus',
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily after meals', duration: '30 days' },
      { name: 'Glimepiride', dosage: '2mg', frequency: 'Once daily before breakfast', duration: '30 days' }
    ],
    labTests: ['HbA1c', 'Fasting Blood Sugar', 'Kidney Function Test'],
    followUpDate: '2025-02-11',
    notes: 'Diet control essential. Regular exercise recommended. Monitor blood sugar levels.'
  },
];

export function PrescriptionRecords({ userRole }: PrescriptionRecordsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredPrescriptions = mockPrescriptions.filter(prescription =>
    prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescription & Medical Records</h1>
          <p className="text-gray-600">View and manage patient prescriptions</p>
        </div>
        {(userRole === 'admin' || userRole === 'doctor') && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload External Prescription
          </button>
        )}
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">AI Medical Insights</h3>
            <p className="text-sm text-gray-700">
              <strong>Drug Interaction Alert:</strong> No interactions detected in recent prescriptions.
              <strong className="ml-3">AI Summary:</strong> Patient RX-001 shows improvement in URTI symptoms.
              Common medications: Paracetamol (45%), Amoxicillin (32%).
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by prescription ID, patient name, or diagnosis..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg text-gray-900">{prescription.id}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(prescription.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">
                      <strong>Patient:</strong> {prescription.patientName} ({prescription.patientId})
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Doctor:</strong> {prescription.doctorName}
                    </p>
                    <p className="text-gray-900 font-medium">
                      <strong>Diagnosis:</strong> {prescription.diagnosis}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPrescription(prescription)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Medications ({prescription.medications.length})</p>
                    <ul className="space-y-1">
                      {prescription.medications.slice(0, 2).map((med, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {med.name} - {med.dosage}
                        </li>
                      ))}
                      {prescription.medications.length > 2 && (
                        <li className="text-sm text-blue-600">+ {prescription.medications.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                  {prescription.labTests && prescription.labTests.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Lab Tests ({prescription.labTests.length})</p>
                      <ul className="space-y-1">
                        {prescription.labTests.slice(0, 2).map((test, index) => (
                          <li key={index} className="text-sm text-gray-600">• {test}</li>
                        ))}
                        {prescription.labTests.length > 2 && (
                          <li className="text-sm text-blue-600">+ {prescription.labTests.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                {prescription.followUpDate && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>Follow-up:</strong> {new Date(prescription.followUpDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Details Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Prescription Details</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedPrescription(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="text-center border-b border-gray-200 pb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Elinic Healthcare</h3>
                <p className="text-sm text-gray-600">123 Medical Street, Mumbai | Ph: +91 22 1234 5678</p>
                <p className="text-sm text-gray-600">Reg. No: MH/MED/12345</p>
              </div>

              {/* Prescription Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Patient Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedPrescription.patientName}</p>
                    <p><strong>Patient ID:</strong> {selectedPrescription.patientId}</p>
                    <p><strong>Date:</strong> {new Date(selectedPrescription.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Doctor Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedPrescription.doctorName}</p>
                    <p><strong>Prescription ID:</strong> {selectedPrescription.id}</p>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Diagnosis</h4>
                <p className="text-gray-900">{selectedPrescription.diagnosis}</p>
              </div>

              {/* Medications */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Rx (Medications Prescribed)</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosage</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedPrescription.medications.map((med, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{med.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{med.dosage}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{med.frequency}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lab Tests */}
              {selectedPrescription.labTests && selectedPrescription.labTests.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Lab Tests Advised</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {selectedPrescription.labTests.map((test, index) => (
                        <li key={index} className="text-sm text-gray-900">
                          {index + 1}. {test}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedPrescription.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Additional Notes</h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-gray-900">{selectedPrescription.notes}</p>
                  </div>
                </div>
              )}

              {/* Follow-up */}
              {selectedPrescription.followUpDate && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-900">
                    Follow-up Appointment: {new Date(selectedPrescription.followUpDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {/* Signature */}
              <div className="border-t border-gray-200 pt-6 text-right">
                <div className="inline-block">
                  <div className="mb-12"></div>
                  <div className="border-t border-gray-400 pt-2">
                    <p className="font-semibold text-gray-900">{selectedPrescription.doctorName}</p>
                    <p className="text-sm text-gray-600">Medical Practitioner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload External Prescription Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Upload External Prescription</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <form className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload File *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
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
