import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaTimes, FaAngleRight, FaCog } from "react-icons/fa";
import { format, formatDistanceToNow } from "date-fns";
import styles from "./NotificationCenter.module.scss";

// Sample Notification Data with severity levels
const initialNotifications = [
  { 
    id: 1, 
    icon: "📅", 
    message: "New yacht booking: John Doe reserved a luxury yacht.", 
    time: new Date(Date.now() - 120000), // 2 minutes ago
    severity: "success",
    type: "newBooking",
    read: false
  },
  { 
    id: 2, 
    icon: "💰", 
    message: "Revenue update: You earned $4,500 today.", 
    time: new Date(Date.now() - 600000), // 10 minutes ago
    severity: "info",
    type: "payoutRequest",
    read: false
  },
  { 
    id: 3, 
    icon: "🛥️", 
    message: "New yacht listed: 'Ocean Dream' is now available.", 
    time: new Date(Date.now() - 1800000), // 30 minutes ago
    severity: "info",
    type: "yachtListed",
    read: false
  },
  { 
    id: 4, 
    icon: "🔧", 
    message: "Maintenance alert: 'Seaside Cruiser' needs inspection.", 
    time: new Date(Date.now() - 3600000), // 1 hour ago
    severity: "warning",
    type: "maintenance",
    read: false
  },
];

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage or use initialNotifications
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications).map(n => ({
          ...n,
          time: new Date(n.time) // Convert string dates back to Date objects
        }));
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error("Error parsing saved notifications:", error);
        setNotifications(initialNotifications);
      }
    } else {
      setNotifications(initialNotifications);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Update unread count whenever notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationElement = document.getElementById('notification-center');
      if (notificationElement && !notificationElement.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 📌 Toggle Notification Dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // ❌ Remove a Notification
  const dismissNotification = (id, event) => {
    event.stopPropagation(); // Prevent triggering the notification click
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Format notification time
  const formatNotificationTime = (time) => {
    try {
      const timeObj = new Date(time);
      
      // If less than 24 hours ago, show relative time
      if (Date.now() - timeObj < 24 * 60 * 60 * 1000) {
        return formatDistanceToNow(timeObj, { addSuffix: true });
      }
      
      // Otherwise show the actual date
      return format(timeObj, 'MMM d, h:mm a');
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Unknown time";
    }
  };

  // Get notification background class based on severity
  const getNotificationClass = (severity) => {
    switch (severity) {
      case 'success': return styles.success;
      case 'warning': return styles.warning;
      case 'critical': return styles.critical;
      case 'info': 
      default: return styles.info;
    }
  };

  // Handle clicking on a notification
  const handleNotificationClick = (notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // In a real application, you would navigate to the relevant page based on notification type
    console.log(`Navigating to details for notification type: ${notification.type}`);
    
    // For demo purposes, just close the dropdown
    setIsOpen(false);
  };

  return (
    <div id="notification-center" className={styles.notificationWrapper}>
      {/* 🔔 Notification Bell Icon */}
      <div className={styles.bellIcon} onClick={toggleDropdown}>
        <FaBell />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </div>

      {/* 🔽 Notification Dropdown */}
      <div className={`${styles.dropdown} ${isOpen ? styles.active : ""}`}>
        <div className={styles.notifHeader}>
          <h3>🔔 Notifications</h3>
          {notifications.length > 0 && (
            <div className={styles.actions}>
              <button 
                className={styles.markAllRead} 
                onClick={markAllAsRead}
                title="Mark all as read"
              >
                Mark all read
              </button>
              <Link 
                to="/admin/settings/notifications" 
                className={styles.settingsLink}
                onClick={() => setIsOpen(false)}
                title="Notification settings"
              >
                <FaCog />
              </Link>
            </div>
          )}
        </div>

        {/* 📌 Notification List */}
        {notifications.length > 0 ? (
          <ul className={styles.notificationList}>
            {notifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''} ${getNotificationClass(notification.severity)}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className={styles.notifContent}>
                  <span className={styles.notifIcon}>{notification.icon}</span>
                  <span className={styles.notifMessage}>{notification.message}</span>
                </div>
                <div className={styles.notifRight}>
                  <span className={styles.timestamp}>
                    {formatNotificationTime(notification.time)}
                  </span>
                  <FaTimes className={styles.closeIcon} onClick={(e) => dismissNotification(notification.id, e)} />
                </div>
                <FaAngleRight className={styles.detailIcon} />
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.noNotifications}>
            <p>No new notifications</p>
            <Link 
              to="/admin/settings/notifications" 
              className={styles.settingsLink}
              onClick={() => setIsOpen(false)}
            >
              Manage notification settings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;