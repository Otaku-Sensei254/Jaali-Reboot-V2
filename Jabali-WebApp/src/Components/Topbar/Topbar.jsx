// src/Components/Topbar/Topbar.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useChild } from '../Context/useChild';
import { useTheme } from '../Context/ThemeContext';
import { useLanguage } from '../Context/LanguageContext';
import { FiMenu, FiSun, FiMoon, FiUser } from 'react-icons/fi';

const pageTitles = {
  '/app': 'Home',
  '/app/': 'Home',
  '/app/learning': 'Learning',
  '/app/music': 'Music & Melodies',
  '/app/games': 'Games',
  '/app/dashboard': 'Progress Dashboard',
  '/app/profiles': 'Child Profiles',
};

const swahiliPageTitles = {
  '/app': 'Mwanzo',
  '/app/': 'Mwanzo',
  '/app/learning': 'Kujifunza',
  '/app/music': 'Muziki na Midundo',
  '/app/games': 'Michezo',
  '/app/dashboard': 'Maendeleo',
  '/app/profiles': 'Wasifu wa Watoto',
};

const Topbar = ({ onMenuOpen }) => {
  const { pathname } = useLocation();
  const { selectedChild } = useChild();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  const title = (language === 'sw' ? swahiliPageTitles : pageTitles)[pathname] || 'Jabali';

  return (
    <header className="app-topbar" role="banner">
      <button
        className="hamburger-btn"
        onClick={onMenuOpen}
        aria-label="Open navigation menu"
        aria-expanded={false}
      >
        <FiMenu size={20} />
      </button>

      <h1 className="topbar-title">{title}</h1>

      <div className="topbar-actions">
        {selectedChild && (
          <div className="topbar-child-badge" aria-label={`Active profile: ${selectedChild.name}`}>
            <FiUser size={12} />
            {selectedChild.name}
          </div>
        )}

        <button
          className="language-toggle-btn"
          onClick={toggleLanguage}
          aria-label={language === 'en' ? 'Switch to Kiswahili' : 'Badili kwa Kiingereza'}
          title={language === 'en' ? 'Kiswahili' : 'English'}
        >
          {language === 'en' ? 'SW' : 'EN'}
        </button>

        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <FiMoon size={17} /> : <FiSun size={17} />}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
