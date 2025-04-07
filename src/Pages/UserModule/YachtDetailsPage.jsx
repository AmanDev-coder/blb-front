import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { HeartIcon } from "@radix-ui/react-icons";
import { TiStarFullOutline, TiStarHalfOutline } from "react-icons/ti";
import { Button, Typography, Card } from "@mui/material";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdRocketLaunch, MdCalendarToday, MdDescription, MdStar, MdShare } from "react-icons/md";
import PropTypes from 'prop-types';

// Component imports
import FloatingCardComponent from "../../components/UserModule/YachtInfoComponents/FloatingCard";
import DetailsPage from "../../components/UserModule/YachtInfoComponents/ExtraInfo";
import OwnerDetailsPage from "../../components/UserModule/YachtInfoComponents/ownerDetails";
import Itinerary from "../../components/UserModule/YachtInfoComponents/Itinerary";
import ShareModal from "../../components/UserModule/YachtInfoComponents/ShareModal";
import MobileFooter from "../../components/UserModule/YachtInfoComponents/MobileFooter";
import PhotoGalleryComponent from "../../components/UserModule/YachtInfoComponents/PhotoGallary";
import BoatFeatures from "../../components/UserModule/YachtInfoComponents/boatFeatures";
import YachtReview from "../../components/UserModule/YachtInfoComponents/Reviews";
import MapWithLocation from "../../components/YachtOwnerModule/MapWithLocation";
import FAQ from "../../components/UserModule/HomeComponents/FAQ";
import ContactUs from "../../components/UserModule/HomeComponents/ContactUs";
// We'll use this in a future update
// import { getYachtsByID } from "../../Redux/yachtReducer/action";

// Main container with improved spacing and responsiveness
const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

// Hero section container
const HeroSection = styled.div`
  margin-top: 8rem;
`;

// Title with modern typography and color gradient
const YachtTitle = styled(motion.h1)`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  background: linear-gradient(to right, #1e3a8a, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  width: 100%;
  text-transform: capitalize;
`;

// Info bar with improved layout
const InfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

// Left side of info bar
const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
   font-size: 1rem; 
  color: #64748b;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Actions container
const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    margin-left: auto;
  }
`;

// Icon button
const IconBtn = styled.button`
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Wishlist button
const WishlistButton = styled(motion.button)`
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Main content layout with improved grid
const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 2.5rem;
  margin-top: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

// Left column
const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

// Right column with sticky behavior
const SideContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// Reviews and Experience layout
const ReviewsExperienceLayout = styled.div`
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 2.5rem;
  margin-top: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

// Sticky container for booking card
const StickyBookingCard = styled.div`
  position: sticky;
  top: 2rem;
  z-index: 10;
`;

// Section container
const Section = styled(motion.section)`
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

// Section header
const SectionHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 1.5rem;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 3rem;
    height: 0.25rem;
    background: linear-gradient(to right, #3b82f6, #93c5fd);
    border-radius: 0.25rem;
  }
`;

// Trending tag
const TrendingTag = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, #ef4444, #f97316);
  color: white;
  border-radius: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
`;

// Description text
const YachtDescription = styled.p`
  font-size: 1.125rem;
  line-height: 1.7;
  color: #64748b;
  margin-bottom: 2rem;
`;

// Map container with improved styling
const MapContainer = styled(Section)`
  overflow: hidden;
`;

// Location grid layout
const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

// Loading container
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  flex-direction: column;
  gap: 1.5rem;
`;

// Loading spinner
const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Loading text
const LoadingText = styled.p`
  font-size: 1.125rem;
  font-weight: 500;
  color: #64748b;
`;

// Rating display component
const RatingDisplay = ({ averageRating }) => {
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      {[...Array(fullStars)].map((_, i) => (
        <TiStarFullOutline key={i} style={{ color: '#f59e0b', fontSize: '20px' }} />
      ))}
      {hasHalfStar && <TiStarHalfOutline style={{ color: '#f59e0b', fontSize: '20px' }} />}
      <span style={{ marginLeft: '0.25rem', fontWeight: '500' }}>{averageRating.toFixed(1)}</span>
    </div>
  );
};

const initialState = {
  range: [new Date(2024, 10, 23), new Date(2024, 10, 25)],
};

RatingDisplay.propTypes = {
  averageRating: PropTypes.number.isRequired,
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const pulseHeart = {
  tap: { scale: 0.8 }
};

const BoatDetails = () => {
  /* eslint-disable no-unused-vars */
  const dispatch = useDispatch();
  /* eslint-enable no-unused-vars */
  const { boatId } = useParams();
  const [yacht, setYacht] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [wishlistActive, setWishlistActive] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch yacht details
  useEffect(() => {
    const fetchBoatDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/boats/${boatId}` 
        );
        const images = await axios.get(
          `${BASE_URL}/images/${boatId}`
        );
        setYacht({ ...response.data, images: images.data.data });
      } catch (error) {
        console.error("Error fetching boat details:", error);
      } finally {
        // Add a small delay to ensure smooth loading transition
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchBoatDetails();
    // We'll use this Redux approach in a future update
    // dispatch(getYachtsByID(boatId));
  }, [boatId]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this yacht rental!",
          text: "I found an amazing yacht to rent. You should check it out!",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      alert("Web Share API is not supported in this browser.");
    }
  };

  const handleWishlistToggle = () => {
    setWishlistActive(!wishlistActive);
  };

  const handleShareClick = () => {
    setShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <Spinner />
          <LoadingText>Loading yacht details...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (!yacht) {
    return (
      <PageContainer>
        <LoadingContainer>
          <Typography variant="h5" color="#64748b">
            Could not load yacht details. Please try again later.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </LoadingContainer>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <HeroSection>
        <YachtTitle
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {yacht.title}
        </YachtTitle>

        <InfoBar>
          <LocationInfo>
            <RatingDisplay averageRating={yacht?.averageRating || 4.5} />
            <span style={{ color: "#94a3b8" }}>•</span>
            <span>{`${yacht?.location.city}, ${yacht?.location?.state}, ${yacht?.location?.country}`}</span>
          </LocationInfo>
          
          <ActionButtons>
             <ShareModal 
        open={shareModalOpen} 
        handleClose={handleCloseShareModal} 
        yachtTitle={yacht.title}
        yachtId={boatId}
      />
            <WishlistButton 
              onClick={handleWishlistToggle}
              variants={pulseHeart}
              whileTap="tap"
              aria-label="Add to wishlist"
            >
              <HeartIcon 
                style={{ 
                  width: "22px", 
                  height: "22px", 
                  color: wishlistActive ? "#ef4444" : "#64748b",
                  fill: wishlistActive ? "#ef4444" : "none",
                  transition: "all 0.3s ease"
                }} 
              />
            </WishlistButton>
          </ActionButtons>
        </InfoBar>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <PhotoGalleryComponent yacht={yacht} />
        </motion.div>
      </HeroSection>

      <ContentLayout>
        <MainContent>
          <Section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <TrendingTag
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Trending
              <MdRocketLaunch style={{ marginLeft: "8px", fontSize: "20px" }} />
            </TrendingTag>
            
            <SectionHeader>
              <MdDescription size={24} color="#3b82f6" />
              Overview
            </SectionHeader>
            
            <YachtDescription>
              {yacht.short_description}
            </YachtDescription>

            <OwnerDetailsPage yacht={yacht} />
          </Section>

          <Section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <SectionHeader>Features & Details</SectionHeader>
            <BoatFeatures features={yacht.features} />
          </Section>

          <MapContainer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <SectionHeader>Explore Location</SectionHeader>
            <LocationGrid>
              <Card sx={{ height: "300px", borderRadius: "12px", overflow: "hidden" }}>
                <MapWithLocation location={yacht?.location} />
                <Typography sx={{ padding: "1rem" }}>
                  {`${yacht?.location.city}, ${yacht?.location?.state}, ${yacht?.location?.country}`}
                </Typography>
              </Card>
            </LocationGrid>
          </MapContainer>
          
          <Section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <SectionHeader>
              <MdStar size={24} color="#3b82f6" />
              Guest Reviews
            </SectionHeader>
            <YachtReview yachtId={boatId} />
          </Section>
          
          <Section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            style={{ marginBottom: "6rem" }}
          >
            {/* <SectionHeader>Frequently Asked Questions</SectionHeader> */}
            <FAQ />
          </Section>
          
          
        </MainContent>

        <SideContent>
          <StickyBookingCard>
            <FloatingCardComponent
              yacht={yacht}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setSelectedDuration={setSelectedDuration}
              selectedDuration={selectedDuration}
            />
          </StickyBookingCard>
          
          <Section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <SectionHeader>
              <MdCalendarToday size={22} color="#3b82f6" />
              Trip Itinerary
            </SectionHeader>
            <Itinerary />
          </Section>
          
          <Section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <SectionHeader>Experience</SectionHeader>
            <DetailsPage yacht={yacht} />
          </Section>
        </SideContent>
      </ContentLayout>
      
      {isMobile && <MobileFooter />}
      
    
    </PageContainer>
  );
};

export { BoatDetails };
export default BoatDetails;