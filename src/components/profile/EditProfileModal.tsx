'use client';

import React from 'react';
import { useEnigameStore } from '@/store/useEnigameStore';
import { EditProfilePage } from './EditProfilePage';

export { EditProfilePage };

export const EditProfileModal: React.FC = () => {
  const { isEditProfileOpen, setEditProfileOpen, profileViewStep } = useEnigameStore();

  // If already rendered as a page in ProfileView, don't double render as overlay
  if (profileViewStep === 'edit-profile') return null;
  if (!isEditProfileOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] bg-[#F4F6FB] flex flex-col animate-modal-screen overflow-hidden">
      <EditProfilePage onBack={() => setEditProfileOpen(false)} />
    </div>
  );
};