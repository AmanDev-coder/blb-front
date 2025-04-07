import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Styled components
const AdventuresWrapper = styled.div`
  padding: 4rem 1rem;
  position: relative;
//   overflow: hidden;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9); /* Match other components */
`;

const Container = styled.div`
  max-width: 1350px;
  margin: 0 auto;
  position: relative;
  padding: 0 2rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e1b4b;
  font-family: "Poppins", sans-serif;
`;

const CardGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 2rem;
  
  position: relative;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CardWrapper = styled.div`
  background: white;
  border-radius: 1rem;
//   overflow: hidden;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    // box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CardImageWrapper = styled.div`
  height: 160px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 1rem;
`;

const CardImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
  
  ${CardWrapper}:hover & {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1e1b4b;
  font-family: "Poppins", sans-serif;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  flex-grow: 1;
`;

const ViewMoreLink = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #3b82f6;
  cursor: pointer;
  margin-top: auto;
  
  svg {
    margin-left: 0.5rem;
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const NavigationButton = styled(motion.button)`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #3b82f6;
  
  &:disabled {
    color: #d1d5db;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: #3b82f6;
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

const ProgressIndicator = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0 1rem;
`;

const ProgressDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  transition: background-color 0.3s ease;
`;

const PageIndicator = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0.5rem;
`;

// Extended adventure data with 17 items total
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

export default function Adventures() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const navigate = useNavigate();
  const cardsToShow = 4;
  const totalItems = adventureData.length;
  const maxStartIndex = totalItems - cardsToShow;
  
  // Handle next card (move one at a time)
  const handleNext = () => {
    if (currentIndex < maxStartIndex) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  // Handle previous card (move one at a time)
  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  const handleViewMore = (path) => {
    navigate(path);
  };
  
  // Get the current items to display
  const currentItems = adventureData.slice(
    currentIndex,
    currentIndex + cardsToShow
  );
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
              disabled={currentIndex === 0}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} />
            </NavigationButton>
            
            <PageIndicator>{currentIndex + 1} / {maxStartIndex + 1}</PageIndicator>
            
            <NavigationButton
              onClick={handleNext}
              disabled={currentIndex === maxStartIndex}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} />
            </NavigationButton>
          </NavigationButtons>
        </HeaderContainer>
        
        <AnimatePresence custom={direction} mode="wait">
          <CardGrid 
            key={currentIndex}
            custom={direction}
            variants={{
              enter: (direction) => ({
                x: direction > 0 ? 90 : -90,
                opacity: 0
              }),
              center: {
                x: 0,
                opacity: 1
              },
              exit: (direction) => ({
                x: direction < 0 ? 90 : -90,
                opacity: 0
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
          {currentItems.map((item, index) => (
            <CardWrapper
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <CardImageWrapper>
                <CardImage src={item.image} alt={item.title} />
              </CardImageWrapper>
              <CardContent>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <ViewMoreLink onClick={() => handleViewMore(item.path)}>
                  View more <ArrowRight size={18} />
                </ViewMoreLink>
              </CardContent>
            </CardWrapper>
          ))}
        </CardGrid>
        </AnimatePresence>
        
        <ProgressIndicator style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          {[...Array(maxStartIndex + 1)].map((_, index) => (
            <ProgressDot 
              key={index} 
              active={index === currentIndex} 
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </ProgressIndicator>
      </Container>
    </AdventuresWrapper>
  );
} 