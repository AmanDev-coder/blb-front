import styles from "./AddYachtOwner.module.scss";
import YachtsComponent from "./components/Yachts/YachtsComponent"; // ✅ Importing Table Component

const Yachts = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* 📌 Page Header */}

      {/* 📌 Yacht Owners Table */}
      <YachtsComponent />
    </div>
  );
};

export default Yachts;
