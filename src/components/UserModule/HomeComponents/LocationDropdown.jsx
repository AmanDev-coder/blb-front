import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MapPin, Calendar, Users, X } from "lucide-react";
// import { fetchSuggestions } from "../../Redux/yachtReducer/action";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DropdownContainer = styled.div`
  position: absolute;
  top: 90px;
  left: 53%;
  // width: 580px;
  width: 96%;
  transform: translateX(-50%);

  background: white;
  border-radius: 15px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 30px;
  border: 1px solid #ddd;

  display: flex;
  justify-content: space-between;
`;

const Section = styled.div`
  flex: 1;
  gap: 20px;
  &:not(:last-child) {
    margin-right: 20px;
  }
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
`;

const RecentItem = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  padding: 8px 10px;
  font-size: 16px;
  color: #555;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f7f7f7;
    border-radius: 8px;
    // padding:8px;
  }
`;

const IconWrapper = styled.div`
  margin-right: 12px;
  font-size: 18px;
  color: #888;
`;

const RegionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const RegionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f0f0f0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const MapImage = styled.div`
  width: 50px;
  height: 50px;
  background: gray;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const RegionLabel = styled.span`
  font-size: 14px;
  color: #333;
`;

const LocationDropdown = ({
  dateInputRef,
  dropdownRef,
  location,
  setLocation,
  setIsDropdownVisible,
  handleAddressSelect
}) => {
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async () => {

    try {
      const response = await axios.get(
        `${BASE_URL}/locations?locationQuery=${location}`
      );
      // console.log(response.data);
      setSuggestions(response.data);
    } catch (err) {
      console.error("Error fetching location suggestions:", err);
    }
  };
  console.log(location);

  useEffect(() => {
    // const suggestion =await fetchSuggestions(location)
    const debounce = setTimeout( fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [location]);

  const handleLocationSelect = async(suggestion) => {
    console.log(suggestion);
    const locationDetails = await fetchCoordinates(suggestion.place_id)
    setLocation(suggestion.description);
  //  const coordinates =await fetchCoordinates(suggestion.place_id)
    setSuggestions([]);
    setIsDropdownVisible(false);
    dateInputRef.current?.setFocus(); 
    handleAddressSelect(locationDetails)
  };
  const fetchCoordinates = async (placeId) => {
    const API_KEY = "AIzaSyDgLM-rcAmNnGOmcCgvebof2Uk6kb7U7y4";
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`
    );
    const data = await response.json();
  console.log("data",data)
    if (data.status === "OK") {
      const location = data.result.geometry.location;
      // console.log(location)
      return data.result;
    }
  
    throw new Error("Unable to fetch coordinates.");
  };
  
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

  return (
    
      suggestions.length>0 &&  
    <DropdownContainer ref={dropdownRef}>
      <Section>
        {suggestions.map((suggestion) => (
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <MapPin size={20} />
            <RecentItem
              key={suggestion.place_id}
              onClick={() => {
                handleLocationSelect(suggestion);
              }}
            >
              {suggestion.description}
            </RecentItem>
          </div>
        ))}
      </Section>
    </DropdownContainer>
    
  
  );
};

export default LocationDropdown;
