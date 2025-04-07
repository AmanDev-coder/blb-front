import styles from "./YachtOwner.module.scss"; // Reusing existing styles
import ProfileComponent from "./components/Profile/ProfileComponent";

const Profile = () => {
  return (
    <div className={styles.yachtOwner}>
      {/* Page Header */}
      
      {/* Profile Component */}
      <ProfileComponent />
    </div>
  );
};

export default Profile; 