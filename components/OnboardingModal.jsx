'use client';
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';

export default function OnboardingModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(!user?.profileCompleted);
  const router = useRouter();

  const handleComplete = async () => {
    try {
      await api.put('/users/profile', { profileCompleted: true });
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to complete onboarding');
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow max-w-lg w-full">
          <Dialog.Title className="text-2xl font-bold text-gray-800">Welcome to Clone!</Dialog.Title>
          <Dialog.Description className="mt-2 text-gray-600">
            Let’s set up your provider profile to start offering services.
          </Dialog.Description>
          <div className="mt-4 space-y-4">
            <p>1. Add a profile picture and bio in your <a href="/profile/edit" className="text-primary hover:underline">Profile</a>.</p>
            <p>2. Create your first service in <a href="/services/create" className="text-primary hover:underline">Services</a>.</p>
            <p>3. Add portfolio items to showcase your work.</p>
          </div>
          <button
            onClick={handleComplete}
            className="mt-6 bg-primary text-white py-2 px-6 rounded-lg hover:bg-green-600"
          >
            Complete Setup
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}