import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, AlertTriangle } from 'lucide-react';
import { api } from '../api';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const response = await api.login(email, password);
        api.setToken(response.token);
        onLogin(response.user);
      } else {
        const response = await api.register(username, email, password);
        api.setToken(response.token);
        onLogin(response.user);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
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
              width: '100%',
              maxWidth: '450px',
              padding: '3rem',
              position: 'relative',
              zIndex: 1,
              borderColor: isLogin ? 'var(--cyber-purple)' : 'var(--cyber-cyan)',
              boxShadow: isLogin ? '0 0 40px rgba(188, 19, 254, 0.1)' : '0 0 40px rgba(0, 243, 255, 0.1)',
              background: 'rgba(5, 5, 5, 0.95)'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', color: 'white' }}>
                USER <span className={isLogin ? 'neon-text-purple' : 'neon-text-cyan'}>
                  {isLogin ? 'LOGIN' : 'REGISTER'}
                </span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {isLogin ? 'Enter your credentials to access your account' : 'Create an account to start solving CTF challenges'}
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
                      background: 'rgba(0, 0, 0, 0.4)',
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
                {isLogin ? (
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-purple)' }} />
                ) : (
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-cyan)' }} />
                )}
                <input
                  type={isLogin ? "text" : "email"}
                  placeholder={isLogin ? "EMAIL OR USERNAME" : "EMAIL ADDRESS"}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem',
                    background: 'rgba(0, 0, 0, 0.4)',
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
                  placeholder="PASSWORD"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    color: 'white',
                    fontFamily: 'var(--font-orbitron)',
                    fontSize: '0.8rem'
                  }}
                />
              </div>

              {error && (
                <div style={{
                  color: 'var(--cyber-pink)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: 'rgba(255, 105, 180, 0.1)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 105, 180, 0.2)',
                  fontFamily: 'var(--font-orbitron)'
                }}>
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className={isLogin ? 'btn-primary' : 'btn-outline'}
                style={{ width: '100%', padding: '1.25rem', marginTop: '1rem', fontWeight: 800, fontFamily: 'var(--font-orbitron)' }}
              >
                {isLogin ? 'LOG IN' : 'REGISTER'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-orbitron)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer'
                }}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
