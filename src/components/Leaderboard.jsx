import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Target, User, ChevronLeft, ChevronRight } from 'lucide-react';

const mockLeaderboard = Array.from({ length: 30 }, (_, i) => ({
  rank: i + 1,
  username: [
    'ZeroDay_Master', 'Ghost_Protocol', 'Neural_Breaker', 'Cyber_Phantom', 'Root_Access',
    'Void_Walker', 'Static_Void', 'Bit_Crusher', 'Neon_Specter', 'Kernel_Panic',
    'Buffer_Wizard', 'Logic_Bomb', 'Crypto_Knight', 'Data_Wraith', 'Shell_Jumper',
    'Byte_Me', 'Packet_Sniper', 'Admin_Hunter', 'Code_Reaper', 'System_Ghost',
    'Nexus_Hacker', 'Void_Explorer', 'Pixel_Breaker', 'Quantum_Leap', 'Shadow_Step',
    'Binary_Soul', 'Circuit_Bender', 'Flow_Master', 'Matrix_Architect', 'Infinity_Loop'
  ][i],
  points: 2450 - (i * 75) + Math.floor(Math.random() * 20),
  solved: Math.max(1, 12 - Math.floor(i / 2.5))
}));

const Leaderboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(mockLeaderboard.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = mockLeaderboard.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
              The top players dominating the challenges.<br></br>
              Only the sharpest minds climb to the top.
            </p>
          </motion.div>
        </div>

        {/* Top 3 Podium (Always visible as reference) */}
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
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', letterSpacing: '2px' }}>Rank 1</div>
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

        {/* List View with Pagination */}
        <div className="glass-card" style={{ padding: '1rem', background: 'rgba(5, 5, 5, 0.5)', overflow: 'hidden' }}>
          <div style={{ minWidth: '800px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)' }}>RANK</th>
                  <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)' }}>USER</th>
                  <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)' }}>SOLVED</th>
                  <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)', textAlign: 'right' }}>POINTS</th>
                </tr>
              </thead>
              <tbody style={{ position: 'relative' }}>
                <AnimatePresence mode="wait">
                  <motion.tr
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'contents' }}
                  >
                    {currentRows.map((user, index) => (
                      <tr
                        key={user.rank}
                        style={{ 
                          borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                          background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(188, 19, 254, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'}
                      >
                        <td style={{ padding: '1.25rem', fontWeight: 800, color: user.rank <= 3 ? 'var(--cyber-cyan)' : 'white' }}>
                          #{user.rank}
                        </td>
                        <td style={{ padding: '1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '2rem', height: '2.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <User size={16} color={user.rank <= 3 ? 'var(--cyber-purple)' : 'var(--text-muted)'} />
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
                          <span className={user.rank <= 3 ? 'neon-text-purple' : ''}>{user.points}</span>
                        </td>
                      </tr>
                    ))}
                  </motion.tr>
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controller */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem',
              background: 'transparent',
              color: currentPage === 1 ? 'rgba(255, 255, 255, 0.1)' : 'var(--cyber-cyan)',
              cursor: currentPage === 1 ? 'default' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.5rem',
                  background: currentPage === number ? 'var(--cyber-purple)' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid',
                  borderColor: currentPage === number ? 'var(--cyber-purple)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: 800,
                  fontFamily: 'var(--font-orbitron)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: currentPage === number ? 'var(--neon-purple-shadow)' : 'none'
                }}
              >
                {number}
              </button>
            ))}
            
            {/* Simulated extended pagination for larger sets */}
            {totalPages < 10 && (
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', color: 'var(--text-muted)' }}>...</span>
            )}
            {totalPages < 10 && (
              <button
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: 800,
                  fontFamily: 'var(--font-orbitron)',
                  opacity: 0.5,
                  cursor: 'default'
                }}
              >
                10
              </button>
            )}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem',
              background: 'transparent',
              color: currentPage === totalPages ? 'rgba(255, 255, 255, 0.1)' : 'var(--cyber-cyan)',
              cursor: currentPage === totalPages ? 'default' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
