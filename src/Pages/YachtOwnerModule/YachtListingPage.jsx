import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { TextField } from "@mui/material";
import { Search, AddCircle } from "@mui/icons-material";
// import AddYachtModal from "./AddYachtModal";
import ListingCard from "../../components/YachtOwnerModule/ListingCard";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteYachtListing,
  EditYachtListing,
  getOwnerYachts,
} from "../../Redux/yachtReducer/action";
import AddYachtModal from "../../components/YachtOwnerModule/ListingModal/AddYacht";
// import { AddYachtModal } from "./MultiStepForm/AddYachtModal";

const MainContainer = styled.div`
  display: flex;
  margin-top: 2%;
  overflow-y: auto;
  height: 100vh;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  flex: 1.5;
  margin-right: 10px;
  max-width: 800px;
  border-radius: 50px;
  border: 1px solid #000000;
`;

const SearchInput = styled(TextField)`
  flex-grow: 1;
  margin-right: 10px;

  & .MuiOutlinedInput-root {
    height: 40px;
    border-radius: 50px;

    &.Mui-focused {
      border: 1px solid #3f51b5;
      box-shadow: 0 0 0 0.2rem rgba(63, 81, 181, 0.25);
    }
  }
`;

const ListingContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  min-height: 70vh;
`;

const CustomButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: red;
  color: white;
  border-radius: 50px;
  width: 30%;
  height: 40px;
  cursor: pointer;
  padding: 0 10px;

  &:hover {
    background-color: darkred;
  }
`;
const init = {
  // Step 1: Essentials
  id: Math.random().toString(36).substr(2, 9),
  title: "", // Yacht listing title
  shortName: "", // Short name for quick identification
  description: "", // Detailed description of the yacht
  short_description: "", // Short description for the backend
  status: "draft",
  stepCompleted: 0,
  isLive: false,
  // Step 2: Location
  location: {
    country: "",
    state: "",
    city: "",
    town: "",
    address: "",
    coordinates: {
      coordinates: [20.0, 0.0],
    },
  },
  // Step 3: Capacity and Categories
  capacity: 0, // Number of passengers
  categories: [
    {
      categoryId: null,
      subcategoryId: null, // Subcategory ID
      categoryName: "", // Main category name
      subcategoryName: "", // Subcategory name
    },
  ], // Dynamic array for multiple categories

  // Step 4: Photos
  photos: [], // Array of photo files or URLs for the carousel display

  // Step 5: Vessel Details
  make: "", // Manufacturer of the yacht
  model: "", // Yacht model
  year: "", // Year of manufacture
  length: "", // Yacht length in feet

  features: {
    make: "",
    model: "",

    year: 0,
    length: 0,
    engines: [
      {
        number_engines: 0, // Unique ID for each engine
        engine_horsepower: 0, // Engine horsepower
        engine_brand: "", // Manufacturer of the engine
        engine_model: "", // Model of the engine
        fuelType: "Diesel", // Fuel type
      },
    ],
    amenities: [],
  },

  // Array of selected features

  // Array for multiple engine specifications

  // Step 6: Pricing
  priceDetails: {
    // unit: "", // "daily", "hourly", or "daily & hourly"
    type: "",
    daily: {
      rate: 0, // Rate per day
      minDays: 0, // Minimum days for booking
      maxDays: 30, // Maximum days for booking
    },
    hourly: {
      rate: 0, // Rate per hour
      minDuration: 0, // Minimum trip duration in hours
      maxDuration: 12, // Maximum trip duration in hours
    },
    person: {
      rate: 0, // Rate per person
      minPersons: 1, // Minimum number of persons
    },
    captainProvided: false, // Whether a captain is provided
    captainPrice: 0, // Additional price for captain service
    currency: {
      code: "USD",
      symbol: "$",
    },
  },

  // Step 7: Cancellation Policy and Availability
  securityAllowance: 0, // Security deposit amount
  rentalAgreement: "Default rental agreement text here...", // Agreement terms
  cancellationPolicy: {
    daysPrior: 0,
    refund: 0,
  },
  // Availability criteria
  availability_criteria: {
    startTime: "08:00", // Start time for bookings
    endTime: "20:00", // End time for bookings
    bufferTime: "30 minutes", // Buffer time between bookings
    min_hours: 2, // Minimum hours for a booking
    max_hours: 12, // Maximum hours for a booking
    Is_day: false, // Toggle for full-day bookings
    min_days: 1, // Minimum days for a booking
    max_days: 30, // Maximum days for a booking
  },

  // Step 8: Preview
  preview: {
    summary: "", // Summary of the yacht's key features
    details: {}, // Additional details to display during preview
  },
};
const YachtListingPage = () => {

  const dispatch = useDispatch();
  const OwnerYachts = useSelector((store) => store.yachtReducer.OwnerYachts);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [ListingData, setListingData] = useState(init);

  
  useEffect(() => {
    dispatch(getOwnerYachts);
  }, [modalOpen]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredYachts = useMemo(() => {
    return OwnerYachts.filter((listing) =>
      listing.title.toLowerCase().includes(searchTerm)
    );
  }, [OwnerYachts, searchTerm]);

  const handleAddYacht = () => {
    setModalMode("create");
    setListingData(init);
    setModalOpen(true);
  };

  const handleEdit = (id) => {
    const yachtToEdit = OwnerYachts.find((el) => el._id === id);
    setListingData(yachtToEdit);
    setModalOpen(true);
    setModalMode("edit");
  };

  const handleDeleteListing = async (id) => {
    try {
      await dispatch(DeleteYachtListing(id)).then(()=>   dispatch(getOwnerYachts));
    } catch (error) {
      console.error("Failed to delete listing:", error);
    }
  };

  const handlePublish = (id,isLive) => {
    
    dispatch(EditYachtListing(id,{isLive:!isLive})).then(()=>dispatch(getOwnerYachts))
    handleMenuClose();

  };
  return (
    <MainContainer>
      <ContentContainer>
        <ActionContainer>
          <SearchContainer>
            <SearchInput
              variant="outlined"
              placeholder="Search Listings"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                endAdornment: <Search />,
              }}
            />
          </SearchContainer>
          <CustomButton onClick={handleAddYacht}>
            <AddCircle style={{ marginRight: "5px" }} /> Add Yacht
          </CustomButton>
        </ActionContainer>

        <ListingContainer>
          {filteredYachts.length > 0 ? (
            filteredYachts.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                onEdit={() => handleEdit(listing._id)}
                onDelete={() => handleDeleteListing(listing._id)}
                onPublish={()=>handlePublish(listing._id,listing.isLive)}
              />
            ))
          ) : (
            <p>No listings found</p>
          )}
        </ListingContainer>

        <AddYachtModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          ListingData={ListingData}
          mode={modalMode}
        />
      </ContentContainer>
    </MainContainer>
  );
};

export default YachtListingPage;
