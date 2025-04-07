
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MapPin, Calendar, Users, X } from "lucide-react";


import axios from "axios";
import { MdClear } from "react-icons/md";
import { IconButton } from "@mui/material";
import DropdownDatePicker from "./DatePicker";

const SearchWrapper = styled.div`

//   transform: translateX(-50%);
  width: 95%;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction:column;
  justify-content: space-between;
  padding: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const SearchItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  padding: 0.5rem 1rem;
//   border-right: 1px solid #e5e7eb;

  &:last-child {
    border-right: none;
  }

  input,
  button {
    width: 100%;
    border: none;
    outline: none;
    font-size: 1rem;
  }

  svg {
    color: #6b7280;
  }
`;

const LocationInputWrapper = styled.div`
  position: relative;
  width: 100%;
  // border:1px solid red;
`;

const LocationInput = styled.input.attrs({
  type: "text",
  placeholder: "Location",
})`
  font-size: 1rem;
  background-color: transparent;
  padding: 0.25rem;
  width: 100%;
`;

const ClearButton = styled.button`
  position: absolute;
  top: 50%;
  // right:0;
  left: 50px;

  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    color: red;
  }
`;


const NumberInput = styled.input.attrs({
  type: "number",
  min: "1",
  placeholder: "Guests",
})`
  font-size: 1rem;
  background-color: transparent;
  padding: 0.25rem;
`;

const SearchButton = styled.button`
  background-color: #1d4ed8;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e40af;
  }
`;

const LocationDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 50%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 0.25rem;
  list-style-type: none;
`;

const LocationItem = styled.li`
  padding: 0.5rem;
  cursor: pointer;
  background-color: white;

  &:hover {
    background-color: #f0f0f0;
  }

  &:active {
    background-color: #e0e0e0;
  }
`;
const LocationCategory = styled.div`
  font-weight: bold;
  color: #6b7280;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 10px;
  text-transform: uppercase;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const DatePickerHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0rem;
  position: relative;
  width: 100%;
`;

const MonthDisplay = styled.div`
  font-size: 1rem;
  font-weight: bold;
  white-space: nowrap;
  text-align: center;
  flex: 1;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #000000;
  padding: 0 1rem;

  &:hover {
    color: #111827;
  }

  &:disabled {
    color: #d1d5db;
  }
`;

export default function SearchFilters({
  location,
  setLocation,
  date,
  setDate,
  adults,
  setAdults,
  onSearch,
  setSearchParams,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const dateInputRef = useRef(null);
  const guestInputRef = useRef(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setDate(newDate);
  };

  const isSameDay = (day1, day2) =>
    day1.getDate() === day2.getDate() && day1.getMonth() === day2.getMonth();
  const handleLocationSelect = (suggestion) => {
    console.log(suggestion);
    setLocation(suggestion);

    setSuggestions([]);
    setIsDropdownVisible(false);
    dateInputRef.current?.setFocus(); // Focus on date input
  };

  const handleClearLocation = () => {
    setLocation("");
    setSuggestions([]);
  };

  const fetchSuggestions = async () => {
    console.log(location);
    if (!location) {
      setSuggestions({
        currentLocation: [{ name: "Miami, USA", type: "city" }],
        recentSearches: [
          { name: "Greece", type: "country" },
          { name: "Croatia", type: "country" },
          { name: "Italy", type: "country" },
          { name: "Miami, USA", type: "city" },
        ],
        popularSearches: [
          { name: "Croatia", type: "country" },
          { name: "Greece", type: "country" },
          { name: "Turkey", type: "country" },
          { name: "Italy", type: "country" },
          { name: "Lefkada", type: "region" },
        ],
      });
      return;
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/locations?locationQuery=${location}`
      );
      console.log(response.data);
      setSuggestions(response.data);
    } catch (err) {
      console.error("Error fetching location suggestions:", err);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [location]);

  const handleOutsideClick = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !event.target.closest(".location-input-wrapper") // Allow clicks on input
    ) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // console.log(isDropdownVisible,location,!location.trim(),suggestions)
  return (
    <SearchWrapper>
      <SearchItem>
        <MapPin size={20} />
        <LocationInputWrapper>
          <LocationInput
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setIsDropdownVisible(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") dateInputRef.current?.setFocus();
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering handleOutsideClick
              setIsDropdownVisible(true);
            }}
            className="location-input-wrapper"
          />
          {location && (
            <MdClear
              onClick={handleClearLocation}
              size={20}
              style={{
                position: "absolute",
                top: "50%",
                right: "0",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6b7280",
              }}
            />
          )}
        </LocationInputWrapper>
        {isDropdownVisible && suggestions.length > 0 && (
          <LocationDropdown ref={dropdownRef}>
            {suggestions.map((suggestion) => (
              <div style={{ display: "flex", alignItems: "center" }}>
                <MapPin size={20} />
                <LocationItem
                  key={suggestion.place_id}
                  onClick={() => handleLocationSelect(suggestion.description)}
                >
                  {suggestion.description}
                </LocationItem>
              </div>
            ))}
          </LocationDropdown>
        )}

        {!location && isDropdownVisible && (
          <>
            {suggestions.currentLocation &&
              suggestions.currentLocation.length > 0 && (
                <LocationDropdown ref={dropdownRef}>
                  <LocationCategory>Nearby</LocationCategory>
                  {suggestions.currentLocation.map((item) => (
                    <LocationItem
                      key={item.name}
                      onClick={() => handleLocationSelect(item.name)}
                    >
                      {item.name}
                    </LocationItem>
                  ))}
                  <LocationCategory>recent Searches</LocationCategory>
                  {suggestions.recentSearches.map((item) => (
                    <LocationItem
                      key={item.name}
                      onClick={() => handleLocationSelect(item.name)}
                    >
                      {item.name}
                    </LocationItem>
                  ))}
                  <LocationCategory>Most Populer Searches</LocationCategory>

                  {suggestions.popularSearches.map((item) => (
                    <LocationItem
                      key={item.name}
                      onClick={() => handleLocationSelect(item.name)}
                    >
                      {item.name}
                    </LocationItem>
                  ))}
                </LocationDropdown>
              )}
          </>
        )}
      </SearchItem>

      <SearchItem>
        <Calendar size={20} />

        <DropdownDatePicker />
      </SearchItem>

      <SearchItem>
        <Users size={20} />
        <NumberInput
          ref={guestInputRef}
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          placeholder="Guests"
        />
      </SearchItem>

      {/* <SearchItem>
        <SearchButton onClick={onSearch}>Search</SearchButton>
      </SearchItem> */}
    </SearchWrapper>
  );
}
const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => (
  <DatePickerHeader>
    <NavButton onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
      &lt;
    </NavButton>
    <MonthDisplay>
      {date.toLocaleString("default", { month: "long", year: "numeric" })}
    </MonthDisplay>
    <NavButton onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
      &gt;
    </NavButton>
  </DatePickerHeader>
);
