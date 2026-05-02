import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Zap } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Frontend only: simulate login
    onLogin({ username: username || email.split('@')[0], email });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          width: '100%',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)'
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-card"
            style={{
              width: '50%',
              maxW: '450px',
              padding: '3rem',
              position: 'relative',
              zIndex: 1,
              borderColor: isLogin ? 'var(--cyber-purple)' : 'var(--cyber-cyan)',
              boxShadow: isLogin ? '0 0 40px rgba(188, 19, 254, 0.1)' : '0 0 40px rgba(0, 243, 255, 0.1)'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'transparent',
                color: 'var(--text-muted)'
              }}
            >
              <X size={24} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                {isLogin ? 'ACCESS' : 'INITIALIZE'} <span className={isLogin ? 'neon-text-purple' : 'neon-text-cyan'}>
                  {isLogin ? 'TERMINAL' : 'NODE'}
                </span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {isLogin ? 'Enter your credentials to link neural interface' : 'Register your neural signature on the network'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {!isLogin && (
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-cyan)' }} />
                  <input
                    type="text"
                    placeholder="USERNAME"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.75rem',
                      color: 'white',
                      fontFamily: 'var(--font-orbitron)',
                      fontSize: '0.8rem'
                    }}
                  />
                </div>
              )}

              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: isLogin ? 'var(--cyber-purple)' : 'var(--cyber-cyan)' }} />
                <input
                  type="email"
                  placeholder="NEURAL@NETWORK.COM"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    color: 'white',
                    fontFamily: 'var(--font-orbitron)',
                    fontSize: '0.8rem'
                  }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: isLogin ? 'var(--cyber-purple)' : 'var(--cyber-cyan)' }} />
                <input
                  type="password"
                  placeholder="ENCRYPTED_KEY"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    color: 'white',
                    fontFamily: 'var(--font-orbitron)',
                    fontSize: '0.8rem'
                  }}
                />
              </div>

              <button
                type="submit"
                className={isLogin ? 'btn-primary' : 'btn-outline'}
                style={{ width: '100%', padding: '1.25rem', marginTop: '1rem' }}
              >
                {isLogin ? 'INITIALIZE LINK' : 'CREATE NODE'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-orbitron)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                {isLogin ? "Don't have a node? Create one" : "Already registered? Initialize link"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
