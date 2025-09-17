import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSearch, FaFilter, FaTrash } from 'react-icons/fa';
import AnimatedBackground from '../components/animations/AnimatedBackground';
import MedicalIcons from '../components/animations/MedicalIcons';
import SelfDrawingLogo from '../components/animations/SelfDrawingLogo';
import ScrollingText from '../components/animations/ScrollingText';
import ClipArtAnimation from '../components/animations/ClipArtAnimation';
import theme from '../styles/theme';
import { getPatients } from '../services/api';

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getPatients()
      .then(res => {
        console.log('Fetched patients data:', res.data);
        setPatients(res.data);
      })
      .catch(err => {
        console.error('Error fetching patients:', err);
        setPatients([]);
      });
  }, []);

  const filteredPatients = patients.filter(patient => {
    const patientName = ((patient.firstName || '') + ' ' + (patient.lastName || '')).trim();
    const matchesSearch = patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (patient.condition || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || (patient.status || '') === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-[#EDE8F5] text-[#3D52A0]';
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'completed': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const handleDelete = (id) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <AnimatedBackground />
      <MedicalIcons />
      <SelfDrawingLogo />
      <ScrollingText />
      <ClipArtAnimation />
      <motion.div
        className="min-h-screen bg-gradient-to-br from-[#EDE8F5] to-[#ADBBDA]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-[#3D52A0] mb-2">Patient Management</h1>
              <p className="text-[#8697C4]">
                Manage and monitor your patients' progress
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-4 mt-4 md:mt-0"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link 
                to="/add-patient"
                className="inline-flex items-center bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white px-4 py-2 rounded-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300"
              >
                <FaUserPlus className="mr-2" />
                Add Patient
              </Link>
            </motion.div>
          </div>

          {/* Search and Filter Section */}
          <motion.div 
            className="grid md:grid-cols-2 gap-6 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-[#7091E6]" />
              </div>
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-[#ADBBDA] rounded-md text-[#3D52A0] placeholder-[#ADBBDA] focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] transition-colors duration-300 bg-white"
              />
            </div>

            <div className="flex items-center space-x-4">
              <FaFilter className="text-[#7091E6]" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full py-3 pl-3 pr-10 border border-[#ADBBDA] rounded-md text-[#3D52A0] focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] transition-colors duration-300 bg-white"
              >
                <option value="all">All Patients</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </motion.div>

          {/* Patients Table */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#ADBBDA]">
                    <th className="text-left py-4 px-4 text-sm font-medium text-[#3D52A0] uppercase">Patient</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-[#3D52A0] uppercase">Age</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-[#3D52A0] uppercase">Condition</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-[#3D52A0] uppercase">Last Visit</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-[#3D52A0] uppercase">Status</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-[#3D52A0] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ADBBDA]">
                  {filteredPatients.map((patient) => (
                    <motion.tr 
                      key={patient._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-[#EDE8F5]"
                    >
                      <td className="py-4 px-4">
                        <Link to={`/patient/${patient._id}`} className="text-[#3D52A0] hover:text-[#7091E6] font-medium">
                          {patient.firstName} {patient.lastName}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-[#8697C4]">{patient.age}</td>
                      <td className="py-4 px-4 text-[#8697C4]">{patient.condition}</td>
                      <td className="py-4 px-4 text-[#8697C4]">{new Date(patient.lastVisit).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium capitalize rounded-full ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex justify-center space-x-3">
                          <Link 
                            to={`/patient/${patient._id}`}
                            className="text-[#7091E6] hover:text-[#3D52A0] transition-colors duration-300"
                          >
                            View Details
                          </Link>
                          <Link 
                            to={`/new-session/${patient._id}`}
                            className="text-[#7091E6] hover:text-[#3D52A0] transition-colors duration-300"
                          >
                            New Session
                          </Link>
                          <button
                            onClick={() => handleDelete(patient._id)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-300"
                            title="Delete Patient"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPatients.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-[#8697C4]">No patients found matching your criteria</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Patients; 