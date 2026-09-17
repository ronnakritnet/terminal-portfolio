import type { FileSystem, FileSystemNode } from '../types';
import { PROJECTS_DATA, CERTS_DATA } from '../../../data/portfolio';

// Generate project files dynamically from single source of truth
const projectsChildren: Record<string, FileSystemNode> = {};
for (const p of PROJECTS_DATA) {
  projectsChildren[p.filename] = {
    type: 'file',
    content: `
PROJECT: ${p.title}

${p.description}

FEATURES:
${p.features.map(f => `- ${f}`).join('\n')}

TECHNOLOGIES:
${p.technologies.map(t => `- ${t.label.padEnd(16)}: ${t.value}`).join('\n')}
`
  };
}

// Generate certification files dynamically from single source of truth
const certsChildren: Record<string, FileSystemNode> = {};
for (const c of CERTS_DATA) {
  certsChildren[c.filename] = {
    type: 'file',
    content: `
CERTIFICATION: ${c.title}

Issuer       : ${c.issuer}
Status       : ${c.status}
Credential   : ${c.credentialUrl}
Core Focus   : ${c.coreFocus}

KEY KNOWLEDGE AREAS:
${c.keyKnowledgeAreas.map(k => `- ${k}`).join('\n')}
`
  };
}

// File system data
export const fileSystem: FileSystem = {
  projects: {
    type: 'directory',
    children: projectsChildren
  },
  'about.md': {
    type: 'file',
    content: `
PROFILE: RONNAKRIT WANANUKAN

I am a Computer Engineering student at Rajamangala University of 
Technology Phra Nakhon. My journey started with a High Vocational 
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
  certs: {
    type: 'directory',
    children: certsChildren
  }
};
