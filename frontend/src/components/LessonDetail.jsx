import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Video, FileText, Code, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const lessonData = [
  {
    id: 1,
    title: 'Introduction to CTFs',
    category: 'General',
    duration: '10 min',
    description: 'Learn the basics of Capture The Flag competitions and the common categories you will encounter.',
    icon: BookOpen,
    color: 'var(--cyber-cyan)',
    parts: ["Capture The Flag (CTF) competitions are cybersecurity contests where participants solve puzzles and exploit vulnerabilities to find hidden text strings, known as \"flags\". They are designed to simulate real-world security scenarios in a legal, gamified, and controlled environment"],
    challenges: "Capture the flag: submit this flag CYBER{Learning_About_CTFs}",
    flag: "CYBER{Learning_About_CTFs}"
  },
  {
    id: 2,
    title: 'Web Exploitation Basics',
    category: 'Web',
    duration: '25 min',
    description: 'Understand how web applications work and how to identify common vulnerabilities like SQL Injection.',
    icon: Code,
    color: 'var(--cyber-purple)',
    parts: ["Web exploitation basics involve finding and exploiting vulnerabilities in web applications to gain unauthorized access, steal sensitive data, or take control of web servers. These vulnerabilities often arise from improper validation of user input or insecure server configurations.", "Core Web Exploitation Concepts\n\nHTTP Requests & Responses: Understanding how browsers communicate with servers (GET, POST, headers, cookies) is fundamental, as attackers often modify these requests.\n\nUser Input Validation: Most attacks occur because applications trust user input too much. Attackers submit malicious data to trigger bugs.\n\nReconnaissance: Gathering information about a target (e.g., identifying server types, finding hidden files/directories) using tools like DirBuster.\n\nStatelessness: HTTP is stateless, meaning servers use sessions and cookies to track users. Exploiting these mechanisms can lead to session hijacking.", "Top Web Vulnerabilities\n\nSQL Injection (SQLi): Inserting malicious SQL commands into input fields (e.g., login forms) to manipulate the backend database, extract data, or bypass authentication.\n\nCross-Site Scripting (XSS): Injecting malicious JavaScript into a web page that executes in the browser of another user. It is used to steal session cookies or deface websites.\n\nCommand Injection: Executing unauthorized operating system commands on the server by inputting system commands into application forms.\n\nBroken Access Control (IDOR): Insecure Direct Object References occur when an app exposes references to internal objects (e.g., files, database keys), allowing users to access data they should not, such as other users' profiles.\n\nDirectory/File Traversal: Manipulating file paths (e.g., ../../etc/passwd) to access sensitive files outside the intended web directory.\n\nFile Upload Vulnerabilities: Uploading malicious scripts (like a PHP web shell) disguised as legitimate files (e.g., images) to gain remote code execution on the server."],
    challenges: "Breach the local administrative node. Flag hidden in system logs.",
    flag: "CYBER{w3b_3xpl01t_m4st3r}"
  },
  {
    id: 3,
    title: 'Cryptography Fundamentals',
    category: 'Crypto',
    duration: '20 min',
    description: 'A deep dive into ciphers, hashing, and the math behind securing information.',
    icon: FileText,
    color: 'var(--cyber-pink)',
    parts: ["Cryptography is the science of protecting information by transforming it into a secure, unreadable format. It serves as the foundation for modern cybersecurity, relying on mathematical algorithms and keys to ensure data privacy, prevent unauthorized tampering, and verify the identities of communicating parties.", "The Core Principles (The Goals)\n\nModern cryptography is built on four fundamental pillars:\n\nConfidentiality: Ensures that intercepted data remains completely unreadable to unauthorized parties.\n\nIntegrity: Guarantees that data has not been maliciously altered, tampered with, or corrupted in transit.\n\nAuthentication: Verifies the identities of the sender and receiver, ensuring data comes from a trusted source.\n\nNon-Repudiation: Prevents a sender from denying they sent a message or signed a specific document.", "Tools: Some common tools to decrypt:\n\nCyberChef - A well known tool mainly used for cryptography and decrypting, it is very famous in CTF communities and is open source for anyone to view and modify.\n\nHashcat - For cracking hashes and encrypted passwords.\n\nJohn the Ripper - Another powerful password cracking tool."],
    challenges: "Decrypt this message: Q1lCRVJ7SS1Mb3ZlLWJ1aWxkaW5nLXNlY3VyZS13ZWItYXBwc30K",
    flag: "CYBER{I-Love-building-secure-web-apps}"
  },
  {
    id: 4,
    title: 'Reverse Engineering 101',
    category: 'Reverse',
    duration: '35 min',
    description: 'Learn how to decompile programs and understand machine code to find hidden flags.',
    icon: Video,
    color: 'var(--cyber-cyan)',
    parts: ["Reverse engineering is the process of deconstructing a system, device, or software to understand how it works. In a \"101\" or beginner context, it primarily focuses on software—taking a compiled program without its source code and analyzing it to uncover its internal logic, find vulnerabilities, or understand its behavior.", "Core Concepts\n\nBinary Code: Software is written by humans in readable programming languages, then compiled into machine code (binaries) for the computer to run. Reverse engineering aims to translate that machine code back into something humans can read.\n\nAssembly Language: This is the bridge between human-readable code and machine code. You will need a basic grasp of assembly instructions (like MOV, ADD, JMP) to trace how a program moves data and makes decisions.\n\nStatic vs. Dynamic Analysis:\nStatic Analysis: Examining the code and structure without actually running it.\nDynamic Analysis: Running the program in a safe, controlled environment (like a virtual machine) to see how it behaves in real-time.", "Essential Tools\n\nDisassemblers: Tools that convert machine code into readable assembly code (e.g., Ghidra, IDA Pro).\n\nDecompilers: Advanced tools that take assembly code and attempt to convert it into high-level, pseudo-C code.\n\nDebuggers: Programs that let you pause the execution of software line-by-line, inspect memory, and view the status of the CPU (e.g., x64dbg, GDB).", "Common Applications\n\nWhy do people learn reverse engineering?\n\nMalware Analysis: Deconstructing viruses or ransomware to understand what they do, who created them, and how to stop them.\n\nVulnerability Research: Inspecting software to find hidden bugs or security flaws that attackers could exploit.\n\nInteroperability & Modding: Studying proprietary software to make third-party tools, create game mods, or bypass digital locks.\n\nCommon tools for CTFs: exiftool, jadx-gui, and much more!"]
  }
];


const LessonDetail = ({ lessonTitle, onBack }) => {
  const lesson = lessonData.find(l => l.title === lessonTitle);
  const [currentPage, setCurrentPage] = useState(0); 
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState(null); 
  const [showFlagMessage, setShowFlagMessage] = useState(false);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  // Reset state when lesson changes
  useEffect(() => {
    setCurrentPage(0);
    setFlagInput('');
    setFlagStatus(null);
    setShowFlagMessage(false);
    setIsLessonComplete(false);
  }, [lessonTitle]);

  if (!lesson) {
    return (
      <section style={{ padding: '8rem 0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-muted)' }}>Lesson not found</p>
        </div>
      </section>
    );
  }

  const IconComponent = lesson.icon;
  const hasChallenge = lesson.challenges && lesson.flag;
  const totalPages = (lesson.parts?.length || 0) + 1 + (hasChallenge ? 1 : 0); 
  const isOnChallengePage = hasChallenge && currentPage === (lesson.parts?.length || 0) + 1;

  const handleFlagSubmit = () => {
    if (flagInput.trim().toUpperCase() === lesson.flag.toUpperCase()) {
      setFlagStatus('correct');
      setIsLessonComplete(true);
    } else {
      setFlagStatus('incorrect');
    }
    setShowFlagMessage(true);
    setTimeout(() => {
      setShowFlagMessage(false);
    }, 4000);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      if (isOnChallengePage && flagStatus !== 'correct') return;
      
      setCurrentPage(prev => prev + 1);
      // Reset flag message/status when navigating away from challenge
      if (isOnChallengePage) {
        setFlagInput('');
        setFlagStatus(null);
      }
      
      // Mark complete if no challenge and reached end
      if (!hasChallenge && currentPage + 1 === totalPages - 1) {
        setIsLessonComplete(true);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <section style={{ padding: '8rem 0', minHeight: '100vh' }}>
      <div className="container">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '3rem',
            background: 'transparent',
            color: 'var(--cyber-cyan)',
            fontSize: '1rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem 0'
          }}
          whileHover={{ x: -5 }}
        >
          <ChevronLeft size={20} /> Back to Lessons
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          key={`${lesson.id}-${currentPage}`}
        >
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '2rem',
            marginBottom: '3rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '1rem',
              background: `${lesson.color}11`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${lesson.color}33`,
              flexShrink: 0,
              boxShadow: `0 0 20px ${lesson.color}11`
            }}>
              <IconComponent size={32} color={lesson.color} />
            </div>

            <div style={{ flex: 1, minWidth: '300px' }}>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, marginBottom: '1rem', lineHeight: 1.1 }}>
                {lesson.title}
              </h1>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontWeight: 700
                }}>
                  {lesson.category} • {lesson.duration}
                </p>
                <div style={{ 
                  padding: '0.4rem 1rem', 
                  borderRadius: '2rem', 
                  background: 'rgba(0, 243, 255, 0.05)',
                  border: '1px solid rgba(0, 243, 255, 0.2)',
                  fontSize: '0.75rem',
                  color: 'var(--cyber-cyan)',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  letterSpacing: '1px'
                }}>
                  {currentPage === 0 ? 'Overview' : isOnChallengePage ? 'Challenge' : `Module ${currentPage} / ${lesson.parts?.length || 0}`}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', minHeight: '300px' }}>
            {currentPage === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2rem', color: lesson.color }}>
                  COURSE OBJECTIVE
                </h2>
                <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
                  {lesson.description}
                </p>
                
                {lesson.parts && (
                  <div style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Learning Path
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                      {lesson.parts.map((_, idx) => (
                        <div key={idx} style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--cyber-cyan)', fontWeight: 800 }}>MODULE 0{idx + 1}</span>
                          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>Foundational Concepts</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : isOnChallengePage ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <Zap size={24} className="neon-text-purple" />
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--cyber-purple)' }}>
                    FINAL CHALLENGE
                  </h2>
                </div>
                
                <div style={{ 
                  background: 'rgba(188, 19, 254, 0.03)', 
                  padding: '2rem', 
                  borderRadius: '1rem', 
                  border: '1px solid rgba(188, 19, 254, 0.1)',
                  marginBottom: '2.5rem' 
                }}>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'white' }}>
                    {lesson.challenges}
                  </p>
                </div>

                <div style={{ maxWidth: '600px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '2px' }}>
                    ENTER DECRYPTED FLAG
                  </label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                      type="text"
                      value={flagInput}
                      onChange={(e) => setFlagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleFlagSubmit()}
                      placeholder="CYBER{...}"
                      disabled={isLessonComplete}
                      style={{
                        flex: 1,
                        padding: '1.25rem',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.75rem',
                        color: 'white',
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s'
                      }}
                    />
                    {!isLessonComplete && (
                      <button 
                        onClick={handleFlagSubmit}
                        className="btn-primary"
                        style={{ padding: '0 2rem' }}
                      >
                        SUBMIT
                      </button>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {showFlagMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                          marginTop: '1.5rem',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          background: flagStatus === 'correct' ? 'rgba(0, 255, 0, 0.05)' : 'rgba(255, 0, 0, 0.05)',
                          border: `1px solid ${flagStatus === 'correct' ? '#00FF0033' : '#FF000033'}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          color: flagStatus === 'correct' ? '#00FF00' : '#FF0000',
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}
                      >
                        {flagStatus === 'correct' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {flagStatus === 'correct' ? 'AUTHENTICATION SUCCESSFUL' : 'ACCESS DENIED: INVALID FLAG'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2.5rem', color: 'var(--cyber-cyan)', letterSpacing: '2px' }}>
                  MODULE 0{currentPage}
                </h2>
                <div style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: 1.9, 
                  color: 'var(--text-main)', 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxWidth: '100%'
                }}>
                  {lesson.parts[currentPage - 1]}
                </div>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {isLessonComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.05), rgba(0, 243, 255, 0.05))',
                  border: '1px solid #00FF0044',
                  borderRadius: '1.25rem',
                  padding: '2.5rem',
                  textAlign: 'center',
                  marginBottom: '3rem',
                  boxShadow: '0 0 30px rgba(0, 255, 0, 0.05)'
                }}
              >
                <div style={{ width: '4rem', height: '4rem', background: 'rgba(0, 255, 0, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle size={32} color="#00FF00" />
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 950, color: '#00FF00', marginBottom: '0.75rem', letterSpacing: '2px' }}>
                  PROTOCOL COMPLETE
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                  You have successfully mastered this learning module. Return to the hub to continue your training.
                </p>
                <button 
                  onClick={onBack}
                  className="btn-outline"
                  style={{ marginTop: '2rem', borderColor: '#00FF0033', color: '#00FF00' }}
                >
                  RETURN TO HUB
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                opacity: currentPage === 0 ? 0.3 : 1,
                padding: '0.75rem 1.5rem',
                fontSize: '0.8rem'
              }}
            >
              <ChevronLeft size={18} /> PREVIOUS
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <div 
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: i === currentPage ? 'var(--cyber-cyan)' : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: i === currentPage ? 'var(--neon-cyan-shadow)' : 'none',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1 || (isOnChallengePage && !isLessonComplete)}
              className="btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                opacity: (currentPage === totalPages - 1 || (isOnChallengePage && !isLessonComplete)) ? 0.3 : 1,
                padding: '0.75rem 1.5rem',
                fontSize: '0.8rem'
              }}
            >
              NEXT <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LessonDetail;
