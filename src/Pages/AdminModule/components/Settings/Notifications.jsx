import { useState, useEffect, useCallback } from "react";
import {
  // Only include icons actually used in the component
  Bell,
  Settings,
  MessageSquare,
  Info,
  Search,
  MoreVertical,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  Trash2,
  SendHorizonal,
  User,
  Clock,
  Tag,
  Ticket,
  Mail,
  Phone,
  DollarSign,
  Sliders,
  Edit,
  Copy,
  Code
} from "lucide-react";
import { sampleNotifications, sampleTickets } from "../jsondatamap/mockData";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [tickets, setTickets] = useState(sampleTickets);
  const [filter, setFilter] = useState("all");
  const [ticketFilter, setTicketFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [ticketStatusUpdate, setTicketStatusUpdate] = useState("");
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [testNotificationStatus, setTestNotificationStatus] = useState({ show: false, eventType: '', message: '' });
  const [templateEditMode, setTemplateEditMode] = useState(null);
  const [editedTemplates, setEditedTemplates] = useState({});
  const [copySuccess, setCopySuccess] = useState('');


  const [apiEndpoints, setApiEndpoints] = useState({
    baseUrl: 'https://api.luxuryyachts.com',
    notificationsPath: '/api/notifications',
    templatesPath: '/api/notification-templates',
    webhookPath: '/api/webhook',
  });
  
  const [apiIntegrations, setApiIntegrations] = useState({
    sms: {
      provider: 'twilio',
      enabled: true
    },
    email: {
      provider: 'sendgrid',
      enabled: true
    },
    push: {
      provider: 'firebase',
      enabled: false
    }
  });

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiTestStatus, setApiTestStatus] = useState({ success: null, message: '' });

  // Initial notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    newBooking: {
      admin: ["email", "inApp"],
      owner: ["email", "sms"],
      user: ["email"],
      frequency: "immediately",
      templates: {
        email: {
          subject: "🛥️ New Yacht Booking Confirmation",
          body: `A new booking has been confirmed.

Yacht: {{yacht_name}}
Customer: {{customer_name}}
Dates: {{start_date}} - {{end_date}}
Total Amount: $99.99

Please check your dashboard for full details.`
        },
        sms: {
          body: "New booking confirmed: {{yacht_name}} booked by {{customer_name}} from {{start_date}} to {{end_date}}. Amount: $99.99"
        },
        inApp: {
          body: "New yacht booking: {{customer_name}} reserved {{yacht_name}}."
        }
      }
    },
    bookingCancelled: {
      admin: ["email"],
      owner: ["email", "inApp"],
      user: ["email", "sms"],
      frequency: "immediately",
      templates: {
        email: {
          subject: "⚠️ Booking Cancellation Notice",
          body: `A booking has been cancelled.

Booking ID: #{{booking_id}}
Yacht: {{yacht_name}}
Cancellation Reason: {{reason}}
Refund Amount: $99.99

The customer has been notified about this cancellation.`
        },
        sms: {
          body: "Booking #{{booking_id}} for {{yacht_name}} has been cancelled. Refund of $99.99 has been processed."
        },
        inApp: {
          body: "Booking cancelled: {{yacht_name}} reservation has been cancelled."
        }
      }
    },
    payoutRequest: {
      admin: ["email", "inApp"],
      owner: ["email"],
      frequency: "immediately",
      templates: {
        email: {
          subject: "💰 Payout Request Received",
          body: `A payout request has been submitted.

Owner: {{owner_name}}
Amount: $99.99
Payment Method: {{method}}
Request Date: {{date}}

Please process this request within 48 hours.`
        },
        sms: {
          body: "Your payout request for $99.99 has been received and is being processed."
        },
        inApp: {
          body: "Payout request: $99.99 requested by {{owner_name}}."
        }
      }
    },
    paymentFailed: {
      user: ["email", "sms"],
      frequency: "immediately",
      templates: {
        email: {
          subject: "❌ Payment Failure Alert",
          body: `A payment transaction has failed.

Booking ID: #{{booking_id}}
Amount: $99.99
Error: {{error_message}}
Date: {{date}}

Please update your payment information and try again.`
        },
        sms: {
          body: "Payment failed: Your payment of $99.99 for booking #{{booking_id}} was unsuccessful. Please update your payment method."
        },
        inApp: {
          body: "Payment failed: Transaction of $99.99 for booking #{{booking_id}} was declined."
        }
      }
    },
  });

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate fetching new data
        console.log("Fetching new data...");
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Success message timeout
  useEffect(() => {
    if (savedSuccessfully) {
      const timer = setTimeout(() => {
        setSavedSuccessfully(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [savedSuccessfully]);

  // Initialize edited templates
  useEffect(() => {
    if (templateEditMode) {
      setEditedTemplates(prevState => ({
        ...prevState,
        [templateEditMode]: { 
          ...notificationSettings[templateEditMode].templates 
        }
      }));
    }
  }, [templateEditMode, notificationSettings]);

  // Notification functions
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Ticket functions
  const handleTicketStatusChange = (ticketId, newStatus) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            status: newStatus,
            updatedAt: new Date().toISOString(),
            comments: [
              ...ticket.comments,
              {
                id: ticket.comments.length + 1,
                text: `Status updated to ${newStatus}`,
                createdBy: { id: 999, name: "System" },
                createdAt: new Date().toISOString()
              }
            ]
          }
        : ticket
    ));
  };

  const addCommentToTicket = (ticketId, comment) => {
    if (!comment.trim()) return;
    
    setTickets(prev => prev.map(ticket =>
      ticket.id === ticketId
        ? {
            ...ticket,
            updatedAt: new Date().toISOString(),
            comments: [
              ...ticket.comments,
              {
                id: ticket.comments.length + 1,
                text: comment,
                createdBy: { id: 999, name: "Support Agent" },
                createdAt: new Date().toISOString()
              }
            ]
          }
        : ticket
    ));
    setNewComment("");
  };

  // Notification settings functions
  const toggleNotificationChannel = (eventType, role, channel) => {
    setNotificationSettings(prev => {
      const currentSettings = { ...prev };
      
      // Initialize the role array if it doesn't exist
      if (!currentSettings[eventType][role]) {
        currentSettings[eventType][role] = [];
      }
      
      // Toggle the channel
      if (currentSettings[eventType][role].includes(channel)) {
        currentSettings[eventType][role] = currentSettings[eventType][role].filter(c => c !== channel);
      } else {
        currentSettings[eventType][role].push(channel);
      }
      
      return currentSettings;
    });
  };

  const saveNotificationSettings = useCallback(async () => {
    try {
      setIsSaving(true);
      
      // In a real app, this would be an API call
    console.log("Saving notification settings:", notificationSettings);
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success!
    setSavedSuccessfully(true);
      setIsSaving(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSavedSuccessfully(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error saving settings:", error);
      setIsSaving(false);
      // Would show an error message in a real app
    }
  }, [notificationSettings]);

  // Test notification function
  const testNotification = (eventType) => {
    // This would actually send a test notification in a real app
    console.log(`Sending test notification for ${eventType}`);
    
    // Add test notification to notifications list
    const newNotification = {
      id: Date.now(),
      type: eventTypeInfo[eventType].title,
      message: `Test ${eventTypeInfo[eventType].title.toLowerCase()} notification`,
      severity: eventType === 'paymentFailed' ? 'critical' : 
                eventType === 'bookingCancelled' ? 'warning' :
                eventType === 'payoutRequest' ? 'success' : 'info',
      date: new Date().toISOString(),
      read: false
    };
    
    // Add to notification list
    setNotifications(prev => [newNotification, ...prev]);
    
    // Switch to notifications tab to show the user the result immediately
    setActiveTab("notifications");
    
    // Show success message
    setTestNotificationStatus({
      show: true,
      eventType: eventType,
      message: `Test notification created and added to your notifications list`
    });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setTestNotificationStatus({ show: false, eventType: '', message: '' });
    }, 5000);
  };

  // Frequency options
  const frequencyOptions = [
    { value: "immediately", label: "Immediately" },
    { value: "hourly_digest", label: "Hourly Digest" },
    { value: "daily_digest", label: "Daily Digest" },
    { value: "weekly_digest", label: "Weekly Digest" }
  ];

  const handleFrequencyChange = (eventType, frequency) => {
    setNotificationSettings(prev => {
      const currentSettings = { ...prev };
      currentSettings[eventType].frequency = frequency;
      return currentSettings;
    });
  };

  // Filter functions
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read;
    if (filter === "critical") return notification.severity === "critical";
    if (filter === "warning") return notification.severity === "warning";
    return true;
  }).filter(notification =>
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTickets = tickets.filter(ticket => {
    if (ticketFilter === "open") return ticket.status === "open";
    if (ticketFilter === "in_progress") return ticket.status === "in_progress";
    if (ticketFilter === "urgent") return ticket.priority === "urgent";
    return true;
  }).filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Event type descriptions and icons
  const eventTypeInfo = {
    newBooking: {
      title: "New Booking",
      description: "When a user books a yacht",
      icon: <DollarSign className="w-6 h-6 text-blue-600" />
    },
    bookingCancelled: {
      title: "Booking Cancelled",
      description: "When a booking is cancelled",
      icon: <AlertCircle className="w-6 h-6 text-red-600" />
    },
    payoutRequest: {
      title: "Payout Request",
      description: "When an owner requests a payout",
      icon: <DollarSign className="w-6 h-6 text-green-600" />
    },
    paymentFailed: {
      title: "Payment Failed",
      description: "When a payment transaction fails",
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />
    }
  };

  // Role descriptions and which roles apply to which event types
  const roleInfo = {
    admin: { title: "Admin", description: "Platform administrators" },
    owner: { title: "Owner", description: "Yacht owners" },
    user: { title: "User", description: "Customers who book yachts" }
  };

  // Check if a role should be shown for an event type
  // For example, payment failed only affects users
  const shouldShowRoleForEvent = (eventType, role) => {
    if (eventType === "paymentFailed" && (role === "admin" || role === "owner")) {
      return false;
    }
    if (eventType === "payoutRequest" && role === "user") {
      return false;
    }
    return true;
  };

  // Handle template changes
  const handleTemplateChange = (eventType, channel, field, value) => {
    setEditedTemplates(prevState => ({
      ...prevState,
      [eventType]: {
        ...prevState[eventType],
        [channel]: {
          ...prevState[eventType][channel],
          [field]: value
        }
      }
    }));
  };

  // Save edited templates
  const saveTemplateChanges = (eventType) => {
    setNotificationSettings(prevState => ({
      ...prevState,
      [eventType]: {
        ...prevState[eventType],
        templates: editedTemplates[eventType]
      }
    }));
    setTemplateEditMode(null);
  };

  // Cancel template edit
  const cancelTemplateEdit = () => {
    setTemplateEditMode(null);
    setEditedTemplates({});
  };

  // Copy template to clipboard
  const copyTemplateToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy template: ', err);
      });
  };

  // Show available placeholders for templates
  const getPlaceholders = (eventType) => {
    const commonPlaceholders = ['{firstName}', '{lastName}', '{userName}', '{date}'];
    
    // Add specific placeholders based on event type
    switch(eventType) {
      case 'newBooking':
      case 'bookingCancelled':
        return [...commonPlaceholders, '{bookingId}', '{yachtName}', '{startDate}', '{endDate}', '{totalAmount}'];
      case 'paymentFailed':
      case 'payoutRequest':
        return [...commonPlaceholders, '{transactionId}', '{totalAmount}', '{currency}'];
      default:
        return commonPlaceholders;
    }
  };

  // Test API connection
  const testApiConnection = async () => {
    try {
      setApiTestStatus({ success: null, message: 'Testing connection...' });
      
      // In a real app, this would be an actual API test
      console.log("Testing API connection to:", apiEndpoints.baseUrl);
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      setApiTestStatus({ 
        success: true, 
        message: 'API connection successful!' 
      });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setApiTestStatus({ success: null, message: '' });
      }, 5000);
      
    } catch (error) {
      console.error("API connection failed:", error);
      setApiTestStatus({ 
        success: false, 
        message: `Connection failed: ${error.message}` 
      });
    }
  };

  // Handle API endpoint change
  const handleApiEndpointChange = (field, value) => {
    setApiEndpoints(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle provider enabled state
  const toggleProviderEnabled = (provider) => {
    setApiIntegrations(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        enabled: !prev[provider].enabled
      }
    }));
  };

  // Update provider
  const updateProvider = (channel, providerName) => {
    setApiIntegrations(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        provider: providerName
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Notification Center
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg text-sm ${
                autoRefresh ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <RefreshCw className="w-4 h-4 inline-block mr-2" />
              {autoRefresh ? "Auto Refresh On" : "Enable Auto Refresh"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-4 border-b">
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2 font-medium ${
              activeTab === "notifications"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Bell className="w-4 h-4 inline-block mr-2" />
            Notifications ({notifications.filter(n => !n.read).length})
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-4 py-2 font-medium ${
              activeTab === "tickets"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Ticket className="w-4 h-4 inline-block mr-2" />
            Support Tickets ({tickets.filter(t => t.status === "open").length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 font-medium ${
              activeTab === "settings"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Settings className="w-4 h-4 inline-block mr-2" />
            Notification Settings
          </button>
        </div>

        {/* Search & Filter - Only show for notifications and tickets tabs */}
        {activeTab !== "settings" && (
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-1/2">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="w-full bg-transparent outline-none pl-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab === "notifications" ? (
              <div className="flex gap-2 w-1/2 justify-end">
                <select
                  className="px-3 py-2 border rounded-lg bg-white w-48"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warnings</option>
                </select>
                <button
                  onClick={markAllAsRead}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <CheckCircle className="w-5 h-5 mr-1.5" />
                  Mark Read
                </button>
                <button
                  onClick={clearNotifications}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <Trash2 className="w-5 h-5 mr-1.5" />
                  Clear
                </button>
              </div>
            ) : (
              <div className="flex gap-2 w-1/2 justify-end">
                <select
                  className="px-3 py-2 border rounded-lg bg-white w-48"
                  value={ticketFilter}
                  onChange={(e) => setTicketFilter(e.target.value)}
                >
                  <option value="all">All Tickets</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="mt-6 space-y-4">
          {activeTab === "notifications" ? (
            // Notifications List
            filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${
                    notification.read ? "bg-gray-50" : "bg-blue-50"
                  } flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    {notification.severity === "critical" && (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    {notification.severity === "warning" && (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                    {notification.severity === "success" && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {notification.severity === "info" && (
                      <Bell className="w-5 h-5 text-blue-600" />
                    )}
                    <div>
                      <p className="text-gray-800 font-medium">
                        {notification.message}
                      </p>
                      <span className="text-gray-500 text-sm">
                        {new Date(notification.date).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n.id === notification.id ? { ...n, read: true } : n
                          )
                        )
                      }
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No notifications available.</p>
            )
          ) : activeTab === "tickets" ? (
            // Tickets List
            filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          ticket.priority === "urgent"
                            ? "bg-red-100"
                            : ticket.priority === "high"
                            ? "bg-orange-100"
                            : "bg-blue-100"
                        }`}
                      >
                        <Ticket className={`w-5 h-5 ${
                          ticket.priority === "urgent"
                            ? "text-red-600"
                            : ticket.priority === "high"
                            ? "text-orange-600"
                            : "text-blue-600"
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {ticket.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {ticket.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center text-sm text-gray-500">
                            <User className="w-4 h-4 mr-1" />
                            {ticket.createdBy.name}
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {ticket.comments.length} comments
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        ticket.status === "open"
                          ? "bg-green-100 text-green-800"
                          : ticket.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : ticket.status === "resolved"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {ticket.status.replace("_", " ")}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowTicketModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No tickets available.</p>
            )
          ) : (
            // Notification Settings
            <div className="space-y-6">
              {/* Success Notification */}
              {savedSuccessfully && (
                <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Notification settings saved successfully!</span>
                </div>
              )}
              
              {/* Settings Header and Description */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Notification Preferences
                </h3>
                <p className="text-blue-700">
                  Configure who receives notifications for different events and through which channels.
                </p>
              </div>
              
              {/* Notification Settings Cards */}
              <div className="space-y-6">
                {Object.keys(notificationSettings).map(eventType => (
                  <div key={eventType} className="border rounded-lg overflow-hidden">
                    {/* Event Header */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 border-b">
                      {eventTypeInfo[eventType].icon}
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-800">
                          {eventTypeInfo[eventType].title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {eventTypeInfo[eventType].description}
                        </p>
                      </div>
                      <button
                        onClick={() => testNotification(eventType)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 text-sm"
                        title="Send test notification to see how it appears"
                      >
                        <SendHorizonal className="w-4 h-4" />
                        Test
                      </button>
                    </div>
                    
                    {/* Test Notification Status */}
                    {testNotificationStatus.show && testNotificationStatus.eventType === eventType && (
                      <div className="m-4 p-3 bg-blue-50 text-blue-700 rounded-lg flex items-start gap-2 text-sm">
                        <Info className="w-5 h-5 mt-0.5 text-blue-500" />
                        <div>
                          <p className="font-medium">{testNotificationStatus.message}</p>
                          <p className="mt-1">Check the Notifications tab to view the test notification.</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Recipients and Channels */}
                    <div className="p-4">
                      {/* Frequency Selector */}
                      <div className="mb-4 pb-4 border-b">
                        <label className="flex items-center justify-between text-gray-800 font-medium">
                          <span>Notification Frequency:</span>
                          <select 
                            value={notificationSettings[eventType].frequency || "immediately"}
                            onChange={(e) => handleFrequencyChange(eventType, e.target.value)}
                            className="px-3 py-2 border rounded-lg bg-white ml-3 text-sm"
                          >
                            {frequencyOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                          {notificationSettings[eventType].frequency === "immediately" 
                            ? "Notifications will be sent as soon as events occur." 
                            : `Notifications will be grouped into a ${notificationSettings[eventType].frequency.replace('_', ' ')}.`}
                        </p>
                      </div>
                      
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="text-left">
                            <th className="py-2 pl-2 pr-4 text-gray-600 w-40">Recipient</th>
                            <th className="p-2 text-gray-600">
                              <div className="flex items-center gap-6">
                                <span className="w-20">Email</span>
                                <span className="w-20">SMS</span>
                                <span className="w-20">In-App</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(roleInfo).map(role => (
                            shouldShowRoleForEvent(eventType, role) && (
                              <tr key={role} className="border-t">
                                <td className="py-3 pl-2 pr-4">
                                  <div>
                                    <div className="font-medium text-gray-800">{roleInfo[role].title}</div>
                                    <div className="text-xs text-gray-500">{roleInfo[role].description}</div>
                                  </div>
                                </td>
                                <td className="p-2">
                                  <div className="flex items-center gap-4">
                                    {/* Email */}
                                    <label className="flex items-center gap-2 w-20 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={notificationSettings[eventType][role]?.includes("email") || false}
                                        onChange={() => toggleNotificationChannel(eventType, role, "email")}
                                        className="w-4 h-4 rounded"
                                      />
                                      <Mail className="w-4 h-4 text-gray-500" />
                                    </label>
                                    
                                    {/* SMS */}
                                    <label className="flex items-center gap-2 w-20 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={notificationSettings[eventType][role]?.includes("sms") || false}
                                        onChange={() => toggleNotificationChannel(eventType, role, "sms")}
                                        className="w-4 h-4 rounded"
                                      />
                                      <Phone className="w-4 h-4 text-gray-500" />
                                    </label>
                                    
                                    {/* In-App */}
                                    <label className="flex items-center gap-2 w-20 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={notificationSettings[eventType][role]?.includes("inApp") || false}
                                        onChange={() => toggleNotificationChannel(eventType, role, "inApp")}
                                        className="w-4 h-4 rounded"
                                      />
                                      <Bell className="w-4 h-4 text-gray-500" />
                                    </label>
                                  </div>
                                </td>
                              </tr>
                            )
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Save Configuration Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    // Call the saveNotificationSettings function
                    setIsSaving(true);
                    
                    // Simulate API latency
                    setTimeout(() => {
                      setSavedSuccessfully(true);
                      setIsSaving(false);
                      
                      // Hide success message after 3 seconds
                      setTimeout(() => {
                        setSavedSuccessfully(false);
                      }, 3000);
                    }, 1000);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Configuration
                    </>
                  )}
                </button>
              </div>
              
              {/* Add Advanced Settings Section */}
                <div className="mt-8">
                <button
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    className="flex items-center gap-2 text-gray-700 font-medium mb-4"
                    type="button"
                  >
                    <Sliders className="w-5 h-5 text-gray-600" />
                    Advanced Settings
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded ml-2">
                      {showAdvancedSettings ? 'Hide' : 'Show'}
                    </span>
                </button>
                  
                  {showAdvancedSettings && (
                    <div className="space-y-6 border rounded-lg p-6 bg-gray-50">
                    {/* Notification Templates Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Mail className="w-5 h-5 text-blue-600" />
                          Email Templates
                        </h3>
                        
                        <div className="space-y-4 border rounded-lg p-4 bg-white">
                          <div className="flex items-center gap-2 mb-3">
                            <Info className="w-5 h-5 text-blue-500" />
                            <p className="text-sm text-blue-700">
                              Edit notification templates for each event type.
                            </p>
                          </div>
                          
                          {/* Template Selection */}
                          <div className="grid md:grid-cols-1 gap-4">
                                {Object.keys(notificationSettings).map(eventType => (
                              <div key={`template-${eventType}`} className="border rounded-lg overflow-hidden">
                                {/* Template Header */}
                                <div className="flex items-center justify-between gap-2 p-4 bg-gray-50 border-b">
                                  <div className="flex items-center gap-2">
                                    {eventTypeInfo[eventType].icon}
                                    <h4 className="font-medium text-gray-800">
                                      {eventTypeInfo[eventType].title} Templates
                                    </h4>
                                </div>
                                  {templateEditMode === eventType ? (
                                    <div className="flex items-center gap-2">
                                <button 
                                        onClick={() => saveTemplateChanges(eventType)}
                                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                        type="button"
                                      >
                                        <CheckCircle className="w-4 h-4" /> Save
                                </button>
                                      <button
                                        onClick={cancelTemplateEdit}
                                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                        type="button"
                                      >
                                        <AlertCircle className="w-4 h-4" /> Cancel
                                      </button>
                                  </div>
                                  ) : (
                                    <button
                                      onClick={() => setTemplateEditMode(eventType)}
                                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                      type="button"
                                    >
                                      <Edit className="w-4 h-4" /> Edit Templates
                                    </button>
                                  )}
                            </div>
                            
                                {/* Template Content */}
                                <div className="p-4">
                                  {/* Placeholders Help */}
                                  {templateEditMode === eventType && (
                                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Code className="w-4 h-4 text-blue-500" />
                                        <span className="font-medium text-blue-700">Available Placeholders:</span>
                                </div>
                                      <div className="flex flex-wrap gap-2">
                                        {getPlaceholders(eventType).map(placeholder => (
                                          <span 
                                            key={placeholder} 
                                            className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded cursor-pointer hover:bg-blue-200"
                                            onClick={() => copyTemplateToClipboard(placeholder)}
                                            title="Click to copy"
                                          >
                                            {placeholder}
                                          </span>
                                        ))}
                                    </div>
                                      {copySuccess && (
                                        <span className="text-green-600 text-xs mt-1 inline-block">{copySuccess}</span>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Email Templates */}
                                  {(notificationSettings[eventType].admin?.includes('email') || 
                                    notificationSettings[eventType].owner?.includes('email') || 
                                    notificationSettings[eventType].user?.includes('email')) && (
                                    <div className="mb-4 pb-4 border-b">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-medium text-gray-700">Email Template</h5>
                                        {!templateEditMode && (
                                          <button 
                                            onClick={() => copyTemplateToClipboard(
                                              `Subject: ${notificationSettings[eventType].templates.email.subject}\n\n${notificationSettings[eventType].templates.email.body}`
                                            )}
                                            className="text-blue-600 flex items-center gap-1 text-sm"
                                            title="Copy template"
                                            type="button"
                                          >
                                            <Copy className="w-3.5 h-3.5" /> Copy
                                          </button>
                                        )}
                                      </div>
                                      
                                      {templateEditMode === eventType ? (
                                        <div className="space-y-3">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                                            <input
                                              type="text"
                                              value={editedTemplates[eventType]?.email.subject || ''}
                                              onChange={(e) => handleTemplateChange(eventType, 'email', 'subject', e.target.value)}
                                              className="w-full p-2 border rounded-md text-sm"
                                            />
                                    </div>
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Body:</label>
                                            <textarea
                                              value={editedTemplates[eventType]?.email.body || ''}
                                              onChange={(e) => handleTemplateChange(eventType, 'email', 'body', e.target.value)}
                                              className="w-full p-2 border rounded-md h-32 text-sm font-mono"
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="space-y-2">
                                          <div className="bg-gray-50 p-2 rounded-md text-sm">
                                            <strong>Subject:</strong> {notificationSettings[eventType].templates.email.subject}
                                          </div>
                                          <div className="bg-gray-50 p-3 rounded-md whitespace-pre-wrap text-sm font-mono">
                                            {notificationSettings[eventType].templates.email.body}
                                          </div>
                                        </div>
                                )}
                              </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* System Settings Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Notification System Settings</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Notification Retention Period (days)
                            </label>
                            <input
                              type="number"
                              className="w-full p-2 border rounded-md"
                              defaultValue={30}
                              min={1}
                              max={365}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              How long to keep notifications in the system before automatic cleanup
                            </p>
                              </div>
                                <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Batch Processing Size
                            </label>
                            <input
                              type="number"
                              className="w-full p-2 border rounded-md"
                              defaultValue={100}
                              min={10}
                              max={1000}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Number of notifications to process in a single batch
                            </p>
                                  </div>
                                </div>
                        
                        <div className="mt-4 space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded text-blue-600" defaultChecked={true} />
                            <span className="text-sm text-gray-700">Enable notification queueing for high volume periods</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded text-blue-600" defaultChecked={true} />
                            <span className="text-sm text-gray-700">Retry failed notifications automatically</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded text-blue-600" defaultChecked={true} />
                            <span className="text-sm text-gray-700">Log all notification events for debugging</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                                </div>
                              )}
                            </div>

        {/* Ticket Modal */}
        {showTicketModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Ticket Details
                </h2>
                                  <button 
                  onClick={() => {
                    setShowTicketModal(false);
                    setSelectedTicket(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{selectedTicket.title}</h3>
                  <p className="text-gray-600 mt-1">{selectedTicket.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedTicket.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedTicket.priority}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">Status</h4>
                    <select
                      value={ticketStatusUpdate || selectedTicket.status}
                      onChange={(e) => {
                        setTicketStatusUpdate(e.target.value);
                        handleTicketStatusChange(selectedTicket.id, e.target.value);
                      }}
                      className="px-2 py-1 text-sm border rounded-lg w-32"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-4">Comments</h4>
                  <div className="space-y-4 mb-4">
                    {selectedTicket.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700">
                            {comment.createdBy.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 border rounded-lg"
                    />
                    <button
                      onClick={() => addCommentToTicket(selectedTicket.id, newComment)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
              </div>
    </div>
  );
};

export default Notifications;