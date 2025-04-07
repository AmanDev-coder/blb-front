import styles from "./YachtOwner.module.scss"; // Reusing existing styles
import ReviewManagementComponent from "./components/Ratings/ReviewManagementComponent";

const ReviewManagement = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* Page Header */}
      
      {/* Review Management Component */}
      <ReviewManagementComponent />
    </div>
  );
};

export default ReviewManagement; 