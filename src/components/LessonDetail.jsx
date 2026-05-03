import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Video, FileText, Code, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

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
    parts: ["Web exploitation basics involve finding and exploiting vulnerabilities in web applications to gain unauthorized access, steal sensitive data, or take control of web servers. These vulnerabilities often arise from improper validation of user input or insecure server configurations.", "Core Web Exploitation Concepts\n\nHTTP Requests & Responses: Understanding how browsers communicate with servers (GET, POST, headers, cookies) is fundamental, as attackers often modify these requests.\n\nUser Input Validation: Most attacks occur because applications trust user input too much. Attackers submit malicious data to trigger bugs.\n\nReconnaissance: Gathering information about a target (e.g., identifying server types, finding hidden files/directories) using tools like DirBuster.\n\nStatelessness: HTTP is stateless, meaning servers use sessions and cookies to track users. Exploiting these mechanisms can lead to session hijacking.", "Top Web Vulnerabilities\n\nSQL Injection (SQLi): Inserting malicious SQL commands into input fields (e.g., login forms) to manipulate the backend database, extract data, or bypass authentication.\n\nCross-Site Scripting (XSS): Injecting malicious JavaScript into a web page that executes in the browser of another user. It is used to steal session cookies or deface websites.\n\nCommand Injection: Executing unauthorized operating system commands on the server by inputting system commands into application forms.\n\nBroken Access Control (IDOR): Insecure Direct Object References occur when an app exposes references to internal objects (e.g., files, database keys), allowing users to access data they should not, such as other users' profiles.\n\nDirectory/File Traversal: Manipulating file paths (e.g., ../../etc/passwd) to access sensitive files outside the intended web directory.\n\nFile Upload Vulnerabilities: Uploading malicious scripts (like a PHP web shell) disguised as legitimate files (e.g., images) to gain remote code execution on the server.\n\nServer-Side Request Forgery (SSRF): Tricking the server into making HTTP requests to internal, protected systems."]
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
  const [currentPage, setCurrentPage] = useState(0); // 0 = overview, 1+ = parts, final = challenge
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState(null); // null, 'correct', 'incorrect'
  const [showFlagMessage, setShowFlagMessage] = useState(false);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

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
  const totalPages = (lesson.parts?.length || 0) + 1 + (hasChallenge ? 1 : 0); // overview + parts + challenge (if exists)
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
    if (currentPage === totalPages - 1) {
      return; // Don't advance on last page
    }
    // If on challenge page and challenge not completed, don't allow next
    if (isOnChallengePage && flagStatus !== 'correct') {
      return;
    }
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setFlagInput('');
      setFlagStatus(null);
      // Mark complete when reaching last page (if no challenge)
      if (currentPage + 1 === totalPages - 1 && !isOnChallengePage) {
        setIsLessonComplete(true);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setFlagInput('');
      setFlagStatus(null);
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
          key={currentPage}
        >
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '2rem',
            marginBottom: '3rem'
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
              flexShrink: 0
            }}>
              <IconComponent size={32} color={lesson.color} />
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, marginBottom: '1rem' }}>
                {lesson.title}
              </h1>
              <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '1rem'
              }}>
                {lesson.category} • {lesson.duration}
              </p>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--cyber-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {currentPage === 0 ? 'Overview' : isOnChallengePage ? 'Challenge' : `Part ${currentPage} of ${lesson.parts?.length || 0}`}
              </p>
            </div>
          </div>

          {currentPage === 0 ? (
            // Overview page
            <>
              <div style={{
                background: 'rgba(0, 243, 255, 0.05)',
                border: '1px solid rgba(0, 243, 255, 0.2)',
                borderRadius: '1rem',
                padding: '2.5rem',
                marginBottom: '3rem'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: lesson.color }}>
                  Overview
                </h2>
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: 'var(--text-muted)'
                }}>
                  {lesson.description}
                </p>
              </div>

              {lesson.parts && lesson.parts.length > 0 && (
                <div style={{
                  background: 'rgba(147, 51, 234, 0.05)',
                  border: '1px solid rgba(147, 51, 234, 0.2)',
                  borderRadius: '1rem',
                  padding: '2.5rem',
                  marginBottom: '3rem'
                }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--cyber-purple)' }}>
                    What You Will Learn
                  </h2>
                  <ul style={{
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: 'var(--text-muted)',
                    paddingLeft: '2rem'
                  }}>
                    {lesson.parts.map((part, idx) => (
                      <li key={idx} style={{ marginBottom: '0.5rem' }}>
                        • {part.substring(0, 100)}...
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : isOnChallengePage ? (
            // Challenge page
            <div style={{
              background: 'rgba(255, 100, 0, 0.05)',
              border: '1px solid rgba(255, 100, 0, 0.2)',
              borderRadius: '1rem',
              padding: '2.5rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--cyber-orange, #FF6400)' }}>
                Challenge
              </h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'var(--text-muted)',
                marginBottom: '2rem'
              }}>
                {lesson.challenges}
              </p>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  color: 'var(--cyber-cyan)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '0.5rem',
                  fontWeight: 700
                }}>
                  Submit Flag
                </label>
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleFlagSubmit()}
                  placeholder="CYBER{...}"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(0, 243, 255, 0.1)',
                    border: `1px solid ${flagStatus === 'correct' ? '#00FF00' : flagStatus === 'incorrect' ? '#FF0000' : 'rgba(0, 243, 255, 0.3)'}`,
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem',
                    fontFamily: 'monospace',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s'
                  }}
                />
              </div>

              {showFlagMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    marginBottom: '2rem',
                    borderRadius: '0.5rem',
                    background: flagStatus === 'correct' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                    border: `1px solid ${flagStatus === 'correct' ? '#00FF00' : '#FF0000'}`
                  }}
                >
                  {flagStatus === 'correct' ? (
                    <>
                      <CheckCircle size={20} color="#00FF00" />
                      <span style={{ color: '#00FF00', fontWeight: 700 }}>Correct! Flag accepted!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={20} color="#FF0000" />
                      <span style={{ color: '#FF0000', fontWeight: 700 }}>Incorrect flag. Try again!</span>
                    </>
                  )}
                </motion.div>
              )}

              <button
                onClick={handleFlagSubmit}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, var(--cyber-cyan), var(--cyber-purple))',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  marginBottom: '1.5rem'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Submit Flag
              </button>

              {!isLessonComplete && (
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--cyber-cyan)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 600,
                  textAlign: 'center'
                }}>
                  ⓘ Submit the correct flag to complete this lesson
                </p>
              )}
            </div>
          ) : (
            // Parts pages
            <div style={{
              background: 'rgba(147, 51, 234, 0.05)',
              border: '1px solid rgba(147, 51, 234, 0.2)',
              borderRadius: '1rem',
              padding: '2.5rem'
            }}>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'var(--text-muted)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {lesson.parts[currentPage - 1]}
              </p>
            </div>
          )}

          {isLessonComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 243, 255, 0.1))',
                border: '2px solid #00FF00',
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '2rem',
                marginTop: '2rem'
              }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#00FF00', marginBottom: '0.5rem' }}>
                ✓ LESSON COMPLETE!
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                You have successfully completed this lesson.
              </p>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: currentPage === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                border: `1px solid ${currentPage === 0 ? 'rgba(255, 255, 255, 0.1)' : 'var(--cyber-cyan)'}`,
                borderRadius: '0.5rem',
                color: currentPage === 0 ? 'var(--text-muted)' : 'var(--cyber-cyan)',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <ChevronLeft size={18} /> Previous
            </button>

            <span style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {currentPage + 1} / {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1 || (isOnChallengePage && flagStatus !== 'correct')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: (currentPage === totalPages - 1 || (isOnChallengePage && flagStatus !== 'correct')) ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                border: `1px solid ${(currentPage === totalPages - 1 || (isOnChallengePage && flagStatus !== 'correct')) ? 'rgba(255, 255, 255, 0.1)' : 'var(--cyber-cyan)'}`,
                borderRadius: '0.5rem',
                color: (currentPage === totalPages - 1 || (isOnChallengePage && flagStatus !== 'correct')) ? 'var(--text-muted)' : 'var(--cyber-cyan)',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: (currentPage === totalPages - 1 || (isOnChallengePage && flagStatus !== 'correct')) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LessonDetail;
