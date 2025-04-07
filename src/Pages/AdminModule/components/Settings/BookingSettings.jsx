import React, { useEffect, useState } from "react";
import {
  Settings2,
  CreditCard,
  Clock,
  Users,
  CalendarCheck,
  ArrowLeftRight,
} from "lucide-react";
import { fetchSettings, updateSettings } from '../../../../Redux/adminReducer.js/action';
import { useDispatch, useSelector } from 'react-redux';

const defaultSettings = {
  requireBookingApproval: true,
  allowPartialPayments: false,
  platformCommissionPercent: 10,
  commissionMode: 'percentage',
  refundWindowHours: 48,
  autoRefundFailedBookings: true,
  cancellationFeePercent: 15,
  currency: 'USD',
  maxBookingsPerUser: 3,
  cancellationPolicy: 'Flexible',
  paymentGateway: 'Stripe',
  refundProcessingTime: 7,
  autoApproveBookings: false,
  paymentGateways: {
    stripe: true,
    paypal: false
  }
};

const BookingSettings = () => {
  const dispatch = useDispatch();
  const { settings, loading } = useSelector((state) => state.adminReducer);

  const [formData, setFormData] = useState(defaultSettings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await dispatch(fetchSettings('bookingAndTransaction'));
        setFormData(response.settings);
      } catch (error) {
        console.error("Error loading settings:", error);
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
      if (btn) {
        btn.textContent = 'Saving...';
      }

      await dispatch(updateSettings('bookingAndTransaction', formData));

      if (btn) {
        btn.textContent = 'Saved!';
        setTimeout(() => {
          btn.textContent = 'Save Changes';
        }, 2000);
      }

    } catch (error) {
      console.error("Error saving settings:", error);
      if (btn) {
        btn.textContent = 'Error Saving';
        setTimeout(() => {
          btn.textContent = 'Save Changes';
        }, 2000);
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings2 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Booking & Transaction Settings
            </h1>
          </div>
          <p className="text-gray-600 text-md">
            Configure how users make bookings, handle transactions, and refund policies.
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-6">
          {/* ✅ Auto-Approve Bookings (Full Width) */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <CalendarCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Auto-Approve Bookings
                  </h3>
                  <p className="text-sm text-gray-500">
                    Automatically approve new booking requests
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                    checked={formData.autoApproveBookings}
                  onChange={() =>
                    handleChange('autoApproveBookings', !formData.autoApproveBookings)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* ✅ Max Bookings Per User & Cancellation Policy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Max Bookings */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Maximum Bookings Per User
                  </h3>
                  <p className="text-xs text-gray-500">
                    Limit active bookings per user
                  </p>
                </div>
              </div>
              <input
                type="number"
                value={formData.maxBookingsPerUser}
                onChange={(e) =>
                  handleChange('maxBookingsPerUser', Number(e.target.value))
                }
                min="1"
                className="w-20 px-3 py-1.5 text-center rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Cancellation Policy */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <ArrowLeftRight className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Cancellation Policy
                  </h3>
                  <p className="text-xs text-gray-500">
                    Set terms for cancellations
                  </p>
                </div>
              </div>
              <select
                  value={formData.cancellationPolicy}
                onChange={(e) => handleChange('cancellationPolicy', e.target.value)}
                className="w-full px-3 py-1.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="Flexible">Flexible - 24hrs refund</option>
                <option value="Moderate">Moderate - 50% refund 3 days</option>
                <option value="Strict">Strict - No refund</option>
              </select>
            </div>
          </div>

          {/* ✅ Payment Gateway & Refund Processing Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Gateway */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Payment Gateway
                  </h3>
                  <p className="text-xs text-gray-500">
                    Select your payment processor
                  </p>
                </div>
              </div>
              <select
                value={formData.paymentGateway}
                onChange={(e) => handleChange('paymentGateway', e.target.value)}
                className="w-40 px-3 py-1.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="Stripe">Stripe</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Refund Processing Time */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Refund Processing Time
                  </h3>
                  <p className="text-xs text-gray-500">
                    Expected refund processing duration
                  </p>
                </div>
              </div>
              <div className="flex items-center w-20 gap-2">
                <input
                  type="number"
                  value={formData.refundProcessingTime}
                  onChange={(e) =>
                    handleChange('refundProcessingTime', Number(e.target.value))
                  }
                  min="1"
                  className="w-20 px-3 py-1.5 text-center rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <span className="text-gray-600 font-medium">Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            id="saveBtn"
            onClick={handleSaveSettings}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>    
  );
};

export default BookingSettings;
