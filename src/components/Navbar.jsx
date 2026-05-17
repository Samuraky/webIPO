import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import LanguageDropdown from './LanguageDropdown';
import UserDropdown from './UserDropdown';
import logo from '../assets/logo.png';
import { useLang } from '../context/LangContext';
import { t } from '../i18n/translations';

/* Configuració de breadcrumb per ruta */
const BREADCRUMBS = {
  '/login':            [{ label: 'bread_home', to: '/' }],
  '/forgot-password':  [{ label: 'bread_home', to: '/' }, { label: 'bread_login', to: '/login' }],
  '/dashboard':        [{ label: 'bread_home', to: '/' }],
  '/finish-transport': [{ label: 'bread_home', to: '/' }, { label: 'bread_dash', to: '/dashboard' }],
  '/cancel-transport': [{ label: 'bread_home', to: '/' }, { label: 'bread_dash', to: '/dashboard' }],
  '/edit-profile':     [{ label: 'bread_home', to: '/' }, { label: 'bread_dash', to: '/dashboard' }],
};

const PAGE_TITLE = {
  '/login':            'bread_login_title',
  '/forgot-password':  'bread_recover_title',
  '/dashboard':        'bread_dash',
  '/finish-transport': 'bread_finish_title',
  '/cancel-transport': 'bread_cancel_title',
  '/edit-profile':     'bread_edit_title',
};

/* variant: "public" mostra botó Conductor | "driver" mostra UserDropdown */
function Navbar({ variant = 'public', userName = 'Conductor', onLogout }) {
  const location = useLocation();
  const { lang } = useLang();
  const tx = t[lang];

  const crumbs = BREADCRUMBS[location.pathname];
  const titleKey = PAGE_TITLE[location.pathname];

  return (
    <header>
      <nav className="navbar" role="navigation" aria-label="Navegació principal">
        <Link to={variant === 'driver' ? '/dashboard' : '/'} className="navbar-brand" aria-label="Transportalia">
          <img src={logo} alt="Transportalia logo" />
        </Link>

        <div className="navbar-actions">
          <LanguageDropdown />
          {variant === 'public' && (
            <Link to="/login" className="btn-navbar-login">
              {tx.nav_login}
              <User size={18} aria-hidden="true" />
            </Link>
          )}
          {variant === 'driver' && (
            <UserDropdown userName={userName} onLogout={onLogout} />
          )}
          {/* variant 'auth': només dropdown idioma, sense botó login */}
        </div>
      </nav>

      {crumbs && crumbs.length > 0 && (
        <nav className="breadcrumb" aria-label="Navegació">
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <Link to={c.to}>{tx[c.label]}</Link>
              <span className="sep" aria-hidden="true">/</span>
            </span>
          ))}
          {titleKey && <span aria-current="page">{tx[titleKey]}</span>}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
