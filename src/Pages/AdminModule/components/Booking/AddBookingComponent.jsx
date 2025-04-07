import { useState, useRef, useEffect } from "react";
import {
  FaUser,
  FaShip,
  FaCalendarAlt,
  FaDollarSign,
  FaRedo,
  FaSave,
  FaList,
} from "react-icons/fa";
import styles from "./AddBooking.module.scss";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
const statuses = ["Pending", "Confirmed", "Cancelled"];

const AddBookingComponent = ({ onBookingAdded }) => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user: "",
    yacht: "",
    date: "",
    startDate: "",
    endDate: "",
    amount: "",
    status: "Pending",
  });

  const [usersList, setUsersList] = useState([]);
  const [yachtsList, setYachtsList] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("usersData")) || [];
    const storedYachts = JSON.parse(localStorage.getItem("yachtsData")) || [];
    setUsersList(storedUsers);
    setYachtsList(storedYachts);
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset Form
  const handleReset = () => {
    formRef.current.reset();
    setFormData({
      user: "",
      yacht: "",
      date: "",
      startDate: "",
      endDate: "",
      amount: "",
      status: "Pending",
    });
  };

  // Load Existing Bookings from Local Storage
  const loadBookings = () => {
    const storedBookings = localStorage.getItem("bookingsData");
    return storedBookings ? JSON.parse(storedBookings) : [];
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.user || !formData.yacht || !formData.date || !formData.amount) {
      alert("All fields are required!");
      return;
    }

    const bookings = loadBookings();
    const newBooking = { ...formData, id: `#B${bookings.length + 1}` };

    const updatedBookings = [...bookings, newBooking];
    localStorage.setItem("bookingsData", JSON.stringify(updatedBookings));

    if (onBookingAdded) onBookingAdded(newBooking);

    navigate("/adminn/bookings");
  };

  return (
    <div className={styles.addBookingContainer}>
      <div className={styles.header}>
        <h2>
          <FaList /> Add Booking
        </h2>
      </div>

      
      <form ref={formRef} onSubmit={handleSubmit} className={styles.bookingForm}>
        <fieldset className={styles.importantFields}>
          <legend>Booking Details</legend>

          <div className={styles.formGroup}>
            <label>
              <FaUser /> Select User*
            </label>
            <select name="user" value={formData.user} onChange={handleChange} required>
              <option value="">-- Select User --</option>
              {usersList.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>
              <FaShip /> Select Yacht*
            </label>
            <select name="yacht" value={formData.yacht} onChange={handleChange} required>
              <option value="">-- Select Yacht --</option>
              {yachtsList.map((yacht) => (
                <option key={yacht.id} value={yacht.name}>
                  {yacht.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>
              <FaCalendarAlt /> Booking Date*
            </label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>
              <FaCalendarAlt /> Start Date
            </label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label>
              <FaCalendarAlt /> End Date
            </label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label>
              <FaDollarSign /> Amount*
            </label>
            <input type="text" name="amount" value={formData.amount} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Status*</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}>
            <FaSave /> Add Booking
          </button>
          <button type="button" className={styles.resetButton} onClick={handleReset}>
            <FaRedo /> Reset
          </button>
        </div>
      </form>
    </div>
  );
};

AddBookingComponent.propTypes = {
  onBookingAdded: PropTypes.func.isRequired,
};

export default AddBookingComponent;
