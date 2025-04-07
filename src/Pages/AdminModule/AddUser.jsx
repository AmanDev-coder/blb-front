import styles from "./AddUser.module.scss";
// import AddYachtOwnerComponnent from "./components/YachtOwners/AddOwner";
import AddUserComponent from "./components/YachtUsers/AddUser";

const AddUser = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* 📌 Page Header */}
        <AddUserComponent/>
      {/* 📌 Yacht Owners Table */}

    </div>
  );
};

export default AddUser;