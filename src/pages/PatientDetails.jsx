import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarPlus, FaEdit, FaDownload, FaChartLine, FaHistory, FaNotesMedical, FaFileMedical } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MedicalIcons from '../components/animations/MedicalIcons';
import SelfDrawingLogo from '../components/animations/SelfDrawingLogo';
import ScrollingText from '../components/animations/ScrollingText';
import ClipArtAnimation from '../components/animations/ClipArtAnimation';
import { getPatient } from '../services/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState({
    painReduction: 0,
    improvementRate: 0,
    totalSessions: 0,
    lastSessionDate: '',
    nextAppointment: '',
  });
  const reportRef = useRef();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const patientResponse = await getPatient(id);
        const patientData = patientResponse.data;
        
        if (!patientData) {
          throw new Error('Patient data not found');
        }

        // Mock sessions data
        const sessionsData = [
          { 
            _id: 1, 
            date: '2025-03-05', 
            type: 'Assessment', 
            notes: 'Patient reported improvement in mobility', 
            painLevel: 4,
            mobility: 'Improved range of motion in lower back. Can bend forward 30° more than last session.',
            treatment: 'Manual therapy and ultrasound',
            nextSteps: 'Continue home exercises, follow-up in 1 week'
          },
          { 
            _id: 2, 
            date: '2025-02-25', 
            type: 'Treatment', 
            notes: 'Applied therapeutic exercises', 
            painLevel: 5,
            mobility: 'Limited range of motion when bending forward. Pain at 40° flexion.',
            treatment: 'Deep tissue massage and guided stretching',
            nextSteps: 'Increase stretching exercises at home'
          },
          { 
            _id: 3, 
            date: '2025-02-15', 
            type: 'Treatment', 
            notes: 'Continued therapy plan', 
            painLevel: 6,
            mobility: 'Difficulty with lateral movements. Pain during rotation.',
            treatment: 'Heat therapy and gentle mobilization',
            nextSteps: 'Review progress in next session'
          },
          { 
            _id: 4, 
            date: '2025-02-05', 
            type: 'Treatment', 
            notes: 'Started new exercise program', 
            painLevel: 6.5,
            mobility: 'Limited range of motion in all directions. Significant pain with movement.',
            treatment: 'Education on posture and pain management',
            nextSteps: 'Begin gentle stretching program'
          },
          { 
            _id: 5, 
            date: '2025-01-25', 
            type: 'Initial', 
            notes: 'Initial assessment completed', 
            painLevel: 7,
            mobility: 'Severely restricted range of motion. Unable to bend forward beyond 20°.',
            treatment: 'Assessment and treatment planning',
            nextSteps: 'Start conservative treatment approach'
          },
        ];
        
        setPatient(patientData);
        setSessions(sessionsData);
        
        // Calculate insights
        if (sessionsData.length >= 2) {
          const firstSession = sessionsData[sessionsData.length - 1];
          const lastSession = sessionsData[0];
          const painReduction = firstSession.painLevel - lastSession.painLevel;
          const percentReduction = (painReduction / firstSession.painLevel) * 100;
          
          setInsights({
            painReduction: painReduction.toFixed(1),
            improvementRate: percentReduction.toFixed(1),
            totalSessions: sessionsData.length,
            lastSessionDate: lastSession.date,
            nextAppointment: patientData.nextAppointment,
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-[#EDE8F5] text-[#3D52A0]';
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'completed': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const chartData = sessions.map(session => ({
    date: session.date,
    painLevel: session.painLevel,
  })).reverse();

  const handleExportPDF = async () => {
    if (!reportRef.current) {
      console.error('Report content not ready');
      return;
    }

    try {
      // Temporarily show the report content
      reportRef.current.style.position = 'fixed';
      reportRef.current.style.left = '0';
      reportRef.current.style.top = '0';
      reportRef.current.style.zIndex = '10000';
      reportRef.current.style.visibility = 'visible';

      // Create canvas from HTML
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Patient_Report_${patient?.firstName || ''}_${patient?.lastName || ''}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      // Reset styles
      if (reportRef.current) {
        reportRef.current.style.position = 'absolute';
        reportRef.current.style.left = '-9999px';
        reportRef.current.style.top = '0';
        reportRef.current.style.zIndex = '-1000';
        reportRef.current.style.visibility = 'hidden';
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EDE8F5] to-[#ADBBDA] flex items-center justify-center">
        <div className="text-[#3D52A0] text-xl">Loading patient data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EDE8F5] to-[#ADBBDA] flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EDE8F5] to-[#ADBBDA] flex items-center justify-center">
        <div className="text-[#3D52A0] text-xl">Patient not found</div>
      </div>
    );
  }

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-[#3D52A0]">{patient.firstName} {patient.lastName}</h1>
                <span className={`inline-flex px-2 py-1 text-xs font-medium capitalize rounded-full ${getStatusColor(patient.status)}`}>
                  {patient.status}
                </span>
              </div>
              <p className="text-[#8697C4]">Patient ID: {patient.patientID}</p>
            </motion.div>
            <motion.div 
              className="flex flex-wrap gap-4 mt-4 md:mt-0"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link 
                to={`/new-session/${id}`}
                className="inline-flex items-center bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white px-4 py-2 rounded-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300"
              >
                <FaCalendarPlus className="mr-2" />
                New Session
              </Link>
              <Link 
                to={`/patient/${id}/edit`}
                className="inline-flex items-center bg-white text-[#3D52A0] border border-[#ADBBDA] px-4 py-2 rounded-md hover:bg-[#EDE8F5] transition-all duration-300"
              >
                <FaEdit className="mr-2" />
                Edit Details
              </Link>
              <button 
                onClick={handleExportPDF}
                className="inline-flex items-center bg-white text-[#3D52A0] border border-[#ADBBDA] px-4 py-2 rounded-md hover:bg-[#EDE8F5] transition-all duration-300"
              >
                <FaDownload className="mr-2" />
                Export Data
              </button>
            </motion.div>
          </div>

          {/* Patient Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Personal Information */}
            <motion.div 
              className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#3D52A0] uppercase">Personal Information</h3>
                <FaFileMedical className="text-[#7091E6]" />
              </div>
              <div className="space-y-3">
                <div><p className="text-xs text-[#8697C4] uppercase">Age</p><p className="text-sm text-[#3D52A0]">{patient.age} years</p></div>
                <div><p className="text-xs text-[#8697C4] uppercase">Gender</p><p className="text-sm text-[#3D52A0]">{patient.gender}</p></div>
                <div><p className="text-xs text-[#8697C4] uppercase">Contact</p><p className="text-sm text-[#3D52A0]">{patient.contact}</p></div>
                <div><p className="text-xs text-[#8697C4] uppercase">Email</p><p className="text-sm text-[#3D52A0]">{patient.email}</p></div>
              </div>
            </motion.div>

            {/* Treatment Information */}
            <motion.div 
              className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#3D52A0] uppercase">Treatment Information</h3>
                <FaNotesMedical className="text-[#7091E6]" />
              </div>
              <div className="space-y-3">
                <div><p className="text-xs text-[#8697C4] uppercase">Condition</p><p className="text-sm text-[#3D52A0]">{patient.condition}</p></div>
                <div><p className="text-xs text-[#8697C4] uppercase">Start Date</p><p className="text-sm text-[#3D52A0]">{patient.startDate}</p></div>
                <div><p className="text-xs text-[#8697C4] uppercase">Last Visit</p><p className="text-sm text-[#3D52A0]">{patient.lastVisit}</p></div>
                <div><p className="text-xs text-[#8697C4] uppercase">Next Appointment</p><p className="text-sm text-[#3D52A0]">{patient.nextAppointment}</p></div>
              </div>
            </motion.div>

            {/* Progress Overview */}
            <motion.div 
              className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#3D52A0] uppercase">Progress Overview</h3>
                <FaChartLine className="text-[#7091E6]" />
              </div>
              <div className="space-y-3">
                <div><p className="text-xs text-[#8697C4] uppercase">Initial Pain Level</p><p className="text-sm text-[#3D52A0]">{sessions.length > 0 ? sessions[sessions.length-1].painLevel : 'N/A'}/10</p></div>
                <div><p className="text-xs text-[#8697C4] uppercase">Current Pain Level</p><p className="text-sm text-[#3D52A0]">{sessions.length > 0 ? sessions[0].painLevel : 'N/A'}/10</p></div>
                <div><p className="text-xs text-[#8697C4] uppercase">Total Sessions</p><p className="text-sm text-[#3D52A0]">{sessions.length}</p></div>
                <div className="pt-2">
                  <div className="w-full bg-[#ADBBDA] h-2 rounded-full">
                    <div className="bg-gradient-to-r from-[#3D52A0] to-[#7091E6] h-2 rounded-full" style={{ width: sessions.length > 0 ? `${(10 - sessions[0].painLevel) / 10 * 100}%` : '0%' }} />
                  </div>
                  <p className="text-xs text-[#8697C4] uppercase mt-2">Recovery Progress</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Pain Progress Chart & Insights */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-md mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-[#3D52A0]">Treatment Progress</h3>
              <FaChartLine className="text-[#7091E6]" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Pain Chart */}
              <div className="lg:col-span-2">
                <h4 className="text-sm font-medium text-[#3D52A0] mb-4">Pain Level Trend</h4>
                {chartData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ADBBDA" />
                        <XAxis dataKey="date" stroke="#8697C4" />
                        <YAxis domain={[0, 10]} stroke="#8697C4" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#ADBBDA', borderRadius: '8px' }} />
                        <Legend />
                        <Line type="monotone" dataKey="painLevel" name="Pain Level" stroke="#7091E6" strokeWidth={2} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-[#F5F7FA] rounded-md">
                    <p className="text-[#8697C4]">No session data available</p>
                  </div>
                )}
              </div>
              {/* Insights */}
              <div className="space-y-5">
                <h4 className="text-sm font-medium text-[#3D52A0] mb-4">Treatment Insights</h4>
                {insights.painReduction > 0 && (
                  <div className="bg-[#F5F7FA] p-4 rounded-lg border-l-4 border-[#7091E6] shadow-sm">
                    <h5 className="text-sm font-medium text-[#3D52A0]">Pain Reduction</h5>
                    <p className="text-lg font-bold text-[#3D52A0]">{insights.painReduction} points <span className="text-sm font-normal text-[#8697C4]">({insights.improvementRate}%)</span></p>
                    <p className="text-xs text-[#8697C4] mt-1">Pain reduced from {sessions.length > 0 ? sessions[sessions.length-1].painLevel : 'N/A'} to {sessions.length > 0 ? sessions[0].painLevel : 'N/A'} since treatment began</p>
                  </div>
                )}
                <div className="bg-[#F5F7FA] p-4 rounded-lg border-l-4 border-[#ADBBDA] shadow-sm">
                  <h5 className="text-sm font-medium text-[#3D52A0]">Treatment Summary</h5>
                  <p className="text-sm text-[#3D52A0] mt-1"><span className="font-medium">{insights.totalSessions}</span> sessions completed</p>
                  <p className="text-xs text-[#8697C4] mt-1">Last visit: {insights.lastSessionDate}</p>
                  <p className="text-xs text-[#8697C4]">Next appointment: {insights.nextAppointment}</p>
                </div>
                {sessions.length > 0 && (
                  <div className="bg-[#F5F7FA] p-4 rounded-lg border-l-4 border-[#7091E6] shadow-sm">
                    <h5 className="text-sm font-medium text-[#3D52A0]">Recent Treatment</h5>
                    <p className="text-sm text-[#3D52A0] mt-1 line-clamp-3">{sessions[0].treatment || 'No treatment data available'}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Session History */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-[#3D52A0]">Session History</h3>
              <FaHistory className="text-[#7091E6]" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#ADBBDA]">
                    <th className="text-left py-4 px-4 text-sm font-medium text-[#3D52A0] uppercase">Date</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-[#3D52A0] uppercase">Type</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-[#3D52A0] uppercase">Notes</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-[#3D52A0] uppercase">Pain Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ADBBDA]">
                  {sessions.map((session) => (
                    <motion.tr 
                      key={session._id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-[#EDE8F5]"
                    >
                      <td className="py-4 px-4 text-sm text-[#3D52A0]">{session.date}</td>
                      <td className="py-4 px-4 text-sm text-[#8697C4]">{session.type}</td>
                      <td className="py-4 px-4 text-sm text-[#8697C4]">{session.notes}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <span className="text-sm text-[#3D52A0] mr-2">{session.painLevel}/10</span>
                          <div className="w-24 bg-[#ADBBDA] h-2 rounded-full">
                            <div className="bg-gradient-to-r from-[#3D52A0] to-[#7091E6] h-2 rounded-full" style={{ width: `${(10 - session.painLevel) * 10}%` }} />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Hidden PDF content */}
      <div
        ref={reportRef}
        id="patient-report-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '0',
          width: '210mm',
          background: '#f8fafd',
          color: '#222',
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: '14px',
          padding: '40px 32px',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '2px solid #E3E8F0', paddingBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#3D52A0', margin: 0, letterSpacing: '-0.5px' }}>{patient.firstName} {patient.lastName}</h1>
          <div style={{ fontSize: '13px', color: '#8697C4', marginTop: '0.25rem' }}>Patient ID: {patient.patientID}</div>
          <div style={{ fontSize: '12px', color: '#8697C4', textAlign: 'right', marginTop: '0.5rem' }}>Report generated: {new Date().toLocaleDateString()}</div>
        </div>
        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Personal Info */}
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #EDE8F5', boxShadow: '0 2px 8px rgba(61,82,160,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3D52A0', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>Personal Info</h3>
            <div style={{ marginBottom: '0.4rem' }}><span style={{ fontWeight: 600, color: '#3D52A0' }}>Age:</span> {patient.age} years</div>
            <div style={{ marginBottom: '0.4rem' }}><span style={{ fontWeight: 600, color: '#3D52A0' }}>Gender:</span> {patient.gender}</div>
            <div style={{ marginBottom: '0.4rem' }}><span style={{ fontWeight: 600, color: '#3D52A0' }}>Contact:</span> {patient.contact}</div>
            <div><span style={{ fontWeight: 600, color: '#3D52A0' }}>Email:</span> {patient.email}</div>
          </div>
          {/* Treatment Info */}
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #EDE8F5', boxShadow: '0 2px 8px rgba(61,82,160,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3D52A0', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>Treatment Info</h3>
            <div style={{ marginBottom: '0.4rem' }}><span style={{ fontWeight: 600, color: '#3D52A0' }}>Condition:</span> {patient.condition}</div>
            <div style={{ marginBottom: '0.4rem' }}><span style={{ fontWeight: 600, color: '#3D52A0' }}>Start Date:</span> {patient.startDate}</div>
            <div style={{ marginBottom: '0.4rem' }}><span style={{ fontWeight: 600, color: '#3D52A0' }}>Last Visit:</span> {patient.lastVisit}</div>
            <div><span style={{ fontWeight: 600, color: '#3D52A0' }}>Next Appointment:</span> {patient.nextAppointment}</div>
          </div>
          {/* Progress Overview */}
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #EDE8F5', boxShadow: '0 2px 8px rgba(61,82,160,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3D52A0', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>Progress</h3>
            <div style={{ marginBottom: '0.4rem' }}><span style={{ fontWeight: 600, color: '#3D52A0' }}>Initial Pain Level:</span> {sessions.length > 0 ? sessions[sessions.length-1].painLevel : 'N/A'}/10</div>
            <div style={{ marginBottom: '0.4rem' }}><span style={{ fontWeight: 600, color: '#3D52A0' }}>Current Pain Level:</span> {sessions.length > 0 ? sessions[0].painLevel : 'N/A'}/10</div>
            <div style={{ marginBottom: '0.4rem' }}><span style={{ fontWeight: 600, color: '#3D52A0' }}>Total Sessions:</span> {sessions.length}</div>
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ width: '100%', background: '#ADBBDA', height: '0.5rem', borderRadius: '1rem' }}>
                <div style={{ background: 'linear-gradient(to right, #3D52A0, #7091E6)', height: '0.5rem', borderRadius: '1rem', width: sessions.length > 0 ? `${(10 - sessions[0].painLevel) / 10 * 100}%` : '0%' }} />
              </div>
              <div style={{ fontSize: '12px', color: '#8697C4', marginTop: '0.5rem' }}>Recovery Progress</div>
            </div>
          </div>
        </div>
        {/* Insights Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Pain Reduction */}
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '1rem', borderLeft: '4px solid #7091E6', boxShadow: '0 2px 8px rgba(61,82,160,0.04)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#3D52A0', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>Pain Reduction</h4>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#3D52A0' }}>{insights.painReduction} points <span style={{ fontSize: '13px', fontWeight: 400, color: '#8697C4' }}>({insights.improvementRate}%)</span></div>
            <div style={{ fontSize: '12px', color: '#8697C4', marginTop: '0.25rem' }}>Pain reduced from {sessions.length > 0 ? sessions[sessions.length-1].painLevel : 'N/A'} to {sessions.length > 0 ? sessions[0].painLevel : 'N/A'} since treatment began</div>
          </div>
          {/* Mobility Assessment */}
          {(() => {
            const keywords = {
              improved: ['improved', 'better', 'increased', 'more'],
              worsened: ['worsened', 'worse', 'decreased', 'less', 'limited', 'difficulty'],
              unchanged: ['unchanged', 'same', 'consistent', 'maintained']
            };
            let trend = null;
            const lastSessionMobility = sessions[0]?.mobility?.toLowerCase() || '';
            if (keywords.improved.some(word => lastSessionMobility.includes(word))) {
              trend = 'improved';
            } else if (keywords.worsened.some(word => lastSessionMobility.includes(word))) {
              trend = 'worsened';
            } else if (keywords.unchanged.some(word => lastSessionMobility.includes(word))) {
              trend = 'unchanged';
            }
            if (!trend) return null;
            const borderColor = trend === 'improved' ? '#22c55e' : trend === 'worsened' ? '#ef4444' : '#eab308';
            return (
              <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '1rem', borderLeft: `4px solid ${borderColor}`, boxShadow: '0 2px 8px rgba(61,82,160,0.04)' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#3D52A0', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>Mobility Assessment</h4>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#3D52A0', textTransform: 'capitalize' }}>{trend}</div>
                <div style={{ fontSize: '12px', color: '#8697C4', marginTop: '0.25rem' }}>Based on latest mobility assessment</div>
              </div>
            );
          })()}
          {/* Treatment Summary */}
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '1rem', borderLeft: '4px solid #ADBBDA', boxShadow: '0 2px 8px rgba(61,82,160,0.04)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#3D52A0', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>Treatment Summary</h4>
            <div style={{ fontSize: '14px', color: '#3D52A0', marginTop: '0.25rem' }}><span style={{ fontWeight: 500 }}>{insights.totalSessions}</span> sessions completed</div>
            <div style={{ fontSize: '12px', color: '#8697C4', marginTop: '0.25rem' }}>Last visit: {insights.lastSessionDate}</div>
            <div style={{ fontSize: '12px', color: '#8697C4' }}>Next appointment: {insights.nextAppointment}</div>
          </div>
        </div>
        {/* Recent Treatment */}
        {sessions.length > 0 && (
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '1rem', borderLeft: '4px solid #7091E6', boxShadow: '0 2px 8px rgba(61,82,160,0.04)', marginBottom: '2.5rem' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#3D52A0', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>Recent Treatment</h4>
            <div style={{ fontSize: '14px', color: '#3D52A0', marginTop: '0.25rem', lineClamp: 3 }}>{sessions[0].treatment || 'No treatment data available'}</div>
          </div>
        )}
        {/* Session History Table */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(61,82,160,0.04)', border: '1px solid #EDE8F5' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3D52A0', marginBottom: '1rem', letterSpacing: '0.04em' }}>Session History</h3>
          <div style={{ overflowX: 'auto', maxWidth: '100%', marginBottom: '0.5rem' }}>
            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ADBBDA', background: '#F5F7FA' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.5rem', fontWeight: 700, color: '#3D52A0', textTransform: 'uppercase', fontSize: '12.5px', letterSpacing: '0.03em' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.5rem', fontWeight: 700, color: '#3D52A0', textTransform: 'uppercase', fontSize: '12.5px', letterSpacing: '0.03em' }}>Type</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.5rem', fontWeight: 700, color: '#3D52A0', textTransform: 'uppercase', fontSize: '12.5px', letterSpacing: '0.03em', width: '40%' }}>Notes</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.5rem', fontWeight: 700, color: '#3D52A0', textTransform: 'uppercase', fontSize: '12.5px', letterSpacing: '0.03em' }}>Pain Level</th>
                </tr>
              </thead>
              <tbody style={{ pageBreakInside: 'avoid' }}>
                {sessions.map((session, idx) => (
                  <tr key={session._id} style={{ borderBottom: '1px solid #EDE8F5', background: idx % 2 === 0 ? '#F8FAFD' : '#fff', pageBreakInside: 'avoid' }}>
                    <td style={{ padding: '0.5rem 0.5rem', color: '#3D52A0', fontWeight: 500 }}>{session.date}</td>
                    <td style={{ padding: '0.5rem 0.5rem', color: '#7091E6', fontWeight: 500 }}>{session.type}</td>
                    <td style={{ padding: '0.5rem 0.5rem', color: '#222', wordBreak: 'break-word', maxWidth: '180px', overflowWrap: 'break-word' }}>{session.notes}</td>
                    <td style={{ padding: '0.5rem 0.5rem', color: '#3D52A0', fontWeight: 600 }}>{session.painLevel}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientDetails;