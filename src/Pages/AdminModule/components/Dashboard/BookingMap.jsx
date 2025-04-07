// import React, { useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import styles from "./BookingMap.module.scss";

// // 🛥️ Yacht Rental Booking Locations (Sample Data)
// const bookingData = [
//   { id: 1, name: "Luxury Yacht A", lat: 25.276987, lng: 55.296249, bookings: 120, type: "Active" }, // Dubai
//   { id: 2, name: "Sailing Cruiser B", lat: 36.162663, lng: -86.781601, bookings: 85, type: "Completed" }, // USA
//   { id: 3, name: "Private Charter C", lat: 43.653225, lng: -79.383186, bookings: 50, type: "Active" }, // Toronto
//   { id: 4, name: "Luxury Boat D", lat: 51.507351, lng: -0.127758, bookings: 95, type: "Completed" }, // London
//   { id: 5, name: "Exclusive Rental E", lat: 40.712776, lng: -74.005974, bookings: 135, type: "Active" }, // NYC
//   { id: 6, name: "Speedboat F", lat: -33.868820, lng: 151.209290, bookings: 70, type: "Active" }, // Sydney
// ];

// // 🌟 Custom Icon for Yacht Markers
// const yachtIcon = new L.Icon({
//   iconUrl: "/icons/yacht-marker.png",
//   iconSize: [30, 40],
//   iconAnchor: [15, 40],
//   popupAnchor: [0, -40],
// });

// const BookingMap = () => {
//   const [selectedType, setSelectedType] = useState("All");

//   // 🎯 Filter Bookings by Type
//   const filteredBookings = bookingData.filter(
//     (booking) => selectedType === "All" || booking.type === selectedType
//   );

//   return (
//     <div className={styles.mapContainer}>
//       <h2 className={styles.title}>📍 Yacht Bookings & Rental Locations</h2>

//       {/* Filter Dropdown */}
//       <div className={styles.filterBox}>
//         <label>Filter by:</label>
//         <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
//           <option value="All">All Bookings</option>
//           <option value="Active">Active Yachts</option>
//           <option value="Completed">Completed Bookings</option>
//         </select>
//       </div>

//       {/* Leaflet Map */}
//       <MapContainer center={[20, 0]} zoom={2} className={styles.map}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="&copy; OpenStreetMap contributors"
//         />

//         {/* 📍 Add Yacht Markers */}
//         {filteredBookings.map((booking) => (
//           <Marker key={booking.id} position={[booking.lat, booking.lng]} icon={yachtIcon}>
//             <Popup>
//               <h4>{booking.name}</h4>
//               <p>📅 Bookings: {booking.bookings}</p>
//               <p>🔹 Status: {booking.type}</p>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// };

// export default BookingMap;
