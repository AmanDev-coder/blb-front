import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "react-rainbow-components";
import { DemoContainer ,DemoItem } from "@mui/x-date-pickers/internals/demo";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import dayjs from "dayjs";
import DurationPicker from "./DurationModal"; // Import the duration picker component

// import DatePicker from 'react-datepicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// import Testimonials from "../components/Testimonials";


const customTheme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            backgroundColor: "#fff", // White background for input
            borderRadius: "8px", // Rounded corners
            width: "180px", // Ensure consistent width for date picker
            "& .MuiInputLabel-root": {
              color: "#000", // Fixed label color
            },
            "& .MuiInputBase-input": {
              padding: "10px", // Padding inside the input
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "8px", // Rounded corners for the border
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ccc", // Border color
              color: "#000",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000", // Border color on hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000", // Border color on focus
            },
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: "#1565c0", // Blue color for selected date
              color: "#fff", // White text for selected date
            },
            "&:hover": {
              backgroundColor: "#1565c0", // Blue background on hover
              color: "#fff", // White text on hover
            },
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            "& .MuiInputLabel-root": {
              top: "50%", // Fix label position
              transform: "none", // Prevent label from floating
            },
          },
        },
      },
    },
  });
  
  const BookingContainer = styled.div`
    background-color:#022a59;
    border: 1px solid gray;
    border-color: #022a59;
    border-radius: 10px;
    padding: 15px;
    // width: 95%;
    // max-width: 600px;
    display: flex;
    gap: 10px;
    align-items: center;
    justifiy-content:center;
    margin-top: 20px;
  `;
  
   export const BookingSelection = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
  
    const [displayText, setDisplayText] = useState("Select Date");
    const today = new Date();
  
    return (
      <BookingContainer>
        <ThemeProvider theme={customTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      
        <DemoItem>
        <DatePicker />
  
        </DemoItem>
       
       
      </LocalizationProvider>
        </ThemeProvider>
      
        {/* Duration Selection Box */}
        <DemoItem>
        <DurationPicker />
  
        </DemoItem>
      </BookingContainer>
    );
  };