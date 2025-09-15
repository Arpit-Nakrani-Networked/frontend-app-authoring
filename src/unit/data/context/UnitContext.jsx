import {
  createContext, useContext, useState, useEffect,
} from 'react';

// Create context
const UnitContext = createContext(undefined);

// Provider component
export const UnitContextWrapper = ({ children, updateComponent,handleDeleteComponentBlock,componentBlocks }) => (
  <UnitContext.Provider value={{ updateComponent,handleDeleteComponentBlock ,componentBlocks}}>
    {children}
  </UnitContext.Provider>
);

// Hook to use the context
export const useUnitContext = () => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error('useUnitContext must be used within an ArrayProvider');
  }
  return context;
};
