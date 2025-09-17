import { motion } from 'framer-motion';
import React from 'react';

const ClipArtAnimation = () => {
  const clipArts = [
    {
      src: "https://cdn-icons-png.flaticon.com/512/2491/2491418.png", // Medical AI
      alt: "AI Healthcare"
    },
    {
      src: "https://cdn-icons-png.flaticon.com/512/2491/2491485.png", // Doctor
      alt: "Doctor"
    },
    {
      src: "https://cdn-icons-png.flaticon.com/512/2491/2491507.png", // Patient
      alt: "Patient"
    },
    {
      src: "https://cdn-icons-png.flaticon.com/512/2491/2491585.png", // Medical Report
      alt: "Medical Report"
    },
    {
      src: "https://cdn-icons-png.flaticon.com/512/2491/2491606.png", // Medical Technology
      alt: "Medical Technology"
    }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {clipArts.map((art, index) => (
        <motion.img
          key={index}
          src={art.src}
          alt={art.alt}
          className="absolute w-16 h-16 opacity-20"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: 0,
            rotate: 0
          }}
          animate={{
            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
            y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default ClipArtAnimation; 