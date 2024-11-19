'use client';

import Image from 'next/image';

export default function ArtisanHighlight() {
  return (
    <section className="py-16 bg-white dark:bg-[#212121]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-8">
          Featured Artisan
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Image Section */}
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="https://i0.wp.com/oaxacaculture.com/wp-content/uploads/2024/01/IMG_1278.jpg"
              alt="Artisan"
              width={500} // Set an appropriate width for the image
              height={600} // Set an appropriate height for the image
              className="w-full max-w-sm h-[500px] object-cover rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              loading="lazy" // Lazy loading for optimization
            />
          </div>

          {/* Artisan Information Section */}
          <div className="md:w-1/2 md:pl-8 text-center md:text-left">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Meet Jane Doe
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Jane has been crafting beautiful pottery for over 15 years. Her passion for shaping clay into functional and decorative pieces shines through in every product she creates. She takes pride in using sustainable methods and supporting the local community.
            </p>
            <button
              aria-label="Explore Jane&apos;s Creations" // Use &apos; to escape the apostrophe
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Explore Jane&apos;s Creations
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
