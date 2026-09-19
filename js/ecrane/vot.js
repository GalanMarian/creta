// Votul. Fiecare dintre cei șapte dă Da / Nu mă supăr / Mai bine nu, pe
// fiecare propunere, grupat pe zile. Id-ul votului e determinist
// (`vot_<propunere>_<om>`), deci al doilea vot al aceluiași om înlocuiește
// primul în loc să se adune.

import { el, frag, capSectiune, eticheta, paine, deschideFereastra, inchideFereastra, avatar, gol } from '../ui.js';
import * as stare from '../stare.js';
import { cineSunt } from '../identitate.js';
import { PERSOANE, TOTI, persoana } from '../date/grup.js';
import { propuneriPeZi } from '../date/itinerariu.js';
import { locul, TIPURI, drumDin } from '../date/locuri.js';
import { RESTAURANTE } from '../date/mancare.js';
import { ACTIVITATI, CATEGORII_ACTIVITATI } from '../date/activitati.js';
import { distantaDeLaBaza } from '../date/coordonate.js';
import { ziuaDePregatit, bazaZilei } from '../lib/itinerar.js';
import { ZILE } from '../date/itinerariu.js';
import { LOCURI, TIPURI as TIPURI_LOC } from '../date/locuri.js';
import { amFost, comutaFost, propuneriProprii as propriiToate, adaugaPropriu, caLoc } from '../amfost.js';
import { clasament, lipsesc, numara as numaraVot, VALORI, ETICHETE } from '../lib/voturi.js';
import { numeZi, durata, plural } from '../lib/format.js';

function idVot(propunere, om) {
  return `vot_${propunere}_${om}`;
}

function voteaza(propunere, valoare) {
  const eu = cineSunt();
  if (!eu) { paine('Alege-ți numele mai întâi, din Setări.', true); return; }

  const id = idVot(propunere, eu);
  const existent = stare.una(id);
  if (existent && existent.valoare === valoare && !existent.sters) {
    stare.seteaza(id, 'vot', { propunere, persoana: eu, valoare: null, sters: true });
    paine('Vot retras');
    return;
  }
  stare.seteaza(id, 'vot', { propunere, persoana: eu, valoare, sters: false });
}

function toateVoturile() {
  return stare.toate('vot');
}

function normalizeaza(id, fel) {
  if (fel === 'activitate') {
    const a = ACTIVITATI.find((x) => x.id === id);
    if (!a) return null;
    const c = CATEGORII_ACTIVITATI[a.categorie];
    return {
      id: a.id, nume: a.nume, subtitlu: a.subtitlu,
      emoji: c.emoji, detaliu: a.deCe, fel: 'activitate',
      durata: a.durata, cost: a.costText, capcane: a.capcane, note: null,
    };
  }
  if (fel === 'propriu') {
    const p = propriiToate().find((x) => x.id === id);
    if (!p) return null;
    const l = caLoc(p);
    return {
      id: l.id, nume: l.nume, subtitlu: l.subtitlu,
      emoji: l.fel === 'activitate' ? '🎯' : '📍', detaliu: l.deCe, fel: 'propriu',
      durata: l.durata, cost: l.costText, note: 'Propunerea noastră',
    };
  }
  if (fel === 'restaurant') {
    const r = RESTAURANTE.find((x) => x.id === id);
    if (!r) return null;
    return {
      id: r.id, nume: r.nume, subtitlu: `${r.tip} · ${r.localitate}`,
      emoji: '🍽️', detaliu: r.deCe, fel: 'restaurant',
      note: r.dinParteaGazdei ? 'Recomandat de gazdă' : null,
    };
  }
  const l = locul(id);
  if (!l) return null;
  return {
    id: l.id, nume: l.nume, subtitlu: l.subtitlu,
    emoji: TIPURI[l.tip].emoji, detaliu: l.deCe, fel: 'loc',
    durata: l.durata, cost: l.costText, capcane: l.capcane, loc: l,
    note: l.cerut ? 'Cerut de grup' : l.ascuns ? 'Mai puțin știut' : null,
  };
}

function butoaneVot(propunereId, rezultat) {
  const eu = cineSunt();
  const alMeu = eu ? rezultat.peOm[eu] : null;

  return el('div', { class: 'segmente', style: 'margin-top:10px' },
    ...VALORI.map((v) => el('button', {
      class: 'segment', type: 'button',
      attrs: { 'aria-pressed': String(alMeu === v) },
      style: alMeu === v
        ? `background:var(--${v === 'da' ? 'verde' : v === 'nu' ? 'rosu' : 'galben'}-slab);color:var(--${v === 'da' ? 'verde' : v === 'nu' ? 'rosu' : 'galben'})`
        : '',
      on: { click: () => voteaza(propunereId, v) },
    }, ETICHETE[v])),
  );
}

function cardPropunere(p, rezultat, baza) {
  const neVotat = lipsesc(toateVoturile(), p.id, TOTI);
  const min = p.loc ? drumDin(p.loc, baza) : null;

  return el('div', { class: 'card', style: 'margin-bottom:9px' },
    el('div', { style: 'display:flex;gap:11px;align-items:flex-start' },
      el('span', { style: 'font-size:21px;flex:none' }, p.emoji),
      el('div', { style: 'flex:1;min-width:0' },
        el('div', { style: 'display:flex;gap:8px;align-items:baseline;flex-wrap:wrap' },
          el('h3', { style: 'font-size:15.5px;font-weight:650' }, p.nume),
          p.note ? eticheta(p.note, 'accent') : null,
        ),
        el('p', { style: 'font-size:12.5px;color:var(--text-slab);margin-top:1px' }, p.subtitlu),
      ),
      el('div', { style: 'text-align:right;flex:none' },
        el('div', { style: `font-size:17px;font-weight:700;color:var(--${rezultat.scor > 0 ? 'verde' : rezultat.scor < 0 ? 'rosu' : 'text-slab'})` },
          rezultat.scor > 0 ? `+${rezultat.scor}` : String(rezultat.scor)),
        el('div', { style: 'font-size:10.5px;color:var(--text-stins)' }, 'scor'),
      ),
    ),

    (p.durata || p.cost || min) ? el('div', { class: 'etichete', style: 'margin-top:9px' },
      min !== null && min !== undefined ? eticheta(min === 0 ? '🚶 pe jos' : `🚗 ${durata(min)}`) : null,
      p.durata ? eticheta(`⏱ ${p.durata}`) : null,
      p.cost ? eticheta(`💶 ${p.cost}`) : null,
    ) : null,

    p.detaliu ? el('details', { class: 'desfa' },
      el('summary', {}, 'De ce, și ce te încurcă'),
      el('div', { class: 'desfa-corp' },
        el('p', {}, p.detaliu),
        p.capcane ? el('p', { style: 'margin-top:8px;color:var(--rosu)' }, p.capcane) : null,
      ),
    ) : null,

    butoaneVot(p.id, rezultat),

    el('div', { style: 'display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap' },
      el('span', { style: 'font-size:12px;color:var(--text-slab)' },
        `${rezultat.da} da · ${rezultat.poate} poate · ${rezultat.nu} nu`),
      el('span', { style: 'flex:1' }),
      el('span', { class: 'avatare' },
        ...PERSOANE.map((om) => {
          const v = rezultat.peOm[om.id];
          const culoare = v === 'da' ? 'var(--verde)' : v === 'poate' ? 'var(--galben)' : v === 'nu' ? 'var(--rosu)' : null;
          return el('span', {
            class: `avatar ${v ? '' : 'avatar-gol'}`,
            attrs: { title: `${om.nume}: ${v ? ETICHETE[v] : 'n-a votat'}` },
            style: culoare ? `background:${culoare};color:#fff` : '',
          }, om.initiale);
        }),
      ),
    ),

    neVotat.length ? el('p', { style: 'margin-top:7px;font-size:11.5px;color:var(--text-stins)' },
      `Nu au votat: ${neVotat.map((id) => persoana(id)?.nume || id).join(', ')}`) : null,

    el('label', {
      class: 'bifa', style: 'margin-top:9px;padding:8px 10px',
      dataset: { bifat: amFost(p.id) ? '1' : '0' },
    },
      el('input', {
        type: 'checkbox', checked: amFost(p.id),
        on: {
          change: (e) => {
            comutaFost(p.id, e.target.checked);
            paine(e.target.checked ? `Bifat: am fost la ${p.nume}` : 'Bifă scoasă');
          },
        },
      }),
      el('span', { class: 'bifa-corp' },
        el('span', { class: 'bifa-text', style: 'font-size:13px' },
          p.fel === 'restaurant' ? 'Am mâncat aici' : p.fel === 'activitate' ? 'Am făcut asta' : 'Am fost aici'),
      ),
    ),
  );
}

function formularPropunere(fel, zi, dupaSalvare) {
  const nume = el('input', { type: 'text', attrs: { placeholder: fel === 'activitate' ? 'Ex. Cursă cu ATV-uri' : 'Ex. Plaja Stavros' } });
  const detaliu = el('textarea', { attrs: { placeholder: 'De ce merită, cât se conduce, cât costă…' } });
  const link = el('input', { type: 'text', attrs: { placeholder: 'https://… (opțional)', autocapitalize: 'none', spellcheck: 'false' } });

  return el('form', {
    on: {
      submit: (e) => {
        e.preventDefault();
        if (!nume.value.trim()) { paine('Scrie un nume.', true); return; }
        if (link.value.trim() && !/^https?:\/\//i.test(link.value.trim())) {
          paine('Legătura trebuie să înceapă cu https://', true); return;
        }
        adaugaPropriu({
          fel,
          nume: nume.value.trim(),
          deCe: detaliu.value.trim(),
          link: link.value.trim(),
          zi: zi || null,
        });
        inchideFereastra();
        paine('Pe listă. Votați-o.');
        if (dupaSalvare) dupaSalvare();
      },
    },
  },
    el('p', { style: 'font-size:13px;color:var(--text-slab);margin-bottom:12px' },
      fel === 'activitate'
        ? 'O activitate pe care ai găsit-o. Apare la toți și se poate vota.'
        : 'Un loc pe care l-ai găsit. Apare la toți și se poate vota.'),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Ce propui'), nume),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Detalii (opțional)'), detaliu),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Legătură (opțional)'), link),
    el('button', { class: 'buton buton-lat', type: 'submit' }, 'Adaugă la vot'),
  );
}

const CATEGORII_VOT = [
  { id: 'locuri', eticheta: '📍 Locuri' },
  { id: 'activitati', eticheta: '🎯 Activități' },
  { id: 'mancare', eticheta: '🍽️ Mâncare' },
];

const RAZA_KM = 50;

let categorie = 'locuri';
let ziAleasa = 'maine';   // 'maine' | 'toate' | o dată anume
let razaPornita = true;

export default function ecranVot() {
  const gazda = el('div', {});
  const ziMaine = ziuaDePregatit(ZILE, new Date());

  function zileDeArat() {
    const toate = propuneriPeZi();
    if (ziAleasa === 'toate') return toate;
    if (ziAleasa === 'maine') return ziMaine ? toate.filter((g) => g.zi.data === ziMaine.data) : toate;
    return toate.filter((g) => g.zi.data === ziAleasa);
  }

  /** Locuri din apropiere care nu sunt deja pe lista zilei. */
  function dinApropiere(zi, deja) {
    // `bazaZilei` vorbește în zone („vest"), coordonatele în locuri („maleme")
    const baza = bazaZilei(zi) === 'est' ? 'amoudara' : 'maleme';
    return LOCURI
      .map((l) => ({ loc: l, km: distantaDeLaBaza(baza, l.id) }))
      .filter((x) => x.km !== null && x.km <= RAZA_KM && !deja.includes(x.loc.id))
      .sort((a, b) => a.km - b.km);
  }

  function deseneaza() {
    const voturi = toateVoturile();
    const bucati = [];

    bucati.push(el('section', { class: 'sectiune' },
      el('div', { style: 'display:grid;gap:8px' },
        el('div', { class: 'segmente' },
          ...CATEGORII_VOT.map((c) => el('button', {
            class: 'segment', type: 'button',
            attrs: { 'aria-pressed': String(categorie === c.id) },
            on: { click: () => { categorie = c.id; deseneaza(); } },
          }, c.eticheta)),
        ),
        el('div', { class: 'segmente segmente-auto' },
          ziMaine ? el('button', {
            class: 'segment', type: 'button',
            attrs: { 'aria-pressed': String(ziAleasa === 'maine') },
            on: { click: () => { ziAleasa = 'maine'; deseneaza(); } },
          }, `☀️ Ziua ${ziMaine.numar}`) : null,
          el('button', {
            class: 'segment', type: 'button',
            attrs: { 'aria-pressed': String(ziAleasa === 'toate') },
            on: { click: () => { ziAleasa = 'toate'; deseneaza(); } },
          }, 'Toate zilele'),
          ...propuneriPeZi().map(({ zi }) => el('button', {
            class: 'segment', type: 'button',
            attrs: { 'aria-pressed': String(ziAleasa === zi.data) },
            on: { click: () => { ziAleasa = zi.data; deseneaza(); } },
          }, `Ziua ${zi.numar} · ${numeZi(zi.data).slice(0, 3)}`)),
        ),
      ),
    ));

    const dateVot = voturi.filter((v) => !v.sters).length;
    bucati.push(el('section', { class: 'sectiune' },
      el('div', { class: 'card card-strans' },
        ziMaine && ziAleasa === 'maine'
          ? el('p', { style: 'font-size:13.5px;font-weight:600;margin-bottom:5px' },
            `Se decide ziua ${ziMaine.numar} — ${numeZi(ziMaine.data)}, ${ziMaine.titlu}. Dormim în ${bazaZilei(ziMaine) === 'est' ? 'Amoudara' : 'Maleme'}.`)
          : null,
        el('p', { style: 'font-size:12.5px;color:var(--text-slab)' },
          'Fiecare votează pe telefonul lui. Apasă din nou pe același răspuns ca să-l retragi. „Da" adună 2, „nu mă supăr" 1, „mai bine nu" scade 2.'),
        el('p', { style: 'font-size:12.5px;color:var(--text-slab);margin-top:5px' },
          dateVot
            ? `${dateVot} ${plural(dateVot, 'vot dat', 'voturi date', 'de voturi date')} până acum.`
            : 'Niciun vot încă.'),
      ),
    ));

    if (categorie === 'activitati') {
      const propuneri = [
        ...ACTIVITATI.map((a) => normalizeaza(a.id, 'activitate')),
        ...propriiToate('activitate').map((p) => normalizeaza(p.id, 'propriu')),
      ].filter(Boolean);

      bucati.push(el('section', { class: 'sectiune' },
        capSectiune('Ce facem', butonPropune('activitate')),
        el('p', { style: 'font-size:12.5px;color:var(--text-slab);margin-bottom:10px' },
          'Activitățile nu țin de o zi anume — se potrivesc oriunde încap.'),
        ...clasament(voturi, propuneri).map(({ propunere, rezultat }) => cardPropunere(propunere, rezultat, 'vest')),
      ));
      gazda.replaceChildren(frag(...bucati));
      return;
    }

    for (const grupZi of zileDeArat()) {
      const zi = grupZi.zi;
      const baza = bazaZilei(zi);

      const proprii = propriiToate('loc')
        .filter((p) => !p.zi || p.zi === zi.data)
        .map((p) => normalizeaza(p.id, 'propriu'));

      const locuri = categorie === 'locuri'
        ? [...grupZi.locuri.map((id) => normalizeaza(id, 'loc')), ...proprii].filter(Boolean)
        : [];
      const restaurante = categorie === 'mancare'
        ? grupZi.restaurante.map((id) => normalizeaza(id, 'restaurant')).filter(Boolean)
        : [];

      const deArat = categorie === 'locuri' ? locuri : restaurante;
      if (!deArat.length) continue;

      bucati.push(el('section', { class: 'sectiune' },
        capSectiune(`Ziua ${zi.numar} · ${numeZi(zi.data)} — ${zi.titlu}`,
          categorie === 'locuri' ? butonPropune('loc', zi.data) : null),
        ...clasament(voturi, deArat).map(({ propunere, rezultat }) => cardPropunere(propunere, rezultat, baza)),
      ));

      // ── ce mai e prin apropiere, dacă nu v-a plăcut nimic de mai sus ──
      if (categorie === 'locuri') {
        const aproape = dinApropiere(zi, grupZi.locuri);
        if (aproape.length) {
          bucati.push(el('section', { class: 'sectiune' },
            el('details', { class: 'card', style: 'padding:0' },
              el('summary', { class: 'sumar-card' },
                `Încă ${aproape.length} locuri la mai puțin de ${RAZA_KM} km de ${baza === 'est' ? 'Amoudara' : 'Maleme'}`,
              ),
              el('div', { style: 'padding:0 13px 13px' },
                el('p', { style: 'font-size:12.5px;color:var(--text-slab);margin-bottom:9px' },
                  'Nu sunt în plan pentru ziua asta, dar sunt aproape. Apasă ca să le pui la vot.'),
                ...aproape.map(({ loc, km }) => el('button', {
                  class: 'rand-card', type: 'button',
                  on: {
                    click: () => {
                      const p = normalizeaza(loc.id, 'loc');
                      deschideFereastra(loc.nume, frag(
                        el('p', { style: 'font-size:13.5px' }, loc.deCe),
                        el('p', { style: 'font-size:12.5px;color:var(--text-slab);margin-top:9px' },
                          `${Math.round(km)} km în linie dreaptă de ${baza === 'est' ? 'Amoudara' : 'Maleme'} · ${loc.durata} · ${loc.costText}`),
                        el('div', { style: 'margin-top:12px' },
                          butoaneVot(p.id, numaraVot(voturi, p.id))),
                      ));
                    },
                  },
                },
                  el('span', { style: 'font-size:19px;flex:none' }, TIPURI_LOC[loc.tip]?.emoji || '📍'),
                  el('span', { class: 'rand-card-corp' },
                    el('span', { class: 'rand-card-titlu' }, loc.nume),
                    el('span', { class: 'rand-card-sub' }, loc.subtitlu),
                  ),
                  el('span', { class: 'rand-card-dreapta' },
                    el('span', { style: 'color:var(--text-slab)' }, `${Math.round(km)} km`)),
                )),
              ),
            ),
          ));
        }
      }
    }

    if (bucati.length <= 2) {
      bucati.push(el('section', { class: 'sectiune' },
        gol('🗳️', 'Nimic de votat aici. Încearcă „Toate zilele" sau altă categorie.')));
    }

    gazda.replaceChildren(frag(...bucati));

    function butonPropune(fel, zi) {
      return el('button', {
        class: 'buton buton-fantoma', type: 'button',
        on: { click: () => deschideFereastra('Propune ceva', formularPropunere(fel, zi, deseneaza)) },
      }, '+ Propune');
    }
  }

  deseneaza();
  return gazda;
}
