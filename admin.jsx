// admin.jsx — admin login modal (Supabase email+password) + AdminBar with CV upload.

const { useState: useStateA, useRef: useRefA } = React;

function AdminLoginModal({ open, onClose, onSuccess }) {
  const [email, setEmail] = useStateA('');
  const [password, setPassword] = useStateA('');
  const [error, setError] = useStateA('');
  const [showPw, setShowPw] = useStateA(false);
  const [busy, setBusy] = useStateA(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await window.Store.signIn(email.trim(), password);
      onSuccess();
      setPassword('');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4" onClick={onClose}>
      <div
        className="bg-space-900 border border-space-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-accent-500/10 border border-accent-500/30 flex items-center justify-center text-accent-400">
              <window.Icon.Lock size={16} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">Admin login</h3>
              <p className="text-xs text-space-500">Sign in to edit projects.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-space-500 hover:text-white">
            <window.Icon.X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            autoFocus
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            className="w-full input-field rounded-lg px-4 py-2.5 text-sm"
            placeholder="Email"
            autoComplete="email"
          />

          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full input-field rounded-lg px-4 py-2.5 text-sm pr-10"
              placeholder="Password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-space-500 hover:text-space-300"
              tabIndex={-1}
            >
              {showPw ? <window.Icon.EyeOff size={16} /> : <window.Icon.Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-white text-space-950 font-medium text-sm py-2.5 rounded-lg hover:bg-space-200 transition-colors disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
window.AdminLoginModal = AdminLoginModal;

// Admin bar — shows at top when logged in. Has CV upload + log out.
function AdminBar({ onLogout, onUploadCV, hasCV }) {
  const fileRef = useRefA(null);
  const [busy, setBusy] = useStateA(false);
  const [flash, setFlash] = useStateA(null); // {type:'ok'|'err', text}

  const handlePick = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setFlash({ type: 'err', text: 'Pick a .pdf file.' });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setFlash({ type: 'err', text: 'CV is over 8 MB — compress it first.' });
      return;
    }
    setBusy(true);
    try {
      const ok = await onUploadCV(file);
      if (ok !== false) {
        setFlash({ type: 'ok', text: 'CV uploaded. Visible to visitors.' });
        setTimeout(() => setFlash(null), 3000);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-30 bg-accent-500/10 border-b border-accent-500/30 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between text-xs flex-wrap gap-2">
        <div className="flex items-center gap-2 text-accent-400">
          <window.Icon.Unlock size={12} />
          <span className="font-medium">Admin mode</span>
          <span className="text-space-500 hidden sm:inline">— you can add, edit, archive and delete projects</span>
        </div>
        <div className="flex items-center gap-3">
          {flash && (
            <span className={flash.type === 'ok' ? 'text-green-400' : 'text-red-400'}>
              {flash.text}
            </span>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 text-space-400 hover:text-white disabled:opacity-50"
            title={hasCV ? 'Replace your CV PDF' : 'Upload your CV PDF'}
          >
            <window.Icon.Upload size={12} />
            {busy ? 'Uploading…' : hasCV ? 'Replace CV' : 'Upload CV'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => { handlePick(e.target.files?.[0]); e.target.value = ''; }}
          />
          <button onClick={onLogout} className="text-space-400 hover:text-white">Log out</button>
        </div>
      </div>
    </div>
  );
}
window.AdminBar = AdminBar;
