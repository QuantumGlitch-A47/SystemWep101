import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Send, CheckCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase.from('contact_messages').insert([formData]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="max-w-xl mx-auto px-6 mb-20">
      <div className="bg-space-900/30 border border-space-800 rounded-2xl p-8 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold tracking-tight mb-2">Get in touch.</h2>
          <p className="text-sm text-space-400">
            Open to collaboration on engines, software, and aerospace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-space-500 ml-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-space-950 border border-space-800 rounded-lg px-4 py-2.5 text-sm text-white input-field"
                placeholder="Name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-space-500 ml-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-space-950 border border-space-800 rounded-lg px-4 py-2.5 text-sm text-white input-field"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-space-500 ml-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-space-950 border border-space-800 rounded-lg px-4 py-3 text-sm text-white input-field resize-none"
              placeholder="Project details..."
            />
          </div>

          {submitStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Message sent successfully!</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm">
              Failed to send. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-space-950 font-medium text-sm py-2.5 rounded-lg hover:bg-space-200 transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
            <Send size={14} strokeWidth={1.5} />
          </button>
        </form>
      </div>
    </section>
  );
};
