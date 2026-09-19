// Pornirea aplicației și routerul.

import { el, goleste, paine, inchideFereastra } from './ui.js';
import * as stare from './stare.js';
import * as identitate from './identitate.js';
import * as secrete from './secrete.js';
import { PERSOANE, ROLURI } from './date/grup.js';
import { ZILE } from './date/itinerariu.js';
import { PLECARE } from './date/zbor.js';
import { ziuaCurenta, moment } from './lib/itinerar.js';
import { numeZi, dataScurta } from './lib/format.js';

import ecranAcasa from './ecrane/acasa.js';
import ecranItinerar from './ecrane/itinerar.js';
import ecranLocuri from './ecrane/locuri.js';
import ecranHarta from './ecrane/harta.js';
import ecranMuzica from './ecrane/muzica.js';
import ecranRezervariNecesare from './ecrane/rezervari-necesare.js';
import ecranVot from './ecrane/vot.js';
import ecranMancare from './ecrane/mancare.js';
import ecranPachet from './ecrane/pachet.js';
import ecranBani from './ecrane/bani.js';
import ecranMasina from './ecrane/masina.js';
import ecranRezervari from './ecrane/rezervari.js';
import ecranSos from './ecrane/sos.js';
import ecranIntrebari from './ecrane/intrebari.js';
import ecranAmintiri from './ecrane/amintiri.js';
import ecranSetari from './ecrane/setari.js';

const ECRANE = {
  acasa: { titlu: 'Creta', randeaza: ecranAcasa },
  itinerar: { titlu: 'Itinerariu', randeaza: ecranItinerar },
  locuri: { titlu: 'Locuri', randeaza: ecranLocuri },
  harta: { titlu: 'Harta', randeaza: ecranHarta },
  vot: { titlu: 'Vot', randeaza: ecranVot },
  mancare: { titlu: 'Mâncare', randeaza: ecranMancare },
  pachet: { titlu: 'Pachet', randeaza: ecranPachet },
  bani: { titlu: 'Bani', randeaza: ecranBani },
  masina: { titlu: 'Mașina', randeaza: ecranMasina },
  rezervari: { titlu: 'Rezervări', randeaza: ecranRezervari },
  'de-rezervat': { titlu: 'De rezervat', randeaza: ecranRezervariNecesare },
  muzica: { titlu: 'Muzică', randeaza: ecranMuzica },
  sos: { titlu: 'Urgențe', randeaza: ecranSos },
  intrebari: { titlu: 'Întrebări', randeaza: ecranIntrebari },
  amintiri: { titlu: 'Amintiri', randeaza: ecranAmintiri },
  setari: { titlu: 'Setări', randeaza: ecranSetari },
};

const NAV_PRINCIPAL = ['acasa', 'itinerar', 'locuri', 'bani'];

let rutaCurenta = 'acasa';

// ─────────────────────────────── router ───────────────────────────────

function rutaDinAdresa() {
  const h = location.hash.replace(/^#\/?/, '').split('/')[0];
  return ECRANE[h] ? h : 'acasa';
}

// Unde era derulată fiecare rută ultima dată.
const derulare = new Map();

function randeaza() {
  const ruta = rutaDinAdresa();
  const aceeasiRuta = ruta === rutaCurenta;
  // O bifă în pachet sau o cheltuială nouă redesenează tot ecranul. Dacă am
  // lăsa pagina să sară în vârf de fiecare dată, bifatul a treizeci de lucruri
  // ar fi un chin. Deci ținem minte unde eram.
  const pozitie = aceeasiRuta ? window.scrollY : 0;

  rutaCurenta = ruta;
  const ecran = ECRANE[ruta];
  const gazda = document.getElementById('continut');

  goleste(gazda);
  try {
    gazda.append(ecran.randeaza());
  } catch (e) {
    console.error('ecranul a picat', e);
    gazda.append(el('div', { class: 'alerta alerta-critic' },
      el('div', { class: 'alerta-titlu' }, 'Ecranul ăsta nu s-a putut afișa'),
      el('p', { class: 'alerta-corp' }, String(e.message || e)),
    ));
  }

  document.getElementById('cap-titlu').textContent = ecran.titlu;
  actualizeazaSubtitlu();
  actualizeazaNav();

  if (aceeasiRuta && pozitie > 0) {
    // după ce browserul a așezat conținutul nou
    requestAnimationFrame(() => window.scrollTo(0, Math.min(pozitie, document.body.scrollHeight)));
  } else {
    derulare.set(ruta, 0);
    window.scrollTo(0, 0);
  }
}

function actualizeazaNav() {
  for (const b of document.querySelectorAll('.nav-buton')) {
    const r = b.dataset.ruta;
    const activ = r === rutaCurenta || (r === 'altele' && !NAV_PRINCIPAL.includes(rutaCurenta));
    if (activ) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  }
}

function actualizeazaSubtitlu() {
  const nod = document.getElementById('cap-sub');
  const acum = new Date();
  const zi = ziuaCurenta(ZILE, acum);

  if (zi) {
    nod.textContent = `Ziua ${zi.numar} din 6 · ${numeZi(zi.data)} · ${zi.titlu}`;
    return;
  }
  const plecare = moment(PLECARE.data, PLECARE.ora);
  if (acum < plecare) {
    // Numărăm zile de calendar, nu durate: la 18 septembrie seara, „mai sunt
    // 2 zile" e derutant când ceasul de pe pagină arată 1 zi și 21 de ore.
    const aziIso = new Date(acum.getTime() + 3 * 3600000).toISOString().slice(0, 10);
    const zileRamase = Math.round(
      (Date.parse(`${PLECARE.data}T00:00:00Z`) - Date.parse(`${aziIso}T00:00:00Z`)) / 86400000,
    );
    if (zileRamase <= 0) nod.textContent = 'Plecăm azi';
    else if (zileRamase === 1) nod.textContent = 'Plecăm mâine';
    else if (zileRamase === 2) nod.textContent = 'Plecăm poimâine';
    else nod.textContent = `Mai sunt ${zileRamase} zile`;
  } else {
    nod.textContent = 'Am fost. 19–24 septembrie 2026';
  }
}

// ─────────────────────────────── bara de sincronizare ───────────────────────────────

function actualizeazaSincronizare() {
  const bara = document.getElementById('bara-sincronizare');
  const s = stare.stareSincronizare();

  const arata = s.stare === 'eroare' || s.stare === 'offline' || s.inCoada > 0;
  bara.hidden = !arata;
  if (!arata) return;

  goleste(bara);
  bara.dataset.stare = s.stare;

  let mesaj;
  if (s.stare === 'offline') {
    mesaj = s.inCoada
      ? `Fără internet · ${s.inCoada} de trimis când revine`
      : 'Fără internet · datele salvate din telefon';
  } else if (s.stare === 'eroare') {
    mesaj = s.eroare || 'Sincronizarea nu merge';
  } else {
    mesaj = `Se trimit ${s.inCoada}…`;
  }

  bara.append(el('span', { class: 'punct' }), el('span', {}, mesaj));
}

// ─────────────────────────────── poarta de identitate ───────────────────────────────

function arataPoarta() {
  const poarta = document.getElementById('poarta');
  const lista = document.getElementById('poarta-lista');
  goleste(lista);

  for (const p of PERSOANE) {
    lista.append(el('button', {
      class: 'poarta-nume', type: 'button',
      on: {
        click: () => {
          identitate.alege(p.id);
          poarta.hidden = true;
          randeaza();
          paine(`Bun venit, ${p.nume}`);
        },
      },
    },
      el('span', { class: 'poarta-nume-cerc' }, p.initiale),
      el('span', { class: 'poarta-nume-text' },
        el('span', {}, p.numeComplet),
        ROLURI[p.id] ? el('span', { class: 'poarta-nume-mic' }, ROLURI[p.id]) : null,
      ),
    ));
  }

  poarta.hidden = false;
}

// ─────────────────────────────── sertar ───────────────────────────────

function porneseteSertar() {
  const sertar = document.getElementById('sertar');
  const deschide = () => {
    sertar.hidden = false;
    document.getElementById('nav-mai-mult').setAttribute('aria-expanded', 'true');
  };
  const inchide = () => {
    sertar.hidden = true;
    document.getElementById('nav-mai-mult').setAttribute('aria-expanded', 'false');
  };

  document.getElementById('nav-mai-mult').addEventListener('click', deschide);
  document.getElementById('buton-meniu').addEventListener('click', deschide);
  sertar.addEventListener('click', (e) => {
    if (e.target.dataset.inchide || e.target.closest('.sertar-item')) inchide();
  });
  document.getElementById('fereastra').addEventListener('click', (e) => {
    if (e.target.dataset.inchide) inchideFereastra();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('fereastra').hidden) inchideFereastra();
    else if (!sertar.hidden) inchide();
  });
  document.getElementById('buton-sos').addEventListener('click', () => {
    location.hash = '#/sos';
  });
}

// ─────────────────────────────── service worker ───────────────────────────────

function inregistreazaServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol === 'file:') return; // nu merge de pe disc
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((e) => {
      console.warn('service worker neînregistrat:', e.message);
    });
  });
}

// ─────────────────────────────── pornire ───────────────────────────────

identitate.porneste();
secrete.porneste();
stare.porneste();
porneseteSertar();
inregistreazaServiceWorker();

let schimbatCatTimpEraDeschisa = false;

stare.laSchimbare(() => {
  actualizeazaSincronizare();
  if (document.getElementById('fereastra').hidden) randeaza();
  else schimbatCatTimpEraDeschisa = true;
});

document.addEventListener('fereastra-inchisa', () => {
  if (!schimbatCatTimpEraDeschisa) return;
  schimbatCatTimpEraDeschisa = false;
  randeaza();
});
identitate.laSchimbare(() => randeaza());
secrete.laSchimbare(() => randeaza());

window.addEventListener('hashchange', randeaza);

if (!identitate.amAles()) arataPoarta();
randeaza();
actualizeazaSincronizare();

// ceasul din numărătoarea inversă, o dată pe secundă, doar când e vizibil
setInterval(() => {
  if (document.hidden) return;
  actualizeazaSubtitlu();
  const ceas = document.querySelector('[data-ceas]');
  if (ceas) ceas.dispatchEvent(new CustomEvent('tic'));
}, 1000);

// dezvoltare: util în consola browserului
window.creta = { stare, identitate, secrete, dataScurta };
