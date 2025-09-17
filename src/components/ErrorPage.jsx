import { Link, useRouteError } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';

const ErrorPage = () => {
  const error = useRouteError();
  const is404 = error?.status === 404 || error?.message?.includes('Not Found');

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EDE8F5] to-[#ADBBDA] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            {is404 ? "Page Not Found" : "An Error Occurred"}
          </h1>
          
          <p className="text-center text-gray-600 mb-6">
            {is404 
              ? "Sorry, the page you are looking for doesn't exist or has been moved."
              : `Something went wrong. ${error?.message || 'Please try again later.'}`
            }
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white px-4 py-2 rounded-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300"
            >
              <FaHome className="mr-2" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-all duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorPage; 