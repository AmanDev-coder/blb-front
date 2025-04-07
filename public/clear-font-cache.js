/**
 * Clear Font Cache Script
 * 
 * This script can be used to clear font-related caches and force a reload
 * of all fonts. Run this if you're experiencing font loading issues.
 */
(function() {
  console.log('🧹 Starting font cache cleanup...');
  
  // Clear localStorage items related to fonts
  try {
    const fontRelatedKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
          key.includes('font') || 
          key.includes('Font') || 
          key.includes('typeface') ||
          key.includes('wf-') || // Web font related
          key.includes('fs-')   // Font style related
        )) {
        fontRelatedKeys.push(key);
      }
    }
    
    // Remove all font-related items
    fontRelatedKeys.forEach(key => {
      console.log(`  - Removing localStorage item: ${key}`);
      localStorage.removeItem(key);
    });
    
    console.log(`✅ Cleared ${fontRelatedKeys.length} font-related localStorage items`);
  } catch (e) {
    console.error('❌ Error clearing localStorage:', e);
  }
  
  // Clear any custom font-related classes
  document.documentElement.classList.remove(
    'fonts-loaded', 'fonts-loading', 'fonts-failed', 'fonts-timeout',
    'wf-loading', 'wf-active', 'wf-inactive', 'wf-timeout'
  );
  
  document.body.classList.remove(
    'fonts-loaded', 'fonts-loading', 'fonts-failed', 'fonts-timeout',
    'wf-loading', 'wf-active', 'wf-inactive', 'wf-timeout'
  );
  
  // Reset any global font flags
  window.fontsPreloaded = false;
  
  // Try to clear font cache if browser supports it
    if (document.fonts && document.fonts.clear) {
      try {
        document.fonts.clear();
      console.log('✅ Successfully cleared document.fonts cache');
    } catch (e) {
      console.error('❌ Error clearing document.fonts:', e);
    }
  } else if (document.fonts) {
    console.log('⚠️ This browser doesn\'t support document.fonts.clear()');
  }
  
  // Create a helper function to force the browser to reload a font
  window.reloadFont = function(fontFamily, url) {
    if (!window.FontFace) {
      console.error('❌ FontFace API not supported in this browser');
      return Promise.reject('FontFace API not supported');
    }
    
    return new Promise((resolve, reject) => {
      console.log(`🔄 Attempting to reload font: ${fontFamily} from ${url}`);
      
      // Create and load the font
      const font = new FontFace(fontFamily, `url(${url})`);
      font.load()
        .then(loadedFont => {
          // Add the loaded font to the document
          document.fonts.add(loadedFont);
          console.log(`✅ Successfully reloaded font: ${fontFamily}`);
          resolve(true);
        })
        .catch(err => {
          console.error(`❌ Failed to reload font ${fontFamily}:`, err);
          reject(err);
        });
    });
  };
  
  // Function to manually reload critical fonts
  window.reloadAllFonts = function() {
    const criticalFonts = [
      { family: 'Poppins', url: '/fonts/poppins/Poppins-Regular.ttf' },
      { family: 'Work Sans', url: '/fonts/worksans/WorkSans-Regular.woff2' }
    ];
    
    return Promise.allSettled(
      criticalFonts.map(font => window.reloadFont(font.family, font.url))
    ).then(results => {
      const successful = results.filter(r => r.status === 'fulfilled').length;
      console.log(`📊 Font reload complete: ${successful}/${criticalFonts.length} successful`);
      
      // Force the page to refresh font styling by adding and removing a class
      document.body.classList.add('fonts-refreshed');
      setTimeout(() => {
        document.body.classList.remove('fonts-refreshed');
      }, 100);
      
      return results;
    });
  };
  
  console.log('🧹 Font cache cleanup complete! Use window.reloadAllFonts() to manually reload fonts.');
  
  // Create UI for the user to clear fonts on demand
  const createClearFontButton = () => {
    // Only create the button if it doesn't already exist
    if (document.getElementById('clear-font-cache-btn')) {
      return;
    }
    
    const btn = document.createElement('button');
    btn.id = 'clear-font-cache-btn';
    btn.innerText = 'Reload Fonts';
    btn.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      z-index: 9999;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    
    btn.addEventListener('click', () => {
      window.reloadAllFonts().then(() => {
        btn.innerText = 'Fonts Reloaded!';
        setTimeout(() => {
          btn.innerText = 'Reload Fonts';
        }, 2000);
      });
    });
    
    document.body.appendChild(btn);
  };
  
  // Wait for the DOM to be fully loaded before adding the button
  if (document.readyState === 'complete') {
    createClearFontButton();
  } else {
    window.addEventListener('load', createClearFontButton);
  }
})(); 