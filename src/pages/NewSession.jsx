import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaChartLine, FaNotesMedical, FaCamera, FaUpload, FaImage, FaFileExcel, FaSpinner, FaFilePdf } from 'react-icons/fa';
import MedicalIcons from '../components/animations/MedicalIcons';
import SelfDrawingLogo from '../components/animations/SelfDrawingLogo';
import ScrollingText from '../components/animations/ScrollingText';
import ClipArtAnimation from '../components/animations/ClipArtAnimation';
import { predictPain, createSession, generateReport } from '../services/api';

const NewSession = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const painLevelRef = useRef(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    sessionType: '',
    painLevel: '',
    mobility: '',
    treatment: '',
    exercises: '',
    patientId: id
  });

  const [excelFile, setExcelFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [predictionError, setPredictionError] = useState('');
  const [predictedPain, setPredictedPain] = useState(null);
  const [animatedPain, setAnimatedPain] = useState(0);
  const [showPrediction, setShowPrediction] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Animation effect for pain level after prediction
  useEffect(() => {
    if (predictedPain !== null) {
      let start = 0;
      const end = predictedPain;
      const duration = 1500; // ms
      const stepTime = 20; // ms
      const totalSteps = duration / stepTime;
      const stepValue = end / totalSteps;
      
      let timer;
      const animatePain = () => {
        if (start < end) {
          start += stepValue;
          setAnimatedPain(Math.min(start, end));
          timer = setTimeout(animatePain, stepTime);
        } else {
          setAnimatedPain(end);
        }
      };
      
      animatePain();
      
      return () => clearTimeout(timer);
    }
  }, [predictedPain]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFile(file);
      setFileName(file.name);
      // Reset prediction data when a new file is uploaded
      setPredictedPain(null);
      setAnimatedPain(0);
      setShowPrediction(false);
      setPredictionError('');
    }
  };

  const handlePrediction = async () => {
    if (!excelFile) {
      setPredictionError('Please upload an Excel file first.');
      return;
    }

    try {
      setIsLoading(true);
      setPredictionError('');
      
      const formData = new FormData();
      formData.append('file', excelFile);

      // Send file to the external prediction API
      const response = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Prediction API error');
      }

      const data = await response.json();
      console.log('Prediction API response:', data);

      const predictedClasses = data.predicted_classes;

      if (Array.isArray(predictedClasses)) {
        if (predictedClasses.length === 0) {
          setPredictionError('Prediction array is empty.');
          setIsLoading(false);
          return;
        }
        var lastValue = predictedClasses[predictedClasses.length - 1];
      }

      if (lastValue === undefined || lastValue === null) {
        setPredictionError('Invalid prediction response.');
        setIsLoading(false);
        return;
      }

      setPredictedPain(lastValue);
      setFormData(prev => ({ ...prev, painLevel: lastValue.toString() }));
      setShowPrediction(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Prediction error:', error);
      setPredictionError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // Map frontend fields to backend fields
      const mappedSessionType = {
        initial: 'initial_assessment',
        followUp: 'follow_up',
        treatment: 'treatment',
        review: 'review'
      }[formData.sessionType];

      // Combine date and time into ISO string
      const sessionDate = new Date(`${formData.date}T${formData.time}`).toISOString();

      // Get user ID from JWT (decode) or localStorage (if you store it separately)
      let userId = null;
      const token = localStorage.getItem('token');
      if (token) {
        // Decode JWT to get userId (assumes payload has 'id' or '_id')
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const payload = JSON.parse(jsonPayload);
          userId = payload.id || payload._id || payload.userId;
        } catch (err) {
          console.error('Failed to decode JWT:', err);
        }
      }
      if (!userId) {
        alert('User not authenticated. Please log in again.');
        setSaving(false);
        return;
      }

      // Generate a unique sessionID
      const sessionID = `session_${Date.now()}`;

      const submitData = new FormData();
      submitData.append('user', userId);
      submitData.append('patient', formData.patientId);
      submitData.append('sessionID', sessionID);
      submitData.append('sessionType', mappedSessionType);
      submitData.append('sessionDate', sessionDate);
      submitData.append('painLevel', formData.painLevel);
      submitData.append('mobilityAssessment', formData.mobility);
      submitData.append('treatmentProvided', formData.treatment);
      submitData.append('prescribedExercise', formData.exercises);

      if (excelFile) {
        submitData.append('excelFile', excelFile);
      }

      const { data } = await createSession(submitData);
      setSessionId(data._id);
      setSaving(false);
      setShowReport(true);
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Failed to save session. Please try again.');
      setSaving(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!sessionId) return;
    
    try {
      setGeneratingReport(true);
      const { data } = await generateReport(sessionId);
      
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `session_report_${sessionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setGeneratingReport(false);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
      setGeneratingReport(false);
    }
  };

  const navigateToPatient = () => {
    navigate(`/patient/${id}`);
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
                      <option value="initial">Initial Assessment</option>
                      <option value="followUp">Follow-up</option>
                      <option value="treatment">Treatment</option>
                      <option value="review">Review</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Excel File Upload & AI Prediction Section */}
              <div className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium text-[#3D52A0] uppercase">Sensor Data Analysis</h2>
                  <FaFileExcel className="text-[#7091E6]" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#8697C4] uppercase mb-1">Upload Excel Data</label>
                    <div className="border-2 border-dashed border-[#ADBBDA] rounded-md p-4 text-center">
                      <input
                        type="file"
                        id="excelFile"
                        name="excelFile"
                        accept=".csv, .xlsx, .xls"
                        onChange={handleExcelChange}
                        className="hidden"
                      />
                      <label htmlFor="excelFile" className="cursor-pointer flex flex-col items-center justify-center">
                        <FaFileExcel className="text-[#7091E6] text-2xl mb-2" />
                        <span className="text-[#3D52A0] text-sm">Click to upload Excel file</span>
                        <span className="text-[#8697C4] text-xs mt-1">with sensor data</span>
                      </label>
                    </div>
                    
                    {fileName && (
                      <div className="mt-2 flex items-center justify-between bg-[#F5F7FA] p-2 rounded-md">
                        <div className="flex items-center">
                          <FaFileExcel className="text-[#7091E6] mr-2" />
                          <span className="text-sm text-[#3D52A0] truncate">{fileName}</span>
                        </div>
                      </div>
                    )}

                    {predictionError && (
                      <div className="mt-2 text-red-500 text-sm">{predictionError}</div>
                    )}
                    
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handlePrediction}
                        disabled={isLoading || !excelFile}
                        className={`w-full flex items-center justify-center px-4 py-2 ${
                          isLoading || !excelFile 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-[#3D52A0] to-[#7091E6] hover:shadow-lg transform hover:translate-y-[-2px]'
                        } text-white rounded-md transition-all duration-300`}
                      >
                        {isLoading ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          'Make Prediction'
                        )}
                      </button>
                    </div>
                  </div>

                  {showPrediction && (
                    <div className="mt-3 space-y-2">
                      <label className="block text-xs text-[#8697C4] uppercase">Predicted Pain Level</label>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#3D52A0]">{animatedPain.toFixed(1)}/4</span>
                      </div>
                      <div className="w-full h-6 bg-[#EDE8F5] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#3D52A0] to-[#7091E6] transition-all duration-1000 ease-out"
                          style={{ width: `${(animatedPain / 4) * 100}%` }}
                          ref={painLevelRef}
                        />
                      </div>
                    </div>
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
                    <label htmlFor="painLevel" className="block text-xs text-[#8697C4] uppercase mb-1">
                      Pain Level (0-4)
                      {predictedPain !== null && <span className="text-xs text-[#7091E6] ml-2">(AI predicted)</span>}
                    </label>
                    <input
                      type="number"
                      id="painLevel"
                      name="painLevel"
                      min="0"
                      max="4"
                      step="0.1"
                      required
                      value={formData.painLevel}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-[#ADBBDA] rounded-md text-[#3D52A0] focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] transition-colors duration-300 bg-white/50"
                    />
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
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {showReport ? (
                  <>
                    <button
                      type="button"
                      onClick={navigateToPatient}
                      className="px-6 py-2 border border-[#ADBBDA] text-[#3D52A0] rounded-md hover:bg-[#EDE8F5] transition-all duration-300"
                    >
                      Back to Patient
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateReport}
                      disabled={generatingReport}
                      className="flex items-center px-6 py-2 bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white rounded-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300"
                    >
                      {generatingReport ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FaFilePdf className="mr-2" />
                          Generate Report
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => navigate(`/patient/${id}`)}
                      className="px-6 py-2 border border-[#ADBBDA] text-[#3D52A0] rounded-md hover:bg-[#EDE8F5] transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center px-6 py-2 bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white rounded-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300"
                    >
                      {saving ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save Session'
                      )}
                    </button>
                  </>
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