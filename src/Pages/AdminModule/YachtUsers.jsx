import styles from "./YachtOwner.module.scss";
import UsersTable from "./components/YachtUsers/UsersTable"; // ✅ Importing Table Component

const YachtUsers = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* 📌 Page Header */}

      {/* 📌 Yacht Owners Table */}
      <UsersTable />
    </div>
  );
};

export default YachtUsers;
