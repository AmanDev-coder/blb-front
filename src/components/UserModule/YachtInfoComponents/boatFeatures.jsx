import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  IoBuildOutline, IoBoatOutline, IoCompassOutline,
  IoSpeedometerOutline, IoCalendarOutline, IoFishOutline
} from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import AmenitiesModal from './AmenitisModal';
import { 
  FaAnchor, 
  FaWifi, 
  FaSwimmingPool, 
  FaUtensils, 
  FaGlassMartiniAlt, 
  FaFish, 
  FaDumbbell, 
  FaMusic 
} from 'react-icons/fa';
import { MdOutlineBathtub, MdOutlineDeck, MdAir } from 'react-icons/md';
import { GiBoatFishing, GiJetFighter } from 'react-icons/gi';
import { BsFillPersonFill } from 'react-icons/bs';

// Main container with modern styling
const FeaturesSectionContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

// Grid layout for the feature cards
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }
`;

// Feature card with improved styling and animations
const FeatureCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(145deg, #f8fafc, #f1f5f9);
  border-radius: 1rem;
  padding: 1.5rem 1rem;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 16px, rgba(0, 0, 0, 0.04) 0px 1px 6px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(229, 231, 235, 0.5);

  &:hover {
    transform: translateY(-4px);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 25px, rgba(0, 0, 0, 0.06) 0px 2px 10px;
    border-color: rgba(209, 213, 219, 0.8);
  }
`;

// Icon container with gradient background
const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: ${props => props.bg || 'linear-gradient(135deg, #93c5fd, #3b82f6)'};
  color: white;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  box-shadow: rgba(59, 130, 246, 0.2) 0px 8px 24px;
`;

// Feature label with clean typography
const FeatureLabel = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0 0 0.25rem;
`;

// Feature value with highlighted styling
const FeatureValue = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #334155;
  margin: 0;
`;

// Section for amenities display
const AmenitiesSection = styled.div`
  margin-top: 2rem;
`;

// Section heading with accent line
const SectionHeading = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
    border-radius: 3px;
  }
`;

// Amenities list container with improved layout
const AmenitiesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Individual amenity item with nice hover effect
const AmenityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(243, 244, 246, 0.7);
  }
  
  svg {
    color: #3b82f6;
    font-size: 1.25rem;
    flex-shrink: 0;
  }
`;

// Amenity text with clean styling
const AmenityText = styled.span`
  font-size: 0.95rem;
  color: #334155;
  font-weight: 500;
`;

// Button for showing all amenities
const ShowAllButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem auto 0;
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #3b82f6;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 3px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    transform: translateY(-2px);
  }
  
  svg {
    margin-left: 0.5rem;
    font-size: 0.875rem;
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(2px);
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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

// Custom Icon component to replace @iconify/react
const Icon = ({ icon, ...props }) => {
  // Map icon names to React Icons
  const iconMap = {
    'mdi:anchor': <FaAnchor />,
    'mdi:wifi': <FaWifi />,
    'mdi:pool': <FaSwimmingPool />,
    'mdi:food': <FaUtensils />,
    'mdi:glass-cocktail': <FaGlassMartiniAlt />,
    'mdi:fish': <FaFish />,
    'mdi:dumbbell': <FaDumbbell />,
    'mdi:music': <FaMusic />,
    'mdi:bathtub': <MdOutlineBathtub />,
    'mdi:deck': <MdOutlineDeck />,
    'mdi:air-conditioner': <MdAir />,
    'mdi:boat-fishing': <GiBoatFishing />,
    'mdi:jet-engine': <GiJetFighter />,
    'mdi:account': <BsFillPersonFill />,
    // Add more mappings as needed
  };

  // Return the corresponding React Icon or a default
  return (
    <span className="icon-wrapper" {...props}>
      {iconMap[icon] || <FaAnchor />}
    </span>
  );
};

const BoatFeatures = ({ features }) => {
  const { amenities, make, model, length, year } = features;
  const [boatFeatures, setBoatFeatures] = useState({
    make: "",
    model,
    length,
    year,
    amenities: [],
  });
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Define icon and gradient mapping for amenities
  const iconMapping = {
    "Bar": { icon: "mdi:glass-cocktail", gradient: "linear-gradient(135deg, #fb7185, #e11d48)" },
    "Bluetooth": { icon: "mdi:bluetooth", gradient: "linear-gradient(135deg, #93c5fd, #2563eb)" },
    "WiFi": { icon: "mdi:wifi", gradient: "linear-gradient(135deg, #93c5fd, #2563eb)" },
    "Galley": { icon: "mdi:stove", gradient: "linear-gradient(135deg, #fdba74, #f97316)" },
    "Life Jackets": { icon: "mdi:life-jacket", gradient: "linear-gradient(135deg, #a5b4fc, #6366f1)" },
    "GPS Navigation": { icon: "mdi:compass", gradient: "linear-gradient(135deg, #86efac, #10b981)" },
    "Sound System": { icon: "mdi:music", gradient: "linear-gradient(135deg, #c4b5fd, #8b5cf6)" },
    "Pool": { icon: "mdi:pool", gradient: "linear-gradient(135deg, #93c5fd, #3b82f6)" },
    "Kitchen": { icon: "mdi:food-turkey", gradient: "linear-gradient(135deg, #fdba74, #f97316)" },
    "Refrigerator": { icon: "mdi:fridge", gradient: "linear-gradient(135deg, #a5f3fc, #06b6d4)" },
    "Air Conditioning": { icon: "mdi:air-conditioner", gradient: "linear-gradient(135deg, #a5f3fc, #06b6d4)" },
    "Toilet": { icon: "mdi:toilet", gradient: "linear-gradient(135deg, #c4b5fd, #8b5cf6)" }
  };

  // Core yacht details with icons
  const coreDetails = [
    { 
      label: "Make", 
      value: boatFeatures.make, 
      icon: <IoBuildOutline />,
      gradient: "linear-gradient(135deg, #93c5fd, #3b82f6)"
    },
    { 
      label: "Model", 
      value: boatFeatures.model, 
      icon: <IoBoatOutline />,
      gradient: "linear-gradient(135deg, #a5b4fc, #6366f1)"
    },
    { 
      label: "Length", 
      value: boatFeatures.length, 
      icon: <IoSpeedometerOutline />,
      gradient: "linear-gradient(135deg, #fdba74, #f97316)"
    },
    { 
      label: "Year", 
      value: boatFeatures.year, 
      icon: <IoCalendarOutline />,
      gradient: "linear-gradient(135deg, #86efac, #10b981)"
    },
  ];

  const fetchMake = async () => {
    if (!make) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/features/model?manufacturerId=${make}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

     setBoatFeatures((prev) => ({
      ...prev,
      make: data[0]?.manufacturer?.name
    }));
    } catch (error) {
      console.error("Failed to fetch manufacturer:", error);
    }
  };
  const fetchAmenities = async () => {
    if (!amenities || amenities.length === 0) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/features/amenities/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: amenities }),
      });
      const data = await response.json();

      const mappedAmenities = data.map((amenity) => {
        const mappedInfo = iconMapping[amenity.title] || { icon: "carbon:dot-mark", gradient: "linear-gradient(135deg, #94a3b8, #64748b)" };
        
        return {
        ...amenity,
          iconName: mappedInfo.icon,
          gradient: mappedInfo.gradient
        };
      });

      setBoatFeatures((prev) => ({
        ...prev,
        amenities: mappedAmenities,
      }));
    } catch (error) {
      console.error("Failed to fetch amenities:", error);
    }
  };

  useEffect(() => {
    fetchAmenities();
    fetchMake();
  }, [amenities, make]);

  return (
    <FeaturesSectionContainer>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <FeaturesGrid>
            {coreDetails.map((feature, index) => (
            <FeatureCard 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <IconContainer bg={feature.gradient}>
                  {feature.icon}
              </IconContainer>
              <FeatureLabel>{feature.label}</FeatureLabel>
              <FeatureValue>{feature.value || "—"}</FeatureValue>
              </FeatureCard>
            ))}
        </FeaturesGrid>

        {boatFeatures.amenities.length > 0 && (
          <AmenitiesSection>
            <SectionHeading>Popular Amenities</SectionHeading>
            
            <AmenitiesList>
              {boatFeatures.amenities.slice(0, 8).map((amenity, index) => (
                <AmenityItem 
                  key={index}
                  variants={itemVariants}
                >
                  <Icon icon={amenity.iconName} />
                  <AmenityText>{amenity.title}</AmenityText>
                </AmenityItem>
              ))}
            </AmenitiesList>

            {boatFeatures.amenities.length > 8 && (
              <ShowAllButton 
                onClick={handleOpen}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
        Show all {boatFeatures.amenities.length} amenities
                <Icon icon="material-symbols:arrow-forward-ios-rounded" />
              </ShowAllButton>
            )}
          </AmenitiesSection>
        )}
      </motion.div>

      <AmenitiesModal 
        open={open} 
        handleClose={handleClose} 
        featuresList={boatFeatures.amenities} 
      />
    </FeaturesSectionContainer>
  );
};

export default BoatFeatures;
