// src/Components/Sidebar/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useChild } from '../Context/useChild';
import { useLanguage } from '../Context/LanguageContext';
import {
  FiHome,
  FiBook,
  FiMusic,
  FiGrid,
  FiBarChart2,
  FiUsers,
  FiLogOut,
  FiX,
} from 'react-icons/fi';

const navSections = [
  {
    label: 'Explore',
    items: [
      { to: '/app', icon: <FiHome />, label: 'Home' },
      { to: '/app/learning', icon: <FiBook />, label: 'Learning' },
      { to: '/app/music', icon: <FiMusic />, label: 'Music' },
      { to: '/app/games', icon: <FiGrid />, label: 'Games' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { to: '/app/dashboard', icon: <FiBarChart2 />, label: 'Dashboard' },
      { to: '/app/profiles', icon: <FiUsers />, label: 'Profiles' },
    ],
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();
  const { userName, logout } = useAuth();
  const { selectedChild } = useChild();
  const { language } = useLanguage();
  const isSwahili = language === 'sw';
  const translations = isSwahili ? {
    Explore: 'Gundua', Manage: 'Simamia', Home: 'Mwanzo', Learning: 'Kujifunza', Music: 'Muziki', Games: 'Michezo', Dashboard: 'Maendeleo', Profiles: 'Wasifu', signOut: 'Ondoka', guest: 'Mgeni', noChild: 'Hakuna mtoto aliyechaguliwa',
  } : { signOut: 'Sign Out', guest: 'Guest User', noChild: 'No child selected' };

  const getInitial = () =>
    userName ? userName.charAt(0).toUpperCase() : 'J';

  const isActive = (to) => {
    if (to === '/app') return pathname === '/app' || pathname === '/app/';
    return pathname.startsWith(to);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`app-sidebar ${isOpen ? 'open' : ''}`}
        aria-label="Main navigation"
      >
        {/* ─ Header ─ */}
        <div className="sidebar-header">
          <Link to="/app" className="sidebar-brand" onClick={onClose}>
            <div className="sidebar-logo">J</div>
            <span className="sidebar-brand-name">Jabali</span>
          </Link>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <FiX />
          </button>
        </div>

        {/* ─ Nav ─ */}
        <nav className="sidebar-nav">
          {navSections.map((section) => (
            <div key={section.label}>
              <div className="sidebar-section-label">{translations[section.label] || section.label}</div>
              {section.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`sidebar-link ${isActive(item.to) ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  {translations[item.label] || item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* ─ Footer ─ */}
        <div className="sidebar-footer">
          <button
            className="sidebar-link sidebar-logout"
            onClick={handleLogout}
          >
            <span className="sidebar-link-icon"><FiLogOut /></span>
            {translations.signOut}
          </button>
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitial()}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name truncate">
                {userName || translations.guest}
              </div>
              <div className="sidebar-user-role truncate">
                {selectedChild ? `👶 ${selectedChild.name}` : translations.noChild}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
