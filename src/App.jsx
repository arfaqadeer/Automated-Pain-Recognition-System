import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorPage from './components/ErrorPage';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetails from './pages/PatientDetails';
import AddPatient from './pages/AddPatient';
import NewSession from './pages/NewSession';
import NotFound from './pages/NotFound';
import theme from './styles/theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Global CSS variables for the theme
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --color-primary: ${theme.colors.primary};
    --color-secondary: ${theme.colors.secondary};
    --color-tertiary: ${theme.colors.tertiary};
    --color-background: ${theme.colors.background};
    --color-light-background: ${theme.colors.lightBackground};
    
    --gradient-primary: ${theme.gradients.primary};
    --gradient-secondary: ${theme.gradients.secondary};
    --gradient-tertiary: ${theme.gradients.tertiary};
    --gradient-light: ${theme.gradients.light};
    --gradient-full: ${theme.gradients.full};
  }
  
  body {
    background-color: var(--color-light-background);
    color: var(--color-primary);
    font-family: ${theme.typography.fontFamily.sans};
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: var(--color-primary);
  }
  
  a {
    color: var(--color-secondary);
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--color-primary);
    }
  }
  
  button, .btn {
    background: var(--gradient-primary);
    color: white;
    border: none;
    transition: all 0.3s ease;
    
    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.md};
    }
  }
  
  .card {
    background-color: white;
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.md};
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: ${theme.shadows.lg};
    }
  }

  .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
  }
`;

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      <GlobalStyle />
      <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-[#EDE8F5] to-[#ADBBDA]">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <main className="flex-grow w-full">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patients" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Patients />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patient/:id" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <PatientDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-patient" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <AddPatient />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/new-session/:id" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <NewSession />
                  </ProtectedRoute>
                } 
              />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;


