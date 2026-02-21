import { useState } from 'react';
import { UserRole } from '../common/types';
import { Users, UserPlus, Clock, CheckCircle, XCircle, Camera, Calendar } from 'lucide-react';

interface StaffManagementProps {
  userRole: UserRole;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'on-leave' | 'inactive';
  todayAttendance?: {
    checkIn: string;
    checkOut?: string;
    status: 'present' | 'absent' | 'late';
  };
  performance: {
    tasksCompleted: number;
    rating: number;
  };
}

const mockStaff: StaffMember[] = [
  {
    id: 'S001',
    name: 'Emma Wilson',
    role: 'Receptionist',
    department: 'Front Desk',
    email: 'emma.wilson@clinic.com',
    phone: '+91 98765 55555',
    joinDate: '2023-06-15',
    status: 'active',
    todayAttendance: {
      checkIn: '09:00 AM',
      status: 'present'
    },
    performance: {
      tasksCompleted: 142,
      rating: 4.7
    }
  },
  {
    id: 'S002',
    name: 'John Doe',
    role: 'Nurse',
    department: 'General Ward',
    email: 'john.doe@clinic.com',
    phone: '+91 98765 66666',
    joinDate: '2023-03-20',
    status: 'active',
    todayAttendance: {
      checkIn: '09:05 AM',
      status: 'late'
    },
    performance: {
      tasksCompleted: 238,
      rating: 4.8
    }
  },
  {
    id: 'S003',
    name: 'Lisa Martinez',
    role: 'Lab Technician',
    department: 'Laboratory',
    email: 'lisa.martinez@clinic.com',
    phone: '+91 98765 77777',
    joinDate: '2023-08-10',
    status: 'active',
    todayAttendance: {
      checkIn: '08:55 AM',
      status: 'present'
    },
    performance: {
      tasksCompleted: 189,
      rating: 4.9
    }
  },
  {
    id: 'S004',
    name: 'Robert Brown',
    role: 'Pharmacist',
    department: 'Pharmacy',
    email: 'robert.brown@clinic.com',
    phone: '+91 98765 88888',
    joinDate: '2022-11-05',
    status: 'active',
    todayAttendance: {
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      status: 'present'
    },
    performance: {
      tasksCompleted: 367,
      rating: 4.6
    }
  },
  {
    id: 'S005',
    name: 'Maria Garcia',
    role: 'Nurse',
    department: 'Emergency',
    email: 'maria.garcia@clinic.com',
    phone: '+91 98765 99999',
    joinDate: '2023-01-12',
    status: 'on-leave',
    performance: {
      tasksCompleted: 156,
      rating: 4.5
    }
  },
];

export function StaffManagement({ userRole }: StaffManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const presentCount = mockStaff.filter(s => s.todayAttendance?.status === 'present' || s.todayAttendance?.status === 'late').length;
  const onLeaveCount = mockStaff.filter(s => s.status === 'on-leave').length;
  const lateCount = mockStaff.filter(s => s.todayAttendance?.status === 'late').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage staff, attendance, and performance</p>
        </div>
        {userRole === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Add Staff Member
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockStaff.length}</p>
          <p className="text-sm text-gray-600">Total Staff</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          <p className="text-sm text-gray-600">Present Today</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-50">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
          <p className="text-sm text-gray-600">Late Arrivals</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-orange-600">{onLeaveCount}</p>
          <p className="text-sm text-gray-600">On Leave</p>
        </div>
      </div>

      {/* Face Recognition Attendance */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-600 rounded-lg">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-purple-900 mb-1">AI Face Recognition Attendance</h3>
            <p className="text-sm text-purple-800 mb-3">
              Automated attendance tracking using facial recognition technology. Staff can check in/out instantly with face verification.
            </p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
              Enable Face Recognition
            </button>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Staff Directory</h3>
          <p className="text-sm text-gray-600">All registered staff members</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Today's Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{staff.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500">{staff.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{staff.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{staff.department}</td>
                  <td className="px-6 py-4">
                    {staff.todayAttendance ? (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${staff.todayAttendance.status === 'present' ? 'bg-green-100 text-green-700' :
                              staff.todayAttendance.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {staff.todayAttendance.status === 'present' && <CheckCircle className="w-3 h-3" />}
                            {staff.todayAttendance.status === 'late' && <Clock className="w-3 h-3" />}
                            {staff.todayAttendance.status.charAt(0).toUpperCase() + staff.todayAttendance.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">In: {staff.todayAttendance.checkIn}</p>
                        {staff.todayAttendance.checkOut && (
                          <p className="text-xs text-gray-600">Out: {staff.todayAttendance.checkOut}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">No attendance</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-sm font-medium text-yellow-600">{staff.performance.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                      <p className="text-xs text-gray-600">{staff.performance.tasksCompleted} tasks</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${staff.status === 'active' ? 'bg-green-100 text-green-700' :
                        staff.status === 'on-leave' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                      }`}>
                      {staff.status === 'active' ? 'Active' : staff.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedStaff(staff)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add Staff Member</h2>
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
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Receptionist</option>
                      <option>Nurse</option>
                      <option>Lab Technician</option>
                      <option>Pharmacist</option>
                      <option>Helper</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Front Desk</option>
                      <option>General Ward</option>
                      <option>Emergency</option>
                      <option>Laboratory</option>
                      <option>Pharmacy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Join Date *</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
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
                    Add Staff
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
