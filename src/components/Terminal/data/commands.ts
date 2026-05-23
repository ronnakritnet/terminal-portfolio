export const COMMANDS_DESC = {
  // Profile Group
  about:    'Display information about Ronnakrit',
  projects: 'List and view my technical projects',
  skills:   'Show technical skills & expertise',
  roadmap:  'Display educational & professional journey',
  contact:  'Show contact information & social links',
  certs:    'List professional certifications',
  
  // System Group
  ls:       'List directory contents',
  cd:       'Change directory',
  cat:      'Display file contents',
  tree:     'Display directory tree structure',
  
  // Utility Group
  whois:    'Domain lookup utility',
  sudo:     'Execute command as superuser',
  help:     'Show available commands',
  clear:    'Clear terminal screen',
} as const;

// 2. ปรับ HELP_OUTPUT ให้ดูคลีนและสมมาตร (อัปเดตตัวอย่างการใช้งานให้ล้อกับระบบ Directory)
export const HELP_OUTPUT = `Available commands:
${Object.entries(COMMANDS_DESC).map(([cmd, desc]) => `  ${cmd.padEnd(15)} ${desc}`).join('\n')}

Usage Examples:
  cd [directory]  e.g., cd projects
  cat [filepath]  e.g., cat projects/ronnakrit-net.md
  whois [domain]  e.g., whois ronnakrit.net`;