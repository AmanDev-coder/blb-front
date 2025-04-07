import { useState } from 'react';
import { Settings, Moon, Sun, Globe, User, Bell, Shield, Power, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateSettings } from '../../../../Redux/adminReducer.js/action';
const defaultSettings = {
  platformName: "Yacht Booking Platform",
  adminName: "Admin", 
  maintenanceMode: false,
  darkMode: false,
  notifications: true,
  language: "en",
  securityLevel: "high"
};
const GeneralSettings = () => {
  const dispatch = useDispatch();

  const { settings, loading } = useSelector((state) => state.adminReducer);

  // Default values as fallback if API fails


  const [formData, setFormData] = useState(defaultSettings);

  useEffect(() => {
    // Fetch settings on component mount
    const loadSettings = async () => {
      try {
        const response = await dispatch(fetchSettings('general'));
        // Directly set the data, falling back to defaults if fields are missing
        setFormData( // Fallback values
          response.settings// Override with API data
        );
      } catch (error) {
        console.error("Error loading settings:", error);
        // Keep default values if API fails
      }
    };

    loadSettings();
  }, [dispatch]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSaveSettings = async () => {
    const btn = document.getElementById('saveBtn');

    try {
      // Show saving state
      if (btn) {
        btn.textContent = 'Saving...';
      }

      // Make API call to save settings
      await dispatch(updateSettings('general', formData));

      // Show success state
      if (btn) {
        btn.textContent = 'Saved!';
        setTimeout(() => {
          btn.textContent = 'Save Changes';
        }, 2000);
      }

    } catch (error) {
      console.error("Error saving settings:", error);
      
      // Show error state
      if (btn) {
        btn.textContent = 'Error Saving';
        setTimeout(() => {
          btn.textContent = 'Save Changes';
        }, 2000);
      }
    }
  };

 console.log(formData)
  return (
    
    <div className="min-h-screen bg-gray-50">
      <div className={`w-full mx-auto bg-white rounded-2xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-6 p-8">
          <Settings className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">General Settings</h1>
        </div>

        <p className="text-gray-600 mb-8 px-8">
          Manage your platform settings and preferences. Changes will be applied immediately.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Platform Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Platform Settings
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={formData.platformName}
                  onChange={(e) => handleChange('platformName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>

            {/* Admin Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Admin Settings
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Name
                </label>
                <input
                  type="text"
                  value={formData.adminName}
                  onChange={(e) => handleChange('adminName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* System Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Power className="w-5 h-5 text-blue-500" />
                System Settings
              </h2>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-700">Notifications</p>
                    <p className="text-sm text-gray-500">Receive system notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications}
                    onChange={() => handleChange('notifications', !formData.notifications)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {formData.darkMode ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-gray-600" />}
                  <div>
                    <p className="font-medium text-gray-700">Dark Mode</p>
                    <p className="text-sm text-gray-500">Toggle dark/light theme</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.darkMode}
                    onChange={() => handleChange('darkMode', !formData.darkMode)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-700">Security Level</p>
                    <p className="text-sm text-gray-500">Set system security level</p>
                  </div>
                </div>
                <select
                  value={formData.securityLevel}
                  onChange={(e) => handleChange('securityLevel', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Power className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-700">Maintenance Mode</p>
                    <p className="text-sm text-gray-500">Enable system maintenance</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.maintenanceMode}

                    onChange={() => handleChange('maintenanceMode', !formData.maintenanceMode)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {formData.maintenanceMode && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3 text-yellow-800">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="text-sm font-medium">
                      Maintenance Mode is enabled. The platform is currently not accessible to users.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end px-8 pb-8">
          <button
            id="saveBtn"
            onClick={handleSaveSettings}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default GeneralSettings;
