import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { users } from '../data/mockData';
import { useLang } from '../context/LangContext';
import { t } from '../i18n/translations';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const tx = t[lang];
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [errorKey, setErrorKey] = useState('');
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  function showError(key) {
    setFading(false);
    setErrorKey(key);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFading(true);
      setTimeout(() => setErrorKey(''), 400);
    }, 2500);
  }

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!dni.trim() || !password.trim()) {
      showError('login_err_creds');
      return;
    }
    const user = users.find(
      u => (u.dni === dni || u.email === dni) && u.password === password
    );
    if (!user) {
      showError('login_err_creds');
      return;
    }
    if (user.blocked) {
      showError('login_err_blocked');
      return;
    }
    onLogin(user);
  }

  return (
    <div className="page-wrapper">
      <Navbar variant="auth" />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon" aria-hidden="true">
            <User size={42} />
          </div>
          <h1 className="auth-title">{tx.login_title}</h1>

          {errorKey && (
            <div className={`notification-bar error${fading ? ' nb-fade-out' : ''}`} role="alert">
              <span className="nb-icon"><AlertCircle size={18} /></span>
              <span className="nb-text">{tx[errorKey]}</span>
              <button className="nb-close" onClick={() => { clearTimeout(timerRef.current); setErrorKey(''); }}>✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="dni">{tx.login_dni}</label>
              <div className="input-wrapper">
                <span className="iw-icon"><User size={18} /></span>
                <input id="dni" type="text" placeholder={tx.login_dni_ph}
                  value={dni} onChange={e => setDni(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">{tx.login_pwd}</label>
              <div className="input-wrapper">
                <span className="iw-icon"><Lock size={18} /></span>
                <input id="password" type={showPwd ? 'text' : 'password'}
                  placeholder={tx.login_pwd_ph}
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="iw-toggle" onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn--primary btn--block"
              style={{ marginTop: '24px', height: '52px', fontSize: '18px', fontWeight: 700, borderRadius: '10px' }}>
              {tx.login_btn}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '16px' }}>
            <Link to="/forgot-password">{tx.login_forgot}</Link>
          </p>
          <p style={{ fontSize: '0.78rem', color: '#aaa', textAlign: 'center', marginTop: '0.5rem' }}>
            {tx.login_demo}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
