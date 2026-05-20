import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import logoUrl from '../assets/logo2.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div style={{ gridColumn: 'span 2' }}>
            <img
              src={logoUrl}
              alt="Cyber Dungeon"
              style={{
                display: 'block',
                width: 'min(220px, 70vw)',
                height: 'auto',
                objectFit: 'contain',
                marginBottom: '1.5rem'
              }}
            />
            <p style={{ color: 'var(--text-muted)', maxWidth: '24rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              This is your place to start hacking, try challenges, make mistakes, and learn how things really work step by step as you grow your skills in cybersecurity.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '2px' }}>Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <li><a href="https://portswigger.net/web-security" target="_blank" rel="noreferrer" style={{ transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'var(--cyber-cyan)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>PortSwigger Academy</a></li>
              <li><a href="https://owasp.org" target="_blank" rel="noreferrer" style={{ transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'var(--cyber-cyan)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>OWASP Top 10</a></li>
              <li><a href="https://gchq.github.io/CyberChef/" target="_blank" rel="noreferrer" style={{ transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'var(--cyber-cyan)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>CyberChef Utility</a></li>
              <li><a href="https://ctftime.org" target="_blank" rel="noreferrer" style={{ transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'var(--cyber-cyan)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>CTFtime Schedule</a></li>
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
