import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import default styles
import styled from 'styled-components';

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  border: none;
  outline: none;
  padding: 0.5rem;
  border-radius: 8px;
  background-color: #fff;
  z-index: 1001; // Ensure the date picker is above other elements

  .react-datepicker__header {
    background-color: #3b82f6; // Header background color
    color: white; // Header text color
    display: flex;
    justify-content: space-between; // Space between month name and buttons
    align-items: center; // Center align items vertically
    padding: 0; // Remove padding for better alignment
  }

  .react-datepicker__current-month {
    font-weight: bold; // Make month name bold
    font-size: 1.25rem; // Increase font size for better visibility
    margin: 0; // Remove default margin
    text-align: center; // Center the month name
    flex-grow: 1; // Allow it to take available space
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--today {
    background-color: #fbbf24 !important; // Yellow color for selected day and current day
    border-radius: 50% !important; // Circular shape
    color: #fff !important; // White text color
  }

  .react-datepicker__day--selected {
    background-color: #fbbf24 !important; // Yellow color for selected day
  }

  .react-datepicker__navigation--previous {
    left: 10px; // Align previous month button to the extreme left
    top: 10px; // Adjust top position
    background: none; // Remove background
    border: none; // Remove border
    color: white; // Button color
    cursor: pointer; // Pointer cursor
  }

  .react-datepicker__navigation--next {
    right: 10px; // Align next month button to the extreme right
    top: 10px; // Adjust top position
    background: none; // Remove background
    border: none; // Remove border
    color: white; // Button color
    cursor: pointer; // Pointer cursor
  }
`;

const Calendar = ({ selected, onChange }) => {
  return (
    <StyledDatePicker
      selected={selected}
      onChange={onChange}
      placeholderText="Select a date"
      dateFormat="MM/dd/yyyy"
    />
  );
};

export default Calendar;
