import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Pause, AlertCircle, CheckCircle, CirclePlay, Navigation, MapPin, Calendar, Truck, X, Search, Filter, Package, Scale } from 'lucide-react';
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
    // Demo: dia actual és 15/05/2026
    const today = '15/05/2026';
    return dateStr === today;
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
                <span className="transport-status" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'var(--color-light3)',
                  color: 'var(--color-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}><Pause size={16} />{tx.btn_iniciat || 'Iniciat'}</span>
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

        {/* ── Llistat de transports modern SaaS ── */}
        <div className="transport-list-container" style={{
          marginTop: '28px',
          border: '2px solid #c5c2e0',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'white'
        }}>
          {/* Header amb search i filtres estil SaaS */}
          <div className="transport-list-header" style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '20px 24px',
            background: 'var(--color-light1)',
            borderBottom: '1px solid rgba(123, 119, 255, 0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{
                margin: 0,
                color: 'var(--color-dark)',
                fontSize: '1.15rem',
                fontWeight: 600,
                letterSpacing: '-0.01em'
              }}>{tx.dash_table_title || 'Transports disponibles'}</h3>
              <span style={{
                background: 'var(--color-primary)',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>{allTransports.length}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Search bar modern */}
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Search size={18} style={{
                  position: 'absolute',
                  left: '14px',
                  color: 'var(--color-text-muted)',
                  pointerEvents: 'none'
                }} />
                <input
                  type="text"
                  placeholder={tx.placeholder_search || 'Cercar transports...'}
                  style={{
                    padding: '10px 14px 10px 42px',
                    borderRadius: '10px',
                    border: '1px solid rgba(123, 119, 255, 0.2)',
                    background: 'white',
                    fontSize: '0.95rem',
                    minWidth: '220px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(123, 119, 255, 0.2)'}
                />
              </div>

              {/* Filter button */}
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(123, 119, 255, 0.25)',
                background: 'white',
                color: 'var(--color-dark)',
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <Filter size={18} />
                {tx.btn_filter || 'Filtrar'}
              </button>
            </div>
          </div>

          {/* Taula desktop */}
          <div className="table-desktop" style={{
            display: 'block',
            background: 'white',
            overflow: 'hidden'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              fontSize: '0.95rem'
            }}>
              <thead>
                <tr style={{
                  background: 'var(--color-light1)',
                  borderBottom: '1px solid rgba(123, 119, 255, 0.1)'
                }}>
                  {[
                    { icon: <Calendar size={16} />, label: tx.col_date || 'Data' },
                    { icon: <MapPin size={16} />, label: tx.col_origin || 'Origen' },
                    { icon: <Navigation size={16} />, label: tx.col_dest || 'Destí' },
                    { icon: <Scale size={16} />, label: tx.col_weight || 'Pes' },
                    { icon: <Package size={16} />, label: tx.col_volume || 'Volum' },
                    { icon: null, label: tx.col_assign || 'Acció' }
                  ].map((col, i) => (
                    <th key={i} style={{
                      padding: '16px 24px',
                      textAlign: i === 5 ? 'center' : 'left',
                      fontWeight: 600,
                      color: 'var(--color-dark)',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      borderBottom: '1px solid rgba(123, 119, 255, 0.08)'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: i === 5 ? 'center' : 'flex-start' }}>
                        {col.icon && <span style={{ display: 'flex', alignItems: 'center', opacity: 0.7 }}>{col.icon}</span>}
                        {col.label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageTransports.map((tr, idx) => (
                  <tr key={tr.id} style={{
                    transition: 'background-color 0.15s ease',
                    backgroundColor: idx % 2 === 1 ? 'var(--color-light3)' : 'var(--color-white)',
                    borderBottom: '1px solid rgba(123, 119, 255, 0.06)'
                  }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-light1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 1 ? 'var(--color-light3)' : 'var(--color-white)'}>
                    <td style={{ padding: '20px 24px', color: 'var(--color-dark)', fontWeight: 500 }}>{tr.date}</td>
                    <td style={{ padding: '20px 24px', color: 'var(--color-text)' }}>{tr.origin}</td>
                    <td style={{ padding: '20px 24px', color: 'var(--color-text)' }}>{tr.destination}</td>
                    <td style={{ padding: '20px 24px', color: 'var(--color-text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>{tr.weight.replace(' T', '')}</span>
                      <span style={{ fontSize: '0.85em', marginLeft: '2px' }}>T</span>
                    </td>
                    <td style={{ padding: '20px 24px', color: 'var(--color-text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>{tr.volume.replace(' m³', '')}</span>
                      <span style={{ fontSize: '0.85em', marginLeft: '2px' }}>m³</span>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                      {hasTransport && assignedTransport?.id === tr.id ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'var(--color-light3)',
                          color: 'var(--color-primary)',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}>
                          <Pause size={18} />
                          {tx.btn_iniciat || 'Iniciat'}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRequestAssign(tr)}
                          disabled={!hasTruck}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 18px',
                            borderRadius: '8px',
                            border: !hasTruck ? '1px solid #e5e5e5' : (hasTransport || !isToday(tr.date) ? '1px solid #ccc' : '1px solid var(--color-primary)'),
                            background: !hasTruck ? '#f5f5f5' : (hasTransport || !isToday(tr.date) ? '#fafafa' : 'transparent'),
                            color: !hasTruck ? '#999' : (hasTransport || !isToday(tr.date) ? '#888' : 'var(--color-primary)'),
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: !hasTruck ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!(!hasTruck) && !hasTransport && isToday(tr.date)) {
                              e.target.style.background = 'var(--color-primary)';
                              e.target.style.color = 'white';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!(!hasTruck) && !hasTransport && isToday(tr.date)) {
                              e.target.style.background = 'transparent';
                              e.target.style.color = 'var(--color-primary)';
                            }
                          }}
                        >
                          <Play size={14} />
                          {tx.btn_assign}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards per mòbil */}
          <div className="cards-mobile" style={{
            display: 'none',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            background: '#f8f7ff'
          }}>
            {pageTransports.map((tr) => (
              <div key={tr.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(123, 119, 255, 0.1)',
                boxShadow: '0 2px 8px rgba(123, 119, 255, 0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{tr.date}</span>
                  {hasTransport && assignedTransport?.id === tr.id ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'var(--color-light3)',
                      color: 'var(--color-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      <Pause size={16} />
                      {tx.btn_iniciat || 'Iniciat'}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRequestAssign(tr)}
                      disabled={!hasTruck}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: !hasTruck ? '1px solid #e5e5e5' : (hasTransport || !isToday(tr.date) ? '1px solid #ccc' : '1px solid var(--color-primary)'),
                        background: !hasTruck ? '#f5f5f5' : (hasTransport || !isToday(tr.date) ? '#fafafa' : 'transparent'),
                        color: !hasTruck ? '#999' : (hasTransport || !isToday(tr.date) ? '#888' : 'var(--color-primary)'),
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: !hasTruck ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {tx.btn_assign}
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{tx.col_origin || 'Origen'}</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-dark)', fontWeight: 500 }}>{tr.origin}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{tx.col_dest || 'Destí'}</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-dark)', fontWeight: 500 }}>{tr.destination}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>{tr.weight.replace(' T', '')}</span> T
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>{tr.volume.replace(' m³', '')}</span> m³
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Paginació ── */}
          <nav className="pagination" aria-label="Paginació" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px 24px',
            background: 'var(--color-light1)',
            borderTop: '1px solid rgba(123, 119, 255, 0.12)'
          }}>
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: page === 1 ? '1px solid #e5e5e5' : '2px solid var(--color-primary)',
                background: page === 1 ? '#f5f5f5' : 'var(--color-white)',
                color: page === 1 ? '#999' : 'var(--color-primary)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { if (page !== 1) { e.target.style.background = 'var(--color-light3)'; }}}
              onMouseLeave={(e) => { if (page !== 1) { e.target.style.background = 'var(--color-white)'; }}}
            >
              <ChevronLeft size={16} aria-hidden="true" />
              {tx.prev_page}
            </button>
            <div style={{
              padding: '10px 20px',
              borderRadius: '20px',
              background: 'var(--color-primary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'white',
              boxShadow: '0 2px 8px rgba(87, 87, 153, 0.3)'
            }}>{page}</div>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: page === totalPages ? '1px solid #e5e5e5' : '2px solid var(--color-primary)',
                background: page === totalPages ? '#f5f5f5' : 'var(--color-white)',
                color: page === totalPages ? '#999' : 'var(--color-primary)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { if (page !== totalPages) { e.target.style.background = 'var(--color-light3)'; }}}
              onMouseLeave={(e) => { if (page !== totalPages) { e.target.style.background = 'var(--color-white)'; }}}
            >
              {tx.next_page}
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </nav>
        </div>

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
