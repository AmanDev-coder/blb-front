import styles from "./YachtOwner.module.scss";
import FeaturedReviewsComponent from "./components/Ratings/FeaturedReviewsComponent";

const FeaturedReviews = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* Page Header */}
      
      {/* Featured Reviews Component */}
      <FeaturedReviewsComponent />
    </div>
  );
};

export default FeaturedReviews;