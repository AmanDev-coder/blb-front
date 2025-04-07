import React, { useState } from "react";
import styles from "./CalendarWidget.module.scss";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";

// Sample events (you can replace this with API data)
const events = [
  { date: "2024-02-10", event: "Booking #B124" },
  { date: "2024-02-14", event: "Yacht Maintenance" },
  { date: "2024-02-22", event: "Special Event" },
];

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date) => setSelectedDate(date);

  return (
    <div className={styles.calendarBox}>
      <div className={styles.calendarHeader}>
        <FaChevronLeft onClick={handlePrevMonth} className={styles.navIcon} />
        <h3>{format(currentDate, "MMMM yyyy")}</h3>
        <FaChevronRight onClick={handleNextMonth} className={styles.navIcon} />
      </div>

      <div className={styles.calendarGrid}>
        {daysInMonth.map((day) => {
          const isSelected = selectedDate && format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
          const hasEvent = events.some((e) => e.date === format(day, "yyyy-MM-dd"));

          return (
            <div
              key={day}
              className={`${styles.calendarDay} ${isSelected ? styles.selected : ""} ${hasEvent ? styles.eventDay : ""}`}
              onClick={() => handleDateClick(day)}
            >
              {format(day, "d")}
              {hasEvent && <FaCalendarAlt className={styles.eventIcon} />}
            </div>
          );
        })}
      </div>

      <div className={styles.eventList}>
        <h4>📌 Events</h4>
        {selectedDate ? (
          <ul>
            {events
              .filter((e) => e.date === format(selectedDate, "yyyy-MM-dd"))
              .map((e, index) => <li key={index}>{e.event}</li>)}
            {events.filter((e) => e.date === format(selectedDate, "yyyy-MM-dd")).length === 0 && <li>No events</li>}
          </ul>
        ) : (
          <p>Select a date to view events.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarWidget;
