'use client';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#212121] text-gray-700 dark:text-gray-100 py-8 mt-auto">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Artisan Marketplace connects skilled artisans with customers seeking unique, handcrafted products. Explore creativity and craftsmanship in one place.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition duration-300"
                  aria-label="Go to Home page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition duration-300"
                  aria-label="View Products"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition duration-300"
                  aria-label="Learn About Us"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition duration-300"
                  aria-label="Contact Us"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-gray-100 transition duration-300"
                aria-label="Follow us on Facebook"
              >
                <i className="fab fa-facebook-f"></i> Facebook
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-gray-100 transition duration-300"
                aria-label="Follow us on Twitter"
              >
                <i className="fab fa-twitter"></i> Twitter
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-500 dark:text-gray-300 dark:hover:text-gray-100 transition duration-300"
                aria-label="Follow us on Instagram"
              >
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Artisan Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
