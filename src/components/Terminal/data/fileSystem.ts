import type { FileSystem } from '../types';

// File system data
export const fileSystem: FileSystem = {
'projects': {
    type: 'directory',
    children: {
      'ronnakrit-net.md': {
        type: 'file',
        content: `
PROJECT: RONNAKRIT.NET

An interactive personal portfolio featuring a functional terminal 
interface, tailored for a Network Automation & Engineering persona.

FEATURES:
- Interactive Command Line Experience
- Basic File System Navigation (Beta / Under Development)
- High-Performance Optimization (100% PageSpeed Insights Score)
- Production Deployment via GitHub Pages & Cloudflare

TECHNOLOGIES:
- Framework       : Astro, React
- Language        : TypeScript
- Styling         : Tailwind CSS
- Tooling & Infr  : Cloudflare, Git, Windsurf AI
`
      },
      'schedule-management-system.md': {
        type: 'file',
        content: `
PROJECT: ACADEMIC SCHEDULE MANAGER

A web-based system designed to manage and visualize academic schedules 
across three different dimensions: Students, Teachers, and Classrooms.

FEATURES:
- Triple-View Scheduling Interface (Student, Teacher, Room)
- Conflict-Free Session Management (Automated Schedule Collision Check)
- Real-Time Dynamic Visualization for Classroom Usage
- Developed with AI-Assisted Engineering Workflow

TECHNOLOGIES:
- Backend       : PHP
- Database      : MySQL (phpMyAdmin)
- Environment   : XAMPP Localhost Stack (Academic Sandbox)
- Tooling       : Claude AI, Git
`
      }
    }
  },
  'about.md': {
    type: 'file',
    content: `
PROFILE: RONNAKRIT WANANUKAN

I am a 3rd-year Computer Engineering student at Rajamangala University 
of Technology Phra Nakhon. My journey started with a High Vocational 
Diploma in Information Technology, and now I'm bridging the gap 
between systems infrastructure and software through network automation.

CORE FOCUS:
- Network Engineering (Preparing for CCNA)
- Network Automation (Python, Netmiko, Ansible)
- Linux Systems (Currently Learning)
- Web Development (React, Astro)

PHILOSOPHY:
"Simplicity is the ultimate sophistication."
`
  },
  'skills.md': {
    type: 'file',
    content: `
TECHNICAL SKILLS

NETWORK & INFRASTRUCTURE:
- OSI Model, TCP/IP & Network Fundamentals
- Network Simulation: Cisco Packet Tracer
- Web Infrastructure: DNS Management (Cloudflare), Email Routing

PROGRAMMING & WEB:
- JavaScript / TypeScript (React, Astro Framework)
- HTML5 / CSS3 (Responsive Web Design)
- Version Control: Git & GitHub (Branching, Code Management)

SYSTEMS & HARDWARE:
- Computer Hardware (PC Assembly, Troubleshooting & Maintenance)
- Operating Systems (Windows & Linux Environments / Currently Learning)

AI & DEVELOPMENT TOOLS:
- AI-Assisted Development (Windsurf, ChatGPT, Claude)
- Prompt Engineering for Code Analysis & Troubleshooting
- Productivity Tools for Modern Engineering Workflows
`
  },
  'contact.md': {
    type: 'file',
    content: `
CONTACT INFORMATION

Reach out for collaborations or internship opportunities:

- [Email]    : contact@ronnakrit.net
- [GitHub]   : github.com/ronnakritnet
- [LinkedIn] : linkedin.com/in/ronnakritnet

STATUS: Looking for Internship (2026-2027)
`
  },
  'roadmap.md': {
    type: 'file',
    content: `
ROADMAP 2026-2027

STATUS KEYS: [✔] Completed | [>] In Progress | [ ] To Do
---------------------------------------------------------

PHASE 1: FOUNDATION & PREPARATION (CURRENT - 2026)
  [✔] Vocational IT Diploma to University Transfer
  [>] Network Fundamentals & CCNA Preparation
  [>] Linux Systems & Ubuntu Environment Basics
  [>] Preparing Python Basics for Network Automation
  [>] Maintaining Portfolio Site & Web Infrastructure
  [ ] Improve Technical Typing Speed (Target: 80 WPM)

PHASE 2: FINAL YEAR & PROFESSIONAL (2027)
  [ ] Secure a Network Engineering Internship
  [ ] Develop Computer Engineering Final Project (Network Automation)
  [ ] Master Network Automation Libraries (Netmiko, Paramiko, Ansible)
  [ ] Launch Tech YouTube Channel (Documenting My Engineering Journey)
  [ ] Graduate in Computer Engineering (RMUTP)
`
  },
  'certs': {
    type: 'directory',
    children: {
      'google_it_support.md': {
        type: 'file',
        content: `
CERTIFICATION: GOOGLE IT SUPPORT PROFESSIONAL

Issuer       : Google (via Coursera)
Status       : Completed & Verified
Credential   : https://coursera.org/share/6ee83fcc650e37c3d8cd35c73961b3e3
Core Focus   : IT Foundations & Infrastructure Support

KEY KNOWLEDGE AREAS (Based on 5 Completed Courses):
- Computer Networking (The Bits and Bytes of Network Protocols)
- Operating Systems (Becoming a Windows & Linux Power User)
- System Administration & IT Infrastructure Services
- IT Security (Defense Against the Digital Dark Arts)
- Technical Support Fundamentals & Infrastructure Troubleshooting
`
      },
      'google_cybersecurity.md': {
        type: 'file',
        content: `
CERTIFICATION: GOOGLE CYBERSECURITY PROFESSIONAL

Issuer       : Google (via Coursera)
Status       : Completed & Verified
Credential   : https://coursera.org/share/707bec8c1e18e2be9c0a735b262b32d3
Core Focus   : Security Operations & Infrastructure Defense

KEY KNOWLEDGE AREAS (Based on 9 Completed Courses):
- Networks and Network Security (Connect & Protect Frameworks)
- Tools of the Trade (Linux CLI & SQL Data Querying)
- Automate Cybersecurity Tasks (Python Scripting Fundamentals)
- Threat & Vulnerability Management (Assets & Risk Mitigation)
- Detection and Response (Sound the Alarm / Incident Mitigation)
`
      }
    }
  }
};
