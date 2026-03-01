import { useState } from 'react';
import { User } from '../common/types';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  TestTube,
  BarChart3,
  Brain,
  Activity,
  Bell,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { Dashboard } from './Dashboard';
import { AppointmentManagement } from './AppointmentManagement';
import { Prescription } from './Prescription';
import { PrescriptionRecords } from './PrescriptionRecords';
import { LabDiagnostics } from './LabDiagnostics';
import { ReportsAnalytics } from './ReportsAnalytics';
import { AIModules } from './AIModules';
import { IoTIntegration } from './IoTIntegration';
import { Notifications } from './Notifications';
import { Settings } from './Settings';
import { useAuth } from '../contexts/AuthContext';

interface DoctorDashboardProps {
  user: User;
}

type DoctorView =
  | 'dashboard'
  | 'appointments'
  | 'prescription'
  | 'prescription_records'
  | 'lab'
  | 'reports'
  | 'ai'
  | 'iot'
  | 'notifications'
  | 'settings';

const menuItems = [
  { id: 'dashboard' as DoctorView, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'appointments' as DoctorView, label: 'Appointment Management', icon: Calendar },
  { id: 'prescription_records' as DoctorView, label: 'Prescription Records', icon: FileText },
  { id: 'lab' as DoctorView, label: 'Lab Diagnostics', icon: TestTube },
  { id: 'reports' as DoctorView, label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'ai' as DoctorView, label: 'AI Modules', icon: Brain },
  { id: 'iot' as DoctorView, label: 'IoT Integration', icon: Activity },
  { id: 'notifications' as DoctorView, label: 'Notifications', icon: Bell },
  { id: 'settings' as DoctorView, label: 'Settings', icon: SettingsIcon },
];

export function DoctorDashboard({ user }: DoctorDashboardProps) {
  const [currentView, setCurrentView] = useState<DoctorView>('dashboard');
  const [activeAppointment, setActiveAppointment] = useState<any>(null);
  const { logout } = useAuth();

  const handleStartAppointment = (appointment: any) => {
    setActiveAppointment(appointment);
    setCurrentView('prescription');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userRole={user.role as any} />;
      case 'appointments':
        return <AppointmentManagement userRole={user.role as any} onStartAppointment={handleStartAppointment} />;
      case 'prescription':
        return <Prescription appointment={activeAppointment} onBack={() => setCurrentView('appointments')} />;
      case 'prescription_records':
        return <PrescriptionRecords />;
      case 'lab':
        return <LabDiagnostics userRole={user.role as any} />;
      case 'reports':
        return <ReportsAnalytics userRole={user.role as any} />;
      case 'ai':
        return <AIModules userRole={user.role as any} />;
      case 'iot':
        return <IoTIntegration userRole={user.role as any} />;
      case 'notifications':
        return <Notifications userRole={user.role as any} />;
      case 'settings':
        return <Settings userRole={user.role as any} />;
      default:
        return <Dashboard userRole={user.role as any} />;
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Doctor Panel</h2>
          <p className="text-sm text-gray-600 mt-1">{user.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
