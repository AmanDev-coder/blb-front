import styles from "./AddYachtOwner.module.scss";
import AddYachtOwnerComponnent from "./components/YachtOwners/AddOwner";

const AddYachtOwner = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* 📌 Page Header */}
        <AddYachtOwnerComponnent />
      {/* 📌 Yacht Owners Table */}

    </div>
  );
};

export default AddYachtOwner;
