import React from "react";
import { FaCheckCircle, FaExclamationCircle, FaHourglassHalf } from "react-icons/fa";
import styles from "./SupportTracker.module.scss";

const SupportTracker = () => {
  const supportData = [
    { label: "Open Tickets", count: 23, icon: <FaExclamationCircle />, color: "#ff6b6b" },
    { label: "In Progress", count: 15, icon: <FaHourglassHalf />, color: "#f39c12" },
    { label: "Resolved", count: 80, icon: <FaCheckCircle />, color: "#2ecc71" },
  ];

  // Calculate progress percentage
  const totalTickets = supportData.reduce((sum, item) => sum + item.count, 0);
  const progressPercentage = ((supportData[2].count / totalTickets) * 100).toFixed(1);

  return (
    <div className={styles.supportTracker}>
      {/* 📌 Header */}
      <div className={styles.header}>
        <h3>📊 Support Tracker</h3>
        <span className={styles.progress}>{progressPercentage}% Resolved</span>
      </div>

      {/* 📌 Progress Bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* 📌 Support Details */}
      <div className={styles.ticketContainer}>
        {supportData.map((item, index) => (
          <div key={index} className={styles.ticketCard} style={{ borderLeft: `5px solid ${item.color}` }}>
            <div className={styles.icon} style={{ color: item.color }}>
              {item.icon}
            </div>
            <div className={styles.ticketInfo}>
              <h4>{item.count}</h4>
              <p>{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportTracker;
