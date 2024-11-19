'use client';
import React, { useState, useCallback, useMemo } from "react";  // Correct import
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { usePathname } from 'next/navigation';
import Modal from "./Modal";

// NavLink Component (Reusable and Memoized)
const NavLink = React.memo(({ href, children, active, onClick }) => (
  <Link href={href} onClick={onClick}>
    <span
      className={`${
        active ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-white"
      } hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium`}
    >
      {children}
    </span>
  </Link>
));

export default function Navbar() {
  const [menuState, setMenuState] = useState({ isMobileMenuOpen: false, isModalOpen: false });
  const pathname = usePathname(); // To track current route

  // Memoize the NavLink components to avoid unnecessary re-renders
  const navLinks = useMemo(() => [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/stories', label: 'Stories' },
    { href: '/cart', label: 'Cart' }
  ], []);

  // Handle mobile menu toggle
  const handleMenuToggle = useCallback(() => {
    setMenuState((prevState) => ({
      ...prevState,
      isMobileMenuOpen: !prevState.isMobileMenuOpen, // Toggle the mobile menu state directly
    }));
  }, []);

  // Handle modal toggle
  const handleModalToggle = useCallback(() => {
    setMenuState((prevState) => ({
      ...prevState,
      isModalOpen: !prevState.isModalOpen, // Toggle the modal state directly
    }));
  }, []);

  return (
    <>
      <nav className="bg-white dark:bg-[#212121] shadow-md sticky top-0 z-50 transition-all">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl font-bold text-black dark:text-white">
            <Link href="/">Craft Connect</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                active={pathname === href}
              >
                {label}
              </NavLink>
            ))}
            <Button variant="outline" size="sm" onClick={handleModalToggle}>Login</Button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={handleMenuToggle}
            aria-label="Toggle mobile menu"
            aria-expanded={menuState.isMobileMenuOpen ? "true" : "false"}
          >
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
                d={menuState.isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuState.isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#212121] border-t border-gray-200 dark:border-gray-700 transition-all duration-300">
          <div className="flex flex-col space-y-6 py-6 px-6">
            {navLinks.map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                onClick={handleMenuToggle}
                active={pathname === href}
              >
                {label}
              </NavLink>
            ))}
            <Button variant="outline" size="sm" onClick={handleModalToggle}>Login</Button>
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}

      {/* Modal for Login/Register */}
      <Modal isOpen={menuState.isModalOpen} onClose={handleModalToggle} />
    </>
  );
}
