import { useState } from 'react';
import { UserRole } from '../App';
import { Download, Calendar, FileText, TrendingUp, DollarSign, Users, Stethoscope } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportsAnalyticsProps {
  userRole: UserRole;
}

const dailyAppointments = [
  { date: 'Jan 06', count: 18 },
  { date: 'Jan 07', count: 22 },
  { date: 'Jan 08', count: 25 },
  { date: 'Jan 09', count: 19 },
  { date: 'Jan 10', count: 28 },
  { date: 'Jan 11', count: 24 },
  { date: 'Jan 12', count: 24 },
];

const earningsData = [
  { month: 'Jul', revenue: 142000 },
  { month: 'Aug', revenue: 156000 },
  { month: 'Sep', revenue: 168000 },
  { month: 'Oct', revenue: 152000 },
  { month: 'Nov', revenue: 178000 },
  { month: 'Dec', revenue: 195000 },
  { month: 'Jan', revenue: 212000 },
];

const patientVisitsData = [
  { name: 'New Patients', value: 156 },
  { name: 'Follow-ups', value: 342 },
  { name: 'Emergency', value: 45 },
];

const doctorPerformance = [
  { name: 'Dr. Sarah Johnson', consultations: 247, revenue: 98800, rating: 4.8 },
  { name: 'Dr. Michael Chen', consultations: 312, revenue: 124800, rating: 4.9 },
  { name: 'Dr. Priya Sharma', consultations: 186, revenue: 74400, rating: 4.7 },
  { name: 'Dr. Rajesh Kumar', consultations: 142, revenue: 56800, rating: 4.6 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export function ReportsAnalytics({ userRole }: ReportsAnalyticsProps) {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('overview');

  const exportReport = (format: 'pdf' | 'excel') => {
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and data exports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export PDF
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex gap-2">
          {['overview', 'appointments', 'earnings', 'doctors', 'inventory'].map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                reportType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">168</p>
          <p className="text-sm text-gray-600">Total Appointments</p>
          <p className="text-xs text-green-600 mt-2">+12% from last week</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹2,12,000</p>
          <p className="text-sm text-gray-600">Monthly Revenue</p>
          <p className="text-xs text-green-600 mt-2">+15% from last month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">543</p>
          <p className="text-sm text-gray-600">Patient Visits</p>
          <p className="text-xs text-green-600 mt-2">+8% from last period</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50">
              <Stethoscope className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">4.75</p>
          <p className="text-sm text-gray-600">Avg. Doctor Rating</p>
          <p className="text-xs text-gray-500 mt-2">Based on patient feedback</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Appointments */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Daily Appointments</h3>
              <p className="text-sm text-gray-600">Last 7 days trend</p>
            </div>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyAppointments}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Monthly Revenue</h3>
              <p className="text-sm text-gray-600">Last 7 months</p>
            </div>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Visit Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Patient Visit Distribution</h3>
              <p className="text-sm text-gray-600">By category</p>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={patientVisitsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {patientVisitsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Doctor Performance */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Doctor Performance</h3>
              <p className="text-sm text-gray-600">By consultations</p>
            </div>
            <Stethoscope className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={doctorPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
              <Tooltip />
              <Bar dataKey="consultations" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Reports Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Doctor Performance Report</h3>
          <p className="text-sm text-gray-600">Detailed metrics by doctor</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consultations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {doctorPerformance.map((doctor, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{doctor.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.consultations}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{doctor.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-yellow-600">{doctor.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(doctor.consultations / 350) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{Math.round((doctor.consultations / 350) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Standard Reports List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Standard Reports</h3>
          <p className="text-sm text-gray-600">Pre-configured report templates</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Daily Appointments Report', description: 'All appointments for selected date' },
              { name: 'Patient Visits Summary', description: 'Visit history and patterns' },
              { name: 'Doctor Performance Report', description: 'Consultations and ratings' },
              { name: 'Monthly Earnings Summary', description: 'Revenue breakdown by source' },
              { name: 'Inventory Status Report', description: 'Stock levels and alerts' },
              { name: 'Payment Collection Report', description: 'Payments received and pending' },
            ].map((report, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <button className="text-gray-400 hover:text-blue-600">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{report.name}</h4>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
