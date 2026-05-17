import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, AlertCircle, CircleCheckBig, X, Truck, Gauge } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLang } from '../context/LangContext';
import { t } from '../i18n/translations';

const TRUCK_IMG = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&q=80';

function FinishTransport({ user, driverState, setDriverState, onLogout }) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const tx = t[lang];
  const { assignedTruck, assignedTransport } = driverState;

  const [km, setKm] = useState(() => {
    const saved = localStorage.getItem('finish_km');
    return saved ? Number(saved) : 1000;
  });
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('finish_notes');
    return saved || '';
  });
  const [showModal, setShowModal] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [done, setDone] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const errTimer = useRef(null);
  const infoTimer = useRef(null);

  /* ── Notificació informativa en entrar ── */
  useEffect(() => {
    setInfoMsg(tx.finish_info_required || 'Introdueix les dades (Km Reals) per confirmar la finalització del transport.');
    clearTimeout(infoTimer.current);
    infoTimer.current = setTimeout(() => setInfoMsg(''), 15000);
  }, [lang]);

  function showErr(msg) {
    setErrMsg(msg);
    clearTimeout(errTimer.current);
    errTimer.current = setTimeout(() => setErrMsg(''), 4000);
  }

  function handleKmChange(val) {
    const n = Math.max(0, Math.min(5000, Number(val)));
    if (!isNaN(n)) {
      setKm(n);
      localStorage.setItem('finish_km', n);
    }
  }

  function handleRequestConfirm() {
    if (km <= 0) {
      showErr(tx.finish_err_km || "Has d'introduir una distància vàlida (major que 0).");
      return;
    }
    setShowModal(true);
  }

  function handleConfirm() {
    setShowModal(false);
    setShowDoneModal(true);
  }

  function handleDone() {
    localStorage.removeItem('finish_km');
    localStorage.removeItem('finish_notes');
    setDriverState(prev => ({ ...prev, hasTransport: false, assignedTransport: null }));
    navigate('/dashboard');
  }

  /* ── Estat finalitzat ── */
  if (done) {
    return (
      <div className="page-wrapper">
        <Navbar variant="driver" userName={user?.name || 'Conductor'} onLogout={onLogout} />
        <main className="page-content page-content--xl dashboard-main">
          <div className="modal-backdrop" style={{ position: 'static', background: 'none', padding: 0, display: 'block' }}>
            <div className="modal-box" style={{ margin: '4rem auto' }}>
              <p className="modal-title">{tx.finish_done}</p>
              <div className="modal-actions">
                <button className="btn btn--primary" onClick={() => navigate('/dashboard')}>{tx.btn_ok}</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar variant="driver" userName={user?.name || 'Conductor'} onLogout={onLogout} />

      <main className="page-content page-content--xl dashboard-main">

        {/* ── Títol + Enrere ── */}
        <div className="page-title-bar">
          <button className="btn--back" onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ChevronLeft size={15} /> {tx.btn_back}
          </button>
          <h2>{tx.finish_title}</h2>
        </div>

        {/* ── Info camió ── */}
        <section className="truck-info-card" aria-label="Informació del camió">
          <p className="tic-header"><Truck size={20} /> {tx.finish_truck}</p>
          <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="tic-grid" style={{ flex: 1, minWidth: '15rem' }}>
              <div className="info-field">
                <p className="if-label">{tx.field_name}</p>
                <p className="if-value">{assignedTruck?.model || '—'}</p>
              </div>
              <div className="info-field">
                <p className="if-label">{tx.field_dest}</p>
                <p className="if-value">{assignedTransport?.destination || '—'}</p>
              </div>
              <div className="info-field">
                <p className="if-label">{tx.field_weight_max}</p>
                <p className="if-value">{assignedTransport?.weight || '—'}</p>
              </div>
              <div className="info-field">
                <p className="if-label">{tx.field_plate}</p>
                <p className="if-value">{assignedTruck?.plate || '—'}</p>
              </div>
              <div className="info-field">
                <p className="if-label">{tx.field_origin}</p>
                <p className="if-value">{assignedTransport?.origin || '—'}</p>
              </div>
              <div className="info-field">
                <p className="if-label">{tx.field_volume}</p>
                <p className="if-value">{assignedTransport?.volume || '—'}</p>
              </div>
            </div>
            <div className="truck-img-wrap">
              <img src={TRUCK_IMG} alt="Camió assignat" />
            </div>
          </div>
        </section>

        {/* ── Error ── */}
        {errMsg && (
          <div role="alert" style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', marginBottom:'18px', borderRadius:'12px', fontSize:'1.15rem', fontWeight:500, width:'100%', boxSizing:'border-box', border:'1.5px solid #ff5a5a', background:'#fff1f1', color:'#e03030' }}>
            <span style={{display:'flex',alignItems:'center',flexShrink:0}}><AlertCircle size={20} /></span>
            <span style={{flex:1,textAlign:'center'}}>{errMsg}</span>
            <button style={{background:'none',border:'none',cursor:'pointer',fontSize:'18px',color:'#e03030'}} onClick={() => { clearTimeout(errTimer.current); setErrMsg(''); }} aria-label="Tancar">✕</button>
          </div>
        )}

        {/* ── Info: dades requerides ── */}
        {infoMsg && (
          <div className="notification-bar info" role="status" style={{ fontSize: '1.15rem' }}>
            <span className="nb-icon"><Info size={20} /></span>
            <span className="nb-text">{infoMsg}</span>
            <button className="nb-close" onClick={() => { clearTimeout(infoTimer.current); setInfoMsg(''); }} aria-label="Tancar">✕</button>
          </div>
        )}

        {/* ── Km Reals ── */}
        <div className="form-group">
          <label className="range-label" htmlFor="kmNum"><Gauge size={20} /> {tx.finish_km}</label>
          <div className="range-row">
            <input
              type="range"
              id="kmRange"
              min={0}
              max={5000}
              value={km}
              onChange={e => handleKmChange(e.target.value)}
              style={{ "--value": `${(km / 5000) * 100}%` }}
            />
            <div className="range-number-box">
              <input
                type="number" id="kmNum" className="no-spin"
                value={km} min={0} max={5000}
                onChange={e => handleKmChange(e.target.value)}
              />
              <div className="rn-arrows">
                <button type="button" onClick={() => handleKmChange(km + 1)}>▲</button>
                <button type="button" onClick={() => handleKmChange(km - 1)}>▼</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Text incidències ── */}
        <div className="form-group">
          <label className="range-label" htmlFor="incidencies">{tx.finish_incidents}</label>
          <textarea
            className="form-textarea" id="incidencies"
            placeholder={tx.finish_incidents_ph}
            rows={5} value={notes}
            onChange={e => {
              setNotes(e.target.value);
              localStorage.setItem('finish_notes', e.target.value);
            }}
          />
        </div>

        {/* ── Botons ── */}
        <div className="action-buttons">
          <button className="btn--confirm btn--field-shape" onClick={handleRequestConfirm} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CircleCheckBig size={20} /> {tx.finish_confirm}
          </button>
          <button className="btn--cancel-op btn--field-shape" onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <X size={20} /> {tx.finish_cancel}
          </button>
        </div>

      </main>

      {/* ── Modal confirmació ── */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <AlertCircle size={48} color="var(--color-primary)" />
            </div>
            <p className="modal-title">{tx.finish_modal_q}</p>
            <div className="modal-actions">
              <button className="btn--confirm btn--field-shape" onClick={handleConfirm} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CircleCheckBig size={20} /> {tx.modal_yes}
              </button>
              <button className="btn--cancel-op btn--field-shape" onClick={() => setShowModal(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={20} /> {tx.modal_no}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Modal èxit ── */}
      {showDoneModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <CircleCheckBig size={48} color="var(--color-primary)" />
            </div>
            <p className="modal-title">{tx.finish_done}</p>
            <div className="modal-actions">
              <button className="btn--confirm btn--field-shape" onClick={handleDone} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CircleCheckBig size={20} /> {tx.btn_ok}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinishTransport;
