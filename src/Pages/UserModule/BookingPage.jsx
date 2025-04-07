import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { format, parse, addMinutes } from "date-fns"; 
import styled from "styled-components";
import {
  fetchOwnerByYachtId,
  getInstaBookById,
  getYachtsByID,
} from "../../Redux/yachtReducer/action";
import { useDispatch, useSelector } from "react-redux";
import { GrUserWorker } from "react-icons/gr";
import { accentColor } from "../../cssCode";
import axios from "axios";
import { FaShip, FaRegCalendarAlt, FaDollarSign, FaUserFriends, FaClock, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";

const currencyRates = {
  USD: 1, // Base currency
  CAD: 1.25, // Example: 1 USD = 1.25 CAD
  INR: 75, // Example: 1 USD = 75 INR
};

// Modern styled components with updated design
const BookingPageContainer = styled.div`
  display: flex;
  margin: 0 auto;
  padding: 0 24px 48px;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  max-width: 1200px;
  background-color: #f9fafb;
`;

const LeftSectionContainer = styled.div`
  flex: 2;
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  max-width: 650px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  h2 {
    font-size: 26px;
    font-weight: 700;
    color: #1a202c;
  }

  .highlighted-price {
    background-color: #ebf7f2;
    color: #047857;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 20px;
    font-weight: 700;
  }
`;

const Label = styled.label`
  font-size: 15px;
  color: #4a5568;
  margin-bottom: 8px;
  font-weight: 500;
  display: block;
`;

const SmallText = styled.small`
  font-size: 13px;
  color: #718096;
  display: block;
  margin-top: 6px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  > div {
    flex: 1;
  }

  input,
  select {
    width: 100%;
    padding: 12px 16px;
    font-size: 15px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #f8fafc;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${accentColor.blue};
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
    }
  }
`;

const GroupSizeInput = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;

  input {
    width: 60px;
    text-align: center;
    border: none;
    outline: none;
    font-size: 15px;
    padding: 12px 0;
    font-weight: 500;
  }

  button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f1f5f9;
    border: none;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #e2e8f0;
    }
  }
`;

const IconSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;

  svg {
    font-size: 24px;
    color: ${accentColor.blue};
    margin-top: 4px;
  }

  div {
    h4 {
      font-size: 17px;
      font-weight: 600;
      color: #1a202c;
      margin: 0 0 4px;
    }

    p {
      font-size: 14px;
      color: #4a5568;
      margin: 0;
      line-height: 1.5;
    }
  }
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e2e8f0;
  margin: 8px 0;
`;

const FormSection = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const OccasionDropdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  select {
    padding: 12px 16px;
    font-size: 15px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #f8fafc;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${accentColor.blue};
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
    }
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  resize: none;
  background: #f8fafc;
  min-height: 120px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${accentColor.blue};
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }
`;

const YachtInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h4 {
    font-size: 18px;
    font-weight: 600;
    color: #1a202c;
    margin: 0;
  }

  p {
    font-size: 14px;
    color: #4a5568;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;

    span {
      font-weight: 600;
      color: #1a202c;
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
  }

  button {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background-color: rgba(255, 255, 255, 0.9);
    color: ${accentColor.blue};
    border: none;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(4px);

    &:hover {
      background-color: ${accentColor.blue};
      color: #ffffff;
    }
  }
`;

const RightSection = styled.div`
  flex: 1;
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  max-width: 380px;
  height: fit-content;
  width: 100%;
  position: sticky;
  top: 32px;
`;

const OwnerInfo = styled.div`
  margin-top: 24px;
  padding: 20px;
  border-radius: 12px;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 16px;

  .owner-image {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .owner-details {
    display: flex;
    flex-direction: column;

    .owner-title {
      font-size: 13px;
      font-weight: 700;
      color: ${accentColor.blue};
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;

      .badge-icon {
        width: 16px;
        height: 16px;
        background-color: ${accentColor.blue};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        font-weight: bold;
      }
    }

    .owner-name {
      font-size: 16px;
      font-weight: 600;
      color: #1a202c;
      margin-top: 2px;
    }

    .owner-message {
      font-size: 14px;
      color: #4a5568;
      line-height: 1.5;
      margin-top: 4px;
    }
  }
`;

const TotalSection = styled.div`
  padding: 24px;
  border-radius: 12px;
  background-color: #f8fafc;

  h4 {
    font-size: 18px;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 16px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 16px;

    li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;

      span {
        font-size: 15px;
        color: #4a5568;
      }

      strong {
        font-size: 15px;
        font-weight: 600;
        color: #1a202c;
      }
    }
  }

  .horizontal-line {
    border-top: 1px solid #e2e8f0;
    margin: 16px 0;
  }

  .total-amount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0;

    span {
      font-size: 16px;
      font-weight: 600;
      color: #1a202c;
    }

    h4 {
      font-size: 20px;
      font-weight: 700;
      color: ${accentColor.blue};
      margin: 0;
    }
  }

  .currency-dropdown {
    width: 100%;
    padding: 12px 16px;
    font-size: 15px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 16px;
    background-color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${accentColor.blue};
    }
  }

  .policy-section {
    margin-top: 16px;

    p {
      font-size: 14px;
      color: #4a5568;
      line-height: 1.5;
      margin-bottom: 8px;
    }

    a {
      font-size: 14px;
      color: ${accentColor.blue};
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const Header = styled.div`
  margin-top: 5%;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  // z-index: 100;
  padding: 16px 24px;
  margin-bottom: 32px;
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled.div`
  cursor: pointer;
  color: #4a5568;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #1a202c;
  }
`;

const HeaderTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
`;

const CloseButton = styled.div`
  cursor: pointer;
  color: #4a5568;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #1a202c;
  }
`;

const PaymentButton = styled.button`
  width: 100%;
  max-width: 380px;
  padding: 16px;
  background: ${accentColor.blue};
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 40px auto 0;
  display: block;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #0366d6;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Loading spinner component
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  
  &:after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid ${accentColor.blue};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Add new styled components for customer info
const CustomerInfoSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: ${accentColor.blue};
  }
`;

const InputField = styled.div`
  margin-bottom: 16px;
  
  input {
    width: 100%;
    padding: 12px 16px;
    font-size: 15px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #f8fafc;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${accentColor.blue};
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
    }

    &::placeholder {
      color: #a0aec0;
    }
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const CheckboxField = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 16px;
  
  input[type="checkbox"] {
    margin-top: 3px;
    width: 16px;
    height: 16px;
    accent-color: ${accentColor.blue};
  }
  
  label {
    font-size: 14px;
    color: #4a5568;
    line-height: 1.4;
  }
`;

// Add new components for the page title and fraud notice
const PageTitleContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto 32px;
  padding: 0 24px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
`;

const SecurityNotice = styled.div`
  background: #ebf7fd;
  border-radius: 12px;
  padding: 16px 20px;
  margin-top: 20px;
  border-left: 4px solid ${accentColor.blue};
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #1a202c;
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  p {
    font-size: 14px;
    color: #4a5568;
    margin: 0;
    line-height: 1.5;
  }
  
  ul {
    margin: 8px 0 0;
    padding-left: 20px;
    
    li {
      font-size: 14px;
      color: #4a5568;
      margin-bottom: 4px;
    }
  }
`;

const PaymentSecurityInfo = styled.div`
  margin-top: 24px;
  padding: 16px;
  border-radius: 12px;
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  
  h4 {
    font-size: 15px;
    font-weight: 600;
    color: #1a202c;
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
      color: ${accentColor.blue};
    }
  }
  
  p {
    font-size: 13px;
    color: #4a5568;
    margin: 0;
    line-height: 1.5;
  }
`;

const DepartureTimeNote = styled.div`
  background-color: #f8f9fa;
  border-left: 3px solid ${accentColor.blue};
  padding: 12px 16px;
  margin-top: 16px;
  border-radius: 6px;
  
  p {
    font-size: 14px;
    color: #4a5568;
    margin: 0;
    line-height: 1.5;
  }
  
  strong {
    color: #1a202c;
  }
`;

const init = {
  yachtId: "",
  userId: "", // Replace with actual user ID retrieval logic
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  tripDuration: "",
  groupSize: 1,
  maxCapacity: 0,
  pricing: 0,
  occasion: "",
  specialRequest: "",
  status: "pending",
  instabookId: "",
};

const BookingPage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD"); // Default to USD
  const [selectedDepartureTime, setSelectedDepartureTime] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const maxGroupSize = 11;
  const { instabookId, boatId } = useParams();
  const dispatch = useDispatch();
  const yacht = useSelector((store) => store.yachtReducer.SingleYacht);
  const yachtOwner = useSelector((store) => store.yachtReducer.YachtOwner);
  const [instabook, setInstabook] = useState(null);
  const [departureOptions, setDepartureOptions] = useState([]);
  const navigate = useNavigate();
  const [currencyRates, setCurrencyRates] = useState({});
  const [convertedPricing, setConvertedPricing] = useState(null);
  const [BookingInfo, setBookingInfo] = useState(init);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // New state for customer information
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequirements: "",
    agreeToTerms: false
  });
  
  // Handle customer info input changes
  const handleCustomerInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Update BookingInfo with customer data
    if (type !== 'checkbox') {
      updateBookingInfo({ [name]: value });
    }
  };


// console.log("instabookId",instabookId,boatId);
useEffect(()=>{
  if(!instabookId){
    const bookingData=JSON.parse(localStorage.getItem("bookingData"));
    console.log(bookingData);
    setInstabook(bookingData);
  }
},[instabookId]);

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        setCurrencyRates(data.rates);
      } catch (error) {
        console.error("Error fetching currency rates:", error);
      }
    };

    fetchCurrencyRates();
  }, []);

  useEffect(() => {
    if (instabook && currencyRates[selectedCurrency]) {
      const conversionRate = currencyRates[selectedCurrency];

      // Convert Pricing
      const converted = {
        totalRenterPayment: (
          instabook.pricing.totals.totalRenterPayment * conversionRate
        ).toFixed(2),
        serviceCharge: (
          instabook.pricing.totals.serviceCharge * conversionRate
        ).toFixed(2),
        paymentServiceCharge: (
          instabook.pricing.totals.paymentServiceCharge * conversionRate
        ).toFixed(2),
        baseCost: (instabook.pricing.baseCost * conversionRate).toFixed(2),
        captainCost: (instabook.pricing.captainCost * conversionRate).toFixed(
          2
        ),
      };

      setConvertedPricing(converted);
    }
  }, [instabook, currencyRates, selectedCurrency]);

  // Handle Currency Change
  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const updateBookingInfo = (updates) => {
    setBookingInfo((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const incrementGroupSize = () => {
    if (groupSize < maxGroupSize) setGroupSize(groupSize + 1);
    updateBookingInfo({ groupSize: groupSize + 1 });
  };

  const decrementGroupSize = () => {
    if (groupSize > 1) setGroupSize(groupSize - 1);
    updateBookingInfo({ groupSize: groupSize - 1 });
  };

  const generateDepartureOptions = (instabook) => {
    const { minStartTime, maxStartTime } = instabook.instabookTripTimes[0];
    const options = [];
    const start = new Date(`2023-01-01T${minStartTime}:00`);
    const end = new Date(`2023-01-01T${maxStartTime}:00`);
console.log("start",start,"end",end);

    while (start <= end) {
      options.push(
        start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      start.setMinutes(start.getMinutes() + 30);
    }
    setDepartureOptions(options);
    console.log("departureOptions",departureOptions);
  };

  useEffect(() => {
    const fetchInstaBooking = async () => {
      setIsLoading(true);
      try {
        const Itinerary = await dispatch(getInstaBookById(instabookId));
        generateDepartureOptions(Itinerary);
        
        // Extract startTime (defaulting to empty to make it optional)
        let startTime = "";
        let endTime = "";
        
        // Only set default times if we want to pre-select a time
        if (Itinerary.instabookTripTimes?.[0]?.minStartTime) {
          // For display purposes only - user can change or leave blank
          startTime = format(parse(Itinerary.instabookTripTimes[0].minStartTime, "HH:mm", new Date()), "hh:mm a");
          
          // Calculate potential end time for display
          const tripDuration = parseFloat(Itinerary.tripDuration) || 1;
          const [hours, minutes] = startTime.split(/:| /);
          const endTimeDate = new Date();
          endTimeDate.setHours(parseInt(hours) + tripDuration);
          endTimeDate.setMinutes(parseInt(minutes));
          endTime = format(endTimeDate, "hh:mm a");
        }
        
        const user = JSON.parse(sessionStorage.getItem("user"))
        
        updateBookingInfo({
          yachtId: Itinerary.yachtId._id,
          userId: user?.id,
          startDate: Itinerary.date,
          endDate: Itinerary.date,
          maxCapacity: Itinerary.yachtId.capacity,
          pricing: Itinerary.pricing,
          captained: Itinerary.captained,
          tripDuration: Itinerary.tripDuration,
          startTime,
          endTime,
          instabookId,
        });

        setInstabook(Itinerary);
        setSelectedDepartureTime(startTime);
        
        await Promise.all([
          dispatch(getYachtsByID(boatId)),
          dispatch(fetchOwnerByYachtId(boatId))
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching booking data:", error);
        setIsLoading(false);
      }
    };

    dispatch(getYachtsByID(boatId));
    dispatch(fetchOwnerByYachtId(boatId));
    if(instabookId){
      fetchInstaBooking();
    }
  }, []);
  console.log(BookingInfo);

  const handleCheckout = async () => {
    // Validate customer information
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert("Please fill in your contact information to proceed.");
      return;
    }
    
    if (!customerInfo.agreeToTerms) {
      alert("Please agree to the terms and conditions to proceed.");
      return;
    }
    
    // Departure time is optional, no validation needed for it
    
    try {
      // Adding loading state for payment processing
      setIsLoading(true);
      
      const response = await axios.post(`${BASE_URL}/bookings`, {
        exchangeRate: currencyRates[selectedCurrency],
        ...BookingInfo,
        ownerId: yachtOwner._id,
        // customerInfo: {
        //   name: customerInfo.name,
        //   email: customerInfo.email,
        //   phone: customerInfo.phone,
        //   specialRequirements: customerInfo.specialRequirements
        // }
      });
      
      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe Checkout
      } else {
        setIsLoading(false);
        toast.error("Payment link generation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const handleDepartureChange = (event) => {
    const selectedTime = event.target.value;
    setSelectedDepartureTime(selectedTime);

    const timeParts = selectedTime.split(/[: ]/);
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const isPM = timeParts[2]?.toLowerCase() === "pm";

    // Adjust hours for PM times
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    // Create a new Date object for the start time
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0);

    // Add trip duration (in hours) to the start time
    const tripDuration = parseFloat(BookingInfo.tripDuration) || 1; // Default to 1 hour if missing
    const durationInMinutes = tripDuration * 60; // Convert hours to minutes
    const endTime = new Date(
      startTime.getTime() + durationInMinutes * 60 * 1000
    );

    // Format the end time back to "hh:mm am/pm"
    const formattedEndTime = endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    updateBookingInfo({
      startTime: selectedTime,
      endTime: formattedEndTime,
    });
  };

  const handleOccasionChange = (event) => {
    updateBookingInfo({ occasion: event.target.value });
  };

  const handleMessageChange = (event) => {
    updateBookingInfo({ specialRequest: event.target.value });
  };
  
  if (isLoading) return <LoadingSpinner />;
  
  if (!yacht || !instabook || !yachtOwner || !convertedPricing)
    return <LoadingSpinner />;
    
  const {
    title,
    location,
    capacity,
    short_description,
    priceDetails,
    cancellationPolicy,
  } = yacht;

  const { tripDuration, date, captained } = instabook;

  // Format date properly
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format location properly
  const formatLocation = (location) => {
    if (!location) return '';
    if (typeof location === 'string') return location;
    
    // If location is an object with city, state properties
    if (location.city || location.state) {
      return [location.city, location.state].filter(Boolean).join(', ');
    }
    
    // Fallback
    return 'Location details unavailable';
  };

  return (
    <>
      <Header>
        <HeaderInner>
          <BackButton onClick={() => navigate(`/${yacht._id}`)}>
            <IoIosArrowBack size={24} />
          </BackButton>
          <HeaderTitle>Booking Details</HeaderTitle>
          <CloseButton onClick={() => navigate(`/${yacht._id}`)}>
            <MdClose size={24} />
          </CloseButton>
        </HeaderInner>
      </Header>
      

      <BookingPageContainer>
        <LeftSectionContainer>
          {/* Yacht Info */}
          <YachtInfo>
            <SectionHeader>
              <h2>{title}</h2>
              <span className="highlighted-price">
                {selectedCurrency} {convertedPricing?.totalRenterPayment}
              </span>
            </SectionHeader>
            
            <p>
              <FaRegStar style={{ color: "#FFC107" }} />
              <span>5.0</span> (18 reviews) · {formatLocation(location)}
            </p>
          </YachtInfo>

          {/* Yacht Image */}
          <ImageContainer>
            <img
              src={yacht.images[0]?.imgeUrl || "https://via.placeholder.com/600x300"}
              alt={title}
            />
            <button>View Photos</button>
          </ImageContainer>

          <HorizontalLine />

          {/* Trip Details */}
          <div>
            <SectionTitle>
              <FaRegCalendarAlt />
              Trip Details
            </SectionTitle>
            
            <IconSection>
              <FaRegCalendarAlt />
              <div>
                <h4>Date</h4>
                <p>{formattedDate}</p>
              </div>
            </IconSection>
            
            <IconSection style={{ marginTop: "16px" }}>
              <FaClock />
              <div>
                <h4>Duration</h4>
                <p>{tripDuration} {tripDuration === 1 ? 'hour' : 'hours'}</p>
              </div>
            </IconSection>

            {/* Departure Time and Group Size */}
            <div style={{ marginTop: "24px" }}>
              <InputGroup>
                <div>
                  <Label>Departure Time (optional)</Label>
                  <select
                    value={selectedDepartureTime}
                    onChange={handleDepartureChange}
                  >
                    <option value="">Select a time</option>
                    {departureOptions.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <SmallText>
                    Available between {instabook.instabookTripTimes[0].minStartTime} - {instabook.instabookTripTimes[0].maxStartTime}
                  </SmallText>
                  
                  <DepartureTimeNote>
                    <p>
                      <strong>Note:</strong> If you don't select a specific departure time, the captain will contact you to arrange a time within the available window.
                    </p>
                  </DepartureTimeNote>
                </div>

                <div>
                  <Label>Group Size ({capacity} max)</Label>
                  <GroupSizeInput>
                    <button onClick={decrementGroupSize}>-</button>
                    <input type="number" value={groupSize} readOnly />
                    <button onClick={incrementGroupSize}>+</button>
                  </GroupSizeInput>
                  <SmallText>
                    <FaUserFriends style={{ marginRight: "4px", fontSize: "12px" }} />
                    This yacht can accommodate up to {capacity} guests
                  </SmallText>
                </div>
              </InputGroup>
            </div>
          </div>

          <HorizontalLine />

          {/* Captain Status */}
          <IconSection>
            <GrUserWorker size={30} />
            <div>
              <h4>{captained ? "Professional Captain Included" : "Independent Captain"}</h4>
              <p>{captained 
                ? "A professional captain will navigate your journey for a worry-free experience."
                : "Payments go to the captain directly on your behalf."}</p>
            </div>
          </IconSection>

          <HorizontalLine />

          {/* Select an Occasion */}
          <OccasionDropdown onChange={handleOccasionChange}>
            <Label>Select an Occasion (optional)</Label>
            <select>
              <option value="">Select an occasion</option>
              <option value="Birthday">Birthday</option>
              <option value="Bachelorette">Bachelorette / Bachelor Party</option>
              <option value="Sightseeing">Sightseeing</option>
              <option value="Engagement">Engagement / Proposal</option>
              <option value="Fishing">Fishing</option>
              <option value="Business">Business Event</option>
              <option value="Celebration">Celebration</option>
              <option value="Other">Other</option>
            </select>
          </OccasionDropdown>

          {/* Message for Owner */}
          <div>
            <Label>Special Requests or Comments</Label>
            <TextArea
              rows="4"
              name="specialRequirements"
              value={customerInfo.specialRequirements}
              onChange={handleCustomerInfoChange}
              placeholder="Please tell the owner/captain about any special requirements, dietary preferences, or other needs."
            />
          </div>

          <HorizontalLine />

          {/* Customer Information - New Section */}
          <CustomerInfoSection>
            <SectionTitle>
              <FaUserFriends />
              Customer Information
            </SectionTitle>
            
            <InputField>
              <Label htmlFor="name">Full Name*</Label>
              <input 
                type="text" 
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleCustomerInfoChange}
                placeholder="Enter your full name"
                required
              />
            </InputField>
            
            <InputRow>
              <InputField>
                <Label htmlFor="email">Email Address*</Label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleCustomerInfoChange}
                  placeholder="your@email.com"
                  required
                />
              </InputField>
              
              <InputField>
                <Label htmlFor="phone">Phone Number*</Label>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                  placeholder="(123) 456-7890"
                  required
                />
              </InputField>
            </InputRow>
            
            {/* Security Notice */}
            <SecurityNotice>
              <h4>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Secure Booking Protection
              </h4>
              <p>For your safety and security, please note:</p>
              <ul>
                <li>Never make payments outside our secure platform</li>
                <li>Report suspicious requests for payments via wire transfer or gift cards</li>
                <li>Your payment details are encrypted and securely processed</li>
                <li>We will never ask for your password or personal financial information</li>
              </ul>
            </SecurityNotice>
            
            <CheckboxField style={{ marginTop: "16px" }}>
              <input 
                type="checkbox" 
                id="agreeToTerms"
                name="agreeToTerms"
                checked={customerInfo.agreeToTerms}
                onChange={handleCustomerInfoChange}
              />
              <label htmlFor="agreeToTerms">
                I agree to the <a href="#" style={{ color: accentColor.blue, textDecoration: 'none' }}>terms and conditions</a>, including the cancellation policy.
              </label>
            </CheckboxField>
          </CustomerInfoSection>
        </LeftSectionContainer>

        {/* Right Section */}
        <RightSection>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1a202c", marginBottom: "24px" }}>
            Payment Summary
          </h3>
          
          <TotalSection>
            <ul>
              <li>
                <span>Base Cost</span>
                <strong>
                  {selectedCurrency} {convertedPricing.baseCost}
                </strong>
              </li>
              <li>
                <span>Captain Cost</span>
                <strong>
                  {selectedCurrency} {convertedPricing.captainCost}
                </strong>
              </li>
              <li>
                <span>Service Fee</span>
                <strong>
                  {selectedCurrency} {convertedPricing.paymentServiceCharge}
                </strong>
              </li>
            </ul>
            
            <div className="horizontal-line"></div>
            
            <div className="total-amount">
              <span>Total</span>
              <h4>
                {selectedCurrency} {convertedPricing.totalRenterPayment}
              </h4>
            </div>

            <select
              className="currency-dropdown"
              value={selectedCurrency}
              onChange={handleCurrencyChange}
            >
              {Object.keys(currencyRates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            
            <div className="policy-section">
              <p>
                <strong>Terms and Cancellation Policy</strong>
              </p>
              <p>Service fees are non-refundable</p>
              <a href="#">100% refund of offer amount up to 7 days prior.</a>
            </div>
          </TotalSection>

          <OwnerInfo>
            <img
              className="owner-image"
              src={yachtOwner.profileImage || "https://via.placeholder.com/56"}
              alt={yachtOwner.name}
            />

            <div className="owner-details">
              <div className="owner-title">
                SUPER OWNER
                <div className="badge-icon">★</div>
              </div>
              <div className="owner-name">{yachtOwner.name}</div>
              <p className="owner-message">
                After booking, you will be able to chat with the owner via the
                messaging system.
              </p>
            </div>
          </OwnerInfo>
          
          <PaymentSecurityInfo>
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Secure Payment Processing
            </h4>
            <p>
              Your payment information is encrypted and processed securely. We comply with PCI DSS standards and use industry-leading encryption technology to protect your personal data.
            </p>
          </PaymentSecurityInfo>
          
          <PaymentButton onClick={handleCheckout}>
            Proceed to Payment
          </PaymentButton>
        </RightSection>
      </BookingPageContainer>
    </>
  );
};

export default BookingPage;
