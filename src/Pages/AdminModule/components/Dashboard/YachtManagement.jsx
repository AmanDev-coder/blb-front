import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaShip, FaCamera } from "react-icons/fa";
import styles from "./YachtManagement.module.scss";

// Sample Yacht Data
const initialYachts = [
  { id: 1, name: "Luxury Ocean", price: "$500/hr", availableDates: "Feb 15 - Feb 20", image: "/assets/yacht1.jpg" },
  { id: 2, name: "Seaside Escape", price: "$700/hr", availableDates: "Feb 18 - Feb 25", image: "/assets/yacht2.jpg" },
];

const YachtManagement = () => {
  const [yachts, setYachts] = useState(initialYachts);
  const [showForm, setShowForm] = useState(false);
  const [editYacht, setEditYacht] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", image: "", availableDates: "" });

  // 📌 Open Form for Adding or Editing
  const handleShowForm = (yacht = null) => {
    setShowForm(true);
    if (yacht) {
      setEditYacht(yacht.id);
      setFormData(yacht);
    } else {
      setEditYacht(null);
      setFormData({ name: "", price: "", image: "", availableDates: "" });
    }
  };

  // 📌 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📌 Save Yacht (Add or Edit)
  const handleSaveYacht = () => {
    if (editYacht) {
      setYachts(yachts.map((y) => (y.id === editYacht ? { ...y, ...formData } : y)));
    } else {
      setYachts([...yachts, { id: yachts.length + 1, ...formData }]);
    }
    setShowForm(false);
  };

  // 📌 Delete Yacht
  const handleDeleteYacht = (id) => {
    setYachts(yachts.filter((y) => y.id !== id));
  };

  return (
    <div className={styles.yachtContainer}>
      <div className={styles.headerSection}>
        <h2 className={styles.title}>🛥️ Yacht Management</h2>
        <button className={styles.addYachtBtn} onClick={() => handleShowForm()}>
          <FaPlus /> Add New Yacht
        </button>
      </div>

      {/* 📜 Yacht Grid */}
      <div className={styles.yachtGrid}>
        {yachts.map((yacht) => (
          <div key={yacht.id} className={styles.yachtCard}>
            <img src={yacht.image || "/assets/default-yacht.jpg"} alt={yacht.name} className={styles.yachtImage} />
            <div className={styles.cardContent}>
              <h3>{yacht.name}</h3>
              <p className={styles.price}>💰 {yacht.price}</p>
              <p className={styles.dates}><FaCalendarAlt /> {yacht.availableDates}</p>
              <div className={styles.cardActions}>
                <button className={styles.editBtn} onClick={() => handleShowForm(yacht)}>
                  <FaEdit /> Edit
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDeleteYacht(yacht.id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* 🛠️ Add Yacht Card */}
        <div className={styles.addYachtCard} onClick={() => handleShowForm()}>
          <FaShip size={50} />
          <p>Add New Yacht</p>
        </div>
      </div>

      {/* 📝 Yacht Form (Add/Edit) */}
      {showForm && (
        <div className={styles.yachtForm}>
          <h3>{editYacht ? "Edit Yacht" : "Add New Yacht"}</h3>
          <div className={styles.inputGroup}>
            <FaShip className={styles.icon} />
            <input type="text" name="name" placeholder="Yacht Name" value={formData.name} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <FaCalendarAlt className={styles.icon} />
            <input type="text" name="availableDates" placeholder="Available Dates" value={formData.availableDates} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <FaCamera className={styles.icon} />
            <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
          </div>
          <button onClick={handleSaveYacht}>{editYacht ? "Update Yacht" : "Add Yacht"}</button>
        </div>
      )}
    </div>
  );
};

export default YachtManagement;
