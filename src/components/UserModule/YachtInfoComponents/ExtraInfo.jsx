import React from 'react';
import { Typography } from '@mui/material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaAnchor, FaWineGlassAlt, FaSun } from 'react-icons/fa';

// Main container with improved styling
const Container = styled.div`
  width: 100%;
  position: relative;
`;

// Section for each content row
const Row = styled(motion.div)`
  margin-bottom: 2.5rem;
`;

// Feature title with accent styling
const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 1.25rem;
  display: inline-block;
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
    border-radius: 3px;
  }
`;

// Highlight list with improved styling
const HighlightList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Individual highlight item with icon
const HighlightItem = styled(motion.li)`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(243, 244, 246, 0.5);
  border-radius: 0.75rem;
  border: 1px solid rgba(229, 231, 235, 0.7);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(243, 244, 246, 0.8);
    transform: translateY(-2px);
    box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 12px;
  }
`;

// Icon container for highlights
const HighlightIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${props => props.bg || 'linear-gradient(135deg, #93c5fd, #3b82f6)'};
  color: white;
  font-size: 1.25rem;
  box-shadow: rgba(59, 130, 246, 0.15) 0px 4px 12px;
`;

// Content of highlight item
const HighlightContent = styled.div`
  flex: 1;
`;

// Highlight text
const HighlightText = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #334155;
`;

// Description with improved readability
const DescriptionText = styled.div`
  font-size: 1.0625rem;
  line-height: 1.8;
  color: #475569;
  
  p {
    margin-bottom: 1.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Animation variants
const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

// Highlight data with icons
const highlights = [
  {
    text: "Discover the beauty of the Costa Daurada on a comfortable catamaran cruise",
    icon: <FaAnchor />,
    gradient: "linear-gradient(135deg, #93c5fd, #3b82f6)"
  },
  {
    text: "Soak up the sunshine on deck as you sip on a refreshing glass of cava",
    icon: <FaSun />,
    gradient: "linear-gradient(135deg, #fdba74, #f97316)"
  },
  {
    text: "Experience amazing coastal views with a professional crew",
    icon: <FaWineGlassAlt />,
    gradient: "linear-gradient(135deg, #a5b4fc, #6366f1)"
  }
];

const DetailsPage = ({ yacht }) => (
  <Container>
    <Row
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={rowVariants}
    >
      <Title>Highlights</Title>
      <HighlightList
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {highlights.map((highlight, index) => (
          <HighlightItem key={index} variants={itemVariants}>
            <HighlightIcon bg={highlight.gradient}>
              {highlight.icon}
            </HighlightIcon>
            <HighlightContent>
              <HighlightText>{highlight.text}</HighlightText>
            </HighlightContent>
          </HighlightItem>
        ))}
      </HighlightList>
    </Row>

    {/* <Row
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={rowVariants}
    >
      <Title>Description</Title>
      <DescriptionText>
        {yacht?.description ? (
          <div dangerouslySetInnerHTML={{ __html: formatDescription(yacht.description) }} />
        ) : (
          <p>
            Experience the ultimate luxury sailing adventure aboard our stunning yacht. 
            Designed with your comfort in mind, this vessel combines elegant styling with 
            outstanding performance on the water. Perfect for day trips, sunset cruises, 
            or extended voyages, you'll enjoy spacious decks, premium amenities, and breathtaking 
            views. Our experienced captain and crew are dedicated to ensuring your journey 
            is unforgettable, whether you're celebrating a special occasion or simply 
            seeking an escape on the open water.
          </p>
        )}
      </DescriptionText>
    </Row> */}

    {yacht?.tripStyle && (
      <Row
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={rowVariants}
      >
        <Title>Trip Style</Title>
        <DescriptionText>
          <p>{yacht.tripStyle}</p>
        </DescriptionText>
      </Row>
    )}

    {yacht?.instructions && (
      <Row
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={rowVariants}
      >
        <Title>Special Instructions</Title>
        <DescriptionText>
          <p>{yacht.instructions}</p>
        </DescriptionText>
      </Row>
    )}
  </Container>
);

// Format description to handle line breaks and links
const formatDescription = (text) => {
  if (!text) return '';
  
  // Convert line breaks to paragraphs
  const withParagraphs = text
    .split('\n\n')
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph)
    .map(paragraph => `<p>${paragraph}</p>`)
    .join('');
  
  // Convert URLs to clickable links
  const withLinks = withParagraphs.replace(
    /(https?:\/\/[^\s]+)/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  
  return withLinks;
};

export default DetailsPage;
