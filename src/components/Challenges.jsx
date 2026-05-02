import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Terminal, Database, Cpu, Globe, ChevronRight, X, Flag, AlertTriangle } from 'lucide-react';

const challengeData = [
  {
    id: 1,
    title: 'Hidden Information',
    category: 'Forensics',
    difficulty: 'Easy',
    points: 100,
    files:"assets/cat.jpg",
    description: 'Files can always be changed in a secret way. Can you find the flag?',
    hint: 'Look at the details of the file',
    flag: 'CYBER{the_m3tadata_1s_modified}',
    icon: Globe
  },
  {
    id: 2,
    title: 'rotation',
    category: 'Crypto',
    difficulty: 'Easy',
    points: 100,
    description: 'You will find the flag after decrypting this: UQTWJ{j0lsl1gf_v3ujqhl3v_429sx00x}',
    hint: 'Sometimes rotation is right',
    flag: 'CYBER{caesar_d3cr9pt3d_f0212758}',
    icon: Shield
  },
  {
    id: 3,
    title: 'interencdec',
    category: 'Crypto',
    difficulty: 'Medium',
    points: 200,
    files:"assets/enc_flag.txt",
    description: 'Can you get the real meaning from this file.',
    hint: 'Engaging in various decoding processes is of utmost importance',
    flag: 'CYBER{pwn_th3_dung30n_c0r3}',
    icon: Cpu
  },
  {
    id: 4,
    title: 'Log Hunt',
    category: 'General Knowledge',
    difficulty: 'Medium',
    points: 200,
    files:"assets/logs.txt",
    description: 'A compiled binary was found in the dungeon. Analyze its logic to extract the secret protocol key.',
    hint: 'The key is XORed with 0x42.',
    flag: 'CYBER{r3v3rs3_3ng1n33r1ng_pro}',
    icon: Terminal
  },
  {
    id: 5,
    title: 'Database Breach',
    category: 'Web',
    difficulty: 'Hard',
    points: 300,
    description: 'The user database has a vulnerable search field. Extract the flag from the "system_secrets" table.',
    hint: 'challenge not set yet, to be implemented',
    flag: 'CYBER{sql_1nj3ct10n_succ3ss}',
    icon: Database
  }
];

const categories = ['All', 'Web', 'Crypto', 'Forensics', 'General Knowledge'];

const ChallengeCard = ({ challenge, onClick }) => {
  return (
    <motion.div
      layout
      className="glass-card"
      onClick={onClick}
      style={{
        padding: '2rem',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        background: 'var(--glass-bg)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 0 30px rgba(0, 243, 255, 0.3)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <challenge.icon size={24} color='var(--cyber-purple)' />
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {challenge.category} • {challenge.difficulty}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{challenge.title}</h3>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div className="neon-text-purple" style={{ fontWeight: 900, fontSize: '1.2rem' }}>{challenge.points}</div>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>PTS</span>
        </div>
      </div>

    </motion.div>
  );
};

const ChallengeModal = ({ challenge, isOpen, onClose, onSolve }) => {
  if (!challenge) return null;

  const [inputFlag, setInputFlag] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputFlag.trim() === challenge.flag.trim()) {
      setError('');
      onSolve(challenge.points);
      onClose();
    } else {
      setError('Invalid flag. Neural link rejected.');
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
              maxWidth: '900px',
              width: 'min(95vw, 900px)',
              position: 'relative',
              padding: '2rem',
              display: 'grid',
              gridTemplateColumns: '1fr 200px',
              gap: '2rem',
              alignItems: 'start'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <X size={24} />
            </button>

            {/* Left Column */}
            <div>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                marginBottom: '1rem',
                color: 'var(--cyber-cyan)'
              }}>
                {challenge.title}
              </h2>
              <span style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {challenge.category} • {challenge.difficulty} • {challenge.points} PTS
                  </span>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '1rem',
                lineHeight: 1.6,
                marginBottom: '2rem',
                marginTop: '1rem'
              }}>
                {challenge.description}
              </p>

              {/* Flag Submission Form */}
              <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <Flag size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-cyan)' }} />
                  <input
                    type="text"
                    placeholder="CYBER{f14g_h3r3}"
                    value={inputFlag}
                    onChange={(e) => setInputFlag(e.target.value)}
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
                  style={{ 
                    width: '100%', 
                    padding: '0.8rem 1.5rem', 
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-orbitron)',
                    fontWeight: 700
                  }}
                >
                  SUBMIT FLAG
                </button>
              </form>

              {error && (
                <div style={{ 
                  marginBottom: '2rem',
                  color: 'var(--cyber-pink)', 
                  fontSize: '0.9rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  padding: '0.5rem',
                  background: 'rgba(255, 105, 180, 0.1)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 105, 180, 0.2)'
                }}>
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}
            </div>

            {/* Right Column - Hint */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '1.5rem',
              background: 'rgba(0, 243, 255, 0.05)',
              border: '1px solid rgba(0, 243, 255, 0.2)',
              borderRadius: '0.75rem',
              height: 'fit-content',
              position: 'sticky',
              top: '2rem',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center'
            }}>
              <button
                onClick={() => setShowHint(!showHint)}
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
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => !showHint && (e.target.style.background = 'rgba(255, 255, 255, 0.08)')}
                onMouseLeave={(e) => !showHint && (e.target.style.background = 'rgba(255, 255, 255, 0.05)')}
              >
                {showHint ? '✕ Hide Hint' : '? Show Hint'}
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
                  {challenge.hint}
                </motion.div>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Challenges = ({ onPointsUpdate }) => {
  const [filter, setFilter] = useState('All');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredChallenges = filter === 'All' 
    ? challengeData 
    : challengeData.filter(c => c.category === filter);

  const handleChallengeClick = (challenge) => {
    setSelectedChallenge(challenge);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedChallenge(null);
  };

  return (
    <section id="challenges" style={{ padding: '8rem 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 950, marginBottom: '1.5rem' }}>
            ACTIVE <span className="neon-text-cyan">CHALLENGES</span>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {filteredChallenges.map(challenge => (
            <ChallengeCard 
              key={challenge.id} 
              challenge={challenge} 
              onClick={() => handleChallengeClick(challenge)}
            />
          ))}
        </div>

        <ChallengeModal
          challenge={selectedChallenge}
          isOpen={modalOpen}
          onClose={handleModalClose}
          onSolve={onPointsUpdate}
        />
      </div>
    </section>
  );
};

export default Challenges;
