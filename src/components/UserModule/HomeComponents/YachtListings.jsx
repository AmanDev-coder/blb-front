import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { fetchWishlist, fetchYachts } from "../../../Redux/yachtReducer/action";
import { useSelector, useDispatch } from 'react-redux';
import YachtCard from "../YachtCard";
import { motion, useAnimation, useInView } from "framer-motion";
import TopDestinations from "./TopDestinations";

// Styled components
const ListingsWrapper = styled.div`
  padding: 20px;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  // // overflow: hidden;
  // overflow-x: hidden;
  // overflow-y: auto;
  position: relative;
`;
const BackgroundCircleDiv = styled.div`
  // padding: 20px;
  // background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  overflow: hidden;
  // overflow-x: hidden;
  width: 10px;
  // overflow-y: auto;
  max-width: 10px;
  // position: relative;
`;
// Background Elements
const BackgroundCircle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(124, 58, 237, 0.1));
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
    bottom: 0px;
    right: -100px;
  }
`;

const ListingsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
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

const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  row-gap: 3rem;
  column-gap: 1rem;
  position: relative;
  z-index: 2;
`;

const LoadMoreButton = styled(motion.button)`
  display: block;
  margin: 2rem auto 0;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);

  &:hover {
    background: linear-gradient(135deg, #1e3a8a, #2563eb);
    box-shadow: 0 15px 20px -3px rgba(59, 130, 246, 0.4);
    transform: translateY(-2px);
  }
`;

const CategoriesWrapper = styled.div`
  margin-bottom: 20px;
  padding-bottom: 1.5rem;
  position: relative;
  z-index: 2;
`;

const CategoriesList = styled.div`
  display: flex;
  gap: 10px;
`;

const CategoryButton = styled.button`
  background: ${(props) => (props.selected ? "linear-gradient(135deg, #1e40af, #3b82f6)" : "white")};
  color: ${(props) => (props.selected ? "white" : "#64748b")};
  box-shadow: ${(props) => (props.selected ? "0 10px 15px -3px rgba(59, 130, 246, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)")};
  border: ${(props) => (props.selected ? "1px solid transparent" : "1px solid #e2e8f0")};
  padding: 0.5rem 1.25rem;
  border-radius: 30px;
  font-weight: ${(props) => (props.selected ? "600" : "500")};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &:hover {
    background: ${(props) => (props.selected ? "linear-gradient(135deg, #1e40af, #3b82f6)" : "#f8fafc")};
    color: ${(props) => (props.selected ? "white" : "#1e40af")};
    box-shadow: ${(props) => (props.selected ? "0 12px 20px -3px rgba(59, 130, 246, 0.4)" : "0 6px 12px -1px rgba(0, 0, 0, 0.15)")};
    transform: ${(props) => (props.selected ? "translateY(-2px)" : "translateY(0)")};
  }
`;

const YachtListings = () => {
  const yachts = useSelector((store) => store.yachtReducer.yachts);

  const [visibleYachts, setVisibleYachts] = useState(9); // Number of visible yachts
  const [selectedCategory, setSelectedCategory] = useState("All");
  const wishlist = useSelector((state) => state.yachtReducer.wishlist);
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  // Ensure useEffect triggers correctly after yachts is populated
  useEffect(() => {
    const getUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => {
            dispatch(fetchYachts());
          },
          (error) => {
            console.error("Error getting location:", error);
            dispatch(fetchYachts());
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        dispatch(fetchYachts());
      }
    };
   
    getUserLocation();
  }, [dispatch]);

  // Animate when in view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const handleLoadMore = () => {
    setVisibleYachts((prevVisibleYachts) => prevVisibleYachts + 9);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

useEffect(() => {
  if(user){
    dispatch(fetchWishlist(user.id));
  }
  }, [dispatch]);

  return (
    <ListingsWrapper ref={ref}>
      <BackgroundCircleDiv>
      <BackgroundCircle 
        className="circle1"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
      />
      {/* <BackgroundCircle 
        className="circle2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      /> */}
      </BackgroundCircleDiv>
      
      <ListingsContainer>
        {/* Modern section header with animated underline */}
        <SectionHeader>
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            Discover Extraordinary Yachts
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
            Explore our curated collection of luxury vessels for your next unforgettable voyage
          </Subtitle>
        </SectionHeader>

        {/* Categories section with enhanced styling */}
        <CategoriesWrapper style={{ marginBottom: "2.5rem" }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem"
            }}
          >
            <h3 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "600", 
              color: "#1e3a8a",
              position: "relative",
              paddingLeft: "0.75rem",
            }}>
              <span style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: "4px",
                height: "20px",
                background: "#3b82f6",
                borderRadius: "2px"
              }}></span>
              Browse by Category
            </h3>
          </motion.div>
          
          <CategoriesList>
            {["All", "Custom", "Bottom Glass", "Luxury"].map((category) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <CategoryButton
                  selected={selectedCategory === category}
                onClick={() => handleCategoryChange(category)}
                  style={{ 
                    background: selectedCategory === category 
                      ? "linear-gradient(135deg, #1e40af, #3b82f6)" 
                      : "white",
                    color: selectedCategory === category ? "white" : "#64748b",
                    boxShadow: selectedCategory === category
                      ? "0 10px 15px -3px rgba(59, 130, 246, 0.3)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    border: `1px solid ${selectedCategory === category ? "transparent" : "#e2e8f0"}`,
                    padding: "0.5rem 1.25rem",
                    borderRadius: "30px",
                    fontWeight: selectedCategory === category ? "600" : "500",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    zIndex: "1",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.color = "#1e40af";
                      e.currentTarget.style.boxShadow = "0 6px 12px -1px rgba(0, 0, 0, 0.15)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    } else {
                      e.currentTarget.style.boxShadow = "0 12px 20px -3px rgba(59, 130, 246, 0.4)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "#64748b";
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                    } else {
                      e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(59, 130, 246, 0.3)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
              >
                {category}
              </CategoryButton>
              </motion.div>
            ))}
          </CategoriesList>
        </CategoriesWrapper>

        {/* Yacht grid with staggered animation */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
        <ListingsGrid>
  {yachts && yachts.map((yacht, index) => 
    yacht.isLive ? (
                <motion.div
                  key={yacht._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
      <YachtCard
        yacht={yacht}
        index={index}
        wishlist={wishlist}
                    isCompareActive={false}
                    setIsCompareActive={() => {}}
                    selectedYachts={[]}
                    setSelectedYachts={() => {}}
      />
                </motion.div>
    ) : null
  )}
</ListingsGrid>
        </motion.div>

        {/* Enhanced load more button with animation */}
        {visibleYachts < yachts?.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}
          >
            <LoadMoreButton 
              onClick={handleLoadMore}
              style={{
                background: "linear-gradient(135deg, #1e40af, #3b82f6)",
                color: "white",
                border: "none",
                borderRadius: "30px",
                padding: "0.75rem 2rem",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)"
              }}
            >
              Load More
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </LoadMoreButton>
          </motion.div>
        )}

        {/* Add the new Top Destinations component */}
        <TopDestinations />
      </ListingsContainer>
    </ListingsWrapper>
  );
};

export default YachtListings;