import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import PropTypes from 'prop-types';

const MapWithLocation = ({ location }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDgLM-rcAmNnGOmcCgvebof2Uk6kb7U7y4", // Replace with your API key
  });

  const hasValidCoordinates =
    location?.geoPoint?.coordinates[1] !== null || location?.coordinates?.coordinates[1] !== undefined &&
    location?.geoPoint?.coordinates[0] !== null || location?.coordinates?.coordinates[0] !== undefined;

  // Fix unused variables by applying them in the component
  // Default map center and zoom set but removed if not used
  const center = hasValidCoordinates
    ? {
        lat: location?.geoPoint?.coordinates[1] || location?.coordinates?.coordinates[1],
        lng: location?.geoPoint?.coordinates[0] || location?.coordinates?.coordinates[0]
      }
    : { lat: 20.0, lng: 0.0 }; // Default center

  if (!isLoaded) return <p>Loading map...</p>;
  
  console.log(location);
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <GoogleMap
        center={center}
        zoom={10} // Adjust the zoom level as needed
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >
        {/* Marker to show the location */}
        <Marker
          position={{ 
            lat: location.geoPoint.coordinates[1] || location.coordinates.coordinates[1],
              lng: location.geoPoint.coordinates[0] || location.coordinates.coordinates[0],
          }}
        />
      </GoogleMap>
    </div>
  );
};

// Add PropTypes validation
MapWithLocation.propTypes = {
  location: PropTypes.shape({
    geoPoint: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number)
    }),
    coordinates: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number)
    })
  })
};

// Add default props
MapWithLocation.defaultProps = {
  location: {
    geoPoint: {
      coordinates: [0, 0]
    },
    coordinates: {
      coordinates: [0, 0]
    }
  }
};

export default MapWithLocation;


// const MapWithLocation = ({ formData }) => {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your API key
//   });

//   // Check if coordinates are valid
//   const hasValidCoordinates =
//     formData.location.coordinates[0] !== null &&
//     formData.location.coordinates[1] !== null;

//   // Default map center and zoom
//   const defaultCenter = { lat: 20.0, lng: 0.0 }; // Center of the world
//   const defaultZoom = 2;

//   // Use selected location if available
//   const mapCenter = hasValidCoordinates
//     ? {
//         lat: formData.location.coordinates[1],
//         lng: formData.location.coordinates[0],
//       }
//     : defaultCenter;

//   const mapZoom = hasValidCoordinates ? 12 : defaultZoom;

//   if (!isLoaded) return <p>Loading map...</p>;

//   return (
//     <div style={{ width: "100%", height: "400px" }}>
//       <GoogleMap
//         center={mapCenter}
//         zoom={mapZoom}
//         mapContainerStyle={{ width: "100%", height: "100%" }}
//       >
//         {hasValidCoordinates && (
//           <Marker
//             position={{
//               lat: formData.location.coordinates[1],
//               lng: formData.location.coordinates[0],
//             }}
//           />
//         )}
//       </GoogleMap>
//     </div>
//   );
// };

// export default MapWithLocation;