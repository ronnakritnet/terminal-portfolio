// Utility function to convert content with links to HTML string
export const renderTerminalContent = (content: string): string => {
  // Check if content is an object and convert to string
  if (typeof content !== 'string') {
    content = String(content);
  }
  
  // Regex patterns for URLs and emails
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|github\.com\/[^\s]+|linkedin\.com\/[^\s]+)/g;
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  
  // Split content by URLs and emails
  const parts = content.split(/(https?:\/\/[^\s]+|www\.[^\s]+|github\.com\/[^\s]+|linkedin\.com\/[^\s]+|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)/);
  
  return parts.map((part, index) => {
    // Check if it's a URL
    if (urlPattern.test(part)) {
      const href = part.startsWith('http') ? part : `https://${part}`;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors duration-200" style="color: #60A5FA">${part}</a>`;
    }
    
    // Check if it's an email
    if (emailPattern.test(part)) {
      return `<a href="mailto:${part}" onClick="navigator.clipboard.writeText('${part}').then(() => console.log('Email copied!')).catch(() => window.location.href='mailto:${part}'); return false;" title="Click to send email (also copies to clipboard)" class="text-green-400 hover:text-green-300 hover:underline cursor-pointer transition-colors duration-200" style="color: #4ADE80">${part}</a>`;
    }
    
    // Regular text - escape HTML to prevent issues
    return part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }).join('');
};
