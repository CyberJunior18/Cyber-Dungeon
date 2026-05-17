import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu, User, LogOut, Award } from 'lucide-react';

const Navbar = ({ user, points, onAuthClick, onLogout, view, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', action: () => onViewChange('landing'), active: view === 'landing' },
    { name: 'Lessons', action: () => onViewChange('lessons'), active: view === 'lessons' },
    { name: 'Challenges', action: () => user ? onViewChange('dashboard') : onAuthClick(), active: view === 'dashboard' },
    { name: 'Leaderboard', action: () => onViewChange('leaderboard'), active: view === 'leaderboard' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="nav-logo"
          onClick={() => onViewChange('landing')}
        >
          <div style={{
            padding: '0.6rem',
            background: 'rgba(188, 19, 254, 0.1)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(188, 19, 254, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--neon-purple-shadow)'
          }}>
            <Cpu size={24} color="#bc13fe" />
          </div>
          <span className="neon-text-purple" style={{ fontWeight: 900 }}>
            CYBER<span style={{ color: 'white' }}>DUNGEON</span>
          </span>
        </motion.div>

        <div className="nav-links">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={link.action}
              className={`nav-link ${link.active ? 'active' : ''}`}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: link.active ? 'var(--cyber-cyan)' : 'var(--text-muted)'
              }}
            >
              {link.name}
              {link.active && <span style={{ position: 'absolute', bottom: '-6px', left: 0, width: '100%', height: '2px', background: 'var(--cyber-cyan)', boxShadow: 'var(--neon-cyan-shadow)' }}></span>}
            </button>
          ))}
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.5rem 1rem', 
                background: 'rgba(0, 243, 255, 0.05)', 
                borderRadius: '2rem', 
                border: '1px solid rgba(0, 243, 255, 0.2)'
              }}>
                <Award size={16} className="neon-text-cyan" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--cyber-cyan)', fontFamily: 'var(--font-orbitron)' }}>
                  {points} <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>PTS</span>
                </span>
              </div>
              
              <div 
                onClick={() => onViewChange('profile')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white' }}>{user.username}</div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onLogout(); }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--cyber-pink)', fontSize: '0.6rem', fontWeight: 800, padding: 0, cursor: 'pointer' }}
                  >
                    LOG OUT
                  </button>
                </div>
                <div style={{ 
                  width: '2.5rem', 
                  height: '2.5rem', 
                  borderRadius: '50%', 
                  background: 'var(--cyber-purple)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: 'var(--neon-purple-shadow)',
                  overflow: 'hidden'
                }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={20} color="white" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline"
              onClick={onAuthClick}
              style={{ fontSize: '0.75rem', padding: '0.6rem 1.5rem' }}
            >
              LOG IN
            </motion.button>
          )}
        </div>

        <div className="mobile-toggle" style={{ display: 'none' }}>
          <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'transparent', color: 'white', border: 'none' }}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 968px) {
          .mobile-toggle { display: block !important; }
          .nav-links { display: none !important; }
        }
      `}} />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(5, 5, 5, 0.95)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(188, 19, 254, 0.2)',
              overflow: 'hidden'
            }}
          >
            <div className="container" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => { link.action(); setIsOpen(false); }}
                    className="nav-link"
                    style={{ fontSize: '1.2rem', background: 'transparent', border: 'none', textAlign: 'left', color: link.active ? 'var(--cyber-cyan)' : 'white' }}
                  >
                    {link.name}
                  </button>
                ))}
                {!user ? (
                  <button className="btn-primary" onClick={() => { onAuthClick(); setIsOpen(false); }} style={{ width: '100%' }}>LOG IN</button>
                ) : (
                  <button className="btn-outline" onClick={() => { onLogout(); setIsOpen(false); }} style={{ width: '100%' }}>LOG OUT</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
