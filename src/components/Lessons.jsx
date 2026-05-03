import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, Code, ChevronRight, PlayCircle } from 'lucide-react';

const lessonData = [
  {
    id: 1,
    title: 'Introduction to CTFs',
    category: 'General',
    duration: '10 min',
    description: 'Learn the basics of Capture The Flag competitions and the common categories you will encounter.',
    icon: BookOpen,
    color: 'var(--cyber-cyan)'
  },
  {
    id: 2,
    title: 'Web Exploitation Basics',
    category: 'Web',
    duration: '25 min',
    description: 'Understand how web applications work and how to identify common vulnerabilities like SQL Injection.',
    icon: Code,
    color: 'var(--cyber-purple)'
  },
  {
    id: 3,
    title: 'Cryptography Fundamentals',
    category: 'Crypto',
    duration: '20 min',
    description: 'A deep dive into ciphers, hashing, and the math behind securing information.',
    icon: FileText,
    color: 'var(--cyber-pink)'
  },
  {
    id: 4,
    title: 'Reverse Engineering 101',
    category: 'Reverse',
    duration: '35 min',
    description: 'Learn how to decompile programs and understand machine code to find hidden flags.',
    icon: Video,
    color: 'var(--cyber-cyan)'
  }
];

const LessonCard = ({ lesson }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="glass-card"
      style={{
        padding: '2.5rem',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ 
        width: '3.5rem', 
        height: '3.5rem', 
        borderRadius: '1rem', 
        background: `${lesson.color}11`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '1.5rem',
        border: `1px solid ${lesson.color}33`
      }}>
        <lesson.icon size={24} color={lesson.color} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {lesson.category} • {lesson.duration}
        </span>
      </div>

      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>{lesson.title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        {lesson.description}
      </p>

      <button 
        style={{ 
          marginTop: 'auto',
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          fontSize: '0.85rem', 
          fontFamily: 'var(--font-orbitron)', 
          fontWeight: 800, 
          color: lesson.color,
          background: 'transparent',
          textTransform: 'uppercase',
          letterSpacing: '1.5px'
        }}
      >
        <PlayCircle size={18} /> START LESSON <ChevronRight size={16} />
      </button>
    </motion.div>
  );
};

const Lessons = () => {
  return (
    <section id="lessons" style={{ padding: '8rem 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 950, marginBottom: '1.5rem' }}>
              LEARNING <span className="neon-text-cyan">MODULES</span>
            </h2>
            <div style={{ 
              width: '8rem', 
              height: '5px', 
              background: 'linear-gradient(to right, var(--cyber-cyan), var(--cyber-purple))', 
              margin: '0 auto', 
              borderRadius: '10px',
              boxShadow: '0 0 15px rgba(0, 243, 255, 0.5)'
            }}></div>
            <p style={{ color: 'var(--text-muted)', marginTop: '2rem', maxWidth: '35rem', margin: '2rem auto 0', fontSize: '1.1rem' }}>
              Master the skills needed to breach the dungeon. 
              Our lessons are designed for beginners to learn cyber security 
              through practical examples.
            </p>
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
          {lessonData.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Lessons;
