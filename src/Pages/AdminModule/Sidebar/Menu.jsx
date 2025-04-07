import { useState } from "react";
import styles from "./Menu.module.scss";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThLarge,
  faShip,
  faUsers,
  faCalendarCheck,
  faWallet,
  faFileInvoiceDollar,
  faFileAlt,
  faReceipt,
  faUserShield,
  faUserCircle,
  faChevronUp,
  faChevronDown,
  faWrench,
  faTasks,
  faClipboardList,
  faPlus,
  faCog,
  faChartBar,
  faBell,
  faCode,
  faDatabase,
  faComments,
  faStar,
  faQuestionCircle,
  faComment
} from "@fortawesome/free-solid-svg-icons";
// import { FaCog, FaUserShield, FaFileInvoiceDollar, FaChartBar, FaBell, FaCode, FaDatabase, FaComments } from "react-icons/fa";

// Updated Menu Data
const menuData = [
  {
    label: "Dashboard",
    icon: faThLarge,
    link: "/adminn/dashboard",
  },
  {
    label: "Yacht Owners",
    icon: faShip,
    subMenu: [
      { label: "Yacht Owners", link: "/adminn/yacht-owners", icon: faShip },
      { label: "Owner Payouts", link: "/adminn/owner-payouts", icon: faFileInvoiceDollar },
      { label: "Yachts", link: "/adminn/yachts", icon: faShip },
      { label: "Add Owner", link: "/adminn/add-owner", icon: faFileAlt },
    ],
  },
  {
    label: "Users",
    icon: faUsers,
    subMenu: [
      { label: "Users", link: "/adminn/users", icon: faUsers },
      { label: "Add Users", link: "/adminn/add-users", icon: faUserCircle },
    ],
  },
  {
    label: "Bookings",
    icon: faCalendarCheck,
    subMenu: [
      { label: "Recent Bookings", link: "/adminn/latestbookings", icon: faTasks },
      { label: "Add Bookings", link: "/Adminn/AddBookings", icon: faPlus },
    ],
  },
  {
    label: "Transactions",
    icon: faWallet,
    subMenu: [
      { label: "Latest Transactions", link: "/adminn/transactions", icon: faReceipt },
      { label: "Add Transactions", link: "/adminn/addtransaction", icon: faFileAlt },
    ],
  },
  {
    label: "Testimonials",
    icon: faComment,
    subMenu: [
      { label: "All Testimonials", link: "/adminn/testimonials", icon: faComment },
      { label: "Add Testimonial", link: "/adminn/add-testimonial", icon: faPlus },
      { label: "Featured Testimonials", link: "/adminn/featured-testimonials", icon: faStar },
    ],
  },
  {
    label: "Ratings & Reviews",
    icon: faStar,
    subMenu: [
      { label: "All Reviews", link: "/adminn/reviews", icon: faStar },
      { label: "Pending Reviews", link: "/adminn/pending-reviews", icon: faClipboardList },
      { label: "Featured Reviews", link: "/adminn/featured-reviews", icon: faStar },
    ],
  },
  {
    label: "FAQ",
    icon: faQuestionCircle,
    subMenu: [
      { label: "FAQ Categories", link: "/adminn/faq-categories", icon: faClipboardList },
      { label: "FAQ Items", link: "/adminn/all-faqs", icon: faQuestionCircle },
      { label: "Add FAQ Item", link: "/adminn/add-faq", icon: faPlus },
      { label: "Featured FAQs", link: "/adminn/featured-faqs", icon: faStar },
    ],
  },
  {
    label: "Settings",
    icon: faWrench,
    subMenu: [
      { label: "General", link: "/adminn/settings/general", icon: faCog },
      { label: "Owner Management", link: "/adminn/settings/owner-management", icon: faUserShield },
      { label: "Booking & Transactions", link: "/adminn/settings/booking", icon: faFileInvoiceDollar },
      { label: "Reports & Analytics", link: "/adminn/settings/reports", icon: faChartBar },
      { label: "Notifications & Alerts", link: "/adminn/settings/notifications", icon: faBell },
      { label: "API & Integrations", link: "/adminn/settings/api", icon: faCode },
      { label: "Data & Privacy", link: "/adminn/settings/privacy", icon: faDatabase },
      { label: "Chat Support (Upcoming)", link: "/adminn/settings/chat-support", icon: faComments, disabled: true },
    ],
  },
  {
    label: "Profile",
    icon: faUserCircle,
    link: "/adminn/profile",
  },
];

const Menu = () => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const toggleSubMenu = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  return (
    <ul className={styles.menu}>
      {menuData.map((item, index) => (
        <li key={index} className={styles.menuItem}>
          {item.subMenu ? (
            <>
              <div
                className={`${styles.menuHeader} ${
                  activeSubMenu === index ? styles.active : ""
                }`}
                onClick={() => toggleSubMenu(index)}
              >
                <FontAwesomeIcon icon={item.icon} className={styles.icon} />
                <span>{item.label}</span>
                <FontAwesomeIcon
                  icon={activeSubMenu === index ? faChevronUp : faChevronDown}
                  className={styles.arrowIcon}
                />
              </div>
              <ul
                className={`${styles.subMenu} ${
                  activeSubMenu === index ? styles.show : ""
                }`}
              >
                {item.subMenu.map((subItem, subIndex) => (
                  <li key={subIndex} className={styles.subMenuItem}>
                    <NavLink
                      to={subItem.link}
                      className={({ isActive }) =>
                        isActive ? styles.activeLink : ""
                      }
                    >
                      {subItem.icon && <FontAwesomeIcon icon={subItem.icon} />}
                      {subItem.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <NavLink
              to={item.link}
              className={({ isActive }) =>
                `${styles.menuHeader} ${isActive ? styles.activeLink : ""}`
              }
            >
              <FontAwesomeIcon icon={item.icon} className={styles.icon} />
              <span>{item.label}</span>
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Menu;
