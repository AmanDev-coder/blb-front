import styles from "./YachtOwner.module.scss"; // Reusing existing styles
import AllTestimonialsComponent from "./components/Testimonials/AllTestimonialsComponent";

const AllTestimonials = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* Page Header */}
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-6"></h2> */}
      
      {/* Testimonials Component */}
      <AllTestimonialsComponent />
    </div>
  );
};

export default AllTestimonials; 