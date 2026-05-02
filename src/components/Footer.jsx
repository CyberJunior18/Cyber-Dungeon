import { motion } from 'framer-motion';
import { Cpu, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(188, 19, 254, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(188, 19, 254, 0.3)' }}>
                <Cpu size={24} color="#bc13fe" />
              </div>
              <span style={{ fontFamily: 'var(--font-orbitron)', fontWeight: 900, fontSize: '1.25rem' }}>
                CYBER<span className="neon-text-purple">DUNGEON</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', maxWidth: '24rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Forging the future of neural connectivity. Join us in the digital frontier and redefine what's possible in the cyber realm.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '2px' }}>Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <li><a href="#" style={{ transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'var(--cyber-cyan)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Whitepaper</a></li>
              <li><a href="#" style={{ transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'var(--cyber-cyan)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Documentation</a></li>
              <li><a href="#" style={{ transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'var(--cyber-cyan)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>API Reference</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '2px' }}>Connect</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--cyber-cyan)';
                    e.currentTarget.style.color = 'var(--cyber-cyan)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = 'inherit';
                  }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ 
          paddingTop: '2rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          color: '#555', 
          fontSize: '0.8rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p>© 2026 CYBER DUNGEON PROTOCOL. ALL RIGHTS RESERVED.</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'inherit'}>PRIVACY POLICY</a>
            <a href="#" style={{ transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'inherit'}>TERMS OF SERVICE</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
