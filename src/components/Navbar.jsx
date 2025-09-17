import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaChevronDown, FaChartBar, FaUsers } from 'react-icons/fa';
import theme from '../styles/theme';
import logo from '../assets/website-logo.png';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md w-full">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Pain CTRL Logo" className="h-20 w-20 mr-5" />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold bg-gradient-to-r from-[#3D52A0] to-[#7091E6] bg-clip-text text-transparent"
            >
              Pain CTRL
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard">
                  <FaChartBar className="inline mr-1" />
                  Dashboard
                </NavLink>
                <NavLink to="/patients">
                  <FaUsers className="inline mr-1" />
                  Patients
                </NavLink>
              </>
            )}
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-[#3D52A0] hover:text-[#7091E6] transition-colors duration-300 font-medium"
                >
                  <FaUser className="mr-2" />
                  Account
                  <FaChevronDown className={`ml-1 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-[#ADBBDA]"
                    >
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors duration-300"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FaChartBar className="inline mr-2" />
                        Dashboard
                      </Link>
                      <Link
                        to="/patients"
                        className="block px-4 py-2 text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors duration-300"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FaUsers className="inline mr-2" />
                        Patients
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors duration-300"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-[#3D52A0] hover:text-[#7091E6] transition-colors duration-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white hover:shadow-md transition-all duration-300 font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-[#3D52A0] hover:text-[#7091E6] transition-colors duration-300"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-[#ADBBDA]"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <MobileNavLink to="/" onClick={toggleMenu}>Home</MobileNavLink>
              <MobileNavLink to="/about" onClick={toggleMenu}>About</MobileNavLink>
              <MobileNavLink to="/contact" onClick={toggleMenu}>Contact</MobileNavLink>
              
              {isAuthenticated && (
                <>
                  <MobileNavLink to="/dashboard" onClick={toggleMenu}>
                    <FaChartBar className="inline mr-2" />
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink to="/patients" onClick={toggleMenu}>
                    <FaUsers className="inline mr-2" />
                    Patients
                  </MobileNavLink>
                </>
              )}
              
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center w-full px-4 py-2 text-[#3D52A0] hover:bg-[#EDE8F5] rounded-md transition-colors duration-300"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-[#ADBBDA]">
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="px-4 py-2 rounded-md text-center text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMenu}
                    className="px-4 py-2 rounded-md text-center bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white hover:shadow-md transition-all duration-300"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="relative text-[#3D52A0] hover:text-[#7091E6] transition-colors duration-300 font-medium group"
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3D52A0] to-[#7091E6] group-hover:w-full transition-all duration-300"
        whileHover={{ width: '100%' }}
      />
    </Link>
  );
};

const MobileNavLink = ({ to, onClick, children }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2 text-[#3D52A0] hover:bg-[#EDE8F5] rounded-md transition-colors duration-300"
    >
      {children}
    </Link>
  );
};

export default Navbar;
