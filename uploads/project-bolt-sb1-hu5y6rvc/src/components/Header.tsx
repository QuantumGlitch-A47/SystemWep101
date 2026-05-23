import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { label: 'About', link: '#about' },
    { label: 'Projects', link: '#projects' },
    { label: 'Contact', link: '#contact' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-space-800/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-lg font-medium tracking-tight flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-space-100 text-space-950 flex items-center justify-center font-bold text-xs tracking-tighter group-hover:bg-accent-500 transition-colors duration-300">
            FH
          </div>
          <span className="text-space-400 group-hover:text-space-100 transition-colors">
            F. HASAN
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navigation.slice(0, 2).map((item) => (
            <a
              key={item.label}
              href={item.link}
              className="text-sm font-medium text-space-400 hover:text-space-100 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-sm font-medium px-4 py-2 rounded-full border border-space-800 bg-space-900/50 hover:bg-space-800 hover:border-space-700 transition-all"
          >
            Contact
          </a>
        </nav>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-space-400 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-space-800/50 bg-space-900/95 backdrop-blur-lg">
          <nav className="flex flex-col gap-1 p-4">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-space-400 hover:text-space-100 transition-colors py-2"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
