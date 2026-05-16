import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, CircleCheckBig } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLang } from '../context/LangContext';
import { t } from '../i18n/translations';

function ForgotPassword() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const tx = t[lang];
  const [dni, setDni] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [fading, setFading] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
    if (!dni.trim()) {
      showError('forgot_err');
      return;
    }
    setShowModal(true);
  }

  return (
    <div className="page-wrapper">
      <Navbar variant="auth" />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon" aria-hidden="true">
            <Lock size={42} />
          </div>
          <h1 className="auth-title">{tx.forgot_title}</h1>

          {errorKey && (
            <div className={`notification-bar error${fading ? ' nb-fade-out' : ''}`} role="alert">
              <span className="nb-icon"><AlertCircle size={18} /></span>
              <span className="nb-text">{tx[errorKey]}</span>
              <button className="nb-close" onClick={() => { clearTimeout(timerRef.current); setErrorKey(''); }}>✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="dni">{tx.forgot_dni}</label>
              <div className="input-wrapper">
                <span className="iw-icon"><User size={18} /></span>
                <input
                  id="dni"
                  type="text"
                  placeholder={tx.forgot_dni_ph}
                  value={dni}
                  onChange={e => setDni(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--block"
              style={{ marginTop: 'var(--sp-2)', height: '44px', fontSize: '15px', fontWeight: 700, borderRadius: '10px' }}
            >
              {tx.forgot_send}
            </button>

            <Link
              to="/login"
              className="btn btn--outline btn--block"
              style={{ marginTop: '0.75rem', textDecoration: 'none', height: '44px', fontSize: '15px', fontWeight: 700, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {tx.forgot_cancel}
            </Link>
          </form>
        </div>
      </div>

      {/* Modal OK */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <CircleCheckBig size={48} color="var(--color-primary)" />
            </div>
            <p className="modal-title">{tx.forgot_modal}</p>
            <div className="modal-actions">
              <button
                className="btn--confirm btn--field-shape"
                onClick={() => navigate('/')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <CircleCheckBig size={20} /> {tx.btn_ok}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
