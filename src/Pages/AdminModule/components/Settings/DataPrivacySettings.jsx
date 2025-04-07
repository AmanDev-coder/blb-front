import { useState } from "react";
import {
  ShieldCheck, ToggleLeft, ToggleRight, RefreshCw, Download, Trash2, AlertTriangle,
  Database, FileText, ClipboardList, CheckCircle, ChevronDown, Upload, Mail,
  Bell, Lock, Globe, ShieldAlert
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Sample Data Simulation
const privacySettings = {
  tracking: true,
  marketingEmails: true,
  dataSharing: false,
};

const backupStatus = {
  lastBackup: "March 25, 2025 - 10:30 AM",
  status: "Success",
};

const activityLogs = [
  { id: 1, type: "Booking Change", details: "User modified booking #3214", timestamp: "2025-03-23 14:32" },
  { id: 2, type: "Payout Issued", details: "Owner payout of $12,500 released", timestamp: "2025-03-23 10:15" },
  { id: 3, type: "Admin Login", details: "Admin logged in from New York", timestamp: "2025-03-22 18:50" },
];

const fraudAlerts = [
  { id: 1, issue: "Unusual large payout detected", status: "Pending Review" },
  { id: 2, issue: "Multiple failed transaction attempts", status: "Resolved" },
];

const DataPrivacy = () => {
  const [settings, setSettings] = useState(privacySettings);
  const [backup, setBackup] = useState(backupStatus);
  const [logs, setLogs] = useState(activityLogs);
  const [fraudReports, setFraudReports] = useState(fraudAlerts);
  const [exportFormat, setExportFormat] = useState("csv");
  const [showBackupHistory, setShowBackupHistory] = useState(false);
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);

  // Toggle privacy settings
  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  // Simulate API call for backup
  const handleBackup = () => {
    setBackup({ lastBackup: new Date().toLocaleString(), status: "Success" });
    // Add new log entry
    setLogs(prevLogs => [{
      id: prevLogs.length + 1,
      type: "Backup",
      details: "System backup completed successfully",
      timestamp: new Date().toLocaleString()
    }, ...prevLogs]);
  };

  // Export data based on selected format
  const exportData = () => {
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `privacy_data_${timestamp}`;
    
    let headers, csvContent, blob, link, ws, wb, doc;
    
    switch (exportFormat) {
      case "csv":
        headers = ["Type", "Details", "Timestamp"];
        csvContent = [
          headers.join(","),
          ...logs.map(log => [log.type, log.details, log.timestamp].join(","))
        ].join("\n");
        
        blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        link.click();
        break;

      case "excel":
        ws = XLSX.utils.json_to_sheet(logs);
        wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Activity Logs");
        XLSX.writeFile(wb, `${filename}.xlsx`);
        break;

      case "pdf":
        doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Privacy & Security Report", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
        
        // Add summary
        doc.setFontSize(12);
        doc.text("Summary", 14, 30);
        doc.setFontSize(10);
        doc.text(`Total Logs: ${logs.length}`, 14, 37);
        doc.text(`Pending Fraud Alerts: ${fraudReports.filter(alert => alert.status === "Pending Review").length}`, 14, 44);
        
        // Add table
        doc.autoTable({
          startY: 50,
          head: [['Type', 'Details', 'Timestamp']],
          body: logs.map(log => [log.type, log.details, log.timestamp]),
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235] },
          styles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 80 },
            2: { cellWidth: 40 }
          }
        });
        
        doc.save(`${filename}.pdf`);
        break;
    }
  };

  // Handle log deletion
  const handleDeleteLog = (logId) => {
    setLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
  };

  // Handle fraud alert resolution
  const handleResolveFraud = (alertId) => {
    setFraudReports(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, status: "Resolved" } : alert
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Data & Privacy Settings</h1>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Last Updated: {new Date().toLocaleString()}</span>
          </div>
        </div>

        {/* Privacy Preferences */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Privacy Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "tracking", label: "Enable Tracking & Analytics", icon: <Database className="w-4 h-4" /> },
              { key: "marketingEmails", label: "Receive Marketing Emails", icon: <Mail className="w-4 h-4" /> },
              { key: "dataSharing", label: "Allow Data Sharing with Partners", icon: <Globe className="w-4 h-4" /> },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <button
                  onClick={() => toggleSetting(item.key)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {settings[item.key] ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Backup & Restore</h2>
          <div className="p-3 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-700">Last Backup: {backup.lastBackup}</p>
                  <p className="text-xs text-gray-500">Status: {backup.status}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBackupHistory(!showBackupHistory)}
                  className="px-2 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  <ChevronDown className={`w-4 h-4 inline-block mr-1 ${showBackupHistory ? 'rotate-180' : ''}`} />
                  History
                </button>
                <button
                  onClick={handleBackup}
                  className="px-2 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4 inline-block mr-1" />
                  Backup Now
                </button>
              </div>
            </div>
            {showBackupHistory && (
              <div className="mt-3 p-2 bg-white rounded border">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Backups</h3>
                <div className="space-y-1">
                  {logs.filter(log => log.type === "Backup").map(log => (
                    <div key={log.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{log.details}</span>
                      <span className="text-gray-500">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Logs */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Activity & Security Logs</h2>
          <div className="bg-gray-100 p-3 rounded-lg">
            {logs.map((log) => (
              <div key={log.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{log.details}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{log.timestamp}</span>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fraud Detection */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Fraud Detection Alerts</h2>
          <div className="bg-gray-100 p-3 rounded-lg">
            {fraudReports.map((alert) => (
              <div key={alert.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-700">{alert.issue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${alert.status === "Pending Review" ? "text-red-600" : "text-green-600"}`}>
                    {alert.status}
                  </span>
                  {alert.status === "Pending Review" && (
                    <button
                      onClick={() => handleResolveFraud(alert.id)}
                      className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Export & Download */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Export & Compliance</h2>
          <div className="flex gap-1.5">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-1.5 py-1 text-xs border rounded-md bg-white w-20"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
            </select>
            <button
              onClick={exportData}
              className="px-1.5 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-0.5"
            >
              <Download className="w-3 h-3" />
              Export
            </button>
            <button
              onClick={() => setShowSecurityDetails(!showSecurityDetails)}
              className="px-1.5 py-1 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-0.5"
            >
              <ShieldAlert className="w-3 h-3" />
              Security
            </button>
          </div>
          {showSecurityDetails && (
            <div className="mt-2 p-2 bg-white rounded border">
              <h3 className="text-xs font-medium text-gray-700 mb-1.5">Security Overview</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-green-600" />
                  <span className="text-gray-600">Encryption: Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-gray-600">2FA: Enabled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-blue-600" />
                  <span className="text-gray-600">Audit Logs: Complete</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span className="text-gray-600">Backup Status: Up to date</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataPrivacy;
