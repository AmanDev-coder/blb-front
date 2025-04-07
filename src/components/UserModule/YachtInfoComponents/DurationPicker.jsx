import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled components for the duration picker
const DurationContainer = styled.div`
  width: 100%;
`;

const DurationOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const DurationOption = styled(motion.button)`
  background-color: ${({ isSelected }) => isSelected ? '#3b82f6' : 'white'};
  color: ${({ isSelected }) => isSelected ? 'white' : '#1e293b'};
  border: 1px solid ${({ isSelected }) => isSelected ? '#3b82f6' : '#e2e8f0'};
  border-radius: 0.75rem;
  padding: 0.75rem 0;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ isSelected }) => isSelected ? '#3b82f6' : '#94a3b8'};
    background-color: ${({ isSelected }) => isSelected ? '#2563eb' : '#f8fafc'};
  }
`;

const CustomDurationInput = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
`;

const CustomInput = styled.input`
  flex: 1;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
  }
  
  /* Hide spinner buttons */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  /* Firefox */
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const InputSuffix = styled.span`
  padding: 0 1rem;
  color: #64748b;
  font-weight: 500;
  background-color: #f8fafc;
  height: 100%;
  display: flex;
  align-items: center;
`;

// Duration options
const DURATIONS = [
  { value: 1, label: '1 Day' },
  { value: 2, label: '2 Days' },
  { value: 3, label: '3 Days' },
  { value: 7, label: '1 Week' },
  { value: 14, label: '2 Weeks' },
  { value: 30, label: '1 Month' }
];

const DurationPicker = ({ selectedDuration, setSelectedDuration }) => {
  const [customDuration, setCustomDuration] = React.useState('');
  
  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    setCustomDuration('');
  };
  
  const handleCustomDurationChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 1 && Number(value) <= 365)) {
      setCustomDuration(value);
      if (value) {
        setSelectedDuration(Number(value));
      }
    }
  };

  return (
    <DurationContainer>
      <DurationOptionsGrid>
        {DURATIONS.map(({ value, label }) => (
          <DurationOption
            key={value}
            isSelected={selectedDuration === value}
            onClick={() => handleDurationSelect(value)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {label}
          </DurationOption>
        ))}
      </DurationOptionsGrid>
      
      <CustomDurationInput>
        <CustomInput
          type="number"
          placeholder="Custom duration"
          min="1"
          max="365"
          value={customDuration}
          onChange={handleCustomDurationChange}
        />
        <InputSuffix>days</InputSuffix>
      </CustomDurationInput>
    </DurationContainer>
  );
};

export default DurationPicker; 