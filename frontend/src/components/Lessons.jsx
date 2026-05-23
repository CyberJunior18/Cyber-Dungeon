import { motion } from 'framer-motion';
import { ChevronRight, PlayCircle } from 'lucide-react';
import { lessonData } from '../data/lessons';

const LessonCard = ({ lesson, onLessonClick }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="glass-card"
      style={{
        padding: '2.5rem',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        minHeight: '360px',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.018))'
      }}
      onClick={() => onLessonClick(lesson.title)}
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {lesson.category} • {lesson.duration}
        </span>
        <span style={{
          fontSize: '0.68rem',
          color: lesson.color,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontFamily: 'var(--font-orbitron)',
          fontWeight: 800,
          padding: '0.25rem 0.55rem',
          border: `1px solid ${lesson.color}33`,
          borderRadius: '999px',
          background: `${lesson.color}0D`
        }}>
          {lesson.parts.length} Modules
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
          letterSpacing: '1.5px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <PlayCircle size={18} /> START LESSON <ChevronRight size={16} />
      </button>
    </motion.div>
  );
};

const Lessons = ({ onViewChange, onLessonSelect }) => {
  return (
    <section id="lessons" style={{ padding: '8rem 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p style={{ color: 'var(--cyber-purple)', fontSize: '0.78rem', fontFamily: 'var(--font-orbitron)', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
              Skill Training
            </p>
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
            <p style={{ color: 'var(--text-muted)', marginTop: '2rem', maxWidth: '44rem', margin: '2rem auto 0', fontSize: '1.1rem', lineHeight: 1.8 }}>
              Learn the patterns behind real CTF categories, then practice with focused challenges and downloadable artifacts.
            </p>
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '2.5rem' }}>
          {lessonData.map(lesson => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson}
              onLessonClick={(title) => {
                onLessonSelect(title);
                onViewChange('lesson');
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Lessons;
