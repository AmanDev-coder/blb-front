import styles from "./YachtOwner.module.scss";
import YachtOwnersTable from "./components/YachtOwners/YachtOwnersTable"; // ✅ Importing Table Component

const YachtOwner = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* 📌 Page Header */}

      {/* 📌 Yacht Owners Table */}
      <YachtOwnersTable />
    </div>
  );
};

export default YachtOwner;
