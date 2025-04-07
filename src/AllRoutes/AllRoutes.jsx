// import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../Pages/UserModule/HomePage";
import YachtRentals from "../Pages/UserModule/YachtRentals";
import AboutUs from "../Pages/UserModule/AboutUs";
import PrivacyPolicy from "../Pages/UserModule/PrivacyPolicy";

import OwnerDashboard from "../Pages/YachtOwnerModule/OwnerDashboard";
import Footer from "../components/UserModule/Footer";
import { BoatDetails } from "../Pages/UserModule/YachtDetailsPage";
import AuthenticationPage from "../Pages/UserModule/AuthenticationPage";
import CheckoutPage from "../Pages/UserModule/CheckoutPage";
import PaymentPage from "../Pages/UserModule/PaymentPage";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../Config/Stripe";
import BookingPage from "../Pages/UserModule/BookingPage";
import Header from "../components/UserModule/Header";
import Success from "../Pages/UserModule/SuccessPayment";
import Cancel from "../Pages/UserModule/CancelPayment";
import AdminLogin from "../Pages/AdminModule/AdminLogin";
import AdminSignup from "../Pages/AdminModule/AdminSignup";
import OwnerSignup from "../Pages/YachtOwnerModule/OwnerSignup";
import OwnerLogin from "../Pages/YachtOwnerModule/OwnerLogin";
import { PrivateRoutes } from "./PrivateRoutes";
import ThemeLayout from "../Pages/AdminModule/Layout/ThemeLayout";
import Dashboard from "../Pages/AdminModule/Dashboard";
import AdminRoutes from "../Pages/AdminModule/AdminRoutes/AdminRoutes";

export const AllRoutes = ({ onSearch }) => {
  const location = useLocation();
  const isAdminPanelRoute = location.pathname
    .toLowerCase()
    .startsWith("/adminn");
  // Routes where header should not appear
  const hideHeaderRoutes = ["/success", "/cancel"];

  // Routes where footer should not appear
  const hideFooterRoutes = [
    "/adminlogin",
    "/adminsignup",
    "/ownerlogin",
    "/ownersignup",
  ];

  // const user = useSelector((store) => store.authReducer.user);

  // Determine if header should be hidden
  const shouldHideHeader =
    hideHeaderRoutes.includes(location.pathname.toLowerCase()) ||
    isAdminPanelRoute;

  // Determine if footer should be hidden (also hide it for all "/adminn/*" pages)
  const shouldHideFooter =
    hideFooterRoutes.includes(location.pathname.toLowerCase()) ||
    isAdminPanelRoute;

  // Determine if current route is admin-related
  const isAdminRoute = location.pathname.startsWith("/OwnerDashboard");

  // Determine if current route is related to yacht rentals
  const isYachtRentalsRoute =
    location.pathname === "/yacht-rentals" ||
    location.pathname.startsWith("/yacht-rentals/");

  return (
    <>
      {/* Show Header unless in a hidden header route */}
      {!shouldHideHeader && <Header onSearch={onSearch} />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthenticationPage />} />
        <Route path="/yacht-rentals" element={<YachtRentals />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route path="/:boatId" element={<BoatDetails />} />
        <Route
          path="/OwnerDashboard/*"
          element={
            <PrivateRoutes>
              <OwnerDashboard />
            </PrivateRoutes>
          }
        />
        <Route path="/preview/:boatId" element={<BoatDetails />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminsignup" element={<AdminSignup />} />
        <Route path="/ownerlogin" element={<OwnerLogin />} />

        <Route
          path="/ownersignup"
          element={
            <PrivateRoutes>
              <OwnerSignup />
            </PrivateRoutes>
          }
        />
        <Route
          path="/admindashboard"
          element={
           <PrivateRoutes>
              <ThemeLayout sidebar={true} header={true}>
                <Dashboard />
              </ThemeLayout>
           </PrivateRoutes>
          }
        />
        <Route path="/adminn/*" element={  
          <PrivateRoutes>
            <AdminRoutes />
          </PrivateRoutes>
          
          } />

        <Route
          path="/book-now/:boatId/:instabookId"
          element={<BookingPage />}
        />
        
        <Route
          path="/book-now/:boatId"
          element={<BookingPage />}
        />
      </Routes>

      {/* Show Footer unless in a hidden footer route, admin, or yacht rental routes */}
      {!shouldHideFooter && !isAdminRoute && !isYachtRentalsRoute && <Footer />}
    </>
  );
};