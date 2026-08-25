export const themeConfig = {
  light: {
    name: 'light',
    colors: {
      primary: '#5C7F9D',        // Soft, calming slate-blue
      secondary: '#8FA89B',      // Soothing sage green
      background: '#F9F8F5',     // Glare-reducing soft cream
      surface: '#FFFFFF',        // Pure white surface (soft contrast)
      text: '#2E3538',           // Warm dark charcoal (no harsh black)
      textSecondary: '#647078',  // Soft medium grey-blue
      border: '#E2E6E9',         // Gentle grey-blue border
      error: '#D4837A',          // Muted coral/terracotta (avoiding bright scary red)
      success: '#769B7E'         // Muted moss/sage green (avoiding bright neon green)
    },
    typography: {
      fontFamily: '"Poppins", "Inter", "Arial", sans-serif'
    },
    spacing: {
      small: '8px',
      medium: '16px',
      large: '24px'
    },
    borderRadius: '16px'         // Calmer rounded corners
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#9ABCD3',        // Soft, pale blue-grey
      secondary: '#B8CBBD',      // Gentle pale sage green
      background: '#1E2224',     // Comfortable dark slate (prevents stark dark contrast)
      surface: '#282E30',        // Deep warm slate surface
      text: '#E2E7E9',           // Soothing off-white/light grey (avoiding blinding white text)
      textSecondary: '#9CB1BC',  // Muted grey-blue for secondary text
      border: '#3A4448',         // Soft dark grey-blue border
      error: '#E59A93',          // Muted coral/rose
      success: '#98BAA0'         // Pale sage/moss green
    },
    typography: {
      fontFamily: '"Poppins", "Inter", "Arial", sans-serif'
    },
    spacing: {
      small: '8px',
      medium: '16px',
      large: '24px'
    },
    borderRadius: '16px'         // Calmer rounded corners
  }
};
