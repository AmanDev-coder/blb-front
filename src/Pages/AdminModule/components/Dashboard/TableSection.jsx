import React, { useEffect, useState } from "react";
import { FaSyncAlt, FaEdit, FaTrash, FaUserTie, FaCheckCircle, FaTimesCircle, FaShip } from "react-icons/fa";
import styles from "./TableSection.module.scss";
import { useDispatch } from "react-redux";
import { fetchBookings } from "../../../../Redux/yachtReducer/action";

// Sample Data
const initialBookings = [
  { id: "#B123", user: "John Doe", yacht: "Sea Explorer", transaction: "TXN001", amount: "$450", status: "Completed" },
  { id: "#B124", user: "Alice Brown", yacht: "Ocean Dream", transaction: "TXN002", amount: "$620", status: "Pending" },
  { id: "#B125", user: "Michael Lee", yacht: "Blue Horizon", transaction: "TXN003", amount: "$310", status: "Cancelled" },
  { id: "#B126", user: "Emma White", yacht: "Luxury Waves", transaction: "TXN004", amount: "$780", status: "Completed" },
  { id: "#B127", user: "David Clark", yacht: "Golden Sun", transaction: "TXN005", amount: "$950", status: "Pending" },
];
const TableSection = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
const dispatch=useDispatch()

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBookings([...initialBookings]); // Simulated refresh
    }, 1000);
  };

  const handleEdit = (id) => {
    alert(`Editing booking: ${id}`);
  };

  const handleDelete = (id) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

useEffect(()=>{

  const getBookingsData=async()=>{
   const res=await  dispatch(fetchBookings())
   console.log(res)
   setBookings(res.data)
  }
  getBookingsData()
},[])
  return (
    <div className={styles.tableSection}>
      {/* 📌 Table Header */}
      <div className={styles.tableHeader}>
        <h3>📅 Recent Bookings</h3>
        <FaSyncAlt
          onClick={handleReload}
          className={`${styles.reloadIcon} ${loading ? styles.spin : ""}`}
        />
      </div>

      {/* 📌 Booking Table */}
      <table className={styles.bookingTable}>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User</th>
            <th>Yacht</th>
            <th>Transaction</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.user}</td>
              <td>{booking.yacht}</td>
              <td>{booking.txnId}</td>
              <td>{booking.amount}</td>
              <td className={`${styles[booking.status.toLowerCase()]}`}>
                {booking.status}
              </td>
              <td className={styles.actionsColumn}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => handleEdit(booking.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => handleDelete(booking.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

   
    </div>
  );
};

export default TableSection;
