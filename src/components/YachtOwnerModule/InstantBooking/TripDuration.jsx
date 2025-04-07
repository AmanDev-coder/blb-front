import React from "react";
import "./TripDuration.css";

const TripDuration = ({ tripDuration, setTripDuration }) => {
  const incrementDuration = () => setTripDuration((prev) => Math.min(prev + 1, 23));
  const decrementDuration = () => setTripDuration((prev) => Math.max(prev - 1, 1));

  return (
    <div className="trip-duration">
      <label className="trip-duration-label">Trip Duration:</label>
      <div className="trip-duration-controls">
        <button
          className="trip-duration-btn decrement-btn"
          onClick={decrementDuration}
        >
          -
        </button>
        <input
          type="number"
          className="trip-duration-input"
          value={tripDuration}
          readOnly
        />
        <button
          className="trip-duration-btn increment-btn"
          onClick={incrementDuration}
        >
          +
        </button>
        <span className="trip-duration-max">Max: 23 Hours</span>
      </div>
    </div>
  );
};

export default TripDuration;
