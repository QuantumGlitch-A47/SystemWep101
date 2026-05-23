import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-space-800/50 bg-space-950 text-space-500 py-12 relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xs font-medium tracking-tight">© 2024 F. Hasan.</div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/fhasan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-space-500 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} strokeWidth={1.5} />
          </a>
          <a
            href="https://linkedin.com/in/fhasan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-space-500 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} strokeWidth={1.5} />
          </a>
          <a
            href="mailto:f.hasan@example.com"
            className="text-space-500 hover:text-white transition-colors"
            aria-label="Email"
          >
            <Mail size={18} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </footer>
  );
};
