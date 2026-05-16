import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Pause, AlertCircle, CheckCircle, Navigation, MapPin, Calendar, Truck, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { trucks, transports as allTransports } from '../data/mockData';
import { useLang } from '../context/LangContext';
import { t } from '../i18n/translations';

const PAGE_SIZE = 8;

const TRUCK_IMG = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=300&q=80';

function DriverDashboard({ user, driverState, setDriverState, onLogout }) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const tx = t[lang];
  const [pendingTransport, setPendingTransport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [errMsg, setErrMsg] = useState('');
  const [okMsg, setOkMsg] = useState(() => {
    const v = sessionStorage.getItem('dash_ok'); 
    sessionStorage.removeItem('dash_ok'); 
    return v || '';
  });
  const errTimer = useRef(null);
  const okTimer = useRef(null);

  function showErr(msg) {
    setErrMsg(msg);
    clearTimeout(errTimer.current);
    errTimer.current = setTimeout(() => setErrMsg(''), 4000);
  }

  function showOk(msg) {
    sessionStorage.setItem('dash_ok', msg);
  }

  useEffect(() => {
    if (okMsg) {
      okTimer.current = setTimeout(() => setOkMsg(''), 4000);
    }
    return () => { clearTimeout(errTimer.current); clearTimeout(okTimer.current); };
  }, []);

  const { hasTruck, hasTransport, assignedTruck, assignedTransport } = driverState;

  /* ── Paginació ── */
  const totalPages = Math.ceil(allTransports.length / PAGE_SIZE);
  const pageTransports = allTransports.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function isToday(dateStr) {
    // Demo: sempre permet assignar (desactivada validació de data real)
    return true;
  }

  function handleToggleTruck() {
    if (!hasTruck) {
      setDriverState(prev => ({ ...prev, hasTruck: true, assignedTruck: trucks[0] }));
    } else {
      setDriverState(prev => ({ ...prev, hasTruck: false, assignedTruck: null, hasTransport: false, assignedTransport: null }));
    }
    setPage(1);
  }

  function handleRequestAssign(transport) {
    if (!hasTruck) { showErr(tx.err_no_truck); return; }
    if (hasTransport) { showErr(tx.err_has_transport); return; }
    if (!isToday(transport.date)) { showErr(tx.err_not_today); return; }
    setPendingTransport(transport);
    setShowModal(true);
  }

  function handleConfirmAssign() {
    const msg = tx.notif_assigned;
    setDriverState(prev => ({ ...prev, hasTransport: true, assignedTransport: pendingTransport }));
    setShowModal(false);
    setPendingTransport(null);
    showOk(msg);
  }

  return (
    <div className="page-wrapper">
      <Navbar variant="driver" userName={user?.name || 'Conductor'} onLogout={onLogout} />

      <main className="page-content page-content--xl dashboard-main">

        {/* ── Selector demo ── */}
        <div className="demo-selector">
          <label>🧪 {tx.dash_demo}</label>
          <button className="btn btn--primary btn--sm" onClick={handleToggleTruck}>
            {hasTruck ? tx.dash_unassign_truck : tx.dash_assign_truck}
          </button>
        </div>

        {/* ── Blocs info ── */}
        <div className="dashboard-info-row">

          {/* Bloc camió */}
          {!hasTruck ? (
            <div className="transport-block" style={{ flex: 1, border: '2px solid #c5c2e0', borderRadius: '14px', padding: '20px 24px', background: 'var(--color-white)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%', height: '100%' }}>
                <p style={{ color: 'var(--color-text-muted)', fontWeight: 700, textAlign: 'center' }}>{tx.dash_no_truck}</p>
              </div>
            </div>
          ) : (
            <div className="truck-card dashboard-truck-card">
              <div className="truck-card-header dashboard-truck-header">
                <div className="truck-card-title dashboard-truck-title">
                  <Truck size={20} />
                  {tx.dash_truck_title}
                </div>
                <span className="dashboard-truck-status-placeholder"></span>
              </div>

              <div className="truck-card-body dashboard-truck-body">
                <img
                  src={TRUCK_IMG}
                  alt={assignedTruck.model}
                  className="truck-image dashboard-truck-img"
                />

                <div className="dashboard-truck-info-box">
                  <div className="dashboard-truck-info-item">
                    <div>
                      <div className="dashboard-truck-label">{tx.field_name}</div>
                      <div className="dashboard-truck-value">{assignedTruck.model}</div>
                    </div>
                  </div>
                  <div className="dashboard-truck-info-item">
                    <div>
                      <div className="dashboard-truck-label">{tx.field_plate}</div>
                      <div className="dashboard-truck-value">{assignedTruck.plate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bloc transport */}
          {!hasTransport ? (
            <div className="transport-block" style={{ flex: 1, border: '2px solid #c5c2e0', borderRadius: '14px', padding: '20px 24px', background: 'var(--color-white)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%', height: '100%' }}>
                <p style={{ color: 'var(--color-text-muted)', fontWeight: 700, textAlign:'center' }}>{tx.dash_no_transport}</p>
              </div>
            </div>
          ) : (
            <div className="transport-assigned-card" style={{ flex: 1 }}>
              <div className="transport-assigned-header">
                <div className="transport-assigned-title">
                  <Navigation size={20} />
                  {tx.dash_transport_title}
                </div>
                <span className="transport-status">{tx.btn_assigned}</span>
              </div>

              <div className="transport-card-body">
                <div className="transport-info-box">
                  <div className="transport-info-item">
                    <MapPin size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    <div>
                      <div className="transport-label">{tx.field_origin}</div>
                      <div className="transport-value">{assignedTransport.origin}</div>
                    </div>
                  </div>
                  <div className="transport-info-item">
                    <MapPin size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    <div>
                      <div className="transport-label">{tx.field_dest}</div>
                      <div className="transport-value">{assignedTransport.destination}</div>
                    </div>
                  </div>
                  <div className="transport-info-item">
                    <Calendar size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    <div>
                      <div className="transport-label">{tx.field_date}</div>
                      <div className="transport-value">{assignedTransport.date}</div>
                    </div>
                  </div>
                </div>

                <div className="transport-actions-box">
                  <button className="btn--confirm btn--field-shape" onClick={() => navigate('/finish-transport')}>
                    <CheckCircle size={20} />
                    {tx.btn_finish}
                  </button>
                  <button className="btn--cancel-op btn--field-shape" onClick={() => navigate('/cancel-transport')}>
                    <X size={20} />
                    {tx.btn_cancel_tr}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Error ── */}
        {errMsg && (
          <div role="alert" style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', marginBottom:'18px', borderRadius:'12px', fontSize:'var(--font-size-lg)', fontWeight:500, width:'100%', boxSizing:'border-box', border:'1.5px solid #ff5a5a', background:'#fff1f1', color:'#e03030' }}>
            <span style={{display:'flex',alignItems:'center',flexShrink:0}}><AlertCircle size={18} /></span>
            <span style={{flex:1,textAlign:'center'}}>{errMsg}</span>
            <button style={{background:'none',border:'none',cursor:'pointer',fontSize:'18px',color:'#e03030'}} onClick={() => { clearTimeout(errTimer.current); setErrMsg(''); }} aria-label="Tancar">✕</button>
          </div>
        )}
        {/* ── Èxit ── */}
        {okMsg && (
          <div role="status" style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', marginBottom:'18px', borderRadius:'12px', fontSize:'var(--font-size-lg)', fontWeight:500, width:'100%', boxSizing:'border-box', border:'1.5px solid var(--color-border)', background:'var(--color-light1)', color:'var(--color-dark)' }}>
            <span style={{display:'flex',alignItems:'center',flexShrink:0}}><CheckCircle size={18} /></span>
            <span style={{flex:1,textAlign:'center'}}>{okMsg}</span>
            <button style={{background:'none',border:'none',cursor:'pointer',fontSize:'18px',color:'var(--color-dark)',opacity:0.6}} onClick={() => { clearTimeout(okTimer.current); setOkMsg(''); }} aria-label="Tancar">✕</button>
          </div>
        )}

        {/* ── Taula ── */}
        <div className="data-table-wrapper">
          <table className="data-table dashboard-table" aria-label="Llista de transports">
            <thead>
              <tr>
                <th>{tx.col_date}</th>
                <th>{tx.col_origin}</th>
                <th>{tx.col_dest}</th>
                <th>{tx.col_weight}</th>
                <th>{tx.col_volume}</th>
                <th>{tx.col_assign}</th>
              </tr>
            </thead>
            <tbody>
              {pageTransports.map((tr, idx) => (
                <tr key={tr.id} className={idx % 2 === 1 ? 'tr-even' : ''}>
                  <td>{tr.date}</td>
                  <td>{tr.origin}</td>
                  <td>{tr.destination}</td>
                  <td>{tr.weight}</td>
                  <td>{tr.volume}</td>
                  <td>
                    {hasTransport && assignedTransport?.id === tr.id ? (
                      <button className="btn--assignar btn--assignar-active btn--field-shape" disabled>
                        <Pause size={16} />
                        {tx.btn_assigned}
                      </button>
                    ) : (
                      <button
                        className={`btn--assignar btn--field-shape${!hasTruck || hasTransport || !isToday(tr.date) ? ' btn--assignar-disabled' : ''}`}
                        disabled={!hasTruck || hasTransport}
                        onClick={() => handleRequestAssign(tr)}
                      >
                        <Play size={16} />
                        {tx.btn_assign}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Paginació ── */}
        <nav className="pagination" aria-label="Paginació">
          <button className="btn--field-shape" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft size={16} aria-hidden="true" />
            {tx.prev_page}
          </button>
          <div className="page-num">{page}</div>
          <button className="btn--field-shape" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            {tx.next_page}
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </nav>

      </main>

      {/* ── Modal assignació ── */}
      {showModal && pendingTransport && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <p className="modal-title">{tx.modal_assign_q}</p>
            <div className="modal-actions">
              <button className="btn--confirm" onClick={handleConfirmAssign}>{tx.modal_yes}</button>
              <button className="btn--cancel" onClick={() => setShowModal(false)}>{tx.modal_no}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverDashboard;
