import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLang } from '../context/LangContext';
import { t } from '../i18n/translations';

const TRUCK_IMG = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&q=80';

function CancelTransport({ user, driverState, setDriverState }) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const tx = t[lang];
  const { assignedTruck, assignedTransport } = driverState;

  const [km, setKm] = useState(1000);
  const [reason, setReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [done, setDone] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const errTimer = useRef(null);

  function showErr(msg) {
    setErrMsg(msg);
    clearTimeout(errTimer.current);
    errTimer.current = setTimeout(() => setErrMsg(''), 4000);
  }

  function handleKmChange(val) {
    const n = Math.max(0, Math.min(5000, Number(val)));
    if (!isNaN(n)) setKm(n);
  }

  function handleConfirm() {
    setShowModal(false);
    setShowDoneModal(true);
  }

  function handleDone() {
    setDriverState(prev => ({ ...prev, hasTransport: false, assignedTransport: null }));
    navigate('/dashboard');
  }

  /* ── Estat cancel·lat ── */
  if (done) {
    return (
      <div className="page-wrapper">
        <Navbar variant="driver" userName={user?.name || 'Conductor'} />
        <main className="page-content page-content--xl dashboard-main">
          <div style={{ maxWidth: '500px', margin: '4rem auto' }}>
            <div className="modal-box">
              <p className="modal-title">{tx.cancel_done}</p>
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
      <Navbar variant="driver" userName={user?.name || 'Conductor'} />

      <main className="page-content page-content--xl dashboard-main">

        {/* ── Títol + Enrere ── */}
        <div className="page-title-bar">
          <button className="btn--back" onClick={() => navigate('/dashboard')}>
            <ChevronLeft size={15} /> {tx.btn_back}
          </button>
          <h2>{tx.cancel_title}</h2>
        </div>

        {/* ── Info camió ── */}
        <section className="truck-info-card" aria-label="Informació del camió">
          <p className="tic-header">{tx.finish_truck}</p>
          <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="tic-grid" style={{ flex: 1, minWidth: '15rem' }}>
              <div className="info-field">
                <p className="if-label">{tx.field_name}</p>
                <p className="if-value">{assignedTruck?.model || '—'}</p>
              </div>
              <div className="info-field">
                <p className="if-label">{tx.field_weight_max}</p>
                <p className="if-value">{assignedTruck?.capacity || '—'}</p>
              </div>
              <div className="info-field">
                <p className="if-label">{tx.field_plate}</p>
                <p className="if-value">{assignedTruck?.plate || '—'}</p>
              </div>
              <div className="info-field">
                <p className="if-label">{tx.field_volume}</p>
                <p className="if-value">{assignedTransport?.volume || '—'}</p>
              </div>
              <div className="info-field">
                <p className="if-label">{tx.field_origin}</p>
                <p className="if-value">{assignedTransport?.origin || '—'}</p>
              </div>
              <div className="info-field">
                <p className="if-label">{tx.field_dest}</p>
                <p className="if-value">{assignedTransport?.destination || '—'}</p>
              </div>
            </div>
            <div className="truck-img-wrap">
              <img src={TRUCK_IMG} alt="Camió assignat" />
            </div>
          </div>
        </section>

        {/* ── Error ── */}
        {errMsg && (
          <div role="alert" style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', marginBottom:'18px', borderRadius:'12px', fontSize:'var(--font-size-lg)', fontWeight:500, width:'100%', boxSizing:'border-box', border:'1.5px solid #ff5a5a', background:'#fff1f1', color:'#e03030' }}>
            <span style={{display:'flex',alignItems:'center',flexShrink:0}}><AlertCircle size={18} /></span>
            <span style={{flex:1,textAlign:'center'}}>{errMsg}</span>
            <button style={{background:'none',border:'none',cursor:'pointer',fontSize:'18px',color:'#e03030'}} onClick={() => { clearTimeout(errTimer.current); setErrMsg(''); }} aria-label="Tancar">✕</button>
          </div>
        )}

        {/* ── Distància ── */}
        <div className="form-group">
          <label className="range-label" htmlFor="kmNum">{tx.cancel_dist}</label>
          <div className="range-row">
            <input
              type="range" id="kmRange"
              min={0} max={5000} value={km}
              onChange={e => handleKmChange(e.target.value)}
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

        {/* ── Motiu ── */}
        <div className="form-group">
          <label className="range-label" htmlFor="motiu">{tx.cancel_reason}</label>
          <textarea
            className="form-textarea" id="motiu"
            placeholder={tx.cancel_reason_ph}
            rows={5} value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </div>

        {/* ── Botons ── */}
        <div className="action-buttons">
          <button className="btn--confirm btn--field-shape" onClick={() => setShowModal(true)}>
            {tx.finish_confirm}
          </button>
          <button className="btn--cancel-op btn--field-shape" onClick={() => navigate('/dashboard')}>
            {tx.finish_cancel}
          </button>
        </div>

      </main>

      {/* ── Modal confirmació ── */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <p className="modal-title">{tx.cancel_modal_q}</p>
            <div className="modal-actions">
              <button className="btn--confirm" onClick={handleConfirm}>{tx.modal_yes}</button>
              <button className="btn--cancel" onClick={() => setShowModal(false)}>{tx.modal_no}</button>
            </div>
          </div>
        </div>
      )}
      {/* ── Modal èxit ── */}
      {showDoneModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <p className="modal-title">{tx.cancel_done}</p>
            <div className="modal-actions">
              <button className="btn--confirm" onClick={handleDone}>{tx.btn_ok}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CancelTransport;
