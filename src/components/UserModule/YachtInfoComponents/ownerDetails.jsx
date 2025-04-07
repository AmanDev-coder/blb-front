import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaCheckCircle, FaUsers } from "react-icons/fa";
import { PiBoatLight, PiShieldCheckLight } from "react-icons/pi";
import { HiOutlineUsers } from "react-icons/hi2";
import { GrUserWorker } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { getOwnerById } from "../../../Redux/yachtReducer/action";
import OwnerModal from "./ownerModal";

// Main container
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
`;

// Feature row with hover effect
const FeatureRow = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(243, 244, 246, 0.4);
  border-radius: 0.75rem;
  border: 1px solid rgba(229, 231, 235, 0.5);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(243, 244, 246, 0.8);
    transform: translateY(-2px);
    box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 12px;
  }
`;

// Owner row with special styling
const OwnerRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem;
  background: linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(124, 58, 237, 0.05));
  border-radius: 0.75rem;
  border: 1px solid rgba(191, 219, 254, 0.3);
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(124, 58, 237, 0.1));
    transform: translateY(-2px);
    box-shadow: rgba(37, 99, 235, 0.1) 0px 4px 12px;
  }
`;

// Icon container
const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${props => props.bg || 'linear-gradient(135deg, #93c5fd, #3b82f6)'};
  color: white;
  font-size: 1.25rem;
  box-shadow: rgba(59, 130, 246, 0.15) 0px 4px 12px;
`;

// Feature content
const FeatureContent = styled.div`
  flex: 1;
`;

// Owner name
const OwnerName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0 0 0.25rem;
`;

// Verification badge
const VerificationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #0369a1;
  background-color: rgba(186, 230, 253, 0.4);
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  
  svg {
    color: #0ea5e9;
  }
`;

// Feature label
const FeatureLabel = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0 0 0.25rem;
`;

// Feature description
const FeatureDescription = styled.p`
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #64748b;
  margin: 0;
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

const OwnerDetailsPage = ({ yacht }) => {
  const { capacity, categories, priceDetails, ownerId } = yacht;
  const dispatch = useDispatch();
  const YachtOwner = useSelector((store) => store.yachtReducer.YachtOwner);
  
  useEffect(() => {
    dispatch(getOwnerById(ownerId));
  }, [dispatch, ownerId]);

  // Features data with icons and gradients
  const features = [
    {
      icon: <PiShieldCheckLight />,
      label: "Free Cancellation",
      description: "Free cancellation up to 24 hours before the start time.",
      gradient: "linear-gradient(135deg, #93c5fd, #3b82f6)"
    },
    {
      icon: <HiOutlineUsers />,
      label: "Capacity",
      description: yacht.capacity || "Not specified",
      gradient: "linear-gradient(135deg, #a5b4fc, #6366f1)"
    },
    {
      icon: <PiBoatLight />,
      label: categories[0]?.categoryName || "Boat",
      description: categories[0]?.subcategoryName || "Luxury Yacht",
      gradient: "linear-gradient(135deg, #fdba74, #f97316)"
    }
  ];
  
  // Add captain feature if provided
  if (priceDetails?.captainProvided) {
    features.push({
      icon: <GrUserWorker />,
      label: "With Captain",
      description: "Professional captain provided with this yacht",
      gradient: "linear-gradient(135deg, #86efac, #10b981)"
    });
  }

  return (
    <Container 
      as={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <OwnerRow variants={itemVariants}>
          <OwnerModal YachtOwner={YachtOwner} />

        <FeatureContent>
          <OwnerName>Hosted by {YachtOwner?.name || "Captain"}</OwnerName>
          <VerificationBadge>
            <FaCheckCircle />
            <span>Verified Host</span>
          </VerificationBadge>
        </FeatureContent>
      </OwnerRow>

      {features.map((feature, index) => (
        <FeatureRow key={index} variants={itemVariants}>
          <IconContainer bg={feature.gradient}>
            {feature.icon}
          </IconContainer>
          <FeatureContent>
            <FeatureLabel>{feature.label}</FeatureLabel>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureContent>
        </FeatureRow>
      ))}
    </Container>
  );
};

export default OwnerDetailsPage;
