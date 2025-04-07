import styles from "./YachtOwner.module.scss"; // Reusing existing styles
import FaqItemsComponent from "./components/FAQ/FaqItemsComponent";

const FaqItems = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* Page Header */}
      
      {/* FAQ Items Component */}
      <FaqItemsComponent />
    </div>
  );
};

export default FaqItems; 