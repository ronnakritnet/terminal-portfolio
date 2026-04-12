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

An interactive personal portfolio featuring a functional 
terminal interface, designed for network engineering 
and automation enthusiasts.

FEATURES:
- Interactive Command Line Experience
- Custom File System Simulation
- Optimized for Linux & Network Engineer Persona
- Deployed via GitHub Pages & Cloudflare

TECHNOLOGIES:
- Framework : Astro, React
- Language  : TypeScript
- Styling   : Tailwind CSS
- Tooling   : Windsurf AI, Git
`
      },
      'schedule-management-system.md': {
        type: 'file',
        content: `
PROJECT: ACADEMIC SCHEDULE MANAGER

A web-based system designed to manage and visualize 
academic schedules across three different dimensions: 
Students, Teachers, and Classrooms.

FEATURES:
- Triple-view Schedule: Student, Teacher, and Room
- Conflict-free Management: Add/Move/Edit sessions
- Real-time Data Visualization for classroom usage
- Built with AI-assisted development workflow

TECHNOLOGIES:
- Backend   : PHP
- Database  : MySQL (phpMyAdmin)
- Server    : XAMPP Stack
- AI Tool   : Claude
`
      }
    }
  },
  'about.md': {
    type: 'file',
    content: `
PROFILE: RONNAKRIT WANANUKAN

I am a 3rd-year Computer Engineering student focusing on modern 
infrastructure and network systems. My journey started with an 
IT Vocational Diploma, and now I'm bridging the gap between hardware 
and software through automation.

CORE FOCUS:
- Network Engineering (CCNA in progress)
- Network Automation (Python, Netmiko)
- Linux System Administration
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
- Cisco (CCNA Study Group / Preparing for exam)
- Network Automation (Python-based scripting)
- OSI Model & Network Fundamentals
- Lab Tools: Cisco Packet Tracer, GNS3

PROGRAMMING & WEB:
- Python (Focus: Network Scripting & Automation)
- JavaScript/TypeScript (React, Astro Framework)
- Shell Scripting (Bash for Linux automation)

SYSTEMS & HARDWARE:
- Linux: Ubuntu (Primary OS / Daily Driver)
- Network OS: Cisco IOS (Basic Configuration)
- Hardware: Lenovo ThinkPad Specialist
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

PHASE 1: FOUNDATION (CURRENT - 2026)
  [X] Vocational Certificate to University Transfer
  [/] CCNA Certification Prep (Target: Q3/Q4)
  [/] Network Automation Portfolio (ronnakrit.net)
  [ ] Improve Technical Typing (Target: 80 WPM)

PHASE 2: PROFESSIONAL (2027)
  [ ] Seek Network Engineering Internship
  [ ] Master Network Automation (Python, Ansible)
  [ ] Launch Network Wiki & YouTube
  [ ] Graduate in Computer Engineering

PROGRESS (PHASE 1): [██████████░░░░░░░░░░] 50%
`
  }
};
