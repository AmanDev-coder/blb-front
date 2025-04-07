import styles from "./YachtOwner.module.scss"; // Reusing existing styles
import AddFaqComponent from "./components/FAQ/AddFaqComponent";

const AddFaq = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* Page Header */}
      
      {/* Add FAQ Component */}
      <AddFaqComponent />
    </div>
  );
};

export default AddFaq; 