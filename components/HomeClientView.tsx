'use client'; // This is the most important line!

import { motion } from 'framer-motion';

// You can pass any data fetched on the server as props to this component
export default function HomeClientView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Our Website
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          This content is animated with Framer Motion.
        </p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        Click Me!
      </motion.button>
    </div>
  );
}