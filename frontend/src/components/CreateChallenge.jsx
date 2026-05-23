import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Link, Award, Shield, Key, AlertTriangle, Upload, X, ArrowLeft, Send } from 'lucide-react';
import { api } from '../api';

const CreateChallenge = ({ onBack, onRefresh, currentUser }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Web');
  const [difficulty, setDifficulty] = useState('Easy');
  const [points, setPoints] = useState(100);
  const [flag, setFlag] = useState('');
  const [hint, setHint] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!/^(Cyber|MUCTF)\{.*\}$/.test(flag)) {
      setError('Flag must be of the form Cyber{flag_content} or MUCTF{flag_content}');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      await api.createChallenge({
        title,
        description,
        url,
        category,
        difficulty,
        points: Number(points),
        flag,
        hint,
        attachment
      });

      setSuccess(
        currentUser?.role === 'admin'
          ? 'Challenge created and auto-approved successfully!'
          : 'Challenge submitted successfully! It is now pending admin approval.'
      );

      // Reset
      setTitle('');
      setDescription('');
      setUrl('');
      setCategory('Web');
      setDifficulty('Easy');
      setPoints(100);
      setFlag('');
      setHint('');
      setAttachment(null);
      
      if (onRefresh) onRefresh();
      
      // Navigate back after delay
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit challenge');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <button 
        onClick={onBack}
        style={{
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          color: 'var(--cyber-cyan)',
          cursor: 'pointer',
          fontFamily: 'var(--font-orbitron)',
          fontWeight: 700,
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          marginTop: '4rem',
          marginBottom: '2rem',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.color = 'var(--cyber-purple)';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = 'var(--cyber-cyan)';
        }}
        className="animate-glow-pulse"
      >
        <ArrowLeft size={16} /> BACK TO DASHBOARD
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{
          padding: '3rem',
          background: 'rgba(5, 5, 5, 0.95)',
          border: '1px solid rgba(0, 243, 255, 0.15)',
          boxShadow: 'var(--neon-purple-shadow)',
          borderRadius: '1rem'
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '0.5rem', letterSpacing: '1px', fontFamily: 'var(--font-orbitron)' }}>
          CREATE NEW <span className="neon-text-cyan">CHALLENGE</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          {currentUser?.role === 'admin' 
            ? 'Publish a new CTF lab directly to all students.' 
            : 'Contribute a new CTF lab. It will be reviewed by administrators before going live.'}
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: '1rem',
              background: 'rgba(255, 0, 85, 0.1)',
              border: '1px solid var(--cyber-pink)',
              color: 'var(--cyber-pink)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem',
              fontSize: '0.9rem'
            }}
          >
            <AlertTriangle size={18} />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: '1rem',
              background: 'rgba(57, 255, 20, 0.1)',
              border: '1px solid rgb(57, 255, 20)',
              color: 'rgb(57, 255, 20)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-orbitron)',
              letterSpacing: '0.5px'
            }}
          >
            ✓ {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-orbitron)' }}>Challenge Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Broken Authentication Lab"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '0.95rem'
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-orbitron)' }}>Description & Objectives</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Explain the background story, target scope, and goals of this lab..."
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '0.95rem',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Target URL */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-orbitron)' }}>Target Laboratory URL (Optional)</label>
            <div style={{ position: 'relative' }}>
              <Link size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-cyan)' }} />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://labs.muctf.tech/auth-challenge"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          {/* Category, Difficulty & Points */}
          <div className="create-challenge-grid" style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-orbitron)' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: 'rgba(5,5,5,0.95)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '0.95rem'
                }}
              >
                <option value="Web">Web</option>
                <option value="Crypto">Crypto</option>
                <option value="Forensics">Forensics</option>
                <option value="General Knowledge">General Knowledge</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-orbitron)' }}>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: 'rgba(5,5,5,0.95)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '0.95rem'
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-orbitron)' }}>Points Value</label>
              <div style={{ position: 'relative' }}>
                <Award size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-purple)' }} />
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  required
                  min="50"
                  max="1000"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 2.75rem',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Hint */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-orbitron)' }}>Hint for Players (Optional)</label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="e.g. Inspect the session cookie or check the response headers..."
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '0.95rem'
              }}
            />
          </div>

          {/* Flag Key */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-orbitron)' }}>Secret Flag Key</label>
            <div style={{ position: 'relative' }}>
              <Key size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-cyan)' }} />
              <input
                type="text"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                required
                placeholder="e.g. Cyber{example_flag} or MUCTF{example_flag}"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontFamily: 'var(--font-orbitron)',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          {/* File Upload Attachment */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-orbitron)' }}>Challenge File / Code Package (Optional)</label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                width: '100%',
                padding: '1.25rem 1rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px dashed rgba(0, 243, 255, 0.25)',
                borderRadius: '0.5rem',
                color: attachment ? 'white' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'border 0.3s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <Upload size={18} color="var(--cyber-cyan)" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {attachment ? attachment.name : 'Choose a file to attach to this laboratory...'}
                </span>
              </span>
              {attachment && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setAttachment(null);
                  }}
                  style={{
                    background: 'transparent',
                    color: 'var(--cyber-pink)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>
              )}
              <input
                type="file"
                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
            </label>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              Maximum size limit is 10 megabytes.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              fontSize: '1rem',
              fontFamily: 'var(--font-orbitron)',
              fontWeight: 800,
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1rem'
            }}
          >
            <Send size={18} />
            {submitting ? 'COMMITTING TO REGISTER...' : (currentUser?.role === 'admin' ? 'PUBLISH CHALLENGE' : 'SUBMIT CHALLENGE FOR REVIEW')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateChallenge;
