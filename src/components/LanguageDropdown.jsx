import { useState } from 'react';
import { useLang } from '../context/LangContext';

const LANGUAGES = [
  { code: 'CAT', label: 'Català'  },
  { code: 'ESP', label: 'Español' },
  { code: 'ENG', label: 'English' },
];

function FlagCAT() {
  return (
    <span className="flag-wrap" aria-label="Català">
      {['#FCDD09','#DA121A','#FCDD09','#DA121A','#FCDD09','#DA121A','#FCDD09','#DA121A','#FCDD09'].map((c,i) => (
        <span key={i} className="flag-stripe" style={{ background: c, flex: 1 }} />
      ))}
    </span>
  );
}

function FlagESP() {
  return (
    <span className="flag-wrap" aria-label="Español">
      <span className="flag-stripe" style={{ background: '#c60b1e', flex: 1 }} />
      <span className="flag-stripe" style={{ background: '#ffc400', flex: 2 }} />
      <span className="flag-stripe" style={{ background: '#c60b1e', flex: 1 }} />
    </span>
  );
}

function FlagENG() {
  return (
    <span className="flag-wrap" aria-label="English"
      style={{ position: 'relative', background: '#012169', overflow: 'hidden' }}>
      <span style={{ position:'absolute',left:'-10%',top:'45%',width:'120%',height:'10%',background:'#fff',transform:'rotate(32deg)' }} />
      <span style={{ position:'absolute',left:'-10%',top:'45%',width:'120%',height:'10%',background:'#fff',transform:'rotate(-32deg)' }} />
      <span style={{ position:'absolute',left:'-10%',top:'47%',width:'120%',height:'5%',background:'#C8102E',transform:'rotate(32deg)' }} />
      <span style={{ position:'absolute',left:'-10%',top:'47%',width:'120%',height:'5%',background:'#C8102E',transform:'rotate(-32deg)' }} />
      <span style={{ position:'absolute',left:'0',top:'38%',width:'100%',height:'24%',background:'#fff' }} />
      <span style={{ position:'absolute',left:'38%',top:'0',width:'24%',height:'100%',background:'#fff' }} />
      <span style={{ position:'absolute',left:'0',top:'43%',width:'100%',height:'14%',background:'#C8102E' }} />
      <span style={{ position:'absolute',left:'43%',top:'0',width:'14%',height:'100%',background:'#C8102E' }} />
    </span>
  );
}

const FLAGS = { CAT: <FlagCAT />, ESP: <FlagESP />, ENG: <FlagENG /> };

function LanguageDropdown() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  function handleSelect(code) {
    setLang(code);
    setOpen(false);
  }

  return (
    <div className="lang-dropdown">
      <button
        className="lang-btn"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Seleccionar idioma"
        data-component-name="LanguageDropdown"
      >
        {FLAGS[lang]}
        <span className="lang-code">{lang}</span>
        <span className="lang-arrow" data-component-name="LanguageDropdown">
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 290 }} onClick={() => setOpen(false)} />
          <div className="lang-menu" role="menu" aria-label="Idiomes disponibles">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                className={`lang-menu-item${lang === l.code ? ' active' : ''}`}
                onClick={() => handleSelect(l.code)}
                role="menuitem"
              >
                {FLAGS[l.code]}
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LanguageDropdown;
