import styles from "./WidgetRow.module.scss";
import { Line, Bar } from "react-chartjs-2";
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
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAdminDashboardStats } from "../../../../Redux/adminReducer.js/action";

// ✅ Register necessary chart elements
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

const widgetsData = [
  {
    title: "Total Bookings",
    value: "1,045",
    colorClass: styles.widget1,
    trend: [900, 950, 980, 1020, 1040, 1045],
    type: "line",
  },
  {
    title: "Total Yacht Owners",
    value: "285",
    colorClass: styles.widget2,
    trend: [200, 230, 250, 270, 280, 285],
    type: "line",
  },
  {
    title: "Total Yachts",
    value: "673",
    colorClass: styles.widget3,
    trend: [600, 620, 640, 660, 670, 673],
    type: "line",
  },
  {
    title: "Total Revenue",
    value: "$1,254,350",
    colorClass: styles.widget4,
    trend: [50000, 80000, 120000, 150000, 180000, 220000],
    type: "bar",
  },
];

const WidgetsRow = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const dispatch =useDispatch()
  // ✅ Fetch API Data on Component Mount
  useEffect(() => {
    const getDashboardStats = async () => {
      try {
        setLoading(true);
        const fetchedData = await dispatch(fetchAdminDashboardStats);
        if (fetchedData) {
          setData(fetchedData);
        } else {
          setError("Failed to load data");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    getDashboardStats();
  }, []);

  // ✅ Show Loading & Error Handling
  if (loading) return <p>Loading widgets...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return null;

    const widgetsData = [
    {
      title: "Total Bookings",
      value: data.summary.totalBookings?.toLocaleString() || "0",
      colorClass: styles.widget1,
      trend: data.trends.bookingsTrend ?? Array(6).fill(0),
      type: "line",
    },
    {
      title: "Total Yacht Owners",
      value: data.summary.totalYachtOwners?.toLocaleString() || "0",
      colorClass: styles.widget2,
      trend: data.trends.yachtOwnersTrend ?? Array(6).fill(0),
      type: "line",
    },
    {
      title: "Total Yachts",
      value: data.summary.totalYachts?.toLocaleString() || "0",
      colorClass: styles.widget3,
      trend: data.trends.yachtTrends ?? Array(6).fill(0),
      type: "line",
    },
    {
      title: "Total Revenue",
      value: `$${data.summary.totalRevenue?.toLocaleString() || "0"}`,
      colorClass: styles.widget4,
      trend: data.trends.revenueTrend ?? Array(6).fill(0),
      type: "bar",
    },
  ];
  console.log(data.trends.bookingsTrend)
  
  return (
    <div className={styles.widgetsRow}>
      {widgetsData.map((widget, index) => (
        <div key={index} className={`${styles.card} ${widget.colorClass}`}>
          <h3>{widget.title}</h3>
          <p>{widget.value}</p>
          <div className={styles.chartContainer}>
            {widget.type === "line" ? (
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
                  plugins: { legend: { display: false }, tooltip: { enabled: false } },
                  scales: { x: { display: false }, y: { display: false } },
                }}
              />
            ) : (
              <Bar
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  datasets: [
                    {
                      data: widget.trend,
                      backgroundColor: "#fff",
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false }, tooltip: { enabled: false } },
                  scales: {
                    x: { display: false },
                    y: { display: false },
                  },
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WidgetsRow;

