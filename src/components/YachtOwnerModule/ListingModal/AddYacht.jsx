import React, { useEffect, useRef, useState } from "react";
import "../../../Styles/AddYachtModal.scss";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import {
  AddPhotos,
  AddYachtsListing,
  EditYachtListing,
} from "../../../Redux/yachtReducer/action";
import { Typography } from "@mui/material";

import LocationSelect from "./LocationSelect";
import StepEssentials from "./StepEssentials";
import StepCapacityAndCategories from "./StepCapacityAndCategories";
import StepVesselDetails from "./StepVesselDetails";
import StepPhotos from "./StepPhotos";
import StepPricing from "./StepPricing";
import StepCancellationPolicy from "./StepCancellationPolicy";
import StepPreview from "./StepPreview";

const MainContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
`;

const StepContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; /* Center the steps and lines */
  margin-top: 50px;
  position: relative;

  :before {
    content: "";
    position: absolute;
    background: #f3e7f3;
    height: 2px; /* Reduced thickness */
    width: calc(100% - 30px); /* Offset for the circle area */
    top: 50%;
    left: 15px; /* Start the line after the first circle */
    transform: translateY(-50%);
    z-index: 0; /* Behind the steps */
  }

  :after {
    content: "";
    position: absolute;
    background: #4a154b;
    height: 2px; /* Reduced thickness */
    width: ${({ width }) =>
      `calc(${width} - 30px)`}; /* Offset for the circle area */
    top: 50%;
    left: 15px; /* Start the line after the first circle */
    transition: 0.4s ease;
    transform: translateY(-50%);
    z-index: 0; /* Behind the steps */
  }
`;

const StepWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const StepStyle = styled.div`
  width: 30px; /* Step circle size */
  height: 30px; /* Step circle size */
  border-radius: 50%;
  background-color: #ffffff;
  border: 2px solid
    ${({ step }) => (step === "completed" ? "#4A154B" : "#F3E7F3")};
  transition: 0.4s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1; /* Bring the step circle above the line */
`;

const StepCount = styled.span`
  font-size: 14px; /* Adjusted font size */
  color: ${({ isCompleted }) => (isCompleted ? "#4a154b" : "#f3e7f3")};
`;

const CheckMark = styled.div`
  font-size: 16px; /* Adjust the size of the checkmark */
  font-weight: bold;
  color: #4a154b; /* Match the color of completed steps */
  transform: scaleX(1) rotate(10deg); /* Rotate to create a checkmark */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const steps = [
  { label: "Essentials", step: 1 },
  { label: "Location", step: 2 },
  { label: "Capacity", step: 3 },
  { label: "Details", step: 4 },
  { label: "Photos", step: 5 },
  { label: "Pricing", step: 6 },
  { label: "Policy", step: 7 },
  { label: "Preview", step: 8 },
];

const init = {
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
    name: "",
    country: "",
    state: "",
    city: "",
    town: "",
    address: "",
    coordinates: {
      coordinates: [20.0, 0.0],
    },
    geoPoint: {
      type: "Point",
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
  images: [], // Array of photo files or URLs for the carousel display

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

  // Step 6: Pricing
  priceDetails: {
    // unit: "", // "daily", "hourly", or "daily & hourly"
    type: "hourly",
    daily: {
      rate: 0, // Rate per day
      minDays: 0, // Minimum days for booking
      maxDays: 30,
    },
    hourly: {
      rate: 0,
      minDuration: 0,
      maxDuration: 12,
    },
    person: {
      rate: 0,
      minPersons: 1,
    },
    captainProvided: false,
    captainPrice: 0,
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

const AddYachtModal = ({ open, onClose, ListingData, mode }) => {
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [showBreakdown, setShowBreakdown] = useState(false); // For showing the pricing breakdown modal
  const [useCoordinates, setUSeCordinates] = useState(false);

  const [errors, setErrors] = useState({});
  const [ListedYachtID, setListedYachtID] = useState("");

  const [formData, setFormData] = useState(init);

  useEffect(() => {
    if (mode === "edit" && ListingData) {
      setFormData(ListingData);
      setListedYachtID(ListingData._id);
    } else {
      setFormData(init);
    }
  }, [mode, ListingData, init]);

  const totalSteps = steps.length;
  const width = `${(100 / (totalSteps - 1)) * (step - 1)}%`;

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleStepClick = (stepNumber) => {
    // Validate only if moving forward
    if (stepNumber < step && !validateStep()) {
      return; // Stop if validation fails
    }
    setStep(stepNumber);
  };

  const handleSave = () => {
    if (step === 8) {
      // Pass the form data to the parent component for rendering a card
      onAdd({
        ...formData,
        // Generate a unique ID for each listing
      });
      onClose();
    } else {
      handleNext();
    }
  };

  const saveToDb = async () => {
    // Perform validation
    if (!validateStep()) {
      console.log("Validation failed. No data sent to the backend.");
      return; // Exit if validation fails
    }

    if (mode == "edit") {
    }
    if (step === 1 && mode !== "edit") {
      console.log(step);
      const newData = { ...formData, stepCompleted: step };
      // console.log(first)
      const yacht = await dispatch(AddYachtsListing(newData));
      console.log(yacht);
      setListedYachtID(yacht?.yachtId);
      handleNext(); // Move to the next step
    } else if (step == 5) {
     const newPhotos = formData.images.filter((image) => image instanceof File); // Filter only file objects

     if (newPhotos.length > 0) {
       dispatch(AddPhotos(ListedYachtID, newPhotos)); // Send only new photos to the API
     } else {
       console.log("No new photos to upload.");
     }
      handleNext();
    } else if (step === 8) {
      onClose();
    } else {
      // Handle saving for other steps (Edit existing yacht)

      const filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([key, value]) =>
            value !== null && value !== undefined && value !== ""
        )
      );
      // Prevent unnecessary backend requests
      if (Object.keys(filteredFormData).length === 0) {
        console.log("No changes detected. No backend request made.");
        return;
      }
      const newData = { ...filteredFormData, stepCompleted: step };
      console.log(newData);

      dispatch(EditYachtListing(ListedYachtID, newData));

      handleNext();
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
  };

  const handleEngineChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedEngines = [...prev.features.engines];
      updatedEngines[index][field] = value;
      console.log(updatedEngines);
      return { ...prev, ...prev.features, engines: updatedEngines };
    });
  };
  const extractLocationData = (placeDetails) => {
    const { address_components, geometry, formatted_address,name } = placeDetails;
  
    const getComponent = (type) => {
      const component = address_components.find(comp => comp.types.includes(type));
      return component ? component.long_name : "";
    };
  
    return {
      name: name,
      country: getComponent("country"),
      countryCode: getComponent("country") ? getComponent("country").substring(0, 2).toUpperCase() : "",
      state: getComponent("administrative_area_level_1"),
      stateCode: getComponent("administrative_area_level_1") ? getComponent("administrative_area_level_1").substring(0, 2).toUpperCase() : "",
      county: getComponent("administrative_area_level_2"),
      city: getComponent("locality") || getComponent("sublocality") || "",
      postalCode: getComponent("postal_code") || "",
      address: formatted_address,
      formattedAddress: formatted_address,
      lat: geometry.location.lat,
      lng: geometry.location.lng,
      geoPoint: {
        type: "Point",
        coordinates: [geometry.location.lng, geometry.location.lat],
      },
      region: "North America" // Assuming based on your description
    };
  };
  const handleAddressSelect = async (place) => {
    // Extract details from the place object
    console.log("place",place)
    const locationDetails =extractLocationData(place);
    console.log("locationDetails",locationDetails)


    setFormData((prev) => ({
      ...prev,
      location: locationDetails,
    }));
  };
  const parseAddressComponents = (addressComponents) => {
    const components = {};

    addressComponents.forEach((component) => {
      if (component.types.includes("country")) {
        components.country = component.long_name;
      }
      if (component.types.includes("administrative_area_level_1")) {
        components.state = component.long_name;
      }
      if (component.types.includes("locality")) {
        components.city = component.long_name;
      }
      if (component.types.includes("sublocality")) {
        components.town = component.long_name;
      }
      if (component.types.includes("postal_code")) {
        components.postalCode = component.long_name;
      }
    });

    return components;
  };

 

  const calculateCommission = (data) => {
    const base =
      (data.priceDetails.type === "daily" || data.priceDetails.type === "both"
        ? data.priceDetails.daily.rate * data.priceDetails.daily.minDays
        : 0) +
      (data.priceDetails.type === "hourly" || data.priceDetails.type === "both"
        ? data.priceDetails.hourly.rate * data.priceDetails.hourly.minDuration
        : 0) +
      (data.priceDetails.captainProvided ? data.priceDetails.captainPrice : 0);

    return (base * 12) / 100;
  };

  const calculateTotalRevenue = (data) => {
    const base =
      (data.priceDetails.type === "daily" || data.priceDetails.type === "both"
        ? data.priceDetails.daily.rate * data.priceDetails.daily.minDays
        : 0) +
      (data.priceDetails.type === "hourly" || data.priceDetails.type === "both"
        ? data.priceDetails.hourly.rate * data.priceDetails.hourly.minDuration
        : 0) +
      (data.priceDetails.captainProvided ? data.priceDetails.captainPrice : 0);

    return base - calculateCommission(data);
  };

  const handlepriceDetailsTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      priceDetails: { ...prev.priceDetails, type },
    }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.title.trim())
        newErrors.title = "Listing Title is required.";
      if (!formData.shortName.trim())
        newErrors.shortName = "Short Name is required.";
      if (!formData.short_description.trim())
        newErrors.short_description = "Short Description is required.";
      if (!formData.description.trim())
        newErrors.description = "Description is required.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } else if (step === 2) {
      if (!useCoordinates) {
        if (!formData.location.address.trim())
          newErrors.location = "Address is required.";
      } else {
        if (!formData.coordinates.lat || !formData.coordinates.lng) {
          newErrors.coordinates = "Latitude and Longitude are required.";
        }
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } else if (step === 3) {
      if (!formData.capacity || formData.capacity <= 0) {
        newErrors.capacity = "Capacity must be greater than zero.";
      }
      formData.categories.forEach((category, index) => {
        if (!category.categoryId) {
          newErrors.categories = `Main category #${index + 1} is required.`;
        }
        if (!category.subcategoryId) {
          newErrors.categories = `Subcategory #${index + 1} is required.`;
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } else if (step === 4) {
      if (!formData.features.make) newErrors.make = "Make is required.";
      if (!formData.features.model) newErrors.model = "Model is required.";
      if (
        !formData.features.year ||
        formData.features.year < 1900 ||
        formData.features.year > new Date().getFullYear()
      ) {
        newErrors.year = "Please enter a valid year.";
      }
      if (!formData.features.length || formData.features.length <= 0) {
        newErrors.length = "Length must be greater than zero.";
      }
      if (formData.features.length === 0) {
        newErrors.features = "Please select at least one feature.";
      }
      formData.features.engines.forEach((engine, index) => {
        if (!engine.number_engines)
          newErrors.engines = `Engine number #${index + 1} is required.`;
        if (!engine.engine_horsepower)
          newErrors.engines = `Horsepower #${index + 1} is required.`;
        if (!engine.engine_brand)
          newErrors.engines = `Maker #${index + 1} is required.`;
        if (!engine.engine_model)
          newErrors.engines = `Model #${index + 1} is required.`;
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } else if (step === 5) {
      if (formData.images.length < 3) {
        newErrors.images = "At least 3 photos are required.";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } else if (step === 6 && !formData.priceDetails.type) {
      newErrors.priceDetails = "Please select a priceDetails type.";
    } else if (step === 6 && !formData.priceDetails.type) {
      newErrors.priceDetails = "Please select a priceDetails type.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!open) return null;
  if (open && !ListingData && formData._id) return <div>Loading...</div>;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add Yacht</h2>
        <div className="modal-body">
          {/* Step Indicator */}
          <MainContainer>
            <StepContainer width={width}>
              {steps.map(({ step: stepNumber }) => (
                <StepWrapper key={stepNumber}>
                  <StepStyle
                    step={step >= stepNumber ? "completed" : "incomplete"}
                    onClick={() => handleStepClick(stepNumber)}
                    style={{ cursor: "pointer" }}
                  >
                    {step > stepNumber ? (
                      <CheckMark>&#10003;</CheckMark>
                    ) : (
                      <StepCount>{stepNumber}</StepCount>
                    )}
                  </StepStyle>
                </StepWrapper>
              ))}
            </StepContainer>
          </MainContainer>

          {/* Steps will be conditionally rendered here */}
          {/* Step 1: Essentials */}

          {step === 1 && (
            <StepEssentials
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
          )}
          {/* Step 2: Location */}
          {step === 2 && (
            <LocationSelect
              mode={mode}
              useCoordinates={useCoordinates}
              setUSeCordinates={setUSeCordinates}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              handleAddressSelect={handleAddressSelect}
            />
          )}

          {/* Step 3: Capacity and Categories */}
          {step === 3 && (
            <StepCapacityAndCategories
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              handleChange={handleChange}
            />
          )}

          {/* Step 4: Vessel Details */}
          {step === 4 && (
            <StepVesselDetails
              formData={formData}
              errors={errors}
              //     handleFeatureToggle={handleFeatureToggle}
              handleEngineChange={handleEngineChange}
              setFormData={setFormData}
            />
          )}

          {/* Step 5: Photos */}
          {step === 5 && (
            <StepPhotos
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          {/* Step 6: pricing */}
          {step === 6 && (
            <StepPricing
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              showBreakdown={showBreakdown}
              setShowBreakdown={setShowBreakdown}
              calculateCommission={calculateCommission}
              calculateTotalRevenue={calculateTotalRevenue}
            />
          )}

          {/* Step 7: Cancellation Policy and Rental Agreement */}
          {step === 7 && (
            <StepCancellationPolicy
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

       

          {
               step===8 &&<StepPreview formData={formData} onClose={onClose}/>
          }
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="button-discard">
            Discard
          </button>
          <button disabled={step === 1} onClick={handleBack}>
            Back
          </button>
          <button onClick={saveToDb} className="button-save-next">
            {step === 8 ? "Finish" : "Save & Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddYachtModal;
