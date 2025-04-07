import styles from "./AddYachtOwner.module.scss";
import AddBookingComponent from "./components/Booking/AddBookingComponent";

const AddBooking = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* 📌 Page Header */}
        <AddBookingComponent />
      {/* 📌 Yacht Owners Table */}

    </div>
  );
};

export default AddBooking;
