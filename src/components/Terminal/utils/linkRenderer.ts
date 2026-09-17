// Utility function to escape HTML special characters
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// URL and email detection patterns (without /g flag for safe testing)
const isUrl = (str: string): boolean => {
  return /^(https?:\/\/[^\s]+|www\.[^\s]+|github\.com\/[^\s]+|linkedin\.com\/[^\s]+)$/.test(str);
};

const isEmail = (str: string): boolean => {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(str);
};

// Utility function to convert content with links to HTML string
export const renderTerminalContent = (content: string): string => {
  // Check if content is an object and convert to string
  if (typeof content !== 'string') {
    content = String(content);
  }
  
  // Split content by URLs and emails
  const splitPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|github\.com\/[^\s]+|linkedin\.com\/[^\s]+|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b)/;
  const parts = content.split(splitPattern);
  
  return parts.map((part) => {
    // Check if it's a URL
    if (isUrl(part)) {
      const href = part.startsWith('http') ? part : `https://${part}`;
      const safeHref = escapeHtml(href);
      const safeText = escapeHtml(part);
      return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors duration-200" style="color: #60A5FA">${safeText}</a>`;
    }
    
    // Check if it's an email
    if (isEmail(part)) {
      const safeEmail = escapeHtml(part);
      return `<a href="mailto:${safeEmail}" title="Send email to ${safeEmail}" class="text-green-400 hover:text-green-300 hover:underline cursor-pointer transition-colors duration-200" style="color: #4ADE80">${safeEmail}</a>`;
    }
    
    // Regular text - escape HTML to prevent issues
    return escapeHtml(part);
  }).join('');
};

