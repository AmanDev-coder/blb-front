import React, { useState } from 'react';
import styled from 'styled-components';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { motion } from 'framer-motion';

// Custom styled components
const DatePickerContainer = styled.div`
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  
  & .MuiOutlinedInput-root {
    border-radius: 0.75rem;
    transition: all 0.2s ease;
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #94a3b8;
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #3b82f6;
      border-width: 2px;
    }
  }
  
  & .MuiInputLabel-root {
    color: #64748b;
    
    &.Mui-focused {
      color: #3b82f6;
    }
  }
  
  & .MuiOutlinedInput-input {
    padding: 1rem;
    font-family: 'Poppins', sans-serif;
  }
`;

const AvailableDatesInfo = styled(motion.div)`
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #10b981;
  }
`;

// Component for date selection
const AlseDatePicker = ({ selectedDate, setSelectedDate }) => {
  // Add disableDate function to disable past dates and some random unavailable dates
  const disableDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) {
      return true;
    }
    
    // Disable some random dates (example: first weekend of next month)
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    
    const firstWeekend = new Date(nextMonth);
    // Find first Saturday
    firstWeekend.setDate(firstWeekend.getDate() + (6 - firstWeekend.getDay()));
    
    return (
      date.getTime() === firstWeekend.getTime() || 
      date.getTime() === new Date(firstWeekend.getTime() + 86400000).getTime() // Sunday
    );
  };

  return (
    <DatePickerContainer>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          disablePast
          shouldDisableDate={disableDate}
          renderInput={(params) => (
            <StyledTextField
              {...params}
              placeholder="Select your booking date"
              variant="outlined"
            />
          )}
        />
      </LocalizationProvider>
      
      {selectedDate && (
        <AvailableDatesInfo
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Date available for booking!</span>
        </AvailableDatesInfo>
      )}
    </DatePickerContainer>
  );
};

export default AlseDatePicker; 