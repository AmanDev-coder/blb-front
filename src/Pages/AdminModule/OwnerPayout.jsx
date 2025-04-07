import styles from "./OwnerPayout.module.scss";
import OwnerPayoutComponent from "./components/YachtOwners/OwnerPayoutComponent"; // ✅ Importing Table Component

const OwnerPayout = () => {
  return (
    <div className={styles.OwnerPayout}>
      {/* 📌 Page Header */}

      {/* 📌 Yacht Owners Table */}
      <OwnerPayoutComponent />
    </div>
  );
};

export default OwnerPayout;
