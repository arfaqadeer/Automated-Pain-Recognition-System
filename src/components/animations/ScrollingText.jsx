import { motion } from 'framer-motion';
import React from 'react';

const ScrollingText = () => {
  const phrases = [
    "Advanced AI-Powered Analysis",
    "Real-time Patient Monitoring",
    "Accurate Pain Assessment",
    "Personalized Treatment Plans",
    "Improved Patient Outcomes"
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full overflow-hidden bg-gray-900 bg-opacity-90 text-white py-3 z-20">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {[...phrases, ...phrases].map((phrase, index) => (
          <div
            key={index}
            className="mx-8 text-lg font-medium flex items-center"
          >
            <span className="mr-2">•</span>
            {phrase}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ScrollingText; 