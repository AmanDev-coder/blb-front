import React, { useState } from "react";
import "./AvailabilityModal.css";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style
import "react-date-range/dist/theme/default.css"; // Theme style
import styled from "styled-components";

const RangePickerStyles = styled.div`
  .rdrCalendarWrapper {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }

  .rdrDayHovered {
    background-color: transparent !important;
    box-shadow: none !important;
  }
`;

const AvailabilityModal = ({ isOpen, onClose, onDatesSelected }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDayClick = (date) => {
    const dateString = date.toDateString();
    const isAlreadySelected = selectedDates.some(
      (selectedDate) => selectedDate.toDateString() === dateString
    );

    if (isAlreadySelected) {
      setSelectedDates((prevDates) =>
        prevDates.filter(
          (selectedDate) => selectedDate.toDateString() !== dateString
        )
      );
    } else {
      setSelectedDates((prevDates) => [...prevDates, date]);
    }
  };

  const isDateSelected = (date) => {
    return selectedDates.some(
      (selectedDate) => selectedDate.toDateString() === date.toDateString()
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleConfirm = () => {
    onDatesSelected(selectedDates);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="availability-modal-backdrop">
      <div className="availability-modal">
        <div className="modal-header">
          <h2>Select Availability</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="calendar-wrapper">
            <h4>Pick dates:</h4>
            <RangePickerStyles>
              <Calendar
                months={2}
                direction="horizontal"
                date={new Date()}
                onChange={(date) => handleDayClick(date)}
                color="#F9C74F"
                dayContentRenderer={(date) => {
                  const isSelected = isDateSelected(date);
                  const today = isToday(date);
                  return (
                    <div
                      className={`day-content ${
                        isSelected ? "selected-day" : today ? "today" : ""
                      }`}
                    >
                      {date.getDate()}
                    </div>
                  );
                }}
                showMonthAndYearPickers={true}
                monthDisplayFormat="MMMM yyyy"
              />
            </RangePickerStyles>
          </div>
          <div className="selected-dates">
            <h4>Selected Dates:</h4>
            <ul>
              {selectedDates.map((date, index) => (
                <li key={index}>{date.toDateString()}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;
