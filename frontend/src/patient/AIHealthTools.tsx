import { useState } from 'react';
import {
  Brain,
  Mic,
  FileText,
  Volume2,
  Scan,
  TrendingUp,
  Sparkles,
  Send,
  Upload,
  Play,
  Pause,
  Download,
  Languages
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../common/ui/card';
import { Button } from '../common/ui/button';
import { Textarea } from '../common/ui/textarea';
import { Badge } from '../common/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../common/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/ui/select';
import { Calendar } from '../common/ui/calendar';

export function AIHealthTools() {
  const [symptomText, setSymptomText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-semibold text-gray-900 mb-1">AI-Powered Health Tools</h1>
        <p className="text-sm text-gray-600">Get instant insights about your health using advanced AI</p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-pink-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="p-3 bg-pink-100 rounded-lg w-fit mb-2">
              <Brain className="size-6 text-pink-600" />
            </div>
            <CardTitle className="text-lg">AI Symptom Checker</CardTitle>
            <CardDescription>
              Describe your symptoms and get AI-powered insights with specialist recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
              Start Diagnosis
            </Button>
          </CardContent>
        </Card>

        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-2">
              <Mic className="size-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Voice-to-Text</CardTitle>
            <CardDescription>
              Speak your symptoms in English or Hindi, and AI will analyze them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Start Recording
            </Button>
          </CardContent>
        </Card>

        <Card className="border-pink-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="p-3 bg-pink-100 rounded-lg w-fit mb-2">
              <FileText className="size-6 text-pink-600" />
            </div>
            <CardTitle className="text-lg">Report Explainer</CardTitle>
            <CardDescription>
              Upload any medical report and get a simple explanation in your language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
              Upload Report
            </Button>
          </CardContent>
        </Card>

        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-2">
              <Volume2 className="size-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Audio Summary</CardTitle>
            <CardDescription>
              Listen to your health reports and summaries in audio format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Text-to-Speech
            </Button>
          </CardContent>
        </Card>

        <Card className="border-pink-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="p-3 bg-pink-100 rounded-lg w-fit mb-2">
              <Scan className="size-6 text-pink-600" />
            </div>
            <CardTitle className="text-lg">X-Ray & Scan Analysis</CardTitle>
            <CardDescription>
              AI-powered analysis of X-rays, CT scans, and MRIs with detailed explanations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
              Upload Scan
            </Button>
          </CardContent>
        </Card>

        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-2">
              <TrendingUp className="size-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Health Insights</CardTitle>
            <CardDescription>
              Get personalized health recommendations based on your medical history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              View Insights
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Symptom Checker */}
      <Card className="border-2 border-pink-200">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Sparkles className="size-5 text-pink-600" />
            </div>
            <div>
              <CardTitle>Try AI Symptom Checker</CardTitle>
              <CardDescription>E.g., I have a headache and fever...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">
                <FileText className="size-4 mr-2" />
                Type Symptoms
              </TabsTrigger>
              <TabsTrigger value="voice">
                <Mic className="size-4 mr-2" />
                Voice Input
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Textarea
                    placeholder="Describe your symptoms in detail... e.g., 'I have been experiencing headache and fever for the past 2 days, along with body aches'"
                    value={symptomText}
                    onChange={(e) => setSymptomText(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleAnalyze}
                  disabled={!symptomText || isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="size-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="size-4 mr-2" />
                      Analyze Symptoms
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                <div className={`p-6 rounded-full mb-4 ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-200'}`}>
                  <Mic className={`size-8 ${isRecording ? 'text-red-600' : 'text-gray-600'}`} />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {isRecording ? 'Recording... Speak your symptoms' : 'Click to start recording'}
                </p>
                <Button
                  onClick={() => setIsRecording(!isRecording)}
                  variant={isRecording ? 'destructive' : 'default'}
                  className="w-48"
                >
                  {isRecording ? (
                    <>
                      <Pause className="size-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="size-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>

                <div className="flex gap-2 mt-4">
                  <Badge variant="outline">English</Badge>
                  <Badge variant="outline">हिंदी</Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {showResult && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Brain className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">AI Analysis Results</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Likely Condition:</strong> Common Viral Infection
                      </p>
                      <p className="text-sm text-gray-600">
                        Based on your symptoms (headache, fever, body aches), you may have a common viral infection.
                        The AI suggests consulting a <strong>General Physician</strong> or an <strong>ENT Specialist</strong>.
                      </p>

                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-500 mb-2">
                          <Languages className="size-3 inline mr-1" />
                          Translation (हिंदी):
                        </p>
                        <p className="text-sm text-gray-700">
                          सामान्य वायरल संक्रमण की संभावना है। कृपया सामान्य चिकित्सक से परामर्श लें।
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Calendar className="size-4 mr-2" />
                        Book Appointment with GP
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="size-4 mr-2" />
                            Pause Audio
                          </>
                        ) : (
                          <>
                            <Play className="size-4 mr-2" />
                            Listen to Summary
                          </>
                        )}
                      </Button>

                      <Button variant="outline">
                        <Download className="size-4 mr-2" />
                        Download Report
                      </Button>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                      <p className="text-xs text-amber-800">
                        ⚠️ <strong>Disclaimer:</strong> This is an AI-powered preliminary assessment and not a medical diagnosis.
                        Please consult a qualified healthcare professional for proper diagnosis and treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Tools Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-purple-600" />
              Upload Medical Report
            </CardTitle>
            <CardDescription>Get AI-powered explanation in English or Hindi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="size-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop your report or click to browse
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Upload className="size-4 mr-2" />
                Choose File
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                Supports: PDF, JPG, PNG (Max 10MB)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="size-5 text-pink-600" />
              Upload X-Ray or Scan
            </CardTitle>
            <CardDescription>AI analysis of X-rays, CT scans, and MRIs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Scan className="size-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-4">
                Upload your medical imaging scan
              </p>
              <Button className="bg-pink-600 hover:bg-pink-700">
                <Upload className="size-4 mr-2" />
                Choose Image
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                Supports: DICOM, JPG, PNG (Max 20MB)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}