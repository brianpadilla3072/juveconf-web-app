'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DrawerContextValue {
  isOpen: boolean;
  drawerData: any;
  contentRenderer: ((data: any) => ReactNode) | null;
  openDrawer: (data: any, renderer: (data: any) => ReactNode) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<any>(null);
  const [contentRenderer, setContentRenderer] = useState<((data: any) => ReactNode) | null>(null);

  const openDrawer = (data: any, renderer: (data: any) => ReactNode) => {
    setDrawerData(data);
    setContentRenderer(() => renderer);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    // Clear data after animation completes
    setTimeout(() => {
      setDrawerData(null);
      setContentRenderer(null);
    }, 300);
  };

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        drawerData,
        contentRenderer,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawerContext() {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawerContext must be used within a DrawerProvider');
  }
  return context;
}
