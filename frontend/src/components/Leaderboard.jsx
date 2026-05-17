import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Target, User, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { api } from '../api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (usr) => {
    if (usr && usr.username && usr.username !== 'Searching...') {
      setSelectedUser(usr);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const [challengesList, setChallengesList] = useState([]);

  useEffect(() => {
    let active = true;
    api.getLeaderboard()
      .then(data => {
        if (active) {
          setLeaderboard(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (active) setLoading(false);
      });

    api.getChallenges()
      .then(data => {
        if (active) {
          setChallengesList(data);
        }
      })
      .catch(err => {
        console.error("Failed to load challenges for leaderboard:", err);
      });

    return () => { active = false; };
  }, []);

  const totalPages = Math.ceil(leaderboard.length / rowsPerPage) || 1;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = leaderboard.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <section id="leaderboard" style={{ padding: '8rem 0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            animation: 'pulse 1.5s ease-in-out infinite',
            marginBottom: '1.5rem',
            color: 'var(--cyber-purple)'
          }}>
            <Trophy size={48} />
          </div>
          <p style={{ fontFamily: 'var(--font-orbitron)', letterSpacing: '2px', color: 'var(--cyber-cyan)' }}>LOADING LEADERBOARD...</p>
        </div>
      </section>
    );
  }

  const firstRank = leaderboard[0] || { username: 'Searching...', points: 0 };
  const secondRank = leaderboard[1] || { username: 'Searching...', points: 0 };
  const thirdRank = leaderboard[2] || { username: 'Searching...', points: 0 };

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
            onClick={() => handleUserClick(secondRank)}
            style={{ padding: '2rem', width: '220px', textAlign: 'center', borderColor: 'rgba(255, 255, 255, 0.1)', height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Medal size={40} color="#e5e7eb" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{secondRank.username}</div>
            <div className="neon-text-cyan" style={{ fontWeight: 900 }}>{secondRank.points} PTS</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>RANK 2</div>
          </motion.div>

          {/* Rank 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            onClick={() => handleUserClick(firstRank)}
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
              zIndex: 2,
              cursor: 'pointer'
            }}
          >
            <Trophy size={60} color="#bc13fe" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px #bc13fe)' }} />
            <div style={{ fontWeight: 900, fontSize: '1.3rem', marginBottom: '0.5rem' }}>{firstRank.username}</div>
            <div className="neon-text-purple" style={{ fontWeight: 950, fontSize: '1.2rem' }}>{firstRank.points} PTS</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', letterSpacing: '2px' }}>Rank 1</div>
          </motion.div>

          {/* Rank 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card"
            onClick={() => handleUserClick(thirdRank)}
            style={{ padding: '2rem', width: '220px', textAlign: 'center', borderColor: 'rgba(255, 255, 255, 0.1)', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Medal size={40} color="#92400e" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{thirdRank.username}</div>
            <div className="neon-text-pink" style={{ fontWeight: 900 }}>{thirdRank.points} PTS</div>
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
                        onClick={() => handleUserClick(user)}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                          background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(188, 19, 254, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'}
                      >
                        <td style={{ padding: '1.25rem', fontWeight: 800, color: user.rank <= 3 ? 'var(--cyber-cyan)' : 'white' }}>
                          #{user.rank}
                        </td>
                        <td style={{ padding: '1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                              width: '2.5rem',
                              height: '2.5rem',
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              overflow: 'hidden'
                            }}>
                              {user.avatar ? (
                                <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <User size={16} color={user.rank <= 3 ? 'var(--cyber-purple)' : 'var(--text-muted)'} />
                              )}
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

      {/* Player Profile Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5, 5, 5, 0.9)',
            backdropFilter: 'blur(20px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="glass-card"
              style={{
                width: 'min(92vw, 420px)',
                padding: '1.5rem',
                borderColor: 'var(--cyber-cyan)',
                boxShadow: 'var(--neon-cyan-shadow)',
                position: 'relative',
                background: 'rgba(5, 5, 5, 0.98)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyber-pink)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <X size={18} />
              </button>

              {/* Profile Header */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{
                  width: '4.5rem',
                  height: '4.5rem',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '2px solid var(--cyber-cyan)',
                  boxShadow: '0 0 10px rgba(0, 243, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={30} color="rgba(255, 255, 255, 0.15)" />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 950, color: 'white', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'var(--font-orbitron)' }}>
                    {selectedUser.username}
                  </h3>
                  <div className="neon-text-cyan" style={{ fontSize: '0.7rem', fontWeight: 800, marginTop: '0.15rem', letterSpacing: '1.5px' }}>
                    GLOBAL RANK #{selectedUser.rank}
                  </div>
                </div>
              </div>

              {/* Score Indicators Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  padding: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(188, 19, 254, 0.2)',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.15rem' }}>Total Points</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--cyber-purple)', fontFamily: 'var(--font-orbitron)' }}>{selectedUser.points} PTS</div>
                </div>
                <div style={{
                  padding: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 243, 255, 0.2)',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.15rem' }}>Solved Challenges</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--cyber-cyan)', fontFamily: 'var(--font-orbitron)' }}>{selectedUser.solved} / {challengesList.length}</div>
                </div>
              </div>

              {/* Solved challenges status list */}
              <h4 style={{ fontSize: '0.85rem', color: 'white', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem', fontFamily: 'var(--font-orbitron)', fontWeight: 800 }}>Challenge Status</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {challengesList.map((challenge) => {
                  const isSolvedByThem = selectedUser.solved_challenges && selectedUser.solved_challenges.includes(challenge.id);
                  return (
                    <div
                      key={challenge.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        background: isSolvedByThem ? 'rgba(57, 255, 20, 0.04)' : 'rgba(255, 255, 255, 0.01)',
                        border: isSolvedByThem ? '1px solid rgba(57, 255, 20, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSolvedByThem ? 'white' : 'var(--text-muted)' }}>
                          {challenge.title}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                          {challenge.category}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.25rem',
                          background: isSolvedByThem ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          color: isSolvedByThem ? 'rgb(57, 255, 20)' : 'var(--text-muted)',
                          fontFamily: 'var(--font-orbitron)'
                        }}>
                          {isSolvedByThem ? 'SOLVED' : 'UNSOLVED'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button
                onClick={handleCloseModal}
                className="btn-outline"
                style={{
                  width: '100%',
                  marginTop: '2rem',
                  padding: '0.75rem',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-orbitron)',
                  fontWeight: 700,
                  borderColor: 'rgba(0, 243, 255, 0.3)',
                  color: 'var(--cyber-cyan)',
                  cursor: 'pointer'
                }}
              >
                CLOSE PROFILE
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Leaderboard;
