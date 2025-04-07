import {
  FaClock,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaShip,
} from "react-icons/fa";
import styles from "./UserActivity.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Sample Data
const recentBookings = [
  {
    id: 1,
    user: "John Doe",
    yacht: "Sea Explorer",
    price: "$1,200",
    time: "2h ago",
  },
  {
    id: 2,
    user: "Alice Brown",
    yacht: "Ocean Dream",
    price: "$3,400",
    time: "6h ago",
  },
  {
    id: 3,
    user: "Michael Lee",
    yacht: "Blue Horizon",
    price: "$2,800",
    time: "1d ago",
  },
];

const activeOwners = [
  { id: 1, name: "Captain Jack", yachts: 5, earnings: "$12,500" },
  { id: 2, name: "Emily Watson", yachts: 3, earnings: "$9,200" },
];

const pendingYachtApprovals = [
  { id: 1, owner: "Robert Smith", yacht: "Luxury Breeze", status: "Pending" },
  { id: 2, owner: "Jessica Taylor", yacht: "Golden Wave", status: "Pending" },
];

const UserActivity = ({ DashboardStats,handleApprove,handleReject }) => {
  const { recentBookings, pendingOwnerApprovals, pendingYachtApprovals } = DashboardStats;
  const navigate=useNavigate()
  const dispatch =useDispatch()

  const capitalizeFirstLetter = (name) => {
    if (!name) return "Unknown"; // ✅ Handle missing names safely
    return name.charAt(0).toUpperCase() + name.slice(1);
  }; 



 
  return (
    <div className={styles.activityGrid}>
      {/* 📅 Recent Bookings */}
      <div className={styles.section}>
        <h3>📅 Recent Bookings</h3>
        <ul className={styles.list}>
          {recentBookings.map((booking) => (
            <li key={booking.id} className={styles.listItem}>
              <FaClock className={styles.icon} />
              <div>
                <p>
                <strong>{capitalizeFirstLetter(booking.user)}</strong> booked{" "}
                  <strong>{booking.yacht}</strong>
                </p>
                <span>
                  {`$${booking.price}`} - {`${booking.time}h ago`}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 🏆 Most Active Yacht Owners */}
      <div className={styles.section}>
        <h3>🏆 Most Active Yacht Owners</h3>
        <ul className={styles.list}>
          {activeOwners.map((owner) => (
            <li key={owner.id} className={styles.listItem}>
              <FaUserTie className={styles.icon} />
              <div>
                <p>
                  <strong>{owner.name}</strong> - {owner.yachts} yachts
                </p>
                <span>Total Earnings: {owner.earnings}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Pending Approvals */}
      <div className={styles.section}>
        <h3>📝 Pending Yacht Approvals</h3>
        <ul className={styles.list}>
          {pendingYachtApprovals.map((approval) => (
            <li key={approval.id} className={styles.listItem} onClick={()=>navigate(`/preview/${approval._id}`)}>
              <FaShip className={styles.icon} />
              <div>
                <p>
                  <strong>{capitalizeFirstLetter(approval.ownerId.name)}</strong> - {approval.title}
                </p>
                <span>Status: {approval.status=="pending_review"?"Pending":null}</span>
              </div>
              <div className={styles.actions}>
                <FaCheckCircle className={styles.approve} onClick={(e) => handleApprove(e,approval._id)} />
                <FaTimesCircle className={styles.reject}  onClick={(e) => handleReject(e,approval._id)}/>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserActivity;
