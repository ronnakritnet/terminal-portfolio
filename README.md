# Ronnakrit Terminal Portfolio

An interactive terminal-style portfolio website built with Astro, React, and Tailwind CSS. Experience a unique CLI interface showcasing projects, skills, and contact information.

**Version**: v1.0.0 (Initial Release)
**Repository**: ronnakritnet/terminal-portfolio

## 🚀 Features

### Interactive Shell
Fully functional terminal UI built with React, TypeScript, and Tailwind CSS. Features authentic Linux terminal behavior with green-on-black Matrix theme.

### Advanced Terminal Logic
- **Command History**: Navigate through previous commands using Up/Down arrow keys
- **Intelligent Auto-completion**: Tab completion and Right arrow suggestions with ghost text preview
- **Robust Error Handling**: Bash-style error messages with "Did you mean?" suggestions
- **Empty Command Validation**: Prevents processing of blank inputs

### Custom Commands
Support for `about`, `projects`, `skills`, `roadmap`, `contact`, and `whois` commands with detailed output and file system simulation.

### Robust Design
- **Defensive Programming**: Comprehensive input validation and error handling
- **Fully Responsive Layout**: Mobile-optimized padding (`pb-24 md:pb-8`) prevents navigation overlap
- **Cross-browser Compatibility**: Works seamlessly on modern browsers

## 🛠️ Technology Stack

- **Framework**: Astro (Static Site Generation)
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with custom terminal theme
- **Icons**: Lucide React Icons
- **Deployment**: GitHub Pages with automated CI/CD

## 📱 Responsive Design

### Desktop Experience
Full terminal experience with keyboard shortcuts, command history, and authentic terminal behavior.

### Mobile Optimization
- **Virtual Terminal Controls**: On-screen Tab, Up, Down buttons for mobile interaction
- **Dynamic Layout**: Adaptive design prevents keyboard overlap with focus mode
- **Touch-friendly Interface**: Optimized for mobile devices with proper touch targets

## 📋 Command Reference

### Basic Commands
```bash
help                    # Show all available commands
about                   # Display personal information
projects                # List portfolio projects
skills                  # Show technical skills
contact                 # Display contact information
clear                   # Clear terminal screen
ls                      # List current directory
cd <directory>         # Change directory
cat <file>            # Display file contents
```

### File System Commands
```bash
cd projects             # Change to projects directory
cat about.md           # Display file contents
cat projects/ronnakrit-net.md  # View project details
```

### Special Commands
```bash
whois ronnakrit        # Easter egg - domain lookup
```

### Navigation Shortcuts
- **Tab**: Auto-complete commands
- **Up/Down Arrows**: Navigate command history
- **Mobile Controls**: Use virtual buttons on mobile devices

## 🎨 Design System

### Color Scheme
- **Background**: `#0D0D0D` (Very dark gray)
- **Terminal Green**: `#00FF00`
- **Terminal Blue**: `#0080FF`
- **Terminal Gray**: `#666666`
- **Light Green**: `#90EE90`
- **Text White**: `#F0F0F0`

### Typography
- **Font Family**: Courier New (monospace)
- **Responsive**: Adaptive sizing for all devices

## � Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. Clone the repository:
```bash
git clone https://github.com/ronnakritnet/terminal-portfolio.git
cd terminal-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:4321`

## 🚀 Build & Deploy

### Local Build
```bash
npm run build
npm run preview
```

### GitHub Pages Deployment
1. Push to main branch
2. GitHub Actions will automatically build and deploy
3. Site will be available at `https://ronnakrit.net`

## 👨‍💻 About the Author

This portfolio is created by Ronnakrit Wananukan, a 3rd-year Computer Engineering student focusing on **NetDevOps**, modern infrastructure, and network systems. The project demonstrates skills in web development, terminal interface design, and responsive user experience.

**Educational Background**: IT Vocational Certificate to University Transfer
**Current Focus**: Network Engineering (CCNA in progress) and Network Automation
**Philosophy**: Creating practical tools that bridge the gap between hardware and software through automation.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

- **Email**: contact@ronnakrit.net
- **GitHub**: github.com/ronnakrit
- **LinkedIn**: linkedin.com/in/ronnakrit

---

*Built with ❤️ using Astro, React, TypeScript, and Tailwind CSS*
