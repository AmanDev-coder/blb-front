import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchYachtTypes } from "../../../Redux/yachtReducer/action"; 
import { useEffect } from "react";
// Styled components with modernized design
const AdventuresWrapper = styled.div`
  padding: 5rem 1.5rem;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  padding: 0 1rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e40af, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "Poppins", sans-serif;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -14px;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
  }
`;

const CardsContainer = styled.div`
  position: relative;
  padding: 1rem;
  background-image: radial-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  border-radius: 20px;
  margin: 0 1rem;
`;

const CardGrid = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 0.5rem 0;
`;

const CarouselTrack = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 1200px) {
    gap: 1.5rem;
  }
`;

const CardWrapper = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  flex: 0 0 calc((100% - 4.5rem) / 4); /* Exact 4 cards with 3 gaps of 1.5rem */
  height: 380px;
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(5px);
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.07),
    0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  flex-shrink: 0;
  
  &:hover {
    transform: translateY(-12px);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.12),
      0 8px 20px rgba(59, 130, 246, 0.15);
  }
  
  @media (max-width: 1200px) {
    flex: 0 0 calc((100% - 1.5rem) / 2); /* 2 cards with 1 gap of 1.5rem */
  }
  
  @media (max-width: 640px) {
    flex: 0 0 100%;
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  padding-top: 65%; /* Fixed aspect ratio for all images */
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, 
      rgba(0, 0, 0, 0.7) 0%, 
      rgba(0, 0, 0, 0.4) 30%,
      rgba(0, 0, 0, 0) 60%);
    z-index: 1;
  }
`;

const CardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
  transform-origin: center;
  
  ${CardWrapper}:hover & {
    transform: scale(1.1);
  }
`;

const CardTitleOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  z-index: 2;
  text-align: left;
`;

const CardTag = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
`;

const CardContent = styled.div`
  padding: 1.75rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  font-family: "Poppins", sans-serif;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const CardDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const ExperiencePill = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.65rem;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  background: ${props => props.color || 'rgba(255, 255, 255, 0.2)'};
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: auto;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const CardFooter = styled.div`
  margin-top: 1rem;
  text-align: center;
`;

const ExploreButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    transition: left 0.7s ease;
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    box-shadow: 0 6px 15px rgba(99, 102, 241, 0.4);
    transform: translateY(-2px);
    
    &::before {
      left: 100%;
    }
    
    svg {
      transform: translateX(4px);
    }
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavigationButton = styled(motion.button)`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  color: #3b82f6;
  transition: all 0.3s ease;
  
  &:disabled {
    color: #d1d5db;
    cursor: not-allowed;
    box-shadow: none;
    background: #f8fafc;
  }
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: white;
    box-shadow: 0 6px 18px rgba(59, 130, 246, 0.35);
    transform: translateY(-2px);
  }
`;

const PageIndicator = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #4b5563;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 3rem;
`;

const ProgressDot = styled.div`
  width: ${props => props.active ? '2.5rem' : '0.75rem'};
  height: 0.75rem;
  border-radius: 30px;
  background: ${props => props.active ? 'linear-gradient(90deg, #3b82f6, #6366f1)' : '#e2e8f0'};
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: ${props => props.active ? '0 2px 8px rgba(59, 130, 246, 0.4)' : 'none'};
  
  &:hover {
    transform: ${props => props.active ? 'none' : 'scale(1.2)'};
    background: ${props => props.active ? 'linear-gradient(90deg, #3b82f6, #6366f1)' : '#cbd5e1'};
  }
`;

// Adventure data with 17 items
const adventureData = [
  {
    id: 1,
    title: "Yachts",
    description: "From mid-size to mega yachts, these luxury boats are great for groups and celebrations",
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop",
    path: "/yacht-rentals",
  },
  {
    id: 2,
    title: "Jet Skis",
    description: "Fast, fun, and easy to operate, these are a guaranteed good time on the water",
    image: "https://images.unsplash.com/photo-1626094309830-abbb0c99da4a?q=80&w=800&auto=format&fit=crop", 
    path: "/jet-ski-rentals",
  },
  {
    id: 3,
    title: "Sailboats",
    description: "Set sail with these traditional wind-powered boats",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop",
    path: "/sailboat-rentals",
  },
  {
    id: 4,
    title: "Fishing Charters",
    description: "Let a captain do the driving while you do the fishing",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
    path: "/fishing-charters",
  },
  {
    id: 5,
    title: "Houseboats",
    description: "Live on the water with all the comforts of home in these floating accommodations",
    image: "https://images.unsplash.com/photo-1610930867922-7a4ca14d1632?q=80&w=800&auto=format&fit=crop",
    path: "/houseboat-rentals",
  },
  {
    id: 6,
    title: "Tours",
    description: "Guided experiences with local experts to discover hidden gems and popular spots",
    image: "https://images.unsplash.com/photo-1569949247432-aa8050380c01?q=80&w=800&auto=format&fit=crop",
    path: "/boat-tours",
  },
  {
    id: 7,
    title: "Catamarans",
    description: "Stable and spacious multi-hull boats perfect for day cruises and longer journeys",
    image: "https://images.unsplash.com/photo-1588401273872-959100a7d838?q=80&w=800&auto=format&fit=crop",
    path: "/catamaran-rentals",
  },
  {
    id: 8,
    title: "Fishing Boats",
    description: "Specialized vessels equipped with everything you need for a successful fishing trip",
    image: "https://images.unsplash.com/photo-1587917998402-c938714dbc31?q=80&w=800&auto=format&fit=crop",
    path: "/fishing-boat-rentals",
  },
  {
    id: 9,
    title: "Wakeboarding Boats",
    description: "Designed to create the perfect wake for thrilling water sports adventures",
    image: "https://images.unsplash.com/photo-1601024445121-e5b82f020549?q=80&w=800&auto=format&fit=crop",
    path: "/wakeboarding-rentals",
  },
  {
    id: 10,
    title: "Kayaks",
    description: "Personal watercraft perfect for exploring coastlines, rivers and quiet coves",
    image: "https://images.unsplash.com/photo-1604715892039-d1cbd8d20bad?q=80&w=800&auto=format&fit=crop",
    path: "/kayak-rentals",
  },
  {
    id: 11,
    title: "Paddleboats",
    description: "Fun and easy-to-use boats powered by your own pedaling, great for families",
    image: "https://images.unsplash.com/photo-1626114520103-9e6361c48f65?q=80&w=800&auto=format&fit=crop",
    path: "/paddleboat-rentals",
  },
  {
    id: 12,
    title: "Canoes",
    description: "Traditional watercraft for serene paddling adventures on lakes and rivers",
    image: "https://images.unsplash.com/photo-1544801941-a675dd214d45?q=80&w=800&auto=format&fit=crop",
    path: "/canoe-rentals",
  },
  {
    id: 13,
    title: "Snorkelling",
    description: "Discover underwater wonders with guided snorkelling trips in pristine waters",
    image: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?q=80&w=800&auto=format&fit=crop",
    path: "/snorkelling-adventures",
  },
  {
    id: 14,
    title: "Diving",
    description: "Professional diving experiences for all skill levels to explore marine life",
    image: "https://images.unsplash.com/photo-1682687982183-c2937a37a21a?q=80&w=800&auto=format&fit=crop",
    path: "/diving-experiences",
  },
  {
    id: 15,
    title: "Whale Watching",
    description: "Unforgettable excursions to observe majestic whales in their natural habitat",
    image: "https://images.unsplash.com/photo-1564391058858-da322219bd96?q=80&w=800&auto=format&fit=crop",
    path: "/whale-watching",
  },
  {
    id: 16,
    title: "Rafting",
    description: "Adrenaline-pumping adventures navigating rapids and river currents",
    image: "https://images.unsplash.com/photo-1504276048855-f3d60e69632f?q=80&w=800&auto=format&fit=crop",
    path: "/rafting-adventures",
  },
  {
    id: 17,
    title: "Pontoons",
    description: "Comfortable party boats perfect for leisurely cruising and social gatherings",
    image: "https://images.unsplash.com/photo-1566913485259-247fcc3932fc?q=80&w=800&auto=format&fit=crop",
    path: "/pontoon-rentals",
  }
];

// Get experience level based on adventure type
const getExperienceLevel = (title) => {
  const beginner = ["Paddleboats", "Tours", "Kayaks", "Canoes", "Pontoons"];
  const intermediate = ["Snorkelling", "Houseboats", "Fishing Boats", "Wakeboarding Boats", "Jet Skis"];
  const advanced = ["Yachts", "Diving", "Sailboats", "Catamarans", "Rafting", "Fishing Charters", "Whale Watching"];
  
  if (beginner.includes(title)) return "Beginner";
  if (intermediate.includes(title)) return "Intermediate";
  return "Advanced";
};

// Get experience level background color
const getExperienceLevelColor = (level) => {
  if (level === "Beginner") return "rgba(16, 185, 129, 0.85)"; // Green
  if (level === "Intermediate") return "rgba(245, 158, 11, 0.85)"; // Amber
  return "rgba(239, 68, 68, 0.85)"; // Red for Advanced
};

// Get price range based on adventure type
const getPriceRange = (title) => {
  const budget = ["Paddleboats", "Kayaks", "Canoes"];
  const midrange = ["Tours", "Pontoons", "Snorkelling", "Fishing Boats", "Jet Skis"];
  const premium = ["Yachts", "Diving", "Sailboats", "Catamarans", "Houseboats", "Wakeboarding Boats"];
  const luxury = ["Rafting", "Fishing Charters", "Whale Watching"];
  
  if (budget.includes(title)) return "$50 - $150";
  if (midrange.includes(title)) return "$150 - $300";
  if (premium.includes(title)) return "$300 - $750";
  return "$750+";
};

export default function AdventuresNew() {
  const dispatch = useDispatch();
  const [adventureData, setAdventureData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const cardsToShow = 4;
  const maxStartIndex = adventureData.length - cardsToShow;
  
  // Handle next (move one card at a time with smooth animation)
  const handleNext = () => {
    if (startIndex < maxStartIndex && !isAnimating) {
      setIsAnimating(true);
      setStartIndex(prev => prev + 1);
    }
  };
  
  // Handle previous (move one card at a time with smooth animation)
  const handlePrev = () => {
    if (startIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setStartIndex(prev => prev - 1);
    }
  };
  
  // Handle direct navigation to a specific index
  const handleDotClick = (index) => {
    if (!isAnimating && index !== startIndex) {
      setIsAnimating(true);
      setStartIndex(index);
    }
  };
  
  const handleViewMore = (path) => {
    navigate(path);
  };
  
  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };
  


  useEffect(() => {
    const fetchAdventureData = async () => {
      try {
        const yachtTypes = await dispatch(fetchYachtTypes());
        const formattedData = yachtTypes.map(type => ({
          id: type._id,
          title: type.title,
          description: type.description,
          image: type.image,
          price: type.priceRange ? `${type.priceRange.currency}${type.priceRange.min} - ${type.priceRange.currency}${type.priceRange.max}` : getPriceRange(type.title),
          path: `/adventures/${type.slug}`,
          features: type.features || [],
          experienceLevel: type.experienceLevel || "Beginner"
        }));
        setAdventureData(formattedData);
      } catch (error) {
        console.error("Error fetching adventure data:", error);
      }
    };

    fetchAdventureData();
  }, [dispatch]);

  
  return (
    <AdventuresWrapper>
      <Container>
        <HeaderContainer>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Adventures of All Kinds
          </SectionTitle>
          
          <NavigationButtons>
            <NavigationButton
              onClick={handlePrev}
              disabled={startIndex === 0 || isAnimating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={24} />
            </NavigationButton>
            
            <PageIndicator>{startIndex + 1} - {Math.min(startIndex + cardsToShow, adventureData.length)} of {adventureData.length}</PageIndicator>
            
            <NavigationButton
              onClick={handleNext}
              disabled={startIndex >= maxStartIndex || isAnimating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight size={24} />
            </NavigationButton>
          </NavigationButtons>
        </HeaderContainer>
        
        <CardsContainer>
          <CardGrid>
            <CarouselTrack
              initial={false}
              animate={{ 
                x: `calc(-${startIndex * (100 / cardsToShow)}%)` 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 280, 
                damping: 30,
                mass: 1
              }}
              onAnimationComplete={handleAnimationComplete}
            >
              {adventureData.map((item) => {
                const experienceLevel = getExperienceLevel(item.title);
                
                return (
                  <CardWrapper
                    key={`card-${item.id}`}
                    whileHover={{ y: -12 }}
                  >
                    <CardImageWrapper>
                      <CardImage src={item.image} alt={item.title} />
                      <CardTag>{item.title}</CardTag>
                      <CardTitleOverlay>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDetails>
                          <ExperiencePill color={getExperienceLevelColor(experienceLevel)}>
                            {experienceLevel}
                          </ExperiencePill>
                        </CardDetails>
                      </CardTitleOverlay>
                    </CardImageWrapper>
                    
                    <CardContent>
                      <CardDescription>{item.description}</CardDescription>
                      <CardFooter>
                        <ExploreButton onClick={() => handleViewMore(item.path)}>
                          Explore Adventures <ArrowRight size={18} />
                        </ExploreButton>
                      </CardFooter>
                    </CardContent>
                  </CardWrapper>
                );
              })}
            </CarouselTrack>
          </CardGrid>
        </CardsContainer>
        
        <ProgressDots>
          {adventureData.length > cardsToShow && 
            [...Array(maxStartIndex + 1)].map((_, index) => (
              <ProgressDot 
                key={index} 
                active={index === startIndex}
                onClick={() => handleDotClick(index)}
              />
            ))
          }
        </ProgressDots>
      </Container>
    </AdventuresWrapper>
  );
} 