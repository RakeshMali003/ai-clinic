import { useState } from 'react';
import { UserRole } from '../App';
import { Activity, Heart, Droplet, Thermometer, TrendingUp, Wifi, AlertCircle, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface IoTIntegrationProps {
  userRole: UserRole;
}

interface Device {
  id: string;
  name: string;
  type: 'bp_monitor' | 'glucose_meter' | 'heart_rate' | 'thermometer';
  patient: string;
  patientId: string;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: string;
  battery: number;
  currentReading?: {
    value: string;
    timestamp: string;
    status: 'normal' | 'warning' | 'critical';
  };
}

const mockDevices: Device[] = [
  {
    id: 'BP001',
    name: 'Omron BP Monitor',
    type: 'bp_monitor',
    patient: 'John Smith',
    patientId: 'P001',
    status: 'connected',
    lastSync: '2 min ago',
    battery: 85,
    currentReading: {
      value: '120/80 mmHg',
      timestamp: '2025-01-12 10:30',
      status: 'normal'
    }
  },
  {
    id: 'GLU001',
    name: 'Accu-Chek Glucose Meter',
    type: 'glucose_meter',
    patient: 'Robert Brown',
    patientId: 'P003',
    status: 'connected',
    lastSync: '5 min ago',
    battery: 92,
    currentReading: {
      value: '145 mg/dL',
      timestamp: '2025-01-12 10:25',
      status: 'warning'
    }
  },
  {
    id: 'HR001',
    name: 'Fitbit Heart Rate Monitor',
    type: 'heart_rate',
    patient: 'Emily Davis',
    patientId: 'P002',
    status: 'connected',
    lastSync: '1 min ago',
    battery: 68,
    currentReading: {
      value: '72 bpm',
      timestamp: '2025-01-12 10:31',
      status: 'normal'
    }
  },
  {
    id: 'TMP001',
    name: 'Digital Thermometer',
    type: 'thermometer',
    patient: 'Lisa Anderson',
    patientId: 'P004',
    status: 'disconnected',
    lastSync: '2 hours ago',
    battery: 45,
    currentReading: {
      value: '98.6°F',
      timestamp: '2025-01-12 08:30',
      status: 'normal'
    }
  },
];

const bpTrendData = [
  { time: '8 AM', systolic: 118, diastolic: 78 },
  { time: '10 AM', systolic: 120, diastolic: 80 },
  { time: '12 PM', systolic: 122, diastolic: 82 },
  { time: '2 PM', systolic: 125, diastolic: 85 },
  { time: '4 PM', systolic: 121, diastolic: 81 },
  { time: '6 PM', systolic: 119, diastolic: 79 },
];

const glucoseTrendData = [
  { time: 'Mon', value: 120 },
  { time: 'Tue', value: 135 },
  { time: 'Wed', value: 145 },
  { time: 'Thu', value: 140 },
  { time: 'Fri', value: 138 },
  { time: 'Sat', value: 142 },
  { time: 'Sun', value: 145 },
];

export function IoTIntegration({ userRole }: IoTIntegrationProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'bp_monitor': return Activity;
      case 'glucose_meter': return Droplet;
      case 'heart_rate': return Heart;
      case 'thermometer': return Thermometer;
    }
  };

  const getDeviceColor = (type: Device['type']) => {
    switch (type) {
      case 'bp_monitor': return 'blue';
      case 'glucose_meter': return 'purple';
      case 'heart_rate': return 'red';
      case 'thermometer': return 'orange';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IoT & Wearable Integration</h1>
          <p className="text-gray-600">Monitor patient vitals in real-time</p>
        </div>
        {(userRole === 'admin' || userRole === 'doctor' || userRole === 'nurse') && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Device
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <Wifi className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockDevices.length}</p>
          <p className="text-sm text-gray-600">Connected Devices</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{mockDevices.filter(d => d.status === 'connected').length}</p>
          <p className="text-sm text-gray-600">Active Now</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600">1,247</p>
          <p className="text-sm text-gray-600">Readings Today</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-orange-600">2</p>
          <p className="text-sm text-gray-600">Alerts</p>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Connected Devices</h3>
          <p className="text-sm text-gray-600">Real-time monitoring devices</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockDevices.map((device) => {
              const Icon = getDeviceIcon(device.type);
              const color = getDeviceColor(device.type);
              
              return (
                <div 
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-lg bg-${color}-50`}>
                        <Icon className={`w-6 h-6 text-${color}-600`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{device.name}</h4>
                        <p className="text-sm text-gray-600">{device.patient} ({device.patientId})</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      device.status === 'connected' ? 'bg-green-100 text-green-700' :
                      device.status === 'syncing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      <Wifi className="w-3 h-3" />
                      {device.status}
                    </span>
                  </div>

                  {device.currentReading && (
                    <div className={`p-3 rounded-lg mb-3 ${
                      device.currentReading.status === 'normal' ? 'bg-green-50 border border-green-200' :
                      device.currentReading.status === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Latest Reading</p>
                          <p className={`text-2xl font-bold ${
                            device.currentReading.status === 'normal' ? 'text-green-700' :
                            device.currentReading.status === 'warning' ? 'text-yellow-700' :
                            'text-red-700'
                          }`}>
                            {device.currentReading.value}
                          </p>
                        </div>
                        {device.currentReading.status !== 'normal' && (
                          <AlertCircle className={`w-5 h-5 ${
                            device.currentReading.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{device.currentReading.timestamp}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Last sync: {device.lastSync}</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        device.battery > 70 ? 'bg-green-500' :
                        device.battery > 30 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <span>{device.battery}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Pressure Trend */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Blood Pressure Trend</h3>
              <p className="text-sm text-gray-600">John Smith - Today</p>
            </div>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bpTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} name="Systolic" />
              <Line type="monotone" dataKey="diastolic" stroke="#10b981" strokeWidth={2} name="Diastolic" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Glucose Trend */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Glucose Level Trend</h3>
              <p className="text-sm text-gray-600">Robert Brown - Last 7 Days</p>
            </div>
            <Droplet className="w-5 h-5 text-purple-600" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={glucoseTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-900">
                Glucose levels trending higher. Consider consulting with doctor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Devices */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Supported Devices</h3>
          <p className="text-sm text-gray-600">Compatible IoT and wearable devices</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: 'BP Monitors', icon: Activity, count: '5 models', color: 'blue' },
              { name: 'Glucose Meters', icon: Droplet, count: '4 models', color: 'purple' },
              { name: 'Heart Rate Trackers', icon: Heart, count: '8 models', color: 'red' },
              { name: 'Thermometers', icon: Thermometer, count: '3 models', color: 'orange' },
            ].map((deviceType, index) => (
              <div key={index} className={`p-4 border border-${deviceType.color}-200 bg-${deviceType.color}-50 rounded-lg`}>
                <deviceType.icon className={`w-8 h-8 text-${deviceType.color}-600 mb-3`} />
                <h4 className="font-medium text-gray-900">{deviceType.name}</h4>
                <p className="text-sm text-gray-600">{deviceType.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add IoT Device</h2>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Type *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>BP Monitor</option>
                    <option>Glucose Meter</option>
                    <option>Heart Rate Tracker</option>
                    <option>Thermometer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Model *</label>
                  <input type="text" placeholder="e.g., Omron BP Monitor" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device ID</label>
                  <input type="text" placeholder="Unique device identifier" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Connect Device
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
