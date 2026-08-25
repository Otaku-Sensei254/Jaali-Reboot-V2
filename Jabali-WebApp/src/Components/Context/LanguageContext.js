import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    setLanguage(localStorage.getItem('jabali-language') || 'en');
  }, []);

  const toggleLanguage = () => {
    const nextLanguage = language === 'en' ? 'sw' : 'en';
    setLanguage(nextLanguage);
    localStorage.setItem('jabali-language', nextLanguage);
  };

  return <LanguageContext.Provider value={{ language, toggleLanguage }}>{children}</LanguageContext.Provider>;
};
