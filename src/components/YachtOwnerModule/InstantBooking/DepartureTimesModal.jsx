import React, { useState } from "react";
import "./DepartureTimesModalStyles.css";

const DepartureTimesModal = ({ isOpen, onClose, onSave }) => {
  const [departureType, setDepartureType] = useState("");
  const [flexibleTimes, setFlexibleTimes] = useState({ earliest: "", latest: "" });
  const [fixedTimes, setFixedTimes] = useState([{ id: 1, time: "" }]);

  const handleFlexibleChange = (key, value) => {
    setFlexibleTimes((prev) => ({ ...prev, [key]: value }));
  };

  const handleFixedChange = (id, value) => {
    setFixedTimes((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, time: value } : slot))
    );
  };

  const addFixedTime = () => {
    setFixedTimes((prev) => [...prev, { id: prev.length + 1, time: "" }]);
  };

  const removeFixedTime = (id) => {
    setFixedTimes((prev) => prev.filter((slot) => slot.id !== id));
  };

  const saveDepartureTimes = () => {
    if (departureType === "flexible") {
      onSave({ type: "flexible", times: flexibleTimes });
    } else if (departureType === "fixed") {
      onSave({ type: "fixed", times: fixedTimes.map((slot) => slot.time) });
    }
    onClose();
  };

  return (
    <div className={`departure-times-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <header className="modal-header">
          <h2>Edit Departure Times</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="modal-body">
          <label className="departure-type-label">Select Departure Type:</label>
          <select
            className="departure-type-dropdown"
            value={departureType}
            onChange={(e) => setDepartureType(e.target.value)}
          >
            <option value="" disabled>
              Choose an option
            </option>
            <option value="flexible">Flexible Departure Times</option>
            <option value="fixed">Fixed Departure Times</option>
          </select>

          {departureType === "flexible" && (
            <div className="flexible-times">
              <label>Earliest Departure:</label>
              <input
                type="time"
                value={flexibleTimes.earliest}
                onChange={(e) => handleFlexibleChange("earliest", e.target.value)}
              />
              <label>Latest Departure:</label>
              <input
                type="time"
                value={flexibleTimes.latest}
                onChange={(e) => handleFlexibleChange("latest", e.target.value)}
              />
              {flexibleTimes.earliest && flexibleTimes.latest && (
                <p className="time-range">
                  Earliest Trip: {flexibleTimes.earliest} -{" "}
                  {flexibleTimes.latest}
                </p>
              )}
            </div>
          )}

          {departureType === "fixed" && (
            <div className="fixed-times">
              <label>Departure Slots:</label>
              {fixedTimes.map((slot) => (
                <div key={slot.id} className="time-slot">
                  <input
                    type="time"
                    value={slot.time}
                    onChange={(e) => handleFixedChange(slot.id, e.target.value)}
                  />
                  <span className="return-time">
                    Return: +23 hrs ({slot.time ? slot.time : "Select time"})
                  </span>
                  <button
                    className="remove-btn"
                    onClick={() => removeFixedTime(slot.id)}
                  >
                    -
                  </button>
                </div>
              ))}
              <button className="add-time-btn" onClick={addFixedTime}>
                + Add Time Slot
              </button>
            </div>
          )}
        </div>
        <footer className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={saveDepartureTimes}>
            Save
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DepartureTimesModal;
