import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Truck, MapPin, BarChart2, Play } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { t } from '../i18n/translations';

const FEATURE_ICONS = [<Truck size={40} />, <MapPin size={40} />, <BarChart2 size={40} />];
const FEAT_KEYS = [
  ['feat1_title', 'feat1_desc'],
  ['feat2_title', 'feat2_desc'],
  ['feat3_title', 'feat3_desc'],
];

function Home() {
  const { lang } = useLang();
  const tx = t[lang];
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="page-wrapper">
      <Navbar variant="public" />

      {/* ── Hero ── */}
      <section className="hero" aria-label="Presentació">
        <div className="hero-content">
          <h2>{tx.hero_title}</h2>
          <p>{tx.hero_subtitle}</p>
          <button className="hero-play-btn" aria-label={tx.play_video} onClick={() => setShowVideo(true)}>
            <Play size={28} />
          </button>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section" aria-label="Característiques">
        <h3 className="section-title">{tx.feat_section_title}</h3>
        <p className="section-subtitle">{tx.feat_section_subtitle}</p>
        <div className="features-row">
          {FEAT_KEYS.map(([tk, dk], i) => (
            <article key={tk} className="feature-card">
              <div className="fc-icon">{FEATURE_ICONS[i]}</div>
              <div className="fc-title">{tx[tk]}</div>
              <div className="fc-desc">{tx[dk]}</div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Modal vídeo ── */}
      {showVideo && (
        <div className="modal-backdrop" onClick={() => setShowVideo(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ background: '#000', padding: 0, borderRadius: '1rem', maxWidth: '700px', width: '90%', aspectRatio: '16/9', position: 'relative' }}>
            <button
              onClick={() => setShowVideo(false)}
              style={{ position: 'absolute', top: '0.5rem', right: '0.75rem', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', fontSize: '1.25rem', cursor: 'pointer', borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >✕</button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white', fontSize: '1rem', padding: '2rem' }}>
              {tx.video_demo}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
