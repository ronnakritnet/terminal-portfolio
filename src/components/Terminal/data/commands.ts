// 1. เรียงลำดับใหม่ตามกลุ่มความสำคัญ
export const COMMANDS_DESC = {
  // Profile Group
  about:    'Display information about Ronnakrit',
  projects: 'List and view my technical projects',
  skills:   'Show technical skills & certifications',
  roadmap:  'Display educational & professional journey',
  contact:  'Show contact information & social links',
  
  // System Group
  ls:       'List directory contents',
  cd:       'Change directory',
  cat:      'Display file contents',
  
  // Utility Group
  whois:    'Domain lookup utility',
  sudo:     'Execute command as superuser',
  help:     'Show available commands',
  clear:    'Clear terminal screen',
} as const;

// 2. ปรับ HELP_OUTPUT ให้ดูคลีนและสมมาตร
export const HELP_OUTPUT = `Available commands:
${Object.entries(COMMANDS_DESC).map(([cmd, desc]) => `  ${cmd.padEnd(15)} ${desc}`).join('\n')}

Usage Examples:
  cat [filename]  e.g., cat ronnakrit-net.md
  cd [directory]  e.g., cd projects
  whois [domain]  e.g., whois ronnakrit.net`;