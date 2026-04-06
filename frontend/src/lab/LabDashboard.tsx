import { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Calendar, 
    Droplet, 
    FlaskConical, 
    FileText, 
    History, 
    Link as LinkIcon, 
    CreditCard, 
    Clock, 
    Star, 
    Users, 
    Settings, 
    LogOut,
    Menu,
    Bell,
    TrendingUp,
    Activity
} from 'lucide-react';
import { User as UserType } from '../common/types';
import { ThemeToggle } from '../common/ThemeToggle';
import { notificationAPI } from '../services/api';

// Import our 12 amazing components
import { DashboardOverview } from './components/DashboardOverview';
import { TestBookings } from './components/TestBookings';
import { SampleManagement } from './components/SampleManagement';
import { TestCatalog } from './components/TestCatalog';
import { ReportManagement } from './components/ReportManagement';
import { PatientRecords } from './components/PatientRecords';
import { ClinicConnections } from './components/ClinicConnections';
import { BillingPayments } from './components/BillingPayments';
import { Scheduling } from './components/Scheduling';
import { Reviews } from './components/Reviews';
import { StaffManagement } from './components/StaffManagement';
import { LabSettings } from './components/LabSettings';

interface LabDashboardProps {
    user: UserType;
}

type ViewType = 
    | 'dashboard'
    | 'bookings'
    | 'samples'
    | 'tests'
    | 'reports'
    | 'patients'
    | 'clinics'
    | 'billing'
    | 'schedule'
    | 'reviews'
    | 'staff'
    | 'settings';

export function LabDashboard({ user }: LabDashboardProps) {
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await notificationAPI.getAll();
            if (res.data.success) {
                setNotifications(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markNotificationAsRead = async (id: string) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, status: 'READ' } : n));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, status: 'READ' })));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const menuItems = [
        { id: 'dashboard' as ViewType, label: 'Overview', icon: LayoutDashboard },
        { id: 'bookings' as ViewType, label: 'Bookings', icon: Calendar },
        { id: 'samples' as ViewType, label: 'Samples', icon: Droplet },
        { id: 'tests' as ViewType, label: 'Lab Tests', icon: FlaskConical },
        { id: 'reports' as ViewType, label: 'Reports', icon: FileText },
        { id: 'patients' as ViewType, label: 'Patients', icon: History },
        { id: 'clinics' as ViewType, label: 'Clinics', icon: LinkIcon },
        { id: 'billing' as ViewType, label: 'Payments', icon: CreditCard },
        { id: 'schedule' as ViewType, label: 'Availability', icon: Clock },
        { id: 'reviews' as ViewType, label: 'Reviews', icon: Star },
        { id: 'staff' as ViewType, label: 'Staff', icon: Users },
        { id: 'settings' as ViewType, label: 'Settings', icon: Settings },
    ];

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard': return <DashboardOverview />;
            case 'bookings': return <TestBookings />;
            case 'samples': return <SampleManagement />;
            case 'tests': return <TestCatalog />;
            case 'reports': return <ReportManagement />;
            case 'patients': return <PatientRecords />;
            case 'clinics': return <ClinicConnections />;
            case 'billing': return <BillingPayments />;
            case 'schedule': return <Scheduling />;
            case 'reviews': return <Reviews />;
            case 'staff': return <StaffManagement />;
            case 'settings': return <LabSettings />;
            default: return <DashboardOverview />;
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-80' : 'w-24'} bg-white border-r border-[#F1F5F9] transition-all duration-500 ease-in-out flex flex-col z-50 shadow-[0_0_50px_-12px_rgba(0,0,0,0.05)]`}>
                <div className="p-4 flex items-center justify-between border-b border-[#F1F5F9]">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-3 animate-in slide-in-from-left duration-500">
                             <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                 <FlaskConical className="w-4 h-4 text-white" />
                             </div>
                             <h1 className="text-xl font-bold text-gray-900 tracking-tight uppercase leading-none">E-Labs</h1>
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-100">
                            <FlaskConical className="w-4 h-4 text-white" />
                        </div>
                    )}
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 hover:bg-gray-50 rounded-lg transition-all text-gray-400 hover:text-blue-600"
                    >
                        <Menu className="w-4 h-4" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 space-y-0.5 custom-scrollbar">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setCurrentView(item.id)}
                                className={`flex items-center ${sidebarOpen ? 'w-full gap-2.5 px-3 py-1.5' : 'w-11 h-11 mx-auto justify-center p-0'} rounded-xl transition-all duration-300 group ${
                                    isActive 
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 transform scale-102 active:scale-100 border-none' 
                                    : 'text-gray-500 hover:bg-gray-50 border border-transparent active:scale-98'
                                }`}
                                title={!sidebarOpen ? item.label : undefined}
                            >
                                <div className={`${sidebarOpen ? 'p-2' : 'p-0'} rounded-xl transition-all flex items-center justify-center grow-0 shrink-0 ${isActive ? (sidebarOpen ? 'bg-white/20' : 'bg-transparent text-white') : 'bg-transparent group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`} />
                                </div>
                                {sidebarOpen && (
                                    <span className={`text-[13px] font-semibold uppercase tracking-tight transition-all ${isActive ? 'translate-x-[2px]' : ''}`}>
                                        {item.label}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-[#F1F5F9] bg-gray-50/50">
                    <div className={`flex ${sidebarOpen ? 'items-center justify-between' : 'flex-col items-center gap-4'}`}>
                        {sidebarOpen && (
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {user.full_name?.charAt(0) || 'L'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-gray-900 uppercase truncate leading-none">{user.full_name || 'Lab Admin'}</p>
                                    <p className="text-[9px] text-gray-400 uppercase tracking-tighter mt-1">Authorized</p>
                                </div>
                            </div>
                        )}
                        <div className={`flex items-center ${sidebarOpen ? 'gap-1' : 'flex-col gap-3'}`}>
                            <ThemeToggle />
                            <button
                                onClick={handleLogout}
                                className={`text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2 ${sidebarOpen ? 'px-2 py-1.5' : 'p-2'}`}
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                                {sidebarOpen && <span className="text-[10px] font-bold uppercase tracking-wider">Sign Out</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden flex flex-col">
                {/* Modern Header */}
                <header className="h-28 bg-white border-b border-[#F1F5F9] px-12 flex items-center justify-between shrink-0 shadow-sm z-30">
                    <div className="flex items-center gap-8">
                         <div className="flex flex-col">
                            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-1">Knowledge Center / {currentView}</h2>
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-green-50"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_green] animate-pulse" /></div>
                                <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1">Facility Live & Operational</p>
                            </div>
                         </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer hidden md:flex items-center gap-3 px-4 py-2 border rounded-full hover:bg-gray-50 hover:border-blue-100 transition-all active:scale-95 h-11">
                             <TrendingUp className="w-4 h-4 text-green-500 animate-bounce" />
                             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 leading-none">Market Share: <span className="text-blue-600">+12%</span></p>
                        </div>
                        <div className="h-10 w-[1px] bg-gray-100" />
                        
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-3 bg-gray-50 hover:bg-blue-600 group rounded-2xl transition-all shadow-inner hover:shadow-blue-200 ${showNotifications ? 'bg-blue-600' : ''}`}
                            >
                                <Bell className={`w-5 h-5 ${showNotifications ? 'text-white' : 'text-gray-400 group-hover:text-white'} group-hover:rotate-12 transition-all`} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full group-hover:animate-bounce" />
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2.5rem] shadow-2xl border border-blue-50 overflow-hidden z-50 animate-in slide-in-from-top-4 duration-300">
                                    <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-white to-gray-50 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-black text-gray-900 uppercase italic tracking-tighter text-lg">Alert Center</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{unreadCount} Pending Notifications</p>
                                        </div>
                                        {unreadCount > 0 && (
                                            <button 
                                                onClick={markAllRead}
                                                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                            >
                                                Flush All
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                                        {notifications.length > 0 ? (
                                            <div className="divide-y divide-gray-50">
                                                {notifications.map((n) => (
                                                    <div 
                                                        key={n.notification_id}
                                                        onClick={() => n.status === 'UNREAD' && markNotificationAsRead(n.notification_id)}
                                                        className={`p-5 hover:bg-gray-50 transition-all cursor-pointer group/notif ${n.status === 'UNREAD' ? 'bg-blue-50/20' : ''}`}
                                                    >
                                                        <div className="flex gap-4">
                                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                                                                n.notification_type === 'LAB_ORDER' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                                            }`}>
                                                                {n.notification_type === 'LAB_ORDER' ? <Activity className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="font-bold text-sm text-gray-900 uppercase tracking-tight leading-tight group-hover/notif:text-blue-600 transition-colors">{n.title}</h4>
                                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{n.message}</p>
                                                                <p className="text-[9px] font-black text-gray-300 uppercase mt-2">{new Date(n.created_at).toLocaleString()}</p>
                                                            </div>
                                                            {n.status === 'UNREAD' && (
                                                                <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-12 text-center">
                                                <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                                <p className="font-bold text-gray-400 italic uppercase text-xs tracking-widest">Digital silence achieved</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                                         <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Archive History</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-12 animate-in fade-in duration-500 custom-scrollbar-main">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                    {/* Bottom Padding */}
                    <div className="h-20" />
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar-main::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar-main::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 20px; border: 4px solid transparent; background-clip: content-box; }
                .custom-scrollbar-main::-webkit-scrollbar-track { background: transparent; }
            `}</style>
        </div>
    );
}
