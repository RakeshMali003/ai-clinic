import { useState } from 'react';
import { UserRole } from '../common/types';
import { Search, Plus, Star, Calendar, TrendingUp, Award, Clock } from 'lucide-react';

interface DoctorManagementProps {
  userRole: UserRole;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  email: string;
  phone: string;
  rating: number;
  totalConsultations: number;
  availableDays: string[];
  availableTime: string;
  status: 'active' | 'on-leave' | 'inactive';
}

const mockDoctors: Doctor[] = [
  {
    id: 'D001',
    name: 'Dr. Sarah Johnson',
    specialization: 'General Physician',
    qualification: 'MBBS, MD',
    experience: 12,
    email: 'sarah.johnson@clinic.com',
    phone: '+91 98765 11111',
    rating: 4.8,
    totalConsultations: 1247,
    availableDays: ['Mon', 'Tue', 'Wed', 'Fri'],
    availableTime: '9:00 AM - 5:00 PM',
    status: 'active'
  },
  {
    id: 'D002',
    name: 'Dr. Michael Chen',
    specialization: 'Cardiologist',
    qualification: 'MBBS, MD (Cardiology)',
    experience: 15,
    email: 'michael.chen@clinic.com',
    phone: '+91 98765 22222',
    rating: 4.9,
    totalConsultations: 1832,
    availableDays: ['Mon', 'Wed', 'Thu', 'Sat'],
    availableTime: '10:00 AM - 6:00 PM',
    status: 'active'
  },
  {
    id: 'D003',
    name: 'Dr. Priya Sharma',
    specialization: 'Pediatrician',
    qualification: 'MBBS, DCH',
    experience: 8,
    email: 'priya.sharma@clinic.com',
    phone: '+91 98765 33333',
    rating: 4.7,
    totalConsultations: 956,
    availableDays: ['Tue', 'Thu', 'Fri', 'Sat'],
    availableTime: '9:00 AM - 2:00 PM',
    status: 'active'
  },
  {
    id: 'D004',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Orthopedic',
    qualification: 'MBBS, MS (Ortho)',
    experience: 10,
    email: 'rajesh.kumar@clinic.com',
    phone: '+91 98765 44444',
    rating: 4.6,
    totalConsultations: 721,
    availableDays: ['Mon', 'Tue', 'Wed'],
    availableTime: '2:00 PM - 8:00 PM',
    status: 'on-leave'
  },
];

export function DoctorManagement({ userRole }: DoctorManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredDoctors = mockDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-gray-600">Manage doctors and their schedules</p>
        </div>
        {userRole === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Doctor
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, specialization, or doctor ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.status === 'active' ? 'bg-green-100 text-green-700' :
                    doctor.status === 'on-leave' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                  }`}>
                  {doctor.status === 'active' ? 'Active' : doctor.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                </span>
              </div>

              <h3 className="font-semibold text-lg text-gray-900 mb-1">{doctor.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{doctor.specialization}</p>
              <p className="text-xs text-gray-500 mb-4">{doctor.qualification}</p>

              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{doctor.totalConsultations} consults</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-600">{doctor.availableTime}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doctor.availableDays.map(day => (
                        <span key={day} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDoctor(doctor)}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Doctor Details</h2>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedDoctor.name}</h3>
                      <p className="text-gray-600">{selectedDoctor.specialization}</p>
                      <p className="text-sm text-gray-500">{selectedDoctor.qualification}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedDoctor.status === 'active' ? 'bg-green-100 text-green-700' :
                        selectedDoctor.status === 'on-leave' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                      }`}>
                      {selectedDoctor.status === 'active' ? 'Active' : selectedDoctor.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">{selectedDoctor.rating}</span>
                      <span className="text-sm text-gray-600">Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">{selectedDoctor.experience}</span>
                      <span className="text-sm text-gray-600">Years Exp.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Doctor ID</label>
                  <p className="text-gray-900 font-medium">{selectedDoctor.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <p className="text-gray-900 font-medium">{selectedDoctor.phone}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900 font-medium">{selectedDoctor.email}</p>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Schedule & Availability</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{selectedDoctor.availableTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <span
                        key={day}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${selectedDoctor.availableDays.includes(day)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                          }`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Performance Analytics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{selectedDoctor.totalConsultations}</p>
                    <p className="text-sm text-gray-600">Total Consultations</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Star className="w-5 h-5 text-green-600" />
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{selectedDoctor.rating}</p>
                    <p className="text-sm text-gray-600">Avg. Rating</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">92%</p>
                    <p className="text-sm text-gray-600">Patient Satisfaction</p>
                  </div>
                </div>
              </div>

              {userRole === 'admin' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Manage Schedule
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add New Doctor</h2>
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
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Dr. John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="General Physician" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="MBBS, MD" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years) *</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Time</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="9:00 AM - 5:00 PM" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Active</option>
                      <option>On Leave</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Doctor
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
