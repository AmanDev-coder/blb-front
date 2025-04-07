import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";
import { Users, Ruler, Star, MapPin, Calendar, ShieldCheck, Waves, ChevronRight } from "lucide-react";
import { GoHeartFill } from "react-icons/go";
import { Card } from "../../LibComponents/ui/card";
import { BorderBeam } from "../../LibComponents/magicui/border-beam";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { fetchWishlist, toggleWishlist } from "../../../Redux/yachtReducer/action";
import { useDispatch } from "react-redux";
import { BlBtoast } from "../../../hooks/toast";
import { motion, AnimatePresence } from "framer-motion";

// Ultra modern card with custom shape
const CardContainer = styled(motion.div)`
  position: relative;
  min-width: 340px;
  height: 520px;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  background: white;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.03),
    0 20px 48px rgba(0, 0, 0, 0.07),
    0 0 0 1px rgba(220, 230, 245, 0.5);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  
  &:hover {
    transform: translateY(-16px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.08),
      0 15px 25px rgba(59, 130, 246, 0.08),
      0 0 0 1px rgba(59, 130, 246, 0.2);
  }
`;

// Full bleed image container with interactive elements
const ImageContainer = styled.div`
  position: relative;
  height: 260px;
  width: 100%;
  overflow: hidden;
`;

// Image gallery indicator dots
const GalleryDots = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 20;
`;

const GalleryDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  
  &:hover {
    background: white;
    transform: scale(1.2);
  }
`;

// Modern image with smooth transitions and aspect ratio
const YachtImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
  
  ${CardContainer}:hover & {
    transform: scale(1.07);
  }
`;

// Gradient overlay for image
const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.5) 100%
  );
  z-index: 1;
`;

// Loading state with skeleton animation
const LoadingSkeleton = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(110deg, #eff6ff 30%, #f1f5f9 50%, #eff6ff 70%);
  background-size: 200% 100%;
  animation: shimmer 1.8s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.875rem;
  
  @keyframes shimmer {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

// Modern styled yacht info container
const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  position: relative;
  z-index: 2;
`;

// Yacht name with modern styling
const YachtName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #0f172a;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Rating display with stars
const RatingDisplay = styled.div`
  position: absolute;
  top: -24px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #fff;
  padding: 6px 12px;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  z-index: 10;
  
  svg {
    color: #f59e0b;
  }
  
  span {
    font-weight: 600;
    color: #1e3a8a;
    font-size: 0.95rem;
  }
`;

// Location display with enhanced styling
const LocationDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  svg {
    color: #f59e0b;
    min-width: 16px;
  }
`;

// Features container with modern grid
const FeaturesContainer = styled.div`
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding-bottom: 1rem;
`;

// Individual feature with hover effects
const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
  transition: all 0.2s ease;
  
  svg {
    color: #3b82f6;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: #1e3a8a;
    transform: translateX(3px);
    
    svg {
      transform: scale(1.15);
    }
  }
`;

// Bottom section with price and CTA
const BottomSection = styled.div`
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

// Price display with currency and period
const PriceDisplay = styled.div`
  flex: 1;
  
  .price-value {
    font-size: 1.75rem;
    font-weight: 700;
    background: linear-gradient(90deg, #1e40af, #3b82f6);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    line-height: 1.2;
  }
  
  .price-period {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }
`;

// Modern CTA button
const ViewButton = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
  border-radius: 30px;
  padding: 0.6rem 1.25rem;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  
  svg {
    transition: transform 0.3s ease;
    margin-left: 6px;
  }
  
  &:hover {
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    transform: translateY(-2px);
    
    svg {
      transform: translateX(3px);
    }
  }
`;

// Enhanced heart button with animations
const HeartButton = styled(motion.div)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    background: white;
  }
`;

// Enhanced compare checkbox
const CompareCheckbox = styled(motion.div)`
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  padding: 0.6rem 0.8rem;
  border-radius: 30px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #3b82f6;
  }

  label {
    font-size: 0.875rem;
    color: #1e3a8a;
    font-weight: 500;
    cursor: pointer;
  }
`;

// Luxury tag with shine effect
const LuxuryTag = styled(motion.div)`
  position: absolute;
  top: 16px;
  left: 16px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  z-index: 10;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    animation: shine 3s infinite;
  }
  
  @keyframes shine {
    0% {
      transform: rotate(30deg) translateX(-100%);
    }
    20%, 100% {
      transform: rotate(30deg) translateX(100%);
    }
  }
`;

const YachtCard = ({
  yacht,
  index,
  activeCard,
  setActiveCard,
  setIsCompareActive,
  isCompareActive,
  selectedYachts,
  setSelectedYachts,
  wishlist,
}) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const dispatch = useDispatch();
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem("user"));
  
  // Update isWishlisted based on wishlist prop
  useEffect(() => {
    if (wishlist && yacht && yacht._id) {
      setIsWishlisted(wishlist.includes(yacht._id));
    }
  }, [wishlist, yacht]);
  
  // Handle checkbox change for comparison
  const handleCheckboxChange = (e, yacht) => {
    e.stopPropagation();
    setIsCompareActive(true);

    if (!isCompareActive) {
      setSelectedYachts([]); // Clear all selections if comparison is not active
    }

    setSelectedYachts(
      (prev) =>
        prev.some((selected) => selected._id === yacht._id)
          ? prev.filter((selected) => selected._id !== yacht._id) // Unselect yacht
          : [...prev, yacht] // Add yacht to selection
    );
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async(e, yachtId) => {
    e.stopPropagation();

    if (!user) {
      BlBtoast("Please Login First To Create Wishlist");
      navigate("/auth");
      return;
    }

    await dispatch(toggleWishlist(user.id, yachtId, isWishlisted)).then((res) => {
      if (res.status == "success") {
        setIsWishlisted(!isWishlisted);
        BlBtoast(!isWishlisted ? "Added To Wishlist" : "Removed From Wishlist");
      }
    });
    dispatch(fetchWishlist(user.id));
  };

  // Image slideshow for gallery effect
  useEffect(() => {
    let interval;
    if (yacht?.images?.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % yacht.images.length
        );
      }, 4000); // Slightly longer time for a more elegant transition
    }

    return () => clearInterval(interval);
  }, [yacht?.images?.length]);

  // Handle show/hide of compare checkbox
  useEffect(() => {
    if (!isCompareActive && location.pathname !== "/") {
      setSelectedYachts([]);
    }
  }, [isCompareActive, location.pathname, setSelectedYachts]);

  const handleShowChecbox = (val) => {
    if (location.pathname == "/") {
      setShowCheckbox(false);
      return;
    }
    setShowCheckbox(val);
  };

  // Handle direct image selection
  const handleSelectImage = (e, index) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  // Improved price calculation component
  const CalculatePrice = ({ priceDetails }) => {
    if (!priceDetails) return "Price not available";

    const { daily, hourly, currency } = priceDetails;

    const dailyRate = daily?.rate > 0 ? daily.rate : Infinity;
    const hourlyRate = hourly?.rate > 0 ? hourly.rate : Infinity;

    if (dailyRate === Infinity && hourlyRate === Infinity) {
      return <span className="price-value">Price on request</span>;
    }

    // Calculate the lowest price and its unit
    const result =
      dailyRate < hourlyRate
        ? { price: dailyRate, unit: "day" }
        : { price: hourlyRate, unit: "hour" };

    return (
      <>
        <span className="price-value">{currency?.symbol || "$"}{result.price.toLocaleString()}</span>
        <div className="price-period">per {result.unit}</div>
      </>
    );
  };

  // PropTypes for the CalculatePrice component
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

  // Check if yacht has required data
  if (!yacht) return null;

  // Determine if yacht is luxury based on certain criteria
  const isLuxury = yacht?.features?.luxury || yacht?.priceDetails?.daily?.rate > 5000;
  
  // Get safe image URL
  const getImageUrl = (index) => {
    if (!yacht.images || !yacht.images[index] || !yacht.images[index].imgeUrl) {
      return 'https://placehold.co/600x400/e2e8f0/1e40af?text=No+Image';
    }
    return yacht.images[index].imgeUrl;
  };

  return (
    <CardContainer
      onClick={() => navigate(`/${yacht?._id}`)}
      onMouseEnter={() => handleShowChecbox(true)}
      onMouseLeave={() => handleShowChecbox(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <ImageContainer>
        <ImageOverlay />
        
        {yacht?.images?.length > 0 ? (
          <AnimatePresence mode="wait">
            <YachtImage
              key={currentImageIndex}
              src={getImageUrl(currentImageIndex)}
              alt={yacht.title || "Luxury yacht"}
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        ) : (
          <LoadingSkeleton>No image available</LoadingSkeleton>
        )}

        {/* Display gallery dots for image navigation */}
        {yacht?.images && yacht.images.length > 1 && (
          <GalleryDots>
            {yacht.images.map((_, idx) => (
              <GalleryDot 
                key={idx} 
                active={idx === currentImageIndex} 
                onClick={(e) => handleSelectImage(e, idx)}
              />
            ))}
          </GalleryDots>
        )}

        {/* Luxury tag for high-end yachts */}
        {isLuxury && (
          <LuxuryTag
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Luxury
          </LuxuryTag>
        )}

        {/* Heart button for wishlist */}
        <HeartButton 
          onClick={(e) => handleWishlistToggle(e, yacht?._id)}
          whileTap={{ scale: 0.9 }}
        >
          <GoHeartFill 
            size={22} 
            color={isWishlisted ? "#f9274d" : "#64748b"} 
          />
        </HeartButton>

        {/* Compare checkbox */}
        {(showCheckbox || isCompareActive) && (
          <CompareCheckbox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <input
              type="checkbox"
              onClick={(e) => e.stopPropagation()}
              checked={
                selectedYachts?.some(
                  (selected) => selected._id === yacht?._id
                ) || false
              }
              onChange={(e) => handleCheckboxChange(e, yacht)}
            />
            <label onClick={(e) => e.stopPropagation()}>Compare</label>
          </CompareCheckbox>
        )}
      </ImageContainer>

      <ContentContainer>
        {/* Display rating prominently */}
        <RatingDisplay>
          <Star size={16} fill="#f59e0b" strokeWidth={0} />
          <span>{yacht?.averageRating || "4.5"}</span>
        </RatingDisplay>
        
        {/* Yacht name and location */}
        <YachtName>{yacht?.title || "Unnamed Yacht"}</YachtName>
        
        <LocationDisplay>
          <MapPin size={16} />
          <span>{yacht?.location?.city || "Unknown location"}{yacht?.location?.country ? `, ${yacht.location.country}` : ""}</span>
        </LocationDisplay>
        
        {/* Yacht features in a modern grid */}
        <FeaturesContainer>
          <Feature>
            <Users size={16} /> 
            <span>{yacht?.capacity || "N/A"} Guests</span>
          </Feature>
          <Feature>
            <Ruler size={16} /> 
            <span>{yacht?.features?.length || "N/A"} ft</span>
          </Feature>
          <Feature>
            <Calendar size={16} /> 
            <span>Built {yacht?.features?.year || "N/A"}</span>
          </Feature>
          <Feature>
            <Waves size={16} /> 
            <span>{yacht?.features?.type || "Yacht"}</span>
          </Feature>
        </FeaturesContainer>
      </ContentContainer>
      
      {/* Bottom section with price and action button */}
      <BottomSection>
        <PriceDisplay>
          <CalculatePrice priceDetails={yacht.priceDetails} />
        </PriceDisplay>
        
        <ViewButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Details
          <ChevronRight size={16} />
        </ViewButton>
      </BottomSection>
      
      <BorderBeam />
    </CardContainer>
  );
};

// PropTypes for the YachtCard component
YachtCard.propTypes = {
  yacht: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        imgeUrl: PropTypes.string
      })
    ),
    location: PropTypes.shape({
      city: PropTypes.string,
      state: PropTypes.string,
      country: PropTypes.string
    }),
    capacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    averageRating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    features: PropTypes.shape({
      length: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.string,
      luxury: PropTypes.bool
    }),
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
  }),
  index: PropTypes.number,
  activeCard: PropTypes.any,
  setActiveCard: PropTypes.func,
  setIsCompareActive: PropTypes.func,
  isCompareActive: PropTypes.bool,
  selectedYachts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string
    })
  ),
  setSelectedYachts: PropTypes.func,
  wishlist: PropTypes.arrayOf(PropTypes.string)
};

export default React.memo(YachtCard); 