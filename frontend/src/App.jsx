import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Challenges from './components/Challenges';
import Leaderboard from './components/Leaderboard';
import Lessons from './components/Lessons';
import LessonDetail from './components/LessonDetail';
import Profile from './components/Profile';
import { api } from './api';

function App() {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [view, setView] = useState(() => {
    const savedView = localStorage.getItem('cyber_view') || 'landing';
    const token = api.getToken();
    const protectedViews = ['dashboard', 'profile'];
    if (protectedViews.includes(savedView) && !token) {
      return 'landing';
    }
    return savedView;
  });

  const [selectedLessonTitle, setSelectedLessonTitle] = useState(() => {
    return localStorage.getItem('cyber_selected_lesson') || null;
  });

  // Synchronize navigation view to localStorage
  useEffect(() => {
    localStorage.setItem('cyber_view', view);
    if (view === 'lesson' && selectedLessonTitle) {
      localStorage.setItem('cyber_selected_lesson', selectedLessonTitle);
    } else if (view !== 'lesson') {
      localStorage.removeItem('cyber_selected_lesson');
    }
  }, [view, selectedLessonTitle]);

  // Restore authenticated session on mount
  useEffect(() => {
    const token = api.getToken();
    if (token) {
      api.getCurrentUser()
        .then(userData => {
          setUser(userData);
          setPoints(userData.points || 0);
        })
        .catch(err => {
          console.error("Session expired.", err);
          api.removeToken();
          setUser(null);
          setView('landing');
        });
    } else {
      const protectedViews = ['dashboard', 'profile'];
      if (protectedViews.includes(view)) {
        setView('landing');
      }
    }
  }, [view]);

  const handleLogin = (userData) => {
    setUser(userData);
    setPoints(userData.points || 0);
    setView('dashboard');
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setPoints(0);
    setView('landing');
  };

  const handlePointsUpdate = async (challengeId, flag) => {
    try {
      const response = await api.solveChallenge(challengeId, flag);
      setUser(response);
      setPoints(response.points || 0);
    } catch (err) {
      console.error("Submitting flag error:", err);
      throw err;
    }
  };

  const handleUserUpdate = (updatedUserData) => {
    setUser(updatedUserData);
    setPoints(updatedUserData.points || 0);
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
              <Home 
                onGetStarted={() => user ? setView('dashboard') : setIsAuthModalOpen(true)} 
                onViewChange={setView}
              />
            </motion.div>
          ) : view === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Challenges currentUser={user} onPointsUpdate={handlePointsUpdate} solvedChallenges={user?.solved_challenges || []} />
            </motion.div>
          ) : view === 'lessons' ? (
            <motion.div
              key="lessons"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <Lessons onViewChange={setView} onLessonSelect={setSelectedLessonTitle} />
            </motion.div>
          ) : view === 'lesson' ? (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <LessonDetail lessonTitle={selectedLessonTitle} onBack={() => setView('lessons')} />
            </motion.div>
          ) : view === 'leaderboard' ? (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <Leaderboard />
            </motion.div>
          ) : view === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Profile 
                user={user} 
                onUserUpdate={handleUserUpdate} 
                onLogout={handleLogout} 
                onViewChange={setView} 
              />
            </motion.div>
          ) : null}
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
