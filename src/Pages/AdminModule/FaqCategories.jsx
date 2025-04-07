import styles from "./YachtOwner.module.scss"; // Reusing existing styles
import FaqCategoriesComponent from "./components/FAQ/FaqCategoriesComponent";

const FaqCategories = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* Page Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">FAQ Categories</h2>
      
      {/* FAQ Categories Component */}
      <FaqCategoriesComponent />
    </div>
  );
};

export default FaqCategories; 