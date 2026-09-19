// Harta tuturor locurilor.
//
// Leaflet + dalele OpenStreetMap, aduse de pe CDN abia când se deschide ecranul
// ăsta — n-are rost să încarce toată lumea 150 KB de bibliotecă pentru un ecran
// pe care poate nu intră.
//
// Singurul ecran care NU merge offline, și o spune pe față: dalele vin din
// rețea. Restul aplicației rămâne întreagă fără internet.

import { el, frag, eticheta, deschideFereastra, inchideFereastra } from '../ui.js';
import { LOCURI, TIPURI, drumDin } from '../date/locuri.js';
import { PUNCTE, BAZE, distantaDeLaBaza } from '../date/coordonate.js';
import { poza } from '../date/poze-locuri.js';
import { amFost } from '../amfost.js';
import { durata } from '../lib/format.js';

const LEAFLET_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
const LEAFLET_JS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';

let filtru = 'tot';
let leafletPromis = null;

function incarcaLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromis) return leafletPromis;

  leafletPromis = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      document.head.append(el('link', { rel: 'stylesheet', href: LEAFLET_CSS }));
    }
    const s = document.createElement('script');
    s.src = LEAFLET_JS;
    s.async = true;
    s.onload = () => resolve(window.L);
    s.onerror = () => reject(new Error('Nu s-a putut încărca harta.'));
    document.head.append(s);
  });
  return leafletPromis;
}

const CULORI = {
  vest: '#0d6e8f',
  est: '#bd5836',
  centru: '#46765a',
};

function potrivit(loc) {
  if (filtru === 'vest' || filtru === 'est' || filtru === 'centru') return loc.zona === filtru;
  if (filtru === 'top') return !!loc.rang;
  if (filtru === 'nevizitate') return !amFost(loc.id);
  return true;
}

/**
 * Fișa completă a unui loc, deschisă din hartă.
 * Popup-ul Leaflet e mic și incomod pe telefon, deci ținem în el doar strictul
 * necesar și dăm fișa întreagă în fereastra obișnuită a aplicației.
 */
function fisaDinHarta(loc) {
  const p = poza(loc.id);
  const dv = distantaDeLaBaza('maleme', loc.id);
  const de = distantaDeLaBaza('amoudara', loc.id);
  const condusV = drumDin(loc, 'vest');
  const condusE = drumDin(loc, 'est');

  return frag(
    p ? el('figure', { class: 'foto', style: 'margin-bottom:12px' },
      el('img', { src: p.fisier, alt: p.descriere || loc.nume, width: 640, height: 480, loading: 'lazy' }),
      el('figcaption', {},
        el('span', {}, p.descriere),
        el('span', { class: 'foto-credit' },
          `${p.autor} · ${p.licenta} · `,
          el('a', { href: p.sursa, target: '_blank', rel: 'noopener' }, 'Wikimedia')),
      ),
    ) : null,

    el('div', { class: 'etichete', style: 'margin-bottom:12px' },
      eticheta(`${TIPURI[loc.tip].emoji} ${TIPURI[loc.tip].eticheta}`),
      loc.rang ? eticheta(`🏆 Locul ${loc.rang}`, 'teracota') : null,
      loc.cerut ? eticheta('Cerut de grup', 'accent') : null,
      amFost(loc.id) ? eticheta('✓ Am fost', 'verde') : null,
    ),

    el('div', { class: 'date-lista' },
      el('div', { class: 'date-rand' },
        el('span', { class: 'date-cheie' }, 'Din Maleme'),
        el('span', { class: 'date-val' },
          condusV !== null && condusV !== undefined
            ? `${durata(condusV)} cu mașina${dv !== null ? ` · ${Math.round(dv)} km` : ''}`
            : (dv !== null ? `${Math.round(dv)} km în linie dreaptă` : '—')),
      ),
      el('div', { class: 'date-rand' },
        el('span', { class: 'date-cheie' }, 'Din Amoudara'),
        el('span', { class: 'date-val' },
          condusE !== null && condusE !== undefined
            ? `${durata(condusE)} cu mașina${de !== null ? ` · ${Math.round(de)} km` : ''}`
            : (de !== null ? `${Math.round(de)} km în linie dreaptă` : '—')),
      ),
      el('div', { class: 'date-rand' },
        el('span', { class: 'date-cheie' }, 'Cât ține'), el('span', { class: 'date-val' }, loc.durata)),
      el('div', { class: 'date-rand' },
        el('span', { class: 'date-cheie' }, 'Cost'), el('span', { class: 'date-val' }, loc.costText)),
    ),

    el('p', { style: 'margin-top:13px;font-size:14px' }, loc.deCe),
    el('div', { class: 'alerta alerta-atentie', style: 'margin-top:12px' },
      el('div', { class: 'alerta-titlu' }, 'Ce te încurcă'),
      el('div', { class: 'alerta-corp' }, loc.capcane)),

    el('div', { class: 'butoane', style: 'margin-top:14px' },
      loc.harta ? el('a', { href: loc.harta, target: '_blank', rel: 'noopener', class: 'buton buton-slab' }, 'Navighează ↗') : null,
      el('a', {
        href: '#/vot', class: 'buton buton-slab',
        on: { click: inchideFereastra },
      }, 'Votează'),
    ),
  );
}

/** Ce se vede în bula de pe hartă: doar cât să recunoști locul. */
function continutPopup(loc) {
  const p = poza(loc.id);
  const dv = distantaDeLaBaza('maleme', loc.id);
  const de = distantaDeLaBaza('amoudara', loc.id);
  const maiAproape = (dv ?? 1e9) <= (de ?? 1e9)
    ? { km: dv, unde: 'Maleme' } : { km: de, unde: 'Amoudara' };

  return el('div', { class: 'popup' },
    p ? el('img', { src: p.fisier, alt: '', width: 640, height: 480, loading: 'lazy' }) : null,
    el('div', { class: 'popup-titlu' },
      loc.rang ? el('span', { class: 'rang' }, String(loc.rang)) : null,
      loc.nume,
      amFost(loc.id) ? el('span', { class: 'semn-fost' }, '✓') : null,
    ),
    el('div', { class: 'popup-sub' }, loc.subtitlu),
    el('div', { class: 'popup-dist' },
      maiAproape.km !== null ? `${Math.round(maiAproape.km)} km de ${maiAproape.unde} · ${loc.durata}` : loc.durata),
    el('button', {
      class: 'buton buton-mic buton-lat', type: 'button', style: 'margin-top:8px',
      on: { click: () => deschideFereastra(loc.nume, fisaDinHarta(loc)) },
    }, 'Vezi tot'),
  );
}

export default function ecranHarta() {
  const gazda = el('div', {});

  const cutie = el('div', {
    class: 'harta-cutie',
    attrs: { role: 'region', 'aria-label': 'Harta locurilor' },
  }, el('div', { class: 'harta-incarcare' }, 'Se încarcă harta…'));

  const bara = el('div', { class: 'segmente segmente-auto', style: 'margin-bottom:10px' });

  function deseneazaBara(reincarca) {
    bara.replaceChildren(...[
      { id: 'tot', et: 'Tot' },
      { id: 'top', et: '🏆 Topul' },
      { id: 'vest', et: 'Vest' },
      { id: 'est', et: 'Est' },
      { id: 'centru', et: 'Centru' },
      { id: 'nevizitate', et: 'Nevizitate' },
    ].map((f) => el('button', {
      class: 'segment', type: 'button',
      attrs: { 'aria-pressed': String(filtru === f.id) },
      on: { click: () => { filtru = f.id; deseneazaBara(); reincarca(); } },
    }, f.et)));
  }

  gazda.append(
    el('section', { class: 'sectiune' },
      bara,
      cutie,
      el('p', { class: 'harta-nota' },
        'Punctele albastre sunt în vest, cele cărămizii în est, cele verzi în centru. ',
        el('strong', {}, 'Steagurile'), ' sunt cazările noastre și aeroportul. ',
        'Singurul ecran care are nevoie de internet — dalele hărții vin din rețea.'),
    ),
  );

  let harta = null;
  let stratMarkere = null;

  function pune() {
    if (!harta) return;
    if (stratMarkere) stratMarkere.remove();
    stratMarkere = window.L.layerGroup().addTo(harta);

    for (const loc of LOCURI) {
      const c = PUNCTE[loc.id];
      if (!c || !potrivit(loc)) continue;
      const fost = amFost(loc.id);

      const m = window.L.circleMarker(c, {
        radius: loc.rang ? 9 : 7,
        color: '#fff',
        weight: 2,
        fillColor: fost ? '#46765a' : (CULORI[loc.zona] || '#5d6e78'),
        fillOpacity: fost ? 0.55 : 0.95,
      }).addTo(stratMarkere);

      m.bindTooltip(`${loc.rang ? `${loc.rang}. ` : ''}${loc.nume}`, { direction: 'top' });
      m.bindPopup(continutPopup(loc), { maxWidth: 240, minWidth: 200 });
    }

    for (const [, b] of Object.entries(BAZE)) {
      window.L.marker(b.coord, {
        icon: window.L.divIcon({
          className: 'baza-pin',
          html: '<span>⚑</span>',
          iconSize: [26, 26],
          iconAnchor: [13, 24],
        }),
      }).addTo(stratMarkere).bindTooltip(b.nume, { direction: 'top' });
    }
  }

  incarcaLeaflet().then((L) => {
    cutie.replaceChildren();
    harta = L.map(cutie, { scrollWheelZoom: false, attributionControl: true })
      .setView([35.25, 24.9], 8);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: '&copy; contribuitorii <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(harta);

    pune();
    // încadrăm toate punctele vizibile
    const toate = LOCURI.filter((l) => PUNCTE[l.id]).map((l) => PUNCTE[l.id]);
    if (toate.length) harta.fitBounds(L.latLngBounds(toate).pad(0.08));
    setTimeout(() => harta.invalidateSize(), 120);
  }).catch(() => {
    cutie.replaceChildren(el('div', { class: 'harta-incarcare' },
      el('p', {}, '🗺️ Harta nu s-a putut încărca.'),
      el('p', { style: 'font-size:12.5px;color:var(--text-slab);margin-top:6px' },
        'Are nevoie de internet. Lista de locuri merge oricum, și offline.'),
      el('a', { href: '#/locuri', class: 'buton buton-slab buton-mic', style: 'margin-top:10px' },
        'Deschide lista'),
    ));
  });

  deseneazaBara(pune);
  return gazda;
}
