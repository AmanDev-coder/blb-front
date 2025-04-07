import styled from "styled-components";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import image1 from "/assets/1.jpg";
import image2 from "/assets/3.jpg";
import image3 from "/assets/5.jpg";
import image4 from "/assets/8.jpg";

// Styled components with modern design
const GrowthWrapper = styled.div`
  background-color: #1c0d33;
  padding: 5rem 2rem;
  overflow: hidden;
  position: relative;
  max-width: 1280px;
  border-radius: 20px;
  margin: 3rem 1.5rem 5rem;

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    z-index: 0;
  }

  &::before {
    width: 300px;
    height: 300px;
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.15),
      rgba(99, 102, 241, 0.15)
    );
    top: -100px;
    left: -100px;
    filter: blur(60px);
  }

  &::after {
    width: 250px;
    height: 250px;
    background: linear-gradient(
      135deg,
      rgba(139, 92, 246, 0.15),
      rgba(236, 72, 153, 0.15)
    );
    bottom: -50px;
    right: -50px;
    filter: blur(60px);
  }

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
    margin: 3rem 1rem;
  }
`;

const ContentContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const LeftColumn = styled.div`
  flex: 1;
  padding-right: 2rem;

  @media (max-width: 1024px) {
    padding-right: 0;
    text-align: center;
  }
`;

const Heading = styled(motion.h2)`
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  font-family: "Poppins", sans-serif;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subheading = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 550px;

  @media (max-width: 1024px) {
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    width: 100%;
    max-width: 280px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const PrimaryButton = styled(motion.button)`
  background-color: #0ea5e9;
  color: white;
  font-weight: 600;
  padding: 1rem 2.5rem;
  border-radius: 2.5rem;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3);

  &:hover {
    background-color: #0284c7;
    transform: translateY(-3px);
    box-shadow: 0 15px 20px -3px rgba(14, 165, 233, 0.35);
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }
`;

const SecondaryButton = styled(motion.button)`
  background-color: transparent;
  color: white;
  font-weight: 600;
  padding: 0.95rem 2.45rem;
  border-radius: 2.5rem;
  font-size: 1.125rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-3px);
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.825rem 1.5rem;
  }
`;

const RightColumn = styled.div`
  flex: 1;
  position: relative;
  height: 480px;
  display: flex;
  justify-content: center;

  @media (max-width: 1024px) {
    width: 100%;
    height: 400px;
  }
`;

const PhonesContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PhoneMockupContainer = styled(motion.div)`
  position: relative;
  width: 280px;
  height: 560px;
  perspective: 1000px;
  z-index: 2;

  @media (max-width: 768px) {
    width: 240px;
    height: 480px;
  }
`;

const SecondPhoneMockupContainer = styled(motion.div)`
  position: absolute;
  width: 280px;
  height: 560px;
  perspective: 1000px;
  z-index: 1;
  right: calc(50% - 60px);
  top: 100px;

  @media (max-width: 1024px) {
    right: calc(50% - 40px);
    top: 80px;
  }

  @media (max-width: 768px) {
    width: 240px;
    height: 480px;
    right: calc(50% - 30px);
  }
`;

const PhoneMockup = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 36px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 8px solid #2e1a4a;
`;

const PhoneHeader = styled.div`
  background-color: #f1f5f9;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const AppLogo = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.3);
  font-family: "Poppins", sans-serif;
`;

const AddListingButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f8fafc;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  color: #0f172a;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ListingItem = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  margin: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const ListingImage = styled.div`
  height: 7rem;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const ListingDetails = styled.div`
  padding: 1rem;
  background-color: white;
`;

const ListingTitleText = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ListingDescriptionText = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ListingPriceText = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #0ea5e9;
  margin-top: 0.75rem;
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const mockupVariants = {
  hidden: { opacity: 0, y: 30, rotateY: -15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateY: -15,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.3,
    },
  },
};

const secondMockupVariants = {
  hidden: { opacity: 0, y: 40, rotateY: -15 },
  visible: {
    opacity: 0.7,
    y: 0,
    rotateY: -15,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.5,
    },
  },
};

// Yacht listing data
const yachtListings = [
  {
    id: 1,
    title: "Luxury Yacht - Oceanic Dream",
    description:
      "Experience the ultimate luxury cruise with this magnificent yacht",
    price: "$2,500 / day",
    image: image1,
  },
  {
    id: 2,
    title: "Elegant Sail Yacht - Majestic Wave",
    description: "Perfect sailing experience for adventurous water lovers",
    price: "$1,800 / day",
    image: image2,
  },
];

const secondYachtListings = [
  {
    id: 3,
    title: "Premium Yacht - Azure Horizon",
    description: "Discover paradise on this premium yacht with full amenities",
    price: "$3,200 / day",
    image: image3,
  },
  {
    id: 4,
    title: "Catamaran - Ocean Explorer",
    description: "Spacious and comfortable catamaran for family cruising",
    price: "$1,950 / day",
    image: image4,
  },
];

const BusinessGrowth = () => {
  return (
    <GrowthWrapper>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <ContentContainer>
          <LeftColumn>
            <Heading variants={itemVariants}>
              Let&apos;s Grow Your Boating Business Together
            </Heading>
            <Subheading as={motion.p} variants={itemVariants}>
              Get more customers, earn more dollars, and pay the lowest fees on
              the world&apos;s leading boating marketplace
            </Subheading>
            <ButtonContainer as={motion.div} variants={itemVariants}>
              <PrimaryButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Today
              </PrimaryButton>
              <SecondaryButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </SecondaryButton>
            </ButtonContainer>
          </LeftColumn>

          <RightColumn>
            <PhonesContainer>
              <PhoneMockupContainer variants={mockupVariants}>
                <PhoneMockup>
                  <PhoneHeader>
                    <AppLogo>BLY</AppLogo>
                    <AddListingButton>
                      <PlusCircle size={16} />
                      Add Listing
                    </AddListingButton>
                  </PhoneHeader>
                  <div style={{ padding: "0.5rem" }}>
                    {yachtListings.map((yacht) => (
                      <ListingItem key={yacht.id}>
                        <ListingImage src={yacht.image} />
                        <ListingDetails>
                          <ListingTitleText>{yacht.title}</ListingTitleText>
                          <ListingDescriptionText>
                            {yacht.description}
                          </ListingDescriptionText>
                          <ListingPriceText>{yacht.price}</ListingPriceText>
                        </ListingDetails>
                      </ListingItem>
                    ))}
                  </div>
                </PhoneMockup>
              </PhoneMockupContainer>

              <SecondPhoneMockupContainer variants={secondMockupVariants}>
                <PhoneMockup>
                  <PhoneHeader>
                    <AppLogo>BL</AppLogo>
                    <AddListingButton>
                      <PlusCircle size={16} />
                      Add Listing
                    </AddListingButton>
                  </PhoneHeader>
                  <div style={{ padding: "0.5rem" }}>
                    {secondYachtListings.map((yacht) => (
                      <ListingItem key={yacht.id}>
                        <ListingImage src={yacht.image} />
                        <ListingDetails>
                          <ListingTitleText>{yacht.title}</ListingTitleText>
                          <ListingDescriptionText>
                            {yacht.description}
                          </ListingDescriptionText>
                          <ListingPriceText>{yacht.price}</ListingPriceText>
                        </ListingDetails>
                      </ListingItem>
                    ))}
                  </div>
                </PhoneMockup>
              </SecondPhoneMockupContainer>
            </PhonesContainer>
          </RightColumn>
        </ContentContainer>
      </motion.div>
    </GrowthWrapper>
  );
};

export default BusinessGrowth;
