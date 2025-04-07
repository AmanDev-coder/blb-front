import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../../../../styles/ThemeProvider";
import styles from "./AdminNavbar.module.scss";

const AdminNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/admin/dashboard">Lux Yachts Admin</Link>
      </div>
      
      <div className={styles.navRight}>
        <ThemeToggle className={styles.themeToggle} />
        
        <button
          className={styles.menuButton}
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar; 