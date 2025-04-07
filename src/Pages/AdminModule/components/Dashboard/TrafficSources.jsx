import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./TrafficSources.module.scss";

Chart.register(ArcElement, Tooltip, Legend);

const TrafficSources = () => {
  const trafficData = [
    { source: "Direct", users: 4200, color: "#007bff" },
    { source: "Social", users: 3500, color: "#ff6b6b" },
    { source: "Organic", users: 5000, color: "#2ecc71" },
    { source: "Referral", users: 2700, color: "#f39c12" },
  ];

  // Data for Chart.js
  const chartData = {
    labels: trafficData.map((item) => item.source),
    datasets: [
      {
        data: trafficData.map((item) => item.users),
        backgroundColor: trafficData.map((item) => item.color),
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide default legend
      },
    },
  };

  return (
    <div className={styles.trafficSources}>
      {/* 📌 Header */}
      <div className={styles.header}>
        <h3>🌍 Traffic Sources</h3>
      </div>

      {/* 📌 Custom Legend (Single Line) */}
      <div className={styles.legendContainer}>
        {trafficData.map((item, index) => (
          <span key={index} className={styles.legendItem}>
            <span className={styles.colorDot} style={{ background: item.color }}></span>
            {item.source}
          </span>
        ))}
      </div>

      {/* 📌 Chart */}
      <div className={styles.chartContainer}>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default TrafficSources;
