import React, { useState, useEffect } from 'react';

/**
 * FontLoader Component
 * 
 * This component checks if fonts have been preloaded by the preload-fonts.js script
 * and integrates with the preloading process.
 * 
 * It ensures that the application only renders when fonts are ready (or after a timeout).
 */
const FontLoader = ({ children }) => {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    // If fonts are already preloaded, we can render immediately
    if (window.fontsPreloaded === true) {
      console.log('✅ FontLoader: Fonts were already preloaded, rendering immediately');
      setFontsReady(true);
      return;
    }

    console.log('🔄 FontLoader: Waiting for fonts to be preloaded...');
    
    // Create a function to set fonts as ready
    const handleFontsPreloaded = (event) => {
      const details = event?.detail || {};
      console.log('📣 FontLoader: Received fontsPreloaded event', details);
      
      // Update our state to allow rendering
      setFontsReady(true);
    };
    
    // Listen for the fontsPreloaded event from the preload script
    window.addEventListener('fontsPreloaded', handleFontsPreloaded);
    
    // Fallback: Check if document.fonts.ready resolves
    if (document.fonts) {
      document.fonts.ready.then(() => {
        // This might resolve even if our specific fonts aren't loaded,
        // but it's a good backup
        if (!fontsReady) {
          console.log('📚 FontLoader: document.fonts.ready resolved');
          setFontsReady(true);
        }
      });
    }
    
    // Fallback: Set a timeout to prevent indefinite loading
      const timeoutId = setTimeout(() => {
      if (!fontsReady) {
        console.warn('⏱️ FontLoader: Timeout reached, rendering with fallback fonts');
        setFontsReady(true);
      }
    }, 2000); // 2 second max wait time
      
      // Cleanup
      return () => {
      window.removeEventListener('fontsPreloaded', handleFontsPreloaded);
        clearTimeout(timeoutId);
      };
  }, [fontsReady]);
  
  // If fonts aren't ready yet, return a loading indicator or null
  // But this is just a safeguard, as the preload script should handle
  // the actual font loading
  if (!fontsReady) {
    return null; // Or a simple loading spinner if preferred
  }
  
  // Render children once fonts are ready
  return <>{children}</>;
};

export default FontLoader; 