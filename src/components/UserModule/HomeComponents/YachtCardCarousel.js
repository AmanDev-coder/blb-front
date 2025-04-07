import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Users, Ruler, Users2, Star, MapPin, Calendar } from 'lucide-react';
import { BoxReveal } from '../magicui/box-reveal';
import { BorderBeam } from '../magicui/border-beam';
import { Navigate, useNavigate } from "react-router-dom";
const Card = styled(motion.div)`
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  min-width: 300px;

  &:hover {
    transform: translateY(-30px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
  }
`;

const YachtImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-bottom: 1px solid #e5e7eb;
  display: ${({ loading }) => (loading ? 'none' : 'block')};
`;

const LoadingMessage = styled.div`
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 1rem;
  background-color: #f3f4f6;
`;

const YachtInfo = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const YachtName = styled.h3`
  font-size: 1.75rem;
  font-weight: bold;
  margin: 0;
  color: #1e3a8a;
`;

const YachtSpecs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const Spec = styled.span`
  display: flex;
  align-items: center;
  gap: 0rem;
`;

const YachtDescription = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
`;

const YachtPrice = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
  color: #3b82f6;
  margin-top: auto;
`;

const ViewMoreButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

const PredictiveTag = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ predictive }) => {
    switch (predictive) {
      case 'Trending':
        return '#D2042D'; // Cherry red for Trending
      case 'Hot sailor':
        return '#e25822'; // Flaming red for Hot sailor
      case 'Limited Seats':
        return '#D0FE1D'; // Lime yellow for Limited Seats
      case 'Recommended':
        return '#51B73B'; // Leafy green for Recommended
      default:
        return 'rgba(255, 255, 255, 0.8)'; // Default color
    }
  }}; // Set background color based on predictive value
  color:${({ predictive }) => {
    switch (predictive) {
      case 'Trending':
        return '#ffffff'; // Cherry red for Trending
      case 'Hot sailor':
        return '#ffffff'; // Flaming red for Hot sailor
      case 'Limited Seats':
        return '#000000'; // Lime yellow for Limited Seats
      case 'Recommended':
        return '#ffffff'; // Leafy green for Recommended
      default:
        return 'rgba(255, 255, 255, 0.8)'; // Default color
    }
  }};
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 0.8rem;
  font-weight: bold;
  white-space: nowrap; // Prevent text wrapping
  transition: background-color 0.3s, color 0.3s; // Smooth transition for hover effects


`;

const YachtCardCarousel = ({ yacht, index, activeCard, setActiveCard, predictive }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState({ images: [], loading: true });
  const navigate = useNavigate();

  const fetchImages = async () => {
    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=yacht&client_id=k5K_m6RUK0MUsGa4Cz2uFGsQX3LgDyiGYwCywAfm7uE&per_page=3&page=${index + 1}`);
      const data = await response.json();
      const imageUrls = data.results.map(img => img.urls.regular);
      setImages({ images: imageUrls, loading: false });
    } catch (error) {
      console.error('Failed to fetch images:', error);
      setImages({ images: [], loading: false });
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    let intervalId;
    if (activeCard === index) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (images.images.length || 1));
      }, 800);
    }
    return () => clearInterval(intervalId);
  }, [activeCard, images]);

  return (
    <Card
      onMouseEnter={() => setActiveCard(index)}
      onMouseLeave={() => setActiveCard(null)}
      onClick={()=>navigate('/boat')}
    >
      <BoxReveal width="100%" boxColor="#d9d9d9">
        {images.loading ? (
          <LoadingMessage>Loading images...</LoadingMessage>
        ) : (
          images.images.length > 0 && <YachtImage src={images.images[currentImageIndex]} alt={yacht.name} />
        )}
      </BoxReveal>
      <YachtInfo>
        <YachtName>{yacht.name}</YachtName>
        <YachtSpecs>
          <Spec><Users size={18} /> {yacht.guests} Guests</Spec>
          <Spec><Ruler size={18} /> {yacht.size}</Spec>
          <Spec><Users2 size={18} /> {yacht.crew} Crew</Spec>
          <Spec><Star size={18} /> {yacht.rating} Rating</Spec>
          <Spec><MapPin size={18} /> {yacht.location}</Spec>
          <Spec><Calendar size={18} /> {yacht.launchYear}</Spec>
        </YachtSpecs>
        <YachtDescription>{yacht.description}</YachtDescription>
        <YachtPrice>${yacht.price} / night</YachtPrice>
        <ViewMoreButton>View More</ViewMoreButton>
        <PredictiveTag predictive={predictive}>{predictive}</PredictiveTag> {/* Display the predictive tag */}
      </YachtInfo>
      <BorderBeam />
    </Card>
  );
};

export default YachtCardCarousel;