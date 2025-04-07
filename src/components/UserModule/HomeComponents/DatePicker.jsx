import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  addMonths,
  format,
  startOfMonth,
  eachDayOfInterval,
  endOfMonth,
  isBefore,
  isSameMonth,
  isSameDay,
} from "date-fns";

const Container = styled.div`
  position: relative;
  display: inline-block;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 800px; /* Wider container for two-month view */
  margin: 0 auto; /* Center the container */
`;

const Button = styled.button`
  width: 100%;
  // padding: 15px 20px;
  // border: 1px solid #ddd;
  // border-radius: 25px;
  // background-color: #fff;
  font-size: 18px;
  text-align: left;
  cursor: pointer;
  display: flex;
  color: gray;

  justify-content: space-between;
  align-items: center;
  // box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

  // &:hover {
  //   box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  // }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  // width: 100%;
  // max-width: 850px; /* Adjusted to fit two months side by side */
  background: #ffffff;
  border: 1px solid #ddd;
  // max-width: 800px;
  // width: 8;
  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 20px;
  display: flex; /* Ensure side-by-side alignment */
  flex-direction: column;
  align-items: center;
`;

const MonthContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;

`;

const MonthView = styled.div`
  flex: 1;
  padding: 10px;
  // background-color: #f9f9f9;
  border-radius: 8px;
  // box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between; /* Align arrows to corners */
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  position: relative; /* Required for absolute centering of the month name */

  .month-name {
    position: absolute;
    left: 50%; /* Center horizontally */
    transform: translateX(-50%);
  }
`;


const ArrowButton = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #f5f5f5;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #555;
  }

  ${({ invisible }) =>
    invisible &&
    `visibility: hidden;`}
`;
const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  row-gap: 8px;
`;

const Day = styled.div`
  padding: 10px 14px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: ${({ isSelected }) => (isSelected ? "bold" : "normal")};
  background-color: ${({ isSelected }) =>
    isSelected ? "#007bff" : "transparent"};
  color: ${({ isSelected, isDisabled }) =>
    isDisabled ? "#ccc" : isSelected ? "#fff" : "#333"};
  cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
  pointer-events: ${({ isDisabled }) => (isDisabled ? "none" : "auto")};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ isDisabled }) =>
      isDisabled ? "transparent" : "#e6f7ff"};
  }
`;

const NavigationButton = styled.div`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  &:disabled {
    color: gray;
    cursor: not-allowed;
  }
`;

// Main Component
const DropdownDatePicker = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef();

  const handleNext = () => {
    setCurrentMonth((prev) => addMonths(prev, 2));
  };

  const handlePrev = () => {
    setCurrentMonth((prev) => addMonths(prev, -2));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDropdownVisible(false); // Close dropdown on date selection
  };

  const renderMonth = (date, isLeftMonth) => {
    const today = new Date();
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });

    return (
      <MonthView>
        <MonthHeader>
  {/* Left arrow for navigating to the previous month */}
  {isLeftMonth ? (
    <ArrowButton
      onClick={handlePrev}
      invisible={isSameMonth(date, today)} // Hide if it's the first month
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 19l-7-7 7-7" // Left arrow
        />
      </svg>
    </ArrowButton>
  ) : (
    <div style={{ width: "30px" }} /> // Placeholder for alignment
  )}

  {/* Month name centered */}
  <div className="month-name">{format(date, "MMMM yyyy")}</div>

  {/* Right arrow for navigating to the next month */}
  {!isLeftMonth && (
    <ArrowButton onClick={handleNext}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5l7 7-7 7" // Right arrow
        />
      </svg>
    </ArrowButton>
  )}
</MonthHeader>

        <WeekDays>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </WeekDays>
        <DaysGrid>
          {days.map((day) => (
            <Day
              key={day}
              isSelected={selectedDate && isSameDay(day, selectedDate)}
              isDisabled={isBefore(day, today)}
              onClick={() => handleDateSelect(day)}
            >
              {format(day, "d")}
            </Day>
          ))}
        </DaysGrid>
      </MonthView>
    );
  };

  const handleDropdownToggle = () => {
    setDropdownVisible((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Container ref={dropdownRef}>
      <Button onClick={handleDropdownToggle}>
        <span>
          {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Select Date"}
        </span>
        <span>&#x25BC;</span>
      </Button>
      {isDropdownVisible && (
        <Dropdown>
          <MonthContainer>
            {renderMonth(currentMonth, true)}
            {renderMonth(addMonths(currentMonth, 1), false)}
          </MonthContainer>
        </Dropdown>
      )}
    </Container>
  );
};

export default DropdownDatePicker;
