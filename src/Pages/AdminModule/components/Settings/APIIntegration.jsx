import { useState, useEffect } from "react";
import {
  RefreshCw,
  Shield,
  Globe,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import apiData from "../jsondatamap/APIData.json";

const APIIntegration = () => {
  const [rateLimit, setRateLimit] = useState(1000);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [integrations, setIntegrations] = useState(apiData.integrations);
  const [showSecrets, setShowSecrets] = useState({});

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        console.log("Auto-refreshing data...");
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const toggleSecretVisibility = (integrationId, fieldIndex) => {
    setShowSecrets(prev => {
      const key = `${integrationId}-${fieldIndex}`;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const updateIntegrationField = (integrationId, fieldIndex, value) => {
    setIntegrations(prevIntegrations => 
      prevIntegrations.map(integration => 
        integration.id === integrationId 
          ? {
              ...integration,
              configFields: integration.configFields.map((field, idx) => 
                idx === fieldIndex ? { ...field, value } : field
              )
            }
          : integration
      )
    );
  };

  const saveIntegrationSettings = (integrationId) => {
    // Here you would make an API call to save the configuration
    console.log(`Saving configuration for integration ${integrationId}`);
    const integration = integrations.find(i => i.id === integrationId);
    console.log(integration.configFields);
    
    // Update integration status if all fields are filled
    const allFieldsFilled = integration.configFields.every(field => field.value.trim() !== '');
    if (allFieldsFilled) {
      setIntegrations(prevIntegrations => 
        prevIntegrations.map(i => 
          i.id === integrationId ? { ...i, status: "Connected" } : i
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">API & Integration Settings</h1>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              autoRefresh ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            <RefreshCw className="w-4 h-4 inline-block mr-1.5" />
            {autoRefresh ? "Auto Refresh On" : "Enable Auto Refresh"}
          </button>
        </div>

        {/* Rate Limit Control */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-3">API Rate Limit</h2>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-600" />
            <input
              type="number"
              className="w-full px-3 py-1.5 border rounded-lg"
              value={rateLimit}
              onChange={(e) => setRateLimit(e.target.value)}
            />
            <span className="text-gray-600">Requests per hour</span>
          </div>
        </div>

        {/* OAuth Integrations Configuration */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Integration Settings</h2>
          <div className="space-y-6">
            {integrations.map((integration) => (
              <div key={integration.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3 mb-4">
                  <img src={integration.icon} alt={integration.name} className="w-8 h-8" />
                  <div>
                    <p className="text-gray-800 font-medium">{integration.name}</p>
                    <span className={`text-sm ${integration.status === "Connected" ? "text-green-600" : "text-red-600"}`}>
                      {integration.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {integration.configFields.map((field, idx) => (
                    <div key={idx} className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1 font-medium">
                        {field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type={field.type === 'password' && !showSecrets[`${integration.id}-${idx}`] ? 'password' : 'text'}
                          className="w-full px-3 py-1.5 border rounded-lg text-sm"
                          value={field.value}
                          placeholder={`Enter ${field.name}`}
                          onChange={(e) => updateIntegrationField(integration.id, idx, e.target.value)}
                        />
                        {field.type === 'password' && (
                          <button 
                            className="px-2 py-1.5 bg-gray-200 text-gray-700 rounded-lg"
                            onClick={() => toggleSecretVisibility(integration.id, idx)}
                          >
                            {showSecrets[`${integration.id}-${idx}`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => saveIntegrationSettings(integration.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Save Configuration
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIIntegration;
