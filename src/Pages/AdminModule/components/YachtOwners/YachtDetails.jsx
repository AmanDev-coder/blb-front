import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faUser,
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
  faBuilding,
  faShip,
  faGasPump,
  faCog,
  faToolbox,
  faChartBar,
  faCalendarAlt,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./YachtDetails.module.scss";
import { getOwnerYachts } from "../../../../Redux/yachtOwnerReducer/action";
import { useDispatch, useSelector } from "react-redux";
let yachts = [
  {
    name: "Sea Explorer",
    type: "Luxury Yacht",
    year: "2021",
    length: "25m",
    fuelType: "Diesel",
    engine: "800 HP Twin Engine",
    amenities: ["WiFi", "Jacuzzi", "Sun Deck"],
    price: "$5000/day",
    status: "Available",
  },
  {
    name: "Ocean Pearl",
    type: "Sport Yacht",
    year: "2019",
    length: "30m",
    fuelType: "Petrol",
    engine: "600 HP Turbo",
    amenities: ["Bar", "Underwater Lights"],
    price: "$7500/day",
    status: "Booked",
  },
  {
    name: "Blue Horizon",
    type: "Sailing Yacht",
    year: "2020",
    length: "20m",
    fuelType: "Hybrid",
    engine: "Eco-Boost 500 HP",
    amenities: ["Satellite TV", "Dining Area"],
    price: "$4500/day",
    status: "Under Maintenance",
  },
];


const YachtDetails = ({ owner, onBack }) => {
  const [activeTab, setActiveTab] = useState("overview"); // Tab Management
  const dispatch = useDispatch();
  const yachts = useSelector((store) => store.yachtOwnerReducer.OwnerYachts);
  //  const OwnerYachts = useSelector((store) => store.yachtReducer.OwnerYachts);
  console.log(yachts);
  useEffect(() => {
    dispatch(getOwnerYachts(owner.id));
  }, []);

  return (
    <div className={styles.yachtDetails}>
      {/* 🔙 Back Button */}
      <button className={styles.backButton} onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeftLong} />
      </button>

      {/* 👤 Owner Information Section */}
      <div className={styles.ownerInfo}>
        <div className={styles.ownerDetails}>
          <h2 className={styles.ownerName}>
            <FontAwesomeIcon icon={faUser} /> {owner.name}
          </h2>
          <p>
            <FontAwesomeIcon icon={faBuilding} /> <strong>Company:</strong>{" "}
            {owner.company || "Not Available"}
          </p>
          <p>
            <FontAwesomeIcon icon={faEnvelope} /> <strong>Email:</strong>{" "}
            {owner.email}
          </p>
          <p>
            <FontAwesomeIcon icon={faPhone} /> <strong>Contact:</strong>{" "}
            {owner.contact}
          </p>
          <p>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> <strong>Location:</strong>{" "}
            {owner.location}
          </p>
        </div>
        <img
          src={owner.profileImg}
          className={styles.profileImg}
          alt={owner.name}
        />
      </div>

      {/* 📌 Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={activeTab === "overview" ? styles.active : ""}
          onClick={() => setActiveTab("overview")}
        >
          <FontAwesomeIcon icon={faShip} /> Overview
        </button>
        <button
          className={activeTab === "financials" ? styles.active : ""}
          onClick={() => setActiveTab("financials")}
        >
          <FontAwesomeIcon icon={faChartBar} /> Financials
        </button>
        <button
          className={activeTab === "maintenance" ? styles.active : ""}
          onClick={() => setActiveTab("maintenance")}
        >
          <FontAwesomeIcon icon={faWrench} /> Maintenance
        </button>
      </div>

      {/* 🛥️ Yacht Cards Display */}
      {activeTab === "overview" && (
        <div className={styles.yachtList}>
          {yachts?.length > 0 &&
            yachts?.map((yacht, index) => (
              <div key={index} className={styles.yachtCard}>
                <h4>{yacht.name}</h4>
                <p>
                  <FontAwesomeIcon icon={faShip} /> Type: {yacht.boatType}
                </p>
                <p>
                  <FontAwesomeIcon icon={faCalendarAlt} /> Year:{" "}
                  {yacht.features.year}
                </p>
                {/* <p><FontAwesomeIcon icon={faGasPump} /> Fuel: {yacht.fuelType}</p> */}
                {/* <p><FontAwesomeIcon icon={faCog} /> Engine: {yacht.engine}</p> */}
                {/* <p><FontAwesomeIcon icon={faToolbox} /> Amenities: {yacht.amenities.join(", ")}</p> */}
                <p>
                  <FontAwesomeIcon icon={faBuilding} /> Length:{" "}
                  {yacht?.features.length}
                </p>
                <p>
                  <FontAwesomeIcon icon={faBuilding} /> Price: $
                  {`${yacht.priceDetails.hourly.rate}/hr`}
                </p>
                <span
                  className={`${styles.status} ${
                    styles[yacht.status.replace(" ", "").toLowerCase()]
                  }`}
                >
                  {yacht.status}
                </span>
              </div>
            ))}
          {/* {yachts.length==0&&<p>No yachts yet</p>} */}
        </div>
      )}

      {/* 📈 Financials Tab */}
      {activeTab === "financials" && (
        <div className={styles.financials}>
          <h3>🚀 Financial Summary Coming Soon!</h3>
        </div>
      )}

      {/* 🛠️ Maintenance Tab */}
      {activeTab === "maintenance" && (
        <div className={styles.maintenance}>
          <h3>🛠️ Maintenance Records Coming Soon!</h3>
        </div>
      )}
    </div>
  );
};

// ✅ PropTypes Validation
YachtDetails.propTypes = {
  owner: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default YachtDetails;
