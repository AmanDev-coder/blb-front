import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import SearchFilters from "./SearchFilters";
import heroVideo from "/assets/backgroundvideo.mp4";
import { BorderBeam } from "../../LibComponents/magicui/border-beam";

// Extended background container to fill gap between sections
const BackgroundExtension = styled.div`
  position: relative;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  padding-bottom: 2rem; /* Add padding to extend the background below the hero section */
  margin-bottom: -2rem; /* Negative margin to overlap with the next section */
`;

// Styled components with enhanced styling
const HeroWrapper = styled.section`
  height: 90vh; /* Increased height to allow for search filters overlay */
  position: relative;
  overflow: visible; /* Changed from 'hidden' to allow search filters to overflow */
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  /* Removed margin-bottom to eliminate gap */
  /* Added padding-bottom to extend the background */
  padding-bottom: 6rem;
  /* Added negative margin to help with next section overlap */
  margin-bottom: -2rem;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.7) 100%
    );
    z-index: 1;
  }
`;

const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const HeroContent = styled(motion.div)`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 8rem; /* Increased to create more space for search filters */
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.1;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  font-family: "Poppins", sans-serif;
  background: linear-gradient(to right, #ffffff, #e2e8f0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.5rem);
  max-width: 800px;
  text-align: bottom;
  margin: 0 auto;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: "Poppins", sans-serif;
  color: #f8fafc;
  line-height: 1.6;
`;

const HighlightText = styled.span`
  color: #f59e0b;
  font-weight: 600;
`;

// Animation variants
const contentVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: "easeOut",
    }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      delay: 0.2,
      ease: "easeOut" 
    }
  }
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      delay: 0.4,
      ease: "easeOut" 
    }
  }
};

export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState("");
  const [, setSearchParams] = useSearchParams();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const navigate = useNavigate();

  // Handle video loaded state
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  // Search functionality - kept as is to maintain API functionality
  const handleSearch = () => {
    console.log("Searching for:", { location, date, adults });
    const formattedDatedate = date && new Date(date);
const newDate = formattedDatedate && formattedDatedate.toISOString().split('T')[0];
    const formattedLocation = formatLocationQuery(location);

    console.log(formattedLocation);
const searchObj = {};
if (location) searchObj['location'] = formattedLocation;
if (adults) searchObj['capacity'] = adults;
if (date) searchObj['date'] = newDate;

setSearchParams(searchObj);
    const searchParamsString = new URLSearchParams(searchObj).toString();

// Redirect to the yacht rentals page with the updated search parameters
    navigate(`/yacht-rentals?${searchParamsString}`);
  };

  // Format location query - kept as is to maintain API functionality
  function formatLocationQuery(location) {
    return location
      .toLowerCase()
      .split(",")
      .map(part => part.trim().replace(/\s+/g, "-"))
      .join("-");
  }

  return (
    <BackgroundExtension>
    <HeroWrapper>
        {/* Video background with loading handling */}
        <VideoBackground 
          autoPlay 
          loop 
          muted 
          playsInline
          onLoadedData={handleVideoLoaded}
          style={{ opacity: isVideoLoaded ? 1 : 0, transition: "opacity 1s ease" }}
        >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
        </VideoBackground>

        {/* Hero content with animations */}
        <HeroContent
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          <BorderBeam
            size={500}
            duration={15}
            delay={3}
            colorFrom="rgba(245, 158, 11, 0.3)"
            colorTo="rgba(56, 189, 248, 0.3)"
          >
            <HeroTitle variants={titleVariants}>
              Experience <HighlightText>Luxury</HighlightText> On The Water
            </HeroTitle>
          </BorderBeam>
          
          <HeroSubtitle variants={subtitleVariants}>
            Discover the world&apos;s most exquisite yachts for your perfect getaway. From intimate cruises to lavish celebrations, find your dream yacht today.
        </HeroSubtitle>
      </HeroContent>

        {/* Search filters - maintaining existing functionality */}
      <SearchFilters
        location={location}
        setLocation={setLocation}
        date={date}
        setDate={setDate}
        adults={adults}
        setAdults={setAdults}
        onSearch={handleSearch}
        setSearchParams={setSearchParams}
      />
    </HeroWrapper>
    </BackgroundExtension>
  );
}
