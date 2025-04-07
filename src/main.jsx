import { createRoot } from 'react-dom/client'
// First import the critical font definitions only
import './Styles/local-fonts.css';
// Import FontLoader component to manage font loading centrally
import FontLoader from './Styles/FontLoader';

// Then import other stylesheets
import './Styles/index.css'
import './Styles/globals.css';
// Import the font override stylesheet
import './Styles/font-override.scss';

import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './Redux/Store.js'

// Function to log font loading status - helpful for debugging
const logFontStatus = () => {
  // Check if Poppins is loaded
  const poppinsLoaded = document.fonts && document.fonts.check('16px "Poppins"');
  // Check if Work Sans is loaded
  const workSansLoaded = document.fonts && document.fonts.check('16px "Work Sans"');
  
  console.log(`
    📊 Font Status at App Mount:
    - Poppins loaded: ${poppinsLoaded ? '✅' : '❌'}
    - Work Sans loaded: ${workSansLoaded ? '✅' : '❌'}
    - document.fonts.status: ${document.fonts?.status || 'N/A'}
    - document.fonts.size: ${document.fonts?.size || 'N/A'}
    - window.fontsPreloaded: ${window.fontsPreloaded ? '✅' : '❌'}
    - Body classes: ${document.body.className}
    - HTML classes: ${document.documentElement.className}
  `);
};

// Log font status on app mount
logFontStatus();

// Create root for React to render into
const root = createRoot(document.getElementById('root'));

// Render with FontLoader to ensure fonts are loaded
root.render(
  <Provider store={store}>
    <FontLoader>
      <App />
    </FontLoader>
  </Provider>
);
