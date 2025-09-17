import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBrain, FaChartLine, FaUserMd, FaLaptopMedical, FaHospital, FaClipboardCheck } from 'react-icons/fa';
import theme from '../styles/theme';

const Home = () => {
  return (
        <motion.div
      className="min-h-screen bg-[#EDE8F5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#3D52A0] leading-tight">
                Revolutionizing <span className="bg-gradient-to-r from-[#3D52A0] to-[#7091E6] bg-clip-text text-transparent">Pain Assessment</span> in Physiotherapy
              </h1>
              <p className="text-xl text-[#3D52A0] mb-8 max-w-lg">
                PainAI uses advanced artificial intelligence to provide objective, consistent, and reliable pain measurements for better patient outcomes.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white rounded-md font-medium hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300"
                >
            Get Started
          </Link>
                <Link
                  to="/about"
                  className="px-8 py-3 border-2 border-[#3D52A0] text-[#3D52A0] rounded-md font-medium hover:bg-[#3D52A0] hover:text-white transition-all duration-300"
                >
            Learn More
          </Link>
              </div>
        </motion.div>
        <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#3D52A0] to-[#7091E6] rounded-2xl blur-lg opacity-30"></div>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2491/2491485.png"
                  alt="AI Pain Assessment"
                  className="relative w-full h-auto rounded-xl shadow-xl bg-white p-4"
                />
              </div>
        </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#3D52A0]">
              Key Features
            </h2>
            <p className="text-lg text-[#8697C4] max-w-2xl mx-auto">
              Our AI-powered system offers a comprehensive solution for pain assessment in physiotherapy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaBrain,
                title: "AI-Powered Analysis",
                description: "Advanced neural networks analyze pain prediction levels using physiological sensors data with high accuracy."
              },
              {
                icon: FaChartLine,
                title: "Objective Measurements",
                description: "Replace subjective pain scales with consistent, objective measurements that track progress over time."
              },
              {
                icon: FaUserMd,
                title: "Clinical Integration",
                description: "Seamlessly integrates into your existing clinical workflow with minimal disruption."
              },
              {
                icon: FaLaptopMedical,
                title: "Real-time Feedback",
                description: "Get immediate insights during sessions to adjust treatments for optimal patient comfort and results."
              },
              {
                icon: FaHospital,
                title: "Multi-clinic Support",
                description: "Designed for practices of all sizes, from individual therapists to large hospital networks."
              },
              {
                icon: FaClipboardCheck,
                title: "Comprehensive Reports",
                description: "Generate detailed reports for patients, referring physicians, and insurance documentation."
              }
          ].map((feature, index) => (
            <motion.div
              key={index}
                initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-[#EDE8F5] rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-[#3D52A0] to-[#7091E6] w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#3D52A0]">{feature.title}</h3>
                <p className="text-[#8697C4]">{feature.description}</p>
            </motion.div>
          ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#EDE8F5]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#3D52A0]">
              How It Works
            </h2>
            <p className="text-lg text-[#8697C4] max-w-2xl mx-auto">
              PainAI simplifies pain assessment with a straightforward three-step process
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Capture Data",
                description: " physiotherapy sessions using standard cameras or mobile devices."
              },
              {
                step: "02",
                title: "Analyze",
                description: "Our AI processes the video in real-time, identifying micro-expressions and movement patterns that indicate pain."
              },
              {
                step: "03",
                title: "Report",
                description: "Review comprehensive pain assessments and track progress over time with detailed analytics."
              }
          ].map((step, index) => (
            <motion.div
              key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-xl p-8 shadow-md relative z-10">
                  <div className="text-5xl font-bold text-[#ADBBDA] mb-4">{step.step}</div>
                  <h3 className="text-2xl font-semibold mb-4 text-[#3D52A0]">{step.title}</h3>
                  <p className="text-[#8697C4]">{step.description}</p>
                </div>
                {index < 2 && (
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="hidden md:block absolute top-1/2 left-full h-0.5 bg-gradient-to-r from-[#3D52A0] to-[#7091E6] w-full transform -translate-y-1/2 z-0"
                    style={{ width: '50%', transformOrigin: 'left' }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#3D52A0]">
              What Our Users Say
            </h2>
            <p className="text-lg text-[#8697C4] max-w-2xl mx-auto">
              Hear from healthcare professionals who have transformed their practice with PainAI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "PainAI has revolutionized how we assess and track pain in our clinic. The objective measurements have improved our treatment planning significantly.",
                name: "Dr. Sarah Johnson",
                title: "Physical Therapist, Boston Medical Center"
              },
              {
                quote: "The ability to quantify pain objectively has been a game-changer for our research. PainAI provides consistent data that we can rely on.",
                name: "Prof. Michael Chen",
                title: "Research Director, Pain Management Institute"
              },
              {
                quote: "My patients appreciate the technology-driven approach. It helps them understand their progress better and keeps them motivated throughout treatment.",
                name: "Emma Rodriguez, DPT",
                title: "Owner, Elite Physical Therapy"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#EDE8F5] rounded-xl p-6 shadow-md"
              >
                <div className="mb-4 text-[#7091E6]">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8v6a6 6 0 01-6 6H2v4h4a10 10 0 0010-10V8h-6zm18 0v6a6 6 0 01-6 6h-2v4h4a10 10 0 0010-10V8h-6z" />
                  </svg>
                </div>
                <p className="text-[#3D52A0] mb-6 italic">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-[#3D52A0]">{testimonial.name}</p>
                  <p className="text-sm text-[#8697C4]">{testimonial.title}</p>
                </div>
            </motion.div>
          ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#3D52A0] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join the growing number of healthcare providers using PainAI to improve pain assessment and deliver better patient outcomes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-[#3D52A0] rounded-md font-medium hover:bg-opacity-90 transition-all duration-300"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 border-2 border-white text-white rounded-md font-medium hover:bg-white hover:text-[#3D52A0] transition-all duration-300"
              >
                Contact Us
        </Link>
            </div>
          </motion.div>
    </div>
      </section>
    </motion.div>
  );
};

export default Home;
