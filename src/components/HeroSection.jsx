'use client';

import { useTheme } from 'next-themes'; // For theme management in Next.js
import { useEffect, useState } from 'react'; // For managing background images in a slideshow

export default function HeroSection() {
  const { theme, setTheme } = useTheme(); // Hook to get the current theme
  const [bgImageIndex, setBgImageIndex] = useState(0); // For managing slideshow
  const bgImages = [
    "https://www.shutterstock.com/image-photo/closeup-pottery-hands-black-white-600nw-2479843217.jpg",
    "https://www.novascotia.com/sites/default/files/2023-07/Big-Hill-Pottery-making-1920x1080.jpg",
    "https://images.yourstory.com/cs/21/98e25df018b511e988ceff9061f4e5e7/Imagephmr1573470708210jpg?mode=crop&crop=faces&ar=2%3A1&format=auto&w=1920&q=75"
  ]; // Array of background images for slideshow

  // Change background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgImageIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 5000); // 5000ms = 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [bgImageIndex]); // Use bgImageIndex as a dependency to keep it consistent

  return (
    <section className="relative py-32 bg-gray-800 text-white">
      <div className="absolute inset-0 bg-black opacity-40 transition-opacity duration-500 ease-in-out"></div> {/* Overlay to improve text contrast */}
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
          Discover Unique Handcrafted Products
        </h1>
        <p className="text-lg mb-6 text-gray-300 drop-shadow-lg">
          Artisan Marketplace connects skilled artisans with customers seeking unique, handcrafted products.
        </p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
          Browse Crafts
        </button>
      </div>

      {/* Background Image with theme-based opacity and slideshow */}
      <div
        className={`absolute inset-0 bg-cover bg-center opacity-60 transition-opacity duration-500 ease-in-out ${
          theme === 'dark' ? 'bg-dark-image' : 'bg-light-image'
        }`}
        style={{
          backgroundImage: `url(${bgImages[bgImageIndex]})`,
        }}
      ></div>

      {/* Dark Mode Toggle Button (Styled and placed at the bottom for better UI) */}
      <div className="absolute bottom-8 right-8 flex items-center">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-all shadow-lg"
          aria-label="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v3m0 12v3m9-9h-3m-12 0H3m16.243 8.486l-2.121-2.121m-12.728 0l-2.121 2.121M16.243 5.757l-2.121 2.121m-12.728 0L3.757 5.757"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v3m0 12v3m9-9h-3m-12 0H3m16.243 8.486l-2.121-2.121m-12.728 0l-2.121 2.121M16.243 5.757l-2.121 2.121m-12.728 0L3.757 5.757"
              />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
