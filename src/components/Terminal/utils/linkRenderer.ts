// Utility function to escape HTML special characters
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const KNOWN_COMMANDS = new Set([
  'about',
  'projects',
  'skills',
  'roadmap',
  'contact',
  'certs',
  'ls',
  'cd',
  'cat',
  'tree',
  'whois',
  'sudo',
  'help',
  'clear'
]);

/**
 * Resolve target CLI command for a clicked file item
 */
const resolveFileCommand = (filename: string): string => {
  const clean = filename.trim();
  if (clean.startsWith('projects/') || clean.startsWith('certs/')) {
    return `cat ${clean}`;
  }
  if (clean === 'ronnakrit-net.md' || clean === 'schedule-management-system.md') {
    return `cat projects/${clean}`;
  }
  if (clean === 'google_it_support.md' || clean === 'google_cybersecurity.md') {
    return `cat certs/${clean}`;
  }
  return `cat ${clean}`;
};

/**
 * Generate clickable span for commands with data-command attribute
 */
const createCommandSpan = (cmd: string, displayText: string, title?: string): string => {
  const safeCmd = escapeHtml(cmd);
  const safeText = escapeHtml(displayText);
  const safeTitle = escapeHtml(title || `Click to run: ${cmd}`);
  return `<span role="button" tabindex="0" data-command="${safeCmd}" class="cursor-pointer text-green-400 hover:text-green-300 underline decoration-green-400/50 hover:decoration-green-300 underline-offset-2 font-semibold transition-colors duration-150" title="${safeTitle}">${safeText}</span>`;
};

/**
 * Generate external URL anchor tag
 */
const createUrlLink = (url: string): string => {
  const href = url.startsWith('http') ? url : `https://${url}`;
  const safeHref = escapeHtml(href);
  const safeText = escapeHtml(url);
  return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors duration-200" style="color: #60A5FA">${safeText}</a>`;
};

/**
 * Generate mailto anchor tag
 */
const createEmailLink = (email: string): string => {
  const safeEmail = escapeHtml(email);
  return `<a href="mailto:${safeEmail}" title="Send email to ${safeEmail}" class="text-green-400 hover:text-green-300 hover:underline cursor-pointer transition-colors duration-200" style="color: #4ADE80">${safeEmail}</a>`;
};

/**
 * Process tokens inside a single line
 */
const processInlineTokens = (text: string): string => {
  // Tokenizer regex matching URLs, emails, file items, directory items, quoted commands, and examples
  const tokenRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|github\.com\/[^\s]+|linkedin\.com\/[^\s]+)|(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b)|(📄\s*[a-zA-Z0-9_\-\.\/]+\.md)|(📁\s*[a-zA-Z0-9_\-]+\/)|'([a-zA-Z0-9_\-\s\/]+)'|(e\.g\.,\s*(?:cd\s+[a-zA-Z0-9_\-]+|cat\s+[a-zA-Z0-9_\-\.\/]+|whois\s+[a-zA-Z0-9_\-\.]+))/g;

  let lastIndex = 0;
  let result = '';
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    // Append preceding raw text (escaped)
    result += escapeHtml(text.slice(lastIndex, match.index));
    lastIndex = tokenRegex.lastIndex;

    const fullMatch = match[0];

    // 1. URL
    if (match[1]) {
      result += createUrlLink(match[1]);
    }
    // 2. Email
    else if (match[2]) {
      result += createEmailLink(match[2]);
    }
    // 3. File (📄 filename.md)
    else if (match[3]) {
      const fileMatch = match[3].match(/^(📄\s*)([a-zA-Z0-9_\-\.\/]+\.md)$/);
      if (fileMatch) {
        const prefix = fileMatch[1];
        const filename = fileMatch[2];
        const cmd = resolveFileCommand(filename);
        result += createCommandSpan(cmd, `${prefix}${filename}`, `Click to view: ${cmd}`);
      } else {
        result += escapeHtml(fullMatch);
      }
    }
    // 4. Directory (📁 dirname/)
    else if (match[4]) {
      const dirMatch = match[4].match(/^(📁\s*)([a-zA-Z0-9_\-]+)\/$/);
      if (dirMatch) {
        const prefix = dirMatch[1];
        const dirname = dirMatch[2];
        const cmd = (dirname === 'projects' || dirname === 'certs') ? dirname : `cd ${dirname}`;
        result += createCommandSpan(cmd, `${prefix}${dirname}/`, `Click to open: ${cmd}`);
      } else {
        result += escapeHtml(fullMatch);
      }
    }
    // 5. Quoted command ('cmd')
    else if (match[5]) {
      const inner = match[5].trim();
      const isKnown = KNOWN_COMMANDS.has(inner);
      const isCommandPattern = /^(cat|cd|ls|whois|sudo)(\s+[a-zA-Z0-9_\-\.\/]+)?$/.test(inner) ||
        inner === 'cat --help' ||
        inner === 'ls --help' ||
        inner === 'whois --help';

      if (isKnown || isCommandPattern) {
        result += `&#039;${createCommandSpan(inner, inner, `Click to run: ${inner}`)}&#039;`;
      } else {
        result += `&#039;${escapeHtml(match[5])}&#039;`;
      }
    }
    // 6. Help usage example (e.g., cd projects)
    else if (match[6]) {
      const egMatch = match[6].match(/^(e\.g\.,\s*)(.+)$/);
      if (egMatch) {
        const egPrefix = escapeHtml(egMatch[1]);
        const egCmd = egMatch[2].trim();
        result += `${egPrefix}${createCommandSpan(egCmd, egCmd, `Click to run: ${egCmd}`)}`;
      } else {
        result += escapeHtml(fullMatch);
      }
    }
  }

  // Append remaining text
  result += escapeHtml(text.slice(lastIndex));
  return result;
};

/**
 * Convert terminal output content to sanitized HTML with interactive links, command triggers, and green hierarchy
 */
export const renderTerminalContent = (content: string): string => {
  if (typeof content !== 'string') {
    content = String(content);
  }

  const lines = content.split('\n');
  return lines.map(line => {
    // 1. Check for HELP_OUTPUT command row (2 spaces indentation + command name + at least 2 spaces)
    const helpRowMatch = line.match(/^(\s{2})([a-z]+)(\s{2,}.*)$/);
    if (helpRowMatch && KNOWN_COMMANDS.has(helpRowMatch[2])) {
      const indent = escapeHtml(helpRowMatch[1]);
      const cmd = helpRowMatch[2];
      const rest = helpRowMatch[3];
      return `${indent}${createCommandSpan(cmd, cmd, `Click to run: ${cmd}`)}${processInlineTokens(rest)}`;
    }

    // 2. Standalone section titles & headers (e.g. USER_PROFILE:, PROJECTS DIRECTORY:, FEATURES:, TECHNICAL SKILLS)
    const sectionTitleMatch = line.match(/^(\s*)([A-Z][A-Z0-9_\s&\-\/\[\]()]{2,}:?)(\s*)$/);
    if (sectionTitleMatch && !sectionTitleMatch[2].startsWith('HTTP')) {
      const prefix = escapeHtml(sectionTitleMatch[1]);
      const title = escapeHtml(sectionTitleMatch[2]);
      const suffix = escapeHtml(sectionTitleMatch[3]);
      return `${prefix}<span class="text-green-400 font-bold tracking-wide" style="color: #4ade80;">${title}</span>${suffix}`;
    }

    // 3. Prefixed Headers (e.g. PROJECT: ..., CERTIFICATION: ..., PROFILE: ..., PHASE 1: ...)
    const prefixHeaderMatch = line.match(/^(\s*)(PROJECT|CERTIFICATION|PROFILE|PHASE\s+[0-9]+):\s*(.*)$/);
    if (prefixHeaderMatch) {
      const indent = escapeHtml(prefixHeaderMatch[1]);
      const header = escapeHtml(prefixHeaderMatch[2]);
      const rest = prefixHeaderMatch[3];
      return `${indent}<span class="text-green-400 font-bold tracking-wide" style="color: #4ade80;">${header}:</span> ${processInlineTokens(rest)}`;
    }

    return processInlineTokens(line);
  }).join('\n');
};
