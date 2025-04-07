// importfrom "react";
import styles from "./ChartsRow.module.scss";
import { Line, Bar} from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Announcements from "./Announcements";

// 🔹 Correctly Register Components
ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// ✅ Fixed Data Structures
const revenueData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue ($)",
      data: [12000, 25000, 38000, 46000, 54000, 65000],
      borderColor: "#27AE60",
      backgroundColor: "rgba(39, 174, 96, 0.2)",
      borderWidth: 2,
      fill: true,
      tension: 0.3,
    },
  ],
};

const bookingData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Bookings",
      data: [15, 25, 40, 50, 65, 80, 75],
      backgroundColor: "#2D9CDB",
      borderRadius: 10,
    },
  ],
};


// ✅ FIX: Made bars slim, added rounded corners & gradient effect
const visitorTrendsData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
  datasets: [
    {
      label: "New Visitors",
      data: [5000, 6000, 7500, 8000, 9000, 9500],
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return null;
        const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
        gradient.addColorStop(0, "#FF6384");
        gradient.addColorStop(1, "#FFCE56");
        return gradient;
      },
      borderRadius: 10,
      borderWidth: 1,
      barThickness: 18, /* Slim Bars */
      maxBarThickness: 18,
    },
    {
      label: "Returning Visitors",
      data: [2000, 1000, 4000, 5000, 3000, 5000],
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 2,
      type: "line",
      pointStyle: "circle",
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.3,
    },
  ],
};

  
const ChartsRow = ({trends}) => {

  // if (loading) return <p>Loading widgets...</p>;
  // if (error) return <p>{error}</p>;

  if (!trends) return <p>Loading...</p>;

const revenueData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue ($)",
      data:trends?.revenueTrend?.map((r)=>r.count)
      ?? Array(6).fill(0),
      borderColor: "#27AE60",
      backgroundColor: "rgba(39, 174, 96, 0.2)",
      borderWidth: 2,
      fill: true,
      tension: 0.3,
    },
  ],
};

const bookingData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Bookings",
      data: trends?.bookingsTrend?.weekdayTrends.map((w)=>w.count)
      ?? Array(6).fill(0),
      backgroundColor: "#2D9CDB",
      borderRadius: 10,
    },
  ],
};

const visitorTrendsData = {
  labels: trends?.visitorTrend?.labels,
  datasets: [
    {
      label: "New Visitors",
      data: trends?.visitorTrend?.newVisitors,
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return null;
        const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
        gradient.addColorStop(0, "#FF6384");
        gradient.addColorStop(1, "#FFCE56");
        return gradient;
      },
      borderRadius: 10,
      borderWidth: 1,
      barThickness: 18, /* Slim Bars */
      maxBarThickness: 18,
    },
    {
      label: "Returning Visitors",
      data: trends?.visitorTrend?.returningVisitors,
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 2,
      type: "line",
      pointStyle: "circle",
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.3,
    },
  ],
};
  return (
    <div className={styles.chartsRow}>
      <div className={styles.chartBox}>
        <h3>Revenue Growth</h3>
        <Line data={revenueData} options={{ responsive: true }} />
      </div>

      <div className={styles.chartBox}>
        <h3>Booking Trends</h3>
        <Bar data={bookingData} options={{ responsive: true }} />
      </div>

      <div className={`${styles.chartBox} ${styles.visitorTrends}`}>
        <h3>Visitor Trends</h3>
        <Bar
          data={visitorTrendsData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  padding: 10,
                  boxWidth: 15,
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(200, 200, 200, 0.3)",
                },
              },
            },
          }}
        />
      </div>
      <Announcements />


    </div>
  );
};

export default ChartsRow;
