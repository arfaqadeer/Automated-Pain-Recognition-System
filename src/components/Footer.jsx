import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import theme from '../styles/theme';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-[#ADBBDA]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="inline-block mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#3D52A0] to-[#7091E6] bg-clip-text text-transparent">
                  PainAI
                </h2>
              </Link>
              <p className="text-[#3D52A0] mb-6">
                Revolutionizing pain assessment in physiotherapy with advanced artificial intelligence.
              </p>
              <div className="flex space-x-4">
                <SocialIcon icon={FaTwitter} href="https://twitter.com" />
                <SocialIcon icon={FaFacebook} href="https://facebook.com" />
                <SocialIcon icon={FaLinkedin} href="https://linkedin.com" />
                <SocialIcon icon={FaInstagram} href="https://instagram.com" />
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-[#3D52A0] mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/contact">Contact</FooterLink>
                <FooterLink to="/login">Login</FooterLink>
                <FooterLink to="/register">Register</FooterLink>
              </ul>
            </motion.div>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-[#3D52A0] mb-4">Our Services</h3>
              <ul className="space-y-2">
                <FooterLink to="/about">AI Pain Assessment</FooterLink>
                <FooterLink to="/about">Patient Management</FooterLink>
                <FooterLink to="/about">Treatment Tracking</FooterLink>
                <FooterLink to="/about">Clinical Analytics</FooterLink>
                <FooterLink to="/about">Research Collaboration</FooterLink>
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-[#3D52A0] mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaMapMarkerAlt className="text-[#7091E6] mt-1 mr-3" />
                  <span className="text-[#3D52A0]">
                    123 Innovation Drive<br />
                    Tech City, TC 12345
                  </span>
                </li>
                <li className="flex items-center">
                  <FaPhone className="text-[#7091E6] mr-3" />
                  <span className="text-[#3D52A0]">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <FaEnvelope className="text-[#7091E6] mr-3" />
                  <span className="text-[#3D52A0]">info@painai.com</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#ADBBDA]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#3D52A0] text-sm mb-4 md:mb-0">
              © {currentYear} PainAI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-[#3D52A0] hover:text-[#7091E6] text-sm transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-[#3D52A0] hover:text-[#7091E6] text-sm transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-[#3D52A0] hover:text-[#7091E6] text-sm transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full bg-[#EDE8F5] flex items-center justify-center text-[#3D52A0] hover:bg-[#7091E6] hover:text-white transition-all duration-300"
    >
      <Icon size={16} />
    </a>
  );
};

const FooterLink = ({ to, children }) => {
  return (
    <li>
      <Link
        to={to}
        className="text-[#3D52A0] hover:text-[#7091E6] transition-colors duration-300 hover:translate-x-1 inline-block"
      >
        {children}
      </Link>
    </li>
  );
};

export default Footer;
