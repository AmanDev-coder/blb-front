import { useState, useEffect } from "react";
import styled from "styled-components";
import { Divider } from "@mui/material";
import { motion } from "framer-motion";
import DurationPicker from "./DurationModal";
import AlseDatePicker from "./DateSelect";
import BookNowModal from "./Drawer";
import { useDispatch } from "react-redux";
import { getInstaBooksByYacht } from "../../../Redux/yachtReducer/action";
import { accentColor } from "../../../cssCode";
import { useNavigate } from "react-router-dom";
import { FaAnchor, FaCalendarAlt, FaClock, FaShieldAlt } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";
import PropTypes from 'prop-types';

// Modern styled components with improved aesthetics
const BookingCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 1.75rem;
  position: sticky;
  top: 2rem;
  height: max-content;
  width: 100%;
  transition: all 0.3s ease-in-out;
  
  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
  
  @media (max-width: 992px) {
    margin-bottom: 2rem;
  }
`;

const PriceContainer = styled.div`
  margin-bottom: 1rem;
`;

const PriceLabel = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
`;

const Price = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e3a8a;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: baseline;
  background: linear-gradient(90deg, #1e3a8a, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const PriceUnit = styled.span`
  font-size: 1rem;
  font-weight: 600;
  margin-left: 0.25rem;
  opacity: 0.8;
`;

const FeatureRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  
  svg {
    color: #2563eb;
    margin-right: 0.75rem;
    font-size: 1rem;
  }
`;

const FeatureText = styled.p`
  font-size: 0.9rem;
  color: #475569;
  margin: 0;
`;

const BookingContainer = styled.div`
  background: linear-gradient(145deg, #f8fafc, #f1f5f9);
  border-radius: 12px;
  padding: 1.25rem;
  margin: 1.25rem 0;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
`;

const SelectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #1e3a8a;
  font-size: 0.95rem;
`;

const BookButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(to right, #1e3a8a, #3b82f6);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.9rem 0;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);

  &:hover {
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  }
`;

const InquiryButton = styled(BookButton)`
  background: linear-gradient(to right, #0d9488, #14b8a6);
`;

const TermsText = styled.p`
  text-align: center;
  font-size: 0.85rem;
  color: #64748b;
  margin: 1rem 0 0 0;
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #e2e8f0;
  
  svg {
    color: #0d9488;
    margin-right: 0.5rem;
    font-size: 1.1rem;
  }
  
  span {
    font-size: 0.85rem;
    color: #475569;
    font-weight: 500;
  }
`;

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    } 
  }
};

const FloatingCardComponent = ({ yacht, selectedDate, setSelectedDate, selectedDuration, setSelectedDuration }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [instaBookings, setInstaBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleCloseDrawer = () => setIsDrawerOpen(false);
  const handleOpenDrawer = () => setIsDrawerOpen(true);


  const CalculatePrice = ({ priceDetails }) => {
    if (!priceDetails) return "Price not available";

    const { daily, hourly, currency } = priceDetails;

    const dailyRate = daily?.rate > 0 ? daily.rate : Infinity;
    const hourlyRate = hourly?.rate > 0 ? hourly.rate : Infinity;

    if (dailyRate === Infinity && hourlyRate === Infinity) {
      return <span></span>;
    }

    // Calculate the lowest price and its unit
    const result =
      dailyRate < hourlyRate
        ? { price: dailyRate, unit: "day" }
        : { price: hourlyRate, unit: "hour" };

    return (
      <Price>
        {currency?.symbol || "$"}
        {result.price}
        <PriceUnit>/{result.unit}</PriceUnit>
      </Price>
    );
  };

  // Add prop validation for the CalculatePrice component
  CalculatePrice.propTypes = {
    priceDetails: PropTypes.shape({
      daily: PropTypes.shape({
        rate: PropTypes.number
      }),
      hourly: PropTypes.shape({
        rate: PropTypes.number
      }),
      currency: PropTypes.shape({
        symbol: PropTypes.string
      })
    })
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const today = new Date().toISOString().split("T")[0];
        const dateToUse = selectedDate ? selectedDate : today;

        const instabooks = await dispatch(
          getInstaBooksByYacht(yacht._id, dateToUse)
        );
        
        setInstaBookings(instabooks);
        
        if (!selectedDate && instabooks && instabooks.length > 0) {
          setSelectedDate(instabooks[0].date);
        }
      } catch (error) {
        console.error("Failed to fetch instabooks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const handleCheckout=()=>{
    const bookingData={
      "yachtId": yacht._id,
      "userId": localStorage.getItem("userId"),
      "ownerId": yacht.ownerId,
      "startDate": selectedDate,
        "endDate": selectedDate,
      "startTime": "",
      "endTime": "",
      "tripDuration": selectedDuration,
      "groupSize": 1,
      "maxCapacity": yacht.maxCapacity,
      "pricing": {
        "baseCost": yacht.priceDetails.hourly.rate*selectedDuration,
        "captainCost": yacht.priceDetails.hourly.rate*selectedDuration,
        "paymentServiceCharge": yacht.priceDetails.hourly.rate*selectedDuration,
        "totalRenterPayment": yacht.priceDetails.hourly.rate*selectedDuration,
      },
      "occasion": "",
      "specialRequest": "",
      "status": "pending",
      "captained": yacht.captained,
      "instabookTripTimes":[
        {
            "minStartTime": "09:00",
            "maxStartTime": "07:00",
        }
    ]
  }
    localStorage.setItem("bookingData",JSON.stringify(bookingData));
    navigate(`/book-now/${yacht._id}`);
  };

  return (
    <BookingCard
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <PriceContainer>
        <PriceLabel>Starting from</PriceLabel>
      <CalculatePrice priceDetails={yacht?.priceDetails} />
      </PriceContainer>
      
      {yacht?.priceDetails?.captainProvided && (
        <>
          <FeatureRow>
            <FaAnchor />
            <FeatureText>Captain is included with your booking</FeatureText>
          </FeatureRow>
          <FeatureRow>
            <BsLightningCharge />
            <FeatureText>Professional experience with local knowledge</FeatureText>
          </FeatureRow>
        </>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <BookingContainer>
        <div>
          <SelectionLabel>
            <FaCalendarAlt />
            Select Date
          </SelectionLabel>
        <AlseDatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        </div>
        
        <div>
          <SelectionLabel>
            <FaClock />
            Duration
          </SelectionLabel>
          <DurationPicker
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
          />
        </div>
      </BookingContainer>

      {instaBookings?.length > 0 ? (
        <BookButton 
          onClick={handleOpenDrawer}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Book Now'}
        </BookButton>
      ) : (
        <InquiryButton 
          onClick={handleCheckout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Send Inquiry'}
        </InquiryButton>
      )}

      <TermsText>
        You won&apos;t be charged yet
      </TermsText>
      
      <SecurityBadge>
        <FaShieldAlt />
        <span>Secure booking with 24/7 customer support</span>
      </SecurityBadge>

      <BookNowModal
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        instaBookings={instaBookings}
        yacht={yacht}
      />
    </BookingCard>
  );
};

// PropTypes for the main FloatingCardComponent at the end of the file
FloatingCardComponent.propTypes = {
  yacht: PropTypes.object,
  selectedDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  setSelectedDate: PropTypes.func,
  selectedDuration: PropTypes.number,
  setSelectedDuration: PropTypes.func
};

export default FloatingCardComponent;
























// import React, { useState, useEffect } from "react";

// import styled from "styled-components";

// import {
//   Card,
//   CardContent,
//   Typography,
//   Divider,
//   Box,
//   Button,
// } from "@mui/material";

// import Grid from "@mui/material/Grid2";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import DurationPicker from "./DurationModal"; // Import the duration picker component
// import dayjs from "dayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { useDispatch } from "react-redux";
// import { getInstaBooksByYacht } from "../../../Redux/yachtReducer/action";
// import Drawer from "./Drawer";
// import { accentColor } from "../../../cssCode";
// import DateSelectorWithDuration from "./DateSelectorWithDuration";
// import DropdownDatePicker from "../HomeComponents/DatePicker";
// import BookNowModal from "./Drawer";
// import AlseDatePicker from "./DateSelect";

// const StyledBookingCard = styled.div`
//   position: sticky !important;
//   top: 50px;
//   height: fit-content;
//   z-index: 10;
//   width: 100%;
//   background-color: #fff!important;
//   padding: 20px;
//   margin-top: 30px;
//   box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
//     rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
//   border-radius: 10px;

//   @media (max-width: 768px) {
//     width: 95%;
//     margin: 20px auto;
//   }
// `;


// const BookButton = styled.button`
//   margin-top: 10px;
//   background-color: #0f4f98;
//   color: white;
//   padding: 10px 20px;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   font-size: 16px;
//   width: 100%;

//   &:hover {
//     background-color: ${accentColor.blue};
//   }
// `;

// const Price = styled.div`
//   font-size: 24px;
//   margin-bottom: 10px;
//   font-weight: bold;
// `;

// const Details = styled.div`
//   margin-bottom: 20px;
//   color: #333;
//   font-size: 14px;
// `;
// const customTheme = createTheme({
//   components: {
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "#fff", // White background for input
//           borderRadius: "8px", // Rounded corners
//           width: "180px", // Ensure consistent width for date picker
//           "& .MuiInputLabel-root": {
//             color: "#000", // Fixed label color
//           },
//           "& .MuiInputBase-input": {
//             padding: "10px", // Padding inside the input
//           },
//         },
//       },
//     },
//     MuiOutlinedInput: {
//       styleOverrides: {
//         root: {
//           borderRadius: "8px", // Rounded corners for the border
//           "& .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#ccc", // Border color
//             color: "#000",
//             border: "none",
//           },
//           "&:hover .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#000", // Border color on hover
//           },
//           "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#000", // Border color on focus
//           },
//         },
//       },
//     },
//     MuiPickersDay: {
//       styleOverrides: {
//         root: {
//           "&.Mui-selected": {
//             backgroundColor: "#1565c0", // Blue color for selected date
//             color: "#fff", // White text for selected date
//           },
//           "&:hover": {
//             backgroundColor: "#1565c0", // Blue background on hover
//             color: "#fff", // White text on hover
//           },
//         },
//       },
//     },
//     MuiFormControl: {
//       styleOverrides: {
//         root: {
//           "& .MuiInputLabel-root": {
//             top: "50%", // Fix label position
//             transform: "none", // Prevent label from floating
//           },
//         },
//       },
//     },
//   },
// });

// const BookingContainer = styled.div`
//   background-color: #022a59;
//   border: 1px solid gray;
//   border-color: #022a59;
//   border-radius: 10px;
//   padding: 15px;
//   // width: 95%;
//   // max-width: 600px;
//   display: flex;
//   // gap: 10px;
//   align-items: center;
//   justify-content: space-around;

//   margin-top: 20px;
// `;

// const FloatingCardComponent = ({
//   yacht,
//   // selectedDate,
//   // setSelectedDate,
//   selectedDuration,
//   setSelectedDuration,
// }) => {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);

//   const handleOpenDrawer = () => setIsDrawerOpen(true);
//   const handleCloseDrawer = () => setIsDrawerOpen(false);

//   const dispatch = useDispatch();
//   // const { instabooks, loading, error } = useSelector((state) => state.instaBook);
//   console.log(selectedDate);
//   const [instaBookings, setInstaBookings] = useState([]);
//   function calculateTotal(priceDetails, duration) {
//     const { daily, hourly, currency } = priceDetails;

//     const dailyRate = daily?.rate > 0 ? daily.rate : Infinity;
//     const hourlyRate = hourly?.rate > 0 ? hourly.rate : Infinity;

//     if (dailyRate === Infinity && hourlyRate === Infinity) {
//       return <span></span>;
//     }

//     // Calculate the lowest price and its unit
//     const result =
//       dailyRate < hourlyRate
//         ? { price: dailyRate, unit: "day" }
//         : { price: hourlyRate, unit: "hour" };
//     const total = result.price * duration;
//     return total;
//   }

//   const CalculatePrice = ({ priceDetails }) => {
//     if (!priceDetails) return "Price not available";

//     const { daily, hourly, currency } = priceDetails;

//     const dailyRate = daily?.rate > 0 ? daily.rate : Infinity;
//     const hourlyRate = hourly?.rate > 0 ? hourly.rate : Infinity;

//     if (dailyRate === Infinity && hourlyRate === Infinity) {
//       return <span></span>;
//     }

//     // Calculate the lowest price and its unit
//     const result =
//       dailyRate < hourlyRate
//         ? { price: dailyRate, unit: "day" }
//         : { price: hourlyRate, unit: "hour" };

//     return (
//       <Price>
//         {currency?.symbol || "$"}
//         {result.price}/{result.unit}
//       </Price>
//     );
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const today = new Date().toISOString().split("T")[0];

//         const instabooks = await dispatch(
//           getInstaBooksByYacht(yacht._id, selectedDate ? selectedDate : today)
//         );
//         setInstaBookings(instabooks);
//         if (!selectedDate) {
//           setSelectedDate(instabooks[0].date);
//         }
//       } catch (error) {
//         console.error("Failed to fetch instabooks:", error);
//       }
//     };

//     fetchData();
//   }, [selectedDate]);
//   // console.log(instaBookings)
//   return (
//     <StyledBookingCard>
//       <Typography style={{ color: "black", fontSize: "14px" }}>
//         Starting from
//       </Typography>
//       {/* <Price>${yacht?.priceDetails?.price} / {yacht?.priceDetails?.unit}</Price> */}
//       <CalculatePrice priceDetails={yacht?.priceDetails} />

//       <Typography variant="subtitle1" component="div" gutterBottom>
//         Captain is included
//       </Typography>
//       <Typography variant="body2" color="text.secondary" paragraph>
//         A captain is provided by the listing owner to host and operate.
//       </Typography>
//       <BookingContainer>
//         <AlseDatePicker
//           dynamicStyle={{ top: "-10px", left: "-150%" }}
//           selectedDate={selectedDate}
//           setSelectedDate={setSelectedDate}
//         />

//         <DemoItem>
//           <DurationPicker
//             setSelectedDuration={setSelectedDuration}
//             selectedDuration={selectedDuration}
//           />
//         </DemoItem>
//       </BookingContainer>

//       {/* <DateSelectorWithDuration/> */}

//       {instaBookings?.length > 0 ? (
//         <BookButton onClick={handleOpenDrawer}>{"Book Now"}</BookButton>
//       ) : (
//         <BookButton >{"Send Inquiry"}</BookButton>
//       )}

//       <Divider sx={{ my: 2 }} />

//       <Typography style={{ textAlign: "center" }}>
//         You won't be charged yet
//       </Typography>

//       <BookNowModal
//         isOpen={isDrawerOpen}
//         onClose={handleCloseDrawer}
//         instaBookings={instaBookings}
//         yacht={yacht}
//       />
//     </StyledBookingCard>
//   );
// };

// export default FloatingCardComponent;

