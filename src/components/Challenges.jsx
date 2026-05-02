import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Terminal, Database, Cpu, Globe, Flag, CheckCircle, ChevronRight, AlertTriangle, Download } from 'lucide-react';

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

const ChallengeCard = ({ challenge, onSolve }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputFlag, setInputFlag] = useState('');
  const [error, setError] = useState('');
  const [solved, setSolved] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputFlag.trim() === challenge.flag.trim()) {
      setSolved(true);
      setError('');
      onSolve(challenge.points);
    } else {
      setError('Invalid flag. Neural link rejected.');
    }
  };

  return (
    <motion.div
      layout
      className="glass-card"
      style={{
        padding: '2rem',
        borderColor: solved ? 'var(--cyber-cyan)' : 'rgba(255, 255, 255, 0.1)',
        background: solved ? 'rgba(0, 243, 255, 0.02)' : 'var(--glass-bg)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <challenge.icon size={24} color={solved ? 'var(--cyber-cyan)' : 'var(--cyber-purple)'} />
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

      {!solved ? (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'transparent',
              color: 'var(--cyber-cyan)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-orbitron)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isExpanded ? 'CLOSE TERMINAL' : 'INITIALIZE CHALLENGE'} <ChevronRight size={16} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '1.5rem', position: 'relative' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6, paddingRight: '9rem' }}>
                    {challenge.description}
                  </p>

                  <button
                    onClick={() => setHintVisible(!hintVisible)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.8rem 1.5rem',
                      background: hintVisible ? 'rgba(255, 105, 180, 0.2)' : 'rgba(255, 105, 180, 0.1)',
                      border: '1px solid var(--cyber-pink)',
                      borderRadius: '0.5rem',
                      color: 'var(--cyber-pink)',
                      fontFamily: 'var(--font-orbitron)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: hintVisible ? '0 0 20px rgba(255, 105, 180, 0.4)' : '0 0 10px rgba(255, 105, 180, 0.2)',
                      position: 'absolute',
                      top: 0,
                      right: 0
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 105, 180, 0.2)';
                      e.target.style.boxShadow = '0 0 20px rgba(255, 105, 180, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = hintVisible ? 'rgba(255, 105, 180, 0.2)' : 'rgba(255, 105, 180, 0.1)';
                      e.target.style.boxShadow = hintVisible ? '0 0 20px rgba(255, 105, 180, 0.4)' : '0 0 10px rgba(255, 105, 180, 0.2)';
                    }}
                  >
                    <Zap size={16} /> HINT {challenge.id}
                  </button>

                  <AnimatePresence>
                    {hintVisible && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ 
                          overflow: 'hidden',
                          position: 'absolute',
                          top: '3.5rem',
                          right: 0,
                          width: '300px',
                          zIndex: 10
                        }}
                      >
                        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '0.5rem', borderLeft: '2px solid var(--cyber-pink)' }}>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{challenge.hint}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{ marginTop: hintVisible ? '0' : '0' }}>
                    {challenge.files && (
                    <a 
                      href={challenge.files} 
                      download
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.8rem 1.5rem',
                        background: 'rgba(0, 243, 255, 0.1)',
                        border: '1px solid var(--cyber-cyan)',
                        borderRadius: '0.5rem',
                        color: 'var(--cyber-cyan)',
                        fontFamily: 'var(--font-orbitron)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        marginBottom: '1.5rem',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 10px rgba(0, 243, 255, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(0, 243, 255, 0.2)';
                        e.target.style.boxShadow = '0 0 20px rgba(0, 243, 255, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(0, 243, 255, 0.1)';
                        e.target.style.boxShadow = '0 0 10px rgba(0, 243, 255, 0.2)';
                      }}
                    >
                      <Download size={16} /> DOWNLOAD FILES
                    </a>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
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
                          fontSize: '0.75rem'
                        }}
                      />
                    </div>
                    <button className="btn-primary" style={{ padding: '0 1.5rem', fontSize: '0.75rem' }}>SUBMIT</button>
                  </form>
                  {error && (
                    <div style={{ marginTop: '1rem', color: 'var(--cyber-pink)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <AlertTriangle size={14} /> {error}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cyber-cyan)', fontWeight: 800, fontSize: '0.9rem' }}>
          <CheckCircle size={20} /> CHALLENGE COMPLETED
        </div>
      )}
    </motion.div>
  );
};

const Challenges = ({ onPointsUpdate }) => {
  const [filter, setFilter] = useState('All');

  const filteredChallenges = filter === 'All' 
    ? challengeData 
    : challengeData.filter(c => c.category === filter);

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
              onSolve={(pts) => onPointsUpdate(pts)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Challenges;
