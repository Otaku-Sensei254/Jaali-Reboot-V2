// src/Components/Context/useChild.js
import { useContext } from 'react';
import { ChildContext } from './ChildContext';

export const useChild = () => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
};