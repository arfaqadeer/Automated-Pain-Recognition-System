import { motion } from 'framer-motion';
import { FaBrain, FaChartLine, FaUserMd, FaHospital, FaLock } from 'react-icons/fa';
import theme from '../styles/theme';

const About = () => {
  return (
    <motion.div
      className="min-h-screen bg-[#EDE8F5]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3D52A0] to-[#7091E6]">About PainAI</h1>
            <p className="text-xl md:text-2xl text-[#8697C4] mb-8">
              Revolutionizing pain assessment in physiotherapy with advanced artificial intelligence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#3D52A0] to-[#7091E6]">Our Mission</h2>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <p className="text-lg text-[#3D52A0] mb-6 leading-relaxed">
                At PainAI, our mission is to transform pain assessment in physiotherapy by leveraging cutting-edge 
                artificial intelligence. We believe that accurate pain recognition is fundamental to effective 
                treatment, and our AI-powered system provides healthcare professionals with objective, consistent, 
                and reliable pain measurements that improve patient outcomes.
              </p>
              <p className="text-lg text-[#3D52A0] leading-relaxed">
                By combining computer vision, machine learning, and clinical expertise, we've created a solution 
                that bridges the gap between subjective patient reporting and objective clinical assessment, 
                enabling more personalized and effective physiotherapy interventions.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#3D52A0] to-[#7091E6]">
            How Our AI System Works
          </h2>
          
          <div className="max-w-5xl mx-auto space-y-12">
            {[
              {
                title: "Data Collection",
                icon: FaUserMd,
                description: "Our system captures video data of patients during physiotherapy sessions using standard cameras or mobile devices, making it accessible for clinics of all sizes.",
                color: "from-[#3D52A0] to-[#7091E6]"
              },
              {
                title: "AI Analysis",
                icon: FaBrain,
                description: "Our advanced neural networks analyze the video data in real-time, identifying micro-expressions and movement patterns that indicate pain.",
                color: "from-[#7091E6] to-[#8697C4]"
              },
              {
                title: "Insights & Reporting",
                icon: FaChartLine,
                description: "The system generates comprehensive reports including pain levels, locations, and patterns over time, providing clinicians with objective data.",
                color: "from-[#8697C4] to-[#ADBBDA]"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-[#7091E6]/20 transition-all duration-300"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-6">
                  <div className={`bg-gradient-to-r ${item.color} p-4 rounded-xl`}>
                    <item.icon className="text-3xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#3D52A0] mb-4">{item.title}</h3>
                    <p className="text-[#8697C4]">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#EDE8F5]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#3D52A0] to-[#7091E6]">
            Benefits of PainAI
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: FaUserMd,
                title: "For Physiotherapists",
                benefits: [
                  "Objective pain assessment data",
                  "Track treatment effectiveness",
                  "Personalize therapy plans",
                  "Document patient progress"
                ],
                color: "from-[#3D52A0] to-[#7091E6]"
              },
              {
                icon: FaHospital,
                title: "For Clinics & Hospitals",
                benefits: [
                  "Improve treatment outcomes",
                  "Standardize pain assessment",
                  "Enhance patient satisfaction",
                  "Optimize resource allocation"
                ],
                color: "from-[#7091E6] to-[#8697C4]"
              },
              {
                icon: FaLock,
                title: "Data Security & Privacy",
                benefits: [
                  "HIPAA compliant",
                  "End-to-end encryption",
                  "Secure cloud storage",
                  "Patient data ownership"
                ],
                color: "from-[#8697C4] to-[#ADBBDA]"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-[#7091E6]/20 transition-all duration-300"
              >
                <div className={`bg-gradient-to-r ${item.color} p-4 rounded-xl inline-block mb-6`}>
                  <item.icon className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#3D52A0] mb-6">{item.title}</h3>
                <ul className="space-y-3">
                  {item.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg className="h-6 w-6 text-[#7091E6] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#8697C4]">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#3D52A0]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#3D52A0] to-[#7091E6]">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-[#8697C4] mb-8">
              Join the growing number of healthcare providers using PainAI to improve pain assessment 
              and deliver better patient outcomes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/register" 
                className="px-8 py-4 bg-gradient-to-r from-[#3D52A0] to-[#7091E6] rounded-full text-lg font-semibold text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Get Started
              </a>
              <a 
                href="/contact" 
                className="px-8 py-4 bg-gradient-to-r from-[#7091E6] to-[#8697C4] rounded-full text-lg font-semibold text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About; 