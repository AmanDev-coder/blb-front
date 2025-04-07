import PropTypes from "prop-types"; // Ensure prop validation
import styles from "./Dashboard.module.scss";
import WidgetsRow from "./components/Dashboard/WidgetsRow";
import ChartsRow from "./components/Dashboard/ChartsRow";
import TableSection from "./components/Dashboard/TableSection";
import VisitorTracker from "./components/Dashboard/VisitorTracker";
import CalendarWidget from "./components/Dashboard/CalendarWidget";
import UserActivity from "./components/Dashboard/UserActivity";
// import ChatSupport from "./components/Dashboard/ChatSupport";
import UpcomingEvents from "./components/Dashboard/UpcomingEvents";
// import SupportTracker from "./components/SupportTracker";
// import TrafficSources from "./components/TrafficSources";
import AnalyticsOverview from "./components/Dashboard/AnalyticsOverview";
import ProjectsTable from "./components/Dashboard/ProjectsTable";
import { useEffect, useState } from "react";
import { fetchAdminDashboardStats } from "../../Redux/adminReducer.js/action";
import { useDispatch } from "react-redux";

const Dashboard = ({ onNewNotification }) => {
  // console.log("📢 Dashboard received onNewNotification from ThemeLayout", onNewNotification);
    const [DashboardStats, setDashboardStats] = useState(null);
   const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch =useDispatch()
 useEffect(() => {
    const getDashboardStats = async () => {
      try {
        setLoading(true);
        const fetchedData = await dispatch(fetchAdminDashboardStats);
        if (fetchedData) {
          setDashboardStats(fetchedData);
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

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>{error}</p>;
  if (!DashboardStats) return null;
  
  return (
    <div className={styles.dashboard}>
      {/* Main Sections */}
      <WidgetsRow />
      <UserActivity DashboardStats={DashboardStats} />
      <ChartsRow trends={DashboardStats.trendss} />
      <TableSection />
      {/* <CalendarWidget /> */}
      <VisitorTracker />
      {/* <ChatSupport /> */}
      {/* <UpcomingEvents /> */}
      <AnalyticsOverview />
      <ProjectsTable />
    </div>
  );
};

// PropTypes Validation
Dashboard.propTypes = {
  onNewNotification: PropTypes.func.isRequired, // Ensure function is passed
};

export default Dashboard;
