import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  addMonths,
  format,
  startOfMonth,
  eachDayOfInterval,
  endOfMonth,
  isBefore,
  isSameDay,
} from "date-fns";

import {accentColor} from "../../../cssCode"
// Styled Components
const Container = styled.div`
  position: relative;
  display: inline-block;
  font-family: Poppins, sans-serif;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px 20px;
  background-color: #fff;
  font-size: 18px;
  text-align: left;
  cursor: pointer;
  display: flex;
  color: gray;
  border-radius: 10px;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 16px;
    color: gray;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 50px;
  left: 110%;
  transform: translateX(-50%);
  width: 380px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 15px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 20px;
`;


const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
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
    width: 15px;
    height: 15px;
  }
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 14px;
  color: #888;
  margin-bottom: 10px;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  row-gap: 12px;
`;

const Day = styled.div`
  padding: 5px;
  border-radius: 20%;
  font-size: 16px;
  font-weight: ${({ isSelected }) => (isSelected ? "bold" : "normal")};
  background-color: ${({ isSelected }) =>
    isSelected ? `${accentColor.blue}` : "transparent"};
  color: ${({ isSelected, isDisabled }) =>
    isDisabled ? "#ccc" : isSelected ? "#fff" : "#000"};
  cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
  pointer-events: ${({ isDisabled }) => (isDisabled ? "none" : "auto")};

  &:hover {
    background-color: ${({ isDisabled }) =>
      isDisabled ? "transparent" : "lightgray"};
  }
`;

// Main Component
const AlseDatePicker = ({selectedDate,setSelectedDate}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef();
  const buttonRef = useRef();

  const handleNext = () => setCurrentMonth((prev) => addMonths(prev, 1));
  const handlePrev = () => setCurrentMonth((prev) => addMonths(prev, -1));

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDropdownVisible(false);
  };

  const renderMonth = () => {
    const today = new Date();
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    return (
      <>
        <MonthHeader>
          <ArrowButton onClick={handlePrev}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </ArrowButton>
          <div>{format(currentMonth, "MMMM yyyy")}</div>
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
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </ArrowButton>
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
      </>
    );
  };

  const handleDropdownToggle = () => {
    setDropdownVisible((prev) => !prev);

    // Scroll to ensure the dropdown is visible
    if (!isDropdownVisible && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 400; // Approximate height of the dropdown
      const spaceBelow = window.innerHeight - rect.bottom;

      if (spaceBelow < dropdownHeight) {
        // Scroll to ensure dropdown visibility
        window.scrollBy({
          top: dropdownHeight - spaceBelow + 20, // Extra padding
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Container ref={dropdownRef}>
      <Button ref={buttonRef} onClick={handleDropdownToggle}>
        <span>
          {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Select Date"}
        </span>
        <span>&#x25BC;</span>
      </Button>
      {isDropdownVisible && (
        <Dropdown>
          {renderMonth()}
        </Dropdown>
      )}
    </Container>
  );
};

export default AlseDatePicker;
