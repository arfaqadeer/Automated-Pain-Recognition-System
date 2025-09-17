import { motion } from 'framer-motion';
import { FaHeartbeat, FaBrain, FaRunning, FaWheelchair, FaHospital, FaUserMd } from 'react-icons/fa';

const MedicalIcons = () => {
  const iconVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.2, rotate: [0, 10, -10, 0] }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const icons = [
    { Icon: FaHeartbeat, color: '#FF6B6B' },
    { Icon: FaBrain, color: '#4ECDC4' },
    { Icon: FaRunning, color: '#45B7D1' },
    { Icon: FaWheelchair, color: '#96CEB4' },
    { Icon: FaHospital, color: '#FF8C94' },
    { Icon: FaUserMd, color: '#9B89B3' }
  ];

  return (
    <motion.div
      className="fixed top-0 right-0 p-4 z-10 flex flex-col gap-4"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {icons.map(({ Icon, color }, index) => (
        <motion.div
          key={index}
          variants={iconVariants}
          whileHover="hover"
          className="cursor-pointer"
        >
          <Icon size={24} color={color} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MedicalIcons; 