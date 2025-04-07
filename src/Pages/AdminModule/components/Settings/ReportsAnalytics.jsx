import { useState, useEffect } from "react";
import {
  BarChart,
  Download,
  Share2,
  Bell,
  Settings,
  RefreshCw,
  BookOpen,
  Mail,
  Printer,
  Save,
  Clock
} from "lucide-react";
import { generateReport } from "../jsondatamap/reportsData.js";
import { downloadReport, emailReport, printReport } from "../../../../utils/exportUtils";

const ReportsAnalytics = () => {
  const [selectedReport, setSelectedReport] = useState("revenue");
  const [dateRange, setDateRange] = useState("last30days");
  const [emailReportOpen, setEmailReportOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState("5");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [loading, setLoading] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = window.setInterval(() => {
        refreshData();
      }, parseInt(refreshInterval) * 60 * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getDateRangeFormatted = () => {
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case 'last24hours':
        startDate = new Date(now);
        startDate.setHours(startDate.getHours() - 24);
        return `${startDate.toLocaleDateString()} - ${now.toLocaleDateString()}`;
      case 'last7days':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        return `${startDate.toLocaleDateString()} - ${now.toLocaleDateString()}`;
      case 'last30days':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        return `${startDate.toLocaleDateString()} - ${now.toLocaleDateString()}`;
      case 'lastQuarter':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 3);
        return `${startDate.toLocaleDateString()} - ${now.toLocaleDateString()}`;
      case 'ytd':
        startDate = new Date(now.getFullYear(), 0, 1); // January 1st of current year
        return `${startDate.toLocaleDateString()} - ${now.toLocaleDateString()}`;
      case 'custom':
        return `${new Date(customDateRange.startDate).toLocaleDateString()} - ${new Date(customDateRange.endDate).toLocaleDateString()}`;
      default:
        return 'All time';
    }
  };

  const handleGenerateReport = () => {
    console.log("Generating report for:", selectedReport, dateRange, exportFormat);
    const dateRangeFormatted = getDateRangeFormatted();
    
    // If custom date range, pass the actual dates to generateReport
    let reportDateRange = dateRange;
    if (dateRange === 'custom') {
      reportDateRange = {
        startDate: customDateRange.startDate,
        endDate: customDateRange.endDate
      };
    }
    
    const reportData = generateReport(selectedReport, reportDateRange);
    console.log("Report data:", reportData);
    
    // Process data based on report type to ensure proper numeric values
    if (Array.isArray(reportData.content) && reportData.content.length > 0) {
      // Common preprocessing for all report types
      console.log(`Processing ${selectedReport} report data for export...`);
      
      // Handle specific report types
      if (selectedReport === 'payouts') {
        // Ensure payouts data has the necessary properties and numeric values
        reportData.content = reportData.content.map(item => ({
          name: item.name || 'Unknown Owner',
          payout: Number(item.payout) || 0,
          yachts: Number(item.yachts) || 0,
          payoutDate: item.payoutDate || new Date().toISOString(),
          status: item.status || 'Pending',
          method: item.method || 'Bank Transfer'
        }));
        
        // Recalculate the total
        if (reportData.summary) {
          reportData.summary.total = reportData.content.reduce(
            (sum, item) => sum + (Number(item.payout) || 0), 0
          );
          console.log("Enhanced payouts total:", reportData.summary.total);
        }
      } else if (selectedReport === 'revenue') {
        // Ensure revenue data has proper numeric values
        reportData.content = reportData.content.map(item => ({
          month: item.month || '',
          amount: Number(item.amount) || 0,
          date: item.date || new Date().toISOString().split('T')[0]
        }));
        
        // Recalculate the total
        if (reportData.summary) {
          reportData.summary.total = reportData.content.reduce(
            (sum, item) => sum + (Number(item.amount) || 0), 0
          );
          console.log("Enhanced revenue total:", reportData.summary.total);
        }
      } else if (selectedReport === 'profitLoss') {
        // Ensure profit data has proper numeric values
        reportData.content = reportData.content.map(item => ({
          month: item.month || '',
          profit: Number(item.profit) || 0,
          date: item.date || new Date().toISOString().split('T')[0]
        }));
        
        // Recalculate the total
        if (reportData.summary) {
          reportData.summary.total = reportData.content.reduce(
            (sum, item) => sum + (Number(item.profit) || 0), 0
          );
          console.log("Enhanced profit total:", reportData.summary.total);
        }
      } else if (selectedReport === 'bookings') {
        // Ensure bookings data has proper numeric values
        reportData.content = reportData.content.map(item => ({
          date: item.date || new Date().toISOString().split('T')[0],
          count: Number(item.count) || 0,
          user: item.user || '',
          yacht: item.yacht || ''
        }));
        
        // Recalculate the total
        if (reportData.summary) {
          reportData.summary.total = reportData.content.reduce(
            (sum, item) => sum + (Number(item.count) || 0), 0
          );
        }
      } else if (selectedReport === 'transactions') {
        // Ensure transactions data has proper numeric values
        reportData.content = reportData.content.map(item => ({
          date: item.date || new Date().toISOString().split('T')[0],
          amount: Number(item.amount) || 0,
          type: item.type || 'deposit',
          transactionNumber: item.transactionNumber || '',
          user: item.user || '',
          yacht: item.yacht || '',
          transactionCode: item.transactionCode || '',
          status: item.status || 'Pending',
          phone: item.phone || ''
        }));
        
        // Recalculate the total
        if (reportData.summary) {
          reportData.summary.total = reportData.content.reduce(
            (sum, item) => sum + (Number(item.amount) || 0), 0
          );
        }
      } else if (selectedReport === 'users') {
        // Ensure users data has proper numeric values
        reportData.content = reportData.content.map(item => ({
          date: item.date || new Date().toISOString().split('T')[0],
          newUsers: Number(item.newUsers) || 0,
          name: item.name || '',
          email: item.email || '',
          contact: item.contact || '',
          status: item.status || 'Active',
          role: item.role || 'Customer',
          lastActive: item.lastActive || item.date || new Date().toISOString().split('T')[0]
        }));
        
        // Recalculate the total
        if (reportData.summary) {
          reportData.summary.total = reportData.content.reduce(
            (sum, item) => sum + (Number(item.newUsers) || 0), 0
          );
        }
      } else if (selectedReport === 'yachts') {
        // Ensure yacht data has proper numeric values for price
        reportData.content = reportData.content.map(item => ({
          name: item.name || 'Unnamed Yacht',
          owner: item.owner || 'Unknown Owner',
          price: Number(item.price) || 0,
          date: item.date || new Date().toISOString().split('T')[0],
          status: item.status || 'Available',
          location: item.location || '',
          capacity: Number(item.capacity) || 0
        }));
        
        // Calculate total yacht value if not already there
        if (reportData.summary && reportData.summary.total === undefined) {
          reportData.summary.total = reportData.content.reduce(
            (sum, item) => sum + (Number(item.price) || 0), 0
          );
        }
      } else if (selectedReport === 'yachtOwners') {
        // Ensure yacht owners data has proper numeric values
        reportData.content = reportData.content.map(item => ({
          name: item.name || 'Unknown Owner',
          yachts: Number(item.yachts) || 0,
          payout: Number(item.payout) || 0,
          email: item.email || '',
          contact: item.contact || '',
          location: item.location || '',
          revenue: item.revenue || '$0',
          status: item.status || 'Active',
          date: item.date || new Date().toISOString().split('T')[0]
        }));
        
        // Calculate total payout if not already there
        if (reportData.summary) {
          reportData.summary.total = reportData.content.reduce(
            (sum, item) => sum + (Number(item.payout) || 0), 0
          );
        }
      } else if (selectedReport === 'recentBookings') {
        // Ensure recent bookings data has proper numeric values
        reportData.content = reportData.content.map(item => ({
          id: item.id || '',
          customer: item.customer || '',
          yacht: item.yacht || '',
          date: item.date || new Date().toISOString().split('T')[0],
          duration: item.duration || '',
          amount: Number(item.amount) || 0,
          status: item.status || 'Pending'
        }));
        
        // Calculate total booking value if not already there
        if (reportData.summary) {
          reportData.summary.total = reportData.content.reduce(
            (sum, item) => sum + (Number(item.amount) || 0), 0
          );
        }
      }
      
      console.log("Enhanced data processing complete:", reportData.summary);
    }
    
    try {
      downloadReport(reportData, exportFormat, selectedReport, dateRangeFormatted);
    } catch (error) {
      console.error("Error in report generation:", error);
      alert("There was an error generating the report. Please try a different format.");
    }
  };

  const handleEmailReport = async () => {
    if (!emailAddress) return;
    setLoading(true);
    
    console.log("Preparing email report for:", selectedReport, dateRange);
    const dateRangeFormatted = getDateRangeFormatted();
    const reportData = generateReport(selectedReport, dateRange);
    
    try {
      await emailReport(emailAddress, reportData, selectedReport, dateRangeFormatted);
      setEmailReportOpen(false);
      setEmailAddress("");
      alert(`Report successfully sent to ${emailAddress}`);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert(`Failed to send email: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = () => {
    console.log("Printing report for:", selectedReport, dateRange);
    const dateRangeFormatted = getDateRangeFormatted();
    const reportData = generateReport(selectedReport, dateRange);
    printReport(reportData, selectedReport, dateRangeFormatted);
  };

  const handleViewDocumentation = () => {
    window.open('/documentation', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BarChart className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Reports & Analytics
                </h1>
                <p className="text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Settings"
                onClick={() => alert("Settings panel coming soon!")}
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Notifications"
                onClick={() => alert("Notifications panel coming soon!")}
              >
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => alert("Share functionality coming soon!")}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6 border-b">
            {["overview"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Configuration */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Report Configuration
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Report Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="revenue">Revenue Analysis</option>
                    <option value="profitLoss">Profit & Loss</option>
                    <option value="bookings">Bookings & Orders</option>
                    <option value="transactions">Transaction Analysis</option>
                    <option value="users">Users Report</option>
                    <option value="yachts">Yachts Data</option>
                    <option value="yachtOwners">Yacht Owners Data</option>
                    <option value="payouts">Yacht Owners Payout</option>
                    <option value="recentBookings">Recent Bookings</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="last24hours">Last 24 Hours</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="lastQuarter">Last Quarter</option>
                    <option value="ytd">Year to Date</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </div>

              {/* Custom Date Range Selector (visible when custom is selected) */}
              {dateRange === 'custom' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-4">
                    Custom Date Range
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={customDateRange.startDate}
                        onChange={(e) => setCustomDateRange({...customDateRange, startDate: e.target.value})}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={customDateRange.endDate}
                        onChange={(e) => setCustomDateRange({...customDateRange, endDate: e.target.value})}
                        className="w-full px-3 py-2 border rounded"
                        min={customDateRange.startDate}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Export & Share
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Download Format */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Download className="w-5 h-5 text-blue-500" />
                    <h3 className="font-medium text-gray-700">
                      Export Format
                    </h3>
                  </div>
                  <div className="flex gap-3">
                    {["pdf", "excel", "csv"].map((format) => (
                      <button
                        key={format}
                        onClick={() => setExportFormat(format)}
                        className={`px-4 py-2 rounded ${
                          exportFormat === format
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-Refresh */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h3 className="font-medium text-gray-700">
                      Auto-Refresh
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(e.target.value)}
                      className="px-3 py-2 border rounded"
                      disabled={!autoRefresh}
                    >
                      <option value="1">Every minute</option>
                      <option value="5">Every 5 minutes</option>
                      <option value="15">Every 15 minutes</option>
                      <option value="30">Every 30 minutes</option>
                      <option value="60">Every hour</option>
                    </select>
                    <button
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`px-4 py-2 rounded ${
                        autoRefresh
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 border"
                      }`}
                    >
                      {autoRefresh ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <button 
                  onClick={() => setEmailReportOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
                >
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">Email Report</span>
                </button>
                <button 
                  onClick={handlePrintReport}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
                >
                  <Printer className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">Print Report</span>
                </button>
                <button 
                  onClick={handleViewDocumentation}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
                >
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">View Documentation</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={refreshData}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Save className="w-4 h-4" />
              Save Template
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button 
              onClick={handleGenerateReport}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Email Report Modal */}
      {emailReportOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Email Report</h3>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEmailReportOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailReport}
                disabled={!emailAddress || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;