// src/Components/Context/ChildContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { childrenAPI } from "../services/api";
import { useAuth } from "./AuthContext";

export const ChildContext = createContext();

export const ChildProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [childProfiles, setChildProfiles] = useState([]);
  const [selectedChild, setSelectedChildState] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchChildren = useCallback(async () => {
    setLoading(true);
    try {
      const response = await childrenAPI.getAll();
      setChildProfiles(response.data);
    } catch (error) {
      console.error('Failed to fetch children:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchChildren();
      return;
    }

    setChildProfiles([]);
    setSelectedChildState(null);
    setLoading(false);
  }, [fetchChildren, isLoggedIn]);

  const addChild = async (childData) => {
    try {
      const response = await childrenAPI.create(childData);
      setChildProfiles((prev) => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Failed to create child:', error);
      throw error;
    }
  };

  const updateChild = async (id, childData) => {
    try {
      const response = await childrenAPI.update(id, childData);
      setChildProfiles((prev) => prev.map((child) => (child.id === id ? response.data : child)));
      if (selectedChild?.id === id) {
        setSelectedChildState(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Failed to update child:', error);
      throw error;
    }
  };

  const removeChild = async (id) => {
    try {
      await childrenAPI.delete(id);
      setChildProfiles((prev) => prev.filter((child) => child.id !== id));
      if (selectedChild?.id === id) {
        setSelectedChildState(null);
      }
    } catch (error) {
      console.error('Failed to delete child:', error);
      throw error;
    }
  };

  const selectChild = (child) => {
    setSelectedChildState(child);
  };

  const setSelectedChild = (child) => {
    setSelectedChildState(child);
  };

  const clearSelectedChild = () => {
    setSelectedChildState(null);
  };

  return (
    <ChildContext.Provider value={{
      childProfiles,
      selectedChild,
      loading,
      addChild,
      updateChild,
      removeChild,
      selectChild,
      setSelectedChild,
      clearSelectedChild,
      refreshChildren: fetchChildren,
    }}>
      {children}
    </ChildContext.Provider>
  );
};
