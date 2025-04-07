import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { FaLocationDot, FaAnchor, FaSailboat } from 'react-icons/fa6';
import { MdOutlineWaves, MdRestaurant, MdSunny } from 'react-icons/md';
import { IoMdCompass } from 'react-icons/io';

// Main container with glass morphism effect
const ItineraryContainer = styled(motion.div)`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.7);
  overflow: hidden;
  position: relative;
`;

// Decorative elements
const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  // background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  // z-index: 1;
`;

// Timeline container with enhanced styling
const Timeline = styled.div`
  position: relative;
  padding-left: 2rem;
  margin-top: 1.25rem;
  max-height: 320px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.3) rgba(241, 245, 249, 0.5);
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(241, 245, 249, 0.5);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.3);
    border-radius: 10px;
  }
`;

// Timeline line as a separate component for better control
const TimelineLine = styled.div`
  margin-left: 0.5rem;
  position: absolute;
  left: 1rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    rgba(59, 130, 246, 0.3) 0%,
    rgba(139, 92, 246, 0.3) 70%,
    rgba(236, 72, 153, 0.3) 90%,
    rgba(236, 72, 153, 0) 100%
  );
  border-radius: 999px;
  z-index: 1;
  height: ${props => props.totalHeight - 30}px;
  pointer-events: none;
`;

// Timeline step with scroll reveal effect
const TimelineStep = styled(motion.div)`
  position: relative;
  padding-bottom: 1.25rem;
  
  &:last-child {
    padding-bottom: 1rem;
  }
  
  &::before {
    content: "";
    position: absolute;
    left: -1rem;
    top: 0.25rem;
    width: 0.5rem;
    height: 2rem;
    z-index: 0;
  }
`;

// Icon container with enhanced visual effects
const IconContainer = styled(motion.div)`
  margin-left: 0.5rem;
  position: absolute;
  left: -2rem;
  top: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${props => props.bg || 'linear-gradient(135deg, #3b82f6, #1e40af)'};
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 1);
  z-index: 2;
`;

// Step content container
const StepContent = styled(motion.div)`
  margin-left: 0.5rem;
  background: rgba(249, 250, 251, 0.7);
  border-radius: 0.5rem;
  padding: 0.75rem;
  border: 1px solid rgba(241, 245, 249, 0.8);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    left: -6px;
    top: 0.75rem;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 6px solid rgba(249, 250, 251, 0.7);
    z-index: 1;
  }
`;

// Final destination with special styling - now styled as a timeline step but with more emphasis
const DestinationStep = styled(TimelineStep)`
  margin-top: 0.5rem;
  padding-bottom: 0.5rem !important;
  position: relative;
  z-index: 5;
  // margin-left: 0.2rem;
`;

// Destination content with special styling and more emphasis
const DestinationContent = styled(StepContent)`
  // background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(249, 115, 22, 0.1));
  // border: 1px solid rgba(252, 165, 165, 0.5);
  // box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
  
  &::before {
    // border-right-color: rgba(239, 68, 68, 0.1);
  }
`;

// Step header with time and title
const StepHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;
`;

// Step time with enhanced styling
const StepTime = styled.span`
  font-weight: 600;
  font-size: 0.75rem;
  color: #1e40af;
  background: linear-gradient(to right, rgba(219, 234, 254, 0.5), rgba(191, 219, 254, 0.3));
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
`;

// Destination time with special styling
const DestinationTime = styled(StepTime)`
  color: #b91c1c;
  background: linear-gradient(to right, rgba(254, 226, 226, 0.5), rgba(254, 202, 202, 0.3));
`;

// Step title with gradient text
const StepTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 700;
  background: linear-gradient(to right, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

// Destination title with special styling
const DestinationTitle = styled(StepTitle)`
  background: linear-gradient(to right, #b91c1c, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

// Step description with improved typography
const StepDescription = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.4;
  margin: 0;
`;

// Header with compass icon
const ItineraryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const CompassIcon = styled(motion.div)`
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  box-shadow: 0 6px 12px -3px rgba(59, 130, 246, 0.2);
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const HeaderTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  background: linear-gradient(to right, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.15rem 0;
`;

const HeaderSubtitle = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
`;

// Progress indicator
const ProgressBar = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  z-index: 2;
`;

const ProgressCircle = styled(motion.div)`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: conic-gradient(
    #3b82f6 ${props => props.progress}%, 
    rgba(241, 245, 249, 0.5) 0%
  );
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressInner = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.7rem;
  color: #1e40af;
`;

const Itinerary = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timelineHeight, setTimelineHeight] = useState(0);
  const timelineRef = useRef(null);
  const stepsRef = useRef([]);
  
  // Concise itinerary data
  const steps = [
    { 
      time: '9:00 AM', 
      title: 'Departure',
      description: 'Set sail from Marina Bay with welcome champagne.',
      icon: <FaAnchor />,
      bg: 'linear-gradient(135deg, #3b82f6, #1e40af)'
    },
    { 
      time: '10:30 AM', 
      title: 'City Skyline',
      description: 'Cruise along the coastline with breathtaking views.',
      icon: <FaSailboat />,
      bg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
    },
    { 
      time: '12:00 PM', 
      title: 'Gourmet Lunch',
      description: 'Fresh seafood and local specialties with premium wines.',
      icon: <MdRestaurant />,
      bg: 'linear-gradient(135deg, #f97316, #ea580c)'
    },
    { 
      time: '2:00 PM', 
      title: 'Hidden Cove',
      description: 'Swimming and snorkeling in crystal-clear waters.',
      icon: <MdOutlineWaves />,
      bg: 'linear-gradient(135deg, #10b981, #059669)'
    },
    { 
      time: '3:30 PM', 
      title: 'Sunset Cocktails',
      description: 'Handcrafted drinks as we sail into golden hour.',
      icon: <MdSunny />,
      bg: 'linear-gradient(135deg, #eab308, #ca8a04)'
    },
  ];
  
  // Calculate total height of all steps for the timeline line
  useEffect(() => {
    if (stepsRef.current.length === 0) return;
    
    let totalHeight = 0;
    stepsRef.current.forEach((step, index) => {
      if (step) {
        // Only add full height for non-destination steps
        if (index < steps.length) {
          totalHeight += step.offsetHeight;
        } else {
          // For destination step, only add partial height
          totalHeight += step.offsetHeight / 2;
        }
      }
    });
    
    // Add extra padding
    totalHeight += 50;
    setTimelineHeight(totalHeight);
  }, [steps]);
  
  // Handle scroll progress
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    
    const handleScroll = () => {
      const scrollTop = timeline.scrollTop;
      const scrollHeight = timeline.scrollHeight - timeline.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(progress);
    };
    
    timeline.addEventListener('scroll', handleScroll);
    return () => timeline.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      }
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  // Add this to scroll to destination when component loads
  const destinationRef = useRef(null);
  
  useEffect(() => {
    // Ensure timeline and destination refs exist
    if (timelineRef.current && destinationRef.current) {
      // Set a timeout to allow the component to fully render
      const timer = setTimeout(() => {
        // Calculate position to ensure destination is visible
        const timelineHeight = timelineRef.current.clientHeight;
        const destinationPos = destinationRef.current.offsetTop;
        
        // If destination is below the visible area, scroll to it
        if (destinationPos > timelineHeight) {
          timelineRef.current.scrollTop = destinationPos - timelineHeight + 100;
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <ItineraryContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <BackgroundGradient />
      
      <ProgressBar>
        <ProgressCircle progress={scrollProgress}>
          <ProgressInner>
            {Math.round(scrollProgress)}%
          </ProgressInner>
        </ProgressCircle>
      </ProgressBar>
      
      <ItineraryHeader>
        <CompassIcon
          variants={iconVariants}
          whileHover={{ rotate: 15 }}
        >
          <IoMdCompass />
        </CompassIcon>
        <HeaderContent>
          <HeaderTitle>Your Journey</HeaderTitle>
          <HeaderSubtitle>Luxury adventure awaits</HeaderSubtitle>
        </HeaderContent>
      </ItineraryHeader>
      
      <Timeline ref={timelineRef}>
        <TimelineLine totalHeight={timelineHeight} />
        
        {steps.map((step, index) => {
          const stepRef = useRef(null);
          const isInView = useInView(stepRef, { once: false, amount: 0.8 });
          
          return (
            <TimelineStep
              key={index}
              ref={el => {
                stepRef.current = el;
                stepsRef.current[index] = el;
              }}
            >
              <IconContainer 
                bg={step.bg}
                variants={iconVariants}
                animate={isInView ? "visible" : "hidden"}
              >
                {step.icon}
              </IconContainer>
              <StepContent
                variants={contentVariants}
                animate={isInView ? "visible" : "hidden"}
              >
                <StepHeader>
                  <StepTitle>{step.title}</StepTitle>
                  <StepTime>{step.time}</StepTime>
                </StepHeader>
                <StepDescription>{step.description}</StepDescription>
              </StepContent>
            </TimelineStep>
          );
        })}
        
        {/* Destination as the final timeline step with ref */}
        <DestinationStep
          ref={el => {
            destinationRef.current = el;
            stepsRef.current[steps.length] = el;
          }}
        >
          <IconContainer 
            bg="linear-gradient(135deg, #ef4444, #f97316)"
            variants={iconVariants}
            style={{ boxShadow: '0 0 0 4px rgba(255, 255, 255, 1), 0 0 0 6px rgba(239, 68, 68, 0.2)' }}
          >
            <FaLocationDot />
          </IconContainer>
          <DestinationContent
            variants={contentVariants}
            // whileHover={{ y: -2, boxShadow: '0 6px 15px rgba(239, 68, 68, 0.15)' }}
          >
            <StepHeader>
              <DestinationTitle>Return</DestinationTitle>
              <DestinationTime>4:30 PM</DestinationTime>
            </StepHeader>
            <StepDescription>Return to Marina Bay with unforgettable memories.</StepDescription>
          </DestinationContent>
        </DestinationStep>
      </Timeline>
    </ItineraryContainer>
  );
};

export default Itinerary;

// export default Itinerary;
