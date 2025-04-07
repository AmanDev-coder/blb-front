import React from 'react'
import YachtListingPage from './YachtListingPage'
import BookingSettings from './BookingSettings'
import ProfileUpdate from './ProfileUpdate/ProfileUpdate'
import PayoutAccount from '../../components/YachtOwnerModule/PayoutAccount'
// import AvailabilityCalendar from './AvailabilityCalendar'
import InstantBooking from '../../components/YachtOwnerModule/InstantBooking/InstantBooking'
import PayPalForm from '../../components/YachtOwnerModule/payPalForm'
import BankForm from '../../components/YachtOwnerModule/bankForm'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { BoatDetails } from '../UserModule/YachtDetailsPage'
import AvailabilityCalendar from '../../components/YachtOwnerModule/AvailabilityCalendar'

export const OwnerRoutes = () => {
const navigate = useNavigate();



  return (
        <Routes>
    {/* Route for Yacht Listings */}
    <Route path="/listings" element={<YachtListingPage />} />

    {/* Route for Account Settings */}
    <Route path="/account-settings" element={<BookingSettings />} /> 
    <Route path="/profile-update" element={<ProfileUpdate />} />
    <Route path="/account-settings/payout" element={<PayoutAccount />} />
    <Route path="/availabilitycalendar" element={<AvailabilityCalendar />} />
    <Route path="/instantbooking" element={<InstantBooking />} />

    <Route
      path="/account-settings/payout/paypal"
      element={<PayPalForm />}
    />
    <Route path="/account-settings/payout/bank" element={<BankForm />} />
    {/* Default Route */}
    <Route path="*" element={<Navigate to="/OwnerDashboard/listings" />} />
  </Routes>
  )
}
