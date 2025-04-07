import styles from "./YachtOwner.module.scss";
import FeaturedFaqsComponent from "./components/FAQ/FeaturedFaqsComponent";

const FeaturedFaqs = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* Page Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured FAQs</h2>
      
      {/* Featured FAQs Component */}
      <FeaturedFaqsComponent />
    </div>
  );
};

export default FeaturedFaqs; 