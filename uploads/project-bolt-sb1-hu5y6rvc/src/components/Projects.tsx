import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Eye, EyeOff, Trash2, ArrowUpRight } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  category_tag: string;
  description: string;
  image: string;
  technologies: string[];
  status: string;
  link: string;
  hidden: boolean;
  deleted: boolean;
  display_order: number;
}

const defaultImages = [
  'https://images.unsplash.com/photo-1541185933-710f50031e42?w=1000&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&q=80',
  'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=1000&q=80',
  'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?w=1000&q=80',
  'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=1000&q=80',
];

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    title: '',
    category: '',
    description: '',
    tag1: '',
    tag2: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('deleted', false)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id: number) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ hidden: !project.hidden })
        .eq('id', id);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ deleted: true })
        .eq('id', id);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const addNewProject = async () => {
    if (!newProject.title || !newProject.description) {
      alert('Please fill in at least the Title and Description.');
      return;
    }

    const randomImg = defaultImages[Math.floor(Math.random() * defaultImages.length)];

    try {
      const { error } = await supabase.from('projects').insert([
        {
          title: newProject.title,
          category: newProject.category || 'General Engineering',
          category_tag: newProject.tag1 || 'Engineering',
          description: newProject.description,
          technologies: [newProject.tag1 || 'Engineering', newProject.tag2 || 'Design'],
          status: 'Planning Phase',
          image: randomImg,
          link: '#',
          hidden: false,
          deleted: false,
          display_order: projects.length + 1,
        },
      ]);

      if (error) throw error;

      setNewProject({ title: '', category: '', description: '', tag1: '', tag2: '' });
      setShowAddForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  if (loading) {
    return (
      <section id="projects" className="max-w-6xl mx-auto px-6 mb-32">
        <div className="text-center text-space-400">Loading projects...</div>
      </section>
    );
  }

  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 mb-32">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Project Portfolio</h2>
          <p className="text-space-400 font-light text-sm">
            Manage, view, and organize engineering works.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white text-xs font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {showAddForm && (
        <div className="mb-12 bg-space-900/50 border border-space-800 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Plus className="text-accent-500" size={16} />
            New Project Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="input-field rounded-lg px-4 py-2 text-sm text-white w-full"
            />
            <input
              type="text"
              placeholder="Category"
              value={newProject.category}
              onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
              className="input-field rounded-lg px-4 py-2 text-sm text-white w-full"
            />
            <input
              type="text"
              placeholder="Tech Tag 1"
              value={newProject.tag1}
              onChange={(e) => setNewProject({ ...newProject, tag1: e.target.value })}
              className="input-field rounded-lg px-4 py-2 text-sm text-white w-full"
            />
            <input
              type="text"
              placeholder="Tech Tag 2"
              value={newProject.tag2}
              onChange={(e) => setNewProject({ ...newProject, tag2: e.target.value })}
              className="input-field rounded-lg px-4 py-2 text-sm text-white w-full"
            />
          </div>
          <textarea
            rows={3}
            placeholder="Brief description of the project..."
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="input-field rounded-lg px-4 py-2 text-sm text-white w-full mb-4 resize-none"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-medium text-space-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={addNewProject}
              className="px-4 py-2 bg-white text-black text-xs font-medium rounded-lg hover:bg-space-200"
            >
              Save Project
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`group project-card relative bg-space-900/40 border border-space-800 rounded-xl overflow-hidden hover:border-space-600 ${
              project.hidden ? 'hidden-card' : ''
            }`}
          >
            <div className="h-64 overflow-hidden relative">
              <div
                className="absolute inset-0 bg-space-900 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url('${project.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-900/90 to-transparent" />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-xs font-medium text-white">
                {project.category}
              </div>

              <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => toggleVisibility(project.id)}
                  className="p-1.5 rounded bg-space-900/80 border border-space-700 text-space-300 hover:text-white hover:border-white/50"
                  title="Hide/Show"
                >
                  {project.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-1.5 rounded bg-red-900/80 border border-red-900 text-red-200 hover:bg-red-800 hover:text-white hover:border-red-500"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium tracking-tight text-white mb-1 group-hover:text-accent-500 transition-colors">
                    {project.title}
                  </h3>
                </div>
                <ArrowUpRight
                  className="text-space-500 group-hover:text-white transition-colors"
                  size={20}
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-sm text-space-400 font-light leading-relaxed mb-6">
                {project.description}
              </p>
              <div className="flex gap-2">
                {project.technologies.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded bg-space-800/50 border border-space-700/50 text-xs text-space-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
