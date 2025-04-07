import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  addDays,
  addMonths,
  format,
  startOfMonth,
  eachDayOfInterval,
  endOfMonth,
  isBefore,
  isSameMonth,
  isSameDay,
} from "date-fns";

// Styled Components
const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns:repeat(2,1fr);
  justify-content: space-between;

   border: 1px solid black;

  border-radius: 15px;

  font-family: Poppins, sans-serif;
`;
const Section = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  padding: 10px 15px;
  background-color: #fff;
  font-size: 14px;
  color: #000;
  &:hover {
    background-color: #f9f9f9;
  }
`;
const Button = styled.button`
  width: 100%;
  background-color: #fff;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  display: flex;
  color: #000;
  justify-content: space-between;
  align-items: center;
  padding: 20px 15px;
  // border: 2px solid black;
  // border-right:1px solid gray;
  border-radius: 15px;
  // box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    // box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  }

  span {
    font-weight: 500;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 750px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 35px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 30px;
`;

const DurationDropdown = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  width: 300px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 20px;
`;

const DurationOption = styled.div`
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  color: #333;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const MonthContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 25px;
`;

const MonthView = styled.div`
  flex: 1;
  padding: 10px;
`;

const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
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
  padding: 15px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: ${({ isSelected }) => (isSelected ? "bold" : "normal")};
  background-color: ${({ isSelected }) =>
    isSelected ? "#1d4ed8" : "transparent"};
  color: ${({ isSelected, isDisabled }) =>
    isDisabled ? "#ccc" : isSelected ? "#fff" : "#000"};
  cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${({ isDisabled }) =>
      isDisabled ? "transparent" : "lightgray"};
  }
`;

// Main Component
const DateSelectorWithDuration = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isDateDropdownVisible, setDateDropdownVisible] = useState(false);
  const [isDurationDropdownVisible, setDurationDropdownVisible] = useState(false);
  const durationOptions = ["1 Day", "2 Days", "3 Days", "7 Days", "14 Days"];
  const dropdownRef = useRef();

  const handleDateSelect = (date) => {
    setSelectedStartDate(date);
    setDateDropdownVisible(false);
  };

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    setDurationDropdownVisible(false);
  };

  const renderMonth = (date) => {
    const today = new Date();
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });

    return (
      <MonthView>
        <MonthHeader>{format(date, "MMMM yyyy")}</MonthHeader>
        <WeekDays>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </WeekDays>
        <DaysGrid>
          {days.map((day) => (
            <Day
              key={day}
              isSelected={selectedStartDate && isSameDay(day, selectedStartDate)}
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDateDropdownVisible(false);
        setDurationDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Container ref={dropdownRef}>
      {/* Date Selector */}
      <div>
        <Button onClick={() => setDateDropdownVisible((prev) => !prev)}>
          <span>
            {selectedStartDate
              ? format(selectedStartDate, "dd MMM yyyy")
              : "Add dates"}
          </span>
          <span>▼</span>
        </Button>
        {isDateDropdownVisible && (
          <Dropdown>
            <MonthContainer>
              {renderMonth(currentMonth)}
              {renderMonth(addMonths(currentMonth, 1))}
            </MonthContainer>
          </Dropdown>
        )}
      </div>

      {/* Duration Selector */}
      <div>
        <Button onClick={() => setDurationDropdownVisible((prev) => !prev)}>
          <span>{selectedDuration || "Select duration"}</span>
          <span>▼</span>
        </Button>
        {isDurationDropdownVisible && (
          <DurationDropdown>
            {durationOptions.map((option) => (
              <DurationOption
                key={option}
                onClick={() => handleDurationSelect(option)}
              >
                {option}
              </DurationOption>
            ))}
          </DurationDropdown>
        )}
      </div>
    </Container>
  );
};

export default DateSelectorWithDuration;
