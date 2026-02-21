import { useState } from 'react';
import { UserRole } from '../common/types';
import {
    Brain,
    MessageSquare,
    FileText,
    Activity,
    Calendar,
    Pill,
    TrendingUp,
    Users,
    Play,
    Pause,
    Settings
} from 'lucide-react';

interface AIModulesProps {
    userRole: UserRole;
}

interface AIModule {
    id: number;
    name: string;
    description: string;
    icon: any;
    status: 'active' | 'inactive';
    usage: number;
    features: string[];
}

const aiModules: AIModule[] = [
    {
        id: 1,
        name: 'Appointment Assistant',
        description: 'AI-powered smart scheduling and appointment optimization',
        icon: Calendar,
        status: 'active',
        usage: 87,
        features: ['Smart slot suggestions', 'No-show prediction', 'Auto-reminders']
    },
    {
        id: 2,
        name: 'Virtual Receptionist',
        description: 'Automated patient inquiry handling and call routing',
        icon: MessageSquare,
        status: 'active',
        usage: 92,
        features: ['24/7 availability', 'Multi-language support', 'Call routing']
    },
    {
        id: 3,
        name: 'Symptom Checker',
        description: 'AI-based preliminary diagnosis and triage',
        icon: Activity,
        status: 'active',
        usage: 76,
        features: ['Symptom analysis', 'Triage recommendations', 'Patient education']
    },
    {
        id: 4,
        name: 'Prescription Generator',
        description: 'Smart prescription creation with drug interaction checking',
        icon: Pill,
        status: 'active',
        usage: 84,
        features: ['Drug interaction alerts', 'Dosage recommendations', 'Auto-refill']
    },
    {
        id: 5,
        name: 'Medical Transcription',
        description: 'Voice-to-text medical note generation',
        icon: FileText,
        status: 'inactive',
        usage: 0,
        features: ['Real-time transcription', 'Medical terminology', 'Auto-formatting']
    },
    {
        id: 6,
        name: 'Predictive Analytics',
        description: 'Patient outcome prediction and risk assessment',
        icon: TrendingUp,
        status: 'active',
        usage: 68,
        features: ['Risk scoring', 'Outcome prediction', 'Trend analysis']
    },
];

export function AIModules({ userRole }: AIModulesProps) {
    const [selectedModule, setSelectedModule] = useState<AIModule | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">AI Modules</h1>
                    <p className="text-gray-600">Intelligent automation for healthcare</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="w-5 h-5" />
                    Configure
                </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-600 rounded-lg">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{aiModules.filter(m => m.status === 'active').length}</p>
                            <p className="text-sm text-gray-600">Active Modules</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-600 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">81%</p>
                            <p className="text-sm text-gray-600">Avg Usage</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-600 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">1,247</p>
                            <p className="text-sm text-gray-600">AI Interactions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiModules.map((module) => {
                    const Icon = module.icon;
                    return (
                        <div
                            key={module.id}
                            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => setSelectedModule(module)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg ${module.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>
                                    <Icon className={`w-6 h-6 ${module.status === 'active' ? 'text-blue-600' : 'text-gray-400'
                                        }`} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${module.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {module.status}
                                </span>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-2">{module.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{module.description}</p>

                            {module.status === 'active' && (
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-600">Usage</span>
                                        <span className="font-medium text-gray-900">{module.usage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{ width: `${module.usage}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase">Features</p>
                                <ul className="space-y-1">
                                    {module.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-blue-600 mt-0.5">•</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                                <button className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${module.status === 'active'
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                    }`}>
                                    {module.status === 'active' ? (
                                        <>
                                            <Pause className="w-4 h-4" />
                                            Pause
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4" />
                                            Activate
                                        </>
                                    )}
                                </button>
                                <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Configure
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-600 rounded-lg">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">AI Performance Insights</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span><strong>Appointment Assistant:</strong> Reduced no-shows by 23% this month</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span><strong>Virtual Receptionist:</strong> Handled 847 patient inquiries automatically</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span><strong>Prescription Generator:</strong> Detected 12 potential drug interactions</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
