


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaCheckCircle } from "react-icons/fa";
// const paymentDetails = {
//   product: "Luxury Yacht Booking",
//   guests: "Up to 10 guests",
//   tripDate: "January 15, 2025",
//   duration: "4 hours",
//   subtotal: 5000,
//   serviceFee: 200,
//   bankCharge: 50,
//   total: 5250,
//   depositAmount: 2000,
//   secondPaymentAmount: 3250,
// };
// const SuccessPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const sessionId = query.get("session_id");

//   const [bookingDetails, setBookingDetails] = useState(null);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8080/bookings/session?session_id=${sessionId}`
//         );
//         const data = await response.json();
//         console.log(data)
//         setBookingDetails(data);
//       } catch (error) {
//         console.error("Error fetching booking details:", error);
//       }
//     };

//     if (sessionId) {
//       fetchDetails();
//     }
//   }, [sessionId]);

//   // Dummy payment details


//   return (
//     <SuccessContainer>
//       <ContentWrapper>
//         <SuccessIcon>
//           <FaCheckCircle />
//         </SuccessIcon>
//         <Title>Payment Successful!</Title>
//         <Subtitle>Thank you for booking with us. Here are your details:</Subtitle>

//         <TableWrapper>
//           <PaymentDetails>
//             <h2>Payment Details</h2>
//             <table>
//               <tbody>
//                 <tr>
//                   <td>Product:</td>
//                   <td>{paymentDetails.product}</td>
//                 </tr>
//                 <tr>
//                   <td>Guests:</td>
//                   <td>{paymentDetails.guests}</td>
//                 </tr>
//                 <tr>
//                   <td>Trip Date:</td>
//                   <td>{paymentDetails.tripDate}</td>
//                 </tr>
//                 <tr>
//                   <td>Duration:</td>
//                   <td>{paymentDetails.duration}</td>
//                 </tr>
//                 <tr>
//                   <td>Subtotal:</td>
//                   <td>${paymentDetails.subtotal.toFixed(2)}</td>
//                 </tr>
//                 <tr>
//                   <td>Service Fee:</td>
//                   <td>${paymentDetails.serviceFee.toFixed(2)}</td>
//                 </tr>
//                 <tr>
//                   <td>Bank Charge:</td>
//                   <td>${paymentDetails.bankCharge.toFixed(2)}</td>
//                 </tr>
//                 <tr className="highlight">
//                   <td>Total:</td>
//                   <td>${paymentDetails.total.toFixed(2)}</td>
//                 </tr>
//                 <tr>
//                   <td>Deposit Amount:</td>
//                   <td>${paymentDetails.depositAmount.toFixed(2)}</td>
//                 </tr>
//                 <tr className="highlight">
//                   <td>Second Payment Amount:</td>
//                   <td>${paymentDetails.secondPaymentAmount.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </PaymentDetails>
//         </TableWrapper>

//         <Button onClick={() => navigate("/")}>Back to Home</Button>
//       </ContentWrapper>
//     </SuccessContainer>
//   );
// };

// export default SuccessPage;

// Styled Components
const SuccessContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  // height: 100vh;
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  padding: 20px;
`;

const ContentWrapper = styled.div`
  text-align: center;
  background: #ffffff;
  color: #333333;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const SuccessIcon = styled.div`
  font-size: 100px;
  color: #4caf50;
  margin: 0 auto 20px; /* Centered horizontally and spaced from the title */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #555555;
  margin-bottom: 30px;
`;

const TableWrapper = styled.div`
  padding: 0 20px; /* Add 20px padding to left and right */
  justify-content: center;
  display: flex;
  
`;

const PaymentDetails = styled.div`
  margin-bottom: 30px;

  h2 {
    margin-bottom: 15px;
    font-size: 20px;
    font-weight: bold;
    color: #333333;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;

    td {
      padding: 10px 15px;
      font-size: 16px;
      color: #333333;
      text-align: left;
      border-bottom: 1px solid #eeeeee;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .highlight {
      font-weight: bold;
      color: #4caf50;
    }
  }
`;

const Button = styled.button`
  display: inline-block;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background: #1b5e20;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #4caf50;
  }
`;
const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sessionId = query.get("session_id");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/bookings/session?session_id=${sessionId}`
        );
        const data = await response.json();
        console.log(data);
        setBookingDetails(data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    if (sessionId) {
      fetchDetails();
    }
  }, [sessionId]);

  if (!bookingDetails) {
    return <p>Loading...</p>;
  }

  // Extract booking details with fallback to dummy data if missing
  const {
    pricing = { totals: {}, baseCost: 0, captainCost: 0 },
    groupSize = "N/A",
    maxCapacity = "N/A",
    startDate = "N/A",
    startTime = "N/A",
    endTime = "N/A",
    tripDuration = "N/A",
    occasion = "N/A",
    status = "N/A",
  } = bookingDetails;

  const {
    totals: {
      totalRenterPayment = 0,
      serviceCharge = 0,
      paymentServiceCharge = 0,
      totalPayout = 0,
    },
    baseCost = 0,
    captainCost = 0,
  } = pricing;

  // Convert startDate to a readable format
  const tripDate = new Date(startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Payment breakdown
  const subtotal = totalRenterPayment;
  const depositAmount = totalRenterPayment  // Example: 40% deposit
  const secondPaymentAmount = totalRenterPayment - depositAmount;

  return (
    <SuccessContainer>
      <ContentWrapper>
        <SuccessIcon>
          <FaCheckCircle />
        </SuccessIcon>
        <Title>Payment Successful!</Title>
        <Subtitle>Thank you for booking with us. Here are your details:</Subtitle>

        <TableWrapper>
          <PaymentDetails>
            <h2>Payment Details</h2>
            <table>
              <tbody>
                <tr>
                  <td>Product:</td>
                  <td>Luxury Yacht Booking</td>
                </tr>
                <tr>
                  <td>Guests:</td>
                  <td>{groupSize} (Max {maxCapacity})</td>
                </tr>
                <tr>
                  <td>Trip Date:</td>
                  <td>{tripDate}</td>
                </tr>
                <tr>
                  <td>Departure Time:</td>
                  <td>{startTime}</td>
                </tr>
                <tr>
                  <td>Return Time:</td>
                  <td>{endTime}</td>
                </tr>
                <tr>
                  <td>Duration:</td>
                  <td>{tripDuration} hours</td>
                </tr>
                <tr>
                  <td>Occasion:</td>
                  <td>{occasion}</td>
                </tr>
                <tr>
                  <td>Subtotal:</td>
                  <td>${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Service Fee:</td>
                  <td>${serviceCharge.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Bank Charge:</td>
                  <td>${paymentServiceCharge.toFixed(2)}</td>
                </tr>
                <tr className="highlight">
                  <td>Total:</td>
                  <td>${totalRenterPayment.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Deposit Amount:</td>
                  <td>${depositAmount.toFixed(2)}</td>
                </tr>
                <tr className="highlight">
                  <td>Second Payment Amount:</td>
                  <td>${secondPaymentAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </PaymentDetails>
        </TableWrapper>

        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </ContentWrapper>
    </SuccessContainer>
  );
};

export default SuccessPage;
