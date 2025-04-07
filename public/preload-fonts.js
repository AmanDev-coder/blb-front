/**
 * Preload Fonts Script
 * 
 * This script runs before the React application mounts and ensures that
 * critical fonts are loaded and ready to use immediately.
 */

(function() {
  console.log('⏳ Font preloader script initialized');
  
  // Track fonts loading progress
  const fontLoadingStatus = {
    startTime: Date.now(),
    loaded: 0,
    failed: 0,
    total: 0,
    complete: false,
    timedOut: false
  };
  
  // Define the essential fonts to preload (with multiple formats for better browser compatibility)
  const criticalFonts = [
    // Poppins Regular - TTF primary, WOFF2 fallback
    {
      family: 'Poppins',
      weight: '400',
      style: 'normal',
      urls: [
        '/fonts/poppins/Poppins-Regular.ttf',
        'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2'
      ]
    },
    // Poppins Medium - TTF primary, WOFF2 fallback
    {
      family: 'Poppins',
      weight: '500',
      style: 'normal',
      urls: [
        '/fonts/poppins/Poppins-Medium.ttf',
        'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2'
      ]
    },
    // Poppins SemiBold - TTF primary, WOFF2 fallback
    {
      family: 'Poppins',
      weight: '600',
      style: 'normal',
      urls: [
        '/fonts/poppins/Poppins-SemiBold.ttf',
        'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2'
      ]
    },
    // Work Sans Regular - WOFF2 primary, Google Fonts fallback
    {
      family: 'Work Sans',
      weight: '400',
      style: 'normal',
      urls: [
        '/fonts/worksans/WorkSans-Regular.woff2',
        'https://fonts.gstatic.com/s/worksans/v18/QGYsz_wNahGAdqQ43Rh_fKDp.woff2'
      ]
    }
  ];
  
  // Set total count for tracking
  fontLoadingStatus.total = criticalFonts.length;
  
  /**
   * Function to check if a font is loaded using native browser methods
   */
  function isFontLoaded(fontFamily) {
    if (document.fonts && document.fonts.check) {
      return document.fonts.check(`16px "${fontFamily}"`);
    }
    return false;
  }
  
  /**
   * Load a font with fallback URLs
   */
  async function loadFontWithFallbacks(fontConfig) {
    const { family, weight, style, urls } = fontConfig;
    
    // Skip if already loaded
    if (isFontLoaded(family)) {
      console.log(`✅ "${family}" font already available, skipping load`);
      return true;
    }
    
    // Try each URL in sequence until one works
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        // Create a new FontFace instance
        const font = new FontFace(family, `url(${url})`, { weight, style });
        
        // Wait for the font to load
        const loadedFont = await font.load();
        
        // Add the loaded font to the document
        document.fonts.add(loadedFont);
        
        // Log success
        console.log(`✅ Loaded "${family}" (${weight}) from ${url}`);
        return true;
      } catch (err) {
        console.warn(`⚠️ Failed to load "${family}" from ${url}: ${err.message}`);
        
        // If this is the last URL, return failure
        if (i === urls.length - 1) {
          return false;
        }
        // Otherwise, continue to next URL
      }
    }
    
    return false;
  }
  
  /**
   * Update DOM classes based on font loading status
   */
  function updateDOMClasses(status) {
    const { loaded, failed, total, timedOut } = status;
    
    // Remove any existing font loading classes
    document.documentElement.classList.remove('fonts-loading', 'fonts-loaded', 'fonts-failed', 'fonts-timeout');
    document.body.classList.remove('fonts-loading', 'fonts-loaded', 'fonts-failed', 'fonts-timeout');
    
    // Add the appropriate class
    if (timedOut) {
      document.documentElement.classList.add('fonts-timeout');
      document.body.classList.add('fonts-timeout');
    } else if (loaded === total) {
      document.documentElement.classList.add('fonts-loaded');
      document.body.classList.add('fonts-loaded');
    } else if (failed > 0) {
      document.documentElement.classList.add('fonts-failed');
      document.body.classList.add('fonts-failed');
        } else {
      document.documentElement.classList.add('fonts-loading');
      document.body.classList.add('fonts-loading');
    }
  }
  
  /**
   * Dispatch a custom event with font loading results
   */
  function dispatchFontEvent(status) {
    const event = new CustomEvent('fontsPreloaded', { 
          detail: { 
        successCount: status.loaded,
        failCount: status.failed,
        totalCount: status.total,
        duration: Date.now() - status.startTime,
        timedOut: status.timedOut,
        verified: isFontLoaded('Poppins') // Verify Poppins is truly loaded
      }
    });
    
    window.dispatchEvent(event);
    window.fontsPreloaded = true;
    window.fontsPreloadDetails = event.detail;
    
    // Log the final result
    console.log('🔤 Font preloading complete:', event.detail);
  }
  
  /**
   * Main function to preload all critical fonts
   */
  async function preloadCriticalFonts() {
    // Set the initial loading state
    updateDOMClasses(fontLoadingStatus);
    
    // Load each font in parallel and track results
    const results = await Promise.allSettled(
      criticalFonts.map(fontConfig => loadFontWithFallbacks(fontConfig))
    );
    
    // Count successes and failures
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value === true) {
        fontLoadingStatus.loaded++;
      } else {
        fontLoadingStatus.failed++;
      }
    });
    
    // Update the status
    fontLoadingStatus.complete = true;
    
    // Update DOM and dispatch event
    updateDOMClasses(fontLoadingStatus);
    dispatchFontEvent(fontLoadingStatus);
    
    // Force a final check on Poppins
    if (isFontLoaded('Poppins')) {
      console.log('🎯 Final verification confirms Poppins font is loaded and ready');
    } else {
      console.warn('⚠️ Final verification indicates Poppins font is still not loaded!');
    }
  }
  
  // Set a timeout to ensure we don't block the UI indefinitely
  const timeoutId = setTimeout(() => {
    if (!fontLoadingStatus.complete) {
      console.warn('⏱️ Font preloading timed out after 3 seconds');
      fontLoadingStatus.timedOut = true;
      updateDOMClasses(fontLoadingStatus);
      dispatchFontEvent(fontLoadingStatus);
    }
  }, 3000);
  
  // Start preloading fonts
  preloadCriticalFonts().finally(() => {
    clearTimeout(timeoutId);
  });
})(); 