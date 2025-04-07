import styles from "./AddYachtOwner.module.scss";
import RecentBookingComponent from "./components/Booking/RecentBookingComponent";

const RecentBooking = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* 📌 Page Header */}
        <RecentBookingComponent />
      {/* 📌 Yacht Owners Table */}

    </div>
  );
};

export default RecentBooking;
