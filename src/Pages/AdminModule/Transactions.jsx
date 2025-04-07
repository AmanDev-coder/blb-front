import styles from "./AddYachtOwner.module.scss";
import TransactionTable from "./components/Transaction/TransactionTable";

const Transactions = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* 📌 Page Header */}
        <TransactionTable />
      {/* 📌 Yacht Owners Table */}

    </div>
  );
};

export default Transactions;
