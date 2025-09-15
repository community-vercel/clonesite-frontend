"use client"

import './globals.css';
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'

import { Providers } from '@/components/providers/Providers'
import Header from '@/components/Header'
import SellerHeader from '../components/sellerHeader'

// Utility function to get and parse user cookie
const getUserFromCookie = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))
      ?.split('=')[1];
    
    if (!userCookie) return null;
    
    const decodedUser = decodeURIComponent(userCookie);
    return JSON.parse(decodedUser);
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    return null;
  }
};

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUser(getUserFromCookie());
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <html lang="en">
        <body>
          <Providers>
            <Header />
            {children}
          </Providers>
          <Toaster position="top-right" />
        </body>
      </html>
    );
  }

  // Determine which header to show
  const HeaderComponent = user && user.userType !== 'customer' ? SellerHeader : Header;

  return (
    <html lang="en">
      <body>
        <Providers>
          <HeaderComponent />
          {children}
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}