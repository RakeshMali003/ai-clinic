import { useState, useEffect } from 'react';
import {
    Bell,
    Plus,
    Trash2,
    Clock,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/ui/card';
import { Button } from '../common/ui/button';
import { Badge } from '../common/ui/badge';
import { Input } from '../common/ui/input';
import { medicineService } from '../services/medicineService';
import type { PatientUser } from './PatientPortal';

export function MedicineReminders({ patient: _patient }: { patient: PatientUser }) {
    const [reminders, setReminders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        medicine_name: '',
        dosage: '',
        reminder_time: '08:00'
    });

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            setLoading(true);
            const data = await medicineService.getReminders();
            setReminders(data);
        } catch (error) {
            console.error('Error fetching reminders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddReminder = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await medicineService.addReminder(formData);
            setFormData({ medicine_name: '', dosage: '', reminder_time: '08:00' });
            setShowAddForm(false);
            fetchReminders();
        } catch (error) {
            console.error('Error adding reminder:', error);
        }
    };

    const handleDeleteReminder = async (id: number) => {
        try {
            await medicineService.deleteReminder(id);
            fetchReminders();
        } catch (error) {
            console.error('Error deleting reminder:', error);
        }
    };

    if (loading) {
        return <div className="p-6 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div></div>;
    }

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Medicine Reminders</h1>
                    <p className="text-sm text-gray-600">Stay on track with your medication schedule</p>
                </div>
                <Button
                    className="bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                    onClick={() => setShowAddForm(true)}
                >
                    <Plus className="size-4 mr-2" />
                    Set New Reminder
                </Button>
            </div>

            {showAddForm && (
                <Card className="border-pink-200 bg-pink-50/20 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg">Add Medication Reminder</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddReminder} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase">Medicine Name</label>
                                <Input
                                    required
                                    placeholder="e.g. Paracetamol"
                                    value={formData.medicine_name}
                                    onChange={(e) => setFormData({ ...formData, medicine_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase">Dosage</label>
                                <Input
                                    required
                                    placeholder="e.g. 1 Tablet"
                                    value={formData.dosage}
                                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase">Reminder Time</label>
                                <Input
                                    required
                                    type="time"
                                    value={formData.reminder_time}
                                    onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-3 flex justify-end gap-3 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                                <Button type="submit" className="bg-pink-600 text-white hover:bg-pink-700">Save Reminder</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {reminders.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 border-pink-100">
                    <CardContent className="space-y-4">
                        <Bell className="size-16 text-pink-200 mx-auto" />
                        <h2 className="text-xl font-medium text-gray-900">No active reminders</h2>
                        <p className="text-gray-500">Add a reminder so you never miss a dose.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reminders.map((reminder) => (
                        <Card key={reminder.id} className="border-pink-50 hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 size-12 bg-pink-100 rounded-full flex items-center justify-center">
                                            <Clock className="size-6 text-pink-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{reminder.medicine_name}</h4>
                                            <p className="text-sm text-gray-600">{reminder.dosage}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline" className="text-pink-600 border-pink-200 bg-pink-50">
                                                    {new Date(reminder.reminder_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Badge>
                                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Every Day</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-300 hover:text-red-500"
                                        onClick={() => handleDeleteReminder(reminder.id)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
                <AlertCircle className="size-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Tip:</strong> Setting reminders helps Maintain steady levels of medication in your system.
                    Always consult your doctor before changing your dosage or schedule.
                </p>
            </div>
        </div>
    );
}
