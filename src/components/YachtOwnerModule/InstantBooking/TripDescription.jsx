import React, { useState } from "react";
import "./TripDescription.css";

const TripDescription = ({ onUpdate }) => {
  const [description, setDescription] = useState("");
  const maxChars = 1000;

  const handleChange = (event) => {
    const value = event.target.value.slice(0, maxChars); // Limit input to maxChars
    setDescription(value);
    onUpdate(value); // Notify parent of updates
  };

  return (
    <div className="trip-description">
      <label htmlFor="description" className="description-label">
        Long Trip Description
      </label>
      <textarea
        id="description"
        value={description}
        onChange={handleChange}
        className="description-textarea"
        placeholder="Provide details about the trip..."
      ></textarea>
      <div className="character-counter">
        {maxChars - description.length} characters remaining
      </div>
    </div>
  );
};

export default TripDescription;
