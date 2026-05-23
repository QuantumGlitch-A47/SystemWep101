// storage.jsx — Supabase-backed data layer.
// Projects + profile live on the server; admin auth is via Supabase Auth.
// Images and CV files are uploaded to the `media` storage bucket and we store
// only their public URLs in the DB.

const SUPABASE_URL = 'https://pkefcypkinszastvfxjh.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWZjeXBraW5zemFzdHZmeGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NzIxMzksImV4cCI6MjA5NTA0ODEzOX0._9YxV6NdWYuhIudrbDXcTbyCoP3Cce996bzDiIGqh14';

// supabase-js UMD attaches to window.supabase
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

const DEFAULT_PROFILE = {
  name: 'E. Fatima Hasan',
  initials: 'EFH',
  headline: 'Engineering aerospace systems. Building solutions beyond the sky.',
  bio: 'Aerospace Systems Engineer building smart solutions for aviation, technology, and real-world problems.',
  badge: 'Open to Summer 2026 Internships',
  location: 'Glasgow, UK',
  email: 'fatima22hasan@gmail.com',
  github: 'https://github.com/',
  linkedin: 'https://linkedin.com/',
  cohort: '2026',
  school: 'UoG',
  cv: '', // public URL once uploaded
  techCompetencies: [
    { id: 't1', label: 'React',            image: '', priority: 1, featured: true  },
    { id: 't2', label: 'Python',           image: '', priority: 2, featured: true  },
    { id: 't3', label: 'C++',              image: '', priority: 3, featured: true  },
    { id: 't4', label: 'AI / ML',          image: '', priority: 4, featured: true  },
    { id: 't5', label: 'MATLAB',           image: '', priority: 5, featured: false },
    { id: 't6', label: 'CAD / SolidWorks', image: '', priority: 6, featured: false },
    { id: 't7', label: 'ANSYS Fluent',     image: '', priority: 7, featured: false },
  ],
};

// --- DB row <-> client object mapping -----------------------------------

function rowToProject(r) {
  return {
    id: r.id,
    title: r.title || '',
    category: r.category || '',
    description: r.description || '',
    tags: r.tags || [],
    images: r.images || [],
    notes: r.notes || '',
    status: r.status || 'in-progress',
    priority: r.priority ?? 0,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
  };
}

function projectToRow(p) {
  return {
    id: p.id,
    title: p.title || '',
    category: p.category || '',
    description: p.description || '',
    tags: p.tags || [],
    images: p.images || [],
    notes: p.notes || '',
    status: p.status || 'in-progress',
    priority: p.priority ?? 0,
    updated_at: new Date().toISOString(),
  };
}

// --- Public API ----------------------------------------------------------

window.Store = {
  sb,
  DEFAULT_PROFILE,

  // -- Projects --
  async getProjects() {
    const { data, error } = await sb
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('getProjects', error);
      return [];
    }
    return data.map(rowToProject);
  },
  async upsertProject(p) {
    const { error } = await sb.from('projects').upsert(projectToRow(p));
    if (error) throw error;
  },
  async deleteProject(id) {
    const { error } = await sb.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  // -- Profile --
  async getProfile() {
    const { data, error } = await sb
      .from('profile')
      .select('data')
      .eq('id', 1)
      .maybeSingle();
    if (error) {
      console.error('getProfile', error);
      return { ...DEFAULT_PROFILE };
    }
    return { ...DEFAULT_PROFILE, ...(data?.data || {}) };
  },
  async saveProfile(profile) {
    const { error } = await sb
      .from('profile')
      .upsert({ id: 1, data: profile });
    if (error) throw error;
  },

  // -- Storage uploads --
  // Upload any Blob/File to the `media` bucket; returns the public URL.
  async uploadFile(file, prefix = 'misc', explicitExt) {
    const ext = explicitExt || (file.name?.split('.').pop() || 'bin').toLowerCase();
    const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await sb.storage
      .from('media')
      .upload(path, file, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });
    if (error) throw error;
    const { data } = sb.storage.from('media').getPublicUrl(path);
    return data.publicUrl;
  },

  // -- Auth --
  async signIn(email, password) {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },
  async signOut() {
    await sb.auth.signOut();
  },
  async currentIsAdmin() {
    const { data } = await sb.auth.getSession();
    return !!data.session;
  },
  onAuthChange(cb) {
    return sb.auth.onAuthStateChange((_e, session) => cb(!!session));
  },
};

// --- Image helpers -------------------------------------------------------
// Resize an image File to <=maxDim on the long edge and return a Blob (JPEG).
async function resizeImage(file, maxDim = 1600) {
  if (!file.type.startsWith('image/')) throw new Error('Not an image');
  const dataUrl = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = (e) => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);
  return await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.88),
  );
}

// Used by detail.jsx — uploads a project photo, returns public URL.
window.uploadProjectImage = async function (file, maxDim = 1600) {
  const blob = await resizeImage(file, maxDim);
  return await window.Store.uploadFile(blob, 'projects', 'jpg');
};

// Used by admin.jsx — uploads CV PDF, returns public URL.
window.uploadCV = async function (file) {
  return await window.Store.uploadFile(file, 'cv', 'pdf');
};

// Back-compat for ui.jsx tech-comp logo (not currently used, kept just in case).
window.fileToDataURL = function (file, maxDim = 1600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
