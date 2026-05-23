// ui.jsx — shared visual atoms: icons, header, footer, tech strip, markdown render

const { useState, useEffect, useRef, useCallback } = React;

// --- Tiny inline SVG icons (so we don't pull a heavy lib) ----------------
const Icon = {
  ArrowRight: (p) => <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  ArrowUpRight: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M7 17L17 7M7 7h10v10" /></svg>,
  ArrowLeft: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>,
  Plus: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M12 5v14M5 12h14" /></svg>,
  Trash: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>,
  Archive: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4" /></svg>,
  Eye: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  EyeOff: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" /></svg>,
  Lock: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>,
  Unlock: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 019.9-1" /></svg>,
  Edit: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Check: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><polyline points="20 6 9 17 4 12" /></svg>,
  X: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M18 6L6 18M6 6l12 12" /></svg>,
  Upload: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>,
  Download: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>,
  Github: (p) => <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg>,
  LinkedIn: (p) => <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>,
  Mail: (p) => <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  Send: (p) => <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  Image: (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>,
  Star: (p) => <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 24 24" fill="currentColor" {...p}><polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5" /></svg>,
  // Pin icons — filled = pinned, outline = unpinned. Pure SVG so they inherit currentColor.
  Pin: (p) => <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M14 3l7 7-3 1-1 5-4-4-5 7-1-1 7-5-4-4 5-1 1-3z" /></svg>,
  PinOff: (p) => <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M14 3l7 7-3 1-1 5-4-4-5 7-1-1 7-5-4-4 5-1 1-3z" /></svg>,
  ArrowUturnLeft: (p) => <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}><path d="M9 14l-4-4 4-4" /><path d="M5 10h9a5 5 0 010 10h-3" /></svg>
};
window.Icon = Icon;

// --- Page header (fixed nav) --------------------------------------------
function Header({ profile, isAdmin, onAdminClick, onNavHome }) {
  return (
    <header className="fixed top-0 w-full z-40 glass border-b border-space-800/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* FH badge = open CV in new tab */}
          <a
            href={profile.cv || 'assets/cv.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            title="View CV (PDF)"
            className="group relative w-8 h-8 rounded bg-space-100 text-space-950 flex items-center justify-center font-bold text-xs tracking-tighter hover:bg-accent-500 hover:text-white transition-colors">
            
            {profile.initials}
            <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-space-900 border border-space-800 text-[9px] font-mono uppercase tracking-widest text-space-400 opacity-0 group-hover:opacity-100 transition-opacity">
              View CV
            </span>
          </a>
          {/* Name = back to home */}
          <button onClick={onNavHome} className="text-sm font-medium text-space-400 hover:text-space-100 transition-colors tracking-tight">
            {profile.name.toUpperCase()}
          </button>
        </div>
        <nav className="flex items-center gap-2 md:gap-6">
          <a href="#/" onClick={onNavHome} className="hidden md:inline text-sm font-medium text-space-400 hover:text-space-100 transition-colors">Work</a>
          <a href={profile.cv || 'assets/cv.pdf'} target="_blank" rel="noopener noreferrer" className="hidden md:inline text-sm font-medium text-space-400 hover:text-space-100 transition-colors">CV</a>
          <a href="#contact" className="hidden md:inline text-sm font-medium text-space-400 hover:text-space-100 transition-colors">Contact</a>
          <button
            onClick={onAdminClick}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
            isAdmin ?
            'border-accent-500/40 bg-accent-500/10 text-accent-400' :
            'border-space-800 bg-space-900/60 text-space-400 hover:text-space-100 hover:border-space-700'}`
            }
            title={isAdmin ? 'Admin mode on' : 'Admin login'}>
            
            {isAdmin ? <Icon.Unlock size={12} /> : <Icon.Lock size={12} />}
            {isAdmin ? 'Admin' : 'Login'}
          </button>
        </nav>
      </div>
    </header>);

}
window.Header = Header;

// --- Footer --------------------------------------------------------------
function Footer({ profile }) {
  return (
    <footer className="border-t border-space-800/60 bg-space-950 text-space-500 py-12 relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xs font-medium tracking-tight">© {new Date().getFullYear()} {profile.name}. {profile.location}.</div>
        <div className="flex items-center gap-6">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-space-500 hover:text-white transition-colors"><Icon.Github /></a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-space-500 hover:text-white transition-colors"><Icon.LinkedIn /></a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className="text-space-500 hover:text-white transition-colors"><Icon.Mail /></a>
        </div>
      </div>
    </footer>);

}
window.Footer = Footer;

// --- Tech strip ---------------------------------------------------------
// Public: small centered logos (object-contain so whole pic shows) + label,
// ordered by `priority`. Admin: inline editor (add / edit label / upload
// photo / set priority / featured / remove).
function TechStrip({ profile, isAdmin, onUpdateProfile }) {
  const [editing, setEditing] = useState(false);

  const items = (profile && profile.techCompetencies || []).
  slice().
  sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

  const writeItems = (next) => {
    onUpdateProfile && onUpdateProfile({ ...profile, techCompetencies: next });
  };

  const addItem = () => {
    const id = 't' + Date.now();
    const maxP = items.reduce((m, it) => Math.max(m, Number(it.priority) || 0), 0);
    writeItems([...items, { id, label: 'New skill', image: '', priority: maxP + 1, featured: false }]);
  };
  const updateItem = (id, patch) =>
  writeItems(items.map((it) => it.id === id ? { ...it, ...patch } : it));
  const removeItem = (id) => writeItems(items.filter((it) => it.id !== id));

  return (
    <section className="border-y border-space-800/60 bg-space-900/30 backdrop-blur-sm mb-24">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <p className="text-[11px] font-medium text-space-500 uppercase tracking-[0.2em]">
            Technical Competencies
          </p>
          {isAdmin &&
          <div className="flex items-center gap-2">
              {editing &&
            <button
              onClick={addItem}
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-accent-600 hover:bg-accent-500 text-white">
              
                  <Icon.Plus size={11} /> Add skill
                </button>
            }
              <button
              onClick={() => setEditing((e) => !e)}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border ${
              editing ?
              'border-accent-500/40 bg-accent-500/10 text-accent-400' :
              'border-space-800 bg-space-900/60 text-space-400 hover:text-white hover:border-space-700'}`
              }>
              
                {editing ? <><Icon.Check size={11} /> Done</> : <><Icon.Edit size={11} /> Edit</>}
              </button>
            </div>
          }
        </div>

        {items.length === 0 ?
        <div className="text-xs text-space-500 italic">
            No technical competencies yet.{isAdmin && ' Click "Edit" then "Add skill" to add some.'}
          </div> :
        editing ?
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {items.map((item) =>
          <TechEditCard
            key={item.id}
            item={item}
            onChange={(patch) => updateItem(item.id, patch)}
            onRemove={() => removeItem(item.id)} />

          )}
          </div> :

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-8 gap-y-5">
            {items.map((item) =>
          <div key={item.id} className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full ${item.featured ? 'bg-accent-500' : 'bg-space-600'}`}></span>
                <span className="text-sm text-space-300">{item.label}</span>
              </div>
          )}
          </div>
        }
      </div>
    </section>);

}
window.TechStrip = TechStrip;

// Admin inline editor: label, priority, featured, remove.
function TechEditCard({ item, onChange, onRemove }) {
  return (
    <div className="relative flex flex-col gap-2 p-2.5 rounded-lg bg-space-950/60 border border-dashed border-space-700">
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-900/90 border border-red-700/60 text-red-200 hover:bg-red-800 hover:text-white"
        title="Remove">
        
        <Icon.X size={10} />
      </button>

      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.featured ? 'bg-accent-500' : 'bg-space-600'}`}></span>
        <input
          value={item.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Label"
          className="flex-1 min-w-0 bg-transparent border-b border-dashed border-space-700 focus:border-accent-500 outline-none text-sm text-space-200 px-1 py-0.5" />
        
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-wider text-space-500">Pri</span>
        <input
          type="number"
          value={item.priority ?? ''}
          onChange={(e) => onChange({ priority: e.target.value === '' ? null : parseInt(e.target.value, 10) })}
          className="w-12 bg-space-900/60 border border-space-800 rounded text-[11px] text-space-200 px-1 py-0.5 outline-none focus:border-accent-500"
          title="Lower number = shows first" />
        
        <label className="ml-auto flex items-center gap-1 text-[10px] text-space-400 cursor-pointer select-none" title="Highlight with accent dot">
          <input
            type="checkbox"
            checked={!!item.featured}
            onChange={(e) => onChange({ featured: e.target.checked })}
            className="accent-blue-500" />
          
          Featured
        </label>
      </div>
    </div>);

}

// --- Background layers ---------------------------------------------------
function Backdrop() {
  return (
    <>
      <div className="fixed inset-0 grid-bg pointer-events-none z-0"></div>
      <div className="fixed inset-0 radial-fade pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-space-950/0 via-transparent to-space-950 pointer-events-none z-0"></div>
    </>);

}
window.Backdrop = Backdrop;

// --- Markdown renderer (line-by-line, handles lists properly) ----------
// Supports: # h1, ## h2, ### h3, **bold**, *italic*, `code`, [text](url),
// - or * bullet lists, 1. numbered lists, --- hr.
function mdInline(s) {
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return s;
}

function renderMarkdown(src) {
  if (!src) return '';
  const escaped = src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = escaped.split('\n');
  const out = [];
  let para = [];
  const flushPara = () => {
    if (para.length) {out.push('<p>' + mdInline(para.join('<br/>')) + '</p>');para = [];}
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {flushPara();i++;continue;}
    if (trimmed === '---') {flushPara();out.push('<hr/>');i++;continue;}

    const hMatch = trimmed.match(/^(#{1,3}) (.+)$/);
    if (hMatch) {
      flushPara();
      const lv = hMatch[1].length;
      out.push(`<h${lv}>${mdInline(hMatch[2])}</h${lv}>`);
      i++;continue;
    }

    // Bullet list: gobble consecutive `- ` or `* ` lines
    if (/^[-*] /.test(trimmed)) {
      flushPara();
      const items = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        items.push(mdInline(lines[i].trim().replace(/^[-*] /, '')));
        i++;
      }
      out.push('<ul>' + items.map((t) => '<li>' + t + '</li>').join('') + '</ul>');
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(trimmed)) {
      flushPara();
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) {
        items.push(mdInline(lines[i].trim().replace(/^\d+\. /, '')));
        i++;
      }
      out.push('<ol>' + items.map((t) => '<li>' + t + '</li>').join('') + '</ol>');
      continue;
    }

    para.push(trimmed);
    i++;
  }
  flushPara();
  return out.join('\n');
}
window.renderMarkdown = renderMarkdown;