/** @jsxImportSource react */
import styled from "styled-components";
import { motion } from "framer-motion";
import { Award, HeadphonesIcon, Gift, Shield, MessageCircle, BadgeCheck } from "lucide-react";

// Main container
const FeaturesSection = styled.section`
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  padding: 5rem 1.5rem 4rem;
  position: relative;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

// Background decoration elements
const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08), transparent 25%),
                    radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.08), transparent 25%);
  pointer-events: none;
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


// Features grid
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

// Feature card
const FeatureCard = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
  }
`;

// Icon container
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${props => props.bgColor || '#FDF2F8'};
  color: ${props => props.iconColor || '#EC4899'};
  
  svg {
    width: 1.75rem;
    height: 1.75rem;
    stroke-width: 1.75;
  }
`;

// Feature content
const FeatureContent = styled.div`
  flex: 1;
`;

// Feature title
const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
`;

// Feature description
const FeatureDescription = styled.p`
  color: #64748b;
  font-size: 0.9375rem;
  line-height: 1.6;
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const features = [
  {
    icon: <Award />,
    title: "Unbeatable prices",
    description: "Save money on deals you won't find anywhere else",
    bgColor: "#FEF3C7",
    iconColor: "#F59E0B"
  },
  {
    icon: <HeadphonesIcon />,
    title: "Excellent customer support",
    description: "7 days a week",
    bgColor: "#E0F2FE",
    iconColor: "#0EA5E9"
  },
  {
    icon: <Gift />,
    title: "Extra benefits and perks",
    description: "Exclusive deals for our customers",
    bgColor: "#EDE9FE",
    iconColor: "#8B5CF6"
  },
  {
    icon: <Shield />,
    title: "Safe booking",
    description: "Free cancellation and low prepayment",
    bgColor: "#DEF7EC",
    iconColor: "#10B981"
  },
  {
    icon: <MessageCircle />,
    title: "19102 verified reviews",
    description: "From real customers",
    bgColor: "#FEE2E2",
    iconColor: "#EF4444"
  },
  {
    icon: <BadgeCheck />,
    title: "Verified charter companies and boat owners",
    description: "Trusted partners for your journey",
    bgColor: "#DBEAFE",
    iconColor: "#3B82F6"
  }
];

const BusinessFeatures = () => {
  return (
    <FeaturesSection>
      <BackgroundGradient />
      <Container>
        <SectionHeader>
          <Title
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Book Lux Yachts
          </Title>
        </SectionHeader>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index} variants={itemVariants} whileHover={{ y: -8 }}>
                <IconContainer bgColor={feature.bgColor} iconColor={feature.iconColor}>
                  {feature.icon}
                </IconContainer>
                <FeatureContent>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureContent>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </motion.div>
      </Container>
    </FeaturesSection>
  );
};

export default BusinessFeatures; 