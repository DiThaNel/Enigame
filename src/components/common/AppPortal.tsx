'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const AppPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const target = document.getElementById('enigame-device-frame') || document.body;
  return createPortal(children, target);
};