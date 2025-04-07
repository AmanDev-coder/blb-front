import { useState, useEffect, useRef } from "react";
import { 
  FaUser, FaEnvelope, FaPhone, FaLock, FaEdit, 
  FaShieldAlt, FaHistory, FaCheckCircle,
  FaIdCard, FaUserCog, FaKey, FaTimes, FaCamera,
  FaGlobe, FaCalendarAlt, FaMapMarkerAlt, FaUserShield, FaStar
} from "react-icons/fa";

// Sample admin data
const adminData = {
  id: "ADM001",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@bookluxuryboat.com",
  phone: "+1 (123) 456-7890",
  role: "Super Admin",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  joinDate: "2022-06-15",
  lastActive: "2024-03-31T09:15:00",
  address: "123 Marina Bay, Toronto, ON, Canada",
  timezone: "Eastern Time (ET)",
  language: "English",
  twoFactorEnabled: true,
  activity: [
    { id: 1, type: "login", date: "2024-03-31T09:15:00", details: "Logged in from Toronto, CA (Chrome/Windows)" },
    { id: 2, type: "user_update", date: "2024-03-30T14:22:00", details: "Updated yacht owner profile #YO5632" },
    { id: 3, type: "booking_approval", date: "2024-03-29T11:05:00", details: "Approved booking #BK78901" },
    { id: 4, type: "review_moderation", date: "2024-03-28T16:45:00", details: "Approved 3 new reviews" },
    { id: 5, type: "login", date: "2024-03-28T08:30:00", details: "Logged in from Toronto, CA (Safari/iOS)" }
  ],
  permissions: [
    { id: 1, name: "User Management", granted: true },
    { id: 2, name: "Booking Administration", granted: true },
    { id: 3, name: "Financial Operations", granted: true },
    { id: 4, name: "Content Management", granted: true },
    { id: 5, name: "System Configuration", granted: true },
    { id: 6, name: "API Access", granted: false },
    { id: 7, name: "Reports & Analytics", granted: true }
  ]
};

const ProfileComponent = () => {
  const [admin, setAdmin] = useState(adminData);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const avatarInputRef = useRef(null);

  // Initialize edit data when admin data changes
  useEffect(() => {
    setEditData({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phone: admin.phone,
      address: admin.address,
      timezone: admin.timezone,
      language: admin.language
    });
  }, [admin]);

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Set document title on component mount
  useEffect(() => {
    document.title = `Profile | ${admin.firstName} ${admin.lastName}`;
    return () => {
      document.title = 'Book Luxury Yachts Admin';
    };
  }, [admin.firstName, admin.lastName]);

  // Calculate profile completeness percentage
  const calculateProfileCompleteness = () => {
    const fields = [
      !!admin.firstName, 
      !!admin.lastName,
      !!admin.email,
      !!admin.phone,
      !!admin.address,
      !!admin.avatar,
      !!admin.timezone,
      !!admin.language,
      admin.twoFactorEnabled
    ];
    
    const filledFields = fields.filter(Boolean).length;
    const percentage = Math.round((filledFields / fields.length) * 100);
    return percentage;
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format datetime to readable string with time
  const formatDateTime = (dateTimeString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };
  
  // Handle profile picture change
  const handleAvatarClick = () => {
    avatarInputRef.current.click();
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, this would upload the file to a server
      // and then update the avatar URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdmin({
          ...admin,
          avatar: reader.result
        });
        setSuccessMessage("Profile picture updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Update form field values
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };
  
  // Save profile changes
  const saveProfileChanges = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAdmin({
        ...admin,
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        phone: editData.phone,
        address: editData.address,
        timezone: editData.timezone,
        language: editData.language
      });
      setIsEditing(false);
      setIsLoading(false);
      setSuccessMessage("Profile updated successfully!");
    }, 1000);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditData({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phone: admin.phone,
      address: admin.address,
      timezone: admin.timezone,
      language: admin.language
    });
    setIsEditing(false);
  };
  
  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  // Change password
  const changePassword = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords don't match!");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setSuccessMessage("Password changed successfully!");
    }, 1000);
  };

  // Get description for permissions
  const getPermissionDescription = (permissionName) => {
    const descriptions = {
      "User Management": "Create, update, and delete user accounts and profiles",
      "Booking Administration": "Manage bookings, reservations, and scheduling",
      "Financial Operations": "Process payments, refunds, and financial transactions",
      "Content Management": "Create, edit, and publish website content",
      "System Configuration": "Access and modify system settings and configurations",
      "API Access": "Access and use the system API for integrations",
      "Reports & Analytics": "View and export data reports and analytics"
    };
    
    return descriptions[permissionName] || "No description available";
  };
  
  // Toggle permission status
  const togglePermission = (id) => {
    if (admin.role !== 'Super Admin') {
      setErrorMessage("You don't have permission to modify these settings.");
      return;
    }
    
    const updatedPermissions = admin.permissions.map(permission => 
      permission.id === id 
        ? { ...permission, granted: !permission.granted } 
        : permission
    );
    
    setAdmin({
      ...admin,
      permissions: updatedPermissions
    });
    
    setSuccessMessage(`Permission "${admin.permissions.find(p => p.id === id).name}" updated successfully!`);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            {/* Profile Picture with Change Option */}
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white">
                <img 
                  src={admin.avatar} 
                  alt={`${admin.firstName} ${admin.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                title="Change Profile Picture"
              >
                <FaCamera size={16} />
              </button>
              <input 
                type="file" 
                ref={avatarInputRef} 
                onChange={handleAvatarChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            
            {/* Profile Info */}
            <div className="text-center md:text-left md:flex-1">
              <h1 className="text-3xl font-bold text-white">{admin.firstName} {admin.lastName}</h1>
              <div className="mt-2 flex flex-col md:flex-row md:items-center text-blue-100">
                <span className="flex items-center">
                  <FaIdCard className="mr-2" />
                  {admin.id}
                </span>
                <span className="mx-0 my-1 md:mx-3 md:my-0">•</span>
                <span className="flex items-center">
                  <FaUserShield className="mr-2" />
                  {admin.role}
                </span>
                <span className="mx-0 my-1 md:mx-3 md:my-0">•</span>
                <span className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  Joined {formatDate(admin.joinDate)}
                </span>
              </div>
              
              {/* New Profile Completeness Indicator */}
              <div className="mt-3 bg-blue-900 bg-opacity-30 rounded-full p-2 pr-3 w-full md:max-w-md">
                <div className="flex items-center">
                  <div className="text-xs text-blue-100 mr-2 whitespace-nowrap">Profile Completeness</div>
                  <div className="w-full bg-blue-900 bg-opacity-50 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${calculateProfileCompleteness()}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-green-300">{calculateProfileCompleteness()}%</div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 md:mt-0">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md shadow-sm hover:bg-blue-50 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={cancelEditing}
                    className="flex items-center px-4 py-2 bg-white text-red-600 rounded-md shadow-sm hover:bg-red-50 transition-colors"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={saveProfileChanges}
                    disabled={isLoading}
                    className={`flex items-center px-4 py-2 ${isLoading ? 'bg-blue-300' : 'bg-white'} text-blue-600 rounded-md shadow-sm hover:bg-blue-50 transition-colors`}
                  >
                    <FaCheckCircle className="mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-3 mx-4 mt-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaCheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 mx-4 mt-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaTimes className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 px-4 py-2">
        <nav className="-mb-px flex space-x-6">
          <button
            className={`${
              activeTab === 'personal'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => handleTabChange('personal')}
          >
            <FaUser className="mr-2" />
            Personal Info
          </button>
          
          <button
            className={`${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => handleTabChange('security')}
          >
            <FaShieldAlt className="mr-2" />
            Security
          </button>
          
          <button
            className={`${
              activeTab === 'activity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => handleTabChange('activity')}
          >
            <FaHistory className="mr-2" />
            Activity Log
          </button>
          
          <button
            className={`${
              activeTab === 'permissions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => handleTabChange('permissions')}
          >
            <FaUserCog className="mr-2" />
            Role & Permissions
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'personal' && (
          <div className="max-w-1xl mx-auto">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Personal Information</h2>
            
            {/* Profile Stats Section - New Modern Feature */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <FaCalendarAlt className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Account Age</h3>
                    <p className="text-lg font-bold text-gray-800">
                      {(() => {
                        const joinDate = new Date(admin.joinDate);
                        const now = new Date();
                        const diffTime = Math.abs(now - joinDate);
                        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
                        const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
                        return `${diffYears} ${diffYears === 1 ? 'year' : 'years'}, ${diffMonths} ${diffMonths === 1 ? 'month' : 'months'}`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-100 p-3 mr-4">
                    <FaUserShield className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Access Level</h3>
                    <p className="text-lg font-bold text-gray-800">{admin.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4 border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <FaHistory className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Last Active</h3>
                    <p className="text-lg font-bold text-gray-800">
                      {(() => {
                        const lastActive = new Date(admin.lastActive);
                        const now = new Date();
                        const diffTime = Math.abs(now - lastActive);
                        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                        if (diffHours < 1) return 'Just now';
                        if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
                        const diffDays = Math.floor(diffHours / 24);
                        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {isEditing ? (
              /* Edit Form */
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={editData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={editData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Address */}
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={editData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Timezone */}
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={editData.timezone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Eastern Time (ET)">Eastern Time (ET)</option>
                      <option value="Central Time (CT)">Central Time (CT)</option>
                      <option value="Mountain Time (MT)">Mountain Time (MT)</option>
                      <option value="Pacific Time (PT)">Pacific Time (PT)</option>
                      <option value="Alaska Time (AKT)">Alaska Time (AKT)</option>
                      <option value="Hawaii Time (HT)">Hawaii Time (HT)</option>
                    </select>
                  </div>
                  
                  {/* Language */}
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={editData.language}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="English">English</option>
                      <option value="French">French</option>
                      <option value="Spanish">Spanish</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <dl className="divide-y divide-gray-200">
                  {/* Name */}
                  <div className="px-4 py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaUser className="mr-2 text-gray-400" />
                      Full Name
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {admin.firstName} {admin.lastName}
                    </dd>
                  </div>
                  
                  {/* Email */}
                  <div className="px-4 py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaEnvelope className="mr-2 text-gray-400" />
                      Email Address
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {admin.email}
                    </dd>
                  </div>
                  
                  {/* Phone */}
                  <div className="px-4 py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaPhone className="mr-2 text-gray-400" />
                      Phone Number
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {admin.phone}
                    </dd>
                  </div>
                  
                  {/* Address */}
                  <div className="px-4 py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-gray-400" />
                      Address
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {admin.address}
                    </dd>
                  </div>
                  
                  {/* Timezone */}
                  <div className="px-4 py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaGlobe className="mr-2 text-gray-400" />
                      Timezone
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {admin.timezone}
                    </dd>
                  </div>
                  
                  {/* Language */}
                  <div className="px-4 py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaGlobe className="mr-2 text-gray-400" />
                      Language
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {admin.language}
                    </dd>
                  </div>
                  
                  {/* Join Date */}
                  <div className="px-4 py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      Join Date
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {formatDate(admin.joinDate)}
                    </dd>
                  </div>
                  
                  {/* Last Active */}
                  <div className="px-4 py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaHistory className="mr-2 text-gray-400" />
                      Last Active
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {formatDateTime(admin.lastActive)}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="max-w-1xl mx-auto">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Security Settings</h2>
            
            <div className="space-y-4">
              {/* Password Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200">
                  <div className="flex items-center">
                    <FaLock className="text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Password</h3>
                      <p className="text-sm text-gray-500">Update your password regularly to keep your account secure</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Change Password
                  </button>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-sm">
                  <div className="flex items-center text-gray-500">
                    <FaShieldAlt className="mr-2" />
                    Last changed: <span className="ml-1 text-gray-700 font-medium">3 months ago</span>
                  </div>
                </div>
              </div>
              
              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200">
                  <div className="flex items-center">
                    <FaShieldAlt className="text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <div className="relative inline-block w-14 h-8 mr-2">
                    <input
                      type="checkbox"
                      id="toggle-2fa"
                      className="sr-only"
                      checked={admin.twoFactorEnabled}
                      onChange={() => {
                        // In a real app, this would trigger a confirmation or setup flow
                        setAdmin({
                          ...admin,
                          twoFactorEnabled: !admin.twoFactorEnabled
                        });
                        setSuccessMessage(`Two-factor authentication ${!admin.twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`);
                      }}
                    />
                    <label
                      htmlFor="toggle-2fa"
                      className={`absolute top-0 left-0 w-14 h-8 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                        admin.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
                          admin.twoFactorEnabled ? 'transform translate-x-6' : ''
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50">
                  {admin.twoFactorEnabled ? (
                    <div className="flex items-center text-sm text-green-700">
                      <FaCheckCircle className="mr-2" />
                      Two-factor authentication is currently enabled
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Protect your account with an additional security layer requiring a verification code from your mobile device.
                    </div>
                  )}
                </div>
              </div>
              
              {/* API Keys */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200">
                  <div className="flex items-center">
                    <FaKey className="text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
                      <p className="text-sm text-gray-500">Manage API access for third-party integrations</p>
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Manage API Keys
                  </button>
                </div>
                <div className="px-4 py-3 bg-gray-50">
                  <div className="text-sm text-gray-500">
                    You have <span className="font-medium text-gray-700">2 active</span> API keys. API access requires administrator approval.
                  </div>
                </div>
              </div>
              
              {/* Recent Login Activity */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <FaHistory className="text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Recent Login Activity</h3>
                      <p className="text-sm text-gray-500">Monitor and verify your account access</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="px-4 py-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Toronto, CA</p>
                      <p className="text-xs text-gray-500">Chrome on Windows</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDateTime(admin.lastActive)}
                    </div>
                  </div>
                  <div className="px-4 py-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Toronto, CA</p>
                      <p className="text-xs text-gray-500">Safari on iOS</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      March 28, 2024, 8:30 AM
                    </div>
                  </div>
                  <div className="px-4 py-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Toronto, CA</p>
                      <p className="text-xs text-gray-500">Chrome on macOS</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      March 27, 2024, 1:45 PM
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Password Change Modal */}
            {showPasswordModal && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                    <button 
                      onClick={() => setShowPasswordModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <form onSubmit={changePassword}>
                    <div className="space-y-4">
                      {/* Current Password */}
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      {/* New Password */}
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      {/* Confirm New Password */}
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowPasswordModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      >
                        {isLoading ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div className="max-w-1xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-900">Activity Log</h2>
              
              <div className="flex space-x-2">
                <select
                  className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="all"
                >
                  <option value="all">All Activities</option>
                  <option value="login">Login Events</option>
                  <option value="user">User Management</option>
                  <option value="booking">Booking Actions</option>
                  <option value="review">Review Management</option>
                </select>
                
                <button
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaHistory className="mr-2" />
                  Export Log
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-700">Recent Activities</h3>
                  <span className="text-sm text-gray-500">Last 30 days</span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {admin.activity.map((activity) => (
                  <div key={activity.id} className="px-4 py-3">
                    <div className="flex items-start">
                      {/* Activity Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {activity.type === 'login' && (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <FaUser className="text-green-600" />
                          </div>
                        )}
                        {activity.type === 'user_update' && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaEdit className="text-blue-600" />
                          </div>
                        )}
                        {activity.type === 'booking_approval' && (
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <FaCheckCircle className="text-purple-600" />
                          </div>
                        )}
                        {activity.type === 'review_moderation' && (
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                            <FaStar className="text-yellow-600" />
                          </div>
                        )}
                      </div>
                      
                      {/* Activity Details */}
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {activity.type === 'login' && 'System Login'}
                            {activity.type === 'user_update' && 'User Profile Update'}
                            {activity.type === 'booking_approval' && 'Booking Approval'}
                            {activity.type === 'review_moderation' && 'Review Moderation'}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(activity.date)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{activity.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <button
                  className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Load More Activities
                </button>
              </div>
            </div>
            
            {/* Summary Stats */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-500">Total Logins</h4>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">147</p>
                      <p className="ml-2 text-sm text-green-600">+12%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <FaCheckCircle className="text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-500">Actions Taken</h4>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">528</p>
                      <p className="ml-2 text-sm text-green-600">+8%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <FaShieldAlt className="text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-500">Last Active</h4>
                    <div className="mt-1">
                      <p className="text-lg font-semibold text-gray-900">Just Now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'permissions' && (
          <div className="max-w-1xl mx-auto">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Role & Permissions</h2>
            
            {/* Admin Role Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <FaUserShield className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{admin.role}</h3>
                      <p className="text-sm text-gray-500">
                        This account has full system access with administrator privileges
                      </p>
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Request Role Change
                  </button>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaIdCard className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Role Assigned Since</span>
                  </div>
                  <span className="text-sm text-gray-700">{formatDate(admin.joinDate)}</span>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaShieldAlt className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Access Level</span>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    Level 3 (Highest)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Permissions Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">System Permissions</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Manage the specific permissions for your account
                </p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {admin.permissions.map((permission) => (
                  <div key={permission.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{permission.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {getPermissionDescription(permission.name)}
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        id={`permission-${permission.id}`}
                        className="sr-only"
                        checked={permission.granted}
                        disabled={admin.role !== 'Super Admin'}
                        onChange={() => togglePermission(permission.id)}
                      />
                      <label
                        htmlFor={`permission-${permission.id}`}
                        className={`absolute top-0 left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                          admin.role !== 'Super Admin' ? 'opacity-60' : ''
                        } ${
                          permission.granted ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                            permission.granted ? 'transform translate-x-6' : ''
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              
              {admin.role !== 'Super Admin' && (
                <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-100">
                  <div className="flex items-start">
                    <FaShieldAlt className="text-yellow-500 mt-0.5 mr-3" />
                    <p className="text-sm text-yellow-700">
                      Some permissions are controlled by your role. Contact the system administrator if you need additional access.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reset to Default
                  </button>
                  
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setSuccessMessage("Permissions updated successfully!")}
                  >
                    Save Permissions
                  </button>
                </div>
              </div>
            </div>
            
            {/* Role Comparison */}
            <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Role Comparison</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Compare different admin role capabilities
                </p>
              </div>
              
              <div className="px-4 py-3">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                          Capability
                        </th>
                        <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                          <div className="flex justify-center items-center">Super Admin</div>
                        </th>
                        <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                          <div className="flex justify-center items-center">Admin</div>
                        </th>
                        <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                          <div className="flex justify-center items-center">Moderator</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-3 py-2 text-sm text-gray-900">User Management</td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaCheckCircle className="text-green-600 text-lg" />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaCheckCircle className="text-green-600 text-lg" />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaTimes className="text-red-600 text-lg" />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-sm text-gray-900">System Configuration</td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaCheckCircle className="text-green-600 text-lg" />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaTimes className="text-red-600 text-lg" />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaTimes className="text-red-600 text-lg" />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-sm text-gray-900">Financial Operations</td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaCheckCircle className="text-green-600 text-lg" />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaCheckCircle className="text-green-600 text-lg" />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaTimes className="text-red-600 text-lg" />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-sm text-gray-900">Content Moderation</td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaCheckCircle className="text-green-600 text-lg" />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaCheckCircle className="text-green-600 text-lg" />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaCheckCircle className="text-green-600 text-lg" />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-sm text-gray-900">API Access</td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaCheckCircle className="text-green-600 text-lg" />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaCheckCircle className="text-green-600 text-lg" />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center items-center">
                          <FaTimes className="text-red-600 text-lg" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileComponent; 