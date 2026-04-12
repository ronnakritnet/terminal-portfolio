// Command response templates
export const COMMAND_RESPONSES = {
  whois: {
    missingArgs: `Usage: whois [OPTION]... OBJECT...\n\nTry 'whois --help' for more information.`,
    ronnakrit: `% WHOIS database response for ronnakrit.net

Domain Name: ronnakrit.net
Registry Domain ID: 2841923841_DOMAIN_NET-VRSN
Registrar: Cloudflare, Inc.
Created: 2024-01-10T08:00:00Z
Expires: 2027-01-10T08:00:00Z
Updated: 2026-03-15T10:00:00Z
Status: ACTIVE

Registrant:
  Name: Ronnakrit W.
  Organization: Computer Engineering Student
  Country: TH
  
Technical Contact:
  Email: contact@ronnakrit.net
  GitHub: github.com/ronnakritnet
  LinkedIn: linkedin.com/in/ronnakritnet
  
Name Servers:
  pam.ns.cloudflare.com
  vancity.ns.cloudflare.com
  
DNSSEC: signed

% ---------------------------------------------------
% This is an easter egg. Nice discovery! 🎉`,
    notFound: (domain: string) => `No whois data available for ${domain}`
  },
  sudo: {
    missingArgs: `usage: sudo [-AbEHknPS] [-u user] [command]
usage: sudo -h | -K | -k | -V`,
    accessDenied: (command: string) => `[sudo] password for ronnakrit: 
Access Denied: You are not in the sudoers file.
This incident will be reported.

🚨 ALERT: Unauthorized sudo attempt detected!
📅 Timestamp: ${new Date().toISOString()}
👤 User: ronnakrit@portfolio
🔧 Command: sudo ${command}
📍 Location: Terminal Session
🚫 Status: DENIED

System Administrator has been notified.`
  }
} as const;
