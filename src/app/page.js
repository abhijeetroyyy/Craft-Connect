'use client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "./products/FeaturedProducts";
import ArtisanHighlight from "@/components/ArtisanHighlight";
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure you import the necessary styles for the toast notifications

// Lazy loading wrapper component
const LazyLoadWrapper = ({ children }) => (
  <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
    {children}
  </Suspense>
);

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <LazyLoadWrapper>
        <HeroSection />
      </LazyLoadWrapper>

      {/* Featured Products */}
      <LazyLoadWrapper>
        <FeaturedProducts />
      </LazyLoadWrapper>

      {/* Artisan Highlight */}
      <LazyLoadWrapper>
        <ArtisanHighlight />
      </LazyLoadWrapper>

      {/* Footer */}
      <Footer />

      {/* Toast Container for Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
