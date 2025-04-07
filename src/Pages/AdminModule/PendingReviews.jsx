import styles from "./YachtOwner.module.scss";
import PendingReviewsComponent from "./components/Ratings/PendingReviewsComponent";

const PendingReviews = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* Page Header */}
      
      {/* Pending Reviews Component */}
      <PendingReviewsComponent />
    </div>
  );
};

export default PendingReviews; 