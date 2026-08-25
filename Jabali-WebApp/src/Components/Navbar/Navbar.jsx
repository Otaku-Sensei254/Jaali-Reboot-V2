// src/Components/Navbar/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useChild } from '../Context/useChild';
import ThemeToggle from '../Theme/ThemeToggle';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { userRole, userName, logout } = useAuth();
  const { selectedChild } = useChild();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { key: 'home', label: 'Home', path: '/home' },
    { key: 'learning', label: 'Learning', path: '/learning' },
    { key: 'music', label: 'Music', path: '/music' },
    { key: 'profiles', label: 'Profiles', path: '/profiles' },
    { key: 'games', label: 'Games', path: '/games' },
    { key: 'dashboard', label: 'Dashboard', path: '/dashboard' }
  ];

  const getAvatarLetter = () => {
    if (userName) {
      return userName.charAt(0).toUpperCase();
    }
    return null; // Don't show avatar if no username
  };

  const getDisplayName = () => {
    if (userName) {
      return userName;
    }
    return null; // Don't show display name if no username
  };
  const getChildName = () => (selectedChild ? selectedChild.name : 'No Child Selected');  
  const handleLogoutClick = () => setShowLogoutConfirm(true);
  
  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/auth');
  };
  
  const cancelLogout = () => setShowLogoutConfirm(false);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    // Prevent body scroll when mobile menu is open
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/home" className="brand-link">
            <h1 className="brand">Jabali</h1>
          </Link>
        </div>

        <div 
          className={`nav-center ${menuOpen ? 'open' : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`nav-item ${pathname === item.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <div 
            className="menu-icon" 
            onClick={() => setMenuOpen(!menuOpen)}
            role="button"
            tabIndex={0}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMenuOpen(!menuOpen);
              }
            }}
          >
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </div>

          <ThemeToggle />

          {userName && (
            <div className="user-section">
              <span className="username">{getDisplayName()}</span>
              <div className="user-avatar" onClick={handleLogoutClick}>
                <span className="avatar-icon">{getAvatarLetter()}</span>
              </div>

              {showLogoutConfirm && (
                <div className="logout-dropdown">
                  <div className="logout-confirm">
                    <p>Are you sure you want to logout?</p>
                    <div className="logout-actions">
                      <button className="logout-confirm-btn" onClick={confirmLogout}>
                        Yes, Logout
                      </button>
                      <button className="logout-cancel-btn" onClick={cancelLogout}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {showLogoutConfirm && <div className="logout-overlay" onClick={cancelLogout}></div>}
    </>
  );
};

export default Navbar;