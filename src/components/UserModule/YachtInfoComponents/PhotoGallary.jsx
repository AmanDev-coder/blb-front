import React, { useEffect, useState } from "react";
import { Modal, IconButton, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import styled from "styled-components";

// Modern gallery container with improved spacing and transitions
const GalleryContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  grid-template-rows: repeat(2, 240px);
  gap: 12px;
  border-radius: 16px;
  width: 100%;
    overflow: hidden; 
  margin-bottom: 2rem;
  
  @media (max-width: 992px) {
    grid-template-rows: repeat(2, 200px);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 320px;
    margin-bottom: 1.5rem;
  }
`;

// Primary photo container
const PrimaryPhoto = styled(motion.div)`
  grid-column: span 1;
  grid-row: span 2;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.33, 1, 0.68, 1);
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 30%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

// Small photos vertical stack
const VerticalStack = styled.div`
  grid-column: span 1;
  grid-row: span 2;
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
`;

// Individual small photo container
const SmallPhoto = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.33, 1, 0.68, 1);
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 30%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

// View all button with improved styling
const ViewAllButton = styled(Button)`
  position: absolute !important;
  bottom: 16px;
  right: 16px;
  background-color: white !important;
  color: #1e3a8a !important;
  font-weight: 600 !important;
  padding: 6px 16px !important;
  border-radius: 12px !important;
  text-transform: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9) !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2) !important;
  }
  
  & .MuiButton-startIcon {
    margin-right: 6px !important;
  }
`;

// Enhanced modal overlay with blur effect
const EnhancedModalOverlay = styled(motion.div)`
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

// Gallery image with animation
const GalleryImage = styled(motion.img)`
  max-width: 90%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
`;

// Navigation buttons with improved styling
const NavButton = styled(IconButton)`
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  margin: 0 16px !important;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease !important;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.25) !important;
    transform: scale(1.1);
  }
`;

// Image counter display
const ImageCounter = styled.div`
  position: absolute;
  bottom: 24px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(4px);
`;

// Close button
const CloseButton = styled(IconButton)`
  position: absolute !important;
  top: 24px;
  right: 24px;
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease !important;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.25) !important;
    transform: scale(1.1);
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5 }
  }
};

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

// Main Component
const PhotoGalleryComponent = ({ yacht }) => {
  const photos = yacht?.images || [];
  const [open, setOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [direction, setDirection] = useState(0);

  const handleOpen = (index) => {
    setCurrentImageIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleNext = () => {
    setDirection(1);
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;
      
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle case when there are no photos
  if (!photos || photos.length === 0) {
    return (
      <GalleryContainer 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <PrimaryPhoto variants={itemVariants}>
          <img src="/placeholder-yacht.jpg" alt="No photos available" />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            fontSize: '1.2rem'
          }}>
            No photos available
          </div>
        </PrimaryPhoto>
      </GalleryContainer>
    );
  }

  return (
    <>
      <GalleryContainer 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {isMobile ? (
          <PrimaryPhoto 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleOpen(0)}
          >
            <img src={photos[0]?.imgeUrl} alt="Featured yacht" />
          </PrimaryPhoto>
        ) : (
          <>
            <PrimaryPhoto 
              variants={itemVariants} 
                onClick={() => handleOpen(0)}
            >
              <img src={photos[0]?.imgeUrl} alt="Featured yacht" />
            </PrimaryPhoto>

            <VerticalStack>
              <SmallPhoto 
                variants={itemVariants}
                  onClick={() => handleOpen(1)}
              >
                <img src={photos[1]?.imgeUrl || photos[0]?.imgeUrl} alt="Yacht detail" />
              </SmallPhoto>
              <SmallPhoto 
                variants={itemVariants}
                  onClick={() => handleOpen(2)}
              >
                <img src={photos[2]?.imgeUrl || photos[0]?.imgeUrl} alt="Yacht detail" />
              </SmallPhoto>
            </VerticalStack>

            <PrimaryPhoto 
              variants={itemVariants}
                onClick={() => handleOpen(3)}
            >
              <img src={photos[3]?.imgeUrl || photos[0]?.imgeUrl} alt="Featured yacht" />
              <ViewAllButton
                variant="contained"
                startIcon={<PhotoLibraryIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen(0);
                }}
              >
                View all photos
              </ViewAllButton>
            </PrimaryPhoto>
          </>
        )}
      </GalleryContainer>

      <AnimatePresence>
        {open && (
          <Modal 
            open={open} 
            onClose={handleClose}
            closeAfterTransition
          >
            <EnhancedModalOverlay
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <CloseButton onClick={handleClose}>
            <CloseIcon />
              </CloseButton>

              <NavButton onClick={handlePrev}>
            <ArrowBackIosNewIcon />
              </NavButton>

              <AnimatePresence initial={false} custom={direction}>
                <GalleryImage
                  key={currentImageIndex}
                  src={photos[currentImageIndex]?.imgeUrl}
                  alt={`Yacht image ${currentImageIndex + 1}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                />
              </AnimatePresence>

              <NavButton onClick={handleNext}>
            <ArrowForwardIosIcon />
              </NavButton>

              <ImageCounter>
            {currentImageIndex + 1} / {photos.length}
              </ImageCounter>
            </EnhancedModalOverlay>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default PhotoGalleryComponent;
