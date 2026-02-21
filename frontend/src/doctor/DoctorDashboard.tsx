import { useState } from 'react';
import { User } from '../common/types';
import {
  LayoutDashboard,
  Users,
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
import { PatientManagement } from './PatientManagement';
import { AppointmentManagement } from './AppointmentManagement';
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
  | 'patients'
  | 'appointments'
  | 'prescriptions'
  | 'lab'
  | 'reports'
  | 'ai'
  | 'iot'
  | 'notifications'
  | 'settings';

const menuItems = [
  { id: 'dashboard' as DoctorView, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients' as DoctorView, label: 'Patients', icon: Users },
  { id: 'appointments' as DoctorView, label: 'Appointments', icon: Calendar },
  { id: 'prescriptions' as DoctorView, label: 'Prescriptions', icon: FileText },
  { id: 'lab' as DoctorView, label: 'Lab Diagnostics', icon: TestTube },
  { id: 'reports' as DoctorView, label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'ai' as DoctorView, label: 'AI Modules', icon: Brain },
  { id: 'iot' as DoctorView, label: 'IoT Integration', icon: Activity },
  { id: 'notifications' as DoctorView, label: 'Notifications', icon: Bell },
  { id: 'settings' as DoctorView, label: 'Settings', icon: SettingsIcon },
];

export function DoctorDashboard({ user }: DoctorDashboardProps) {
  const [currentView, setCurrentView] = useState<DoctorView>('dashboard');
  const { logout } = useAuth();

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userRole={user.role} />;
      case 'patients':
        return <PatientManagement userRole={user.role} />;
      case 'appointments':
        return <AppointmentManagement userRole={user.role} />;
      case 'prescriptions':
        return <PrescriptionRecords userRole={user.role} />;
      case 'lab':
        return <LabDiagnostics userRole={user.role} />;
      case 'reports':
        return <ReportsAnalytics userRole={user.role} />;
      case 'ai':
        return <AIModules userRole={user.role} />;
      case 'iot':
        return <IoTIntegration userRole={user.role} />;
      case 'notifications':
        return <Notifications userRole={user.role} />;
      case 'settings':
        return <Settings userRole={user.role} />;
      default:
        return <Dashboard userRole={user.role} />;
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
