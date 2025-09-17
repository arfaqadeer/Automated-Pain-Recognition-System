import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaNotesMedical, FaCalendar, FaTransgender, FaMapMarkerAlt } from 'react-icons/fa';
import AnimatedBackground from '../components/animations/AnimatedBackground';
import MedicalIcons from '../components/animations/MedicalIcons';
import SelfDrawingLogo from '../components/animations/SelfDrawingLogo';
import ScrollingText from '../components/animations/ScrollingText';
import { createPatient } from '../services/api';
import { toast } from 'react-toastify';

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    condition: '',
    primaryCondition: '',
    status: '',
    notes: '',
    nextAppointment: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Frontend validation for required fields
    if (!formData.firstName || !formData.lastName || !formData.age || !formData.dateOfBirth || !formData.gender || !formData.phone || !formData.condition || !formData.primaryCondition || !formData.status || !formData.emergencyContact.name || !formData.emergencyContact.relationship || !formData.emergencyContact.phone) {
      toast.error('Please fill all required fields.');
      return;
    }
    try {
      const dateOfBirthISO = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined;
      const nextAppointmentISO = formData.nextAppointment ? new Date(formData.nextAppointment).toISOString() : undefined;
      await createPatient({
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: Number(formData.age),
        condition: formData.condition,
        primaryCondition: formData.primaryCondition,
        additionalNotes: formData.notes,
        status: formData.status,
        contact: formData.phone,
        email: formData.email,
        nextAppointment: nextAppointmentISO,
        dateOfBirth: dateOfBirthISO,
        gender: formData.gender,
        address: formData.address,
        emergencyContactName: formData.emergencyContact.name,
        emergencyContactRelationship: formData.emergencyContact.relationship,
        emergencyContactNo: formData.emergencyContact.phone
      });
      toast.success('Patient added successfully!');
      navigate('/dashboard');
    } catch (err) {
      const backendError = err.response?.data?.error || err.response?.data?.message || 'Failed to add patient.';
      toast.error(backendError);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <MedicalIcons />
      <SelfDrawingLogo />
      <ScrollingText />
      <motion.div
        className="min-h-screen bg-white bg-opacity-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Header Section */}
          <motion.div
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Patient</h1>
            <p className="text-gray-600 text-sm">
              Enter the patient's information to create a new record
            </p>
          </motion.div>

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Personal Information</h2>
                  <FaUser className="text-gray-400" />
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-xs text-gray-500 uppercase mb-1">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-xs text-gray-500 uppercase mb-1">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="age" className="block text-xs text-gray-500 uppercase mb-1">Age</label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        required
                        min="0"
                        value={formData.age}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-xs text-gray-500 uppercase mb-1">Date of Birth</label>
                      <div className="relative">
                        <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          required
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-xs text-gray-500 uppercase mb-1">Gender</label>
                    <div className="relative">
                      <FaTransgender className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs text-gray-500 uppercase mb-1">Email</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs text-gray-500 uppercase mb-1">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-xs text-gray-500 uppercase mb-1">Address</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        id="address"
                        name="address"
                        rows="2"
                        value={formData.address}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nextAppointment" className="block text-xs text-gray-500 uppercase mb-1">Next Appointment</label>
                      <input
                        type="date"
                        id="nextAppointment"
                        name="nextAppointment"
                        value={formData.nextAppointment}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information & Emergency Contact Section */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Medical Information</h2>
                  <FaNotesMedical className="text-gray-400" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="condition" className="block text-xs text-gray-500 uppercase mb-1">Primary Condition</label>
                    <input
                      type="text"
                      id="condition"
                      name="condition"
                      required
                      value={formData.condition}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="primaryCondition" className="block text-xs text-gray-500 uppercase mb-1">Primary Condition</label>
                    <input
                      type="text"
                      id="primaryCondition"
                      name="primaryCondition"
                      required
                      value={formData.primaryCondition}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-xs text-gray-500 uppercase mb-1">Status</label>
                    <select
                      id="status"
                      name="status"
                      required
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                    >
                      <option value="">Select status</option>
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-xs text-gray-500 uppercase mb-1">Additional Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Emergency Contact</h2>
                  <FaPhone className="text-gray-400" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="emergencyContact.name" className="block text-xs text-gray-500 uppercase mb-1">Contact Name</label>
                    <input
                      type="text"
                      id="emergencyContact.name"
                      name="emergencyContact.name"
                      required
                      value={formData.emergencyContact.name}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="emergencyContact.relationship" className="block text-xs text-gray-500 uppercase mb-1">Relationship</label>
                      <input
                        type="text"
                        id="emergencyContact.relationship"
                        name="emergencyContact.relationship"
                        required
                        value={formData.emergencyContact.relationship}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="emergencyContact.phone" className="block text-xs text-gray-500 uppercase mb-1">Phone Number</label>
                      <input
                        type="tel"
                        id="emergencyContact.phone"
                        name="emergencyContact.phone"
                        required
                        value={formData.emergencyContact.phone}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                className="flex justify-end gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 border border-gray-200 text-sm uppercase tracking-wide hover:border-gray-900 transition-colors duration-300"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className="px-6 py-2 bg-gray-900 text-white text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors duration-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Add Patient
                </motion.button>
              </motion.div>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </>
  );
};

export default AddPatient;