import React from 'react';

const experiences = [
  {
    title: 'Aeronautical Engineer Intern',
    company: 'Boeing / General Electric',
    period: 'Jun 2023 — Aug 2023',
    description:
      'Worked on turbine blade cooling simulations using ANSYS. Integrated C++ modules for real-time sensor data acquisition during static fire tests.',
    active: true,
  },
  {
    title: 'Undergraduate Researcher',
    company: 'University Propulsion Lab',
    period: 'Jan 2023 — Present',
    description:
      'Developing an AI-driven control system for variable nozzle geometry. Utilizing Python and React for the visualization dashboard of engine metrics.',
    active: false,
  },
];

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="max-w-6xl mx-auto px-6 mb-32">
      <h2 className="text-2xl font-semibold tracking-tight mb-12">Experience</h2>

      <div className="relative border-l border-space-800 ml-3 space-y-12">
        {experiences.map((exp, index) => (
          <div key={index} className="relative pl-8">
            <div
              className={`absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full ${
                exp.active
                  ? 'bg-space-950 border border-accent-500'
                  : 'bg-space-800 border border-space-600'
              }`}
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h3 className="text-lg font-medium text-white">{exp.title}</h3>
              <span className="text-xs font-mono text-space-500">{exp.period}</span>
            </div>
            <p
              className={`text-sm mb-2 ${
                exp.active ? 'text-accent-500' : 'text-space-300'
              }`}
            >
              {exp.company}
            </p>
            <p className="text-sm text-space-400 font-light max-w-2xl leading-relaxed">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
