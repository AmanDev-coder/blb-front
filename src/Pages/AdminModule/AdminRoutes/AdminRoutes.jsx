import { Routes, Route } from "react-router-dom";
import ThemeLayout from "../Layout/ThemeLayout"; // Uses Sidebar & Header
import Dashboard from "../Dashboard";
import YachtOwner from "../YachtOwner";
// import OwnerPayouts from "../YachtOwners/OwnerPayouts";
// import Yachts from "../YachtOwners/Yachts";
// import AddYacht from "../YachtOwners/AddYacht";
// import Users from "../Users/Users";
import AddUser from "../AddUser";
import RecentBooking from "../RecentBooking";
import Transactions from "../Transactions";
import SettingsHolder from "../SettingsHolder";
// import Account from "../Account/Account";
import Profile from "../Profile";
import AddYachtOwner from "../AddYachtOwner";
import AddBookings from "../AddBookings";
import OwnerPayouts from "../OwnerPayout";
import YachtUsers from "../YachtUsers";
import AddTranx from "../AddTranx";
import Yachts from "../Yachts";
import AllTestimonials from "../AllTestimonials";
import FeaturedTestimonials from "../FeaturedTestimonials";
import AddTestimonials from "../AddTestimonial";
import FeaturedFaqs from "../FeaturedFaqs";
import AddFaq from "../AddFaq";
import FaqItems from "../FaqItems";
import FaqCategories from "../FaqCategories";
import AllReviews from "../AllReviews";
import PendingReviews from "../PendingReviews";
import FeaturedReviews from "../FeaturedReviews";

const AdminRoutes = () => {
  return (
    <ThemeLayout sidebar={true} header={true}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/yacht-owners" element={<YachtOwner />} />
        <Route path="/add-owner" element={<AddYachtOwner />} />
        <Route path="/owner-payouts" element={<OwnerPayouts />} />
        <Route path="/users" element={<YachtUsers />} />
        <Route path="/add-users" element={<AddUser />} />
        <Route path="/latestbookings" element={<RecentBooking />} />
        <Route path="/AddBookings" element={<AddBookings />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/addtransaction" element={<AddTranx />} />
        <Route path="/settings/*" element={<SettingsHolder />} />
        <Route path="/yachts" element={<Yachts />} />
        <Route path="/featured-testimonials" element={<FeaturedTestimonials />} />
        <Route path="/testimonials" element={<AllTestimonials />} />
        <Route path="/add-testimonial" element={<AddTestimonials />} />
        <Route path="/featured-faqs" element={<FeaturedFaqs />} />
        <Route path="/add-faq" element={<AddFaq />} />
        <Route path="/all-faqs" element={<FaqItems />} />
        <Route path="/faq-categories" element={<FaqCategories />} />
        <Route path="/reviews" element={<AllReviews />} />
        <Route path="/pending-reviews" element={<PendingReviews />} />
        <Route path="/featured-reviews" element={<FeaturedReviews />} />
        <Route path="/review-management" element={<FeaturedReviews />} />
        <Route path="/profile" element={<Profile />} />

        {/*
        <Route path="/users" element={<Users />} />
        <Route path="/account" element={<Account />} /> */}
      </Routes>
    </ThemeLayout>
  );
};

export default AdminRoutes;
