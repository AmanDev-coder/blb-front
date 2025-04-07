import styles from "./YachtOwner.module.scss"; // Reusing existing styles
import AddTestimonialComponent from "./components/Testimonials/AddTestimonialComponent";

const AddTestimonial = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* Page Header */}
      
      {/* Add Testimonial Form Component */}
      <AddTestimonialComponent />
    </div>
  );
};

export default AddTestimonial; 