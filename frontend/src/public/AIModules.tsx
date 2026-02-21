import React, { useState } from 'react';
import { UserRole } from '../common/types';
import {
  Sparkles,
  Bot,
  Mic,
  FileSearch,
  Lightbulb,
  TrendingUp,
  MessageSquare,
  ClipboardList,
  Smile,
  Camera,
  Calendar as CalendarIcon,
  Brain,
  CheckCircle
} from 'lucide-react';

interface AIModulesProps {
  userRole: UserRole;
}

const aiModules = [
  {
    id: 'appointment-assistant',
    name: 'AI Appointment Assistant',
    description: 'Intelligent scheduling and slot optimization',
    icon: CalendarIcon,
    status: 'active',
    color: 'blue',
    features: ['Smart slot suggestions', 'No-show prediction', 'Auto-rescheduling']
  },
  {
    id: 'virtual-receptionist',
    name: 'Virtual Receptionist',
    description: '24/7 chatbot for patient queries',
    icon: Bot,
    status: 'active',
    color: 'green',
    features: ['Natural language processing', 'Multi-language support', 'Context-aware responses']
  },
  {
    id: 'symptom-checker',
    name: 'AI Symptom Checker',
    description: 'Preliminary diagnosis assistance',
    icon: ClipboardList,
    status: 'active',
    color: 'purple',
    features: ['Symptom analysis', 'Triage recommendations', 'Urgency detection']
  },
  {
    id: 'prescription-generator',
    name: 'Prescription Generator',
    description: 'AI-powered prescription suggestions',
    icon: FileSearch,
    status: 'active',
    color: 'orange',
    features: ['Drug interaction checks', 'Dosage recommendations', 'Alternative suggestions']
  },
  {
    id: 'analytics-insights',
    name: 'Analytics & Insights',
    description: 'Predictive analytics and trends',
    icon: TrendingUp,
    status: 'active',
    color: 'indigo',
    features: ['Revenue forecasting', 'Patient trends', 'Resource optimization']
  },
  {
    id: 'health-summarizer',
    name: 'Health Record Summarizer',
    description: 'Automated medical history summaries',
    icon: Brain,
    status: 'active',
    color: 'pink',
    features: ['Record summarization', 'Key insights extraction', 'Timeline generation']
  },
  {
    id: 'voice-notes',
    name: 'Voice-to-Text Notes',
    description: 'Convert voice notes to text',
    icon: Mic,
    status: 'active',
    color: 'teal',
    features: ['Real-time transcription', 'Medical terminology', 'Multi-language support']
  },
  {
    id: 'document-scanner',
    name: 'Document Scanner (OCR)',
    description: 'Extract text from medical documents',
    icon: Camera,
    status: 'active',
    color: 'cyan',
    features: ['Prescription scanning', 'Report digitization', 'Data extraction']
  },
  {
    id: 'treatment-recommender',
    name: 'Treatment Recommendation',
    description: 'Evidence-based treatment suggestions',
    icon: Lightbulb,
    status: 'active',
    color: 'yellow',
    features: ['Clinical guidelines', 'Best practices', 'Personalized recommendations']
  },
  {
    id: 'sentiment-analyzer',
    name: 'Feedback & Sentiment Analyzer',
    description: 'Analyze patient feedback',
    icon: Smile,
    status: 'active',
    color: 'rose',
    features: ['Sentiment analysis', 'Feedback categorization', 'Trend detection']
  },
  {
    id: 'face-recognition',
    name: 'Face Recognition Attendance',
    description: 'Automated staff attendance',
    icon: Camera,
    status: 'beta',
    color: 'violet',
    features: ['Face detection', 'Liveness check', 'Attendance logs']
  },
  {
    id: 'clinical-qa',
    name: 'Clinical Assistant Q&A',
    description: 'Medical knowledge assistant',
    icon: MessageSquare,
    status: 'active',
    color: 'emerald',
    features: ['Medical database', 'Evidence-based answers', 'Citation sources']
  },
  {
    id: 'workload-planner',
    name: 'Predictive Workload Planner',
    description: 'Forecast clinic workload',
    icon: TrendingUp,
    status: 'active',
    color: 'amber',
    features: ['Peak hour prediction', 'Staff scheduling', 'Resource allocation']
  },
];

export function AIModules({ userRole }: AIModulesProps) {
  const [selectedModule, setSelectedModule] = useState<typeof aiModules[0] | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered Modules</h1>
          <p className="text-gray-600">Advanced AI features for enhanced healthcare delivery</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-900">{aiModules.filter(m => m.status === 'active').length} Active Modules</span>
        </div>
      </div>

      {/* AI Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiModules.map((module) => (
          <div
            key={module.id}
            className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
            onClick={() => setSelectedModule(module)}
          >
            <div className={`h-2 bg-gradient-to-r from-${module.color}-400 to-${module.color}-600`}></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${module.color}-50 group-hover:scale-110 transition-transform`}>
                  <module.icon className={`w-6 h-6 text-${module.color}-600`} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${module.status === 'active' ? 'bg-green-100 text-green-700' :
                    module.status === 'beta' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                  }`}>
                  {module.status.toUpperCase()}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{module.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{module.description}</p>

              <div className="space-y-2">
                {module.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDemo(true);
                  setSelectedModule(module);
                }}
                className={`w-full mt-4 px-4 py-2 bg-${module.color}-600 text-white rounded-lg hover:bg-${module.color}-700 transition-colors text-sm font-medium`}
              >
                Try Demo
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">AI Module Usage Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">2,847</div>
            <div className="text-sm text-gray-600">AI Predictions Made</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">94%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">1,234</div>
            <div className="text-sm text-gray-600">Hours Saved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">₹2.5L</div>
            <div className="text-sm text-gray-600">Cost Savings</div>
          </div>
        </div>
      </div>

      {/* Module Demo Modal */}
      {showDemo && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-${selectedModule.color}-50`}>
                    <selectedModule.icon className={`w-6 h-6 text-${selectedModule.color}-600`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedModule.name}</h2>
                    <p className="text-sm text-gray-600">{selectedModule.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDemo(false);
                    setSelectedModule(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">AI Demo Mode</h3>
                    <p className="text-sm text-gray-700">
                      This is a demonstration of the {selectedModule.name} module. In production, this feature
                      uses advanced machine learning models to provide accurate predictions and insights.
                    </p>
                  </div>
                </div>
              </div>

              {selectedModule.id === 'virtual-receptionist' && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs">
                      Hello! I need to book an appointment.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 max-w-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">AI Assistant</span>
                      </div>
                      Hello! I'd be happy to help you book an appointment. Could you please tell me which doctor
                      you'd like to see and your preferred date?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs">
                      Dr. Sarah Johnson, tomorrow if possible.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 max-w-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">AI Assistant</span>
                      </div>
                      I can see Dr. Sarah Johnson has these available slots tomorrow: 10:00 AM, 2:30 PM, and 4:00 PM.
                      Which time works best for you?
                    </div>
                  </div>
                </div>
              )}

              {selectedModule.id === 'symptom-checker' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Patient Symptoms Input</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">Reported Symptoms:</p>
                      <ul className="list-disc list-inside text-gray-900">
                        <li>Fever (38.5°C)</li>
                        <li>Headache</li>
                        <li>Fatigue</li>
                        <li>Sore throat</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 mb-2">AI Analysis Result:</p>
                        <p className="text-blue-800 mb-3">
                          Based on the symptoms, this could be an <strong>Upper Respiratory Tract Infection (URTI)</strong>.
                        </p>
                        <p className="text-blue-800 mb-2"><strong>Recommendations:</strong></p>
                        <ul className="list-disc list-inside text-blue-800 space-y-1">
                          <li>Urgency Level: <span className="font-medium">Medium (24-48 hours)</span></li>
                          <li>Suggested Specialist: General Physician</li>
                          <li>Preliminary Tests: CBC, Throat Swab</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-6">
                <button
                  className={`flex-1 px-4 py-2 bg-${selectedModule.color}-600 text-white rounded-lg hover:bg-${selectedModule.color}-700 transition-colors`}
                >
                  Enable Module
                </button>
                <button
                  onClick={() => {
                    setShowDemo(false);
                    setSelectedModule(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
