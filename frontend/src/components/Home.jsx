import { motion } from 'framer-motion';
import { Zap, ChevronRight, Activity } from 'lucide-react';

const Home = ({ onGetStarted, onViewChange }) => {
  return (
    <section id="home" className="home-section">
      <div className="home-grid"></div>
      
      {/* Dynamic Background Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: '40rem',
          height: '40rem',
          background: 'radial-gradient(circle, rgba(188, 19, 254, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      ></motion.div>

      <div className="container home-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 1.25rem',
            borderRadius: '3rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '2.5rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Activity size={18} className="neon-text-cyan" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '3px', color: 'var(--cyber-cyan)', textTransform: 'uppercase' }}>
            CTF Training Platform Active: v4.2.0
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="home-title"
        >
          ENTER THE <br />
          <span className="neon-text-purple animate-glow-pulse" style={{ fontSize: '1.1em' }}>CYBER DUNGEON</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="home-subtitle"
        >
          Your friendly gateway to the world of cyber security. 
          Learn, practice, and master CTF challenges in a safe, 
          hands-on environment designed for learning and growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <button 
            className="btn-primary" 
            onClick={onGetStarted}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            GET STARTED <ChevronRight size={22} />
          </button>
          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} onClick={() => onViewChange('lessons')}>
            <Zap size={22} /> START LEARNING
          </button>
        </motion.div>
      </div>

      {/* Decorative Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -30, 0], 
          rotate: [45, 60, 45],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '25%',
          right: '8%',
          width: '10rem',
          height: '10rem',
          border: '1.5px solid var(--cyber-cyan)',
          borderRadius: '1.5rem',
          boxShadow: 'var(--neon-cyan-shadow)',
          pointerEvents: 'none'
        }}
      ></motion.div>
      
      <motion.div
        animate={{ 
          x: [0, 20, 0],
          y: [0, 40, 0],
          rotate: [-20, -10, -20],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: '12rem',
          height: '12rem',
          border: '1.5px solid var(--cyber-purple)',
          borderRadius: '50%',
          boxShadow: 'var(--neon-purple-shadow)',
          pointerEvents: 'none'
        }}
      ></motion.div>
    </section>
  );
};

export default Home;
