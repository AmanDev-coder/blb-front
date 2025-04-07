import React, { useState, useEffect } from "react";
import styles from "./UpcomingEvents.module.scss";
import { FaClock, FaPercent, FaCalendarAlt } from "react-icons/fa";

// 📌 Sample Event Data
const upcomingEvents = [
  {
    id: 1,
    title: "Luxury Yacht Expo 2025",
    date: "2025-06-15T18:00:00",
    location: "Miami Beach, FL",
    discount: "15% OFF",
  },
  {
    id: 2,
    title: "Sunset Sailing Experience",
    date: "2025-04-10T19:30:00",
    location: "Santorini, Greece",
    discount: "10% OFF",
  },
  {
    id: 3,
    title: "VIP Yacht Party",
    date: "2025-05-20T21:00:00",
    location: "Dubai Marina, UAE",
    discount: "20% OFF",
  },
];

const UpcomingEvents = () => {
  const [countdowns, setCountdowns] = useState([]);

  // 📌 Countdown Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = upcomingEvents.map((event) => {
        const eventDate = new Date(event.date);
        const now = new Date();
        const diff = eventDate - now;

        if (diff <= 0) return "🎉 Happening Now!";
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        return `${days}d ${hours}h ${minutes}m`;
      });

      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.eventsSection}>
      <h2>📅 Upcoming Events & Promotions</h2>
      <div className={styles.eventContainer}>
        {upcomingEvents.map((event, index) => (
          <div key={event.id} className={styles.eventCard}>
            <FaCalendarAlt className={styles.icon} />
            <div className={styles.eventDetails}>
              <h3>{event.title}</h3>
              <p>{event.location}</p>
              <div className={styles.countdown}>
                <FaClock className={styles.timerIcon} />
                <span>{countdowns[index]}</span>
              </div>
              <div className={styles.discount}>
                <FaPercent className={styles.discountIcon} />
                <span>{event.discount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
