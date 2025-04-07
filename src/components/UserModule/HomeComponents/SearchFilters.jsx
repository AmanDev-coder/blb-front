import { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Search, X, Clock } from "lucide-react";
import axios from "axios";
import DropdownDatePicker from "./DatePicker";

// Main search container with glassmorphism effect
const SearchWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 75%;
  background: rgba(255, 255, 255, 1);
  // backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  z-index: 888;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.15),
      0 3px 10px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transform: translateX(-50%) translateY(-2px);
  }

  @media (max-width: 1200px) {
    width: 85%;
  }
  
  @media (max-width: 768px) {
    width: 95%;
  }
`;

// Individual search section with improved hover effects
const SearchItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  padding: 0.75rem 1.25rem;
  position: relative;
  transition: all 0.2s ease;
  border-right: 1px solid rgba(0, 0, 0, 0.07);

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 16px;
  }

  input,
  button {
    width: 100%;
    border: none;
    outline: none;
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
  }

  svg {
    color: #1e3a8a;
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  &:hover svg {
    opacity: 1;
  }
`;

// Enhanced location input section
const LocationInputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

// Beautiful location input with animation
const LocationInput = styled.input.attrs({
  type: "text",
  placeholder: "Where are you going?",
})`
  font-size: 1rem;
  background-color: transparent;
  padding: 0.25rem;
  width: 100%;
  border: none;
  border-bottom: 2px solid transparent;
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 2rem;
  transition: all 0.3s ease;
  color: #334155;
  font-weight: 500;

  &:focus {
    border-bottom: 2px solid #3b82f6;
  }

  &::placeholder {
    color: #94a3b8;
    font-weight: normal;
  }
`;

// Animated clear button
const ClearButton = styled.div`
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  background: rgba(241, 245, 249, 0.8);
  border-radius: 50%;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #334155;
  }
`;

// Guest number input with better styling
const NumberInput = styled.input.attrs({
  type: "number",
  min: "1",
  placeholder: "Add guests",
})`
  font-size: 1rem;
  background-color: transparent;
  padding: 0.5rem 0.25rem;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  color: #334155;
  font-weight: 500;

  &:focus {
    border-bottom: 2px solid #3b82f6;
  }

  &::placeholder {
    color: #94a3b8;
    font-weight: normal;
  }

  /* Remove spinner buttons */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

// Stunning search button with gradient
const SearchButton = styled(motion.button)`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 18px;
  cursor: pointer;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    box-shadow: 0 6px 16px rgba(29, 78, 216, 0.4);
  }
`;

// Replace the existing DropdownContainer with an enhanced version
const DropdownContainer = styled(motion.div)`
  position: absolute;
  top: 100px;
  left: 0;
  width: 700px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.15),
    0 10px 24px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(29, 78, 216, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  z-index: 1000;
  padding: 1.5rem;
  border: 1px solid rgba(241, 245, 249, 0.8);
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  transform-origin: top center;
`;

// Enhance the Section styling
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Add divider between sections
const Divider = styled.div`
  height: 1px;
  background: linear-gradient(to right, rgba(203, 213, 225, 0), rgba(203, 213, 225, 0.7), rgba(203, 213, 225, 0));
  margin: 0.5rem 0 1rem;
`;

// Enhance the Section Title styling
const SectionTitle = styled.h4`
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 16px;
    background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
    border-radius: 4px;
  }
`;

// Enhance Location Item styling
const RecentItem = styled(motion.div)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #334155;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
    opacity: 0;
    transition: opacity 0.2s ease;
    border-radius: 4px;
  }

  &:hover {
    background: #f1f5f9;
    transform: translateX(5px);
    
    &::before {
      opacity: 1;
    }
  }
`;

// Enhance Region Grid
const RegionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

// Enhance Region Item with better spacing
const RegionItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.2));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: #93c5fd;
    box-shadow: 0 4px 12px rgba(29, 78, 216, 0.08);
    transform: translateY(-5px);
    
    &::after {
      opacity: 1;
    }
  }
`;

// Enhance Map Image
const MapImage = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 12px;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%231e40af' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.5;
  }
`;

// Improve Category badge styling
const CategoryBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0.6rem;
  text-transform: uppercase;
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

// Enhanced Region Label with more spacing
const RegionLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
  text-align: center;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 25%;
    right: 25%;
    height: 1px;
    background: linear-gradient(to right, 
      rgba(203, 213, 225, 0), 
      rgba(203, 213, 225, 0.7), 
      rgba(203, 213, 225, 0));
  }
`;

// Enhanced animations
const dropdownVariants = {
  hidden: { 
    opacity: 0,
    y: -15,
    scale: 0.95,
    transformOrigin: "top center"
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.34, 1.56, 0.64, 1],
      staggerChildren: 0.07,
      delayChildren: 0.05
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Add a subtle divider between columns
const ColumnDivider = styled.div`
  width: 1px;
  align-self: stretch;
  background: linear-gradient(to bottom, rgba(203, 213, 225, 0), rgba(203, 213, 225, 0.7), rgba(203, 213, 225, 0));
  margin: 0 1.5rem;
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
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  // Fetch location suggestions
  const fetchSuggestions = async () => {
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
          { name: "Miami, USA", type: "city" },
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

  return (
    <SearchWrapper
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
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
          <AnimatePresence>
          {location && (
            <ClearButton
              onClick={handleClearLocation}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={14} />
              </ClearButton>
            )}
          </AnimatePresence>
        </LocationInputWrapper>
        
        <AnimatePresence>
        {isDropdownVisible && suggestions.length > 0 && (
            <DropdownContainer
              ref={dropdownRef}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
            <Section>
                {suggestions.map((suggestion, index) => (
                  <RecentItem
                    key={suggestion.place_id || index}
                    onClick={() => handleLocationSelect(suggestion.description)}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <MapPin size={18} style={{ marginRight: "12px", color: "#3b82f6" }} />
                    {suggestion.description}
                  </RecentItem>
              ))}
            </Section>
          </DropdownContainer>
        )}

          {!location && isDropdownVisible && suggestions.currentLocation && suggestions.currentLocation.length > 0 && (
            <DropdownContainer
              ref={dropdownRef}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div style={{ flex: 1 }}>
                    <Section>
                      <SectionTitle>Nearby searches</SectionTitle>
                  {suggestions.currentLocation.map((item, index) => (
                        <RecentItem
                      key={item.name || index}
                          onClick={() => handleLocationSelect(item.name)}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                        >
                      <MapPin size={18} style={{ marginRight: "12px", color: "#3b82f6" }} />
                          {item.name}
                        </RecentItem>
                      ))}
                    </Section>
                
                <Divider />
                
                <Section>
                    <SectionTitle>Recent searches</SectionTitle>
                  {suggestions.recentSearches.map((item, index) => (
                      <RecentItem
                      key={item.name || index}
                        onClick={() => handleLocationSelect(item.name)}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                      >
                      <Clock size={18} style={{ marginRight: "12px", color: "#3b82f6" }} />
                        {item.name}
                      </RecentItem>
                    ))}
                  </Section>
              </div>
              
              <ColumnDivider />
              
              <div style={{ flex: 1 }}>
                  <Section>
                  <SectionTitle>Popular Destinations</SectionTitle>
                    <RegionGrid>
                    {suggestions.popularSearches.map((item, index) => (
                        <RegionItem
                        key={item.name || index}
                          onClick={() => handleLocationSelect(item.name)}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        >
                        <CategoryBadge>{item.type}</CategoryBadge>
                        <MapImage>
                          <MapPin size={24} style={{ color: "#1e40af" }} />
                        </MapImage>
                          <RegionLabel>{item.name}</RegionLabel>
                        </RegionItem>
                      ))}
                    </RegionGrid>
                  </Section>
              </div>
                </DropdownContainer>
              )}
        </AnimatePresence>
      </SearchItem>

      <SearchItem>
        <Calendar size={20} />
        <DropdownDatePicker dynamicStyle={{ top: "70px", left: "50%" }} />
      </SearchItem>

      <SearchItem>
        <Users size={20} />
        <NumberInput
          ref={guestInputRef}
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          placeholder="Add guests"
        />
      </SearchItem>

      <SearchItem>
        <SearchButton 
          onClick={onSearch}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Search size={18} />
          Search
        </SearchButton>
      </SearchItem>
    </SearchWrapper>
  );
}

// Add PropTypes validation
SearchFilters.propTypes = {
  location: PropTypes.string.isRequired,
  setLocation: PropTypes.func.isRequired,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  setDate: PropTypes.func.isRequired,
  adults: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setAdults: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired
};

