'use client';
import React, { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { usePathname } from 'next/navigation';
import Modal from "./Modal";
import { auth } from "./firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NavLink = React.memo(({ href, children, active, onClick }) => (
  <Link href={href} onClick={onClick}>
    <span
      className={`${
        active ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-white"
      } hover:text-blue-700 dark:hover:text-blue-500 transition-colors duration-300 font-medium py-2 px-4 rounded-md block`}
    >
      {children}
    </span>
  </Link>
));

NavLink.displayName = "NavLink";

export default function Navbar() {
  const [menuState, setMenuState] = useState({ isMobileMenuOpen: false, isModalOpen: false });
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  const navLinks = useMemo(() => [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/stories', label: 'Stories' },
    { href: '/cart', label: 'Cart' }
  ], []);

  const handleMenuToggle = useCallback(() => {
    setMenuState((prevState) => ({
      ...prevState,
      isMobileMenuOpen: !prevState.isMobileMenuOpen,
    }));
  }, []);

  const handleModalToggle = useCallback(() => {
    setMenuState((prevState) => ({
      ...prevState,
      isModalOpen: !prevState.isModalOpen,
    }));
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      setUser(null);
    } catch (error) {
      toast.error("Error logging out: " + error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <nav className="bg-white dark:bg-[#212121] shadow-md sticky top-0 z-50 transition-all ease-in-out duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-black dark:text-white">
            <Link href="/">Craft Connect</Link>
          </div>
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
            {!user ? (
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-md"
                onClick={handleModalToggle}
              >
                Login
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-md"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
          <div>
            <ThemeToggle />
          </div>
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
      {menuState.isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#212121] bg-opacity-95 fixed inset-0 z-40 flex justify-center items-center transition-all ease-in-out duration-300">
          <div className="flex flex-col space-y-6 py-6 px-6 bg-white dark:bg-[#212121] shadow-lg rounded-lg w-4/5 max-w-md">
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
            {!user ? (
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-md"
                onClick={handleModalToggle}
              >
                Login
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-md"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
      <Modal isOpen={menuState.isModalOpen} onClose={handleModalToggle} />
      <ToastContainer />
    </>
  );
}