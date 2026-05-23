import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, ShieldAlert, Trash2, RefreshCw, Upload, Camera, CheckCircle, AlertTriangle, Search, Lock, Unlock } from 'lucide-react';
import { api } from '../api';

const Profile = ({ user, onUserUpdate, onLogout, onViewChange }) => {
  if (!user) {
    onViewChange('landing');
    return null;
  }

  const [username, setUsername] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const fileInputRef = useRef(null);

  // Convert uploaded image to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image file size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      setSuccess('Profile avatar loaded. Save changes to update.');
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      const updatedUser = await api.updateProfile(username, email, avatar);
      onUserUpdate(updatedUser);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  const handleClearProgress = async () => {
    setError('');
    setSuccess('');
    try {
      const updatedUser = await api.clearProgress();
      onUserUpdate(updatedUser);
      setSuccess('Challenges progress wiped successfully.');
      setShowClearConfirm(false);
    } catch (err) {
      setError(err.message || 'Failed to wipe progress.');
    }
  };

  const handleDeleteAccount = async () => {
    setError('');
    try {
      await api.deleteAccount();
      onLogout();
      onViewChange('landing');
    } catch (err) {
      setError(err.message || 'Failed to delete account.');
    }
  };

  const handleSearchChange = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length < 1) {
      setSearchResults([]);
      return;
    }
    try {
      setSearching(true);
      const results = await api.searchUsers(q);
      setSearchResults(results);
    } catch (err) {
      console.error("Failed to search users:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleToggleApproval = async (targetId) => {
    setError('');
    setSuccess('');
    try {
      const updatedTarget = await api.toggleCreatorApproval(targetId);
      setSearchResults(prev => prev.map(u => u.id === targetId ? updatedTarget : u));
      setSuccess(`Database updated for user: ${updatedTarget.username}`);
    } catch (err) {
      setError(err.message || 'Failed to update player privileges.');
    }
  };

  return (
    <section style={{ padding: '8rem 0', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, marginBottom: '1rem' }}>
              USER <span className="neon-text-cyan">PROFILE</span>
            </h2>
            <div style={{ 
              width: '6rem', 
              height: '4px', 
              background: 'linear-gradient(to right, var(--cyber-cyan), var(--cyber-pink))', 
              margin: '0 auto', 
              borderRadius: '10px',
              boxShadow: '0 0 15px rgba(0, 243, 255, 0.5)'
            }}></div>
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
          
          {/* Main Info Form & Avatar Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Dynamic Avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  style={{ 
                    position: 'relative',
                    width: '7.5rem', 
                    height: '7.5rem', 
                    borderRadius: '50%', 
                    background: 'var(--cyber-dark)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '3px solid var(--cyber-cyan)',
                    boxShadow: 'var(--neon-cyan-shadow)',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                >
                  {avatar ? (
                    <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={48} color="rgba(255, 255, 255, 0.2)" />
                  )}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                  >
                    <Camera size={24} color="var(--cyber-cyan)" />
                  </div>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="btn-outline"
                  style={{ padding: '0.4rem 1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Upload size={14} /> UPLOAD AVATAR
                </button>
              </div>

              {/* Input Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-cyan)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem 0.8rem 2.5rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(0, 243, 255, 0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontFamily: 'var(--font-orbitron)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-cyan)' }} />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem 0.8rem 2.5rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(0, 243, 255, 0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontFamily: 'var(--font-orbitron)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              {/* Status Alerts */}
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cyber-pink)', background: 'rgba(255, 0, 255, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255, 0, 255, 0.2)' }}>
                  <AlertTriangle size={18} />
                  <span style={{ fontSize: '0.85rem' }}>{error}</span>
                </div>
              )}
              {success && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgb(57, 255, 20)', background: 'rgba(57, 255, 20, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(57, 255, 20, 0.2)' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontSize: '0.85rem' }}>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={updating}
                className="btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '1px' }}
              >
                {updating ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
              </button>
            </form>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card"
            style={{ padding: '2.5rem', border: '1px solid rgba(255, 0, 85, 0.2)', background: 'rgba(255, 0, 85, 0.02)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <ShieldAlert size={24} color="var(--cyber-pink)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--cyber-pink)', fontFamily: 'var(--font-orbitron)' }}>DANGER ZONE</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Clear progress */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', flexWrap: 'wrap' }}>
                <div>
                  <h4 style={{ fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>Clear Challenge Progress</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Wipes all points and resets challenge solves to default status.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="btn-outline"
                  style={{ color: 'var(--cyber-pink)', borderColor: 'rgba(255, 0, 255, 0.3)', padding: '0.6rem 1.25rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <RefreshCw size={14} /> RESET PROGRESS
                </button>
              </div>

              {/* Delete Account */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <h4 style={{ fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>Delete Account</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Permanently deletes your account and database entries from the server.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-primary"
                  style={{ background: 'var(--cyber-pink)', border: 'none', boxShadow: '0 0 10px rgba(255, 0, 255, 0.3)', padding: '0.6rem 1.25rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Trash2 size={14} /> DELETE ACCOUNT
                </button>
              </div>

            </div>
          </motion.div>

          {/* Admin Control Panel */}
          {user.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card"
              style={{ 
                padding: '2.5rem', 
                borderColor: 'var(--cyber-cyan)', 
                boxShadow: 'var(--neon-cyan-shadow)', 
                background: 'rgba(0, 243, 255, 0.01)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <ShieldAlert size={24} color="var(--cyber-cyan)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--cyber-cyan)', fontFamily: 'var(--font-orbitron)' }}>ADMIN CONTROL PANEL</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>Grant Challenge Creation Rights</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Search for a user by username or email. Approved users gain access to the **"Contribute Challenge"** button where they can add dynamic CTF challenges directly to the database.
                  </p>

                  {/* Search Box */}
                  <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-cyan)' }} />
                    <input
                      type="text"
                      placeholder="Search username or email..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem 0.8rem 2.5rem',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(0, 243, 255, 0.2)',
                        borderRadius: '0.5rem',
                        color: 'white',
                        fontFamily: 'var(--font-orbitron)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  {/* Search Results */}
                  {searching ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                      SEARCHING DATABASE...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {searchResults.map((usr) => (
                        <div
                          key={usr.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '0.5rem',
                            flexWrap: 'wrap',
                            gap: '1rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                              width: '2.5rem',
                              height: '2.5rem',
                              borderRadius: '50%',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid ' + (usr.can_create_challenges ? 'var(--cyber-cyan)' : 'rgba(255,255,255,0.1)'),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden'
                            }}>
                              {usr.avatar ? (
                                <img src={usr.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <User size={16} color="rgba(255,255,255,0.3)" />
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'white' }}>{usr.username}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{usr.email} • {usr.points} PTS</div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleApproval(usr.id)}
                            className={usr.can_create_challenges ? "btn-primary" : "btn-outline"}
                            style={{
                              padding: '0.4rem 1rem',
                              fontSize: '0.7rem',
                              fontFamily: 'var(--font-orbitron)',
                              fontWeight: 700,
                              background: usr.can_create_challenges ? 'rgba(57, 255, 20, 0.15)' : 'transparent',
                              borderColor: usr.can_create_challenges ? 'rgb(57, 255, 20)' : 'rgba(255,255,255,0.2)',
                              color: usr.can_create_challenges ? 'rgb(57, 255, 20)' : 'var(--text-muted)',
                              boxShadow: usr.can_create_challenges ? '0 0 10px rgba(57, 255, 20, 0.2)' : 'none'
                            }}
                          >
                            {usr.can_create_challenges ? 'REVOKE CONTRIBUTOR' : 'APPROVE CONTRIBUTOR'}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery.trim().length > 0 ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                      NO USERS FOUND MATCHING THOSE CRITERIA.
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>

      {/* Confirmation Modals */}
      {/* Clear Confirmation */}
      {showClearConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card" 
            style={{ maxWidth: '500px', width: '100%', padding: '2rem', border: '1px solid rgba(255, 193, 7, 0.3)', background: 'rgba(5, 5, 5, 0.95)' }}
          >
            <div style={{ color: '#ffc107', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <AlertTriangle size={28} />
              <h4 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.2rem', fontWeight: 900 }}>WIPE PROGRESS?</h4>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Are you sure you want to wipe all score points and challenge solve states? This action is immediate and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowClearConfirm(false)} className="btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>CANCEL</button>
              <button onClick={handleClearProgress} className="btn-primary" style={{ background: '#ffc107', border: 'none', color: 'black', padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>WIPE DATA</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card" 
            style={{ maxWidth: '500px', width: '100%', padding: '2rem', border: '1px solid rgba(255, 0, 85, 0.4)', background: 'rgba(5, 5, 5, 0.95)' }}
          >
            <div style={{ color: 'var(--cyber-pink)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <ShieldAlert size={28} />
              <h4 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.2rem', fontWeight: 900 }}>DELETE ACCOUNT?</h4>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              WARNING: This will permanently delete your account, total points, solved challenges, and avatar from the database. This action is irreversible.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>CANCEL</button>
              <button onClick={handleDeleteAccount} className="btn-primary" style={{ background: 'var(--cyber-pink)', border: 'none', padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>DELETE ACCOUNT</button>
            </div>
          </motion.div>
        </div>
      )}

    </section>
  );
};

export default Profile;
