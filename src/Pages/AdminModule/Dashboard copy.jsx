import { useState } from "react";
import styles from "./Dashboard.module.scss";
import { Line, Bar } from "react-chartjs-2";
import { FaSyncAlt, FaEdit, FaTrash } from "react-icons/fa";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js elements
ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Dummy data for widgets
const widgetsData = [
  {
    title: "Total Bookings",
    value: "1,045",
    colorClass: styles.widget1,
    trend: [950, 980, 1025, 1100, 1150, 1200], // More variation
  },
  {
    title: "Total Yacht Owners",
    value: "320",
    colorClass: styles.widget2,
    trend: [250, 270, 290, 310, 320, 330], // Unique increasing trend
  },
  {
    title: "Total Yachts",
    value: "705",
    colorClass: styles.widget3,
    trend: [600, 650, 680, 700, 705, 710], // Slightly different data
  },
  {
    title: "Total Revenue",
    value: "$1,500,240",
    colorClass: styles.widget4,
    trend: [1000000, 1200000, 1300000, 1400000, 1500000, 1600000], // Larger increments for revenue
  },
];


// Dummy data for charts
const revenueChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue ($)",
      data: [10000, 25000, 40000, 55000, 70000, 90000],
      borderColor: "#27AE60",
      fill: false,
    },
  ],
};

const bookingChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Bookings",
      data: [20, 30, 45, 50, 70, 90, 85],
      backgroundColor: "#2D9CDB",
    },
  ],
};

// Dummy data for table
const bookingsData = [
  { id: "#B123", transaction: "TXN001", amount: "$450", status: "Completed" },
  { id: "#B124", transaction: "TXN002", amount: "$620", status: "Pending" },
  { id: "#B125", transaction: "TXN003", amount: "$310", status: "Cancelled" },
  { id: "#B126", transaction: "TXN004", amount: "$780", status: "Completed" },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(false);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleEdit = (id) => {
    alert(`Edit Booking: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete Booking: ${id}`);
  };

  return (
    <div className={styles.dashboard}>
      {/* Bento Grid */}
      <div className={styles.bentoGrid}>
        {/* ✅ FIXED: WIDGETS NOW IN A SINGLE ROW */}
        <div className={styles.gridContainer}>
  {widgetsData.map((widget, index) => (
    <div key={index} className={`${styles.card} ${widget.colorClass}`}>
      <h3>{widget.title}</h3>
      <p>{widget.value}</p>
      <div className={styles.chartContainer}>
        {widget.title === "Total Revenue" ? (
          // Bar Chart for Total Revenue
          <Bar
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                {
                  data: widget.trend,
                  backgroundColor: "rgba(255,255,255,0.6)",
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false }, tooltip: { enabled: false } },
              scales: { x: { display: false }, y: { display: false } },
            }}
          />
        ) : (
          // Line Chart for all other widgets
          <Line
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                {
                  data: widget.trend,
                  borderColor: "#fff",
                  borderWidth: 2,
                  pointRadius: 0,
                  fill: false,
                },
              ],
            }}
            options={{
              
              responsive: true,
              Tooltip: { enabled: false },
              plugins: { legend: { display: false }, tooltip: { enabled: false } },
              scales: { x: { display: false }, y: { display: false } },
            }}
          />
        )}
      </div>
    </div>
  ))}
</div>


        {/* Charts */}
        <div className={styles.charts}>
          <div className={styles.chartBox}>
            <h3>Revenue Growth</h3>
            <Line data={revenueChartData} options={{ responsive: true }} />
          </div>
          <div className={styles.chartBox}>
            <h3>Booking Trends</h3>
            <Bar data={bookingChartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h3>Recent Bookings</h3>
            <FaSyncAlt
              onClick={handleReload}
              className={`${styles.reloadIcon} ${loading ? styles.spin : ""}`}
            />
          </div>
          <table className={styles.bookingTable}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Transaction</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th> {/* New column for icons */}
              </tr>
            </thead>
            <tbody>
              {bookingsData.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.id}</td>
                  <td>{booking.transaction}</td>
                  <td>{booking.amount}</td>
                  <td className={styles[booking.status.toLowerCase()]}>
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

        {/* Announcement Section */}
        <div className={styles.announcements}>
          <h3>Announcements</h3>
          <ul>
            <li>📢 System update scheduled for next Friday</li>
            <li>🛥 New yacht models added for rental</li>
            <li>🎉 Congratulations to our top yacht owner of the month!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
