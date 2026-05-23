// home.jsx — public homepage: hero, projects grid (with category filter
// and 3-state status), contact form.

const { useState: useStateH, useEffect: useEffectH, useMemo: useMemoH } = React;

function Home({ profile, projects, isAdmin, onOpenProject, onAddProject,
  onSetStatus, onSetPinned, onDelete, onUpdateProfile }) {
  // Category filter (active pill). 'All' = no filter, 'Archived' = admin-only archive view.
  const [activeCategory, setActiveCategory] = useStateH('All');

  // Collect all categories that exist in projects
  const allCategories = useMemoH(() => {
    const set = new Set();
    projects.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Sort helper — used by both the public grid and the archived view.
  // Order, top → bottom:
  //   1. Pinned (priority > 0), highest priority value first
  //   2. Published (live), newest first
  //   3. In-progress (hidden), newest first
  // Archived only appears when the admin opens the Archived view, where
  // pinned-archived still bubbles to the top.
  const isPinned = (p) => (p.priority ?? 0) > 0;
  const statusRank = (p) => {
    if (p.status === 'published') return 0;
    if (p.status === 'in-progress') return 1;
    return 2; // archived
  };
  const sortProjects = (list) =>
    [...list].sort((a, b) => {
      const pa = isPinned(a) ? 1 : 0;
      const pb = isPinned(b) ? 1 : 0;
      if (pa !== pb) return pb - pa;                          // pinned first
      if (pa && pb) return (b.priority || 0) - (a.priority || 0); // newer pin on top
      const sa = statusRank(a), sb = statusRank(b);
      if (sa !== sb) return sa - sb;                          // live before hidden
      return (b.createdAt || 0) - (a.createdAt || 0);         // newest first
    });

  // What's visible in the grid:
  //   Public:  status === 'published' OR 'in-progress' (in-progress shown blurred)
  //   Admin:   non-archived by default; or only-archived when the 'Archived' pill is active.
  const archivedActive = activeCategory === 'Archived';
  const visibleProjects = sortProjects(
    projects.filter((p) => {
      if (isAdmin && archivedActive) return p.status === 'archived';
      return p.status !== 'archived';
    }).filter((p) => activeCategory === 'All' || activeCategory === 'Archived' || p.category === activeCategory)
  );

  const archivedCount = projects.filter((p) => p.status === 'archived').length;
  const liveCount = projects.filter((p) => p.status === 'published').length;
  const inProgressCount = projects.filter((p) => p.status === 'in-progress').length;
  const totalCount = liveCount + inProgressCount; // public-facing total (excludes archived)

  return (
    <>
      {/* HERO */}
      <section id="about" className="max-w-6xl mx-auto px-6 mb-28 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left column — text */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-space-900/60 border border-space-800 text-xs font-medium text-accent-400 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
              </span>
              {profile.badge}
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-semibold tracking-tighter leading-[0.95] mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-space-500">
              {profile.headline}
            </h1>

            <p className="text-lg text-space-400 font-light leading-relaxed max-w-2xl mb-10">
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="inline-flex items-center gap-2 px-5 py-3 bg-white text-space-950 rounded-md text-sm font-medium hover:bg-space-200 transition-colors">
                View Projects <window.Icon.ArrowRight />
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 px-5 py-3 bg-space-900 border border-space-800 text-space-100 rounded-md text-sm font-medium hover:bg-space-800 transition-colors">
                Get in touch <window.Icon.Send />
              </a>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-md">
              <Stat label="Cohort" value={profile.cohort} />
              <Stat
                label="Projects"
                value={totalCount.toString()}
                hint={inProgressCount > 0 ? `${inProgressCount} in progress` : null} />

              <Stat label="School" value={profile.school} />
            </div>
          </div>

          {/* Right column — two-image collage */}
          <div className="lg:col-span-5">
            <HeroCollage />
          </div>
        </div>
      </section>

      {/* TECH STRIP */}
      <window.TechStrip
        profile={profile}
        isAdmin={isAdmin}
        onUpdateProfile={onUpdateProfile} />
      

      {/* PROJECTS */}
      <section id="projects" className="max-w-6xl mx-auto px-6 mb-32">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-medium text-space-500 uppercase tracking-[0.2em] mb-3">Selected Work</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter leading-[0.95] bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-space-500">Project Portfolio</h2>
          </div>
          {isAdmin &&
          <div className="flex items-center gap-2 flex-wrap">
              <button
              onClick={onAddProject}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-500 text-white text-xs font-medium transition-colors">
              
                <window.Icon.Plus size={14} /> Add Project
              </button>
            </div>
          }
        </div>

        {/* Category filter pills (+ an 'Archived' pill for admin when any exist) */}
        {(allCategories.length > 1 || (isAdmin && archivedCount > 0)) &&
        <div className="flex flex-wrap gap-2 mb-8">
            {allCategories.map((cat) =>
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            activeCategory === cat ?
            'bg-white text-space-950 border-white' :
            'bg-space-900/40 border-space-800 text-space-400 hover:text-white hover:border-space-700'}`
            }>
            
                {cat}
                {cat !== 'All' &&
            <span className="ml-1.5 text-space-500">
                    {projects.filter((p) => p.category === cat && p.status !== 'archived').length}
                  </span>
            }
              </button>
          )}
            {isAdmin && archivedCount > 0 &&
            <button
              onClick={() => setActiveCategory('Archived')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeCategory === 'Archived' ?
              'bg-amber-400/15 border-amber-400/40 text-amber-300' :
              'bg-space-900/40 border-space-800 text-space-500 hover:text-space-200 hover:border-space-700'}`}
              title="Show archived projects (only visible to admin)">
              <window.Icon.Archive size={11}/>
              Archived
              <span className={activeCategory === 'Archived' ? 'text-amber-200/70' : 'text-space-600'}>
                {archivedCount}
              </span>
            </button>
          }
          </div>
        }

        {visibleProjects.length === 0 ?
        <EmptyState isAdmin={isAdmin} showArchived={archivedActive} onAddProject={onAddProject} /> :

        <>
            {/* Archived-view banner: clear context + a prominent way back. */}
            {archivedActive &&
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3 px-4 py-3 rounded-lg border border-amber-400/30 bg-amber-400/5">
                <div className="flex items-center gap-2 text-amber-300 text-xs">
                  <window.Icon.Archive size={13}/>
                  <span className="font-mono uppercase tracking-[0.18em]">Viewing archive</span>
                  <span className="text-space-500 hidden sm:inline">— hidden from visitors. Unarchive any project to bring it back.</span>
                </div>
                <button
                  onClick={() => setActiveCategory('All')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-space-900 border border-space-700 text-space-200 hover:text-white hover:border-space-500 text-xs font-medium transition-colors">
                  <window.Icon.ArrowLeft size={12}/> Back to projects
                </button>
              </div>
          }

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleProjects.map((project) =>
            <ProjectCard
              key={project.id}
              project={project}
              isAdmin={isAdmin}
              inArchiveView={archivedActive}
              onOpen={() => onOpenProject(project.id)}
              onSetStatus={(status) => onSetStatus(project.id, status)}
              onSetPinned={(pinned) => onSetPinned(project.id, pinned)}
              onDelete={() => onDelete(project.id)} />

            )}
            </div>
          </>
        }
      </section>

      {/* CONTACT */}
      <ContactSection email={profile.email} />
    </>);

}
window.Home = Home;

function Stat({ label, value, hint }) {
  return (
    <div>
      <div className="font-mono text-2xl font-medium text-white">{value}</div>
      <div className="text-xs text-space-500 mt-1 uppercase tracking-wider">{label}</div>
      {hint && (
        <div className="text-[10px] text-accent-400 mt-0.5 font-mono tracking-wider">
          {hint}
        </div>
      )}
    </div>);

}

// Hero right-column visual: a moody jet silhouette as the primary image,
// with a smaller offset NASA SR-71 poster overlapping the bottom-left corner.
// Pure CSS / images — keeps the existing dark theme.
function HeroCollage() {
  return (
    <div className="relative w-full aspect-[3/4] max-w-md mx-auto">
      {/* Soft accent glow behind the stack */}
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-accent-500/15 via-transparent to-transparent blur-2xl pointer-events-none"></div>

      {/* Main image — moon + jet contrails. Nudges on hover. */}
      <div className="hero-card-main absolute inset-0 rounded-2xl overflow-hidden border border-space-800 bg-space-950 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
        <img
          src="assets/moon-jet.jpg"
          alt="Jet climbing toward a crescent moon"
          className="w-full h-full object-cover object-center" />
        
        {/* Top vignette to blend into the page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-space-950/40 via-transparent to-space-950/60 pointer-events-none"></div>
        {/* Corner tag */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-space-300">
          <span className="w-1 h-1 rounded-full bg-accent-500"></span>
          Beyond the sky
        </div>
      </div>

      {/* Secondary image — jet silhouette, smaller, offset, slightly rotated.
          Nudges on hover and returns when the cursor leaves. */}
      <div className="hero-card-secondary absolute -left-3 -bottom-6 w-[44%] aspect-[3/4] rounded-xl overflow-hidden border border-space-700 bg-space-950 shadow-2xl" data-comment-anchor="hero-secondary-img">
        <img
          src="assets/jet-silhouette.jpg"
          alt="Jet in light"
          className="w-full h-full object-cover object-center grayscale contrast-110 opacity-90" />
        
        <div className="absolute inset-0 bg-gradient-to-tr from-space-950/30 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Mono caption — bottom right */}
      <div className="absolute right-2 bottom-2 text-[9px] font-mono uppercase tracking-[0.25em] text-space-500">
        Mach · Moon · Sky
      </div>
    </div>);

}

function ProjectCard({ project, isAdmin, inArchiveView, onOpen, onSetStatus, onSetPinned, onDelete }) {
  const cover = project.images && project.images[0];
  const isInProgress = project.status === 'in-progress';
  const isArchived = project.status === 'archived';
  const pinned = (project.priority ?? 0) > 0;

  // Public visitors must NOT be able to open hidden ("in-progress") or
  // archived projects — only published ones. Admin can open anything.
  const canOpen = isAdmin || project.status === 'published';

  return (
    <article
      onClick={canOpen ? onOpen : undefined}
      className={`group project-card relative bg-space-900/40 border rounded-xl overflow-hidden ${
        canOpen ? 'cursor-pointer' : 'cursor-not-allowed'
      } ${
        pinned ? 'border-accent-500/50 hover:border-accent-400' : 'border-space-800 hover:border-space-600'
      } ${isArchived ? 'opacity-70' : ''}`}>
      
      <div className="h-64 overflow-hidden relative img-stripes">
        {cover ?
        <img
          src={cover}
          alt={project.title}
          className={`absolute inset-0 w-full h-full object-contain object-center bg-space-950 group-hover:scale-105 transition-transform duration-700 ${isInProgress ? 'in-progress-cover' : ''}`} /> :


        <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-space-600">
              <window.Icon.Image size={28} />
              <span className="font-mono text-[10px] uppercase tracking-widest">no cover image</span>
            </div>
          </div>
        }

        {/* In-progress "stamp" overlay (public-visible) */}
        {isInProgress &&
        <div className="in-progress-stamp">
            <span>In Progress</span>
          </div>
        }

        <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent pointer-events-none"></div>

        {/* Top-right cluster: pinned badge (public) + category badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {pinned && !isInProgress &&
          <div className="bg-accent-500/15 backdrop-blur-md border border-accent-400/40 px-2.5 py-1 rounded text-[11px] font-medium text-accent-300 flex items-center gap-1.5" title="Pinned to top">
              <window.Icon.Pin size={10}/> Pinned
            </div>
          }
          {project.category && !isInProgress &&
          <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-[11px] font-medium text-white">
              {project.category}
            </div>
          }
        </div>

        {/* Status badge top-left */}
        {isArchived &&
        <div className="absolute top-4 left-4 bg-space-900/80 backdrop-blur-md border border-space-700 px-3 py-1 rounded text-[11px] font-medium text-space-300 flex items-center gap-1.5">
            <window.Icon.Archive size={10} /> Archived
          </div>
        }

        {/* Admin floating controls */}
        {isAdmin &&
        <div
          className="absolute bottom-4 left-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}>

            {inArchiveView ?
            // --- Archive view: prominent Unarchive + Delete ------------
            <>
                <button
                  onClick={() => onSetStatus('published')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-green-600/90 hover:bg-green-500 border border-green-500/60 text-white text-[11px] font-medium transition-colors"
                  title="Restore as a live project">
                  <window.Icon.ArrowUturnLeft size={12}/> Unarchive
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 rounded-md bg-red-900/80 border border-red-700/60 text-red-200 hover:bg-red-800 hover:text-white text-xs flex items-center justify-center"
                  title="Delete forever">
                  <window.Icon.Trash size={12} />
                </button>
              </> :

            // --- Normal admin view: pin toggle + 3-state status + delete
            <>
                <button
                  onClick={() => onSetPinned(!pinned)}
                  className={`p-2 rounded-md border text-xs flex items-center justify-center transition-colors ${
                    pinned
                      ? 'bg-accent-500/20 border-accent-400/60 text-accent-300 hover:bg-accent-500/30'
                      : 'bg-space-900/95 border-space-700 text-space-400 hover:text-white hover:border-space-500'
                  }`}
                  title={pinned ? 'Unpin from top' : 'Pin to top'}>
                  {pinned ? <window.Icon.Pin size={12}/> : <window.Icon.PinOff size={12}/>}
                </button>
                <StatusPill current={project.status} onSet={onSetStatus} />
                <button onClick={onDelete} className="p-2 rounded-md bg-red-900/80 border border-red-700/60 text-red-200 hover:bg-red-800 hover:text-white text-xs flex items-center justify-center" title="Delete forever">
                  <window.Icon.Trash size={12} />
                </button>
              </>
            }
          </div>
        }
      </div>

      <div className="p-6">
        {isInProgress ?
        // Hidden project — show only a generic placeholder, no real info.
        <div className="flex items-center gap-2 text-space-500">
            <window.Icon.EyeOff size={14} />
            <span className="font-mono text-xs uppercase tracking-[0.2em]">Hidden project</span>
          </div> :

        <>
            <div className="flex justify-between items-start mb-3 gap-3">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tighter leading-[1.0] bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-space-500 group-hover:from-accent-300 group-hover:via-white group-hover:to-accent-400 transition-all duration-500">
                {project.title}
              </h3>
              <window.Icon.ArrowUpRight className="text-space-500 group-hover:text-accent-400 transition-colors flex-shrink-0 mt-1" size={22} />
            </div>
            {project.description &&
          <p className="text-sm text-space-400 font-light leading-relaxed mb-5 line-clamp-2">
                {project.description}
              </p>
          }
            {project.tags && project.tags.length > 0 &&
          <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) =>
            <span key={tag} className="px-2 py-1 rounded bg-space-800/60 border border-space-700/60 text-xs text-space-300">{tag}</span>
            )}
              </div>
          }
          </>
        }
      </div>
    </article>);

}

// Admin status selector (3-state segmented pill on each card)
function StatusPill({ current, onSet }) {
  const options = [
  { key: 'published', label: 'Live', icon: <window.Icon.Eye size={11} />, color: 'text-green-400' },
  { key: 'in-progress', label: 'In Prog.', icon: <window.Icon.EyeOff size={11} />, color: 'text-amber-300' },
  { key: 'archived', label: 'Archive', icon: <window.Icon.Archive size={11} />, color: 'text-space-300' }];

  return (
    <div className="flex-1 flex bg-space-900/95 border border-space-700 rounded-md p-0.5 text-[10px] font-medium">
      {options.map((o) =>
      <button
        key={o.key}
        onClick={() => onSet(o.key)}
        className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-1 rounded transition-colors ${
        current === o.key ? `bg-space-800 ${o.color}` : 'text-space-500 hover:text-space-200'}`
        }>
        
          {o.icon}
          <span className="hidden sm:inline">{o.label}</span>
        </button>
      )}
    </div>);

}

function EmptyState({ isAdmin, showArchived, onAddProject }) {
  if (showArchived) {
    return (
      <div className="border border-dashed border-space-800 rounded-xl p-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-space-900 border border-space-800 text-space-500 mb-4"><window.Icon.Archive /></div>
        <p className="text-sm text-space-400">No archived projects.</p>
      </div>);

  }
  return (
    <div className="border border-dashed border-space-800 rounded-xl p-12 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-space-900 border border-space-800 text-space-500 mb-4"><window.Icon.Image /></div>
      <p className="text-sm text-space-400 mb-4">No projects in this category.</p>
      {isAdmin &&
      <button onClick={onAddProject} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-500 text-white text-xs font-medium">
          <window.Icon.Plus size={14} /> Add a project
        </button>
      }
    </div>);

}

function ContactSection({ email }) {
  const [sent, setSent] = useStateH(false);
  return (
    <section id="contact" className="max-w-xl mx-auto px-6 mb-20">
      <div className="bg-space-900/40 border border-space-800 rounded-2xl p-8 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter leading-[0.95] mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-space-500">Get in touch.</h2>
          <p className="text-sm text-space-400">Open to collaboration on engines, software, and aerospace.</p>
        </div>
        <form onSubmit={(e) => {e.preventDefault();setSent(true);}} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" type="text" placeholder="Name" />
            <Field label="Email" type="email" placeholder="email@example.com" />
          </div>
          <Field label="Message" type="textarea" placeholder="Project details..." />

          {sent &&
          <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm">
              <window.Icon.Check size={14} /> Message captured locally — email Fatima directly to follow up.
            </div>
          }

          <button type="submit" className="w-full bg-white text-space-950 font-medium text-sm py-2.5 rounded-lg hover:bg-space-200 transition-colors flex items-center justify-center gap-2">
            Send Message <window.Icon.Send />
          </button>
          <p className="text-center text-xs text-space-500">or email me directly: <a className="text-accent-400 hover:underline" href={`mailto:${email}`}>{email}</a></p>
        </form>
      </div>
    </section>);

}

function Field({ label, type, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-space-500 ml-1">{label}</label>
      {type === 'textarea' ?
      <textarea required rows={4} placeholder={placeholder} className="w-full input-field rounded-lg px-4 py-3 text-sm resize-none" /> :

      <input required type={type} placeholder={placeholder} className="w-full input-field rounded-lg px-4 py-2.5 text-sm" />
      }
    </div>);

}