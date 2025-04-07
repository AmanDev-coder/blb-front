import React, { useState } from "react";
import YachtsList from "./YachtsList";
import TripDuration from "./TripDuration";
import DepartureTimesModal from "./DepartureTimesModal";
import AvailabilityModal from "./AvailabilityModal";
import CharterTypeDropdown from "./CharterTypeDropdown";
import TripDescription from "./TripDescription";
import PricingAccordion from "./PricingAccordion";
import "./InstabookModal.css";
import { useDispatch } from "react-redux";
import { addInstaBook } from "../../../Redux/yachtReducer/action";

const InstabookModal = ({
  isOpen,
  onClose,
  selectedDate,
  selectedEvent,
  onSave,
  onCancel,
}) => {
  const [selectedYacht, setSelectedYacht] = useState(
    selectedEvent?.bookingDetails?.yacht || null
  );
  const [tripDuration, setTripDuration] = useState(
    selectedEvent?.bookingDetails?.tripDuration || 1
  );
  const [charterType, setCharterType] = useState(
    selectedEvent?.bookingDetails?.charterType || ""
  );
  const [tripDescription, setTripDescription] = useState(
    selectedEvent?.bookingDetails?.tripDescription || ""
  );
  const [pricing, setPricing] = useState(
    selectedEvent?.bookingDetails?.pricing || { baseCost: "", captainCost: "" }
  );
  const [departureTimes, setDepartureTimes] = useState(
    selectedEvent?.bookingDetails?.departureTimes || null
  );
  const [availabilityDates, setAvailabilityDates] = useState(
    selectedEvent?.bookingDetails?.availabilityDates || []
  );

  const [showDepartureModal, setShowDepartureModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [instabookTripTimes, setInstaBookTimes] = useState([]);
  const dispatch = useDispatch();
  const handleDepartureModalToggle = () =>
    setShowDepartureModal(!showDepartureModal);

  const handleAvailabilityModalToggle = () =>
    setShowAvailabilityModal(!showAvailabilityModal);

  const handleDepartureTimesSave = (times) => {
    if (times.type == "flexible") {
      console.log(times);

      const t = {
        minStartTime: times.times.earliest,
        maxStartTime: times.times.latest,
      };

      console.log(t);
      setInstaBookTimes([t]);
    } else if (times.type == "fixed") {
      const timesArray = times.times.map((time) => ({
        minStartTime: time,
        maxStartTime: time,
      }));
      setInstaBookTimes(timesArray);
    }
    setDepartureTimes(times);
    setShowDepartureModal(false);
  };

  const handleAvailabilitySave = (dates) => {
    setAvailabilityDates(dates);
    setShowAvailabilityModal(false);
  };

  const handlePublish = () => {
    const bookingData = {
      yacht: selectedYacht,
      yachtId: selectedYacht._id,
      date:selectedDate,
      tripDuration,
      charterType,
      captained: charterType == "independentCaptain" ? true : false,
      tripDescription,
      pricing,
      departureTimes,
      instabookTripTimes,
      availabilityDates,
    };
    console.log(bookingData);
    // Pass booking data to parent component with 'publish' status
    onSave(bookingData, "published");
    dispatch(addInstaBook(bookingData));
  };

  const handleSaveDraft = () => {
    const bookingData = {
      yacht: selectedYacht,
      tripDuration,
      charterType,
      tripDescription,
      pricing,
      departureTimes,
      availabilityDates,
    };
    onSave(bookingData, "draft");
  };

  const handleCancelConfirmation = () => {
    onCancel(selectedEvent);
  };

  const getImageUrl = (images) => {
    if (images && images.length > 0) {
      return images[0].imgeUrl; // Fetch first image URL from array
    }
    return "./png"; // Return placeholder if no images
  };

  console.log(departureTimes, instabookTripTimes, pricing);
  return (
    isOpen && (
      <div className="instant-booking-modal">
        <div className="modal-container">
          {selectedEvent ? (
            <div className="cancel-booking-modal">
              <h2>Cancel Booking</h2>
              <p>Do you want to cancel the booking for this package?</p>
              <div className="modal-footer">
                <button
                  className="btn-primary"
                  onClick={handleCancelConfirmation}
                >
                  Confirm
                </button>
                <button className="btn-secondary" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="modal-header">
                <h2>Instant Booking</h2>
                <button className="close-btn" onClick={onClose}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                {!selectedYacht ? (
                  <YachtsList onYachtSelect={setSelectedYacht} />
                ) : (
                  <>
                    <div className="yacht-info">
                      <img
                        src={getImageUrl(selectedYacht.images)}
                        alt={selectedYacht.title || "No Title Provided"}
                        className="yacht-image"
                      />
                      <div>
                        <h3>{selectedYacht.title}</h3>
                        <p>{selectedYacht.short_description}</p>
                      </div>
                    </div>
                    <TripDuration
                      tripDuration={tripDuration}
                      setTripDuration={setTripDuration}
                    />
                    <button
                      className="btn-primary"
                      onClick={handleDepartureModalToggle}
                    >
                      Configure Departure Times
                    </button>
                    {/* <p>{`${departureTimes?.times?.earliest} - ${departureTimes?.times?.latest}` }</p> */}
                    <CharterTypeDropdown
                      onSelect={setCharterType}
                      selectedType={charterType}
                    />
                    <TripDescription
                      description={tripDescription}
                      onUpdate={setTripDescription}
                    />
                    <PricingAccordion
                      pricing={pricing}
                      onPricingChange={setPricing}
                      charterType={charterType}
                    />
                    <button
                      className="btn-secondary"
                      onClick={handleAvailabilityModalToggle}
                    >
                      Set Availability
                    </button>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-primary" onClick={handlePublish}>
                  Publish
                </button>
                <button className="btn-secondary" onClick={handleSaveDraft}>
                  Save as Draft
                </button>
              </div>
            </>
          )}
        </div>
        {showDepartureModal && (
          <DepartureTimesModal
            isOpen={showDepartureModal}
            onClose={handleDepartureModalToggle}
            onSave={handleDepartureTimesSave}
            tripDuration={tripDuration}
          />
        )}
        {showAvailabilityModal && (
          <AvailabilityModal
            isOpen={showAvailabilityModal}
            onClose={handleAvailabilityModalToggle}
            onDatesSelected={handleAvailabilitySave}
            preselectedDates={availabilityDates}
          />
        )}
      </div>
    )
  );
};

export default InstabookModal;
