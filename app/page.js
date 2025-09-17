'use client';
import Footer from "@/components/Footer";
import Categories from "@/components/home/Categories";
import Hero from "@/components/Hero";
import Header from "@/components/layout/Header";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
// import FeaturedServices from "@/components/FeaturedServices";
import FeaturedServices from "@/components/home/FeaturedServices";

import { useState, useEffect } from 'react';
import { useAuth } from '../app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
    const { login, isAuthenticated, loading,user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
      if (!loading && isAuthenticated) {
         if(user.userType==='service_provider'){
        router.replace('/dashboard');
  
        }
        else{
              router.push('/');
  
        }
      }
    }, [isAuthenticated, loading, router]);
    if (user && user.userType==='service_provider') return null;

  return (
    
    <div className="min-h-screen">
      {/* <Header /> */}
      <main>
        <Hero />
        <Categories />
        <FeaturedServices />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}