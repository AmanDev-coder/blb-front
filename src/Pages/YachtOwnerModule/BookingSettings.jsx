import { useState } from "react";
import styled from "styled-components";
import { ChevronRight, X } from "lucide-react";

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  overflow-y: hidden;
  width: 100%;
  background-color: #ffffff;
`;

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 1200px;
  padding: 30px;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #ffffff;
`;

const HeaderSection = styled.div`
  width: 100%;
  margin-bottom: 20px;

  h2 {
    font-size: 24px;
    margin-bottom: 10px;
    text-align: left;
  }

  p {
    font-size: 14px;
    color: #666;
    text-align: left;
  }
`;

const BookingSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 10px 0;
    width: 100%;
    border-top: 1px solid #e0e0e0;

    &.no-border {
      border-top: none;
    }

    .toggle-label {
      font-size: 16px;
      font-weight: 600;
    }

    .description {
      font-size: 14px;
      color: #666;
      margin-top: 10px;
      text-align: left;
    }
  }

  .toggle-switch {
    position: relative;
    width: 50px;
    height: 25px;
    background: #ccc;
    border-radius: 50px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &.active {
      background-color: #4caf50;
    }

    &::before {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s ease;
    }

    &.active::before {
      transform: translateX(25px);
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  pointer-events: auto; /* Ensure the modal is interactive */
`;

const ModalContainer = styled.div`
  background: #fff;
  width: 500px;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10000;

  h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 10px;
  right: 10px;

  .close-icon {
    cursor: pointer;
    color: #999;

    &:hover {
      color: #333;
    }
  }
`;

const DropdownContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;

  .dropdown-label {
    text-align: left;
    padding-left: 10px;
  }

  .dropdown {
    border: none;
    outline: none;
    font-size: 14px;
    background: transparent;
    cursor: pointer;
  }
`;

const FooterButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  button {
    flex: 1;
    margin: 0 5px;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    text-transform: uppercase;

    &:first-child {
      background-color: #ddd;
      color: #555;
    }

    &:last-child {
      background-color: #00cfff;
      color: white;
    }
  }
`;

const BookingSettings = () => {
  const [cancelOffers, setCancelOffers] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("Block Time Only");

  const toggleCancelOffers = () => {
    setCancelOffers((prev) => !prev);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <MainContainer>
      <WrapperContainer>
        <HeaderSection>
          <h2>Booking Settings</h2>
          <p>
            Prevent booking conflicts with settings that control how your calendar
            and inbox respond to new bookings.
          </p>
        </HeaderSection>
        <BookingSettingsContainer>
          <div className="setting-item no-border">
            <span className="toggle-label">Availability After Booking</span>
            <ChevronRight size={20} color="#666" onClick={handleOpenModal} />
          </div>
          <p className="description">
            Control your calendar availability when a new booking is made.
          </p>
          <div className="setting-item">
            <span className="toggle-label">Cancel offers on booking</span>
            <div
              className={`toggle-switch ${cancelOffers ? "active" : ""}`}
              onClick={toggleCancelOffers}
            ></div>
          </div>
          <p className="description">
            Cancel conflicting offers when a new booking has set your calendar as
            unavailable. This prevents booking conflicts that can occur when
            multiple open offers have the same date/time.
          </p>
        </BookingSettingsContainer>

        {isModalOpen && (
          <ModalOverlay>
            <ModalContainer>
              <ModalHeader>
                <X
                  size={20}
                  className="close-icon"
                  onClick={handleCloseModal}
                />
              </ModalHeader>
              <h2>Availability After Booking</h2>
              <p>
                Set your calendar as <strong>unavailable</strong> for either the
                whole day, or just the booked time, when a booking is confirmed.
              </p>
              <DropdownContainer>
                <span className="dropdown-label">
                  Luxury power boat for Fun, and Memories
                </span>
                <select
                  className="dropdown"
                  value={dropdownValue}
                  onChange={(e) => setDropdownValue(e.target.value)}
                >
                  <option value="Block Time Only">Block Time Only</option>
                  <option value="Block Whole Day">Block Whole Day</option>
                  <option value="Remains Available">Remains Available</option>
                </select>
              </DropdownContainer>
              <FooterButtons>
                <button onClick={handleCloseModal}>Cancel</button>
                <button onClick={handleCloseModal}>Save</button>
              </FooterButtons>
            </ModalContainer>
          </ModalOverlay>
        )}
      </WrapperContainer>
    </MainContainer>
  );
};

export default BookingSettings;
