import { useState, useEffect } from 'react';
import { patientService } from '../services/patientService';
import {
  FileText,
  Eye,
  Calendar,
  User,
  Pill,
  Brain,
  Upload,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/ui/card';
import { Button } from '../common/ui/button';
import { Badge } from '../common/ui/badge';
import { Input } from '../common/ui/input';
import { toast } from 'react-hot-toast';
import type { PatientUser } from './PatientPortal';

export function MyPrescriptions({ patient }: { patient: PatientUser }) {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [_loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAIExplanation, setShowAIExplanation] = useState<string | null>(null);
  const [aiContent, setAIContent] = useState<string | null>(null);
  const [aiLoading, setAILoading] = useState(false);
  const [_selectedLanguage] = useState('English');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPrescriptions();
    fetchDocuments();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setPrescriptions((patient as any).prescriptions || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await patientService.getMyDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

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
      const explanation = await patientService.explainPrescription(prescriptionText, _selectedLanguage);
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
          <h1 className="font-semibold text-gray-900 mb-1">My Prescriptions & Documents</h1>
          <p className="text-sm text-gray-600">View your medical documents and get AI-powered insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search prescriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Prescriptions List */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Pill className="size-5 text-pink-600" />
              Clinic Prescriptions
            </h2>
            {filteredPrescriptions.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <p className="text-gray-500">No prescriptions found.</p>
              </Card>
            ) : (
              filteredPrescriptions.map((rx: any) => (
                <Card key={rx.prescription_id} className="overflow-hidden border-pink-50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{rx.prescription_id}</h3>
                          <Badge className={rx.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                            {rx.status || 'Active'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Calendar className="size-4" /> {new Date(rx.created_at).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><User className="size-4" /> {rx.doctor?.full_name || 'Clinic Doctor'}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleExpand(rx.prescription_id)}
                      >
                        {expandedId === rx.prescription_id ? 'Hide' : 'View Details'}
                      </Button>
                    </div>

                    {expandedId === rx.prescription_id && (
                      <div className="pt-4 border-t space-y-4">
                        <div className="space-y-2">
                          {(rx.medicines || []).map((med: any, idx: number) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                              <div>
                                <p className="font-bold text-gray-900">{med.name || med.medicine_id}</p>
                                <p className="text-xs text-gray-600">{med.dosage} • {med.frequency}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAIExplanation(rx.prescription_id, JSON.stringify(rx))}
                          disabled={aiLoading}
                          className="w-full bg-purple-50 text-purple-700 border-purple-200"
                        >
                          <Brain className="size-4 mr-2" />
                          AI Explanation
                        </Button>
                        {showAIExplanation === rx.prescription_id && (
                          <div className="p-4 bg-white border border-purple-100 rounded-lg text-sm text-gray-700 leading-relaxed">
                            {aiLoading ? 'Analyzing...' : aiContent}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Documents Sidebar */}
        <div className="space-y-6">
          <Card className="border-pink-200 shadow-md">
            <CardHeader className="bg-pink-50/50">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Upload Documents</span>
                <Upload className="size-4 text-pink-600" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="border-2 border-dashed border-pink-100 rounded-lg p-6 text-center">
                <p className="text-xs text-gray-500 mb-3">Upload lab reports or external prescriptions</p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        setLoading(true);
                        await patientService.uploadDocument(file);
                        toast.success('Document uploaded successfully');
                        fetchDocuments();
                      } catch (error: any) {
                        toast.error(error.message || 'Failed to upload document');
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                />
                <Button
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={_loading}
                >
                  {_loading ? 'Uploading...' : 'Choose Files'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Storage</h3>
            {documents.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No uploaded documents yet.</p>
            ) : (
              documents.map((doc) => (
                <Card key={doc.id} className="border-gray-100 hover:border-pink-200 transition-colors">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-pink-50 rounded flex items-center justify-center">
                        <FileText className="size-4 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 truncate max-w-[120px]">{doc.file_name}</p>
                        <p className="text-[10px] text-gray-500">{new Date(doc.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="size-7"><Eye className="size-3" /></Button>
                      <Button variant="ghost" size="icon" className="size-7 text-red-400"><Trash2 className="size-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
