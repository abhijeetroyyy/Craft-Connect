'use client';
import React, { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import ThemeToggle from "@/components/ThemeToggle";
import { usePathname } from 'next/navigation';
import { FaUserCircle, FaHome, FaShoppingBag, FaBook, FaCartPlus } from 'react-icons/fa';
import { FiMenu, FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import { MdSell } from 'react-icons/md';
import { auth } from "./firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NavLink = React.memo(({ href, children, active, onClick, icon }) => (
  <Link href={href} onClick={onClick}>
    <span
      className={`flex items-center space-x-2 ${
        active ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-white"
      } hover:text-blue-700 dark:hover:text-blue-500 transition-colors duration-300 font-medium py-2 px-4 rounded-md block`}
    >
      {icon}
      <span>{children}</span>
    </span>
  </Link>
));

NavLink.displayName = "NavLink";

export default function Navbar() {
  const [menuState, setMenuState] = useState({
    isMenuOpen: false,
    isProfileMenuOpen: false,
    isModalOpen: false,
  });
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  const navLinks = useMemo(() => [
    { href: '/', label: 'Home', icon: <FaHome className="text-xl" /> },
    { href: '/products', label: 'Products', icon: <FaShoppingBag className="text-xl" /> },
    { href: '/stories', label: 'Stories', icon: <FaBook className="text-xl" /> },
    { href: '/cart', label: 'Cart', icon: <FaCartPlus className="text-xl" /> },
  ], []);

  const handleMenuToggle = useCallback(() => {
    setMenuState((prevState) => ({
      ...prevState,
      isMenuOpen: !prevState.isMenuOpen,
      isProfileMenuOpen: false, // Close profile menu when menu is toggled
    }));
  }, []);

  const handleProfileMenuToggle = useCallback(() => {
    setMenuState((prevState) => ({
      ...prevState,
      isProfileMenuOpen: !prevState.isProfileMenuOpen,
      isMenuOpen: false, // Close main menu when profile menu is toggled
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
          {/* Logo */}
          <div className="text-xl font-bold text-black dark:text-white">
            <Link href="/">Craft Connect</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map(({ href, label, icon }) => (
              <NavLink
                key={href}
                href={href}
                active={pathname === href}
                icon={icon}
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
              <div className="relative">
                <FaUserCircle
                  className="text-3xl text-gray-700 dark:text-white cursor-pointer"
                  onClick={handleProfileMenuToggle}
                />
                {menuState.isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#212121] shadow-lg rounded-lg z-50">
                    <Link href="/seller" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MdSell className="mr-2" /> Become a Seller
                    </Link>
                    <Link href="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FiUser className="mr-2" /> Your Account
                    </Link>
                    <Link href="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FiShoppingCart className="mr-2" /> Your Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* <ThemeToggle /> */}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              className="focus:outline-none text-gray-700 dark:text-white"
              onClick={handleMenuToggle}
            >
              <FiMenu className="text-2xl" />
            </button>
            {user ? (
              <FaUserCircle
                className="text-3xl text-gray-700 dark:text-white cursor-pointer"
                onClick={handleProfileMenuToggle}
              />  
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-md"
                onClick={handleModalToggle}
              >
                Login
              </Button>
            )}
            {/* <ThemeToggle /> */}
          </div>
        </div>
      </nav>

      {/* Mobile Main Menu Dropdown */}
      {menuState.isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#212121] shadow-lg rounded-lg fixed inset-x-4 top-16 z-40 p-4 max-w-sm mx-auto transition-all duration-300">
          <div className="flex flex-col space-y-4">
            {navLinks.map(({ href, label, icon }) => (
              <NavLink
                key={href}
                href={href}
                onClick={handleMenuToggle}
                active={pathname === href}
                icon={icon}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Profile Dropdown */}
      {menuState.isProfileMenuOpen && user && (
        <div className="md:hidden bg-white dark:bg-[#212121] shadow-lg rounded-lg fixed inset-x-4 top-16 z-40 p-4 max-w-sm mx-auto transition-all duration-300">
          <div className="flex flex-col space-y-4">
            <Link href="/seller" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <MdSell className="mr-2" /> Become a Seller
            </Link>
            <Link href="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <FiUser className="mr-2" /> Your Account
            </Link>
            <Link href="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <FiShoppingCart className="mr-2" /> Your Orders
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Modal for Login */}
      <Modal isOpen={menuState.isModalOpen} onClose={handleModalToggle}>
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Login</h2>
        <p className="text-gray-700 dark:text-gray-300">Login form goes here.</p>
      </Modal>

      <ToastContainer />
    </>
  );
}