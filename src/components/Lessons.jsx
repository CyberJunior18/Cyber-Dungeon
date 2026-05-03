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
    color: 'var(--cyber-cyan)',
    parts:["Capture The Flag (CTF) competitions are cybersecurity contests where participants solve puzzles and exploit vulnerabilities to find hidden text strings, known as \"flags\". They are designed to simulate real-world security scenarios in a legal, gamified, and controlled environment"],
    challenges:"Capture the flag: submit this flag CYBER{Learning_About_CTFs}",
    flag:"CYBER{Learning_About_CTFs}"
  },
  {
    id: 2,
    title: 'Web Exploitation Basics',
    category: 'Web',
    duration: '25 min',
    description: 'Understand how web applications work and how to identify common vulnerabilities like SQL Injection.',
    icon: Code,
    parts:["Web exploitation basics involve finding and exploiting vulnerabilities in web applications to gain unauthorized access, steal sensitive data, or take control of web servers. These vulnerabilities often arise from improper validation of user input or insecure server configurations.","Core Web Exploitation ConceptsHTTP Requests & Responses: Understanding how browsers communicate with servers (GET, POST, headers, cookies) is fundamental, as attackers often modify these requests.User Input Validation: Most attacks occur because applications trust user input too much. Attackers submit malicious data to trigger bugs.Reconnaissance: Gathering information about a target (e.g., identifying server types, finding hidden files/directories) using tools like DirBuster.Statelessness: HTTP is stateless, meaning servers use sessions and cookies to track users. Exploiting these mechanisms can lead to session hijacking.","Top Web VulnerabilitiesSQL Injection (SQLi): Inserting malicious SQL commands into input fields (e.g., login forms) to manipulate the backend database, extract data, or bypass authentication.Cross-Site Scripting (XSS): Injecting malicious JavaScript into a web page that executes in the browser of another user. It is used to steal session cookies or deface websites.Command Injection: Executing unauthorized operating system commands on the server by inputting system commands into application forms.Broken Access Control (IDOR): Insecure Direct Object References occur when an app exposes references to internal objects (e.g., files, database keys), allowing users to access data they should not, such as other users' profiles.Directory/File Traversal: Manipulating file paths (e.g., ../../etc/passwd) to access sensitive files outside the intended web directory.File Upload Vulnerabilities: Uploading malicious scripts (like a PHP web shell) disguised as legitimate files (e.g., images) to gain remote code execution on the server.Server-Side Request Forgery (SSRF): Tricking the server into making HTTP requests to internal, protected systems."],
    color: 'var(--cyber-purple)'
  },
  {
    id: 3,
    title: 'Cryptography Fundamentals',
    category: 'Crypto',
    duration: '20 min',
    description: 'A deep dive into ciphers, hashing, and the math behind securing information.',
    icon: FileText,
    parts:["Cryptography is the science of protecting information by transforming it into a secure, unreadable format. It serves as the foundation for modern cybersecurity, relying on mathematical algorithms and keys to ensure data privacy, prevent unauthorized tampering, and verify the identities of communicating parties.","The Core Principles (The Goals)Modern cryptography is built on four fundamental pillars:Confidentiality: Ensures that intercepted data remains completely unreadable to unauthorized parties.Integrity: Guarantees that data has not been maliciously altered, tampered with, or corrupted in transit.Authentication: Verifies the identities of the sender and receiver, ensuring data comes from a trusted source.Non-Repudiation: Prevents a sender from denying they sent a message or signed a specific document.","Tools: Some common tools to decrypt: cybershef, a well known tool mainly used for cryptography and decrypting, it is will famous in ctf communities and is opensource for anyone to view and modify"],
    challenges:"Decrypt this message: Q1lCRVJ7SS1Mb3ZlLWJ1aWxkaW5nLXNlY3VyZS13ZWItYXBwc30K",
    flag:"CYBER{I-Love-building-secure-web-apps}",
    color: 'var(--cyber-pink)'
  },
  {
    id: 4,
    title: 'Reverse Engineering 101',
    category: 'Reverse',
    duration: '35 min',
    description: 'Learn how to decompile programs and understand machine code to find hidden flags.',
    icon: Video,
    parts:["Reverse engineering is the process of deconstructing a system, device, or software to understand how it works. In a \"101\" or beginner context, it primarily focuses on software—taking a compiled program without its source code and analyzing it to uncover its internal logic, find vulnerabilities, or understand its behavior.","Core ConceptsTo get started with software reverse engineering, you need to understand a few foundational concepts:Binary Code: Software is written by humans in readable programming languages, then compiled into machine code (binaries) for the computer to run. Reverse engineering aims to translate that machine code back into something humans can read.Assembly Language: This is the bridge between human-readable code and machine code. You will need a basic grasp of assembly instructions (like MOV, ADD, JMP) to trace how a program moves data and makes decisions.Static vs. Dynamic Analysis:Static Analysis: Examining the code and structure without actually running it.Dynamic Analysis: Running the program in a safe, controlled environment (like a virtual machine) to see how it behaves in real-time.","Essential ToolsBeginners rely on a specific set of tools to do the heavy lifting:Disassemblers: Tools that convert machine code into readable assembly code (e.g., Ghidra, IDA Pro).Decompilers: Advanced tools that take assembly code and attempt to convert it into high-level, pseudo-C code.Debuggers: Programs that let you pause the execution of software line-by-line, inspect memory, and view the status of the CPU (e.g., x64dbg, GDB).","Common ApplicationsWhy do people learn reverse engineering?Malware Analysis: Deconstructing viruses or ransomware to understand what they do, who created them, and how to stop them.Vulnerability Research: Inspecting software to find hidden bugs or security flaws that attackers could exploit.Interoperability & Modding: Studying proprietary software to make third-party tools, create game mods, or bypass digital locks.","Common tools for ctfs: exiftool, jadxgui, and much more :)"],
    color: 'var(--cyber-cyan)'
  }
];

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
        cursor: 'pointer'
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
