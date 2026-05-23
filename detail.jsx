// detail.jsx — project detail page (image gallery + markdown notes)
// Public view: read-only. Admin: edit everything inline.

const { useState: useStateD, useRef: useRefD, useEffect: useEffectD, useMemo: useMemoD } = React;

function Detail({ project, allProjects, isAdmin, onUpdate, onBack,
                  onSetStatus, onDelete }) {
  const [editing, setEditing] = useStateD(false);
  // Draft = working copy used only while editing text fields
  const [draft, setDraft] = useStateD(project);
  const [tab, setTab] = useStateD('preview'); // notes editor: 'edit' | 'preview'

  useEffectD(() => { setDraft(project); }, [project && project.id]);

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <p className="text-space-400 mb-4">Project not found.</p>
        <button onClick={onBack} className="text-accent-400 hover:underline text-sm">← Back to home</button>
      </div>
    );
  }

  // Public visitors cannot open hidden (in-progress) or archived projects,
  // even via a direct URL. Show a locked screen instead.
  if (!isAdmin && project.status !== 'published') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-space-900 border border-space-800 mb-6">
          <window.Icon.EyeOff size={22} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mb-3 text-white">This project isn't public yet</h1>
        <p className="text-space-400 mb-8 max-w-md mx-auto">
          It's still in progress (or archived) and hidden from visitors. Please check back later.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-space-950 text-sm font-medium hover:bg-space-200">
          <window.Icon.ArrowLeft size={14}/> Back to portfolio
        </button>
      </div>
    );
  }

  const save = () => {
    onUpdate(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(project);
    setEditing(false);
  };

  // Images auto-save (no need to hit "Save changes" for image uploads)
  const updateImagesNow = (imgs) => {
    const updated = { ...project, images: imgs };
    onUpdate(updated);
    setDraft(d => ({ ...d, images: imgs }));
  };

  // Suggest existing categories for the dropdown
  const existingCategories = useMemoD(() => {
    const set = new Set();
    (allProjects || []).forEach(p => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return Array.from(set);
  }, [allProjects]);

  const statusInfo = {
    'published':   { label: 'Live',         color: 'text-green-400',  bg: 'bg-green-500/10  border-green-500/20' },
    'in-progress': { label: 'In Progress',  color: 'text-amber-300',  bg: 'bg-amber-500/10  border-amber-500/30' },
    'archived':    { label: 'Archived',     color: 'text-space-300',  bg: 'bg-space-800/80  border-space-700' },
  }[project.status] || { label: project.status, color: 'text-space-300', bg: 'bg-space-800/80 border-space-700' };

  return (
    <article className="max-w-5xl mx-auto px-6 pt-8 pb-20">
      {/* Top bar: back + admin actions */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-space-400 hover:text-white transition-colors">
          <window.Icon.ArrowLeft size={14}/> Back to portfolio
        </button>

        {isAdmin && !editing && (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium border ${statusInfo.bg} ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-space-800 bg-space-900/60 text-xs font-medium text-space-300 hover:text-white hover:border-space-700">
              <window.Icon.Edit size={12}/> Edit
            </button>
            <button onClick={onDelete} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs font-medium text-red-400 hover:bg-red-500/20">
              <window.Icon.Trash size={12}/> Delete
            </button>
          </div>
        )}
        {isAdmin && editing && (
          <div className="flex items-center gap-2">
            <button onClick={cancel} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-space-800 bg-space-900/60 text-xs font-medium text-space-300 hover:text-white">
              Cancel
            </button>
            <button onClick={save} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-space-950 text-xs font-medium hover:bg-space-200">
              <window.Icon.Check size={12}/> Save changes
            </button>
          </div>
        )}
      </div>

      {/* Status selector (admin only, when editing) */}
      {isAdmin && editing && (
        <div className="mb-8 bg-space-900/40 border border-space-800 rounded-xl p-4">
          <p className="text-[11px] font-medium text-space-500 uppercase tracking-[0.2em] mb-3">Visibility</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <StatusOption
              active={draft.status === 'published'}
              onClick={() => { setDraft({ ...draft, status: 'published' }); onSetStatus('published'); }}
              icon={<window.Icon.Eye size={14}/>}
              title="Live"
              desc="Visible to everyone, normal display"
              activeColor="border-green-500/40 bg-green-500/10 text-green-400"
            />
            <StatusOption
              active={draft.status === 'in-progress'}
              onClick={() => { setDraft({ ...draft, status: 'in-progress' }); onSetStatus('in-progress'); }}
              icon={<window.Icon.EyeOff size={14}/>}
              title="In Progress"
              desc="Shown publicly but blurred"
              activeColor="border-amber-500/40 bg-amber-500/10 text-amber-300"
            />
            <StatusOption
              active={draft.status === 'archived'}
              onClick={() => { setDraft({ ...draft, status: 'archived' }); onSetStatus('archived'); }}
              icon={<window.Icon.Archive size={14}/>}
              title="Archived"
              desc="Hidden from public, kept for you"
              activeColor="border-space-600 bg-space-800 text-white"
            />
          </div>
        </div>
      )}

      {editing ? (
        /* === EDIT MODE: existing form-based layout ============================= */
        <>
          <header className="mb-10">
            <CategoryEditor
              value={draft.category || ''}
              onChange={v => setDraft({ ...draft, category: v })}
              suggestions={existingCategories}
            />
            <textarea
              value={draft.title}
              onChange={e => setDraft({ ...draft, title: e.target.value })}
              rows={2}
              placeholder="Project title"
              className="text-4xl md:text-5xl font-semibold tracking-tighter leading-tight bg-transparent border-b border-dashed border-space-700 focus:border-accent-500 outline-none w-full mb-5 resize-none text-white"
            />
            <textarea
              value={draft.description}
              onChange={e => setDraft({ ...draft, description: e.target.value })}
              rows={3}
              placeholder="Short summary shown on the home page card"
              className="w-full input-field rounded-lg px-4 py-3 text-base resize-none text-space-300"
            />
            <div className="mt-6">
              <TagEditor tags={draft.tags || []} onChange={tags => setDraft({ ...draft, tags })}/>
            </div>
          </header>

          <ImageGallery
            canEdit={isAdmin}
            images={project.images || []}
            onChange={updateImagesNow}
          />

          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-medium text-space-500 uppercase tracking-[0.2em]">Documentation</h2>
              <div className="flex bg-space-900 border border-space-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setTab('edit')}
                  className={`px-3 py-1 rounded ${tab === 'edit' ? 'bg-space-800 text-white' : 'text-space-400'}`}
                >Write</button>
                <button
                  onClick={() => setTab('preview')}
                  className={`px-3 py-1 rounded ${tab === 'preview' ? 'bg-space-800 text-white' : 'text-space-400'}`}
                >Preview</button>
              </div>
            </div>

            {tab === 'edit' ? (
              <div>
                <textarea
                  value={draft.notes || ''}
                  onChange={e => setDraft({ ...draft, notes: e.target.value })}
                  placeholder={`Document your work here.\n\nMarkdown supported:\n# Heading\n## Subheading\n**bold**  *italic*  \`code\`\n- bullet item\n- another item\n1. numbered item\n[link text](https://...)\n\n---  for a divider`}
                  className="w-full input-field rounded-lg px-4 py-3 text-sm font-mono leading-relaxed resize-y"
                  style={{ minHeight: '60vh', maxHeight: '80vh', overflowY: 'auto' }}
                />
                <p className="text-xs text-space-500 mt-2">Markdown: # heading · **bold** · *italic* · `code` · - bullet · 1. numbered · [link](url) · ---</p>
              </div>
            ) : (
              <div
                className="md"
                dangerouslySetInnerHTML={{
                  __html: window.renderMarkdown(draft.notes) ||
                    '<p style="color:#52525a;font-style:italic">No documentation yet.</p>'
                }}
              />
            )}
          </div>
        </>
      ) : (
        /* === READ MODE: magazine layout ========================================= */
        <MagazineArticle
          project={project}
          allProjects={allProjects}
          isAdmin={isAdmin}
          updateImagesNow={updateImagesNow}
        />
      )}
    </article>
  );
}
window.Detail = Detail;

// --- Magazine-style read view ---------------------------------------------
function MagazineArticle({ project, allProjects, isAdmin, updateImagesNow }) {
  // "Pág. N" index: position of this project in the live list (1-based).
  const issueNumber = useMemoD(() => {
    const visible = (allProjects || []).filter(p => p.status !== 'archived');
    const idx = visible.findIndex(p => p.id === project.id);
    return (idx >= 0 ? idx + 1 : 1).toString().padStart(2, '0');
  }, [allProjects, project.id]);

  const issueDate = useMemoD(() => {
    const d = new Date(project.createdAt || Date.now());
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  }, [project.createdAt]);

  const cover = project.images && project.images[0];
  const restImages = (project.images || []).slice(1);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Masthead: three columns — section / issue / date */}
      <div className="mag-rule-double mb-3"></div>
      <div className="grid grid-cols-3 items-center mb-2 gap-4">
        <div className="mag-label">
          {project.category || 'Project'}
        </div>
        <div className="text-center mag-label">
          Notebook · Edition {issueNumber}
        </div>
        <div className="text-right mag-label">
          {issueDate}
        </div>
      </div>
      <div className="mag-rule mb-12"></div>

      {/* Title block */}
      <header className="mb-10">
        <p className="mag-label mb-6 text-accent-400">
          — {project.category || 'Project'} —
        </p>
        <h1 className="mag-headline text-5xl sm:text-6xl md:text-7xl mb-8">
          {project.title}
        </h1>
        {project.description && (
          <p className="mag-lede text-xl md:text-2xl mb-8 max-w-2xl">
            {project.description}
          </p>
        )}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-space-800">
          <p className="mag-byline">
            By <span className="text-space-300">F. Hasan</span>
          </p>
          {project.tags && project.tags.length > 0 && (
            <p className="mag-label text-space-500">
              {project.tags.join(' · ')}
            </p>
          )}
        </div>
      </header>

      {/* Hero gallery: featured image w/ thumbnail strip + arrows */}
      {(project.images && project.images.length > 0) && (
        <MagazineGallery images={project.images} title={project.title}/>
      )}

      {/* Body — multi-column flowing prose with drop cap */}
      {project.notes ? (
        <div
          className="mag-body mb-12"
          dangerouslySetInnerHTML={{ __html: window.renderMarkdown(project.notes) }}
        />
      ) : (
        <p className="mag-lede text-center text-space-600 mb-12">
          No documentation written yet.
        </p>
      )}

      {/* End mark */}
      {project.notes && (
        <div className="flex items-center justify-center gap-3 mb-16">
          <span className="block w-16 h-px bg-space-700"></span>
          <span className="mag-end"></span>
          <span className="block w-16 h-px bg-space-700"></span>
        </div>
      )}

      {/* Remaining images section removed — all images now live in the
          MagazineGallery slideshow above the body. */}
    </div>
  );
}

// --- Magazine-style slideshow with thumbnail strip ----------------------
function MagazineGallery({ images, title }) {
  const [idx, setIdx] = useStateD(0);
  const [lightbox, setLightbox] = useStateD(false);
  const n = images.length;

  // Keep idx in range if images shrinks
  useEffectD(() => {
    if (idx >= n) setIdx(0);
  }, [n]);

  // Keyboard nav (← / →) when not in lightbox — lightbox handles its own.
  useEffectD(() => {
    if (lightbox) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % n);
      if (e.key === 'ArrowLeft')  setIdx((i) => (i - 1 + n) % n);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [n, lightbox]);

  const go = (dir) => setIdx((i) => (i + dir + n) % n);

  return (
    <section className="mb-14">
      {/* Featured image */}
      <figure className="relative group">
        <div
          className="relative w-full aspect-[16/10] rounded-sm overflow-hidden border border-space-800 bg-space-950 cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${title} — Fig. ${(i + 1).toString().padStart(2, '0')}`}
              className={`absolute inset-0 w-full h-full object-contain object-center transition-opacity duration-500 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
              draggable={false}
            />
          ))}

          {/* Top-left counter chip */}
          <div className="absolute top-3 left-3 mag-caption px-2 py-0.5 rounded bg-black/55 backdrop-blur border border-white/10 text-space-200">
            {(idx + 1).toString().padStart(2, '0')} <span className="text-space-500">/ {n.toString().padStart(2, '0')}</span>
          </div>

          {/* Top-right expand cue */}
          <div className="absolute top-3 right-3 mag-caption px-2 py-0.5 rounded bg-black/55 backdrop-blur border border-white/10 text-space-300 opacity-0 group-hover:opacity-100 transition-opacity">
            View full
          </div>

          {/* Prev / Next arrows */}
          {n > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 backdrop-blur border border-white/15 text-white hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <window.Icon.ArrowLeft size={16}/>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); go(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 backdrop-blur border border-white/15 text-white hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <window.Icon.ArrowRight size={16}/>
              </button>
            </>
          )}
        </div>

        <figcaption className="mag-caption mt-3 flex items-center gap-3">
          <span className="inline-block w-6 h-px bg-space-600"></span>
          Fig. {(idx + 1).toString().padStart(2, '0')} — {title}
        </figcaption>
      </figure>

      {/* Thumbnail strip */}
      {n > 1 && (
        <div className="mt-5">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === idx}
                className={`relative flex-shrink-0 snap-start w-20 h-14 sm:w-24 sm:h-16 rounded-sm overflow-hidden border transition-all duration-300 ${
                  i === idx
                    ? 'border-accent-400 ring-1 ring-accent-400/40'
                    : 'border-space-800 opacity-60 hover:opacity-100 hover:border-space-600'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover object-center"/>
                {i === idx && (
                  <span className="absolute inset-x-0 bottom-0 h-px bg-accent-400"></span>
                )}
              </button>
            ))}
          </div>
          <p className="mag-caption mt-1 text-space-600">
            {n} {n === 1 ? 'plate' : 'plates'} · click thumbnails or use ← / →
          </p>
        </div>
      )}

      {/* Fullscreen lightbox */}
      {lightbox && (
        <Lightbox
          images={images}
          index={idx}
          onClose={() => setLightbox(false)}
        />
      )}
    </section>
  );
}

// --- Status option card ------------------------------------------------
function StatusOption({ active, onClick, icon, title, desc, activeColor }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-3 rounded-lg border transition-all ${
        active ? activeColor : 'border-space-800 bg-space-950 text-space-400 hover:border-space-700 hover:text-space-200'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="text-[11px] opacity-80 font-light leading-snug">{desc}</p>
    </button>
  );
}

// --- Category editor: free-text input + suggestion chips ---------------
function CategoryEditor({ value, onChange, suggestions }) {
  return (
    <div className="mb-3">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Category (e.g. Propulsion)"
        className="text-xs font-medium text-accent-400 uppercase tracking-[0.2em] bg-transparent border-b border-dashed border-space-700 focus:border-accent-500 outline-none px-1 py-1 w-64"
      />
      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="text-[10px] text-space-600 uppercase tracking-wider mr-1 self-center">Use existing:</span>
          {suggestions.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border transition-colors ${
                value === s ? 'bg-accent-500/20 border-accent-500/40 text-accent-400' : 'bg-space-900/60 border-space-800 text-space-500 hover:text-space-300 hover:border-space-700'
              }`}
            >{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Tag editor --------------------------------------------------------
function TagEditor({ tags, onChange }) {
  const [input, setInput] = useStateD('');
  const add = (val) => {
    const t = val.trim();
    if (!t) return;
    if (tags.includes(t)) return;
    onChange([...tags, t]);
    setInput('');
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map(tag => (
        <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-space-800/60 border border-space-700/60 text-xs text-space-300">
          {tag}
          <button onClick={() => onChange(tags.filter(t => t !== tag))} className="text-space-500 hover:text-white">
            <window.Icon.X size={10}/>
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input); }
          if (e.key === 'Backspace' && !input && tags.length) onChange(tags.slice(0, -1));
        }}
        onBlur={() => add(input)}
        placeholder="Add tag…"
        className="bg-transparent border-b border-dashed border-space-700 focus:border-accent-500 outline-none text-xs text-space-300 px-1 py-0.5 w-28"
      />
    </div>
  );
}

// --- Image gallery -----------------------------------------------------
// Cover (first image) shown large + centered; other images as thumbs.
// Admin sees upload/reorder/delete controls overlaid.
function ImageGallery({ canEdit, images, onChange }) {
  const fileInput = useRefD(null);
  const [busy, setBusy] = useStateD(false);
  const [lightbox, setLightbox] = useStateD(null);

  const handleFiles = async (files) => {
    setBusy(true);
    try {
      const newImages = [];
      for (const f of files) {
        if (!f.type.startsWith('image/')) continue;
        const url = await window.uploadProjectImage(f, 1600);
        newImages.push(url);
      }
      // Auto-save: write the new array back immediately
      onChange([...(images || []), ...newImages]);
    } catch (e) {
      console.error(e);
      alert('Failed to upload image: ' + (e.message || e));
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (!canEdit) return;
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const remove = (i) => onChange(images.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const makeCover = (i) => {
    if (i === 0) return;
    const next = [...images];
    const [item] = next.splice(i, 1);
    next.unshift(item);
    onChange(next);
  };

  // PUBLIC VIEW (read-only)
  if (!canEdit) {
    if (!images || images.length === 0) return null;
    return (
      <>
        <div className="space-y-4">
          <button
            onClick={() => setLightbox(0)}
            className="block w-full aspect-[16/9] rounded-xl overflow-hidden border border-space-800 bg-space-950"
          >
            <img src={images[0]} alt="" className="w-full h-full object-contain object-center"/>
          </button>
          {images.length > 1 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {images.slice(1).map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(i + 1)}
                  className="aspect-[4/3] rounded-lg overflow-hidden border border-space-800 hover:border-space-600 transition-colors bg-space-950"
                >
                  <img src={src} alt="" className="w-full h-full object-contain object-center"/>
                </button>
              ))}
            </div>
          )}
        </div>
        {lightbox !== null && (
          <Lightbox images={images} index={lightbox} onClose={() => setLightbox(null)}/>
        )}
      </>
    );
  }

  // ADMIN VIEW
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xs font-medium text-space-500 uppercase tracking-[0.2em]">
            Images <span className="text-space-600 normal-case tracking-normal">— first is the cover on home</span>
          </h2>
          <div className="flex items-center gap-2">
            {busy && <span className="text-xs text-space-500">Uploading…</span>}
            <button
              onClick={() => fileInput.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-600 hover:bg-accent-500 text-white text-xs font-medium disabled:opacity-50"
            >
              <window.Icon.Upload size={12}/> Add images
            </button>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => { handleFiles(Array.from(e.target.files)); e.target.value = ''; }}
          />
        </div>

        {(!images || images.length === 0) ? (
          <div
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInput.current?.click()}
            className="aspect-[16/9] rounded-xl border border-dashed border-space-700 hover:border-accent-500/50 hover:bg-space-900/40 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors text-space-400 hover:text-white"
          >
            <window.Icon.Upload size={24}/>
            <div className="text-sm">Drop images here, or click to upload</div>
            <div className="text-xs text-space-500">First image = cover on the home page card</div>
          </div>
        ) : (
          <>
            {/* COVER */}
            <div
              className="relative aspect-[16/9] rounded-xl overflow-hidden border border-accent-500/40 bg-space-950 group"
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
            >
              <img src={images[0]} alt="" className="absolute inset-0 w-full h-full object-contain object-center cursor-zoom-in" onClick={() => setLightbox(0)}/>
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-[10px] font-medium text-accent-400 uppercase tracking-widest pointer-events-none">
                <window.Icon.Star size={10}/> Cover
              </div>
              <button
                onClick={() => remove(0)}
                className="absolute top-3 right-3 p-1.5 rounded bg-red-900/80 border border-red-700/60 text-red-200 hover:bg-red-800 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                <window.Icon.Trash size={12}/>
              </button>
            </div>
            {/* THUMBNAILS */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {images.slice(1).map((src, idx) => {
                const i = idx + 1;
                return (
                  <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-space-800 bg-space-950 group">
                    <img src={src} alt="" className="absolute inset-0 w-full h-full object-contain object-center cursor-zoom-in" onClick={() => setLightbox(i)}/>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors pointer-events-none"></div>
                    <div className="absolute inset-x-0 bottom-0 p-1.5 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => makeCover(i)} title="Make cover" className="p-1.5 rounded bg-space-900/95 border border-space-700 text-space-200 hover:text-white"><window.Icon.Star size={11}/></button>
                      <button onClick={() => move(i, -1)} title="Move left" className="p-1.5 rounded bg-space-900/95 border border-space-700 text-space-200 hover:text-white">←</button>
                      <button onClick={() => move(i, 1)} title="Move right" className="p-1.5 rounded bg-space-900/95 border border-space-700 text-space-200 hover:text-white">→</button>
                      <button onClick={() => remove(i)} title="Remove" className="p-1.5 rounded bg-red-900/90 border border-red-700/60 text-red-200 hover:bg-red-800 hover:text-white"><window.Icon.Trash size={11}/></button>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => fileInput.current?.click()}
                className="aspect-[4/3] rounded-lg border border-dashed border-space-700 hover:border-accent-500/50 hover:bg-space-900/40 flex flex-col items-center justify-center gap-2 text-space-500 hover:text-space-300 transition-colors"
              >
                <window.Icon.Plus/>
                <span className="text-xs">Add more</span>
              </button>
            </div>
          </>
        )}
      </div>
      {lightbox !== null && (
        <Lightbox images={images} index={lightbox} onClose={() => setLightbox(null)}/>
      )}
    </>
  );
}

// --- Lightbox: click any image to view it big ---------------------------
function Lightbox({ images, index, onClose }) {
  const [i, setI] = useStateD(index);
  useEffectD(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setI(prev => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft')  setI(prev => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white p-2" aria-label="Close">
        <window.Icon.X size={20}/>
      </button>
      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setI((i - 1 + images.length) % images.length); }} className="absolute left-4 text-white/80 hover:text-white p-2 text-2xl">‹</button>
          <button onClick={(e) => { e.stopPropagation(); setI((i + 1) % images.length); }} className="absolute right-4 text-white/80 hover:text-white p-2 text-2xl">›</button>
        </>
      )}
      <img src={images[i]} alt="" className="max-w-[92vw] max-h-[88vh] object-contain rounded" onClick={e => e.stopPropagation()}/>
    </div>
  );
}
