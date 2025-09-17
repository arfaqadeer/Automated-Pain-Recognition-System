import { motion } from 'framer-motion';
import React from 'react';

const AnimatedBackground = () => {
  const shapes = Array(15).fill(null);

  const getRandomPosition = () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  });

  const getRandomShape = () => {
    const shapes = ['circle', 'square', 'triangle'];
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  const getShapeStyle = (shape) => {
    const baseStyle = "w-8 h-8 absolute opacity-10";
    switch (shape) {
      case 'circle':
        return `${baseStyle} rounded-full bg-blue-500`;
      case 'square':
        return `${baseStyle} bg-purple-500`;
      case 'triangle':
        return `${baseStyle} border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-green-500`;
      default:
        return baseStyle;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((_, index) => {
        const shape = getRandomShape();
        const position = getRandomPosition();
        
        return (
          <motion.div
            key={index}
            className={getShapeStyle(shape)}
            initial={{ 
              x: `${position.x}vw`, 
              y: `${position.y}vh`,
              rotate: 0 
            }}
            animate={{
              x: [`${position.x}vw`, `${(position.x + 10) % 100}vw`],
              y: [`${position.y}vh`, `${(position.y + 10) % 100}vh`],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      })}
    </div>
  );
};

export default AnimatedBackground; 


