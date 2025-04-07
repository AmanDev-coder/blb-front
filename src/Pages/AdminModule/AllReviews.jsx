import styles from "./YachtOwner.module.scss";
import AllReviewsComponent from "./components/Ratings/AllReviewsComponent";

const AllReviews = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* Page wrapper with proper sizing */}
      <div className="w-full max-w-full overflow-hidden">
        <AllReviewsComponent />
      </div>
    </div>
  );
};

export default AllReviews; 