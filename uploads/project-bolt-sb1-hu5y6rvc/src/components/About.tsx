import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { User } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 px-6 bg-gradient-to-b from-transparent to-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <Card className="p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Building solutions from the sky to the screen.
              </h2>

              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Aerospace Systems Engineering student at the University of Glasgow, combining
                  technical precision with creative problem-solving. My work spans aircraft design,
                  propulsion systems, and software development—always pushing the boundaries of
                  what's possible in aerospace and technology.
                </p>
                <p>
                  Currently exploring innovative projects from engine maintenance systems to
                  amphibious aircraft design, with a focus on practical solutions that make a
                  real-world impact.
                </p>
              </div>

              <div className="mt-8">
                <Badge icon="🎯" className="bg-green-500/10 border-green-500/20 text-green-400">
                  Open to Summer 2026 Internships & Collaborations
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-sm aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-gray-700 flex items-center justify-center">
                <User className="w-32 h-32 text-gray-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
