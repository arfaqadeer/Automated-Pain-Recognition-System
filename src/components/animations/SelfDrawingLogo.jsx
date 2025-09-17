import { motion } from 'framer-motion';
import React from 'react';

const SelfDrawingLogo = () => {
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-10 w-16 h-16"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        <motion.path
          d="M20,50 A30,30 0 1,1 80,50 A30,30 0 1,1 20,50"
          fill="none"
          stroke="#4F46E5"
          strokeWidth="4"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M35,50 L65,50 M50,35 L50,65"
          fill="none"
          stroke="#4F46E5"
          strokeWidth="4"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>
    </motion.div>
  );
};

export default SelfDrawingLogo; 