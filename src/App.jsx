import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { ToastContainer } from "react-toastify";
import { AllRoutes } from "./AllRoutes/AllRoutes";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from './styles/ThemeProvider';

// Import FontDisplay in development mode only
const FontDisplay = process.env.NODE_ENV === 'development' 
  ? React.lazy(() => import('./components/ui/FontDisplay'))
  : () => null;

// Import FontTest in development mode only
const FontTest = process.env.NODE_ENV === 'development'
  ? React.lazy(() => import('./components/ui/FontTest'))
  : () => null;

// Global styles to hide the scrollbar
const GlobalStyle = createGlobalStyle`
  * {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE & Edge */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  }
`;

const MainContent = styled.div`
  margin-top: ${({ searchPerformed }) => (searchPerformed ? "4rem" : "0")};
  overflow-y: auto; /* Allow vertical scrolling */
`;

// Button to toggle the font test page
const TestButton = styled.button`
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  z-index: 9998;
  
  &:hover {
    background-color: #0284c7;
  }
`;

export default function App() {
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showFontTest, setShowFontTest] = useState(false);

  const handleSearch = (query) => {
    console.log("Search query:", query); // Log the search query
    // setLoading(true);
    // const filteredYachts = yachts.filter(yacht =>
    //   yacht.location.toLowerCase().includes(query.toLowerCase())
    // );
    // console.log("Filtered yachts:", filteredYachts); // Log the filtered results
    // setSearchResults(filteredYachts);
    // setSearchPerformed(true);
    // setLoading(false);
  };

  const toggleFontTest = () => {
    setShowFontTest(!showFontTest);
  };

  return (
    <ThemeProvider>
      <GlobalStyle />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* {process.env.NODE_ENV === 'development' && (
        <TestButton onClick={toggleFontTest}>
          {showFontTest ? 'Hide Font Test' : 'Show Font Test'}
        </TestButton>
      )}
      
      {showFontTest && process.env.NODE_ENV === 'development' && (
        <React.Suspense fallback={<div>Loading Font Test...</div>}>
          <FontTest />
        </React.Suspense>
      )} */}
      
      <Router>
        <MainContent searchPerformed={searchPerformed}>
          <AllRoutes onSearch={handleSearch} />
        </MainContent>
      </Router>
      
      {/* Show FontDisplay in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <React.Suspense fallback={null}>
          {/* <FontDisplay /> */}
        </React.Suspense>
      )}
    </ThemeProvider>
  );
}
