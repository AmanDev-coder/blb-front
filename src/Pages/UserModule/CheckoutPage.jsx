import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoIosArrowBack } from "react-icons/io";
import { MdClose, MdOutlineGroup } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip, ClickAwayListener } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getInstaBookById,
  getYachtsByID,
} from "../../Redux/yachtReducer/action";
import Skeleton from "@mui/material/Skeleton";
import { CiCalendarDate, CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { GrUserWorker } from "react-icons/gr";
import { accentColor } from "../../cssCode";
import { IoTimeOutline } from "react-icons/io5";
// import { Popover } from "../../components/LibComponents/ui/popover";
const CheckoutPage = () => {
  // States for dynamic inputs
  const [groupSize, setGroupSize] = useState(1);
  const maxGroupSize = 11;
  const { instabookId, boatId } = useParams();
  const dispatch = useDispatch();
  const yacht = useSelector((store) => store.yachtReducer.SingleYacht);
  const [instabook, setInstabook] = useState(null);
  const [departureOptions, setDepartureOptions] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const navigate=useNavigate()
  const incrementGroupSize = () => {
    if (groupSize < maxGroupSize) setGroupSize(groupSize + 1);
  };

  const decrementGroupSize = () => {
    if (groupSize > 1) setGroupSize(groupSize - 1);
  };
  console.log(instabookId)

  const generateDepartureOptions = (instabook) => {
    console.log(instabook);
    const { minStartTime, maxStartTime } = instabook.instabookTripTimes[0];
    const options = [];
    const start = new Date(`2023-01-01T${minStartTime}:00`);
    const end = new Date(`2023-01-01T${maxStartTime}:00`);

    while (start <= end) {
      options.push(
        start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      start.setMinutes(start.getMinutes() + 30);
    }
    console.log(options);
    // return options;
    setDepartureOptions(options);
  };


  const handleProceedToPayment = async () => {
    console.log("req")
    try {
      const response = await fetch(`${BASE_URL}/stripe/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000, currency: "inr" }),
      });
  
      const data = await response.json();
  console.log(data)

      if (data.payment_intent_id) {
        navigate(`/payment/${data.payment_intent_id}`,{ state: { clientSecret: data.client_secret } }); // Redirect to payment page
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
  };
  useEffect(() => {
    const fetchInstaBooking = async () => {
      const Itinerary = await dispatch(getInstaBookById(instabookId));
      generateDepartureOptions(Itinerary);

      setInstabook(Itinerary);
    };
    dispatch(getYachtsByID(boatId));
    fetchInstaBooking();
  }, []);
  console.log(yacht);
  
  
  if (!yacht || !instabook) {
    // Display skeleton loaders while data is being fetched
    return (
      <PageWrapper>
        <Header>
          <BackButton>
            <IoIosArrowBack size={24} />
          </BackButton>
          <HeaderTitle>Book Now</HeaderTitle>
          <CloseButton>
            <MdClose size={24} />
          </CloseButton>
        </Header>
        <Container>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="text" width="80%" />
        </Container>
      </PageWrapper>
    );
  }

  // Destructure required data
  const {
    title,
    location,
    capacity,
    short_description,
    priceDetails,
    cancellationPolicy,
  } = yacht;

  const { tripDuration, date, currency, pricing, transaction, captained } =
    instabook;

  const departureTime = new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const totalCost = pricing?.totals.totalRenterPayment || 0; // Update based on your logic

  // Always execute the useEffect and safely handle undefined data
  const TooltipContent = {
    baseCost: "The base cost is the standard rental fee for the yacht.",
    captainCost:
      "The captain cost is the fee for including a captain in your trip.",
    serviceFee: "The payment service fee covers transaction processing.",
    totalCost: "The total cost is the sum of all charges.",
  };
 
  const handleTooltipOpen = (field) => {
    setTooltipOpen(field);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(null);
  };
  return (
    <PageWrapper>
      {/* Header */}
      <Header>
        <BackButton onClick={() => navigate(`/${yacht._id}`)}>
          <IoIosArrowBack size={24} />
        </BackButton>
        <HeaderTitle>Confirm and pay</HeaderTitle>
        <CloseButton onClick={() => navigate(`/${yacht._id}`)}>
          <MdClose size={24} />
        </CloseButton>
      </Header>

      <Container>
        {/* Left Section */}
        <Section>
          <Title>Your Itinerary</Title>
          <Details>
            <p>
              <CiCalendarDate size={20} /> {new Date(date).toDateString()}{" "}
              &nbsp; | &nbsp; {tripDuration} hour trip &nbsp; | &nbsp;&nbsp;{" "}
              {currency.symbol || "$"}
              {totalCost}
            </p>
            {/* <p>{short_description}</p> */}
          </Details>

          {/* Departure Time */}
          <FlexContainer>
            <InputGroup>
              <label>
                {" "}
                <IoTimeOutline size={20} /> Departure Time
              </label>
              <select
                onChange={() =>
                  generateDepartureOptions(instabook.instabookTripTimes[0])
                }
              >
                {departureOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
                {/* {generateDepartureOptions(instabook.instabookTripTimes[0])} */}
              </select>
              <small>
                Any time between {instabook.instabookTripTimes[0].minStartTime}{" "}
                - {instabook.instabookTripTimes[0].maxStartTime}
              </small>
            </InputGroup>

            {/* Group Size */}
            <InputGroup>
              <label>
                <MdOutlineGroup size={20} /> Group Size{" "}
                <small>({capacity} max)</small>
              </label>
              <div className="group-size">
                {/* <button onClick={decrementGroupSize}>-</button> */}
                <CiCircleMinus
                  className="button"
                  onClick={decrementGroupSize}
                  size={25}
                />
                <span>{groupSize}</span>
                <CiCirclePlus
                  className="button"
                  onClick={incrementGroupSize}
                  size={25}
                />
                {/* <button onClick={incrementGroupSize}>+</button> */}
              </div>
            </InputGroup>
          </FlexContainer>
          {/*</FlexContainer> Independent Captain */}
          <div></div>
          <InfoCard>
            <GrUserWorker size={30} />
            <h4>{captained ? "Captained" : "Independent Captain"}</h4>
            {/* <p>Payments go to the captain directly on your behalf.</p> */}
          </InfoCard>

          {/* Message for Owner */}
          <InputGroup>
            <label>Message for Owner</label>
            <textarea placeholder="Please tell the owner/captain about your event and group." />
          </InputGroup>
        </Section>

        {/* Right Section */}
        <Section>
          <Title>Your Total</Title>
          <BoatCard>
            <img
              src={yacht.images[0]?.imgeUrl}
              alt={title}
              style={{ width: "120px", height: "80px", borderRadius: "10px" }}
            />
            <div className="details">
              <h5>{title}</h5>
              <p>
                {location.city}, {location.state}, {location.country}
              </p>
            </div>
          </BoatCard>

          {/* Cost Breakdown */}
          {/* <Breakdown>
            <div>
              <span>Base Cost</span>
              <span>
                {currency.symbol || "$"}
                {pricing.baseCost || 0}
              </span>
            </div>
            <div>
              <span>Captain Cost</span>
              <span>
                {currency.symbol || "$"}
                {pricing.captainCost || 0}
              </span>
            </div>
            <div>
              <span>Payment Service Fee</span>
              <span>
                {currency.symbol || "$"}
                {pricing.totals.paymentServiceCharge || 0}
              </span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>
                {currency.symbol || "$"}
                {totalCost}
              </span>
            </div>
          </Breakdown> */}
          <Breakdown>
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <div onClick={() => handleTooltipOpen("baseCost")}>
                <Tooltip
                  open={tooltipOpen === "baseCost"}
                  title={TooltipContent.baseCost}
                  placement="top"
                  arrow
                >
                  <span>Base Cost</span>
                </Tooltip>
                <span>
                  {currency.symbol || "$"}
                  {pricing.baseCost || 0}
                </span>
              </div>
            </ClickAwayListener>

            <ClickAwayListener onClickAway={handleTooltipClose}>
              <div onClick={() => handleTooltipOpen("captainCost")}>
                <Tooltip
                  open={tooltipOpen === "captainCost"}
                  title={TooltipContent.captainCost}
                  placement="top"
                  arrow
                >
                  <span>Captain Cost</span>
                </Tooltip>
                <span>
                  {currency.symbol || "$"}
                  {pricing.captainCost || 0}
                </span>
              </div>
            </ClickAwayListener>

            <ClickAwayListener onClickAway={handleTooltipClose}>
              <div onClick={() => handleTooltipOpen("serviceFee")}>
                <Tooltip
                  open={tooltipOpen === "serviceFee"}
                  title={TooltipContent.serviceFee}
                  placement="top"
                  arrow
                >
                  <span>Payment Service Fee</span>
                </Tooltip>
                <span>
                  {currency.symbol || "$"}
                  {pricing.totals?.paymentServiceCharge || 0}
                </span>
              </div>
            </ClickAwayListener>

            <ClickAwayListener onClickAway={handleTooltipClose}>
              <div
                className="total"
                onClick={() => handleTooltipOpen("totalCost")}
              >
                <Tooltip
                  open={tooltipOpen === "totalCost"}
                  title={TooltipContent.totalCost}
                  placement="top"
                  arrow
                >
                  <span>Total</span>
                </Tooltip>
                <span>
                  {currency.symbol || "$"}
                  {totalCost}
                </span>
              </div>
            </ClickAwayListener>
          </Breakdown>
          {/* Terms & Policy */}
          <Policy>
            <h4>Terms and Cancellation Policy</h4>
            <p>Service fees are non-refundable</p>
            <p>
              {cancellationPolicy.daysPrior} days prior for a{" "}
              {cancellationPolicy.refund}% refund.
            </p>
          </Policy>
        </Section>
      </Container>
      {/* <Popover/> */}
      {/* Proceed to Payment */}
      <PaymentButton onClick={handleProceedToPayment}>Proceed to Payment</PaymentButton>
    </PageWrapper>
  );
};

export default CheckoutPage;

// Styled Components

// Add remaining styles like Price, InputGroup, InfoCard, Breakdown, etc., from the earlier code.
const PageWrapper = styled.div`
  background: #f7f7f7;
  //   padding: 20px;
`;

const Header = styled.div`
  margin-top: 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  //   border-radius: 10px;
  margin-bottom: 20px;
`;

const BackButton = styled.div`
  cursor: pointer;
  color: #333;

  &:hover {
    color: #000;
  }
`;

const HeaderTitle = styled.h2`
  font-size: 25px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.div`
  cursor: pointer;
  color: #333;

  &:hover {
    color: #000;
  }
`;

const Container = styled.div`
  width: 60%;
  margin: auto;

  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const Section = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  flex: 0.7;

  &:nth-child(1) {
    flex: 1;
  }
`;

// Add remaining styles like Price, InputGroup, InfoCard, Breakdown, etc., from the earlier code.

const PaymentButton = styled.button`
  width: 30%;
  padding: 15px;
  background: ${accentColor.blue};
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 20px auto; /* Center horizontally */
  display: block; /* Required for margin auto to work */
  text-align: center;

  &:hover {
    background: #1e8e4f;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 15%;
  //   justify-content: space-between;
  //   align-items: center;
  //   border: 1px solid red;
`;
const Title = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

const Price = styled.span`
  background: #e7f8ee;
  color: #27ae60;
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
`;

const Breakdown = styled.div`
  margin: 15px 0;
  span {
    cursor: pointer;
    border-bottom: 1px solid gray;
  }
  div {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;

    &.total {
      font-weight: bold;
    }
  }
`;

const CurrencySelector = styled.div`
  margin: 15px 0;

  label {
    font-size: 14px;
    display: block;
    margin-bottom: 5px;
  }

  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
`;

const Policy = styled.div`
  margin: 15px 0;

  h4 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    margin-bottom: 5px;
  }

  a {
    color: #27ae60;
    text-decoration: underline;
    font-size: 14px;
  }
`;

const OwnerCard = styled.div`
  background: #f8f8f8;
  padding: 15px;
  border-radius: 5px;

  .badge {
    background: #27ae60;
    color: #fff;
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 5px;
    margin-bottom: 5px;
    display: inline-block;
  }

  h5 {
    font-size: 14px;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    color: #666;
  }
`;

const BoatCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: #f8f8f8;
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  img {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }

  .details {
    flex: 1;

    h5 {
      font-size: 16px;
      margin: 0 0 5px;
      color: #333;
    }

    p {
      font-size: 14px;
      margin: 0 0 5px;
      color: #555;
    }

    small {
      font-size: 12px;
      color: #777;
    }
  }
`;

const Rating = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 5px;

  span {
    font-size: 14px;
    font-weight: bold;
    color: #27ae60;
  }

  small {
    font-size: 12px;
    color: #777;
  }
`;

const InputGroup = styled.div`
  margin: 15px 0;
  //   border: 1px solid red;

  label {
    font-size: 14px;
    margin-bottom: 5px;
    display: block;
    display: flex;
    gap: 5px;
    align-items: center;
  }

  select,
  textarea {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  option {
    padding: 10px;
    //   background:#27ae60;
    color: #333;
  }
  select:hover option:hover {
    background: #27ae60;
    color: #fff;
  }
  textarea {
    min-height: 100px;
  }

  .group-size {
    display: flex;
    padding: 10px 0;
    align-items: center;
    gap: 10px;
    //     margin-top: 20px;
    //     border: 1px solid red;
    .button {
      //  background: #ddd;
      //  border: none;
      //  padding: 5px 15px;
      //  border-radius: 50%;
      cursor: pointer;
      //  font-size: 18px;

      &:hover {
        color: rgb(110, 155, 172);
      }
    }

    span {
      padding: 5px 25px;
      font-size: 16px;
      border-radius: 10px;
      //  background:${accentColor.lightBlue};
      border: 1px solid ${accentColor.blue};
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
`;

const InfoCard = styled.div`
  background: #f8f8f8;
  padding: 15px;
  border-radius: 5px;
  margin: 15px 0;
  gap: 10px;
  display: flex;
  h4 {
    font-size: 16px;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    color: #666;
  }
`;
