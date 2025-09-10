"use client"

import './globals.css'
import { Toaster } from 'react-hot-toast'

import { Providers } from '@/components/providers/Providers'
import Header from '@/components/Header'





export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        {/* <Navbar /> */}
                <Providers>
                  <Header />

   
          {children}
        </Providers>

       
        <Toaster position="top-right" />
      </body>
    </html>
  )
}