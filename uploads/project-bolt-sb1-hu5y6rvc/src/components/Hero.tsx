import React from 'react';
import { ArrowRight, Download } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="about" className="max-w-6xl mx-auto px-6 mb-28">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-space-900/50 border border-space-800 text-xs font-medium text-accent-500 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
          </span>
          Open to Summer 2026 Internships
        </div>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-space-400">
          Engineering the next generation of aerospace systems.
        </h1>

        <p className="text-lg md:text-xl text-space-400 font-light leading-relaxed max-w-2xl mb-10">
          Aerospace Systems Engineering student at the University of Glasgow, combining technical
          precision with creative problem-solving. My work spans aircraft design, propulsion
          systems, and software development—always pushing the boundaries of what's possible in
          aerospace and technology.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-space-950 rounded text-sm font-medium hover:bg-space-200 transition-colors"
          >
            View Projects
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </a>
          <a
            href="/resume.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 bg-space-900 border border-space-800 text-space-100 rounded text-sm font-medium hover:bg-space-800 transition-colors"
          >
            Resume
            <Download className="w-4 h-4" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </section>
  );
};
