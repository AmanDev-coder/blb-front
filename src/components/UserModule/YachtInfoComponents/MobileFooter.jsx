import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Drawer, Box, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { IoBoatOutline } from 'react-icons/io5';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { MdOutlineWatchLater } from 'react-icons/md';

// Main footer container with sleek design
const FooterContainer = styled(motion.div)`
    position: fixed;
    bottom: 0;
    left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 100;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  display: flex;
    justify-content: space-between;
    align-items: center;
`;

// Price display with gradient text
const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Price = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #1e3a8a, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const PriceUnit = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

// Book now button with gradient
const BookButton = styled(motion.button)`
  background: linear-gradient(to right, #2563eb, #4f46e5);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  
  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
  }
`;

// Drawer container for date/duration selection
const BookingDrawer = styled(Box)`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
`;

// Drawer header
const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

// Section title
const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0;
`;

// Close button
const CloseButton = styled.button`
  background: transparent;
    border: none;
  color: #64748b;
  font-size: 1rem;
    cursor: pointer;
  padding: 0.5rem;
  
    &:hover {
    color: #1e3a8a;
  }
`;

// Selection section
const SelectionSection = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: #94a3b8;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }
`;

// Section label
const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  svg {
    color: #3b82f6;
    font-size: 1.25rem;
  }

  span {
    font-weight: 600;
    color: #1e3a8a;
  }
`;

// Confirm button
const ConfirmButton = styled(motion.button)`
  background: linear-gradient(to right, #2563eb, #4f46e5);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 1rem;
  font-weight: 600;
  font-size: 1rem;
  margin-top: auto;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(to right, #1d4ed8, #4338ca);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
  }
  
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// Animation variants
const footerVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.3, type: 'spring', stiffness: 500, damping: 30 }
  }
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } }
};

// Simple date picker component
const SimpleDatePicker = ({ selectedDate, setSelectedDate }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <input 
        type="date" 
        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
        style={{ 
          width: '100%', 
          padding: '0.75rem', 
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          fontSize: '1rem'
        }}
      />
    </div>
  );
};

// Simple duration picker component
const SimpleDurationPicker = ({ selectedDuration, setSelectedDuration }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <select
        value={selectedDuration || ''}
        onChange={(e) => setSelectedDuration(Number(e.target.value))}
        style={{ 
          width: '100%', 
          padding: '0.75rem', 
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          fontSize: '1rem'
        }}
      >
        <option value="">Select duration</option>
        <option value="1">1 Day</option>
        <option value="2">2 Days</option>
        <option value="3">3 Days</option>
        <option value="7">1 Week</option>
        <option value="14">2 Weeks</option>
        <option value="30">1 Month</option>
      </select>
    </div>
  );
};

const MobileFooter = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Show footer after a slight delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <FooterContainer
            initial="hidden"
            animate="visible"
            variants={footerVariants}
          >
      <PriceContainer>
              <Price>$249</Price>
              <PriceUnit>per day</PriceUnit>
      </PriceContainer>
            
            <BookButton
              onClick={() => toggleDrawer(true)}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Check Availability
            </BookButton>
          </FooterContainer>
        )}
      </AnimatePresence>
      
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: '1.5rem',
            borderTopRightRadius: '1.5rem',
            maxHeight: '90vh'
          }
        }}
      >
        <BookingDrawer>
          <DrawerHeader>
            <SectionTitle>Book this yacht</SectionTitle>
            <CloseButton onClick={() => toggleDrawer(false)}>
              Cancel
            </CloseButton>
          </DrawerHeader>
          
          <SelectionSection>
            <SectionLabel>
              <FaRegCalendarAlt />
              <span>Select Date</span>
            </SectionLabel>
            <SimpleDatePicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </SelectionSection>
          
          <SelectionSection>
            <SectionLabel>
              <MdOutlineWatchLater />
              <span>Duration</span>
            </SectionLabel>
            <SimpleDurationPicker
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
            />
          </SelectionSection>
          
          <ConfirmButton
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={!selectedDate || !selectedDuration}
            onClick={() => {
              // Handle booking confirmation
              console.log('Booking confirmed for:', selectedDate, 'Duration:', selectedDuration);
              toggleDrawer(false);
            }}
          >
            {selectedDate && selectedDuration ? 'Confirm Booking' : 'Select Date and Duration'}
          </ConfirmButton>
        </BookingDrawer>
      </Drawer>
    </>
  );
};

export default MobileFooter;
