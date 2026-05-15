import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, MapPin, Phone, Mail, Lock, Eye, EyeOff, FileImage } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLang } from '../context/LangContext';
import { t } from '../i18n/translations';

function EditProfile({ user, onUpdateUser }) {
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
  const [photoPreview, setPhotoPreview]   = useState('https://randomuser.me/api/portraits/men/32.jpg');
  const [carnetPreview, setCarnetPreview] = useState('https://via.placeholder.com/160x110/F1F1FF/575799?text=Carnet');
  const [showModal, setShowModal]         = useState(false);
  const [okModal, setOkModal]             = useState(false);
  const [error, setError]                 = useState('');

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
    setShowModal(true);
  }

  function handleConfirm() {
    if (onUpdateUser) onUpdateUser({ ...user, ...form });
    setShowModal(false);
    setOkModal(true);
  }

  return (
    <div className="page-wrapper">
      <Navbar variant="driver" userName={user?.name || 'Conductor'} />

      <main className="page-content" style={{ maxWidth: '35rem' }}>

        <div style={{ marginBottom: '1rem' }}>
          <button className="btn--back" onClick={() => navigate('/dashboard')}>
            <ChevronLeft size={15} /> {tx.btn_back}
          </button>
        </div>

        <div className="auth-card" style={{ maxWidth: '100%', marginTop: 0 }}>
          <div className="auth-icon" aria-hidden="true"><User size={42} /></div>
          <h1 className="auth-title">{tx.edit_title}</h1>

          {error && (
            <div className="notification-bar error" role="alert">
              <span className="nb-icon"><User size={18} /></span>
              <span className="nb-text">{error}</span>
              <button className="nb-close" onClick={() => setError('')}>✕</button>
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
                <input type="text" id="address" placeholder={tx.edit_addr_ph}
                  value={form.address} onChange={e => handleChange('address', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">{tx.edit_phone}</label>
              <div className="input-wrapper">
                <span className="iw-icon"><Phone size={18} /></span>
                <input type="tel" id="phone" placeholder={tx.edit_phone_ph}
                  value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">{tx.edit_email}</label>
              <div className="input-wrapper">
                <span className="iw-icon"><Mail size={18} /></span>
                <input type="email" id="email" placeholder={tx.edit_email_ph}
                  value={form.email} onChange={e => handleChange('email', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">{tx.edit_pwd}</label>
              <div className="input-wrapper">
                <span className="iw-icon"><Lock size={18} /></span>
                <input type={showPwd ? 'text' : 'password'} id="password"
                  placeholder={tx.edit_pwd_ph}
                  value={form.password} onChange={e => handleChange('password', e.target.value)} />
                <button type="button" className="iw-toggle" onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <p className="form-label" style={{ color: 'var(--color-text)' }}>{tx.edit_images}</p>
              <div className="edit-img-row">
                <div className="edit-img-col">
                  <span className="eic-label">{tx.edit_photo}</span>
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
                  <span className="eic-label">{tx.edit_carnet}</span>
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
            <p className="modal-title">{tx.edit_modal_q}</p>
            <div className="modal-actions">
              <button className="btn btn--primary" onClick={handleConfirm}>{tx.modal_yes}</button>
              <button className="btn btn--outline" onClick={() => setShowModal(false)}>{tx.modal_no}</button>
            </div>
          </div>
        </div>
      )}

      {okModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <p className="modal-title">{tx.edit_done}</p>
            <div className="modal-actions">
              <button className="btn btn--primary"
                onClick={() => { setOkModal(false); navigate('/dashboard'); }}>{tx.btn_ok}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
