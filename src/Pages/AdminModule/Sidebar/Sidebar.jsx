// Sidebar.js
// import React from "react";
import Menu from "./Menu";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        Admin <span>Dashboard</span>
      </div>
      <Menu />
    </div>
  );
};

export default Sidebar;
