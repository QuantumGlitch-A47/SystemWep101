import React from 'react';
import { Wind, Box, Code2, Atom, FileCode2, BrainCircuit, Zap } from 'lucide-react';

const skills = [
  { name: 'ANSYS Fluent', icon: Wind, featured: false },
  { name: 'CAD', icon: Box, featured: false },
  { name: 'MATLAB', icon: Code2, featured: false },
  { name: 'React', icon: Atom, featured: true },
  { name: 'C++', icon: FileCode2, featured: true },
  { name: 'Python', icon: Zap, featured: true },
  { name: 'Artificial Intelligence', icon: BrainCircuit, featured: true },
];

export const TechnicalCompetencies: React.FC = () => {
  return (
    <section className="border-y border-space-800/50 bg-space-900/20 backdrop-blur-sm mb-32">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-xs font-medium text-space-400 uppercase tracking-widest mb-6">
          Technical Competencies
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 opacity-80">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div key={skill.name} className="flex items-center gap-3">
                <Icon
                  className={skill.featured ? 'text-accent-500' : 'text-space-100'}
                  size={20}
                  strokeWidth={1.5}
                />
                <span className="text-sm text-space-300">{skill.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
