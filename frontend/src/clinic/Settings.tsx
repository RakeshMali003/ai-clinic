import { useEffect, useState } from 'react';
import { UserRole } from '../common/types';
import { User, Bell, CreditCard, Database, HelpCircle, Save, Loader2 } from 'lucide-react';
import { clinicService } from '../services/clinicService';

interface SettingsProps {
  userRole: UserRole;
}

export function Settings({ userRole }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await clinicService.getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (updates: any) => {
    try {
      setSaving(true);
      await clinicService.updateSettings(updates);
      setSettings((prev: any) => ({ ...prev, ...updates }));
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile & Security', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment Gateway', icon: CreditCard, adminOnly: true },
    { id: 'backup', label: 'Data & Backup', icon: Database, adminOnly: true },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  const accessibleTabs = tabs.filter(tab => !tab.adminOnly || userRole === 'clinic' || userRole === 'admin');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Configuring clinic environment...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your preferences and configurations</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-xl border border-gray-200 p-4">
          <nav className="space-y-1">
            {accessibleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue={settings.clinic_name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        onChange={(e) => setSettings({ ...settings, clinic_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue={settings.clinic_email || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        onChange={(e) => setSettings({ ...settings, clinic_email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        defaultValue={settings.clinic_phone || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        onChange={(e) => setSettings({ ...settings, clinic_phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input type="text" defaultValue={String(userRole)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => handleSave(settings)}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                <p className="text-sm text-gray-600 mb-6">Choose how you want to be notified</p>

                <div className="space-y-4">
                  {[
                    { key: 'notify_email', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'notify_sms', label: 'SMS Notifications', desc: 'Get text message alerts' },
                    { key: 'notify_inapp', label: 'In-App Notifications', desc: 'Show notifications in the app' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.label}</h3>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[item.key] === 'true'}
                          className="sr-only peer"
                          onChange={(e) => handleSave({ [item.key]: String(e.target.checked) })}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (userRole === 'admin' || userRole === 'clinic') && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Gateway Setup</h2>
                <p className="text-sm text-gray-600 mb-6">Configure your payment processing</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gateway Provider</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Razorpay</option>
                      <option>Paytm</option>
                      <option>PhonePe</option>
                      <option>Stripe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                    <input type="text" placeholder="Enter your API key" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Secret</label>
                    <input type="password" placeholder="Enter your API secret" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="testMode" className="rounded" />
                    <label htmlFor="testMode" className="text-sm text-gray-700">Enable Test Mode</label>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Status:</strong> Payment gateway is configured and active. Last transaction: 2 hours ago.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Save className="w-4 h-4" />
                  Save Configuration
                </button>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (userRole === 'admin' || userRole === 'clinic') && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Backup & Restore</h2>
                <p className="text-sm text-gray-600 mb-6">Manage your clinic data backups</p>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-green-900">Automatic Backups</h3>
                        <p className="text-sm text-green-700">Daily backups are enabled</p>
                      </div>
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">Active</span>
                    </div>
                    <p className="text-sm text-green-800">Last backup: Today at 3:00 AM</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Retention Period</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>30 Days</option>
                      <option>60 Days</option>
                      <option>90 Days</option>
                      <option>1 Year</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">Manual Backup</h3>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Create Backup Now
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Restore from Backup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h2>
                <p className="text-sm text-gray-600 mb-6">Get assistance and report issues</p>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Help Center</h3>
                    <p className="text-sm text-blue-800 mb-3">Browse our documentation and FAQs</p>
                    <button className="text-sm text-blue-600 hover:underline">Visit Help Center →</button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Contact Support</h3>
                    <p className="text-sm text-gray-600 mb-3">Email: support@elinic.com</p>
                    <p className="text-sm text-gray-600 mb-3">Phone: +91 1800 123 4567</p>
                    <p className="text-sm text-gray-600">Response time: Within 24 hours</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Raise Support Ticket</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option>Technical Issue</option>
                          <option>Billing Question</option>
                          <option>Feature Request</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={4}></textarea>
                      </div>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Submit Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
