import React from "react";
import styles from "./Header.module.scss";
import NotificationCenter from "../components/Header/NotificationCenter"; // ✅ Import the Notification Center

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.actions}>
        {/* ✅ Integrated NotificationCenter */}
        <NotificationCenter />

        {/* Profile Section */}
        <div className={styles.profile}>
          <img src="/assets/profile.jpg" alt="Profile" className={styles.profileImage} />
        </div>
      </div>
    </header>
  );
};

export default Header;