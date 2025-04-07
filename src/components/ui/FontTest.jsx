import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components for the test UI
const TestContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.98);
  z-index: 9998;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  font-family: system-ui, sans-serif !important; /* Always use system font for test UI */
`;

const TestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  padding-bottom: 10px;
`;

const TestTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  font-family: system-ui, sans-serif !important;
`;

const CloseButton = styled.button`
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: #d32f2f;
  }
`;

const TestSection = styled.div`
  margin-bottom: 30px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const SectionHeader = styled.h2`
  font-size: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-top: 0;
  font-family: system-ui, sans-serif !important;
`;

const TestRow = styled.div`
  display: flex;
  margin-bottom: 12px;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 12px;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const TestLabel = styled.div`
  width: 30%;
  font-weight: bold;
  padding-right: 10px;
  font-family: system-ui, sans-serif !important;
`;

const TestResult = styled.div`
  width: 70%;
  font-family: ${props => props.fontFamily || 'system-ui, sans-serif'} !important;
  overflow-wrap: break-word;
  color: ${props => props.success ? '#4caf50' : props.error ? '#f44336' : 'inherit'};
`;

const FontSample = styled.div`
  font-family: ${props => props.fontFamily || 'inherit'};
  font-size: ${props => props.fontSize || '16px'};
  font-weight: ${props => props.fontWeight || 'normal'};
  padding: 15px;
  margin: 10px 0;
  border: 1px dashed #ddd;
  border-radius: 4px;
  background-color: ${props => props.highlight ? '#fffde7' : '#f9f9f9'};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: ${props => 
    props.status === 'success' ? '#4caf50' : 
    props.status === 'warning' ? '#ff9800' : 
    props.status === 'error' ? '#f44336' : '#9e9e9e'};
  margin-left: 8px;
`;

const InfoText = styled.p`
  margin: 10px 0;
  color: #555;
  line-height: 1.5;
  font-family: system-ui, sans-serif !important;
`;

const RefreshButton = styled.button`
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-top: 10px;
  cursor: pointer;
  font-weight: bold;
  font-family: system-ui, sans-serif !important;
  
  &:hover {
    background: #1976d2;
  }
`;

/**
 * FontTest component for debugging font loading issues
 * This component displays various tests to verify font loading and application
 */
const FontTest = ({ onClose }) => {
  const [fontTests, setFontTests] = useState({
    // Font detection
    poppinsLoaded: false,
    workSansLoaded: false,
    
    // Computed style checks
    bodyComputedFont: '',
    testSpanComputedFont: '',
    
    // Document fonts info
    documentFontsStatus: '',
    documentFontsCount: 0,
    documentFontsList: [],
    
    // Additional info
    bodyClasses: '',
    htmlClasses: '',
    preloadedStatus: false,
    fontPreloadDetails: null,
  });
  
  const runFontTests = () => {
    // Test if fonts are available through document.fonts
    const poppinsLoaded = document.fonts.check('16px "Poppins"');
    const workSansLoaded = document.fonts.check('16px "Work Sans"');
    
    // Get computed font styles
    const getComputedFont = (element) => {
      const computedStyle = window.getComputedStyle(element);
      return computedStyle.fontFamily;
    };
    
    // Create a test span for direct testing
    const testSpan = document.createElement('span');
    testSpan.style.fontFamily = 'Poppins, sans-serif';
    testSpan.style.position = 'absolute';
    testSpan.style.left = '-9999px';
    testSpan.textContent = 'Test text';
    document.body.appendChild(testSpan);
    const testSpanComputedFont = getComputedFont(testSpan);
    document.body.removeChild(testSpan);
    
    // Get document fonts information
    let documentFontsList = [];
    let documentFontsStatus = 'loading';
    let documentFontsCount = 0;
    
    try {
      documentFontsStatus = document.fonts.status;
      documentFontsCount = document.fonts.size;
      
      // Try to get the list of loaded fonts (not fully supported in all browsers)
      try {
        document.fonts.forEach(font => {
          documentFontsList.push(`${font.family} (${font.weight} ${font.style})`);
        });
      } catch (e) {
        documentFontsList = ['Font enumeration not supported in this browser'];
      }
    } catch (e) {
      documentFontsStatus = 'error: ' + e.message;
    }
    
    // Update the state with all test results
    setFontTests({
      poppinsLoaded,
      workSansLoaded,
      bodyComputedFont: getComputedFont(document.body),
      testSpanComputedFont,
      documentFontsStatus,
      documentFontsCount,
      documentFontsList,
      bodyClasses: document.body.className,
      htmlClasses: document.documentElement.className,
      preloadedStatus: window.fontsPreloaded || false,
      fontPreloadDetails: window.fontsPreloadDetails || null,
    });
  };
  
  useEffect(() => {
    // Add a class to the body for testing font overrides
    document.body.classList.add('font-test-active');
    
    // Run tests immediately
    runFontTests();
    
    // Set up listener for font loading event
    const handleFontsPreloaded = (e) => {
      window.fontsPreloadDetails = e.detail;
      runFontTests();
    };
    
    window.addEventListener('fontsPreloaded', handleFontsPreloaded);
    
    // Listen to font loading changes
    document.fonts.ready.then(() => {
      runFontTests();
    });
    
    // Cleanup
    return () => {
      document.body.classList.remove('font-test-active');
      window.removeEventListener('fontsPreloaded', handleFontsPreloaded);
    };
  }, []);
  
  // Function to manually trigger font loading
  const forceLoadFonts = () => {
    // Load Poppins using the FontFace API
    try {
      const loadPoppins = new FontFace(
        'Poppins', 
        'url(/fonts/poppins/Poppins-Regular.ttf) format("truetype")'
      );
      
      loadPoppins.load().then(font => {
        document.fonts.add(font);
        console.log('Force-loaded Poppins font');
        runFontTests();
      });
    } catch (e) {
      console.error('Error force-loading Poppins:', e);
    }
    
    // Force some DOM updates that might trigger font recalculation
    document.body.classList.add('fonts-force-recalc');
    setTimeout(() => {
      document.body.classList.remove('fonts-force-recalc');
      runFontTests();
    }, 100);
  };
  
  // Calculate overall status
  const getOverallStatus = () => {
    const { poppinsLoaded, bodyComputedFont } = fontTests;
    
    if (poppinsLoaded && bodyComputedFont.includes('Poppins')) {
      return {
        status: 'success',
        message: 'Font loading and application successful'
      };
    } else if (poppinsLoaded) {
      return {
        status: 'warning',
        message: 'Font loaded but not properly applied'
      };
    } else {
      return {
        status: 'error',
        message: 'Font loading failed'
      };
    }
  };
  
  const overallStatus = getOverallStatus();
  
  return (
    <TestContainer>
      <TestHeader>
        <TestTitle>
          Font Loading Test Dashboard
          <StatusBadge status={overallStatus.status}>
            {overallStatus.status.toUpperCase()}
          </StatusBadge>
        </TestTitle>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </TestHeader>
      
      <TestSection>
        <SectionHeader>Overall Status</SectionHeader>
        <InfoText><strong>{overallStatus.message}</strong></InfoText>
        <TestRow>
          <TestLabel>Body Classes</TestLabel>
          <TestResult>{fontTests.bodyClasses || 'none'}</TestResult>
        </TestRow>
        <TestRow>
          <TestLabel>HTML Classes</TestLabel>
          <TestResult>{fontTests.htmlClasses || 'none'}</TestResult>
        </TestRow>
        <TestRow>
          <TestLabel>Fonts Preloaded Flag</TestLabel>
          <TestResult success={fontTests.preloadedStatus}>
            {fontTests.preloadedStatus ? 'Yes' : 'No'}
          </TestResult>
        </TestRow>
        {fontTests.fontPreloadDetails && (
          <TestRow>
            <TestLabel>Preload Details</TestLabel>
            <TestResult>
              Success: {fontTests.fontPreloadDetails.successCount}, 
              Failed: {fontTests.fontPreloadDetails.failCount}
              {fontTests.fontPreloadDetails.verified !== undefined && (
                <>, Verified: {fontTests.fontPreloadDetails.verified ? 'Yes' : 'No'}</>
              )}
              {fontTests.fontPreloadDetails.timedOut && (
                <>, Timed Out: Yes</>
              )}
            </TestResult>
          </TestRow>
        )}
        <RefreshButton onClick={runFontTests}>
          Refresh Font Status
        </RefreshButton>
        <RefreshButton onClick={forceLoadFonts}>
          Force Load Fonts
        </RefreshButton>
      </TestSection>
      
      <TestSection>
        <SectionHeader>Font Availability Test</SectionHeader>
        <TestRow>
          <TestLabel>Poppins Available</TestLabel>
          <TestResult success={fontTests.poppinsLoaded} error={!fontTests.poppinsLoaded}>
            {fontTests.poppinsLoaded ? 'Yes' : 'No'}
          </TestResult>
        </TestRow>
        <TestRow>
          <TestLabel>Work Sans Available</TestLabel>
          <TestResult success={fontTests.workSansLoaded} error={!fontTests.workSansLoaded}>
            {fontTests.workSansLoaded ? 'Yes' : 'No'}
          </TestResult>
        </TestRow>
        <TestRow>
          <TestLabel>document.fonts status</TestLabel>
          <TestResult>{fontTests.documentFontsStatus}</TestResult>
        </TestRow>
        <TestRow>
          <TestLabel>document.fonts count</TestLabel>
          <TestResult>{fontTests.documentFontsCount}</TestResult>
        </TestRow>
      </TestSection>
      
      <TestSection>
        <SectionHeader>Font Application Test</SectionHeader>
        <TestRow>
          <TestLabel>Body Computed Font</TestLabel>
          <TestResult 
            success={fontTests.bodyComputedFont.includes('Poppins')}
            error={!fontTests.bodyComputedFont.includes('Poppins')}
          >
            {fontTests.bodyComputedFont || 'none'}
          </TestResult>
        </TestRow>
        <TestRow>
          <TestLabel>Test Span Computed Font</TestLabel>
          <TestResult 
            success={fontTests.testSpanComputedFont.includes('Poppins')}
            error={!fontTests.testSpanComputedFont.includes('Poppins')}
          >
            {fontTests.testSpanComputedFont || 'none'}
          </TestResult>
        </TestRow>
      </TestSection>
      
      <TestSection>
        <SectionHeader>Font Rendering Samples</SectionHeader>
        <FontSample fontFamily="Poppins, sans-serif" highlight={true}>
          This text should be rendered in Poppins (Primary font)
        </FontSample>
        <FontSample fontFamily="'Work Sans', sans-serif">
          This text should be rendered in Work Sans (Secondary font)
        </FontSample>
        <FontSample fontFamily="'Poppins', sans-serif" fontWeight="300">
          Poppins Light (300)
        </FontSample>
        <FontSample fontFamily="'Poppins', sans-serif" fontWeight="400">
          Poppins Regular (400)
        </FontSample>
        <FontSample fontFamily="'Poppins', sans-serif" fontWeight="500">
          Poppins Medium (500)
        </FontSample>
        <FontSample fontFamily="'Poppins', sans-serif" fontWeight="600">
          Poppins SemiBold (600)
        </FontSample>
        <FontSample fontFamily="'Poppins', sans-serif" fontWeight="700">
          Poppins Bold (700)
        </FontSample>
      </TestSection>
      
      <TestSection>
        <SectionHeader>Document Font List</SectionHeader>
        {fontTests.documentFontsList.length > 0 ? (
          fontTests.documentFontsList.map((font, index) => (
            <div key={index} style={{margin: '5px 0'}}>{font}</div>
          ))
        ) : (
          <InfoText>No fonts available or browser doesn't support font enumeration</InfoText>
        )}
      </TestSection>
    </TestContainer>
  );
};

export default FontTest; 