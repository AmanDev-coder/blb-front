// import styles from "./AddUser.module.scss";
// import AddYachtOwnerComponnent from "./components/YachtOwners/AddOwner";
import AddTransaction from "./components/Transaction/AddTransaction";
import styles from "./AddYachtOwner.module.scss";
const AddTranx = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* 📌 Page Header */}
        <AddTransaction/>
      {/* 📌 Yacht Owners Table */}

    </div>
  );
};

export default AddTranx;