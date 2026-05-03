import { motion } from 'framer-motion';
import { Trophy, Medal, Target, Zap, User } from 'lucide-react';

const mockLeaderboard = [
  { rank: 1, username: 'ZeroDay_Master', points: 2450, solved: 12 },
  { rank: 2, username: 'Ghost_Protocol', points: 2100, solved: 10 },
  { rank: 3, username: 'Neural_Breaker', points: 1950, solved: 9 },
  { rank: 4, username: 'Cyber_Phantom', points: 1800, solved: 8 },
  { rank: 5, username: 'Root_Access', points: 1650, solved: 7 },
  { rank: 6, username: 'Void_Walker', points: 1400, solved: 6 },
  { rank: 7, username: 'Static_Void', points: 1250, solved: 5 },
  { rank: 8, username: 'Bit_Crusher', points: 1100, solved: 5 },
  { rank: 9, username: 'Neon_Specter', points: 950, solved: 4 },
  { rank: 10, username: 'Kernel_Panic', points: 800, solved: 3 },
];

const Leaderboard = () => {
  return (
    <section id="leaderboard" style={{ padding: '8rem 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 950, marginBottom: '1.5rem' }}>
              GLOBAL <span className="neon-text-purple">LEADERBOARD</span>
            </h2>
            <div style={{ 
              width: '8rem', 
              height: '5px', 
              background: 'linear-gradient(to right, var(--cyber-purple), var(--cyber-pink))', 
              margin: '0 auto', 
              borderRadius: '10px',
              boxShadow: '0 0 15px rgba(188, 19, 254, 0.5)'
            }}></div>
            <p style={{ color: 'var(--text-muted)', marginTop: '2rem', maxWidth: '35rem', margin: '2rem auto 0', fontSize: '1.1rem' }}>
              The top neural architects currently dominating the cyber dungeon. 
              Only the elite survive the breach.
            </p>
          </motion.div>
        </div>

        {/* Top 3 Podium */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '2rem', marginBottom: '6rem', flexWrap: 'wrap' }}>
          {/* Rank 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
            style={{ padding: '2rem', width: '220px', textAlign: 'center', borderColor: 'rgba(255, 255, 255, 0.1)', height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <Medal size={40} color="#e5e7eb" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{mockLeaderboard[1].username}</div>
            <div className="neon-text-cyan" style={{ fontWeight: 900 }}>{mockLeaderboard[1].points} PTS</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>RANK 2</div>
          </motion.div>

          {/* Rank 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ 
              padding: '3rem', 
              width: '260px', 
              textAlign: 'center', 
              borderColor: 'var(--cyber-purple)', 
              boxShadow: 'var(--neon-purple-shadow)',
              height: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              zIndex: 2
            }}
          >
            <Trophy size={60} color="#bc13fe" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px #bc13fe)' }} />
            <div style={{ fontWeight: 900, fontSize: '1.3rem', marginBottom: '0.5rem' }}>{mockLeaderboard[0].username}</div>
            <div className="neon-text-purple" style={{ fontWeight: 950, fontSize: '1.2rem' }}>{mockLeaderboard[0].points} PTS</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', letterSpacing: '2px' }}>THE ARCHITECT</div>
          </motion.div>

          {/* Rank 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card"
            style={{ padding: '2rem', width: '220px', textAlign: 'center', borderColor: 'rgba(255, 255, 255, 0.1)', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <Medal size={40} color="#92400e" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{mockLeaderboard[2].username}</div>
            <div className="neon-text-pink" style={{ fontWeight: 900 }}>{mockLeaderboard[2].points} PTS</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>RANK 3</div>
          </motion.div>
        </div>

        {/* List View */}
        <div className="glass-card" style={{ padding: '1rem', background: 'rgba(5, 5, 5, 0.5)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)' }}>RANK</th>
                <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)' }}>USER</th>
                <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)' }}>SOLVED</th>
                <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)', textAlign: 'right' }}>POINTS</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboard.map((user, index) => (
                <motion.tr
                  key={user.rank}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                    background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(188, 19, 254, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'}
                >
                  <td style={{ padding: '1.25rem', fontWeight: 800, color: index < 3 ? 'var(--cyber-cyan)' : 'white' }}>
                    #{user.rank}
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '2rem', height: '2.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} color={index < 3 ? 'var(--cyber-purple)' : 'var(--text-muted)'} />
                      </div>
                      <span style={{ fontWeight: 700 }}>{user.username}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Target size={14} color="var(--cyber-cyan)" />
                      {user.solved}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem', textAlign: 'right', fontWeight: 900, fontFamily: 'var(--font-orbitron)' }}>
                    <span className={index < 3 ? 'neon-text-purple' : ''}>{user.points}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
