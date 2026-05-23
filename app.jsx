// app.jsx — root component: routes, async data layer (Supabase), auth.

const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  const [route, setRoute] = useStateApp(parseHash(window.location.hash));
  const [profile, setProfile] = useStateApp(() => ({ ...window.Store.DEFAULT_PROFILE }));
  const [projects, setProjects] = useStateApp([]);
  const [isAdmin, setIsAdmin] = useStateApp(false);
  const [showLogin, setShowLogin] = useStateApp(false);
  const [loading, setLoading] = useStateApp(true);
  const [loadError, setLoadError] = useStateApp(null);

  // --- Initial load: pull projects + profile + session in parallel ----------
  useEffectApp(() => {
    let cancelled = false;
    (async () => {
      try {
        const [projects, profile, isAdmin] = await Promise.all([
          window.Store.getProjects(),
          window.Store.getProfile(),
          window.Store.currentIsAdmin(),
        ]);
        if (cancelled) return;
        setProjects(projects);
        setProfile(profile);
        setIsAdmin(isAdmin);
      } catch (e) {
        console.error(e);
        if (!cancelled) setLoadError(e.message || 'Failed to load.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // --- Subscribe to auth changes (login/logout from another tab too) --------
  useEffectApp(() => {
    const { data: sub } = window.Store.onAuthChange((flag) => setIsAdmin(flag));
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  // --- Routing (hash-based) -------------------------------------------------
  useEffectApp(() => {
    const onHash = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (hash) => {
    if (window.location.hash === hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = hash;
    }
  };

  // --- Admin handlers -------------------------------------------------------
  const handleAdminClick = async () => {
    if (isAdmin) {
      if (confirm('Log out of admin mode?')) {
        await window.Store.signOut();
        setIsAdmin(false);
      }
    } else {
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setShowLogin(false);
  };

  const handleLogout = async () => {
    await window.Store.signOut();
    setIsAdmin(false);
  };

  // --- Project CRUD (async, persisted to Supabase) --------------------------
  const addProject = async () => {
    const id = 'p' + Date.now();
    const newProject = {
      id,
      title: 'Untitled Project',
      category: '',
      description: '',
      tags: [],
      images: [],
      notes: '',
      status: 'in-progress',
      priority: 0,
      createdAt: Date.now(),
    };
    try {
      await window.Store.upsertProject(newProject);
      setProjects([newProject, ...projects]);
      navigate('#/project/' + id);
    } catch (e) {
      alert('Failed to add project: ' + e.message);
    }
  };

  const updateProject = async (updated) => {
    const next = projects.map((p) => (p.id === updated.id ? { ...p, ...updated } : p));
    setProjects(next);
    try {
      const merged = next.find((p) => p.id === updated.id);
      await window.Store.upsertProject(merged);
    } catch (e) {
      alert('Failed to save: ' + e.message);
    }
  };

  const setProjectStatus = async (id, status) => {
    const next = projects.map((p) => (p.id === id ? { ...p, status } : p));
    setProjects(next);
    try {
      await window.Store.upsertProject(next.find((p) => p.id === id));
    } catch (e) {
      alert('Failed to update status: ' + e.message);
    }
  };

  // Pin / unpin. We re-use the existing `priority` int4 column so no DB
  // migration is needed: priority > 0 means pinned, larger values sort first.
  // We assign (maxCurrentPriority + 1) on pin, so newer pins always bubble
  // above older ones without overflowing a 32-bit int.
  const setProjectPinned = async (id, pinned) => {
    let priority = 0;
    if (pinned) {
      const maxPriority = projects.reduce(
        (m, p) => Math.max(m, p.priority || 0), 0,
      );
      priority = maxPriority + 1;
    }
    const next = projects.map((p) => (p.id === id ? { ...p, priority } : p));
    setProjects(next);
    try {
      await window.Store.upsertProject(next.find((p) => p.id === id));
    } catch (e) {
      alert('Failed to update pin: ' + e.message);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project forever? This cannot be undone.')) return;
    try {
      await window.Store.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      if (route.name === 'project' && route.id === id) navigate('#/');
    } catch (e) {
      alert('Failed to delete: ' + e.message);
    }
  };

  const updateProfile = async (updated) => {
    setProfile(updated);
    try {
      await window.Store.saveProfile(updated);
    } catch (e) {
      alert('Failed to save profile: ' + e.message);
    }
  };

  // --- Render ---------------------------------------------------------------
  const currentProject =
    route.name === 'project' ? projects.find((p) => p.id === route.id) : null;

  return (
    <div className="relative min-h-screen">
      <window.Backdrop />

      <window.Header
        profile={profile}
        isAdmin={isAdmin}
        onAdminClick={handleAdminClick}
        onNavHome={() => navigate('#/')}
      />

      {isAdmin && (
        <window.AdminBar
          onLogout={handleLogout}
          onUploadCV={async (file) => {
            try {
              const url = await window.uploadCV(file);
              await updateProfile({ ...profile, cv: url });
              return true;
            } catch (e) {
              alert('CV upload failed: ' + e.message);
              return false;
            }
          }}
          hasCV={!!profile.cv}
        />
      )}

      <main className={`relative z-10 ${isAdmin ? 'pt-28' : 'pt-20'} pb-10`}>
        {loading && (
          <div className="max-w-6xl mx-auto px-6 py-32 text-center text-space-500">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]">
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
              Loading…
            </div>
          </div>
        )}

        {loadError && !loading && (
          <div className="max-w-2xl mx-auto px-6 py-32 text-center">
            <p className="text-red-400 mb-2">Could not load data.</p>
            <p className="text-xs text-space-500 font-mono">{loadError}</p>
          </div>
        )}

        {!loading && !loadError && route.name === 'home' && (
          <window.Home
            profile={profile}
            projects={projects}
            isAdmin={isAdmin}
            onOpenProject={(id) => navigate('#/project/' + id)}
            onAddProject={addProject}
            onSetStatus={setProjectStatus}
            onSetPinned={setProjectPinned}
            onDelete={deleteProject}
            onUpdateProfile={updateProfile}
          />
        )}

        {!loading && !loadError && route.name === 'project' && (
          <window.Detail
            project={currentProject}
            allProjects={projects}
            isAdmin={isAdmin}
            onUpdate={updateProject}
            onBack={() => navigate('#/')}
            onSetStatus={(status) =>
              currentProject && setProjectStatus(currentProject.id, status)
            }
            onDelete={() => deleteProject(currentProject.id)}
          />
        )}
      </main>

      <window.Footer profile={profile} />

      <window.AdminLoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

// --- Hash parsing ---------------------------------------------------------
function parseHash(hash) {
  const m = hash.match(/^#\/project\/(.+)$/);
  if (m) return { name: 'project', id: m[1] };
  return { name: 'home' };
}

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
