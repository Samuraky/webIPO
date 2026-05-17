import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { t } from '../i18n/translations';

function UserDropdown({ userName, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLang();
  const tx = t[lang];

  function handleEdit() {
    setOpen(false);
    navigate('/edit-profile');
  }

  function handleLogout() {
    setOpen(false);
    if (onLogout) onLogout();
  }

  return (
    <div className="user-dropdown">
      <button className="user-btn" onClick={() => setOpen(o => !o)}
        aria-haspopup="true" aria-expanded={open}>
        <span>{userName}</span>
        <User size={18} aria-hidden="true" />
        <span className="lang-arrow">▾</span>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 290 }} onClick={() => setOpen(false)} />
          <div className="user-menu">
            <button className="user-menu-item" onClick={handleEdit}>
              <Settings size={18} />
              {tx.ud_edit}
            </button>
            <button className="user-menu-item" onClick={handleLogout}>
              <LogOut size={18} />
              {tx.ud_logout}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserDropdown;
