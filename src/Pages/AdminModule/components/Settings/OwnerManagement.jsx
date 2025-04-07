import { useEffect, useState } from 'react';
import { Ship, Shield, Anchor, Calendar } from 'lucide-react';
import { fetchSettings, updateSettings } from '../../../../Redux/adminReducer.js/action';
import { useDispatch, useSelector } from 'react-redux';
const defaultSettings = {
  // Owner management settings
  autoApproveOwner: false,
  maxYachtsPerOwner: 5,
  kycRequired: true,
  allowMultipleLocations: true,
  
  // Yacht specific settings
  minimumBookingDuration: 3,
  securityDeposit: 1000,
  insuranceRequired: true,
  allowInstantBooking: false,
  verificationLevel: 'advanced'
};

const OwnerManagement = () => {
  const dispatch = useDispatch();

  const { settings, loading } = useSelector((state) => state.adminReducer);

  // Default values as fallback if API fails
 
  const [formData, setFormData] = useState(defaultSettings);

  useEffect(() => {
    // Fetch settings on component mount
    const loadSettings = async () => {
      try {
        const response = await dispatch(fetchSettings('ownerManagement'));
        setFormData(response.settings);
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
      await dispatch(updateSettings('ownerManagement', formData));

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

  // New yacht-specific settings


  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Ship className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Yacht Owner Management</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
          {/* Verification & Approval */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-500" />
              Verification Settings
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Auto-Approve Owners</p>
                  <p className="text-sm text-gray-500">Skip manual verification</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoApproveOwner}
                       onChange={() => handleChange('autoApproveOwner', !formData.autoApproveOwner)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Level
                </label>
                <select
                  value={formData.verificationLevel}
                  onChange={(e) => handleChange('verificationLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="basic">Basic</option>
                  <option value="advanced">Advanced</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Required Documents</p>
                  <p className="text-sm text-gray-500">Proof of ownership & license</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.kycRequired}
                     onChange={() => handleChange('kycRequired', !formData.kycRequired)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Listing Management */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <Anchor className="w-5 h-5 text-blue-500" />
              Listing Controls
            </h3>
            <div className="space-y-6">
              <div className="flex  items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Maximum Yachts</p>
                  <p className="text-sm text-gray-500">Per owner limit</p>
                </div>
                <div className='w-20'>
                <input
                  type="number"
                   value={formData.maxYachtsPerOwner}
                  onChange={(e) => handleChange('maxYachtsPerOwner', Number(e.target.value))}
                  min="1"
                  className=" px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Multiple Locations</p>
                  <p className="text-sm text-gray-500">Allow different ports</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowMultipleLocations}
                      onChange={() => handleChange('allowMultipleLocations', !formData.allowMultipleLocations)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Instant Booking</p>
                  <p className="text-sm text-gray-500">Skip approval process</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                      checked={formData.allowInstantBooking}
                    onChange={() => handleChange('allowInstantBooking', !formData.allowInstantBooking)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Booking Rules */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-500" />
              Booking Rules
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Minimum Days</p>
                  <p className="text-sm text-gray-500">Minimum booking duration</p>
                </div>
                <div className='w-20'>
                <input
                  type="number"
                  value={formData.minimumBookingDuration}
                  onChange={(e) => handleChange('minimumBookingDuration', Number(e.target.value))}
                  min="1"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Security Deposit</p>
                  <p className="text-sm text-gray-500">Required amount ($)</p>
                </div>
                <div className='w-28'>
                <input
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) => handleChange('securityDeposit', Number(e.target.value))}
                  min="0"
                  step="100"
                  className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Insurance Required</p>
                  <p className="text-sm text-gray-500">Mandatory coverage</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                      checked={formData.insuranceRequired}
                     onChange={() => handleChange('insuranceRequired', !formData.insuranceRequired)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
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

export default OwnerManagement;
