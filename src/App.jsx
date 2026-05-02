import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Home';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Challenges from './components/Challenges';

function App() {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [view, setView] = useState('landing');

  const handleLogin = (userData) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  const handlePointsUpdate = (newPoints) => {
    const totalPoints = points + newPoints;
    setPoints(totalPoints);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cyber-black)', color: 'white' }}>
      <Navbar 
        user={user} 
        points={points} 
        onAuthClick={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout}
        view={view}
        onViewChange={setView}
      />
      
      <main>
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Home onGetStarted={() => user ? setView('dashboard') : setIsAuthModalOpen(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Challenges onPointsUpdate={handlePointsUpdate} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
