"use client"

import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import { QueryClient, QueryClientProvider } from 'react-query';
import { Providers } from '@/components/providers/Providers'
import Header from '@/components/Header'


const queryClient = new QueryClient();



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
  <QueryClientProvider client={queryClient} >

        {/* <Navbar /> */}
                <Providers>
                  <Header />

   
          {children}
        </Providers>

       
        <Toaster position="top-right" />
        </QueryClientProvider>
      </body>
    </html>
  )
}