# Font Loading System Documentation

This document provides a comprehensive guide to the font loading system implemented in this application. The system is designed to ensure reliable font loading and application across the entire site.

## Architecture Overview

Our font loading system consists of multiple layers working together:

1. **HTML Preloading** - Using `<link rel="preload">` tags in the HTML `<head>` to prioritize font loading
2. **JavaScript Font Preloader** - A script that actively loads fonts before the app renders
3. **FontLoader Component** - A React component that manages font loading status
4. **CSS Font Declarations** - Multiple font-face declarations and class-based styling
5. **Font Override Styles** - Aggressive CSS to ensure fonts are applied consistently
6. **Fallback System** - Gracefully degrades to system fonts when necessary

## Flow of Font Loading

1. When the page loads, the browser processes the `<link rel="preload">` tags to start loading fonts
2. The inline font declaration in `<style>` provides immediate access to the primary font
3. The `clear-font-cache.js` script runs first, providing utilities to clear font caches
4. The `preload-fonts.js` script actively loads all required fonts using the FontFace API
5. The FontLoader React component waits for the fonts to be ready before rendering content
6. CSS styles are applied based on the loading status (loaded, failed, timeout)

## CSS Classes & Their Meanings

The font loading system uses the following classes to manage font styling:

- `fonts-loading` - Applied during the font loading process
- `fonts-loaded` - Applied when fonts have successfully loaded
- `fonts-failed` - Applied when font loading has failed
- `fonts-timeout` - Applied when font loading takes too long
- `fonts-refreshed` - Temporarily applied when fonts are manually reloaded

## Debugging Tools

To help diagnose font loading issues, the system provides several debugging tools:

1. **Font Test Dashboard** - A component (`FontTest.jsx`) that shows detailed font status
2. **Font Reload Button** - Added by `clear-font-cache.js` to manually reload fonts
3. **Console Logging** - Extensive console logging to track the font loading process
4. **Font Status Event** - A `fontsPreloaded` event with detailed info about the process

## Font Files & Formats

The application uses the following font families and formats:

- **Poppins** (Primary font)
  - Available in TTF format
  - Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
  
- **Work Sans** (Secondary font)
  - Available in WOFF2 format
  - Weights: 300 (Light), 400 (Regular), 600 (SemiBold), 700 (Bold)

## Implementation Details

### HTML Preloading

```html
<link rel="preload" href="/fonts/poppins/Poppins-Regular.ttf" as="font" type="font/ttf" crossorigin>
```

### Font Face Declarations

```css
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/poppins/Poppins-Regular.ttf') format('truetype');
}
```

### JavaScript Font Loading

```javascript
const font = new FontFace('Poppins', 'url(/fonts/poppins/Poppins-Regular.ttf)');
font.load().then(loadedFont => {
  document.fonts.add(loadedFont);
});
```

### CSS Font Application

```scss
html.fonts-loaded,
body.fonts-loaded {
  :root {
    --font-family-primary: "Poppins", sans-serif;
  }
  
  &, * {
    font-family: "Poppins", sans-serif;
  }
}
```

## Troubleshooting

If fonts aren't loading properly:

1. **Check the console for errors** - Look for any errors related to font loading
2. **Open the Font Test Dashboard** - It shows detailed information about the font status
3. **Use the Reload Fonts button** - Added to the bottom-right corner of the page
4. **Clear browser cache** - Fonts might be cached incorrectly
5. **Verify font files exist** - Ensure all font files are in the correct location

## How to Test Font Loading

1. Open the application in the browser
2. Open DevTools and check the Console for font loading messages
3. Click the "Font Test" button to open the test dashboard
4. Check the "Overall Status" section to see if fonts loaded successfully
5. Use the "Force Load Fonts" button to attempt loading fonts again if needed

## Best Practices

1. **Always include a fallback font stack** - Ensure the application looks acceptable even with system fonts
2. **Use font-display: swap** - To prevent blocking rendering while fonts load
3. **Minimize font weights** - Only include the weights actually used in the design
4. **Preload critical fonts only** - Too many preload directives can harm performance

## Future Improvements

1. **Font Subsetting** - Reduce font file size by including only the characters needed
2. **Variable Fonts** - Consider using variable fonts to reduce the number of font files
3. **Local Font Storage** - Use localStorage or IndexedDB to cache fonts after first load
4. **User Preferences** - Allow users to choose their preferred font or font size 