import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const DurationButton = styled.button`
  width: 150px;
  padding: 10px 20px;
  background-color: #fff;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  display: flex;
  color: gray;
  border: 1px solid #000;
  border-radius: 10px;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: #f9f9f9;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 110%;
  left: -125%;
  width: 370px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const DropdownItem = styled.div`
  padding: 8px 12px;
  font-size: 16px;
  color: #000;
  cursor: pointer;
  border-radius: 5px;
  background-color: #f5f5f5;
  text-align: center;
  flex: 1 0 45%;
  &:hover {
    background-color: #ddd;
  }
`;

export default function DurationPicker({ selectedDuration, setSelectedDuration }) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef();
  const buttonRef = useRef();

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);

    // Scroll to ensure dropdown visibility
    if (!isDropdownVisible && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 200; // Approximate dropdown height
      const spaceBelow = window.innerHeight - rect.bottom;

      if (spaceBelow < dropdownHeight) {
        // Scroll to ensure dropdown is visible
        window.scrollBy({
          top: dropdownHeight - spaceBelow + 20, // Extra padding
          behavior: "smooth",
        });
      }
    }
  };

  const handleSelectDuration = (duration) => {
    setSelectedDuration(duration);
    setDropdownVisible(false);
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
      {/* Button to open the duration picker */}
      <DurationButton ref={buttonRef} onClick={toggleDropdown}>
        {selectedDuration
          ? `${selectedDuration} hour${selectedDuration > 1 ? "s" : ""}`
          : "Duration"}
        <span>&#x25BC;</span>
      </DurationButton>

      {isDropdownVisible && (
        <Dropdown>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
            <DropdownItem key={count} onClick={() => handleSelectDuration(count)}>
              {count} hour{count > 1 ? "s" : ""}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </Container>
  );
}
