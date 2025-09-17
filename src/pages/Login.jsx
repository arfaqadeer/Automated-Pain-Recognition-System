import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import MedicalIcons from '../components/animations/MedicalIcons';
import SelfDrawingLogo from '../components/animations/SelfDrawingLogo';
import ScrollingText from '../components/animations/ScrollingText';
import ClipArtAnimation from '../components/animations/ClipArtAnimation';
import theme from '../styles/theme';
import { loginUser } from '../services/api';
import { toast } from 'react-toastify';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const { data } = await loginUser({ email: formData.email, password: formData.password });
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      setIsSubmitting(false);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
      toast.error(err.response?.data?.message || 'Login failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MedicalIcons />
      <SelfDrawingLogo />
      <ScrollingText />
      <ClipArtAnimation />
      <motion.div
        className="min-h-screen bg-gradient-to-br from-[#EDE8F5] to-[#ADBBDA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-block">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#3D52A0] to-[#7091E6] bg-clip-text text-transparent">
                PainAI
              </h2>
            </Link>
            <h1 className="mt-6 text-3xl font-bold text-[#3D52A0]">Sign In</h1>
            <p className="mt-2 text-[#8697C4]">
              Access your account to manage patients and sessions
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white shadow-xl rounded-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#3D52A0]">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-[#7091E6]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-[#ADBBDA] rounded-md shadow-sm placeholder-[#ADBBDA] focus:outline-none focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0]"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#3D52A0]">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-[#7091E6]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-[#ADBBDA] rounded-md shadow-sm placeholder-[#ADBBDA] focus:outline-none focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0]"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#3D52A0] focus:ring-[#7091E6] border-[#ADBBDA] rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-[#3D52A0]">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-[#7091E6] hover:text-[#3D52A0] transition-colors duration-300">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-gradient-to-r from-[#3D52A0] to-[#7091E6] hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FaLock className="text-white group-hover:text-opacity-80 transition-opacity duration-300" />
                  </span>
                  {isSubmitting ? 'Signing in...' : (
                    <>
                      Sign In
                      <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#ADBBDA]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#8697C4]">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-[#ADBBDA] rounded-md shadow-sm bg-white text-sm font-medium text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors duration-300"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-[#ADBBDA] rounded-md shadow-sm bg-white text-sm font-medium text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors duration-300"
                >
                  Microsoft
                </button>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-center text-sm text-[#3D52A0]"
          >
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-[#7091E6] hover:text-[#3D52A0] transition-colors duration-300">
              Register now
            </Link>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 text-center text-xs text-[#8697C4]"
          >
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-[#7091E6] hover:text-[#3D52A0] transition-colors duration-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[#7091E6] hover:text-[#3D52A0] transition-colors duration-300">
              Privacy Policy
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </>
  );
};

export default Login; 