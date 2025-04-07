import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleSequential } from "d3-scale";
import { interpolateBlues, interpolateYlOrRd } from "d3-scale-chromatic";
import styles from "./VisitorTracker.module.scss";
import worldMapData from "../jsondatamap/ne_10m_admin_0_countries.json";
import { getVisitorBookingAnalytics } from "../../../../Redux/adminReducer.js/action";
import { useDispatch } from "react-redux";
// 📌 Visitor & Yacht Rental Data (Region Mapped)
const visitorData = {
  US: { name: "United States", visitors: 5300, bookings: 120, region: "North America" },
  GB: { name: "United Kingdom", visitors: 4200, bookings: 95, region: "Europe" },
  IN: { name: "India", visitors: 7000, bookings: 150, region: "Asia" },
  CN: { name: "China", visitors: 6800, bookings: 135, region: "Asia" },
  AU: { name: "Australia", visitors: 3200, bookings: 80, region: "Oceania" },
  BR: { name: "Brazil", visitors: 4100, bookings: 90, region: "South America" },
  DE: { name: "Germany", visitors: 3900, bookings: 70, region: "Europe" },
  FR: { name: "France", visitors: 4100, bookings: 65, region: "Europe" },
  JP: { name: "Japan", visitors: 3600, bookings: 50, region: "Asia" },
  RU: { name: "Russia", visitors: 3200, bookings: 45, region: "Europe" },
  IT: { name: "Italy", visitors: 3100, bookings: 40, region: "Europe" },
  CA: { name: "Canada", visitors: 5000, bookings: 110, region: "North America" },
  ES: { name: "Spain", visitors: 2800, bookings: 35, region: "Europe" },
  MX: { name: "Mexico", visitors: 2600, bookings: 30, region: "North America" },
  SA: { name: "Saudi Arabia", visitors: 2500, bookings: 28, region: "Middle East" },
  ZA: { name: "South Africa", visitors: 2400, bookings: 25, region: "Africa" },
};

// 🎨 Color Scales
const blueScale = scaleSequential(interpolateBlues).domain([0, 1]);
const heatmapScale = scaleSequential(interpolateYlOrRd).domain([0, 1]);
const regions = ["All", "North America", "Europe", "Asia", "Oceania", "South America", "Middle East", "Africa"];



const VisitorTracker = () => {

  
  const [tooltipContent, setTooltipContent] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // Sorting (Default: Descending)
  const [selectedRegion, setSelectedRegion] = useState("All"); // Default: Show all regions
  const [isHeatmap, setIsHeatmap] = useState(false); // Heatmap Mode Toggle
  const [visitorData, setvisitorData] = useState({});
   const dispatch=useDispatch()
  // 📌 Handle Country Hover (Fix: Tooltip only shows for the selected region)
  const handleMouseEnter = (geo) => {
    const countryData = visitorData[geo.properties.ISO_A2];
    if (countryData && (selectedRegion === "All" || countryData.region === selectedRegion)) {
      setTooltipContent(
        `${countryData.name}: ${countryData.visitors.toLocaleString()} visitors, ${countryData.bookings} yacht bookings`
      );
    } else {
      setTooltipContent("Out of selected region");
    }
  };

  // 📌 Handle Mouse Leave
  const handleMouseLeave = () => setTooltipContent("Hover over a country to see details");

  // 📌 Sorting Function (Visitors)
  const sortedCountries = Object.entries(visitorData)
    .filter(([_, data]) => selectedRegion === "All" || data.region === selectedRegion) // Show all when "All" is selected
    .sort((a, b) => (sortOrder === "asc" ? a[1].visitors - b[1].visitors : b[1].visitors - a[1].visitors));


    useEffect(() => {
      const fetchAnalytics = async () => {
        try {
          const data = await dispatch(getVisitorBookingAnalytics());
          console.log("📊 Analytics Data:", data);
          setvisitorData(data)
        } catch (err) {
          console.error("Error loading analytics", err);
        }
      };
      fetchAnalytics();
    }, []);
    
    const maxVisitors = Math.max(
      ...Object.values(visitorData || {}).map((v) => v.visitors || 0),
      5 // fallback
    );
    blueScale.domain([0, maxVisitors]);
    heatmapScale.domain([0, maxVisitors]); 

    console.log(maxVisitors,visitorData)
  return (
    <div className={styles.wrapperContainer}>
      <div className={styles.visitorGrid}>
        {/* 🌍 Left Column - Map */}
        <div className={styles.mapContainer}>
          <h2 className={styles.mapTitle}>🌍 Global Visitor Tracker</h2>

          {/* 📌 Filters */}
          <div className={styles.filters}>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="desc">Sort by Visitors (High → Low)</option>
              <option value="asc">Sort by Visitors (Low → High)</option>
            </select>
            <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <button onClick={() => setIsHeatmap(!isHeatmap)}>
              {isHeatmap ? "Disable Heatmap" : "Enable Heatmap"}
            </button>
          </div>

          {/* 🗺️ Interactive Map */}
          <ComposableMap projection="geoMercator" className={styles.map}>
            <Geographies geography={worldMapData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryData = visitorData[geo.properties.ISO_A2];
                  const isHighlighted = countryData && (selectedRegion === "All" || countryData.region === selectedRegion);
                  const fillColor = isHighlighted
                    ? isHeatmap
                      ? heatmapScale(countryData.visitors)
                      : blueScale(countryData.visitors)
                    : "#E0E0E0";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => handleMouseEnter(geo)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: fillColor,
                          transition: "fill 0.3s ease-in-out",
                          outline: "none",
                        },
                        hover: {
                          fill: isHighlighted ? "#FF5733" : "#ddd",
                          cursor: isHighlighted ? "pointer" : "default",
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

        {/* 📌 Right Column - Booking Insights (✅ NOW SHOWS ALL COUNTRIES) */}
        <div className={styles.rightComponent}>
          <h3>📊 Yacht Rental Insights</h3>
          <p>
            {selectedRegion === "All"
              ? "Showing all countries sorted by visitors"
              : `Showing ${selectedRegion} countries`}
          </p>
          <ul>
            {sortedCountries.map(([code, data]) => (
              <li key={code}>
                <strong>{data.name}</strong>: {data.bookings} bookings
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisitorTracker;
