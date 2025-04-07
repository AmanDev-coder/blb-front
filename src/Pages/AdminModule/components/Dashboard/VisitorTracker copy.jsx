import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleSequential } from "d3-scale";
import { interpolateBlues } from "d3-scale-chromatic";
import styles from "./VisitorTracker.module.scss";
import worldMapData from "../jsondatamap/ne_10m_admin_0_countries.json";

// 📌 Visitor & Yacht Rental Data
const visitorData = {
  US: { name: "United States", visitors: 5300, bookings: 120 },
  GB: { name: "United Kingdom", visitors: 4200, bookings: 95 },
  IN: { name: "India", visitors: 7000, bookings: 150 },
  CN: { name: "China", visitors: 6800, bookings: 135 },
  AU: { name: "Australia", visitors: 3200, bookings: 80 },
  BR: { name: "Brazil", visitors: 4100, bookings: 90 },
  DE: { name: "Germany", visitors: 3900, bookings: 70 },
  FR: { name: "France", visitors: 4100, bookings: 65 },
  JP: { name: "Japan", visitors: 3600, bookings: 50 },
  RU: { name: "Russia", visitors: 3200, bookings: 45 },
  IT: { name: "Italy", visitors: 3100, bookings: 40 },
  CA: { name: "Canada", visitors: 5000, bookings: 110 },
  ES: { name: "Spain", visitors: 2800, bookings: 35 },
  MX: { name: "Mexico", visitors: 2600, bookings: 30 },
  SA: { name: "Saudi Arabia", visitors: 2500, bookings: 28 },
  ZA: { name: "South Africa", visitors: 2400, bookings: 25 },
};

// 🎨 Color Scale (Gradient-based on Visitors)
const maxVisitors = Math.max(...Object.values(visitorData).map((v) => v.visitors));
const colorScale = scaleSequential(interpolateBlues).domain([0, maxVisitors]);

const VisitorTracker = () => {
  const [tooltipContent, setTooltipContent] = useState("");

  // 📌 Handle Country Hover
  const handleMouseEnter = (geo) => {
    const countryData = visitorData[geo.properties.ISO_A2];
    if (countryData) {
      setTooltipContent(
        `${countryData.name}: ${countryData.visitors.toLocaleString()} visitors, ${countryData.bookings} yacht bookings`
      );
    } else {
      setTooltipContent("No data available");
    }
  };

  // 📌 Handle Mouse Leave
  const handleMouseLeave = () => setTooltipContent("Hover over a country to see details");

  return (
    <div className={styles.wrapperContainer}>
      <div className={styles.visitorGrid}>
        {/* 🌍 Left Column - Map */}
        <div className={styles.mapContainer}>
          <h2 className={styles.mapTitle}>🌍 Global Visitor Tracker</h2>

          {/* 🗺️ Interactive Map */}
          <ComposableMap projection="geoMercator" className={styles.map}>
            <Geographies geography={worldMapData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryData = visitorData[geo.properties.ISO_A2];

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => handleMouseEnter(geo)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: countryData ? colorScale(countryData.visitors) : "#E0E0E0",
                          transition: "fill 0.3s ease-in-out",
                          outline: "none",
                        },
                        hover: {
                          fill: "#FF5733",
                          cursor: countryData ? "pointer" : "default",
                          outline: "none",
                        },
                        pressed: {
                          fill: "#C70039",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {/* ✅ Tooltip Fixed at Bottom */}
          <div className={styles.tooltip}>{tooltipContent}</div>
        </div>

        {/* 📌 Right Column - Booking Insights */}
        <div className={styles.rightWrapper}>
        <div className={styles.rightComponent}>
          <h3>Yacht Rental Insights</h3>
          <p>Top destinations for yacht rentals & bookings</p>
          <ul>
            {Object.entries(visitorData)
              .sort((a, b) => b[1].bookings - a[1].bookings)
              .slice(0, 5)
              .map(([code, data]) => (
                <li key={code}>
                  <strong>{data.name}</strong>: {data.bookings} bookings
                </li>
              ))}
          </ul>
        </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorTracker;