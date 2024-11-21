"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineArrowRight } from "react-icons/ai";

// Story Card Component
const StoryCard = ({ story }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group transform hover:scale-105 transition-all">
    <img
      src={story.thumbnailUrl || "https://via.placeholder.com/150"} // Use a default placeholder image
      alt={story.title}
      className="w-full h-56 object-cover rounded-t-lg group-hover:opacity-90 transition-all"
    />
    <div className="p-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{story.title}</h3>
    </div>
    <div className="p-4 flex items-center justify-between bg-gray-100 dark:bg-gray-700">
      <span className="text-gray-800 dark:text-gray-100 font-semibold">Photo ID: {story.id}</span>
      <AiOutlineArrowRight className="text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-all" />
    </div>
  </div>
);

const StoriesSection = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/photos");
        // Fetch the first 6 items for display
        const mappedStories = response.data.slice(0, 6).map((photo) => ({
          id: photo.id,
          title: photo.title,
          thumbnailUrl: photo.thumbnailUrl,
        }));
        setStories(mappedStories);
      } catch (error) {
        setError("Error fetching stories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Loading Stories...</div>
          <div className="mt-4">
            <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-[#212121]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Photo Stories</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Explore captivating images captured in our story gallery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;
