import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Terminal, Database, Cpu, Globe, ChevronRight, X, Flag, AlertTriangle, Plus, Key, Trash2, Upload, Download, Paperclip, ExternalLink } from 'lucide-react';
import { api } from '../api';
import encFlagUrl from '../assets/enc_flag.txt?url';
import gardenUrl from '../assets/garden.jpg?url';
import logsUrl from '../assets/logs.txt?url';

const categories = ['All', 'Web', 'Crypto', 'Forensics', 'General Knowledge'];

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Web': return Database;
    case 'Crypto': return Shield;
    case 'Forensics': return Globe;
    case 'General Knowledge': return Terminal;
    default: return Key;
  }
};

const getChallengeFiles = (challengeId) => {
  switch (Number(challengeId)) {
    case 1: return { url: gardenUrl, name: 'garden.jpg' };
    case 3: return { url: encFlagUrl, name: 'enc_flag.txt' };
    case 4: return { url: logsUrl, name: 'logs.txt' };
    default: return null;
  }
};

const ChallengeCard = ({ challenge, onClick, isSolved }) => {
  const IconComponent = getCategoryIcon(challenge.category);
  const isPending = !challenge.is_approved;

  return (
    <motion.div
      layout
      className="glass-card"
      onClick={onClick}
      style={{
        padding: '2rem',
        borderColor: isPending 
          ? 'rgba(255, 0, 85, 0.3)' 
          : (isSolved ? 'rgba(57, 255, 20, 0.2)' : 'rgba(255, 255, 255, 0.1)'),
        background: 'var(--glass-bg)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: isPending
          ? '0 0 30px rgba(255, 0, 85, 0.2)'
          : (isSolved ? '0 0 30px rgba(57, 255, 20, 0.3)' : '0 0 30px rgba(0, 243, 255, 0.3)')
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '0.75rem',
            border: '1px solid ' + (isPending ? 'rgba(255, 0, 85, 0.3)' : (isSolved ? 'rgba(57, 255, 20, 0.2)' : 'rgba(255, 255, 255, 0.1)'))
          }}>
            <IconComponent size={24} color={isPending ? 'var(--cyber-pink)' : (isSolved ? 'rgb(57, 255, 20)' : 'var(--cyber-purple)')} />
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {challenge.category} • {challenge.difficulty}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {challenge.title}
              {isSolved && (
                <span style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.4rem',
                  background: 'rgba(57, 255, 20, 0.1)',
                  border: '1px solid rgba(57, 255, 20, 0.3)',
                  color: 'rgb(57, 255, 20)',
                  borderRadius: '3px',
                  fontFamily: 'var(--font-orbitron)',
                  textShadow: '0 0 5px rgba(57, 255, 20, 0.5)',
                  fontWeight: 800
                }}>
                  SOLVED
                </span>
              )}
              {isPending && (
                <span style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.4rem',
                  background: 'rgba(255, 0, 85, 0.1)',
                  border: '1px solid var(--cyber-pink)',
                  color: 'var(--cyber-pink)',
                  borderRadius: '3px',
                  fontFamily: 'var(--font-orbitron)',
                  textShadow: '0 0 5px rgba(255, 0, 85, 0.5)',
                  fontWeight: 800
                }}>
                  PENDING APPROVAL
                </span>
              )}
            </h3>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div className={isPending ? 'neon-text-pink' : (isSolved ? 'neon-text-green' : 'neon-text-purple')} style={{ fontWeight: 900, fontSize: '1.2rem', color: isPending ? 'var(--cyber-pink)' : (isSolved ? 'rgb(57, 255, 20)' : undefined) }}>{challenge.points}</div>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>PTS</span>
        </div>
      </div>

    </motion.div>
  );
};

const ChallengeModal = ({ challenge, isOpen, onClose, onSolve, isSolved, currentUser, onDeleteSuccess }) => {
  if (!challenge) return null;

  const [inputFlag, setInputFlag] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Reset helper toggles when target challenge changes
  useEffect(() => {
    setShowHint(false);
    setShowAnswer(false);
    setError('');
    setInputFlag('');
  }, [challenge]);

  const getLocalHint = (challenge) => {
    return challenge.hint || "No hint";
  };

  const fileAsset = challenge.attachment_url
    ? {
        url: challenge.attachment_url,
        name: challenge.attachment_name || 'challenge-file',
        size: challenge.attachment_size,
      }
    : getChallengeFiles(challenge.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!/^(Cyber|MUCTF)\{.*\}$/.test(inputFlag)) {
      setError('Flag must be of the form Cyber{flag_content} or MUCTF{flag_content}');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSolve(challenge.id, inputFlag);
      setInputFlag('');
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid flag. Attempt rejected.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this challenge permanently?")) {
      return;
    }
    try {
      setDeleting(true);
      setError('');
      await api.deleteChallenge(challenge.id);
      onDeleteSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete challenge');
    } finally {
      setDeleting(false);
    }
  };

  const handleShowHint = async () => {
    if (!showHint && !challenge.viewed_hint) {
      const confirmHint = window.confirm("Viewing the hint will reduce your points for this challenge by 50%. Proceed?");
      if (!confirmHint) return;
      try {
        await api.logHintView(challenge.id);
        challenge.viewed_hint = true;
      } catch (err) {
        console.error("Failed to log hint view:", err);
      }
    }
    setShowHint(!showHint);
  };

  const handleShowAnswer = async () => {
    if (!showAnswer && !challenge.viewed_answer) {
      const confirmAnswer = window.confirm("Revealing the answer will set your points earned for this challenge to 0. Proceed?");
      if (!confirmAnswer) return;
      try {
        await api.logAnswerView(challenge.id);
        challenge.viewed_answer = true;
      } catch (err) {
        console.error("Failed to log answer view:", err);
      }
    }
    setShowAnswer(!showAnswer);
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

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-card"
            style={{
              maxWidth: '900px',
              width: 'min(95vw, 900px)',
              position: 'relative',
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: '1fr 220px',
              gap: '2.5rem',
              alignItems: 'start',
              background: 'rgba(5, 5, 5, 0.95)'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--cyber-pink)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              <X size={20} />
            </button>

            {/* Left Column - Challenge Details */}
            <div>
              <span style={{
                color: 'var(--cyber-cyan)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-orbitron)',
                fontWeight: 800,
                letterSpacing: '1px'
              }}>
                {challenge.category} • {challenge.difficulty} • {challenge.points} PTS
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 950, color: 'white', marginTop: '0.5rem', marginBottom: '1.5rem', letterSpacing: '1px' }}>
                {challenge.title}
              </h3>
              
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '1rem',
                lineHeight: 1.6,
                marginBottom: challenge.url ? '1rem' : '2rem'
              }}>
                {challenge.description}
              </p>

              {challenge.url && (
                <a
                  href={challenge.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--cyber-cyan)',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    marginBottom: '2rem',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                    overflowWrap: 'anywhere'
                  }}
                >
                  {challenge.url}
                  <ExternalLink size={15} />
                </a>
              )}

              {/* Creator details */}
              {challenge.creator && (
                <div style={{ marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Challenge Contributor: <span style={{ color: 'var(--cyber-purple)', fontWeight: 700 }}>{challenge.creator.name}</span>
                </div>
              )}

              {fileAsset && (
                <a
                  href={fileAsset.url}
                  download={fileAsset.name}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: '2rem',
                    padding: '0.9rem 1rem',
                    background: 'rgba(0, 243, 255, 0.06)',
                    border: '1px solid rgba(0, 243, 255, 0.25)',
                    borderRadius: '0.5rem',
                    color: 'var(--cyber-cyan)',
                    fontFamily: 'var(--font-orbitron)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                    <Paperclip size={16} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {fileAsset.name}
                    </span>
                  </span>
                  <Download size={16} style={{ flexShrink: 0 }} />
                </a>
              )}

              {/* Flag Submission Form or Solved State */}
              {isSolved ? (
                <div style={{
                  padding: '1.25rem',
                  background: 'rgba(57, 255, 20, 0.08)',
                  border: '1px solid rgba(57, 255, 20, 0.3)',
                  color: 'rgb(57, 255, 20)',
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  fontFamily: 'var(--font-orbitron)',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  textShadow: '0 0 5px rgba(57, 255, 20, 0.3)',
                  marginBottom: '2rem'
                }}>
                  ✓ CHALLENGE SOLVED - EXPLOIT VERIFIED
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <Flag size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-cyan)' }} />
                    <input
                      type="text"
                      placeholder="Cyber{flag_here} or MUCTF{flag_here}"
                      value={inputFlag}
                      onChange={(e) => setInputFlag(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem 0.8rem 2.5rem',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(0, 243, 255, 0.2)',
                        borderRadius: '0.5rem',
                        color: 'white',
                        fontFamily: 'var(--font-orbitron)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1.5rem',
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-orbitron)',
                      fontWeight: 700
                    }}
                  >
                    {submitting ? 'VERIFYING...' : 'SUBMIT FLAG'}
                  </button>
                </form>
              )}

              {error && (
                <div style={{
                  marginBottom: '2rem',
                  color: 'var(--cyber-pink)',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem',
                  background: 'rgba(255, 105, 180, 0.05)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 105, 180, 0.2)'
                }}>
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}
            </div>

            {/* Right Column - Hint & Reveal Answer */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '1.5rem',
              background: 'rgba(0, 243, 255, 0.03)',
              border: '1px solid rgba(0, 243, 255, 0.1)',
              borderRadius: '0.75rem',
              height: 'fit-content',
              position: 'sticky',
              top: '2rem',
              alignItems: 'stretch',
              justifyContent: 'center',
              width: '100%'
            }}>
              <button
                type="button"
                onClick={handleShowHint}
                style={{
                  padding: '0.6rem 0.8rem',
                  background: showHint ? 'rgba(0, 243, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid ' + (showHint ? 'rgba(0, 243, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)'),
                  borderRadius: '0.5rem',
                  color: 'var(--cyber-cyan)',
                  fontFamily: 'var(--font-orbitron)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  textAlign: 'center'
                }}
              >
                {showHint ? '✕ Hide Hint' : (challenge.viewed_hint ? '? Show Hint' : '? Hint (-50% pts)')}
              </button>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(0, 243, 255, 0.08)',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    lineHeight: 1.4,
                    fontFamily: 'var(--font-body)',
                    textAlign: 'center'
                  }}
                >
                  {getLocalHint(challenge)}
                </motion.div>
              )}

              {/* Reveal Flag/Answer Button - Available to all logged-in players */}
              {currentUser && (
                <>
                  <button
                    type="button"
                    onClick={handleShowAnswer}
                    style={{
                      padding: '0.6rem 0.8rem',
                      background: showAnswer ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid ' + (showAnswer ? 'rgba(57, 255, 20, 0.5)' : 'rgba(255, 255, 255, 0.1)'),
                      borderRadius: '0.5rem',
                      color: showAnswer ? 'rgb(57, 255, 20)' : 'var(--cyber-purple)',
                      fontFamily: 'var(--font-orbitron)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      whiteSpace: 'nowrap',
                      textAlign: 'center'
                    }}
                  >
                    {showAnswer ? '✕ Hide Answer' : (challenge.viewed_answer ? '🔑 Show Answer' : '🔑 Answer (0 pts)')}
                  </button>

                  {showAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        padding: '0.75rem',
                        background: 'rgba(57, 255, 20, 0.08)',
                        border: '1px solid rgba(57, 255, 20, 0.3)',
                        borderRadius: '0.5rem',
                        color: 'rgb(57, 255, 20)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        fontFamily: 'var(--font-orbitron)',
                        textAlign: 'center',
                        wordBreak: 'break-all'
                      }}
                    >
                      {challenge.flag}
                    </motion.div>
                  )}
                </>
              )}

              {/* Delete button (only visible to admins or challenge creators) */}
              {currentUser && (currentUser.role === 'admin' || challenge.creator_id === currentUser.id) && (
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  style={{
                    padding: '0.6rem 0.8rem',
                    background: 'rgba(255, 0, 85, 0.1)',
                    border: '1px solid var(--cyber-pink)',
                    borderRadius: '0.5rem',
                    color: 'var(--cyber-pink)',
                    fontFamily: 'var(--font-orbitron)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    marginTop: '1rem'
                  }}
                >
                  <Trash2 size={12} /> {deleting ? 'DELETING...' : 'DELETE'}
                </button>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ContributeModal = ({ isOpen, onClose, onRefresh }) => {
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
      // Clear forms
      setTitle('');
      setDescription('');
      setUrl('');
      setCategory('Web');
      setDifficulty('Easy');
      setPoints(100);
      setFlag('');
      setHint('');
      setAttachment(null);
      onRefresh();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add challenge');
    } finally {
      setSubmitting(false);
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

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-card"
            style={{
              maxWidth: '600px',
              width: '100%',
              position: 'relative',
              padding: '2.5rem',
              background: 'rgba(5, 5, 5, 0.95)',
              borderColor: 'var(--cyber-purple)',
              boxShadow: 'var(--neon-purple-shadow)'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 950, marginBottom: '1.5rem', letterSpacing: '1px', fontFamily: 'var(--font-orbitron)', color: 'white' }}>
              ADD NEW <span className="neon-text-purple">CHALLENGE</span>
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-orbitron)' }}>Challenge Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. SQL Injection Lab"
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-orbitron)' }}>Description & Lore</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Details of the challenge and flag hint..."
                  style={{ width: '100%', minHeight: '80px', padding: '0.6rem 0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-orbitron)' }}>Challenge URL (Optional)</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/challenge"
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-orbitron)' }}>Hint for Players (Optional)</label>
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="e.g. Check details or metadata..."
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-orbitron)' }}>Challenge File (Optional)</label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    width: '100%',
                    padding: '0.75rem 0.8rem',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px dashed rgba(0, 243, 255, 0.25)',
                    borderRadius: '0.5rem',
                    color: attachment ? 'white' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                    <Upload size={16} color="var(--cyber-cyan)" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {attachment ? attachment.name : 'Attach a file for players to download'}
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
                        lineHeight: 0
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                  <input
                    type="file"
                    onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                  />
                </label>
                <p style={{ marginTop: '0.4rem', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  Max upload size: 10 MB
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-orbitron)' }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(5,5,5,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  >
                    <option value="Web">Web</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Forensics">Forensics</option>
                    <option value="General Knowledge">General Knowledge</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-orbitron)' }}>Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(5,5,5,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-orbitron)' }}>Points Value</label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    required
                    min="50"
                    max="1000"
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-orbitron)' }}>Secret Flag Key</label>
                  <input
                    type="text"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    required
                    placeholder="Cyber{flag} or MUCTF{flag}"
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
              </div>

              {error && (
                <div style={{ color: 'var(--cyber-pink)', fontSize: '0.8rem', padding: '0.5rem', background: 'rgba(255, 105, 180, 0.05)', border: '1px solid rgba(255, 105, 180, 0.2)', borderRadius: '0.25rem' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
                style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', fontFamily: 'var(--font-orbitron)', fontWeight: 800 }}
              >
                {submitting ? 'SAVING CHALLENGE...' : 'CREATE CHALLENGE'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Challenges = ({ currentUser, onPointsUpdate, solvedChallenges = [], onNavigateToCreate }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchChallenges = async () => {
    try {
      const data = await api.getChallenges();
      setChallenges(data);
    } catch (err) {
      console.error('Failed to load challenges from backend database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const isAdmin = currentUser && currentUser.role === 'admin';

  // For admins, separate pending challenges from approved challenges
  // For others, all returned challenges from backend (approved + their own pending) are shown in main list
  const pendingChallenges = isAdmin ? challenges.filter(c => !c.is_approved) : [];
  const approvedChallenges = isAdmin ? challenges.filter(c => c.is_approved) : challenges;

  const filteredChallenges = filter === 'All'
    ? approvedChallenges
    : approvedChallenges.filter(c => c.category === filter);

  const handleChallengeClick = (challenge) => {
    setSelectedChallenge(challenge);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedChallenge(null);
  };

  const canContribute = currentUser && (currentUser.role === 'admin' || currentUser.can_create_challenges);

  return (
    <section id="challenges" style={{ padding: '8rem 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 950, marginBottom: '1.5rem' }}>
            CTF <span className="neon-text-cyan">CHALLENGES</span>
          </h2>
          <div style={{
            width: '8rem',
            height: '5px',
            background: 'linear-gradient(to right, var(--cyber-cyan), var(--cyber-purple))',
            margin: '0 auto',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(0, 243, 255, 0.5)'
          }}></div>
        </div>

        {/* Admin Pending Approvals Dashboard */}
        {isAdmin && pendingChallenges.length > 0 && (
          <div style={{
            marginBottom: '5rem',
            padding: '2.5rem',
            background: 'rgba(255, 170, 0, 0.02)',
            border: '1px solid rgba(255, 170, 0, 0.15)',
            borderRadius: '1rem',
            boxShadow: '0 0 40px rgba(255, 170, 0, 0.05)'
          }}>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 900,
              marginBottom: '2rem',
              fontFamily: 'var(--font-orbitron)',
              color: '#ffaa00',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              letterSpacing: '1px'
            }}>
              <AlertTriangle color="#ffaa00" size={24} /> PENDING CTF LAB APPROVALS
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
              {pendingChallenges.map(pendingChallenge => (
                <div 
                  key={pendingChallenge.id} 
                  className="glass-card animate-glow-pulse" 
                  style={{ 
                    padding: '2rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    borderColor: 'rgba(255, 170, 0, 0.25)',
                    background: 'rgba(5, 5, 5, 0.85)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'var(--font-orbitron)' }}>
                        {pendingChallenge.category} • {pendingChallenge.difficulty}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: '#ffaa00', fontWeight: 900, fontFamily: 'var(--font-orbitron)' }}>
                        {pendingChallenge.points} PTS
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: 'white' }}>
                      {pendingChallenge.title}
                    </h4>
                    <p style={{ 
                      fontSize: '0.9rem', 
                      color: 'var(--text-muted)', 
                      lineHeight: 1.5,
                      marginBottom: '1.5rem', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 3, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden' 
                    }}>
                      {pendingChallenge.description}
                    </p>
                    {pendingChallenge.creator && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Contributor: <span style={{ color: 'var(--cyber-purple)', fontWeight: 700 }}>{pendingChallenge.creator.name}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={async () => {
                        if (window.confirm(`Approve "${pendingChallenge.title}"? It will go live immediately.`)) {
                          try {
                            await api.approveChallenge(pendingChallenge.id);
                            fetchChallenges();
                          } catch (err) {
                            alert(err.message || 'Failed to approve challenge');
                          }
                        }
                      }}
                      className="btn-primary" 
                      style={{ 
                        flex: 1, 
                        padding: '0.75rem', 
                        fontSize: '0.8rem', 
                        fontFamily: 'var(--font-orbitron)', 
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, rgb(57, 255, 20) 0%, rgb(0, 200, 0) 100%)', 
                        border: 'none', 
                        boxShadow: '0 0 15px rgba(57, 255, 20, 0.25)',
                        cursor: 'pointer'
                      }}
                    >
                      APPROVE
                    </button>
                    <button 
                      onClick={async () => {
                        if (window.confirm(`Reject and delete "${pendingChallenge.title}" permanently?`)) {
                          try {
                            await api.deleteChallenge(pendingChallenge.id);
                            fetchChallenges();
                          } catch (err) {
                            alert(err.message || 'Failed to reject challenge');
                          }
                        }
                      }}
                      style={{ 
                        flex: 1, 
                        padding: '0.75rem', 
                        fontSize: '0.8rem', 
                        fontFamily: 'var(--font-orbitron)', 
                        fontWeight: 800,
                        background: 'rgba(255, 0, 85, 0.05)', 
                        border: '1px solid var(--cyber-pink)', 
                        color: 'var(--cyber-pink)', 
                        borderRadius: '0.5rem', 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 0, 85, 0.15)';
                        e.target.style.boxShadow = '0 0 15px rgba(255, 0, 85, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 0, 85, 0.05)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '2rem',
                background: filter === cat ? 'var(--cyber-purple)' : 'rgba(255, 255, 255, 0.03)',
                border: '1px solid',
                borderColor: filter === cat ? 'var(--cyber-purple)' : 'rgba(255, 255, 255, 0.1)',
                color: filter === cat ? 'white' : 'var(--text-muted)',
                fontFamily: 'var(--font-orbitron)',
                fontSize: '0.75rem',
                fontWeight: 700,
                transition: 'all 0.3s ease',
                boxShadow: filter === cat ? 'var(--neon-purple-shadow)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', fontFamily: 'var(--font-orbitron)', color: 'var(--text-muted)' }}>
            LOADING CHALLENGES...
          </div>
        ) : filteredChallenges.length === 0 && !canContribute ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', fontFamily: 'var(--font-orbitron)', color: 'var(--text-muted)' }}>
            NO ACTIVE CHALLENGES DETECTED IN THIS CATEGORY.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            {filteredChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isSolved={solvedChallenges.includes(challenge.id)}
                onClick={() => handleChallengeClick(challenge)}
              />
            ))}

            {canContribute && (
              <motion.div
                layout
                className="glass-card"
                onClick={onNavigateToCreate}
                style={{
                  padding: '2rem',
                  border: '2px dashed rgba(188, 19, 254, 0.4)',
                  background: 'rgba(188, 19, 254, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '160px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  gap: '0.75rem'
                }}
                whileHover={{
                  scale: 1.02,
                  background: 'rgba(188, 19, 254, 0.05)',
                  borderColor: 'var(--cyber-purple)',
                  boxShadow: '0 0 30px rgba(188, 19, 254, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{
                  paddingRight: '0.5rem',
                  paddingLeft: '0.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.1rem',
                  background: 'rgba(188, 19, 254, 0.1)',
                  borderRadius: '50%',
                  border: '1px solid rgba(188, 19, 254, 0.3)'
                }}>
                  <Plus size={28} color="var(--cyber-purple)" />
                </div>
                <span style={{
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-orbitron)',
                  fontWeight: 800,
                  color: 'var(--cyber-purple)',
                  letterSpacing: '1px'
                }}>
                  ADD NEW CHALLENGE
                </span>
              </motion.div>
            )}
          </div>
        )}

        <ChallengeModal
          challenge={selectedChallenge}
          isOpen={modalOpen}
          onClose={handleModalClose}
          onSolve={onPointsUpdate}
          isSolved={selectedChallenge && solvedChallenges.includes(selectedChallenge.id)}
          currentUser={currentUser}
          onDeleteSuccess={fetchChallenges}
        />
      </div>
    </section>
  );
};

export default Challenges;
