import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Zap, Download, Paperclip } from 'lucide-react';
import { useState, useEffect } from 'react';
import { lessonData } from '../data/lessons';

const InlineText = ({ children }) => {
  const text = String(children);
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);

  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={index} style={{ color: 'white', fontWeight: 850 }}>{token.slice(2, -2)}</strong>;
    }

    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={index} style={{ color: 'var(--cyber-cyan)', fontStyle: 'italic' }}>{token.slice(1, -1)}</em>;
    }

    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={index}
          style={{
            padding: '0.12rem 0.35rem',
            borderRadius: '0.25rem',
            background: 'rgba(0, 243, 255, 0.08)',
            border: '1px solid rgba(0, 243, 255, 0.18)',
            color: 'var(--cyber-cyan)',
            fontFamily: 'monospace',
            fontSize: '0.95em'
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    return <span key={index}>{token}</span>;
  });
};

const RichText = ({ text }) => {
  const blocks = String(text)
    .trim()
    .split(/\n\s*\n/g)
    .map(block => block.trim())
    .filter(Boolean);

  return (
    <div style={{ display: 'grid', gap: '1.35rem' }}>
      {blocks.map((block, index) => {
        const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
        const numbered = lines.every(line => /^\d+\.\s+/.test(line));
        const bulleted = lines.every(line => /^[-*]\s+/.test(line));

        if (numbered) {
          return (
            <ol key={index} style={{ margin: 0, paddingLeft: '1.4rem', color: 'var(--text-main)', lineHeight: 1.85 }}>
              {lines.map(line => (
                <li key={line} style={{ paddingLeft: '0.35rem', marginBottom: '0.45rem' }}>
                  <InlineText>{line.replace(/^\d+\.\s+/, '')}</InlineText>
                </li>
              ))}
            </ol>
          );
        }

        if (bulleted) {
          return (
            <ul key={index} style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-main)', lineHeight: 1.85 }}>
              {lines.map(line => (
                <li key={line} style={{ paddingLeft: '0.35rem', marginBottom: '0.45rem' }}>
                  <InlineText>{line.replace(/^[-*]\s+/, '')}</InlineText>
                </li>
              ))}
            </ul>
          );
        }

        if (lines.length === 1 && /:\s*$/.test(lines[0])) {
          return (
            <h3
              key={index}
              style={{
                margin: '0.4rem 0 0',
                color: 'var(--cyber-cyan)',
                fontSize: '1.05rem',
                fontWeight: 900,
                letterSpacing: '1px'
              }}
            >
              <InlineText>{lines[0].replace(/:\s*$/, '')}</InlineText>
            </h3>
          );
        }

        return (
          <p key={index} style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.06rem', lineHeight: 1.9 }}>
            {lines.map((line, lineIndex) => (
              <span key={`${line}-${lineIndex}`}>
                {lineIndex > 0 && <br />}
                <InlineText>{line}</InlineText>
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
};

const LessonDetail = ({ lessonTitle, onBack }) => {
  const lesson = lessonData.find(l => l.title === lessonTitle);
  const [currentPage, setCurrentPage] = useState(0); 
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState(null); 
  const [showFlagMessage, setShowFlagMessage] = useState(false);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  // Reset state when lesson changes
  useEffect(() => {
    setCurrentPage(0);
    setFlagInput('');
    setFlagStatus(null);
    setShowFlagMessage(false);
    setIsLessonComplete(false);
  }, [lessonTitle]);

  if (!lesson) {
    return (
      <section style={{ padding: '8rem 0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-muted)' }}>Lesson not found</p>
        </div>
      </section>
    );
  }

  const IconComponent = lesson.icon;
  const hasChallenge = lesson.challenges && lesson.flag;
  const totalPages = (lesson.parts?.length || 0) + 1 + (hasChallenge ? 1 : 0); 
  const isOnChallengePage = hasChallenge && currentPage === (lesson.parts?.length || 0) + 1;

  const handleFlagSubmit = () => {
    if (flagInput.trim().toUpperCase() === lesson.flag.toUpperCase()) {
      setFlagStatus('correct');
      setIsLessonComplete(true);
    } else {
      setFlagStatus('incorrect');
    }
    setShowFlagMessage(true);
    setTimeout(() => {
      setShowFlagMessage(false);
    }, 4000);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      if (isOnChallengePage && flagStatus !== 'correct') return;
      
      setCurrentPage(prev => prev + 1);
      // Reset flag message/status when navigating away from challenge
      if (isOnChallengePage) {
        setFlagInput('');
        setFlagStatus(null);
      }
      
      // Mark complete if no challenge and reached end
      if (!hasChallenge && currentPage + 1 === totalPages - 1) {
        setIsLessonComplete(true);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <section style={{ padding: '8rem 0', minHeight: '100vh' }}>
      <div className="container">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '3rem',
            background: 'transparent',
            color: 'var(--cyber-cyan)',
            fontSize: '1rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem 0'
          }}
          whileHover={{ x: -5 }}
        >
          <ChevronLeft size={20} /> Back to Lessons
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          key={`${lesson.id}-${currentPage}`}
        >
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '2rem',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.035), rgba(0, 243, 255, 0.025))'
          }}>
            <div style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '1rem',
              background: `${lesson.color}11`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${lesson.color}33`,
              flexShrink: 0,
              boxShadow: `0 0 20px ${lesson.color}11`
            }}>
              <IconComponent size={32} color={lesson.color} />
            </div>

            <div style={{ flex: 1, minWidth: 'min(100%, 300px)' }}>
              <p style={{ color: lesson.color, fontSize: '0.78rem', fontFamily: 'var(--font-orbitron)', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Learning Track
              </p>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, marginBottom: '1rem', lineHeight: 1.1 }}>
                {lesson.title}
              </h1>
              <p style={{ maxWidth: '52rem', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.4rem' }}>
                {lesson.description}
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontWeight: 700
                }}>
                  {lesson.category} • {lesson.duration}
                </p>
                <div style={{ 
                  padding: '0.4rem 1rem', 
                  borderRadius: '2rem', 
                  background: 'rgba(0, 243, 255, 0.05)',
                  border: '1px solid rgba(0, 243, 255, 0.2)',
                  fontSize: '0.75rem',
                  color: 'var(--cyber-cyan)',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  letterSpacing: '1px'
                }}>
                  {currentPage === 0 ? 'Overview' : isOnChallengePage ? 'Challenge' : `Module ${currentPage} / ${lesson.parts?.length || 0}`}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)', marginBottom: '3rem', minHeight: '300px' }}>
            {currentPage === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p style={{ color: lesson.color, fontSize: '0.76rem', fontFamily: 'var(--font-orbitron)', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                  Course Objective
                </p>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.65rem)', fontWeight: 950, marginBottom: '1.2rem', color: 'white', lineHeight: 1.12 }}>
                  Build a repeatable CTF workflow
                </h2>
                <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-main)', maxWidth: '56rem' }}>
                  {lesson.description}
                </p>
                
                {lesson.parts && (
                  <div style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Learning Path
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                      {lesson.parts.map((_, idx) => (
                        <div key={idx} style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--cyber-cyan)', fontWeight: 800 }}>MODULE 0{idx + 1}</span>
                          <p style={{ fontSize: '0.95rem', marginTop: '0.5rem', color: 'white', fontWeight: 750 }}>
                            {lesson.moduleTitles?.[idx] || 'Foundational Concepts'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : isOnChallengePage ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <Zap size={24} className="neon-text-purple" />
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--cyber-purple)' }}>
                    FINAL CHALLENGE
                  </h2>
                </div>
                
                <div style={{ 
                  background: 'rgba(188, 19, 254, 0.03)', 
                  padding: '2rem', 
                  borderRadius: '1rem', 
                  border: '1px solid rgba(188, 19, 254, 0.1)',
                  marginBottom: '2.5rem' 
                }}>
                  <RichText text={lesson.challenges} />
                </div>

                {lesson.challengeFile && (
                  <a
                    href={lesson.challengeFile.url}
                    download={lesson.challengeFile.name}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      maxWidth: '600px',
                      marginBottom: '2.5rem',
                      padding: '0.9rem 1rem',
                      background: 'rgba(0, 243, 255, 0.06)',
                      border: '1px solid rgba(0, 243, 255, 0.25)',
                      borderRadius: '0.5rem',
                      color: 'var(--cyber-cyan)',
                      fontFamily: 'var(--font-orbitron)',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      letterSpacing: '0.5px'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                      <Paperclip size={16} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lesson.challengeFile.name}
                      </span>
                    </span>
                    <Download size={16} style={{ flexShrink: 0 }} />
                  </a>
                )}

                <div style={{ maxWidth: '600px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '2px' }}>
                    ENTER FLAG
                  </label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                      type="text"
                      value={flagInput}
                      onChange={(e) => setFlagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleFlagSubmit()}
                      placeholder="picoCTF{...}"
                      disabled={isLessonComplete}
                      style={{
                        flex: 1,
                        padding: '1.25rem',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.75rem',
                        color: 'white',
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s'
                      }}
                    />
                    {!isLessonComplete && (
                      <button 
                        onClick={handleFlagSubmit}
                        className="btn-primary"
                        style={{ padding: '0 2rem' }}
                      >
                        SUBMIT
                      </button>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {showFlagMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                          marginTop: '1.5rem',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          background: flagStatus === 'correct' ? 'rgba(0, 255, 0, 0.05)' : 'rgba(255, 0, 0, 0.05)',
                          border: `1px solid ${flagStatus === 'correct' ? '#00FF0033' : '#FF000033'}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          color: flagStatus === 'correct' ? '#00FF00' : '#FF0000',
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}
                      >
                        {flagStatus === 'correct' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {flagStatus === 'correct' ? 'AUTHENTICATION SUCCESSFUL' : 'ACCESS DENIED: INVALID FLAG'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--cyber-cyan)', letterSpacing: '2px' }}>
                  MODULE 0{currentPage}
                </h2>
                <h3 style={{ fontSize: 'clamp(1.45rem, 3vw, 2.1rem)', fontWeight: 950, marginBottom: '2rem', color: 'white', letterSpacing: '1px' }}>
                  {lesson.moduleTitles?.[currentPage - 1] || 'Foundational Concepts'}
                </h3>
                <RichText text={lesson.parts[currentPage - 1]} />
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {isLessonComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.05), rgba(0, 243, 255, 0.05))',
                  border: '1px solid #00FF0044',
                  borderRadius: '1.25rem',
                  padding: '2.5rem',
                  textAlign: 'center',
                  marginBottom: '3rem',
                  boxShadow: '0 0 30px rgba(0, 255, 0, 0.05)'
                }}
              >
                <div style={{ width: '4rem', height: '4rem', background: 'rgba(0, 255, 0, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle size={32} color="#00FF00" />
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 950, color: '#00FF00', marginBottom: '0.75rem', letterSpacing: '2px' }}>
                  PROTOCOL COMPLETE
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                  You have successfully mastered this learning module. Return to the hub to continue your training.
                </p>
                <button 
                  onClick={onBack}
                  className="btn-outline"
                  style={{ marginTop: '2rem', borderColor: '#00FF0033', color: '#00FF00' }}
                >
                  RETURN TO HUB
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                opacity: currentPage === 0 ? 0.3 : 1,
                padding: '0.75rem 1.5rem',
                fontSize: '0.8rem'
              }}
            >
              <ChevronLeft size={18} /> PREVIOUS
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <div 
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: i === currentPage ? 'var(--cyber-cyan)' : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: i === currentPage ? 'var(--neon-cyan-shadow)' : 'none',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1 || (isOnChallengePage && !isLessonComplete)}
              className="btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                opacity: (currentPage === totalPages - 1 || (isOnChallengePage && !isLessonComplete)) ? 0.3 : 1,
                padding: '0.75rem 1.5rem',
                fontSize: '0.8rem'
              }}
            >
              NEXT <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LessonDetail;
