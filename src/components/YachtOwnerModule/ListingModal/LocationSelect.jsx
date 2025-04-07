import React, { useEffect, useRef, useState } from "react";
import LocationDropdown from "../../UserModule/HomeComponents/LocationDropdown";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import MapWithLocation from "../MapWithLocation";
const LocationSelect = ({
  mode,
  useCoordinates,
  setUSeCordinates,
  formData,
  setFormData,
  errors,
  handleAddressSelect
}) => {
  const [location, setLocation] = useState("");
  const dateInputRef = useRef(null);

  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  console.log(isDropdownVisible);

    useEffect(() => {
      if (mode === "edit" && formData.location) {
        setLocation(formData.location.address);
        // setListedYachtID(ListingData._id) // Prefill with `ListingData` in edit mode
      } else {
        setLocation("");
      }
    }, [mode, formData]);
  return (
    <div className="step">
      <h3>Location</h3>

      {/* Toggle for Location Input Type */}
      <div className="field">
        <label>Pick Location Input Type*</label>
        <div className="toggle-container">
          <span>Use Address</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={useCoordinates}
              onChange={() => setUSeCordinates((prev) => !prev)}
            />
            <span className="slider round"></span>
          </label>
          <span>Use Coordinates</span>
        </div>
      </div>

      {/* Location as Address */}
      {!useCoordinates && (
        <div className="field">
          <label htmlFor="location">Location (Address)*</label>
          <input
            type="text"
            id="location"
            name="address"
            placeholder="Enter the address where the yacht is located..."
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
          />
          {location && isDropdownVisible&& (
            <LocationDropdown
              dropdownRef={dropdownRef}
              location={location}
              setLocation={setLocation}
              setIsDropdownVisible={setIsDropdownVisible}
              dateInputRef={dateInputRef}
              handleAddressSelect={handleAddressSelect}
            />
          )}
          <small>
            Enter the address of where the yacht is located. You can also move
            the pin on the map to adjust the exact location.
          </small>
          {errors.location && <p className="error">{errors.location}</p>}
        </div>
      )}

      {/* Location as Coordinates */}
      {useCoordinates && (
        <div className="field">
          <label htmlFor="latitude">Latitude*</label>
          <input
            type="number"
            id="latitude"
            name="lat"
            placeholder="Enter latitude..."
            value={formData.geoPoint.coordinates[1] || ""}
            onChange={(e) =>
              handleAddressSelect("lat", parseFloat(e.target.value))
            }
          />
          <label htmlFor="longitude">Longitude*</label>
          <input
            type="number"
            id="longitude"
            name="lng"
            placeholder="Enter longitude..."
            value={formData.geoPoint.coordinates[0] || ""}
            onChange={(e) =>
              handleAddressSelect("lng", parseFloat(e.target.value))
            }
          />
          <small>
            Please provide valid coordinates for the yacht's location.
          </small>
          {errors.coordinates && <p className="error">{errors.coordinates}</p>}
        </div>
      )}

      {/* Map Section */}
      <div className="field map-container">
        <label>Map</label>
        <div
          id="map"
          style={{ width: "100%", height: "300px", background: "#ccc" }}
        >
         {/* <GoogleMap
        zoom={12}
        center={mapCenter}
        mapContainerStyle={{ width: "100%", height: "300px" }}
        onClick={handleMapClick}
      >
        <Marker
          position={mapCenter}
          draggable
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap> */}
      {
      
   <MapWithLocation location={  formData?.location}/>
      }
          {/* This is where your map library (e.g., Leaflet or Google Maps) will be embedded */}
          <p>Interactive Map Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default LocationSelect;
