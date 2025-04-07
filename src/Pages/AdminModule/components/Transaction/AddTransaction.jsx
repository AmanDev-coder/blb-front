import { useState, useRef } from "react";
import {
  FaUser,
  FaDollarSign,
  FaCalendarAlt,
  FaPhone,
  FaSave,
  FaRedo,
  FaUserPlus,
  FaCode
} from "react-icons/fa";
import styles from "./AddTransaction.module.scss";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// Mock function to simulate fetching users from a database
const fetchUsers = () => [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Alice Johnson" },
  // Add more users as needed
];

const AddTransaction = ({ onTransactionAdded }) => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const users = fetchUsers(); // Directly use the fetched users
  const [formData, setFormData] = useState({
    transactionNumber: "",
    userId: "",
    guestUserName: "",
    yacht: "",
    amount: "",
    transactionCode: "",
    date: "",
    phone: "",
    status: "Pending",
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset Form
  const handleReset = () => {
    formRef.current.reset();
    setFormData({
      transactionNumber: "",
      userId: "",
      guestUserName: "",
      yacht: "",
      amount: "",
      transactionCode: "",
      date: "",
      phone: "",
      status: "Pending",
    });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = { ...formData, id: `#T${Date.now()}` };

    // Call parent function to refresh transaction table
    if (onTransactionAdded) onTransactionAdded(newTransaction);

    // Redirect to Transactions Table
    navigate("/adminn/transactions");
  };

  return (
    <div className={styles.addTransactionContainer}>
      <div className={styles.header}>
        <h2>
          <FaUserPlus /> Add Transaction
        </h2>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className={styles.transactionForm}>
        <fieldset className={styles.importantFields}>
          <legend>Transaction Information</legend>

          <div className={styles.formGroup}>
            <label>
              <FaCode /> Transaction Number*
            </label>
            <input
              type="text"
              name="transactionNumber"
              value={formData.transactionNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <FaUser /> Select User
            </label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
              <option value="guest">Guest User</option>
            </select>
          </div>

          {formData.userId === "guest" && (
            <div className={styles.formGroup}>
              <label>
                <FaUser /> Guest User Name
              </label>
              <input
                type="text"
                name="guestUserName"
                value={formData.guestUserName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label>
              <FaDollarSign /> Amount*
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <FaUser /> Yacht
            </label>
            <input
              type="text"
              name="yacht"
              value={formData.yacht}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <FaCode /> Transaction Reference*
            </label>
            <input
              type="text"
              name="transactionCode"
              value={formData.transactionCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <FaCalendarAlt /> Date*
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <FaPhone /> Phone*
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Status*</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </fieldset>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}>
            <FaSave /> Add Transaction
          </button>
          <button type="button" className={styles.resetButton} onClick={handleReset}>
            <FaRedo /> Reset
          </button>
        </div>
      </form>
    </div>
  );
};

// Add prop type validation
AddTransaction.propTypes = {
  onTransactionAdded: PropTypes.func,
};

export default AddTransaction;