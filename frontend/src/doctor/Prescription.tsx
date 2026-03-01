import { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Calendar, User, FileText, Pill } from 'lucide-react';
import { doctorService } from '../services/doctorService';
import { toast } from 'react-hot-toast';

interface PrescriptionProps {
    appointment: any;
    onBack: () => void;
}

export function Prescription({ appointment, onBack }: PrescriptionProps) {
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
    const [loading, setLoading] = useState(false);

    const addMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }]);
    };

    const removeMedicine = (index: number) => {
        setMedicines(medicines.filter((_, i) => i !== index));
    };

    const updateMedicine = (index: number, field: string, value: string) => {
        const newMedicines = [...medicines];
        newMedicines[index] = { ...newMedicines[index], [field]: value };
        setMedicines(newMedicines);
    };

    const handleSave = async () => {
        if (!diagnosis) {
            toast.error('Diagnosis is required');
            return;
        }

        setLoading(true);
        try {
            const prescriptionData = {
                appointment_id: appointment.appointment_id,
                patient_id: appointment.patient_id,
                doctor_id: appointment.doctor_id,
                diagnosis,
                notes,
                medicines: medicines.filter(m => m.name),
            };

            await doctorService.createDoctorPrescription(prescriptionData);

            // Update appointment status to completed
            await doctorService.updateAppointmentStatus(appointment.appointment_id, 'completed');

            toast.success('Prescription saved successfully');
            onBack();
        } catch (error) {
            console.error('Error saving prescription:', error);
            toast.error('Failed to save prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Write Prescription</h2>
                        <p className="text-gray-400">Appointment ID: {appointment.appointment_id}</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-all"
                >
                    {loading ? 'Saving...' : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Prescription
                        </>
                    )}
                </button>
            </div>

            {/* Patient Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Patient Details</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{appointment.patient?.full_name || 'N/A'}</p>
                    <div className="flex gap-4 mt-1 text-sm text-gray-400">
                        <span>{appointment.patient?.age || 'N/A'} years</span>
                        <span>{appointment.patient?.gender || 'N/A'}</span>
                    </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Appointment</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{new Date(appointment.appointment_date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-400">{appointment.appointment_time}</p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Type</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{appointment.mode === 'video' ? 'Online' : 'In-Clinic'}</p>
                    <p className="text-sm text-gray-400">{appointment.status}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Diagnosis & Notes */}
                <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        Clinical Findings
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Diagnosis *</label>
                            <textarea
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder="Enter diagnosis..."
                                rows={3}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Clinical Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Additional observations or advice..."
                                rows={3}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Medicines */}
                <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Pill className="w-5 h-5 text-blue-400" />
                            Prescribed Medicines
                        </h3>
                        <button
                            onClick={addMedicine}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-all text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Medicine
                        </button>
                    </div>

                    <div className="space-y-4">
                        {medicines.map((medicine, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-900/30 border border-gray-700/50 rounded-xl relative group">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Medicine Name</label>
                                    <input
                                        type="text"
                                        value={medicine.name}
                                        onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Dosage</label>
                                    <input
                                        type="text"
                                        value={medicine.dosage}
                                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                                        placeholder="e.g. 500mg"
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Frequency</label>
                                    <input
                                        type="text"
                                        value={medicine.frequency}
                                        onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                                        placeholder="e.g. 1-0-1"
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                                        <input
                                            type="text"
                                            value={medicine.duration}
                                            onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                                            placeholder="e.g. 5 days"
                                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                    </div>
                                    {medicines.length > 1 && (
                                        <button
                                            onClick={() => removeMedicine(index)}
                                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
