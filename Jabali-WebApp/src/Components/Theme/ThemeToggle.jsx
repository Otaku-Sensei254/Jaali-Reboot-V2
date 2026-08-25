import React from 'react';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { useTheme } from '../Context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, currentTheme } = useTheme();

  const styles = {
    button: {
      backgroundColor: currentTheme.colors.surface,
      color: currentTheme.colors.text,
      border: `2px solid ${currentTheme.colors.border}`,
      borderRadius: '50%',
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: theme === 'light' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(255,255,255,0.1)',
    },
    icon: { fontSize: '1.2rem' }
  };

  return (
    <button style={styles.button} onClick={toggleTheme}>
      {theme === 'light' ? (
        <BsMoonStarsFill style={styles.icon} />
      ) : (
        <BsSunFill style={styles.icon} />
      )}
    </button>
  );
};

export default ThemeToggle;
