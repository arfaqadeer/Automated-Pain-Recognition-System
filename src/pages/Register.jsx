import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaPhone, FaArrowRight } from 'react-icons/fa';
import theme from '../styles/theme';
import { registerUser } from '../services/api';
import { toast } from 'react-toastify';

const Register = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    clinicName: '',
    phone: '',
    acceptTerms: false
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
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      setIsSubmitting(false);
      return;
    }
    try {
      const { data } = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        clinicName: formData.clinicName,
        phone: formData.phone,
        acceptTerms: formData.acceptTerms
      });
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      setIsSubmitting(false);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      toast.error(err.response?.data?.message || 'Registration failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#EDE8F5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl w-full">
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
          <h1 className="mt-6 text-3xl font-bold text-[#3D52A0]">Create Account</h1>
          <p className="mt-2 text-[#8697C4]">
            Join PainAI to revolutionize your physiotherapy practice
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#3D52A0]">
                  First Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-[#7091E6]" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-[#ADBBDA] rounded-md shadow-sm placeholder-[#ADBBDA] focus:outline-none focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0]"
                    placeholder="John"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[#3D52A0]">
                  Last Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-[#7091E6]" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-[#ADBBDA] rounded-md shadow-sm placeholder-[#ADBBDA] focus:outline-none focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0]"
                    placeholder="Doe"
                  />
                </div>
              </div>

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
                <label htmlFor="clinicName" className="block text-sm font-medium text-[#3D52A0]">
                  Clinic Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="text-[#7091E6]" />
                  </div>
                  <input
                    id="clinicName"
                    name="clinicName"
                    type="text"
                    value={formData.clinicName}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-[#ADBBDA] rounded-md shadow-sm placeholder-[#ADBBDA] focus:outline-none focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0]"
                    placeholder="Your Clinic"
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
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-[#ADBBDA] rounded-md shadow-sm placeholder-[#ADBBDA] focus:outline-none focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0]"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#3D52A0]">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-[#7091E6]" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-[#ADBBDA] rounded-md shadow-sm placeholder-[#ADBBDA] focus:outline-none focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0]"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#3D52A0]">
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-[#7091E6]" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-[#ADBBDA] rounded-md shadow-sm placeholder-[#ADBBDA] focus:outline-none focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0]"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                required
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="h-4 w-4 text-[#3D52A0] focus:ring-[#7091E6] border-[#ADBBDA] rounded"
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-[#3D52A0]">
                I agree to the{' '}
                <Link to="/terms" className="text-[#7091E6] hover:text-[#3D52A0] transition-colors duration-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[#7091E6] hover:text-[#3D52A0] transition-colors duration-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-gradient-to-r from-[#3D52A0] to-[#7091E6] hover:shadow-lg transition-all duration-300 disabled:opacity-70"
              >
                {isSubmitting ? 'Creating Account...' : (
                  <>
                    Create Account
                    <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center text-sm text-[#3D52A0]"
        >
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#7091E6] hover:text-[#3D52A0] transition-colors duration-300">
            Sign in
          </Link>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4 text-center text-xs text-[#8697C4]"
        >
          By creating an account, you agree to our data processing agreement in accordance with HIPAA regulations.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Register; 