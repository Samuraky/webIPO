import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, MapPin, Phone, Mail, Lock, Eye, EyeOff, FileImage, AlertCircle, CircleCheckBig, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLang } from '../context/LangContext';
import { t } from '../i18n/translations';

function EditProfile({ user, onUpdateUser, onLogout }) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const tx = t[lang];

  const [form, setForm] = useState({
    address:  user?.address  || '',
    phone:    user?.phone    || '',
    email:    user?.email    || '',
    password: '',
  });
  const [showPwd, setShowPwd]             = useState(false);
  const [photoPreview, setPhotoPreview]   = useState(
    user?.photo || 'https://randomuser.me/api/portraits/men/32.jpg'
  );
  const [carnetPreview, setCarnetPreview] = useState(
    user?.licenseImage || 'https://placehold.co/160x110/F1F1FF/575799?text=Carnet'
  );
  const [showModal, setShowModal]         = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [errorMsg, setErrorMsg]           = useState('');
  const [fadingError, setFadingError]     = useState(false);
  const [tick, setTick]                   = useState(0); // Forçar re-render
  const errorTimer = useRef(null);
  const okTimer = useRef(null);
  const okMsgRef = useRef('');

  useEffect(() => () => {
    clearTimeout(errorTimer.current);
    clearTimeout(okTimer.current);
  }, []);

  function showSuccess(msg) {
    okMsgRef.current = msg;
    setTick(t => t + 1); // Forçar re-render
    clearTimeout(okTimer.current);
    okTimer.current = setTimeout(() => {
      okMsgRef.current = '';
      setTick(t => t + 1); // Forçar re-render
    }, 4500);
  }

  function showError(msg) {
    setFadingError(false);
    setErrorMsg(msg);
    clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => {
      setFadingError(true);
      setTimeout(() => setErrorMsg(''), 400);
    }, 2500);
  }


  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleFileChange(e, setter) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setter(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.address || !form.phone || !form.email) {
      showError(tx.edit_err_missing || 'Falten dades per informar.');
      return;
    }
    setShowModal(true);
  }

  function handleConfirm() {
    setShowModal(false);

    const updatedUser = {
      ...user,
      ...form,
      photo: photoPreview,
      licenseImage: carnetPreview,
    };

    showSuccess(tx.edit_done || 'Dades modificades correctament');

    setTimeout(() => {
      if (onUpdateUser) onUpdateUser(updatedUser);
    }, 4000);
  }
  return (
    <div className="page-wrapper">
      <Navbar variant="driver" userName={user?.name || 'Conductor'} onLogout={onLogout} />

      <main className="page-content" style={{ maxWidth: '42rem', margin: '0 auto', padding: 'var(--sp-6) 1rem' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <button className="btn--back" onClick={() => navigate('/dashboard')}>
            <ChevronLeft size={15} /> {tx.btn_back}
          </button>
        </div>

        <div className="auth-card" style={{ width: '100%', border: '2px solid #c5c2e0' }}>
          <div className="auth-icon" aria-hidden="true"><User size={42} /></div>
          <h1 className="auth-title">{tx.edit_title}</h1>

          {errorMsg && (
            <div className={`notification-bar error${fadingError ? ' nb-fade-out' : ''}`} role="alert" style={{ fontSize: '1.15rem' }}>
              <span className="nb-icon"><User size={20} /></span>
              <span className="nb-text">{errorMsg}</span>
            </div>
          )}

          {okMsgRef.current && (
            <div className="notification-bar info" role="status" style={{ fontSize: '1.15rem' }}>
              <span className="nb-icon"><User size={20} /></span>
              <span className="nb-text">{okMsgRef.current}</span>
            </div>
          )}



          <form onSubmit={handleSubmit} noValidate>

            <div className="form-group">
              <label className="form-label" htmlFor="dni">{tx.edit_dni}</label>
              <div className="input-wrapper input-wrapper--immutable">
                <span className="iw-icon"><User size={18} /></span>
                <input type="text" id="dni" value={user?.dni || '456456N'} disabled />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">{tx.edit_addr}</label>
              <div className="input-wrapper">
                <span className="iw-icon"><MapPin size={18} /></span>
                <input type="text" id="address" autoComplete="street-address" placeholder={tx.edit_addr_ph}
                  value={form.address} onChange={e => handleChange('address', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">{tx.edit_phone}</label>
              <div className="input-wrapper">
                <span className="iw-icon"><Phone size={18} /></span>
                <input type="tel" id="phone" autoComplete="tel" placeholder={tx.edit_phone_ph}
                  value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">{tx.edit_email}</label>
              <div className="input-wrapper">
                <span className="iw-icon"><Mail size={18} /></span>
                <input type="email" id="email" autoComplete="email" placeholder={tx.edit_email_ph}
                  value={form.email} onChange={e => handleChange('email', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">{tx.edit_pwd}</label>
              <div className="input-wrapper">
                <span className="iw-icon"><Lock size={18} /></span>
                <input type={showPwd ? 'text' : 'password'} id="password" autoComplete="new-password"
                  placeholder={tx.edit_pwd_ph}
                  value={form.password} onChange={e => handleChange('password', e.target.value)} />
                <button type="button" className="iw-toggle" onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <p className="form-label">{tx.edit_images}</p>
              <div className="edit-img-row">
                <div className="edit-img-col">
                  <span className="form-label">{tx.edit_photo}</span>
                  <div className="img-upload-area">
                    <img src={photoPreview} alt="Foto del conductor" />
                  </div>
                  <label className="btn--upload">
                    <FileImage size={14} /> {tx.edit_change}
                    <input type="file" accept="image/*" hidden
                      onChange={e => handleFileChange(e, setPhotoPreview)} />
                  </label>
                </div>
                <div className="edit-img-col">
                  <span className="form-label">{tx.edit_carnet}</span>
                  <div className="img-upload-area">
                    <img src={carnetPreview} alt="Carnet de conduir" />
                  </div>
                  <label className="btn--upload">
                    <FileImage size={14} /> {tx.edit_change}
                    <input type="file" accept="image/*" hidden
                      onChange={e => handleFileChange(e, setCarnetPreview)} />
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn--primary btn--block"
              style={{ marginTop: '1rem', height: '52px', fontSize: '1.1rem', fontWeight: 700, borderRadius: '12px' }}>
              {tx.edit_confirm}
            </button>
          </form>
        </div>
      </main>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <AlertCircle size={48} color="var(--color-primary)" />
            </div>
            <p className="modal-title">{tx.edit_modal_q}</p>
            <div className="modal-actions">
              <button type="button" className="btn--confirm btn--field-shape" onClick={handleConfirm} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CircleCheckBig size={20} /> {tx.modal_yes || 'Sí'}
              </button>
              <button type="button" className="btn--cancel-op btn--field-shape" onClick={() => setShowModal(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={20} /> {tx.modal_no || 'No'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDoneModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <CircleCheckBig size={48} color="var(--color-primary)" />
            </div>
            <p className="modal-title">
              {tx.edit_done || 'Dades modificades correctament'}
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn--confirm btn--field-shape"
                onClick={() => setShowDoneModal(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <CircleCheckBig size={20} /> OK
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default EditProfile;
