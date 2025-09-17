import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import theme from '../styles/theme';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

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
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3D52A0] to-[#7091E6]">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-[#8697C4] mb-8">
              Get in touch with our team for any questions, support, or partnership inquiries
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                  <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#3D52A0] to-[#7091E6]">
                    Get in Touch
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-[#3D52A0] to-[#7091E6] p-3 rounded-lg">
                        <FaEnvelope className="text-xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-[#3D52A0]">Email</h3>
                        <p className="text-[#8697C4]">support@painai.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-[#7091E6] to-[#8697C4] p-3 rounded-lg">
                        <FaPhone className="text-xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-[#3D52A0]">Phone</h3>
                        <p className="text-[#8697C4]">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-[#8697C4] to-[#ADBBDA] p-3 rounded-lg">
                        <FaMapMarkerAlt className="text-xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-[#3D52A0]">Location</h3>
                        <p className="text-[#8697C4]">
                          123 Innovation Drive<br />
                          Tech City, TC 12345<br />
                          United States
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl">
                  <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#3D52A0] to-[#7091E6]">
                    Connect With Us
                  </h2>
                  <div className="flex gap-4">
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-[#3D52A0] to-[#7091E6] p-4 rounded-lg hover:scale-110 transition-transform duration-300"
                    >
                      <FaLinkedin className="text-2xl text-white" />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-[#7091E6] to-[#8697C4] p-4 rounded-lg hover:scale-110 transition-transform duration-300"
                    >
                      <FaTwitter className="text-2xl text-white" />
                    </a>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-[#8697C4] to-[#ADBBDA] p-4 rounded-lg hover:scale-110 transition-transform duration-300"
                    >
                      <FaGithub className="text-2xl text-white" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                  <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#3D52A0] to-[#7091E6]">
                    Send a Message
                  </h2>
                  
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#EDE8F5] border border-[#7091E6] rounded-lg p-6 text-center"
                    >
                      <svg className="w-16 h-16 text-[#3D52A0] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <h3 className="text-xl font-bold text-[#3D52A0] mb-2">Message Sent Successfully!</h3>
                      <p className="text-[#8697C4]">
                        Thank you for contacting us. We'll get back to you as soon as possible.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#3D52A0]">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/50 border border-[#ADBBDA] rounded-lg focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] text-[#3D52A0] placeholder-[#ADBBDA]"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#3D52A0]">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/50 border border-[#ADBBDA] rounded-lg focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] text-[#3D52A0] placeholder-[#ADBBDA]"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#3D52A0]">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/50 border border-[#ADBBDA] rounded-lg focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] text-[#3D52A0] placeholder-[#ADBBDA]"
                          placeholder="Message subject"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#3D52A0]">Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/50 border border-[#ADBBDA] rounded-lg focus:outline-none focus:border-[#7091E6] focus:ring-[#7091E6] text-[#3D52A0] placeholder-[#ADBBDA] h-32 resize-none"
                          placeholder="Your message"
                        ></textarea>
                      </div>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-8 py-4 bg-gradient-to-r from-[#3D52A0] to-[#7091E6] rounded-lg text-lg font-semibold text-white hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </motion.button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#3D52A0] to-[#7091E6]">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  question: "What support options are available?",
                  answer: "We offer 24/7 email support, phone support during business hours, and comprehensive documentation for all our users."
                },
                {
                  question: "How can I request a demo?",
                  answer: "You can request a demo by filling out the contact form above or by emailing us directly at demo@painai.com"
                },
                {
                  question: "Do you offer training for new users?",
                  answer: "Yes, we provide comprehensive training sessions for all new users, including video tutorials and live webinars."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-[#7091E6]/20 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold mb-4 text-[#3D52A0]">{item.question}</h3>
                  <p className="text-[#8697C4]">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact; 