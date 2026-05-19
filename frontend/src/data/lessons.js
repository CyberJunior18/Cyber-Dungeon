import { Database, FileSearch, KeyRound } from 'lucide-react';
import imgUrl from '../assets/img.jpg?url';
import theNumbersUrl from '../assets/the_numbers.png?url';

export const lessonData = [
  {
    id: 1,
    title: 'SQL Injection',
    category: 'Web',
    duration: '25 min',
    description: 'Learn how SQL injection works in CTFs, where to test for it, and how to reason through visible, blind, and ORDER BY based injections.',
    icon: Database,
    color: 'var(--cyber-purple)',
    moduleTitles: ['What SQL Injection Is', 'Common CTF Patterns', 'Solving Workflow'],
    parts: [
      `**SQL injection** happens when user-controlled input becomes part of a database query in an unsafe way. In a CTF, the goal is usually to prove that you can change the meaning of a query and use that behavior to recover a flag.

Start by mapping the feature. Login forms, search boxes, filters, profile pages, sort controls, IDs in URLs, and export/report tools are all worth testing. Do not assume only text inputs matter. Sometimes a dropdown, hidden field, cookie, or "sort by" option is the actual injection point.

Classic signs include SQL errors, different results for quotes, changed page behavior after boolean tests, or timing differences after delay payloads. A simple workflow is: find input, confirm control, learn the query shape, identify the database type if possible, then extract the needed value.`,
      `Common SQL injection patterns in CTFs:

Visible injection: the page directly prints database output. You may use UNION SELECT after finding the column count and compatible column types.

Boolean blind injection: the page does not print query output, but true and false conditions change the response. You extract data one character at a time with questions like "is the first character greater than m?"

Time-based blind injection: true conditions make the server sleep. It is slower, but useful when the page response does not visibly change.

ORDER BY injection: the value is used to sort rows. ORDER BY cannot be parameterized in the same way as normal values, so developers often concatenate it. A CASE WHEN expression can make true and false produce different row orders.`,
      `A practical CTF solving checklist:

1. Try harmless probes first: a single quote, double quote, numeric changes, true/false conditions, and unusual sort values.
2. Observe one stable signal: error text, row count, response order, status code, page length, or timing.
3. Identify what you need: table name, column name, row key, or exact flag value.
4. Ask targeted questions instead of guessing randomly.
5. Automate repetitive blind extraction with Burp Suite Intruder, ffuf, curl scripts, or a small Python request loop.

Useful tools: Burp Suite, browser devtools, curl, sqlmap for learning/comparison, CyberChef for decoding output, and a notes file for tracking payloads and observations. In CTFs, sqlmap can be helpful, but understanding the logic matters more because many challenges are custom.`
    ]
  },
  {
    id: 2,
    title: 'Forensics',
    category: 'Forensics',
    duration: '30 min',
    description: 'Build a repeatable approach for file, image, archive, log, and packet forensics challenges, with the tools CTF players reach for first.',
    icon: FileSearch,
    color: 'var(--cyber-cyan)',
    moduleTitles: ['First Look', 'File And Image Workflow', 'Logs, Packets, Archives'],
    parts: [
      `**Forensics** challenges ask you to recover hidden evidence from files, images, logs, memory captures, network traffic, archives, or disk images. The most important skill is moving carefully from simple inspection to deeper analysis without damaging the evidence.

Start with the basics: identify the file type, check metadata, inspect strings, verify whether the extension matches the real format, and look for obvious embedded content. Many beginner challenges hide flags in EXIF metadata, appended data, comments, archive layers, or readable strings.

Keep copies of original files. Work in a separate folder, write down every command you run, and save intermediate outputs.`,
      `Core workflow for file and image challenges:

1. Identify the file: file challenge.bin
2. Read metadata: exiftool image.jpg
3. Search readable text: strings file | less
4. Check hidden embedded files: binwalk file
5. Inspect bytes manually: xxd file | less or hexyl file
6. For images, test steganography: zsteg for PNG/BMP, steghide for JPEG/WAV, foremost for carving.

Useful tools: file, exiftool, strings, binwalk, foremost, zsteg, steghide, pngcheck, identify, hexedit, xxd, CyberChef, and Aperi'Solve for quick image checks.`,
      `Other common forensics areas:

Logs: sort events by time, search for suspicious usernames/IPs/commands, decode base64 strings, and compare successful versus failed requests.

PCAP/network: open in Wireshark, follow TCP streams, filter HTTP/DNS/FTP/ICMP, export transferred files, and inspect suspicious payloads.

Archives: check nested zip/tar/rar files, weak passwords, comments, corrupted headers, and file names. Tools include 7z, zipinfo, fcrackzip, john, and hashcat.

Memory or disk images: use Volatility, Autopsy, Sleuth Kit, strings, and timeline analysis.

The trick is to avoid tunnel vision. If metadata is clean, move to strings. If strings are clean, check embedded data. If embedded data is clean, inspect structure and bytes.`
    ],
    challenges: `You are given a seemingly ordinary JPG image. Something is tucked away out of sight inside the file. Your task is to discover the hidden payload and extract the flag.`,
    challengeFile: {
      url: imgUrl,
      name: 'img.jpg'
    },
    flag: 'picoCTF{h1dd3n_1n_1m4g3_e7f5b969}'
  },
  {
    id: 3,
    title: 'Cryptography',
    category: 'Crypto',
    duration: '30 min',
    description: 'Learn how to recognize common CTF encodings and ciphers, then solve encrypted messages with a practical step-by-step method.',
    icon: KeyRound,
    color: 'var(--cyber-pink)',
    moduleTitles: ['Recognition First', 'Common Crypto Types', 'Solving Workflow'],
    parts: [
      `**Crypto CTF** challenges usually give you a strange message and ask you to recover readable text or a flag. Not everything that looks encrypted is encryption. Many beginner challenges are encoding, substitution, rotation, or layered transformations.

Start by identifying the shape of the text. Base64 often uses A-Z, a-z, 0-9, plus, slash, and equals padding. Hex uses 0-9 and a-f. Binary uses 0 and 1. Caesar/ROT keeps letters readable-ish but shifted. Morse uses dots, dashes, and spaces.

Your first job is recognition, not brute force. Ask: what alphabet is used, what characters are missing, does the length reveal anything, and does decoding once reveal another layer?`,
      `Common CTF crypto and encoding types:

Encoding: Base64, Base32, hex, binary, URL encoding, ASCII codes, HTML entities.

Classical ciphers: Caesar, ROT13, Atbash, Vigenere, substitution, transposition, rail fence.

Modern-ish beginner topics: XOR with a repeated key, weak RSA parameters, hash cracking, and reused one-time pads.

Hashing is not encryption. If you see MD5, SHA1, bcrypt, or similar, you normally crack or compare it rather than decrypt it.`,
      `A practical solving workflow:

1. Paste the text into CyberChef and try magic, Base64, hex, ROT13, XOR, and common decoders.
2. Look for known flag fragments like Cyber, MUCTF, CTF, or braces after each step.
3. If it is a Caesar-style shift, brute force all 25 shifts.
4. If it is XOR, check whether a repeated key or known plaintext can reveal the key.
5. If it is a hash, use hashid/name-that-hash, then try rockyou.txt with hashcat or John the Ripper.
6. If math appears, write down the formula and identify what is known versus unknown.

Useful tools: CyberChef, dCode, quipqiup, hashid, name-that-hash, hashcat, John the Ripper, Python, SageMath, and RsaCtfTool.`
    ],
    challenges: `The numbers... what do they mean?`,
    challengeFile: {
      url: theNumbersUrl,
      name: 'the_numbers.png'
    },
    flag: 'picoCTF{thenumbersmason}'
  }
];
