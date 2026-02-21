import { useState, useEffect } from 'react';
import { patientService } from '../services/patientService';
import {
  FileText,
  Download,
  Eye,
  Upload,
  Calendar,
  User,
  Activity,
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
import { Clock } from 'lucide-react';
import type { PatientUser } from './PatientPortal';

interface MyReportsProps {
  patient: PatientUser;
}

export function MyReports({ patient }: MyReportsProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAIExplanation, setShowAIExplanation] = useState<string | null>(null);
  const [aiContent, setAIContent] = useState<string | null>(null);
  const [aiLoading, setAILoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await patientService.getMyDocuments();
        setReports(data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleGetAIExplanation = async (reportId: string, content: string) => {
    try {
      setAILoading(true);
      setShowAIExplanation(reportId);
      const explanation = await patientService.explainReport(content, selectedLanguage);
      setAIContent(explanation);
    } catch (error) {
      console.error('AI Explanation Error:', error);
      setAIContent('Error generating explanation.');
    } finally {
      setAILoading(false);
    }
  };

  const toggleAIExplanation = async (reportId: string, content: string) => {
    if (showAIExplanation === reportId) {
      setShowAIExplanation(null);
      setAIContent(null);
    } else {
      await handleGetAIExplanation(reportId, content);
    }
  };

  const filteredReports = reports.filter(report =>
    report.document_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.file_url?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-gray-900 mb-1">Medical Reports</h1>
          <p className="text-sm text-gray-600">Upload, view, and get AI-powered explanations of your medical reports</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Upload className="size-4 mr-2" />
          Upload New Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="font-semibold text-gray-900">{reports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50">
        <CardContent className="p-8">
          <div className="text-center">
            <Upload className="size-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Upload Medical Report</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get instant AI-powered explanations in English or Hindi
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="size-4 mr-2" />
              Choose File to Upload
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{report.document_type || 'Medical Document'}</h3>
                    <Badge className="bg-green-600">Available</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="size-4" />
                      {new Date(report.uploaded_on).toLocaleDateString()}
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
                    onClick={() => toggleExpand(report.id)}
                  >
                    <Eye className="size-4 mr-2" />
                    {expandedId === report.id ? 'Hide' : 'View'}
                    {expandedId === report.id ? (
                      <ChevronUp className="size-4 ml-2" />
                    ) : (
                      <ChevronDown className="size-4 ml-2" />
                    )}
                  </Button>
                </div>
              </div>

              {expandedId === report.id && (
                <div className="pt-4 border-t space-y-4">
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAIExplanation(report.id, report.file_url)}
                      disabled={aiLoading}
                      className="mb-3"
                    >
                      <Brain className="size-4 mr-2" />
                      {aiLoading && showAIExplanation === report.id ? 'Analyzing...' : (showAIExplanation === report.id ? 'Hide' : 'Get') + ' AI Explanation'}
                    </Button>

                    {showAIExplanation === report.id && (
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
                              <span>Developing medical insights...</span>
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
