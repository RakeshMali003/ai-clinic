import { useState } from 'react';
import { patientService } from '../services/patientService';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  Pill,
  Clock,
  Brain,
  Languages,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent } from '../common/ui/card';
import { Button } from '../common/ui/button';
import { Badge } from '../common/ui/badge';
import { Input } from '../common/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/ui/select';
import type { PatientUser } from './PatientPortal';

interface MyPrescriptionsProps {
  patient: PatientUser;
}

export function MyPrescriptions({ patient }: MyPrescriptionsProps) {
  const prescriptions = (patient as any).prescriptions || [];
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAIExplanation, setShowAIExplanation] = useState<string | null>(null);
  const [aiContent, setAIContent] = useState<string | null>(null);
  const [aiLoading, setAILoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrescriptions = prescriptions.filter((rx: any) =>
    rx.prescription_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rx.doctor?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rx.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleGetAIExplanation = async (rxId: string, prescriptionText: string) => {
    try {
      setAILoading(true);
      setShowAIExplanation(rxId);
      const explanation = await patientService.explainPrescription(prescriptionText, selectedLanguage);
      setAIContent(explanation);
    } catch (error) {
      console.error('AI Explanation Error:', error);
      setAIContent('Error generating explanation.');
    } finally {
      setAILoading(false);
    }
  };

  const toggleAIExplanation = async (rxId: string, prescriptionText: string) => {
    if (showAIExplanation === rxId) {
      setShowAIExplanation(null);
      setAIContent(null);
    } else {
      await handleGetAIExplanation(rxId, prescriptionText);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-gray-900 mb-1">My Prescriptions</h1>
          <p className="text-sm text-gray-600">View, download, and get AI explanations of your prescriptions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Prescriptions</p>
                <p className="font-semibold text-gray-900">{prescriptions.filter((rx: any) => rx.status === 'active').length || prescriptions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by prescription ID, doctor, or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.map((rx: any) => (
          <Card key={rx.prescription_id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{rx.prescription_id}</h3>
                    <Badge className={rx.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                      {rx.status || 'Active'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="size-4" />
                      {new Date(rx.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="size-4" />
                      {rx.doctor?.full_name || 'Clinic Doctor'}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="size-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleExpand(rx.prescription_id)}
                  >
                    <Eye className="size-4 mr-2" />
                    {expandedId === rx.prescription_id ? 'Hide' : 'View'}
                    {expandedId === rx.prescription_id ? (
                      <ChevronUp className="size-4 ml-2" />
                    ) : (
                      <ChevronDown className="size-4 ml-2" />
                    )}
                  </Button>
                </div>
              </div>

              {expandedId === rx.prescription_id && (
                <div className="pt-4 border-t space-y-4">
                  {/* Medicines */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Pill className="size-4" />
                      Prescribed Medicines
                    </h4>
                    <div className="space-y-2">
                      {(rx.medicines || []).map((med: any, idx: number) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 mb-1">{med.name || med.medicine_id}</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Dosage:</span> {med.dosage}
                                </div>
                                <div>
                                  <span className="font-medium">Frequency:</span> {med.frequency}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Explanation */}
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAIExplanation(rx.prescription_id, JSON.stringify(rx))}
                      disabled={aiLoading}
                      className="mb-3"
                    >
                      <Brain className="size-4 mr-2" />
                      {aiLoading && showAIExplanation === rx.prescription_id ? 'Analyzing...' : (showAIExplanation === rx.prescription_id ? 'Hide' : 'Get') + ' AI Explanation'}
                    </Button>

                    {showAIExplanation === rx.prescription_id && (
                      <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-4">
                          <Brain className="size-5 text-purple-600" />
                          <h4 className="font-semibold text-gray-900">AI-Powered Explanation</h4>
                          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <SelectTrigger className="w-[140px] h-8 ml-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="English">
                                <div className="flex items-center gap-2">
                                  <Languages className="size-3" />
                                  English
                                </div>
                              </SelectItem>
                              <SelectItem value="Hindi">
                                <div className="flex items-center gap-2">
                                  <Languages className="size-3" />
                                  हिंदी
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="p-4 bg-white rounded-lg prose prose-sm max-w-none">
                          {aiLoading ? (
                            <div className="flex items-center justify-center p-8">
                              <Clock className="size-6 animate-spin text-purple-600 mr-2" />
                              <span>Generating personalized health insights...</span>
                            </div>
                          ) : (
                            <div className="whitespace-pre-line text-gray-700">
                              {aiContent}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
