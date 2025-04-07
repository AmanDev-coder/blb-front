import PropTypes from "prop-types";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/AdminHeader";
import styles from "./ThemeLayout.module.scss";

const ThemeLayout = ({ sidebar, header, children }) => {
  return (
    <div className={styles.layout}>
      {sidebar && (
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
      )}
      <div className={styles.main}>
        {header && (
          <div className={styles.header}>
            <Header />
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

ThemeLayout.propTypes = {
  sidebar: PropTypes.bool,
  header: PropTypes.bool,
  children: PropTypes.node,
};

ThemeLayout.defaultProps = {
  sidebar: true, // Default to true for sidebar
  header: true, // Default to true for header
};

export default ThemeLayout;