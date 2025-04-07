import React, { useState } from "react";
import styles from "../styles/CalendarSection.module.scss";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const events = {
  "2025-02-10": [{ title: "Luxury Yacht Rental", time: "10:00 AM" }],
  "2025-02-15": [{ title: "Sunset Cruise", time: "5:30 PM" }],
  "2025-02-20": [{ title: "VIP Party Boat", time: "8:00 PM" }],
};

const CalendarSection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = selectedDate.toISOString().split("T")[0];

  return (
    <div className={styles.calendarSection}>
      <h3>📅 Upcoming Yacht Bookings</h3>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className={styles.customCalendar}
      />

      {/* Event Details */}
      <div className={styles.eventDetails}>
        <h4>Events on {formattedDate}:</h4>
        {events[formattedDate] ? (
          events[formattedDate].map((event, index) => (
            <div key={index} className={styles.eventItem}>
              <span>{event.time}</span> - {event.title}
            </div>
          ))
        ) : (
          <p>No Bookings for this date</p>
        )}
      </div>
    </div>
  );
};

export default CalendarSection;
