import React from "react";
import Modal from "react-responsive-modal";
import styled from "styled-components";

const DeleteModalContent = styled.div`
  padding: 20px;
  text-align: center;

  h2 {
    font-size: 22px;
    margin-bottom: 15px;
    color: #333;
  }

  p {
    font-size: 16px;
    margin-bottom: 20px;
    color: #666;
  }

  .modal-actions {
    display: flex;
    justify-content: center;
    gap: 15px;

    button {
      padding: 10px 20px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s;

      &.confirm-btn {
        background-color: #d9534f;
        color: white;
        border: none;
      }

      &.confirm-btn:hover {
        background-color: #c9302c;
      }

      &.cancel-btn {
        background-color: #f0f0f0;
        color: #333;
        border: none;
      }

      &.cancel-btn:hover {
        background-color: #ddd;
      }
    }
  }
`;
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal open={isOpen} onClose={onClose} center>
      {/* <div className="modal-content">
        <h2>Delete Booking</h2>
        <p>Are you sure you want to delete this booking?</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="confirm-btn" onClick={onConfirm}>Confirm</button>
        </div>
      </div> */}

      <DeleteModalContent>
          <h2>Delete Booking</h2>
          <p>Are you sure you want to delete this booking?</p>
          <div className="modal-actions">
            <button
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="confirm-btn"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </DeleteModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
