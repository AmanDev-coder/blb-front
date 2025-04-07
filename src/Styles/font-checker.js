/**
 * Font Checker Utility
 * This file contains functions to check if fonts are properly loaded
 */

/**
 * Checks if a specific font is loaded and available
 * @param {string} fontName - The name of the font to check
 * @returns {Promise<boolean>} - Promise that resolves to true if font is loaded, false otherwise
 */
export const isFontLoaded = (fontName) => {
  return new Promise((resolve) => {
    // If the browser doesn't support document.fonts, we can't check
    if (!document.fonts || !document.fonts.check) {
      console.warn('Font loading API not supported in this browser');
      resolve(false);
      return;
    }

    // Check if the font is loaded
    if (document.fonts.check(`1em "${fontName}"`)) {
      console.log(`${fontName} is already loaded`);
      resolve(true);
      return;
    }

    // Try to load the font
    document.fonts.ready.then(() => {
      const isLoaded = document.fonts.check(`1em "${fontName}"`);
      console.log(`${fontName} loaded: ${isLoaded}`);
      resolve(isLoaded);
    });
  });
};

/**
 * Shows a notification if Poppins font isn't loaded
 * Call this in your app entry point
 */
export const checkPoppinsFont = async () => {
  const isPoppinsLoaded = await isFontLoaded('Poppins');
  
  if (!isPoppinsLoaded) {
    console.error('⚠️ Poppins font is not loaded! Your app may use fallback fonts instead.');
    
    // Optional: Create a visual indicator for development
    if (process.env.NODE_ENV === 'development') {
      const alertEl = document.createElement('div');
      alertEl.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
        z-index: 9999;
        font-family: system-ui, sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      `;
      alertEl.textContent = 'Poppins font failed to load!';
      document.body.appendChild(alertEl);
      
      // Remove after 10 seconds
      setTimeout(() => alertEl.remove(), 10000);
    }
  }
};

/**
 * List all loaded fonts in the document
 * Useful for debugging
 */
export const listLoadedFonts = () => {
  if (!document.fonts || !document.fonts.forEach) {
    console.warn('Font loading API not supported in this browser');
    return [];
  }
  
  const loadedFonts = [];
  document.fonts.forEach(font => {
    if (font.status === 'loaded') {
      loadedFonts.push({
        family: font.family,
        style: font.style,
        weight: font.weight
      });
    }
  });
  
  console.table(loadedFonts);
  return loadedFonts;
}; 