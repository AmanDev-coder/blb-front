import styled from "styled-components";
import { motion, useAnimation, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchDestinations } from "../../../Redux/yachtReducer/action"; 
// Styled components for destinations
const DestinationSection = styled.div`
  margin: 6rem 0 4rem 0;
  font-family: 'Poppins', sans-serif;
//   background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
//   overflow: hidden;
  position: relative;
//   padding: 4rem 0;
`;

// Background Elements
// const BackgroundCircle = styled(motion.div)`
//   position: absolute;
//   border-radius: 50%;
//   background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(124, 58, 237, 0.1));
//   z-index: 0;
  
//   &.circle1 {
//     width: 400px;
//     height: 400px;
//     top: -100px;
//     left: -200px;
//   }
  
//   &.circle2 {
//     width: 300px;
//     height: 300px;
//     bottom: -150px;
//     right: -100px;
//   }
// `;

const Container = styled.div`
//   max-width: 1280px;
//   margin: 0 auto;
//   padding: 0 1.5rem;
  position: relative;
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
`;

const Subtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  margin: 1.5rem 0 0;
  line-height: 1.6;
  padding: 0;
`;

const DestinationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(252px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CardWrapper = styled(motion.div)`
  grid-row: ${props => {
    if (props.isLarge) return 'span 2';
    if (props.tall) return 'span 2';
    return 'auto';
  }};
  grid-column: ${props => props.isLarge ? 'span 2' : 'auto'};
  display: flex;
  flex-direction: column;
`;

const DestinationCard = styled.div`
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  aspect-ratio: ${props => {
    if (props.isLarge) return '2/1.5';
    if (props.tall) return '4/6';
    return '4/3';
  }};
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  height: 100%;
  flex: 1;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6));
    z-index: 1;
  }
`;

const ShowMoreCard = styled(DestinationCard)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e0f2fe, #bfdbfe);
  
  &::after {
    background: linear-gradient(to bottom, rgba(30, 64, 175, 0.05), rgba(30, 64, 175, 0.2));
  }
`;

const ShowMoreContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: #1e40af;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ShowMoreIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ShowMoreText = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const DestinationImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${DestinationCard}:hover & {
    transform: scale(1.05);
  }
`;

const DestinationContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  z-index: 2;
  color: white;
`;

const DestinationName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: white;

`;

const DestinationCount = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.75rem;
`;

const DestinationPrice = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  width: fit-content;
`;

// Create a function to calculate if a card is in the last row
function getIsInLastRow(index, totalItems, columns = 4) {
  const totalRows = Math.ceil(totalItems / columns);
  const lastRowStartIndex = (totalRows - 1) * columns;
  return index >= lastRowStartIndex;
}

const destinations = [
  {
    id: 1,
    name: "Croatia",
    yachtCount: 3079,
    image: "https://images.unsplash.com/photo-1555990793-2a2fb52ce0b3?q=80&w=1000&auto=format&fit=crop",
    price: 42,
    currency: "€/day"
  },
  {
    id: 2,
    name: "Greece",
    yachtCount: 3553,
    image: "https://images.unsplash.com/photo-1503152394-c571994fd383?q=80&w=1000&auto=format&fit=crop",
    price: 47,
    currency: "€/day"
  },
  {
    id: 3,
    name: "Spain",
    yachtCount: 2402,
    image: "https://images.unsplash.com/photo-1511068797325-6083f0f872b1?q=80&w=1000&auto=format&fit=crop",
    price: 33,
    currency: "€/day",
    isLarge: true
    
  },
  {
    id: 4,
    name: "France",
    yachtCount: 2543,
    image: "https://images.unsplash.com/photo-1534372686206-3bfcb8f6b4f3?q=80&w=1000&auto=format&fit=crop",
    price: 57,
    currency: "€/day"
  },
  {
    id: 5,
    name: "Germany",
    yachtCount: 1037,
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1000&auto=format&fit=crop",
    price: 18,
    currency: "€/day"
  },
  {
    id: 6,
    name: "Turkey",
    yachtCount: 1707,
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1000&auto=format&fit=crop",
    price: 101,
    currency: "€/day"
  },
  {
    id: 7,
    name: "Caribbean",
    yachtCount: 1143,
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1000&auto=format&fit=crop",
    price: 135,
    currency: "€/day"
  },
  {
    id: 8,
    name: "Italy",
    yachtCount: 2146,
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000&auto=format&fit=crop",
    price: 65,
    currency: "€/day",
    tall: true
   
  },
  {
    id: 9,
    name: "Thailand",
    yachtCount: 926,
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop",
    price: 89,
    currency: "€/day"
  },
  {
    id: 10,
    name: "Maldives",
    yachtCount: 884,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000&auto=format&fit=crop",
    price: 156,
    currency: "€/day",
    tall: true
  },
  {
    id: 11,
    name: "Australia",
    yachtCount: 742,
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000&auto=format&fit=crop", 
    price: 112,
    currency: "€/day"
  },
  {
    id: 12,
    name: "Portugal",
    yachtCount: 685,
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=1000&auto=format&fit=crop",
    price: 39,
    currency: "€/day"
  },
  {
    id: 13,
    name: "Bahamas",
    yachtCount: 594,
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1000&auto=format&fit=crop",
    price: 128,
    currency: "€/day"
  },
  {
    id: 14,
    name: "Malta",
    yachtCount: 563,
    image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=1000&auto=format&fit=crop",
    price: 51,
    currency: "€/day"
  },
  {
    id: 15,
    name: "United Arab Emirates",
    yachtCount: 526,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop",
    price: 178,
    currency: "€/day"
  }
];

function TopDestinations() {
  const navigate = useNavigate();
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
      const [destinations, setDestinations] = useState([]);
  const dispatch = useDispatch();
  
  // Animate when in view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  // Expanded list of top yacht destinations data
 
  

  useEffect(() => {
    const getDestinationsData = async () => {
      try {
        const response = await dispatch(fetchDestinations());
        if (response?.data) {
          const activeDestinations = response.data.filter(dest => dest.status === 'active');
          setDestinations(activeDestinations);
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    getDestinationsData();
  }, [dispatch]);
    console.log(destinations)


  return (
    <DestinationSection ref={ref}>
      {/* <BackgroundCircle 
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
       */}
      <Container>
       <SectionHeader>
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            Top-rated yacht charter destinations
          </Title>
          <motion.div 
            style={{ 
              height: "3px", 
              width: "80px", 
              background: "linear-gradient(90deg, #1e40af, #3b82f6)",
              borderRadius: "3px",
              marginTop: "0.75rem",
              marginBottom: "0.75rem"
            }}
            initial={{ width: "0px" }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
            }}
          >
            Discover the most beautiful locations worldwide for your unforgettable yacht charter experience
          </Subtitle>
        </SectionHeader>

      <DestinationGrid>
        {destinations.map((destination, index) => {
          // Check if this card is in the last row
          const isInLastRow = getIsInLastRow(index, destinations.length);
          
          // Remove special formatting for last row
            const isTall = index === 7||index===9 && !isInLastRow;
          const isLarge = index === 2 && !isInLastRow;  
          console.log(isTall, isLarge)

          return (
            <CardWrapper
              key={destination.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ y: -5 }}
              tall={isTall}
              isLarge={isLarge}
            >
              <DestinationCard 
                tall={isTall}
                isLarge={isLarge}
                onClick={() => navigate(`/yacht-rentals/?search=${destination.name.toLowerCase()}`)}
              >
                <DestinationImg src={destination.image} alt={destination.name} />
                <DestinationContent>
                  <DestinationName>{destination.name}</DestinationName>
                  <DestinationCount>{destination.yachtCount} yachts</DestinationCount>
                  <DestinationPrice>
                    from {destination.price} {destination.currency}
                  </DestinationPrice>
                </DestinationContent>
              </DestinationCard>
            </CardWrapper>
          );
        })}
        
        {/* Show More Card */}
        <CardWrapper
          initial={{ opacity: 0, scale: 0.9 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, scale: 1 }
          }}
          whileHover={{ y: -5 }}
        >
          <ShowMoreCard onClick={() => navigate('/destinations')}>
            <ShowMoreContent>
              <ShowMoreIcon>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ShowMoreIcon>
              <ShowMoreText>Show More</ShowMoreText>
            </ShowMoreContent>
          </ShowMoreCard>
        </CardWrapper>
      </DestinationGrid>
      </Container>
    </DestinationSection>
  );
}

export default TopDestinations; 





[
  {
    "_id": {
      "$oid": "65f2d123e85846e1e6d2a112"
    },
    "slug": "turkey",
    "city": "Istanbul",
    "country": "Turkey", 
    "name": "Turkey",
    "description": "Experience luxury yachting along Turkey's turquoise coast",
    "shortDescription": "Discover Turkish Riviera",
    "featured": true,
    "status": "active",
    "yachtCount": 1707,
    "bookingCount": 0,
    "price": "€101/day",
    "pricing": {
      "amount": 101,
      "currency": "€",
      "unit": "day"
    },
    "rating": {
      "averageRating": 0,
      "totalReviews": 0
    },
    "geoPoint": {
      "type": "Point",
      "coordinates": [35.2433, 38.9637]
    },
    "popularActivities": [],
    "bestTimeToVisit": {
      "months": [],
      "notes": ""
    },
    "region": "Mediterranean",
    "marinas": [],
    "createdAt": {
      "$date": "2024-03-14T10:00:00.000Z"
    },
    "updatedAt": {
      "$date": "2024-03-14T10:00:00.000Z" 
    },
    "image": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1000&auto=format&fit=crop"
  },
  {
    "_id": {
      "$oid": "65f2d123e85846e1e6d2a113"
    },
    "slug": "germany",
    "city": "Hamburg",
    "country": "Germany",
    "name": "Germany",
    "description": "Sail through Germany's northern coastline and Baltic Sea",
    "shortDescription": "Experience German maritime culture",
    "featured": false,
    "status": "active", 
    "yachtCount": 1037,
    "bookingCount": 0,
    "price": "€18/day",
    "pricing": {
      "amount": 18,
      "currency": "€",
      "unit": "day"
    },
    "rating": {
      "averageRating": 0,
      "totalReviews": 0
    },
    "geoPoint": {
      "type": "Point",
      "coordinates": [10.4515, 51.1657]
    },
    "popularActivities": [],
    "bestTimeToVisit": {
      "months": [],
      "notes": ""
    },
    "region": "Northern Europe",
    "marinas": [],
    "createdAt": {
      "$date": "2024-03-14T10:00:00.000Z"
    },
    "updatedAt": {
      "$date": "2024-03-14T10:00:00.000Z"
    },
    "image": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    "_id": {
      "$oid": "65f2d123e85846e1e6d2a114"
    },
    "slug": "france",
    "city": "Nice",
    "country": "France",
    "name": "France",
    "description": "Discover the glamorous French Riviera by yacht",
    "shortDescription": "Luxury yachting in France",
    "featured": true,
    "status": "active",
    "yachtCount": 2543,
    "bookingCount": 0,
    "price": "€57/day",
    "pricing": {
      "amount": 57,
      "currency": "€",
      "unit": "day"
    },
    "rating": {
      "averageRating": 0,
      "totalReviews": 0
    },
    "geoPoint": {
      "type": "Point",
      "coordinates": [2.2137, 46.2276]
    },
    "popularActivities": [],
    "bestTimeToVisit": {
      "months": [],
      "notes": ""
    },
    "region": "Mediterranean",
    "marinas": [],
    "createdAt": {
      "$date": "2024-03-14T10:00:00.000Z"
    },
    "updatedAt": {
      "$date": "2024-03-14T10:00:00.000Z"
    },
    "image": "https://images.unsplash.com/photo-1534372686206-3bfcb8f6b4f3?q=80&w=1000&auto=format&fit=crop"
  },
  {
    "_id": {
      "$oid": "65f2d123e85846e1e6d2a115" 
    },
    "slug": "italy",
    "city": "Rome",
    "country": "Italy",
    "name": "Italy",
    "description": "Sail through Italy's stunning coastlines and islands",
    "shortDescription": "Italian coastal adventures",
    "featured": true,
    "status": "active",
    "yachtCount": 2146,
    "bookingCount": 0,
    "price": "€65/day",
    "pricing": {
      "amount": 65,
      "currency": "€",
      "unit": "day"
    },
    "rating": {
      "averageRating": 0,
      "totalReviews": 0
    },
    "geoPoint": {
      "type": "Point",
      "coordinates": [12.5674, 41.8719]
    },
    "popularActivities": [],
    "bestTimeToVisit": {
      "months": [],
      "notes": ""
    },
    "region": "Mediterranean",
    "marinas": [],
    "createdAt": {
      "$date": "2024-03-14T10:00:00.000Z"
    },
    "updatedAt": {
      "$date": "2024-03-14T10:00:00.000Z"
    },
    "image": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000&auto=format&fit=crop"
  },
  {
    "_id": {
      "$oid": "65f2d123e85846e1e6d2a116"
    },
    "slug": "spain",
    "city": "Barcelona",
    "country": "Spain",
    "name": "Spain",
    "description": "Experience Spain's vibrant coastal culture and islands",
    "shortDescription": "Spanish maritime excellence",
    "featured": true,
    "status": "active",
    "yachtCount": 2402,
    "bookingCount": 0,
    "price": "€33/day",
    "pricing": {
      "amount": 33,
      "currency": "€",
      "unit": "day"
    },
    "rating": {
      "averageRating": 0,
      "totalReviews": 0
    },
    "geoPoint": {
      "type": "Point",
      "coordinates": [-3.7492, 40.4637]
    },
    "popularActivities": [],
    "bestTimeToVisit": {
      "months": [],
      "notes": ""
    },
    "region": "Mediterranean",
    "marinas": [],
    "createdAt": {
      "$date": "2024-03-14T10:00:00.000Z"
    },
    "updatedAt": {
      "$date": "2024-03-14T10:00:00.000Z"
    },
    "image": "https://images.unsplash.com/photo-1511068797325-6083f0f872b1?q=80&w=1000&auto=format&fit=crop"
  },
  {
    "_id": {
      "$oid": "65f2d123e85846e1e6d2a117"
    },
    "slug": "thailand",
    "city": "Phuket",
    "country": "Thailand",
    "name": "Thailand",
    "description": "Discover Thailand's tropical paradise and hidden bays",
    "shortDescription": "Thai island adventures",
    "featured": true,
    "status": "active",
    "yachtCount": 926,
    "bookingCount": 0,
    "price": "€89/day",
    "pricing": {
      "amount": 89,
      "currency": "€",
      "unit": "day"
    },
    "rating": {
      "averageRating": 0,
      "totalReviews": 0
    },
    "geoPoint": {
      "type": "Point",
      "coordinates": [100.9925, 15.8700]
    },
    "popularActivities": [],
    "bestTimeToVisit": {
      "months": [],
      "notes": ""
    },
    "region": "Southeast Asia",
    "marinas": [],
    "createdAt": {
      "$date": "2024-03-14T10:00:00.000Z"
    },
    "updatedAt": {
      "$date": "2024-03-14T10:00:00.000Z"
    },
    "image": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop"
  }
]
