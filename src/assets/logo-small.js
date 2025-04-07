// Simple SVG logo for Book Luxury Boat
export const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#f0f0f0" />
  <path d="M50,20 Q70,20 70,40 Q70,60 50,60 Q30,60 30,40 Q30,20 50,20 Z" fill="#0066cc" />
  <path d="M50,35 L70,75 L30,75 Z" fill="#0066cc" />
  <path d="M40,30 L60,30 L60,35 L40,35 Z" fill="white" />
</svg>`;

// Convert SVG to data URL
export const logoDataUrl = `data:image/svg+xml;base64,${btoa(logoSvg)}`;

export default logoDataUrl; 