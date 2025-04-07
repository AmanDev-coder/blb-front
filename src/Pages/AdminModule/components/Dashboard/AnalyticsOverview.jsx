import React from "react";
import SupportTracker from "./SupportTracker";
import TrafficSources from "./TrafficSources";
import styles from "./AnalyticsOverview.module.scss";

const AnalyticsOverview = () => {
  return (
    <div className={styles.analyticsOverview}>
      <SupportTracker />
      <TrafficSources />
    </div>
  );
};

export default AnalyticsOverview;
