import { useState } from 'react';

const DEMO_ACCOUNT = {
  username: 'raka',
  password: '12345',
  name: 'Raka',
  className: 'Junior A',
  kit: 'TC-007',
};

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Isi nama pengguna dan kata sandi dulu ya.');
      return;
    }

    if (username.trim().toLowerCase() !== DEMO_ACCOUNT.username || password !== DEMO_ACCOUNT.password) {
      setError('Nama pengguna atau kata sandi belum benar. Coba akun demo di bawah.');
      return;
    }

    onLogin(DEMO_ACCOUNT);
  }

  function fillDemo() {
    setUsername(DEMO_ACCOUNT.username);
    setPassword(DEMO_ACCOUNT.password);
    setError('');
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-visual">
          <div className="login-brand">
            <div className="brand-badge big">🤖</div>
            <div>
              <div className="brand-name">TECH-C</div>
              <div className="brand-sub">ROBOT LEARNING PLATFORM</div>
            </div>
          </div>

          <div className="login-robot">🤖</div>
          <div className="login-stars">⭐ 🚀 ⭐</div>
          <h1>Siap jadi Robot Explorer?</h1>
          <p>Belajar → Rakit → Coding → Challenge → Quiz → Hebat! 🎉</p>

          <div className="login-steps">
            <div><span>📖</span><b>Belajar</b><small>Pahami misi</small></div>
            <div><span>🔌</span><b>Rakit</b><small>Pasang alat</small></div>
            <div><span>🧩</span><b>Coding</b><small>Susun blok</small></div>
          </div>
        </div>

        <div className="login-card">
          <div className="login-heading">
            <div className="eyebrow">STUDENT LOGIN</div>
            <h2>Halo, Robot Explorer! 👋</h2>
            <p>Masuk untuk melanjutkan misi belajarmu.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <label>
              <span>Nama pengguna</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Contoh: raka"
                autoComplete="username"
              />
            </label>

            <label>
              <span>Kata sandi</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan kata sandi"
                autoComplete="current-password"
              />
            </label>

            {error && <div className="login-error">⚠️ {error}</div>}

            <button className="btn primary login-submit" type="submit">🚀 Masuk ke LMS</button>
          </form>

          <div className="demo-account">
            <div className="demo-title">🧪 Akun demo Tahap 1</div>
            <div className="demo-row"><span>Username</span><b>raka</b></div>
            <div className="demo-row"><span>Password</span><b>12345</b></div>
            <button type="button" className="btn secondary wide" onClick={fillDemo}>Isi akun demo</button>
          </div>

          <div className="login-note">Tahap 1 menggunakan login demo di browser. Login database Laravel masuk saat backend LMS mulai dibuat.</div>
        </div>
      </section>
    </main>
  );
}
