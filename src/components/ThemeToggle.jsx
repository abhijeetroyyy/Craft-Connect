'use client';

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  // Track if the component is mounted to avoid SSR issues
  const [isMounted, setIsMounted] = useState(false);

  // Check system theme preference after the component is mounted (client-side only)
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Set the initial theme based on system preference (only on the client side)
    const isSystemDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isSystemDarkMode);

    // Set that the component is mounted
    setIsMounted(true);
  }, []);

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);

    // Apply dark mode class directly to the document
    if (newDarkModeState) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Render nothing until the component is mounted to avoid SSR mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <button
      onClick={handleThemeToggle}
      aria-label="Toggle theme"
      className="p-2 rounded-full transition-all duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {isDarkMode ? (
        // Moon icon for dark mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 text-yellow-500 dark:text-yellow-300 transition-all duration-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2m0 10v2m-7-7h2m10 0h2m-3.428 6.427A9 9 0 1112 3v2a7 7 0 10.428 13.427z"
          />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 text-yellow-500 dark:text-yellow-300 transition-all duration-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2a9 9 0 11-9 9 9 9 0 019-9zM12 4a7 7 0 107 7 7 7 0 00-7-7z"
          />
        </svg>
      )}
    </button>
  );
}
