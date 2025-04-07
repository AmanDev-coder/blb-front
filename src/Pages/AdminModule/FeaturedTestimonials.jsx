import styles from "./YachtOwner.module.scss"; // Reusing existing styles
import FeaturedTestimonialsComponent from "./components/Testimonials/FeaturedTestimonialsComponent";

const FeaturedTestimonials = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* Page Header */}
      
      {/* Featured Testimonials Component */}
      <FeaturedTestimonialsComponent />
    </div>
  );
};

export default FeaturedTestimonials; 