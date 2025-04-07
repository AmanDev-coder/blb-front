import React, { useState } from 'react';
import { Modal, Box, IconButton, Typography, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaFacebook, FaTwitter, FaWhatsapp, 
  FaEnvelope, FaLink, FaPinterest, FaTelegram
} from 'react-icons/fa';
import { FaShareFromSquare } from 'react-icons/fa6';

// Main container
const ShareButtonContainer = styled.div`
  position: relative;
`;

// Share button with smooth hover effect
const ShareButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #1e3a8a;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  svg {
    font-size: 1.2rem;
  }
`;

// Modal style
const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Modal content
const ModalContent = styled(motion.div)`
  background-color: white;
  border-radius: 1.5rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  outline: none;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 600px) {
    width: 95%;
    padding: 1.5rem;
  }
`;

// Modal title
const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #3b82f6;
  }
`;

// Yacht name display
const YachtName = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #475569;
  margin: 0 0 1.5rem;
  padding: 0.75rem 1rem;
  background-color: rgba(243, 244, 246, 0.5);
  border-radius: 0.75rem;
  border: 1px solid rgba(229, 231, 235, 0.7);
`;

// Share options grid
const ShareGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

// Individual share option
const ShareOption = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 1rem 0.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(243, 244, 246, 0.8);
  }
  
  svg {
    font-size: 1.75rem;
    color: ${props => props.color || '#3b82f6'};
  }
  
  span {
    font-size: 0.875rem;
    font-weight: 500;
    color: #475569;
  }
`;

// Direct link container
const DirectLinkContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(243, 244, 246, 0.5);
  border: 1px solid rgba(229, 231, 235, 0.7);
  border-radius: 0.75rem;
  padding: 0.5rem;
  margin-top: 1.5rem;
  position: relative;
  overflow: hidden;
`;

// Link input
const LinkInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9375rem;
  color: #475569;
  padding: 0.5rem;
  outline: none;
  font-family: inherit;
`;

// Copy button with animation
const CopyButton = styled(motion.button)`
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #2563eb;
  }
`;

// Animation variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

const optionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: custom => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.05,
      duration: 0.3
    }
  }),
  tap: { scale: 0.95 }
};

const ShareModal = ({ handleShare, yacht }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const url = window.location.href;
  
  // Share options with icons and colors
  const shareOptions = [
    { name: 'Facebook', icon: <FaFacebook />, color: '#1877F2', onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank') },
    { name: 'Twitter', icon: <FaTwitter />, color: '#1DA1F2', onClick: () => window.open(`https://twitter.com/intent/tweet?url=${url}&text=Check out this amazing yacht!`, '_blank') },
    { name: 'WhatsApp', icon: <FaWhatsapp />, color: '#25D366', onClick: () => window.open(`https://wa.me/?text=Check out this amazing yacht! ${url}`, '_blank') },
    { name: 'Email', icon: <FaEnvelope />, color: '#D44638', onClick: () => window.open(`mailto:?subject=Check out this yacht&body=I thought you might like this yacht: ${url}`, '_blank') },
    { name: 'Pinterest', icon: <FaPinterest />, color: '#E60023', onClick: () => window.open(`https://pinterest.com/pin/create/button/?url=${url}&description=Check out this amazing yacht!`, '_blank') },
    { name: 'Telegram', icon: <FaTelegram />, color: '#0088cc', onClick: () => window.open(`https://t.me/share/url?url=${url}&text=Check out this amazing yacht!`, '_blank') },
  ];
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <ShareButtonContainer>
      <ShareButton
        onClick={handleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Share"
      >
        <FaShareFromSquare />
      </ShareButton>
      
      <AnimatePresence>
        {open && (
          <StyledModal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            aria-labelledby="share-modal-title"
          >
            <ModalContent
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <IconButton
                aria-label="close"
                onClick={handleClose}
          sx={{
                  position: 'absolute',
                  right: 16,
                  top: 16,
                  color: '#64748b',
                }}
              >
                <CloseIcon />
          </IconButton>

              <ModalTitle>
                <FaShareFromSquare />
                Share this yacht
              </ModalTitle>
              
              <YachtName>
                {yacht?.title || 'Luxury Yacht Experience'}
              </YachtName>
              
              <ShareGrid>
            {shareOptions.map((option, index) => (
                  <ShareOption
                    key={option.name}
                    onClick={option.onClick}
                    color={option.color}
                    variants={optionVariants}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    whileTap="tap"
                  >
                    {option.icon}
                    <span>{option.name}</span>
                  </ShareOption>
                ))}
              </ShareGrid>
              
              <DirectLinkContainer>
                <LinkInput
                  type="text"
                  value={url}
                  readOnly
                  onClick={(e) => e.target.select()}
                />
                <CopyButton
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </CopyButton>
              </DirectLinkContainer>
            </ModalContent>
          </StyledModal>
        )}
      </AnimatePresence>
      
      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </ShareButtonContainer>
  );
};

export default ShareModal;
