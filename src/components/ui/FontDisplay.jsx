import React, { useState, useEffect } from 'react';

/**
 * FontDisplay component
 * Shows which fonts are currently available in the browser
 * Useful for debugging font loading issues
 */
const FontDisplay = () => {
  const [fontInfo, setFontInfo] = useState({
    poppinsLoaded: false,
    workSansLoaded: false,
    loadedFonts: [],
    activeFont: '',
    computedFont: ''
  });
  
  useEffect(() => {
    // Check which fonts are loaded
    if (document.fonts && document.fonts.check) {
      setFontInfo(prevInfo => ({
        ...prevInfo,
        poppinsLoaded: document.fonts.check('1em Poppins'),
        workSansLoaded: document.fonts.check('1em "Work Sans"')
      }));
      
      // Get computed font for a test element
      const testEl = document.createElement('span');
      testEl.style.fontFamily = 'Poppins, sans-serif';
      testEl.textContent = 'Test';
      document.body.appendChild(testEl);
      
      const computedStyle = window.getComputedStyle(testEl);
      setFontInfo(prevInfo => ({
        ...prevInfo,
        computedFont: computedStyle.fontFamily,
        activeFont: getActiveFontName(computedStyle.fontFamily)
      }));
      
      document.body.removeChild(testEl);
      
      // Get list of loaded fonts
      if (document.fonts.forEach) {
        const loadedFontList = [];
        document.fonts.forEach(font => {
          if (font.status === 'loaded') {
            loadedFontList.push(`${font.family} (${font.weight})`);
          }
        });
        setFontInfo(prevInfo => ({
          ...prevInfo,
          loadedFonts: [...new Set(loadedFontList)] // Remove duplicates
        }));
      }
    }
  }, []);
  
  // Helper to extract the active font name from computed fontFamily
  const getActiveFontName = (fontFamilyString) => {
    // This tries to extract the first actual font name from the computed style
    if (!fontFamilyString) return 'unknown';
    
    const fontList = fontFamilyString.split(',');
    let firstFont = fontList[0].trim();
    
    // Remove quotes if present
    if (firstFont.startsWith('"') && firstFont.endsWith('"')) {
      firstFont = firstFont.slice(1, -1);
    } else if (firstFont.startsWith("'") && firstFont.endsWith("'")) {
      firstFont = firstFont.slice(1, -1);
    }
    
    return firstFont;
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      maxWidth: '350px',
      zIndex: 10000,
      fontSize: '14px',
      fontFamily: 'monospace',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Font Status</h3>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Poppins loaded:</strong> {fontInfo.poppinsLoaded ? '✅' : '❌'}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Work Sans loaded:</strong> {fontInfo.workSansLoaded ? '✅' : '❌'}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Active font:</strong> {fontInfo.activeFont}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Computed style:</strong> <span style={{ fontSize: '12px' }}>{fontInfo.computedFont}</span>
      </div>
      
      {fontInfo.loadedFonts.length > 0 && (
        <div>
          <strong>Loaded fonts:</strong>
          <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
            {fontInfo.loadedFonts.map((font, index) => (
              <li key={index} style={{ marginBottom: '3px', fontSize: '12px' }}>{font}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '12px', opacity: 0.7, fontStyle: 'italic' }}>
        This is a sample text to show the active font. The quick brown fox jumps over the lazy dog.
      </div>
    </div>
  );
};

export default FontDisplay; 