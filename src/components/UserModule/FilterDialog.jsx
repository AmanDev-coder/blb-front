

import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
// import { YachtContext } from "../../YachtContext"; // Import the YachtContext
import { Slider } from "antd"; // Import the Slider component from Ant Design
import { ConfigProvider } from "antd";
import { useSearchParams } from "react-router-dom";
import DropdownDatePicker from "./HomeComponents/DatePicker";
import SearchForm from "./HomeComponents/SearchForm";
import SearchFilters from "./HomeComponents/SearchForm";
// import 'antd/dist/antd.css'; // Ensure Ant Design styles are imported
import data from '../../data/data.json' 
const DialogContainer = styled.div`
  // background-color: #ffffff !important;
  border-radius: 16px !important;
  overflow: hidden !important;
  padding: 1rem !important;
  // box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
  // width: 300px !important;
  max-width: 1200px; /* Increased width for a wider container */
  // margin: 2rem auto;
  align-items: left;
  // transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    // transform: translateY(-5px);
    // box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

const Content = styled.div`
  max-height: 70vh !important;
  overflow-y: auto !important;

  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #007bff;
    border-radius: 50%;
  }

  -ms-overflow-style: none;
  scrollbar-width: thin;
  scrollbar-radius: 8px;
  scrollbar-color: #007bff transparent;
`;

const Title = styled.h2`
  text-align: center !important;
  margin-bottom: 20px !important;
  font-size: 1.5rem !important; /* Reduced font size */
  color: #333 !important;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
`;

const FilterSection = styled.div`
  margin-bottom: 24px !important;
  padding: 1.5rem !important;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

  &:hover {
    // box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  h3 {
    font-size: 1.2rem; /* Reduced font size for headings */
    font-weight: 600;
    color: #007bff;
    margin-bottom: 12px;
    text-transform: capitalize;
    letter-spacing: 0.5px;
  }
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 1rem; /* Slightly reduced font size */
  color: #555;

  input {
    width: 16px;
    height: 16px;
    border: 2px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    flex: 0 0 16px;
  }

  input:checked {
    background-color: #007bff;
    border-color: #007bff;
  }
`;

const ShowMoreButton = styled.button`
  background: #007bff !important;
  color: #fff !important;
  border: none !important;
  padding: 8px 16px !important;
  font-size: 0.8rem !important; /* Reduced font size */
  font-weight: 600 !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  margin-top: 10px !important;
  // transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const PriceInputContainer = styled.div`
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 12px;
`;

const PriceInput = styled.input`
  width: 80% !important;
  padding: 12px !important;
  margin: 10px 0 !important;
  border: 1px solid #ddd !important;
  border-radius: 6px !important;
  box-sizing: border-box !important;
  font-size: 1rem;
  // transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex !important;
  justify-content: space-between !important;
  margin-top: 20px !important;
  gap: 16px;
`;

const StyledButton = styled.button`
  padding: 10px 16px !important; /* Reduced padding for compact design */
  border: none !important;
  font-family: "Work-sans", sans-serif !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  font-size: 0.9rem !important; /* Reduced font size */
  color: #fff !important;
  background-color: #007bff !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  // transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #0056b3 !important;
    // transform: translateY(-2px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.3);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;


const FilterDialog = ({
  yachts,
  selectedFilters,
  setSelectedFilters,
  searchParams,
  setSearchParams,
}) => {
  // const { setFilteredYachts } = useContext(YachtContext); // Access the context
  console.log(yachts);
  // Calculate min and max prices from the yacht data
  const prices = yachts?.map((yacht) => yacht?.priceDetails?.price);
  const initialMinPrice = Math.min(...prices);
  const initialMaxPrice = Math.max(...prices);
  // const [searchParams, setSearchParams] = useSearchParams();
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
console.log(searchParams.getAll("location"))
  const [filters, setFilters] = useState({
    capacity: [],
    time: [],
    location: [],
    interests: [],
    crew: [],
    entertainment: [],
    price: { min: 1, max: 500 },
    cuisine: [],
    luxury_level: [],
    safety_features: [],
    amenities: [],
    // ...selectedFilters,
     ...parseSearchParams(searchParams),
  });

  const [visibleCount, setVisibleCount] = useState({
    location: 4,
    capacity: 4,
    time: 4,

    // interests: 4,
    // crew: 4,
    // entertainment: 4,
    // cuisine: 4,
    // luxury_level: 4,
    // safety_features: 4,
    // amenities: 4,
  });

  // Refs for price inputs and checkboxes
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);
  const checkboxRefs = useRef({}); // Object to hold refs for checkboxes
  const theme = {
    token: {
      colorPrimary: "#ff5733", // Replace with your primary color
      colorSuccess: "#28a745", // Replace with your success color
      // Add other global tokens here
    },
    components: {
      Slider: {
        controlSize: 12,
        handleColor: "#ff5733", // Custom color for the slider handle
        handleActiveColor: "#ff6f61",
        handleActiveOutlineColor: "#ff6f61",
        trackBg: "#ff5733", // Custom color for the active track
        railBg: "rgba(176, 176, 176, 0.936)", // Custom rail background
        dotSize: 10,
        handleSize: 14, // Custom handle size
      },
    },
  };
  function parseSearchParams(params) {
    const parsedFilters = {};
    for (const [key, value] of params.entries()) {
      if (key === "min_price" || key === "max_price") {
        // Handle price specifically
        parsedFilters.price = {
          ...parsedFilters.price,
          [key === "min_price" ? "min" : "max"]: Number(value),
        };
      } else {
        // Parse array-like params
        parsedFilters[key] = value.split(",");
      }
    }
    return parsedFilters;
  }
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      ...selectedFilters,
    }));
    console.log(filters);
  }, [selectedFilters]);

  // useEffect(() => {
  //   const paramsObj = {
  //     min_price: filters?.price.min,
  //     max_price: filters?.price.max,
  //     location:filters.location.length>0?filters.location:searchParams.get("location")
  //   };
   
  // }, [filters]);

  // useEffect(() => {
  //   const paramsObj = {
  //     min_price: filters?.price.min,
  //     max_price: filters?.price.max,
  //   };
  
  //   // Dynamically add filters to paramsObj if they exist
  //   ['location', 'capacity'].forEach((key) => {
  //     const filterValue = filters[key]; // Filters state
  //     const searchValue = searchParams.get(key); // Existing URL param
  
  //     if (searchValue) {
  //       paramsObj[key] = searchValue; // Prioritize URL param
  //     } else if (Array.isArray(filterValue) && filterValue.length > 0) {
  //       paramsObj[key] = filterValue; // Add filters state if no URL param
  //     }
  //   });
  
  //   // Update URL with the new params
  //   setSearchParams(paramsObj);
  // }, [filters, searchParams, setSearchParams]);
  
  // useEffect(() => {
  //   const paramsObj = {
  //     min_price: filters?.price.min,
  //     max_price: filters?.price.max,
  //   };
  
  //   // Handle dynamic filters
  //   ['location', 'capacity'].forEach((key) => {
  //     const filterValue = filters[key]; // Current filter state
  //     if (Array.isArray(filterValue) && filterValue.length > 0) {
  //       paramsObj[key] = filterValue; // Add only if there are selected values
  //     } else if (searchParams.get(key)) {
  //       paramsObj[key] = searchParams.get(key); // Use existing URL param if available
  //     }
  //   });
  
  //   // Update the search params in the URL
  //   setSearchParams(paramsObj);
  // }, [filters, searchParams, setSearchParams]);
  
  useEffect(() => {
    // Build paramsObj with only valid keys
    const paramsObj = {
      min_price: filters.price.min,
      max_price: filters.price.max,
    };
  
    // Dynamically handle filter keys
    Object.keys(filters).forEach((key) => {
      const filterValue = filters[key];
  
      // Add to paramsObj only if the filter has valid values
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        paramsObj[key] = filterValue; // For array filters like location, capacity, etc.
      } else if (typeof filterValue === "object" && filterValue.min !== undefined) {
        // For price filter object
        paramsObj["min_price"] = filterValue.min;
        paramsObj["max_price"] = filterValue.max;
      }
    });
  
    // Update URL with valid params only
    setSearchParams(paramsObj);
  }, [filters, setSearchParams]);
  
  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const newValues = prev[category]?.includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...(prev[category] || []), value]; // Ensure prev[category] is an array
      return { ...prev, [category]: newValues };
    });
  };

  const applyAndClose = () => {
    setFilteredYachts(
      data.yachts.filter((yacht) => {
        const matchesPrice =
          yacht.price >= filters.price.min && yacht.price <= filters.price.max; // Updated price matching
        const matchesTime =
          filters.time.length === 0 ||
          filters.time.some((time) => yacht.timings.includes(time));
        const matchesLocation =
          filters.location.length === 0 ||
          filters.location.some((loc) => yacht.location.includes(loc));
        const matchesInterests =
          filters.interests.length === 0 ||
          (yacht.interests &&
            filters.interests.some((interest) =>
              yacht.interests.includes(interest)
            ));
        const matchesCrew =
          filters.crew.length === 0 ||
          filters.crew.includes(yacht.features.crew);
        const matchesEntertainment =
          filters.entertainment.length === 0 ||
          (yacht.features.entertainment &&
            filters.entertainment.some((ent) =>
              yacht.features.entertainment.includes(ent)
            ));
        const matchesCuisine =
          filters.cuisine.length === 0 ||
          (yacht.cuisine &&
            filters.cuisine.some((cuisine) => yacht.cuisine.includes(cuisine)));
        const matchesLuxuryLevel =
          filters.luxury_level.length === 0 ||
          filters.luxury_level.includes(yacht.luxury_level);
        const matchesSafetyFeatures =
          filters.safety_features.length === 0 ||
          (yacht.safety_features &&
            filters.safety_features.some((safety) =>
              yacht.safety_features.includes(safety)
            ));
        const matchesCapacity =
          filters.capacity.length === 0 ||
          filters.capacity.includes(yacht.features.capacity);
        const matchesAmenities =
          filters.amenities.length === 0 ||
          (yacht.features.amenities &&
            filters.amenities.some((amenity) =>
              yacht.features.amenities.includes(amenity)
            ));

        return (
          matchesPrice &&
          matchesTime &&
          matchesLocation &&
          matchesInterests &&
          matchesCrew &&
          matchesEntertainment &&
          matchesCuisine &&
          matchesLuxuryLevel &&
          matchesSafetyFeatures &&
          matchesCapacity &&
          matchesAmenities
        );
      })
    );
  };

  const resetFilters = () => {
    setFilters({
      time: [],
      location: [],
      interests: [],
      price: { min: initialMinPrice, max: initialMaxPrice }, // Reset to initial values
      cuisine: [],
      luxury_level: [],
      safety_features: [],
      capacity: [],
      amenities: [],
      crew: [],
      entertainment: [],
    });

    // Reset the slider values
    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);

    // Uncheck all checkboxes
    Object.keys(checkboxRefs.current).forEach((key) => {
      if (checkboxRefs.current[key]) {
        checkboxRefs.current[key].checked = false;
      }
    });
  };

  const uniqueValues = (key) => {
    const values = data.yachts.flatMap((yacht) => {
      if (key === "location") {
       const location= yacht.location.split(", ").map((loc) => loc.trim()); // Split locations
       if(searchParams.get("location")){
        const searchParamLocation = searchParams.get("location").toLowerCase();
        const locationParts = searchParamLocation.split('-');
        
        // Check if any part of search param location already exists (case insensitive)
        const locationExists = location.some(loc => 
          locationParts.some(part =>
            loc.toLowerCase() === part
          )
        );
        console.log(locationExists)

        if (!locationExists) {
          location.push(searchParams.get("location"));
        }
        // location.push(searchParams.get("location"))
       }
       return location
      }
      if (key === "time") {
        return yacht.timings; // Return timings directly
      }
      if (key === "capacity") {
        const capacities= [yacht.features.capacity]; // Return capacity as an array
        if(searchParams.get("capacity")){
          capacities.push(searchParams.get("capacity"))
         }
         return capacities
      }
      if (key === "amenities") {
        return yacht.features.amenities || [];
      }
      if (key === "crew") {
        return [yacht.features.crew]; // Return crew as an array
      }
      if (key === "entertainment") {
        return yacht.features.entertainment || [];
      }
      if (key === "luxury_level") {
        return [yacht.luxury_level]; // Return luxury level as an array
      }
      if (key === "cuisine") {
        return yacht.cuisine || [];
      }
      return yacht[key] || [];
    });
    return [...new Set(values)];
  };

  const handleShowMore = (category) => {
    setVisibleCount((prev) => ({
      ...prev,
      [category]: prev[category] + 4, // Increase visible count by 4
    }));
  };
  console.log(filters);
  return (
    <DialogContainer>
      <Content>
        {/* <Title>Search Options</Title>
   <SearchFilters/> */}
        {/* <Title>Filter Options</Title> */}
        {/* Price Filter with Custom Ant Design Slider */}
        <FilterSection>
          {/* <DropdownDatePicker/> */}
          <h3>Price</h3>
          <ConfigProvider theme={theme}>
            <Slider
              range
              value={[filters.price.min, filters.price.max]} // Use current filter values
              min={initialMinPrice}
              max={initialMaxPrice}
              step={50}
              tabIndex={0} // Ensure the slider is focusable
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  price: { min: value[0], max: value[1] },
                }))
              } // Update filters on change
            />
          </ConfigProvider>
        </FilterSection>
        {/* Other Filters */}
        {Object.keys(visibleCount).map((category) => (
          <FilterSection key={category}>
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            {uniqueValues(category)
              .slice(0, visibleCount[category])
              .map((value) => (
                <FilterLabel key={value}>
                  <input
                    type="checkbox"
                    ref={(el) => (checkboxRefs.current[value] = el)} // Attach ref to each checkbox
                    onChange={() => handleFilterChange(category, value)}
                    checked={
                      searchParams.has(category) &&
                      searchParams.getAll(category).includes(value)
                    } // Dynamically check based on category
                  />
                  {value}
                </FilterLabel>
              ))}
            {uniqueValues(category).length > visibleCount[category] && (
              <ShowMoreButton onClick={() => handleShowMore(category)}>
                Show More
              </ShowMoreButton>
            )}
          </FilterSection>
        ))}
      </Content>
      <ButtonContainer>
        <StyledButton variant="outline" onClick={resetFilters}>
          Reset All
        </StyledButton>
        <StyledButton onClick={applyAndClose}>Show Results</StyledButton>
      </ButtonContainer>
    </DialogContainer>
  );
};

export default FilterDialog;
