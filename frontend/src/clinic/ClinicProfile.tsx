import { useState } from 'react';
import { UserRole } from '../App';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CreditCard,
  Shield,
  Users,
  Stethoscope,
  Edit,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ClinicProfileProps {
  userRole: UserRole;
}

export function ClinicProfile({ userRole }: ClinicProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinic Profile & Legal Details</h1>
          <p className="text-gray-600">Manage clinic information and registration</p>
        </div>
        {userRole === 'admin' && (
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        )}
      </div>

      {/* Verification Status */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-600 rounded-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 mb-1">Clinic Verified</h3>
            <p className="text-sm text-green-800">
              Your clinic has been verified and approved. Registration ID: <strong>CLI-2024-MH-001234</strong>
            </p>
            <p className="text-xs text-green-700 mt-2">Verified on: January 5, 2025</p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Basic Information</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name *</label>
              <input 
                type="text" 
                defaultValue="Elinic Healthcare Center"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
              <input 
                type="text" 
                defaultValue="CLI-2024-MH-001234"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input 
                type="email" 
                defaultValue="contact@elinic.com"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input 
                type="tel" 
                defaultValue="+91 22 1234 5678"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea 
                defaultValue="123 Medical Street, Andheri West, Mumbai, Maharashtra - 400053"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" 
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Compliance */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Legal & Compliance Details</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
              <input 
                type="text" 
                defaultValue="27AABCU9603R1ZM"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
              <input 
                type="text" 
                defaultValue="AABCU9603R"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical License Number</label>
              <input 
                type="text" 
                defaultValue="MH/MED/12345/2024"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Establishment Year</label>
              <input 
                type="text" 
                defaultValue="2020"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services & Facilities */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Services & Facilities</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Services</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                'General Consultation',
                'Cardiology',
                'Pediatrics',
                'Orthopedics',
                'Laboratory',
                'Pharmacy',
                'Emergency Services',
                'Dental Care',
                'Physiotherapy'
              ].map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked disabled={!isEditing} className="rounded" />
                  <label className="text-sm text-gray-700">{service}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                'Parking',
                'Wheelchair Access',
                'WiFi',
                'Cafeteria',
                'Waiting Room',
                'Emergency Care'
              ].map((facility, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked disabled={!isEditing} className="rounded" />
                  <label className="text-sm text-gray-700">{facility}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Working Hours</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-32">
                  <span className="text-sm font-medium text-gray-900">{day}</span>
                </div>
                <input 
                  type="time" 
                  defaultValue={day === 'Sunday' ? '' : '09:00'}
                  disabled={!isEditing || day === 'Sunday'}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" 
                />
                <span className="text-gray-500">to</span>
                <input 
                  type="time" 
                  defaultValue={day === 'Sunday' ? '' : '18:00'}
                  disabled={!isEditing || day === 'Sunday'}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" 
                />
                {day === 'Sunday' && (
                  <span className="text-sm text-red-600">Closed</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Emergency Services:</strong> Available 24/7
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modes */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Accepted Payment Modes</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { name: 'Cash', icon: CreditCard, enabled: true },
              { name: 'Credit/Debit Card', icon: CreditCard, enabled: true },
              { name: 'UPI', icon: CreditCard, enabled: true },
              { name: 'Insurance', icon: Shield, enabled: true },
            ].map((mode, index) => (
              <div 
                key={index}
                className={`p-4 border-2 rounded-lg text-center ${
                  mode.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <mode.icon className={`w-6 h-6 mx-auto mb-2 ${mode.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                <p className="text-sm font-medium text-gray-900">{mode.name}</p>
                {mode.enabled && (
                  <p className="text-xs text-green-600 mt-1">Active</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">4</p>
          <p className="text-sm text-gray-600">Active Doctors</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">7</p>
          <p className="text-sm text-gray-600">Support Staff</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Stethoscope className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">9</p>
          <p className="text-sm text-gray-600">Specializations</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">2,500+</p>
          <p className="text-sm text-gray-600">Patients Served</p>
        </div>
      </div>
    </div>
  );
}
