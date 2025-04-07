import React, { useState } from "react";
import "./CharterTypeDropdown.css";

const CharterTypeDropdown = ({ onSelect }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const options = [
    {
      value: "independentCaptain",
      label: "Independent Captain",
      description: "Professional captain required, arranged and paid separately.",
    },
    {
      value: "captainNotProvided",
      label: "Captain Not Provided",
      description:
        "Customer provides or acts as a qualified operator.",
    },
  ];

  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    onSelect(value);
  };

  return (
    <div className="charter-type-dropdown">
      <label htmlFor="charterType" className="dropdown-label">
        What type of charter is this?
      </label>
      <select
        id="charterType"
        value={selectedOption}
        onChange={handleSelect}
        className="dropdown"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedOption && (
        <div className="dropdown-description">
          {
            options.find((option) => option.value === selectedOption)
              ?.description
          }
        </div>
      )}
    </div>
  );
};

export default CharterTypeDropdown;
