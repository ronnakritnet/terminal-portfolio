export interface ProjectItem {
  id: string;
  filename: string;
  numberStr: string;
  title: string;
  description: string;
  features: string[];
  technologies: { label: string; value: string }[];
}

export interface CertItem {
  id: string;
  filename: string;
  title: string;
  issuer: string;
  status: string;
  credentialUrl: string;
  coreFocus: string;
  keyKnowledgeAreas: string[];
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'ronnakrit-net',
    filename: 'ronnakrit-net.md',
    numberStr: 'PROJECT 01',
    title: 'RONNAKRIT.NET',
    description: 'An interactive personal portfolio featuring a functional terminal interface, tailored for a Network Automation & Engineering persona.',
    features: [
      'Interactive Command Line Experience',
      'Basic File System Navigation (Beta / Under Development)',
      'High-Performance Optimization (100% PageSpeed Insights Score)',
      'Production Deployment via GitHub Pages & Cloudflare'
    ],
    technologies: [
      { label: 'Framework', value: 'Astro, React' },
      { label: 'Language', value: 'TypeScript' },
      { label: 'Styling', value: 'Tailwind CSS' },
      { label: 'Tooling & Infr', value: 'Cloudflare, Git, Windsurf AI' }
    ]
  },
  {
    id: 'schedule-management-system',
    filename: 'schedule-management-system.md',
    numberStr: 'PROJECT 02',
    title: 'ACADEMIC SCHEDULE MANAGER',
    description: 'A web-based system designed to manage and visualize academic schedules across three different dimensions: Students, Teachers, and Classrooms.',
    features: [
      'Triple-View Scheduling Interface (Student, Teacher, Room)',
      'Conflict-Free Session Management (Automated Schedule Collision Check)',
      'Real-Time Dynamic Visualization for Classroom Usage',
      'Developed with AI-Assisted Engineering Workflow'
    ],
    technologies: [
      { label: 'Backend', value: 'PHP' },
      { label: 'Database', value: 'MySQL (phpMyAdmin)' },
      { label: 'Environment', value: 'XAMPP Localhost Stack (Academic Sandbox)' },
      { label: 'Tooling', value: 'Claude AI, Git' }
    ]
  }
];

export const CERTS_DATA: CertItem[] = [
  {
    id: 'google_it_support',
    filename: 'google_it_support.md',
    title: 'GOOGLE IT SUPPORT PROFESSIONAL',
    issuer: 'Google (via Coursera)',
    status: 'Completed & Verified',
    credentialUrl: 'https://coursera.org/share/6ee83fcc650e37c3d8cd35c73961b3e3',
    coreFocus: 'IT Foundations & Infrastructure Support',
    keyKnowledgeAreas: [
      'Computer Networking (The Bits and Bytes of Network Protocols)',
      'Operating Systems (Becoming a Windows & Linux Power User)',
      'System Administration & IT Infrastructure Services',
      'IT Security (Defense Against the Digital Dark Arts)',
      'Technical Support Fundamentals & Infrastructure Troubleshooting'
    ]
  },
  {
    id: 'google_cybersecurity',
    filename: 'google_cybersecurity.md',
    title: 'GOOGLE CYBERSECURITY PROFESSIONAL',
    issuer: 'Google (via Coursera)',
    status: 'Completed & Verified',
    credentialUrl: 'https://coursera.org/share/707bec8c1e18e2be9c0a735b262b32d3',
    coreFocus: 'Security Operations & Infrastructure Defense',
    keyKnowledgeAreas: [
      'Networks and Network Security (Connect & Protect Frameworks)',
      'Tools of the Trade (Linux CLI & SQL Data Querying)',
      'Automate Cybersecurity Tasks (Python Scripting Fundamentals)',
      'Threat & Vulnerability Management (Assets & Risk Mitigation)',
      'Detection and Response (Sound the Alarm / Incident Mitigation)'
    ]
  }
];
