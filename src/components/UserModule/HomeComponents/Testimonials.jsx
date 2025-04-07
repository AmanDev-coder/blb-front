import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card } from "../../LibComponents/ui/card";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import testimonialsData from "../../../data/data.json"; // Import the JSON data
import { BoxReveal } from "../../LibComponents/magicui/box-reveal";
import { Button } from "../../LibComponents/ui/button";
import { useDispatch } from "react-redux";
import { fetchReviews } from "../../../Redux/adminReducer.js/action";
// Section Styling
const TestimonialsSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  overflow: hidden;
  position: relative;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
`;

// Background Elements
const BackgroundCircle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(
    to right,
    rgba(59, 130, 246, 0.1),
    rgba(124, 58, 237, 0.1)
  );
  z-index: 0;

  &.circle1 {
    width: 400px;
    height: 400px;
    top: -100px;
    left: -200px;
  }

  &.circle2 {
    width: 300px;
    height: 300px;
    bottom: -150px;
    right: -100px;
  }
`;

// Header Styling
const SectionHeader = styled.div`
  text-align: left;
  margin-bottom: 4rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 1rem;
`;

const Title = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  background: linear-gradient(to right, #1e3a8a, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -0.75rem;
    left: 0;
    transform: none;
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #3b82f6, #7c3aed);
    border-radius: 4px;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  margin: 1.5rem 0 0;
  line-height: 1.6;
  padding: 0;
`;

// Testimonials Carousel
const TestimonialsTrack = styled(motion.div)`
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  position: relative;
  z-index: 2;
`;

const TestimonialsWindow = styled.div`
  overflow: hidden;
  margin: 0 -1rem;
  padding: 1rem;
  position: relative;
`;

// Quote Icon
const QuoteIconWrapper = styled.div`
  position: absolute;
  top: -15px;
  left: 20px;
  color: #e2e8f0;
  transform: rotate(180deg);
  z-index: 1;
`;

// Testimonial Card
const StyledCard = styled(motion(Card))`
  min-width: 350px;
  padding: 2rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(229, 231, 235, 0.5);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border-color: rgba(59, 130, 246, 0.3);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(to right, #3b82f6, #7c3aed);
  }
`;

// User Info
const UserInfoContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-right: 1rem;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const AvatarStatus = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #10b981;
  border: 2px solid white;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h3`
  font-weight: 700;
  font-size: 1.1rem;
  color: #1e3a8a;
  margin: 0;
`;

const UserCompany = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

// Rating
const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

// Testimonial Text
const TestimonialText = styled.p`
  color: #334155;
  line-height: 1.8;
  font-size: 1rem;
  margin-bottom: 2rem;
  flex-grow: 1;
  position: relative;
  z-index: 2;
`;

// Time Indicator
const Timestamp = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: auto;
`;

// Navigation Controls
const NavigationControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  position: relative;
  z-index: 3;
`;

const NavButton = styled(Button)`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: white;
  color: #1e3a8a;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: #f8fafc;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IndicatorsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const Indicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#3b82f6" : "#cbd5e1")};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.active ? "#3b82f6" : "#94a3b8")};
  }
`;

export default function Testimonials() {
  const dispatch = useDispatch();
  const [testimonials, setTestimonialsData] = useState([]);
  // Use empty array as fallback if testimonials data is missing
  // const testimonials = Array.isArray(testimonialsData?.testimonials)
  //   ? testimonialsData.testimonials
  //   : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [isLoaded, setIsLoaded] = useState(false);
  const trackRef = useRef(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const params = {
          featured: true,
          status: "approved",
          type: "testimonial",
        };
        const testimonials = await dispatch(fetchReviews(params));
        console.log(testimonials.reviews);
        setTestimonialsData(testimonials.reviews);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, [dispatch]);

  // Determine items per slide based on screen size
  useEffect(() => {
    try {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setItemsPerSlide(1);
        } else if (window.innerWidth < 1024) {
          setItemsPerSlide(2);
        } else {
          setItemsPerSlide(3);
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      // Mark component as loaded
      setIsLoaded(true);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    } catch (error) {
      console.error("Error in Testimonials resize handler:", error);
      // Set a safe default
      setItemsPerSlide(1);
      setIsLoaded(true);
    }
  }, []);

  // Animate when in view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Calculate totalSlides safely
  const totalSlides =
    testimonials.length > 0
      ? Math.max(1, Math.ceil(testimonials.length / Math.max(1, itemsPerSlide)))
      : 0;

  const nextSlide = () => {
    if (activeIndex < totalSlides - 1) {
      setActiveIndex((prev) => prev + 1);
    } else {
      setActiveIndex(0); // Loop back to the beginning
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    } else {
      setActiveIndex(totalSlides - 1); // Loop to the end
    }
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // If testimonials couldn't be loaded, show a fallback UI
  if (!isLoaded) {
    return (
      <TestimonialsSection ref={ref}>
        <Container>
          <SectionHeader>
            <Title>What Our Clients Say</Title>
            <motion.div
              style={{
                height: "3px",
                width: "80px",
                background: "linear-gradient(90deg, #1e40af, #3b82f6)",
                borderRadius: "3px",
                marginTop: "0.75rem",
                marginBottom: "0.75rem",
              }}
            />
            <Subtitle>Loading testimonials...</Subtitle>
          </SectionHeader>
        </Container>
      </TestimonialsSection>
    );
  }

  // If there are no testimonials, show a minimal version
  if (testimonials.length === 0) {
    return (
      <TestimonialsSection ref={ref}>
        <Container>
          <SectionHeader>
            <BoxReveal>
              <Title
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                variants={{
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
                What Our Clients Say
              </Title>
            </BoxReveal>
            <motion.div
              style={{
                height: "3px",
                width: "80px",
                background: "linear-gradient(90deg, #1e40af, #3b82f6)",
                borderRadius: "3px",
                marginTop: "0.75rem",
                marginBottom: "0.75rem",
              }}
              initial={{ width: "0px" }}
              animate={{ width: "80px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <Subtitle
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: 0.2 },
                },
              }}
            >
              Stay tuned for our upcoming client testimonials.
            </Subtitle>
          </SectionHeader>
        </Container>
      </TestimonialsSection>
    );
  }

  return (
    <TestimonialsSection ref={ref}>
      <BackgroundCircle
        className="circle1"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
      />
      <BackgroundCircle
        className="circle2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      />

      <Container>
        <SectionHeader>
          <BoxReveal>
            <Title
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              What Our Clients Say
            </Title>
          </BoxReveal>
          <motion.div
            style={{
              height: "3px",
              width: "80px",
              background: "linear-gradient(90deg, #1e40af, #3b82f6)",
              borderRadius: "3px",
              marginTop: "0.75rem",
              marginBottom: "0.75rem",
            }}
            initial={{ width: "0px" }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.2 },
              },
            }}
          >
            Discover why luxury yacht enthusiasts choose our exceptional service
            for their adventures on the water
          </Subtitle>
        </SectionHeader>

        <TestimonialsWindow>
          <TestimonialsTrack
            ref={trackRef}
            animate={{ x: `-${activeIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            initial={false}
          >
            {testimonials.map((testimonial, index) => (
              <StyledCard
                key={index}
                initial="hidden"
                animate={controls}
                variants={itemVariants}
                custom={index}
                style={{
                  flex: `0 0 calc(${100 / itemsPerSlide}% - ${
                    (itemsPerSlide - 1) * 2
                  }rem / ${itemsPerSlide})`,
                }}
              >
                <QuoteIconWrapper>
                  <Quote size={48} strokeWidth={1} />
                </QuoteIconWrapper>

                <UserInfoContainer>
                  <AvatarContainer>
                    <Avatar
                      src={
                        testimonial.userAvatar ||
                        `https://randomuser.me/api/portraits/${
                          index % 2 ? "women" : "men"
                        }/${(index % 10) + 1}.jpg`
                      }
                      alt={testimonial.userName || "Client"}
                      onError={(e) => {
                        // If image fails to load, use a fallback
                        e.target.src = "https://via.placeholder.com/60x60";
                      }}
                    />
                    <AvatarStatus />
                  </AvatarContainer>
                  <UserDetails>
                    <UserName>
                      {testimonial.userName
                        ? testimonial.userName.charAt(0).toUpperCase() +
                          testimonial.userName.slice(1)
                        : "Happy Client"}
                    </UserName>
                    <UserCompany>
                      {testimonial.profession ||
                        testimonial.company ||
                        "Yacht Enthusiast"}
                    </UserCompany>
                  </UserDetails>
                </UserInfoContainer>

                <Rating>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < (testimonial.rating || 5) ? "#f59e0b" : "none"}
                      color={
                        i < (testimonial.rating || 5) ? "#f59e0b" : "#cbd5e1"
                      }
                    />
                  ))}
                </Rating>

                <TestimonialText>
                  &ldquo;
                  {testimonial.text ||
                    "Had an amazing experience with Luxury Yachts!"}
                  &rdquo;
                </TestimonialText>

                <Timestamp>2 weeks ago</Timestamp>
              </StyledCard>
            ))}
          </TestimonialsTrack>
        </TestimonialsWindow>

        {totalSlides > 1 && (
          <>
            <IndicatorsContainer>
              {Array.from({ length: totalSlides }).map((_, index) => (
                <Indicator
                  key={index}
                  active={activeIndex === index}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </IndicatorsContainer>

            <NavigationControls>
              <NavButton
                onClick={prevSlide}
                disabled={totalSlides <= 1}
                variant="outline"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </NavButton>
              <NavButton
                onClick={nextSlide}
                disabled={totalSlides <= 1}
                variant="outline"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </NavButton>
            </NavigationControls>
          </>
        )}
      </Container>
    </TestimonialsSection>
  );
}
