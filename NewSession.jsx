import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaChartLine, FaNotesMedical, FaCamera, FaUpload, FaImage, FaFileExcel, FaBrain } from 'react-icons/fa';
import axios from 'axios';
import MedicalIcons from '../components/animations/MedicalIcons';
import SelfDrawingLogo from '../components/animations/SelfDrawingLogo';
import ScrollingText from '../components/animations/ScrollingText';
import ClipArtAnimation from '../components/animations/ClipArtAnimation';
import theme from '../styles/theme';

const API_URL = '/api';

// Pain Level Progress Bar Component
const PainLevelProgressBar = ({ painLevel }) => {
  const level = parseFloat(painLevel);
  const percentage = (level / 10) * 100;
  
  // Determine color based on pain level
  const getColor = () => {
    if (level <= 3) return '#4CAF50'; // Green for low pain
    if (level <= 6) return '#FFC107'; // Yellow for medium pain
    return '#F44336'; // Red for high pain
  };
  
  return (
    <div className="mt-2">
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: getColor() }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span>No Pain (0)</span>
        <span>Severe Pain (10)</span>
      </div>
    </div>
  );
};

const NewSession = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    sessionType: '',
    painLevel: '',
    mobility: '',
    notes: '',
    treatment: '',
    exercises: '',
    nextSteps: '',
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [excelFilename, setExcelFilename] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState('');
  const [sessionSaved, setSessionSaved] = useState(false);
  const [patientData, setPatientData] = useState(null);
  
  // Get patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`${API_URL}/patients/${id}`);
        setPatientData(response.data);
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    };
    
    if (id) {
      fetchPatient();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFile(file);
      setExcelFilename(file.name);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePredictPain = async () => {
    if (!excelFile) {
      setPredictionError('Please upload an Excel file first');
      return;
    }

    setIsPredicting(true);
    setPredictionError('');

    try {
      const formData = new FormData();
      formData.append('excelFile', excelFile);

      const response = await axios.post(`${API_URL}/predict-pain`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Set the predicted pain level
      setFormData(prev => ({
        ...prev,
        painLevel: response.data.painLevel.toFixed(1)
      }));
      
    } catch (error) {
      console.error('Error predicting pain:', error);
      setPredictionError('Failed to predict pain level. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!excelFile) {
      setPredictionError('Please upload an Excel file before saving');
      return;
    }
    
    try {
      // Create the session data
      const sessionData = {
        patient: id,
        date: new Date(`${formData.date}T${formData.time || '00:00'}`),
        sessionType: formData.sessionType,
        painLevel: parseFloat(formData.painLevel),
        mobilityAssessment: formData.mobility,
        treatmentProvided: formData.treatment,
        prescribedExercises: formData.exercises,
        nextSteps: formData.nextSteps,
        notes: formData.notes,
        excelDataFile: excelFilename
      };
      
      // Save the session
      const response = await axios.post(`${API_URL}/sessions`, sessionData);
      
      setSessionSaved(true);
      
      // Navigate back to patient details after short delay
      setTimeout(() => {
        navigate(`/patient/${id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Failed to save session. Please try again.');
    }
  };

  const handleGenerateReport = async () => {
    try {
      // First ensure the session is saved
      if (!sessionSaved) {
        alert('Please save the session first before generating a report');
        return;
      }
      
      // Request report generation
      const response = await axios.post(`${API_URL}/generate-report`, {
        patient: patientData,
        session: formData
      });
      
      // Open the report in a new tab or download it
      if (response.data && response.data.reportUrl) {
        const fullReportUrl = `${API_URL.replace('/api', '')}${response.data.reportUrl}`;
        window.open(fullReportUrl, '_blank');
      } else {
        throw new Error('Invalid report URL');
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  return (
    <>
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
          <motion.div
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-[#3D52A0] mb-2">New Session</h1>
            <p className="text-[#8697C4]">
              Record details for the physiotherapy session
              {patientData && ` - ${patientData.name}`}
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
            {/* Session Details Section */}
            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium text-[#3D52A0] uppercase">Session Details</h2>
                  <FaCalendar className="text-[#7091E6]" />
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-xs text-[#8697C4] uppercase mb-1">Date</label>
                      <div className="relative">
                        <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7091E6]" />
                        <input
                          type="date"
                          id="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-[#ADBBDA] rounded-md text-[#3D52A0] focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] transition-colors duration-300 bg-white/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-xs text-[#8697C4] uppercase mb-1">Time</label>
                      <div className="relative">
                        <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7091E6]" />
                        <input
                          type="time"
                          id="time"
                          name="time"
                          required
                          value={formData.time}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-[#ADBBDA] rounded-md text-[#3D52A0] focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] transition-colors duration-300 bg-white/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sessionType" className="block text-xs text-[#8697C4] uppercase mb-1">Session Type</label>
                    <select
                      id="sessionType"
                      name="sessionType"
                      required
                      value={formData.sessionType}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-[#ADBBDA] rounded-md text-[#3D52A0] focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] transition-colors duration-300 bg-white/50"
                    >
                      <option value="">Select type</option>
                      <option value="Initial Assessment">Initial Assessment</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Treatment">Treatment</option>
                      <option value="Discharge">Discharge</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Excel File Upload & Prediction */}
              <div className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium text-[#3D52A0] uppercase">Sensor Data & AI Prediction</h2>
                  <FaBrain className="text-[#7091E6]" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="excelFile" className="block text-xs text-[#8697C4] uppercase mb-1">Excel File Upload</label>
                    <div className="border-2 border-dashed border-[#ADBBDA] rounded-md p-4 text-center">
                      <input
                        type="file"
                        id="excelFile"
                        name="excelFile"
                        accept=".xlsx,.xls"
                        onChange={handleExcelFileChange}
                        className="hidden"
                      />
                      <label htmlFor="excelFile" className="cursor-pointer flex flex-col items-center justify-center">
                        <FaFileExcel className="text-[#7091E6] text-2xl mb-2" />
                        <span className="text-[#3D52A0] text-sm">Click to upload Excel file</span>
                        <span className="text-[#8697C4] text-xs mt-1">or drag and drop</span>
                      </label>
                    </div>
                    {excelFilename && (
                      <div className="mt-2 text-xs text-[#3D52A0]">
                        Uploaded: {excelFilename}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handlePredictPain}
                    disabled={!excelFile || isPredicting}
                    className={`w-full py-2 rounded-md text-white font-medium flex items-center justify-center transition-all duration-300 ${
                      !excelFile || isPredicting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#3D52A0] to-[#7091E6] hover:shadow-lg transform hover:translate-y-[-2px]'
                    }`}
                  >
                    {isPredicting ? 'Processing...' : 'Make AI Prediction'}
                  </button>

                  {predictionError && (
                    <div className="text-red-500 text-xs mt-2">{predictionError}</div>
                  )}
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium text-[#3D52A0] uppercase">Assessment</h2>
                  <FaChartLine className="text-[#7091E6]" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="painLevel" className="block text-xs text-[#8697C4] uppercase mb-1">Pain Level (0-10)</label>
                    <input
                      type="number"
                      id="painLevel"
                      name="painLevel"
                      min="0"
                      max="10"
                      step="0.1"
                      required
                      value={formData.painLevel}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-[#ADBBDA] rounded-md text-[#3D52A0] focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] transition-colors duration-300 bg-white/50"
                    />
                    {formData.painLevel && <PainLevelProgressBar painLevel={formData.painLevel} />}
                  </div>

                  <div>
                    <label htmlFor="mobility" className="block text-xs text-[#8697C4] uppercase mb-1">Mobility Assessment</label>
                    <textarea
                      id="mobility"
                      name="mobility"
                      rows="3"
                      value={formData.mobility}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-[#ADBBDA] rounded-md text-[#3D52A0] focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] transition-colors duration-300 bg-white/50"
                      placeholder="Describe range of motion, limitations, improvements..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Treatment & Documentation Section */}
            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium text-[#3D52A0] uppercase">Treatment Details</h2>
                  <FaNotesMedical className="text-[#7091E6]" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="treatment" className="block text-xs text-[#8697C4] uppercase mb-1">Treatment Provided</label>
                    <textarea
                      id="treatment"
                      name="treatment"
                      rows="3"
                      required
                      value={formData.treatment}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-[#ADBBDA] rounded-md text-[#3D52A0] focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] transition-colors duration-300 bg-white/50"
                      placeholder="Detail the treatment methods used..."
                    />
                  </div>

                  <div>
                    <label htmlFor="exercises" className="block text-xs text-[#8697C4] uppercase mb-1">Prescribed Exercises</label>
                    <textarea
                      id="exercises"
                      name="exercises"
                      rows="3"
                      value={formData.exercises}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-[#ADBBDA] rounded-md text-[#3D52A0] focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] transition-colors duration-300 bg-white/50"
                      placeholder="List exercises and instructions..."
                    />
                  </div>

                  <div>
                    <label htmlFor="nextSteps" className="block text-xs text-[#8697C4] uppercase mb-1">Next Steps</label>
                    <textarea
                      id="nextSteps"
                      name="nextSteps"
                      rows="2"
                      value={formData.nextSteps}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-[#ADBBDA] rounded-md text-[#3D52A0] focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] transition-colors duration-300 bg-white/50"
                      placeholder="Recommendations and follow-up plan..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium text-[#3D52A0] uppercase">Documentation</h2>
                  <FaCamera className="text-[#7091E6]" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="notes" className="block text-xs text-[#8697C4] uppercase mb-1">Session Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-[#ADBBDA] rounded-md text-[#3D52A0] focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] transition-colors duration-300 bg-white/50"
                      placeholder="Additional observations and notes..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#8697C4] uppercase mb-1">Images</label>
                    <div className="border-2 border-dashed border-[#ADBBDA] rounded-md p-4 text-center">
                      <input
                        type="file"
                        id="images"
                        name="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label htmlFor="images" className="cursor-pointer flex flex-col items-center justify-center">
                        <FaUpload className="text-[#7091E6] text-2xl mb-2" />
                        <span className="text-[#3D52A0] text-sm">Click to upload images</span>
                        <span className="text-[#8697C4] text-xs mt-1">or drag and drop</span>
                      </label>
                    </div>

                    {previewImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {previewImages.map((src, index) => (
                          <div key={index} className="relative">
                            <img src={src} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-white/80 text-[#3D52A0] rounded-full p-1 hover:bg-[#EDE8F5] transition-colors duration-300"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(`/patient/${id}`)}
                  className="px-6 py-2 border border-[#ADBBDA] text-[#3D52A0] rounded-md hover:bg-[#EDE8F5] transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white rounded-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300"
                  disabled={isPredicting}
                >
                  Save Session
                </button>
                {sessionSaved && (
                  <button
                    type="button"
                    onClick={handleGenerateReport}
                    className="px-6 py-2 bg-gradient-to-r from-[#4CAF50] to-[#8BC34A] text-white rounded-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300"
                  >
                    Generate Report
                  </button>
                )}
              </div>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </>
  );
};

export default NewSession;